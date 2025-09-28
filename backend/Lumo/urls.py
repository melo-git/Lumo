from django.urls import path
from . import views

urlpatterns = [
    path('terminal/address-log', views.TerminalQueryView.as_view()),
    path('terminal', views.TerminalView.as_view()),
    path('merchants', views.MerchantView.as_view()),
    path('login', views.privy_login),
    path('terminal/address-query', views.TerminalIPADDR.as_view()),
    path('merchant/<int:pk>', views.MerchantDetailView.as_view()),
    #path('groups/delivery-crew/users', views.DeliveryCrewView.as_view()),
    #path('groups/delivery-crew/users/<int:userId>', views.SingleDeliveryCrewView.as_view()),
    #path('orders', views.OrdersView.as_view),
    #path('orders/<int:pk>', views.SingleOrderView.as_view),

]

