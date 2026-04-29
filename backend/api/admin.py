from django.contrib import admin
from .models import AdminUser,Complaint,UserProfile,Worker

admin.site.register(Complaint)
admin.site.register(UserProfile)
admin.site.register(Worker)
@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    # This controls which columns show up in the table list
    list_display = ('admin_name', 'password')
