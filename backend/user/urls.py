from django.contrib.auth.views import LoginView
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token 
from . import views
from . import forms
 

app_name = 'user'   

urlpatterns = [
    
    # API
    # path("api/users/", api_views.UserView.as_view(), name="user-api"),
    
    # login-section
    path("auth/login/", LoginView.as_view
         (template_name="user/login.html", form_class=forms.LoginForm), name="login-user"),
    path("auth/logout/", views.LogoutView.as_view(), name="logout-user"),
    
    path("auth/register/", views.signup, name="register-user"),
    path('api-token-auth/', obtain_auth_token)
]