from django.urls import path
from . import views

urlpatterns=[
     path('upload/',views.FileUploadView.as_view()),
    path('auth/register/',views.RegisterView.as_view()),
    path('auth/login/',views.LoginView.as_view(),name='login'),
    path('auth/logout/',views.LogoutView.as_view(),name='logout'),
    path('profile/',views.UserView.as_view(),name='user'),
     path('kyc-profile/',views.KYCView.as_view()),
    path('kyc/',views.KYCCreateView.as_view()),
]