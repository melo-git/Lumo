from rest_framework import generics, status, filters
from rest_framework.authtoken.models import Token as DRFToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import PrivyProfile, Wallet
from rest_framework import permissions 
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS
from . import models
from django.contrib.auth.models import User, Group
from . import serializers
import jwt, requests
from django.utils.timezone import now
from datetime import datetime
from . import _permissions


import dotenv

env = dotenv.dotenv_values('.env')


app_id = env['PRIVY_APP_ID']

app_secret = env['PRIVY_APP_SECRET']

JWKS = f'https://auth.privy.io/api/v1/apps/{app_id}/jwks.json'


# endpoint: terminal/address-log
class TerminalQueryView(generics.CreateAPIView, generics.UpdateAPIView):
    serializer_class = serializers.TerminalQuerySerializer  # ensure this matches your serializer

    def create(self, request, *args, **kwargs):
        device_serial_id = request.data.get("device_serial_id")
        ip_addr = request.data.get("ip_addr_used")
        user_agent = request.data.get("user_agent")

        if not device_serial_id:
            return Response(
                {"message": "device_serial_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Optimized: only fetch the terminal id
        _terminal = models.Terminal.objects.filter(
            device_serial_id=str(device_serial_id)
        ).only("device_serial_id").first()

        if not _terminal:
            return Response(
                {"message": f"No terminal with device_serial_id {device_serial_id}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        today = now().date()

        # ✅ Optimized: check existence directly with terminal.id
        exists = models.TerminalQuery.objects.filter(
            terminal= _terminal,
            date=today
        ).only("pk").exists()

        #if exists:
            #return Response(
                #{"message": "IP address already logged today"},
                #status=status.HTTP_200_OK
            #)

        terminal_query = models.TerminalQuery.objects.create(
            terminal= _terminal,
            ip_addr_used=ip_addr,
            date=today,
            user_agent=user_agent
        )

        return Response(
            {"message": "IP address registered", "id": terminal_query.pk},
            status=status.HTTP_201_CREATED
        )
    

class TerminalIPADDR(generics.ListAPIView):
    serializer_class = serializers.TerminalQuerySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        merchant_id = self.request.query_params.get("merchant_id")
        date = datetime.fromisoformat(self.request.query_params.get("date"))

        merchant = models.Merchant.objects.get(pk=merchant_id)

        # Find terminal for this merchant
        terminal = models.Terminal.objects.filter(merchant=merchant).only('pk').first()
        if not terminal:
            return models.TerminalQuery.objects.none()

        queryset = models.TerminalQuery.objects.filter(terminal=terminal)

        if date:
            queryset = queryset.filter(date=date)

        return queryset.select_related("terminal")






@api_view(["POST"])
def privy_login(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "Missing token"}, status=400)

    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(
            token,
            options={"verify_aud": False},
            key=jwt.PyJWKClient(JWKS).get_signing_key_from_jwt(token).key,
            algorithms=['ES256']
        )
    except Exception as e:
        return JsonResponse({"error": f"Invalid token: {str(e)}"}, status=401)

    # Extract user info from Privy JWT
    privy_id = decoded.get("sub")  # permanent ID
    #wallet_address = request.data.get("wallet_address")

    # 1. Get or create Django User
    user, user_created = User.objects.get_or_create(
        username=privy_id,
        defaults={"email": ""}
    )

    if user_created:
        user.set_unusable_password()  # disable password login
        user.save()

    # 2. Get or create PrivyProfile
    profile, profile_created = PrivyProfile.objects.get_or_create(
        user=user,
        defaults={
            "privy_id": privy_id,
            "display_name":f"lumo-{privy_id.split(":")[-1]}"
        }
    )



    

    if user_created or profile_created:
        user_type = "new"
    else:
        if models.Merchant.objects.filter(user=profile).exists():
            user_type = "Merchant"
        elif models.Customer.objects.filter(user=profile).exists():
            user_type = "User"
        else:
            # profile exists but no Merchant/Customer associated -> treat as new
            user_type = "new"

    # 5. Create/return backend auth token (DRF Token auth)
    backend_token, _ = DRFToken.objects.get_or_create(user=user)

    # 6. Return structured response (same fields + user_type)
    return JsonResponse({
        "user_id": profile.pk,
        "display_name": profile.display_name,
        "auth_token": backend_token.key,
        "user_type": user_type,
    })




# endpoint: merchant/
class MerchantView(generics.CreateAPIView):
    #queryset = models.Merchant.objects.all()
    serializer_class = serializers.MerchantSerializer
    permission_classes = [_permissions.IsMerchantOwner]

    def get_queryset(self):
        # Optimize query: fetch Merchant + related PrivyProfile (user) in one go
        return models.Merchant.objects.select_related("user")



class MerchantDetailView(generics.RetrieveUpdateAPIView):
    #queryset = models.Merchant.objects.all()
    serializer_class = serializers.MerchantSerializer
    permission_classes = [IsAuthenticated, _permissions.IsMerchantOwner | permissions.IsAdminUser]

    def get_queryset(self):
        # Optimize query: fetch Merchant + related PrivyProfile (user) in one go
        return models.Merchant.objects.select_related("user")



class CustomerView(generics.CreateAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer
    permission_classes = [_permissions.IsPrivyUser]  # Users with privy profile becomes customers if they select ht option from the frontend
    def get_queryset(self):
        # Optimize query: fetch Merchant + related PrivyProfile (user) in one go
        return models.Customer.objects.select_related("user")



class CustomerDetailView(generics.RetrieveUpdateAPIView):
    #queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer
    permission_classes = [_permissions.IsCustomerSelf]
    def get_queryset(self):
        # Optimize query: fetch Customer + related PrivyProfile (user) in one go
        return models.Customer.objects.select_related("user")
    

class TerminalView(generics.ListCreateAPIView):
    serializer_class = serializers.TerminalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only show terminals owned by the current merchant
        return (
            models.Terminal.objects
            .select_related("merchant")
            .filter(merchant__user=self.request.user)  # restrict by logged-in user
        )

class TerminalDetailView(generics.RetrieveUpdateAPIView):
    #queryset = Terminal.objects.all()
    serializer_class = serializers.TerminalSerializer
    permission_classes = [
        _permissions.IsMerchantOwner, 
        #_permissions.IsStaffOrReadOnly #to be enabled later
        ]

    def get_queryset(self):
        return (
            models.Terminal.objects
            .select_related("merchant")
            .filter(merchant__user=self.request.user)  # restrict by logged-in user
        )





class ProductsView(generics.ListCreateAPIView):
    #queryset = models.Products.objects.all()
    serializer_class = serializers.ProductSerializer
    permission_classes = [_permissions.IsMerchantOwner, _permissions.IsMerchantStaffOrOwner]

    def get_queryset(self):
        return (
            models.Terminal.objects
            .select_related("merchant")
            .filter(merchant__user=self.request.user)  # restrict by logged-in user
        )


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    #queryset = models.Products.objects.all()
    serializer_class = serializers.ProductSerializer
    permission_classes = [_permissions.IsMerchantOwner, _permissions.IsMerchantStaffOrOwner]
    def get_queryset(self):
        return (
            models.Terminal.objects
            .select_related("merchant")
            .filter(merchant__user=self.request.user)  # restrict by logged-in user
        )




class TransactionView(generics.ListCreateAPIView):
    queryset = models.Transactions.objects.select_related(
        "merchant", "terminal", "customer", "wallet"
    )
    permission_classes = [_permissions.IsCustomerSelf, _permissions.IsMerchantStaffOrOwner]

    def get_serializer_class(self):
        user = self.request.user
        # If user is a merchant → show full details
        if hasattr(user, "privy_profile") and models.Merchant.objects.filter(user=user.privy_profile).exists():
            return serializers.TransactionMerchantSerializer
        # Else → treat as customer
        return serializers.TransactionCustomerSerializer

    def perform_create(self, serializer):
        """Ensure only merchants can create transactions"""
        user = self.request.user

        if not hasattr(user, "privy_profile"):
            raise PermissionDenied("Only merchants can create transactions.")

        # Check if the PrivyProfile is linked to a Merchant
        merchant = models.Merchant.objects.filter(user=user.privy_profile).first()
        if not merchant:
            raise PermissionDenied("Only merchants can create transactions.")

        # Save transaction with the merchant attached
        serializer.save(merchant=merchant)



class TransactionDetailView(generics.RetrieveAPIView):
    queryset = models.Transactions.objects.select_related(
        "merchant", "terminal", "customer", "wallet"
    )
    permission_classes = [
        _permissions.IsMerchantOwner | _permissions.IsCustomerSelf
    ]

    def get_serializer_class(self):
        user = self.request.user
        if hasattr(user, "privyprofile") and hasattr(user.privyprofile, "merchant"):
            return serializers.TransactionMerchantSerializer
        return serializers.TransactionCustomerSerializer



class PaymentMerchantView(generics.ListCreateAPIView, generics.UpdateAPIView):
    queryset = models.Payments.objects.all()
    serializer_class = serializers.PaymentSerializer
    permission_classes = [_permissions.IsMerchantOwner, _permissions.IsMerchantStaffOrOwner]  # system in real case


class PaymentDetailView(generics.RetrieveAPIView):
    queryset = models.Payments.objects.all()
    serializer_class = serializers.PaymentSerializer
    permission_classes = [_permissions.IsMerchantOwner | _permissions.IsCustomerSelf]

