from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def add_room_to_channel(channel_name, room_id) :
    
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_add)(
            str(room_id).replace('-',''), 
            channel_name
        )
    async_to_sync(channel_layer.group_send)(
            str(room_id).replace('-',''), 
            {
                'type': 'sendMessage',
                "message" : {'type': 'newRoom'}
            }
        )