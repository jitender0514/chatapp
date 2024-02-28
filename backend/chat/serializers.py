from django.contrib.auth.models import User

from rest_framework import serializers

from .models import ChatMessage, ChatRoom
from .constant import RoomType, ROOM_TYPE_CHOICES


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username')
        

class ChatMessageSerializer(serializers.ModelSerializer):
    created =  serializers.SerializerMethodField()
    
    class Meta:
        model = ChatMessage
        fields = ('id', 'room', 'user','message', 'created')
    
    def get_created(self, obj):
        return str(obj.created)
        

class ChatRoomSerializer(serializers.ModelSerializer):
    
    all_members = UserSerializer(source='members', many=True, read_only=True)
    short_name =  serializers.SerializerMethodField()
    last_msg = serializers.SerializerMethodField()
    created =  serializers.SerializerMethodField()
    creator = UserSerializer(source='create_by', many=False, read_only=True)
    
    
    class Meta:
        model = ChatRoom
        fields = ('id', 'name', 'type','members', 'all_members', 'short_name', 'last_msg', 'created', 'create_by', 'creator')
        read_only_fields= ('create_by', )
    
    
    def get_created(self, obj):
        return str(obj.created)
    
    
    def get_last_msg(self, obj):
        last_msg = obj.get_last_message()
        return ChatMessageSerializer(last_msg).data if last_msg else None
    
    
    def get_short_name(self, obj):
        """
        Return a short name based on the chat room type.
        
        Direct: return first letter of username
        Group: return first letter with # of username
        """
        if obj.type == RoomType.DIRECT:
            return obj.name[:1].upper() if obj.name else '||'
        else:
            return f"#{obj.name[:1].upper()}" if obj.name else '#'
    
    def validate(self, data):
        
        user = self.context['request'].user
        
        # added the current logged-in user
        data['members'].append(user)
        members = [member.id for member in data['members']] if data['members'] else []
        
        if not members:
            raise serializers.ValidationError('Please add members to the chat room')
        
        # Get the unique members
        members = list(set(members))
        
        # check How many unique members we have
        if len(members) <= 1:
            raise serializers.ValidationError('Room must have more than one members')
        
        if data['type'] == RoomType.DIRECT:
            if len(members)!= 2:
                raise serializers.ValidationError('Room must have 2 members')
        return data