from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from userauths import serializers as userauths_serializers
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework_simplejwt.exceptions import TokenError,InvalidToken
from rest_framework.permissions import IsAuthenticated,AllowAny
from userauths import models as userauths_models
from django.core.files.storage import default_storage
from rest_framework.parsers import FormParser,MultiPartParser
from core.models import Wallet


class FileUploadView(APIView):
    parser_classes=[FormParser,MultiPartParser]
    permission_classes=[AllowAny]
    authentication_classes=[]

    def post(self,request,*args,**kwargs):
        serializer=userauths_serializers.FileUploadSerializer(data=request.data)

        if serializer.is_valid():
            uploaded_file=serializer.validated_data['file']

            file_name=default_storage.save(uploaded_file.name,uploaded_file)
            file_url=request.build_absolute_uri(default_storage.url(file_name))

            return Response(file_url,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)



# add transaction pin also ----pending
class RegisterView(APIView):
    def post(self, request):
        serializer = userauths_serializers.UserRegistrationSerializer(data=request.data)
        print("coming here 1")

        if serializer.is_valid():
            print("coming here 2")
            user = serializer.save()

            Wallet.objects.create(user=user)

            refresh = RefreshToken.for_user(user)

            response_data = {
                'access': str(refresh.access_token),
                'message': 'User registered and logged in successfully'
            }
            response = Response(response_data, status=status.HTTP_201_CREATED)
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', not settings.DEBUG)
            )
            return response

        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self,request):
        email=request.data.get("email")
        password=request.data.get("password")

        if not email or not password:
            return Response({"error":"Please provide both email and password"},status=status.HTTP_400_BAD_REQUEST)
        
        user=authenticate(username=email,password=password)
        print("user in LoginView is",user)

        if user:
            refresh=RefreshToken.for_user(user)
            response_data={
                'access':str(refresh.access_token)               
            }

            response =Response(response_data,status=status.HTTP_200_OK)
            response.set_cookie(
                key="refresh",
                value=str(refresh),
                httponly=True,
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),  # Cookie lifetime in seconds
                # samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),  # Restrict cross-site sending
                samesite="None",
                secure=True,
                # secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', not settings.DEBUG),  # HTTPS-only in prod
            )

           
           
            return response
        return Response({"error":"Invalid Credentials"},status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self,request):
        refresh_token=request.COOKIES.get("refresh")
        if not refresh_token:
            return Response({"error":"Refresh token not found"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token=RefreshToken(refresh_token)
            
            token.blacklist()
            response=Response({"message":"Logout successfully"},status=status.HTTP_200_OK)
            response.delete_cookie("refresh")

            return response

        except (TokenError,InvalidToken):
            return Response({"error":"Invalid or expired refresh token"},status=status.HTTP_400_BAD_REQUEST)    

        
class UserView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        serializer=userauths_serializers.UserSerializer(request.user)
        print('serializer is',serializer)
        print("request.user is",request.user)

        return Response(serializer.data,status=status.HTTP_200_OK)



class KYCView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        kyc=userauths_models.KYC.objects.get(user=request.user)
        serializer=userauths_serializers.KYCSerializer(kyc)

        return Response(serializer.data,status=status.HTTP_200_OK)


class KYCCreateView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        serializer=userauths_serializers.KYCCreateSerializer(data=request.data,context={"request":request})
        if serializer.is_valid(raise_exception=True):
            kyc=serializer.save()
            print("kyc is ",kyc)
            return Response({
                "message":"KYC Created Successfully",
                "KYC":{
                    "full_name":kyc.full_name,
                    "date_of_birth":kyc.date_of_birth,
                    "id_type":kyc.id_type,
                    "id_image":kyc.id_image,
                    "verification_status":kyc.verification_status,
                    "created_at":kyc.created_at,
                    "updated_at":kyc.updated_at
                }
            },status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)