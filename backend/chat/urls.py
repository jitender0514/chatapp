from django.contrib.auth.views import LoginView
from django.urls import path, include
from . import views as chat_views
from . import api_views
 

app_name = 'chat'   

urlpatterns = [
    path("", chat_views.chatPage, name="chat-page"),
    
    # API
    path("api/users/", api_views.UserView.as_view(), name="user-api"),
    path("api/rooms/", api_views.ChatRoomView.as_view(), name="room-api"),
    path("api/<str:roomId>/messages/", api_views.ChatMessagesView.as_view(), name="messages-api"),
    
    
    # login-section
    # path("auth/login/", LoginView.as_view
    #      (template_name="user/login.html"), name="login-user"),
    # path("auth/logout/", chat_views.LogoutView.as_view(), name="logout-user"),
]