from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class PrivyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="privy_profile")
    privy_id = models.CharField(max_length=255, unique=True)  # permanent Privy ID (JWT "sub")
    display_name = models.CharField(max_length=255, unique=True)
    #login_method = models.CharField(max_length=50, blank=True, null=True)  # e.g. "wallet", "email", "sms"
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PrivyProfile({self.privy_id})"


class Merchant(models.Model):
    user = models.ForeignKey(PrivyProfile, on_delete=models.CASCADE)
    business_name = models.TextField()
    location = models.TextField(max_length=200)
    phone = models.CharField(max_length=20, blank=True, null=True) #phone number
    #business_category = models.CharField(max_length=200, db_index=True)
    email = models.EmailField(null=True)
    registration_date = models.DateField(auto_now=True, db_index=True)
    status = models.CharField(max_length=8)


class Customer(models.Model):
    user = models.ForeignKey(PrivyProfile, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200, null=True)
    display_name = models.CharField(max_length=100, unique=True, db_index=True)  
    status = models.CharField(
        max_length=20,
        choices=[("active", "Active"), ("inactive", "Inactive")], 
        default="active"
        )




class MerchantStaff(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    role = models.CharField(max_length=50) # Owner, manager, cashier




class Products(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, db_index=True)
    image_url = models.URLField(default='/static')
    description = models.TextField(null=True)
    base_price = models.DecimalField(max_digits=6, decimal_places=2)
    base_currency = models.CharField(max_length=5)
    created_at = models.DateField()
    status = models.CharField(max_length=8) # Instock| Out of stock

    def __str__(self):
        return self.name




class ProductPriceHistory(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    old_price = models.DecimalField(max_digits=6, decimal_places=2)
    new_price = models.DecimalField(max_digits=6, decimal_places=2)
    changed_at = models.DateTimeField()
    changed_by = models.ForeignKey(MerchantStaff, on_delete=models.CASCADE)





class Inventory(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    current_quantity = models.IntegerField()




class InventoryMovement(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    change_amount = models.IntegerField()
    reason = models.CharField(max_length=100) # Restock, sale, adjustment, writre-off
    date_time = models.DateTimeField()
    staff = models.ForeignKey(MerchantStaff, on_delete=models.CASCADE)

    def __str__(self):
        return self.product





#Merchants register their terminal(s)
class Terminal (models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    device_serial_id = models.CharField(max_length=100, primary_key=True, db_index=True)
    model_type = models.CharField(max_length=100, null=True) # Null for now
    registration_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=8, default='Active')

    def __str__(self):
        return self.device_serial_id


class TerminalQuery(models.Model):
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE)
    ip_addr_used = models.GenericIPAddressField()
    date = models.DateField(db_index=True)
    user_agent = models.TextField()

    def __str__(self):
        return self.terminal




class Wallet(models.Model):
    profile = models.ForeignKey(PrivyProfile, on_delete=models.CASCADE, null=True, related_name="wallets")
    address = models.CharField(max_length=255)   # e.g. "0x1234..."
    #type = models.CharField(
        ##max_length=50,
        #choices=[
        #    ("embedded", "Embedded Wallet"),
        #    ("external", "External Wallet"),)
    name = models.CharField(max_length=255, null=True)
    #wallet_type = models.CharField(max_length=15) # Wallet_type is either merchant or customer(registered or anonymous)
    merchant_id = models.ForeignKey(Merchant, null=True, on_delete=models.CASCADE)
    customer_id = models.ForeignKey(Customer, null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("profile", "address")

    def __str__(self):
        return f"{self.type} wallet {self.address}"


# To record paid or unpaid orders the moment it occurs
class SalesOrders(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    status = models.CharField(max_length=10) # Paid/Unpaid
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    subtotal  = models.DecimalField(max_digits=6, decimal_places=2)

    

class Transactions(models.Model):
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, null=True)
    total_amount = models.DecimalField(max_digits=6, decimal_places=2)
    reference = models.CharField(max_length=100)
    message = models.CharField(max_length=100, null=True)
    date_time = models.DateTimeField(db_index=True)
    status = models.CharField(max_length=10) #Confirmed|Pending|failed



#class TransactionLineItem(models.Model):
    #transaction = models.ForeignKey(Transactions, on_delete=models.CASCADE)
    #sales_orders = models.ForeignKey(SalesOrders, on_delete=models.CASCADE)
    

#View will be *ListCreateUpdate
class Payments(models.Model):
    transaction = models.ForeignKey(Transactions, on_delete=models.CASCADE)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    sales_orders = models.ForeignKey(SalesOrders, on_delete=models.CASCADE, null=True)
    token_type = models.CharField(max_length=100)
    token_amount = models.DecimalField(max_digits=6, decimal_places=2)
    exchange_rate_token_usd = models.DecimalField(max_digits=6, decimal_places=2) # computed at tx
    amount_usd = models.DecimalField(max_digits=6, decimal_places=2)
    exchange_rate_usd_local_currency = models.DecimalField(max_digits=6, decimal_places=2) # computed at tx
    amount_local_currency = models.DecimalField(max_digits=6, decimal_places=2)
    status = models.CharField(max_length=10) # Pending, confirmed, failed











