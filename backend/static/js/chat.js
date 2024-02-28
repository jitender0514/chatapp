$(document).ready(function () {

var  timerId;

    // Throttle function: Input as function which needs to be throttled and delay is the time interval in milliseconds
var  throttleFunction  =  async function (func, args, delay) {
	// Cancels the setTimeout method execution
	clearTimeout(timerId);

    const chatRoom = await CHAT_ROOM_MANAGER.getRoomById(args.room);
    const userName = chatRoom.getUserNameById(args.user);
    const txtColor = chatRoom.memberTxtColor[args.user]; 
    showTypingName(args.user, userName, txtColor);

	// Schedule a setTimeout after delay seconds
	timerId  =  setTimeout(function () {
		func(args);
	}, delay)
}

async function  makeAPICall(data) {
    removeTypingName(parseInt(data.user));
}









    //----------------------------------------------------------------
    // WEB SOCKET CONNECTIONS AND MESSAGES HANDLING
  const chatSocket = new WebSocket("ws://" + window.location.host + "/ws/"+USERID+"/chat");
  chatSocket.onopen = function (e) {
    console.log("The connection was setup successfully !");
  };
  chatSocket.onclose = function (e) {
    $("#connectionFailed").removeClass("hidden");
    console.log("Something unexpected happened !");
  };

  chatSocket.onmessage = async function (e) {
    const data = JSON.parse(e.data);

    // Display the messages coming from the server
    if (data.type === "message"){
        await addSocketMsg(data.data);
        if (SELECTED_ROOM) {
            await displayChatMessages(SELECTED_ROOM);
            hideTypingMsgContainer();
        }
        updateRoomTime(data.data);
    }

    // Display the new room information

    if (data.type === "newRoom") {
        await displayChatRoom(CHAT_ROOM_MANAGER);
        if ($(`div.chat-room-elem[data-id='${SELECTED_ROOM}']`).length > 0) {
            $(`div.chat-room-elem[data-id='${SELECTED_ROOM}']`).trigger("click");
          }
    }

    // typing messages
    
    if (data.type === "typing") {
        if(parseInt(data.user) == USERID){
            return;
        }

        if (SELECTED_ROOM == data.room) {
            $(".messages-container-div").animate(
                { scrollTop: $(MSG_CONTAINER_ID).height() },
                100
            );
            throttleFunction(makeAPICall, data, 3000);
        } else {
            hideTypingMsgContainer();
        }
    }

  };


  // handle send message
  $(MSG_INPUT_ID).focus();
  $( MSG_INPUT_ID ).on( "keyup", function(e) {
    if (e.keyCode == 13) {
        $(SEND_BUTTON_ID).trigger('click');
        $(MSG_INPUT_ID).val( "");
    } else {
        chatSocket.send(
            JSON.stringify({
              action: 'typing',
              user: USERID,
              roomId: SELECTED_ROOM,
            })
          );
    }
  } );


  $( SEND_BUTTON_ID ).on( "click", function() {
    const msg = $( MSG_INPUT_ID ).val();
    if( $.trim(msg)) {
        chatSocket.send(
          JSON.stringify({
            action: 'message',
            message: msg,
            user: USERID,
            roomId: SELECTED_ROOM,
          })
        );
    }
    $(MSG_INPUT_ID).val( "");
  } );


  // ----------------------------------------------------------------


  // Updated the timings of the messages
  setInterval(function () {
    updateTime();
  }, 1000);
});


