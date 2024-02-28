import json
from django.utils import timezone
from django.contrib.auth.models import User
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatMessage, ChatRoom, ChannelDetail




class ChatConsumer(AsyncWebsocketConsumer):
    
    def getUser(self, userId):
        return User.objects.get(id=userId)
    
    def saveChannel(self, channel_name, user):
        ChannelDetail.objects.get_or_create(channel_name=channel_name, user=user)
    
    def deleteChannel(self, channel_name, user):
        ChannelDetail.objects.filter(channel_name=channel_name, user=user).delete()
        if ChannelDetail.objects.filter(channel_name=channel_name, user=None).exists():
            ChannelDetail.objects.filter(channel_name=channel_name, user=None).delete()
        
    
    def saveMessage(self, message, userId, roomId):
        userObj = User.objects.get(id=userId)
        roomObj = ChatRoom.objects.get(id=roomId)
        chatMessageObj = ChatMessage.objects.create(
            room=roomObj, user=userObj, message=message)
        return {
            'action': 'message',
            'id': chatMessageObj.id,
            'user': userId,
            'room': roomId,
            'message': message,
            'created': str(chatMessageObj.created)
		}

    
    async def connect(self):
        self.userId = self.scope['url_route']['kwargs']['userId']
        self.user = await database_sync_to_async(self.getUser)(self.userId)
        self.userRooms = await database_sync_to_async(list)(ChatRoom.objects.filter(members=self.userId))
        await database_sync_to_async(self.saveChannel)(self.channel_name, self.user)
        for room in self.userRooms:
            await self.channel_layer.group_add(
                str(room.id).replace('-', ''),
                self.channel_name
                )
        await self.accept()

    async def disconnect(self , close_code):
        # await database_sync_to_async(self.deleteOnlineUser)(self.user)
        await database_sync_to_async(self.deleteChannel)(self.channel_name, self.user)
        for room in self.userRooms:
            await self.channel_layer.group_discard(
                str(room.id).replace('-', ''),
                self.channel_name
                )
        
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json["action"]
        roomId = text_data_json["roomId"]
        
        chatMessage = {}
        
        if action == 'message':
            chatMessage['type'] = 'message'
            message = text_data_json['message']
            userId = text_data_json['user']
            chatMessage['data'] = await database_sync_to_async(self.saveMessage)(message, userId, roomId)
            
        
        # if action == 'addRoom':
        #     chatMessage['type'] = 'newRoom'
        
        elif action == 'typing':
            chatMessage['type'] = 'typing'
            chatMessage['user'] = text_data_json['user']
            chatMessage['room'] = text_data_json["roomId"]
            
            
        
        await self.channel_layer.group_send(
            str(roomId).replace('-', ''),{
                'type': 'sendMessage',
                "message" : chatMessage
            })
    
    async def sendMessage(self , event) :
        message = event["message"]
        await self.send(text_data=json.dumps(message))
