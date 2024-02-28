import uuid
from django.db import models
from django.contrib.auth.models import User
from .constant import RoomType


class ChatRoom(models.Model):
    """
    Model for chat rooms. Save the information
    about the chat room and its participants(members).
    
    Currently we are handling only `Direct` and `Group` types
    of chat rooms.
    
    Type of chat room
    -----------------
    `Direct`: Only 2 members can join this room.
    `Group`: Multiple members can join this room.
    
    NOTE: We are using UUID instead of ID.
    """
    
    id = models.UUIDField( 
         primary_key = True, 
         default = uuid.uuid4, 
         editable = False)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=5, choices=RoomType, default=RoomType.DIRECT)
    members = models.ManyToManyField(User, related_name='chatrooms')
    created = models.DateTimeField(auto_now_add=True)
    create_by = models.ForeignKey(User, related_name='user_chatrooms',  on_delete=models.SET_NULL, null=True)
    
    
    def __str__(self):
        return f"{self.id}: {self.name}"
    
    def get_last_message(self):
        """
        Return last message of this room

        Returns:
            ChatMessage object: return ChatMessage object
        """
        return self.chatmessage_set.order_by('-created').first()
    

class ChatMessage(models.Model):
    """
    Model for chat messages.
    """
    room = models.ForeignKey(ChatRoom, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    message = models.TextField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} ({self.room}): {self.message[0:30]}"
    
    


class ChannelDetail(models.Model):
    """
    Save and delete the channel information
    """
    channel_name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return self.channel_name
    
    @classmethod
    def get_channel_by_user(cls, user):
        return cls.objects.filter(user=user)
    