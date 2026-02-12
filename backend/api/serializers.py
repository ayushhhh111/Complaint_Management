from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
import django.contrib.auth.password_validation as validators
from django.core import exceptions
from .models import Complaint
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import AdminUser
from django.contrib.auth.hashers import make_password
from .models import UserProfile
from django.contrib.auth.password_validation import validate_password
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('phone_number', 'address', 'profile_img')

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with this email already exists.")]
    )
    
    # Nest the profile fields here
    profile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_staff', 'profile')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        # Extract profile data from the validated data
        profile_data = validated_data.pop('profile', None)
        
        # Create the User using the logic from your current code
        if validated_data.get('is_staff'):
            user = User.objects.create_superuser(**validated_data)
        else:
            user = User.objects.create_user(**validated_data)
        
        # Create the associated UserProfile
        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        else:
            # Create an empty profile if no data was provided
            UserProfile.objects.create(user=user)
            
        return user
class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['id', 'user', 'title', 'description','department', 'status', 'is_urgent', 'image', 'created_at']
        read_only_fields = ['user']
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add custom data to the response
        data['is_staff'] = self.user.is_staff
        return data
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'admin_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'admin_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
residentName = serializers.ReadOnlyField(source='user.username')
createdAt = serializers.DateTimeField(source='created_at', read_only=True)
class Meta:
        model = Complaint
        # Ensure all these fields match your React frontend types
        fields = ['id', 'title', 'description', 'status', 'created_at', 'residentName', 'priority', 'category']