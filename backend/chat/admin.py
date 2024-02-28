from django.contrib import admin
from .models import ChatMessage, ChatRoom, ChannelDetail

# Register your models here.


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ["room", "message", "user", "created"]
    

@admin.register(ChannelDetail)
class ChannelDetailAdmin(admin.ModelAdmin):
    list_display = ["id", "channel_name", "user"]


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "type", "member_detail", "get_create_by", "created"]
    list_filter = ["type"]
    
    @admin.display(description='Create By', ordering='create_by__username')
    def get_create_by(self, obj):
        return obj.create_by.username
    
    @admin.display(empty_value="???")
    def member_detail(self, obj):
        members = []
        for member in obj.members.all():
            members.append(member.username)
        return f"Total: {len(members)}, Members: {', '.join(members)}"
        