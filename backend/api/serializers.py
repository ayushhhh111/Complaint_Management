from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
import django.contrib.auth.password_validation as validators
from django.core import exceptions
from .models import Complaint, Worker
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
class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = ['id', 'worker_name', 'worker_id','phone_no', 'role']
class ComplaintSerializer(serializers.ModelSerializer):
    residentName = serializers.CharField(source='user.username', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    assigned_worker = WorkerSerializer(read_only=True)
    assigned_worker_id = serializers.PrimaryKeyRelatedField(
        queryset=Worker.objects.all(),
        source='assigned_worker', 
        write_only=True,
        required=False,
        allow_null=True
    )
    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add custom data to the response
        data['user_id'] = self.user.id
        data['is_staff'] = self.user.is_staff
        data['username'] = self.user.username
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


        
