from rest_framework import serializers
from . import models
from django.contrib.auth.models import User



class PrivySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Customer
        fields = ['id', 'display_name', 'email', 'phone_number', 'created_at',]





class TransactionCustomerSerializer(serializers.ModelSerializer):
    """For customers: hide terminal field"""
    class Meta:
        model = models.Transactions
        exclude = ["terminal"]  # customers cannot see terminal





class TransactionMerchantSerializer(serializers.ModelSerializer):
    """For merchants: full transaction details"""
    class Meta:
        model = models.Transactions
        fields = "__all__"





class CustomerSerializer(serializers.ModelSerializer):
    user = PrivySerializer()
    class Meta:
        model = models.Customer
        fields = ['user' 'full_name', 'display_name', 'status']


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Merchant
        fields = "__all__"
        read_only_fields = ["user"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user.privy_profile
        return super().create(validated_data)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Products
        fields = [
        
            'merchant',
            'name',
            'image_url',
            'description',
            'base_price',
            'base_currency',
            'created_at',
            'status'
        ]


class InventorySerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = models.Inventory
        fields = ['product', 'current_quantity']
        read_only_fields = ['current_quantity']


class InventoryMovementSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = models.InventoryMovement
        fields = [
            
            'product',
            'change_amount',
            'reason',
            'date_time',
            'staff'
        ]
        #read_only_fields = ['id', 'date_time']


class TerminalSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Terminal
        fields = [
            'merchant',
            'device_serial_id',
            'model_type',
            'registration_date',
            'status'
        ]
        #read_only_fields = ['device_serial_id', 'model_type', 'registration_date', 'status']


class TerminalQuerySerializer(serializers.ModelSerializer):
    terminal = serializers.StringRelatedField()
    #device_serial_id = TerminalSerializer()

    class Meta:
        model = models.TerminalQuery
        fields = ['ip_addr_used', 'date', 'user_agent', 'terminal']
        #read_only_fields = ['ip_addr_used', 'date', 'user_agent']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Payments
        fields = [
            
            'transaction',
            'wallet',
            'token_type',
            'token_amount',
            'exchange_rate_token_usd',
            'amount_usd',
            'exchange_rate_usd_local_currency',
            'amount_local_currency',
            'status'
        ]




class SalesOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.SalesOrders
        fields = [
        
            'product',
            'customer',
            'status',
            'quantity',
            'unit_price',
            'subtotal',
        ]
