from django.urls import path
from core import views

urlpatterns = [
    path('verify/', views.VerificationAPIView.as_view()),
    path('beneficiaries/add/', views.BeneficairyCreateAPIView.as_view(), name='beneficiary-create'),
    path('beneficiaries/',views.BeneficiariesListAPIView.as_view()),
    path('beneficiaries/<int:pk>/',views.BeneficiaryDeleteAPIView.as_view(),name='beneficiary-delete'),
    path('wallet/<str:wallet_id>/',views.WalletDetails.as_view()),
    path('transfer/',views.TransferFundsView.as_view()),
    path("transactions/",views.TransactionListAPIView.as_view()),
    path("transactions/<uuid:reference>/",views.TransactionDetailAPIView.as_view()),   
    path("savings-goals/create/",views.CreateSavingsGoalView.as_view()), 
    path("savings-goals/",views.SavingsGoalListAPIView.as_view()), 
    path("savings-goals/<uuid:uuid>/",views.SavingGoalDetailAPIView.as_view()), 
    path("savings-goals/deposit/",views.DepositeToSavingsGoalView.as_view()), 
    path("savings-goals/withdraw/",views.WithdrawFromSavingsGoalView.as_view()), 

    path("notifications/",views.NotificationListAPIView.as_view(),name='notifications-list'),
    path('notifications/<int:pk>/read/',views.NotificationMarkReadAPIView.as_view(),name='notification-read'),
    path('notifications/read-all/',views.NotificationMarkAllReadAPIView.as_view(),name='notifications-read-all'),
    path("overview/",views.OverviewAPIView.as_view()),
    
               

]
