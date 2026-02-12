from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class Complaint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default='pending')
    department=models.CharField(max_length=30,default='')
    is_urgent=models.BooleanField(default=False)
    image=models.ImageField(upload_to='complaints/', null=True,blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
class AdminUser(models.Model):
    admin_name = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)  # Storing hashed password
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Hash the password before saving if it's not already hashed
        if not self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.admin_name
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(default='', blank=True)
    profile_img = models.ImageField(upload_to='userprofile/', null=True, blank=True)

    def __str__(self):
        return self.user.username