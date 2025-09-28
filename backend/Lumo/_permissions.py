from rest_framework import permissions
from . import models


class IsPrivyUser(permissions.BasePermission):
    """Allow only users with a PrivyProfile."""
    def has_permission(self, request, view):
        return hasattr(request.user, "privy_profile")


class IsMerchantOwner(permissions.BasePermission):
    """Allow only merchant owner (the PrivyProfile who created the merchant)."""
    def has_object_permission(self, request, view, obj):
        # obj can be Merchant, Terminal, Transactions, etc.
        if isinstance(obj, models.Merchant):
            return obj.user.user == request.user  # Merchant → PrivyProfile → User
        if hasattr(obj, "merchant"):  # Terminal, Transactions, etc.
            return obj.merchant.user.user == request.user
        
        if hasattr(obj, "transaction"):  # Payments model
            return obj.transaction.merchant.user.user == request.user
        return False


class IsCustomerSelf(permissions.BasePermission):
    """Allow customers to access their own records or transactions."""
    def has_object_permission(self, request, view, obj):
        # Direct access to Customer object
        if isinstance(obj, models.Customer):
            return obj.user.user == request.user
        # If accessing Transactions
        if hasattr(obj, "customer") and obj.customer:
            return obj.customer.user.user == request.user
        # If accessing Payments
        if hasattr(obj, "sales_orders") and obj.sales_orders:
            return obj.sales_orders.customer.user.user == request.user
        return False


class IsMerchantStaffOrOwner(permissions.BasePermission):
    """Allow only merchant staff or merchant owner to access/modify."""
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not hasattr(user, "privy_profile"):
            return False
        privy_profile = user.privy_profile

        # Merchant owner
        if hasattr(obj, "merchant") and obj.merchant.user == privy_profile:
            return True

        # Check if user is registered staff of the merchant
        return models.MerchantStaff.objects.filter(
            customer__user=privy_profile, merchant=obj.merchant
        ).exists()


class IsStaffOrReadOnly(permissions.BasePermission):
    """Merchant staff or owner can write; others can only read."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
