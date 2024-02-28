class ChatMessagesManager {

    constructor() {
        this.chatRoom = null;
        this.messages = [];
        this.colorClass = null;
        this.memberTxtColor = null;
    }

    getUserNameById(userId) {
        const foundUser = this.chatRoom.all_members.find(user => user.id == userId);
        if (foundUser) {
            return foundUser.username;
        }
        return `Unknown: ${userId}`;
    }


    _addMessage(message) {
        this.messages.push(message);
    }

    addMessage(messageObj) {
        if (!this.messages.find(message => message.id === messageObj.id)) {
            this._addMessage(messageObj);
        }
    }

    getMessages() {
        if (this.messages.length > 0) {
            return this.messages.sort((a_msg, b_msg) => moment(a_msg.created) - moment(b_msg.created))
        }
        return this.messages;
    }

    getMessageById(id) {
        return this.messages.find(message => message.id === id);
    }
    getChatRoom() {
        return this.chatRoom;
    }

    _setMembersTextColor() {
        let memberObj = {};
        if(this.chatRoom.type === `D`) {
            const colors = this.colorClass.split(' ')
            const textColor = colors.length > 0 ? colors[colors.length - 1] : 'text-slate-600' ;
            this.chatRoom.members.forEach(member => {
                if (member == USERID) {
                    memberObj[member] = getRandomTxtColor([textColor]);
                } else {
                    memberObj[member] = textColor;
                }
            });
        } else {
            let assignedColors = [];
            this.chatRoom.members.forEach(member => {
                memberObj[member] = getRandomTxtColor(assignedColors);
                assignedColors.push(memberObj[member]);
            });
        }
        this.memberTxtColor = memberObj;   
    }


    setChatRoom(chatRoom) {
        this.chatRoom = chatRoom;
        this.colorClass = randomBgColorClass();
        this._setMembersTextColor();
    }

    checkAndUpdateChatRoom(newData) {
        if(this.chatRoom.id === newData.id) {
            if (this.chatRoom.last_msg != newData.last_msg) {
                this.chatRoom.last_msg = newData.last_msg;
            }
        }
    }

    setMessage(message) {
        if (Array.isArray(message)) {
            message.forEach(msg => this.addMessage(msg));
            
        }
        else if (typeof message === 'object' && message !== null) {
            this.addMessage(message);
        }
    }

    async fetchMessages() {

        const response = await fetchMessagesApi(this.chatRoom.id);
        if (response.length > 0 ) {
            response.forEach(data => {
                this.setMessage(data);
                
            });
        }
    }
}



class ChatRoomManager {
    constructor() {
        this.chatRooms = [];
    }

    addRoomManagerObj(chatMessagesManagerObj) {
        this.chatRooms.push(chatMessagesManagerObj);
    }

    getRooms() {
        return this.chatRooms;
    }

    getRoomById(roomId) {
        return this.chatRooms.find(room => room.chatRoom.id === roomId);
    }

    _setChatMessage(chatRoom, message) {
        const chatMsg = new ChatMessagesManager();
        chatMsg.setChatRoom(chatRoom);

        if (Array.isArray(message)) {
            message.forEach(m => chatMsg.setMessage(m));
        } 

        else if (typeof message === 'object' && message !== null) {
            chatMsg.setMessage(message);
        }
        
        this.addRoomManagerObj(chatMsg);
    }

    setChatMessage(chatRoom, message) {
        const msgObj = this.getRoomById(chatRoom.id);
        if (msgObj) {
            msgObj.checkAndUpdateChatRoom(chatRoom);
            msgObj.setMessage(message);
        } else {
            this._setChatMessage(chatRoom, message);
        }
    }
    

    async fetchRooms() {
        const chatRoomObj = this;

        const response = await fetchRoomsApi();
        if (response.length > 0 ) {
            response.forEach(data => {
                if (!chatRoomObj.chatRooms.find(room => room.id === data.id)) {
                     chatRoomObj.setChatMessage(data);
                }
            });
        }
    }
}