from rest_framework import serializers
from .models import User,KYC
from django.utils import timezone

class FileUploadSerializer(serializers.Serializer):
    file =serializers.FileField(max_length=1000)

    class Meta:
        fields=['file']


class UserRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'transaction_pin']
        extra_kwargs = {
            'password': {'write_only': True},
            'transaction_pin': {'write_only': True}
        }

    def validate_transaction_pin(self, value):
        if not value.isdigit() or len(value) != 4:
            raise serializers.ValidationError("Transaction PIN must be exactly 4 digits.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        transaction_pin = validated_data['transaction_pin']
        local_part = email.split('@')[0]

        user = User.objects.create_user(
            username=local_part,
            email=email,
            password=password,
            transaction_pin=transaction_pin
        )
        return user

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model=User
        fields=["id","email","username"]


class KYCSerializer(serializers.ModelSerializer):
    class Meta:
        model=KYC
        fields="__all__"


class KYCCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=KYC
        fields=['full_name','date_of_birth','id_type','id_image']
        read_only_fields=[]

    def validate_date_of_birth(self,value):
        if value >= timezone.now().date():
            raise serializers.ValidationError("Date of birth must be in the past")
        return value
    def validate_full_name(self,value):
        if len(value.strip())<3:
            raise serializers.ValidationError("Full name looks too short")
        return value
    def create(self,validated_data):
        user=self.context['request'].user

        if hasattr(user,'kyc_profile'):
            print("coming in hasattr")
            raise serializers.ValidationError("You already submitted KYC,please contact support")
        return KYC.objects.create(user=user,**validated_data)
    


