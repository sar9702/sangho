from django.urls import path
from .views import register, login, logout, refresh, check_username

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('refresh/', refresh, name='refresh'),
    path('check-username/', check_username, name='check-username'),
]