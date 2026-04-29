from rest_framework import generics, permissions
from .serializers import UserSerializer, WorkerSerializer
from django.contrib.auth.models import User
from .models import Complaint, Worker
from .serializers import ComplaintSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework.views import APIView
from .models import Complaint
from .models import AdminUser
from rest_framework.parsers import MultiPartParser, FormParser # Add these imports
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
class ComplaintListCreateView(generics.ListCreateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        # Temporary: Return everything to see if the connection works
        return Complaint.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically tie the complaint to the logged-in user
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            raise PermissionError("You must be authenticated to create a complaint")
class ComplaintDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# backend/api/views.py
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import AdminUser

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    name = request.data.get('admin_name')
    raw_password = request.data.get('password') # This is "1234" from the UI
    
    try:
        admin = AdminUser.objects.get(admin_name=name)
        
        # This compares "1234" against the hash in the DB
        if check_password(raw_password, admin.password):
            refresh = RefreshToken.for_user(admin)
            return Response({
                "access_token": str(refresh.access_token),
                "refresh": str(refresh),
                "message": "Access Granted",
                "role": "admin",
            }, status=200)
        
        return Response({"error": "Invalid admin credentials."}, status=401)
        
    except AdminUser.DoesNotExist:
        return Response({"error": "Admin account not found."}, status=404)
# backend/api/views.py
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_signup(request):
    name = request.data.get('admin_name')
    password = request.data.get('password')

    if AdminUser.objects.filter(admin_name=name).exists():
        return Response({"error": "Admin username already exists"}, status=400)

    # Creating the object triggers your model's save() method which hashes the password
    new_admin = AdminUser(admin_name=name, password=password)
    new_admin.save()

    return Response({"message": "Admin account created successfully"}, status=201)

class AnalyticsView(APIView):
    # Set to AllowAny for simple access as requested
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # 1. Complaints by Department (Bar Chart)
        department_data = Complaint.objects.values('department').annotate(
            count=Count('id')
        ).order_by('-count')

        # 2. Complaints by Urgency (Pie Chart)
        urgency_data = Complaint.objects.values('is_urgent').annotate(
            count=Count('id')
        )

        # 3. Monthly Trends (Line Chart)
        monthly_data = Complaint.objects.annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')

        # Format trends for frontend (e.g., "Jan", "Feb")
        trends = [
            {
                "month": item['month'].strftime('%b') if item['month'] else "N/A",
                "count": item['count']
            } 
            for item in monthly_data
        ]

        return Response({
            "complaintsByDepartment": list(department_data),
            "complaintsByUrgency": list(urgency_data),
            "monthlyTrends": trends
        })

class WorkerListCreateView(generics.ListCreateAPIView):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    permission_classes = [permissions.AllowAny]

class WorkerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    permission_classes = [permissions.AllowAny]


