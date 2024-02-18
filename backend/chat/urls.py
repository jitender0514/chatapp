from django.contrib.auth.views import LoginView
from django.urls import path, include
from . import views as chat_views
 

app_name = 'chat'   

urlpatterns = [
    path("", chat_views.chatPage, name="chat-page"),
 
    # login-section
    path("auth/login/", LoginView.as_view
         (template_name="chat/login.html"), name="login-user"),
    path("auth/logout/", chat_views.LogoutView.as_view(), name="logout-user"),
]