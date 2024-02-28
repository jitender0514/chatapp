import uuid
from rest_framework.generics import ListAPIView,ListCreateAPIView
from rest_framework.exceptions import ValidationError

from django.contrib.auth.models import User

from .models import ChatRoom, ChatMessage, ChannelDetail
from .serializers import UserSerializer, ChatMessageSerializer, ChatRoomSerializer
from .utils import is_valid_uuid
from .channel_utils import add_room_to_channel


class UserView(ListAPIView):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    
    def get_queryset(self):
        term = self.request.GET.get('term', None)
        if not term:
            return User.objects.all().exclude(id=self.request.user.id).order_by('username')
        return User.objects.filter(username__icontains=term).exclude(id=self.request.user.id).order_by('username')


class ChatMessagesView(ListAPIView):
    serializer_class = ChatMessageSerializer
    
    def get_queryset(self):
        roomId = self.kwargs['roomId']
        user = self.request.user
        if not is_valid_uuid(roomId):
            raise ValidationError({
                                    'roomId': ['Invalid room UUID']
                                    })
        if not ChatRoom.objects.filter(id=roomId, members=user).exists():
            raise ValidationError({
                                    'roomId': ['Room does not exist']
                                    })
        return ChatMessage.objects.filter(room__id=roomId, room__members=user)
            



class ChatRoomView(ListCreateAPIView):
    serializer_class = ChatRoomSerializer
    
    def get_queryset(self):
        user = self.request.user
        term = self.request.GET.get('term', None)
        if not term:
            return ChatRoom.objects.filter(members=user)
        return ChatRoom.objects.filter(members=user, name__icontains=term).order_by('name')
        
    
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        obj = serializer.save(create_by=self.request.user)
        self.add_to_channel(obj)
        
    
    @staticmethod
    def add_to_channel(roomObj):
        channels = ChannelDetail.objects.filter(user__in=roomObj.members.all())
        for channel in channels:
            add_room_to_channel(channel.channel_name, roomObj.id)
            
            
        