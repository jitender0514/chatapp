 
from django.urls import path , include, re_path
from chat.consumers import ChatConsumer
 
# Here, "" is routing to the URL ChatConsumer which 
# will handle the chat functionality.
websocket_urlpatterns = [
    re_path("ws/(?P<userId>\w+)/chat$" , ChatConsumer.as_asgi()) , 
]