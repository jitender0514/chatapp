 
from django.shortcuts import render, redirect, resolve_url
from django.contrib.auth import logout as auth_logout
from django.views.generic.base import RedirectView
from django.http import HttpResponseRedirect
from rest_framework.authtoken.models import Token
from django.conf import settings
from .constant import RoomType, ROOM_TYPE_CHOICES
 
 
def chatPage(request, *args, **kwargs):
    if not request.user.is_authenticated:
        return redirect("user:login-user")
    
    token, created = Token.objects.get_or_create(user=request.user)
    context = {
        'roomType': ROOM_TYPE_CHOICES,
        'token': token
        }    
    return render(request, "chat/chat-page.html", context)
