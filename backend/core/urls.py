from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# Import your admin_login view here
from api.views import RegisterView, ComplaintListCreateView, ComplaintDetailView, admin_login, admin_signup
from api.views import AnalyticsView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/admin-signup/', admin_signup, name='admin_signup'),
    # ADD THIS LINE for your manual Admin table
    path('api/admin-login/', admin_login, name='admin_login'), 

    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/complaints/', ComplaintListCreateView.as_view(), name='complaint-list'),
    path('api/complaints/<int:pk>/', ComplaintDetailView.as_view(), name='complaint-detail'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)