/**
 * Load chat-rooms and chat messages.
 * Handle the chat messages and display them
 * to the user.
 *
 * `ChatRoomManager`: we use this class to handle
 * the chat messages and chat rooms.
 *
 */



  // init Isotope
var $GRID = $('#roomContainerDirect').isotope({
    itemSelector: '.chat-room-elem-box',
    layoutMode: 'vertical',
    getSortData: {
      weight: function( itemElem ) {
        var dataTime = $( itemElem ).find(".text-time").attr("data-time");
        if ( dataTime) {
            let momentObj = convertToMomentObj(dataTime);
            return ( momentObj) ? momentObj.format('x') : "-1"
        }
        return "-1";
      }
    }
  });

  var $GRID2 = $("#roomContainerGroup").isotope({
    itemSelector: '.chat-room-elem-box',
    layoutMode: 'vertical',
    getSortData: {
      weight: function( itemElem ) {
        var dataTime = $( itemElem ).find(".text-time").attr("data-time");
        if ( dataTime) {
            let momentObj = convertToMomentObj(dataTime);
            return ( momentObj) ? momentObj.format('x') : "-1"
        }
        return "-1";
      }
    }
  });

function sortRoomElements() {
    setTimeout( function() {
        if ($GRID) {
            $GRID.isotope({ sortBy : 'weight', sortAscending: false });
        }
    }, 500);
    setTimeout( function() {
        if ($GRID2) {
            $GRID2.isotope({ sortBy : 'weight', sortAscending: false });
        }
    }, 500);
}

function addInIsotopeItems(  ) { 
    $GRID.isotope( 'insert', $("#roomContainerDirect").find(".chat-room-elem-box") );
    $GRID2.isotope( 'insert', $("#roomContainerGroup").find(".chat-room-elem-box") );
    sortRoomElements();
}

function updatedSortData( ) { 
    $GRID.isotope( 'reloadItems');
    $GRID2.isotope( 'reloadItems');
    sortRoomElements();
}

function displayChatInfoAtTop(chatRoom) {
  $("#roomInfoTop").html(
    topRoomInformation(chatRoom, USERID)
  );
}


async function displayChatRoom(chatRoomManagerObj) {
  // Fetch chat rooms
  await chatRoomManagerObj.fetchRooms();
  const rooms = await chatRoomManagerObj.getRooms();
  let chatRoomTemplate = [];
  rooms
    .filter((room) => room.chatRoom.type == "D")
    .forEach(function (room) {
      chatRoomTemplate.push(roomTemplate(room.chatRoom, room.colorClass));
    });
    $("#roomContainerDirect").html(chatRoomTemplate);
    


  let chatRoomTemplate2 = [];
  rooms
    .filter((room) => room.chatRoom.type == "G")
    .forEach(function (room) {
      chatRoomTemplate2.push(roomTemplate(room.chatRoom, room.colorClass));
    });
  $("#roomContainerGroup").html(chatRoomTemplate2);

  addInIsotopeItems();
}

async function displayChatMessages(chatRoomId) {
  const chatRoom = await CHAT_ROOM_MANAGER.getRoomById(chatRoomId);
  const messages = await chatRoom.getMessages();

  let messageTemplate = [];

  if (messages.length > 0) {
    messages.forEach(function (message) {
      const userName = chatRoom.getUserNameById(message.user);
      messageTemplate.push(
        message.user == USERID
          ? sendChatTemplate(message)
          : incomingChatTemplate(
              message,
              userName,
              chatRoom.memberTxtColor[message.user]
            )
      );
    });
  } else {
    messageTemplate.push(initialChatMessageTemplate(chatRoom.chatRoom, USERID));
  }

  $(MSG_CONTAINER_ID).html(messageTemplate);

  $(".messages-container-div").animate(
    { scrollTop: $(MSG_CONTAINER_ID).height() },
    500
  );
}

async function fetchChatMessages(chatRoomId) {
  const chatRoom = CHAT_ROOM_MANAGER.getRoomById(chatRoomId);
  displayChatInfoAtTop(chatRoom);
  await chatRoom.fetchMessages();
  await displayChatMessages(chatRoomId);
}

// Initialize
var CHAT_ROOM_MANAGER = new ChatRoomManager();

async function addSocketMsg(chatMsg) {
  const chatRoom = CHAT_ROOM_MANAGER.getRoomById(chatMsg.room);
  if (chatRoom) {
    chatRoom.setMessage(chatMsg);
  }
}

async function onSearchSelect(roomObj) {
  if ($(`div.chat-room-elem[data-id='${roomObj.id}']`).length > 0) {
    $(`div.chat-room-elem[data-id='${roomObj.id}']`).trigger("click");
  }
}

$(document).ready(async function() {
  // display chat rooms
  await displayChatRoom(CHAT_ROOM_MANAGER);

  // handle click events on chat room
  $("body").on("click", "div.chat-room-elem", function (e) {
    toggleRoomBlock();
    const roomId = $(this).attr("data-id");
    SELECTED_ROOM = roomId;
    if (SELECTED_ROOM) {
      fetchChatMessages(SELECTED_ROOM);
    }
    $("#id_message_send_input").val("");

    $("div.chat-room-elem").removeClass("bg-sky-100 hover:bg-sky-100");

    $(this).addClass("bg-sky-100 hover:bg-sky-100");

    $(".messages-container-div").removeClass("bg-gray-200");
    $(".no-room-skelton").addClass("hidden");
    $(".no-room-select").removeClass("hidden");
  });

  // custom autocomplete

  $.widget("custom.roomAutoComplete", $.ui.autocomplete, {
    _create: function () {
      this._super();
      this.widget().menu(
        "option",
        "items",
        "> :not(.ui-autocomplete-category)"
      );
    },
    _renderMenu: function (ul, items) {
      var that = this,
        currentCategory = "";

      $.each(
        items.sort((a, b) => a.original.type.localeCompare(b.original.type)),
        function (index, item) {
          var li;
          if (item.original.type != currentCategory) {
            ul.append(
              "<li class='ui-autocomplete-category bg-gray-200 font-bold py-2'>" +
                ROOM_TYPES[item.original.type] +
                "</li>"
            );
            currentCategory = item.original.type;
          }
          li = that._renderItemData(ul, item);
          if (item.original.type) {
            li.attr(
              "aria-label",
              ROOM_TYPES[item.original.type] + " : " + item.label
            );
          }
        }
      );
    },
  });

  //search Chatroom
  $("#searchRoom")
    .roomAutoComplete({
      source: async function (request, response) {
        const data = await fetchRoomsApi({ term: request.term });
        response(
          data.map((o) => {
            return {
              original: o,
              id: o.id,
              value: o.name,
            };
          })
        );
      },
      minLength: 2,
      select: function (event, ui) {
        onSearchSelect(ui.item.original);
        this.value = "";
        return false;
      },
    })
    .roomAutoComplete("instance")._renderItem = function (ul, item) {
    return $("<li>")
      .append(
        `<div>
        <span class='px-2 block'>${item.label}</span>
        <span class='px-2 block text-gray-400 italic'>Members: ${displayMembersName(
          item.original.all_members,
          [parseInt(USERID)]
        )}</span>
        </div>`
      )
      .appendTo(ul);
  };

  $("#toggleRoomBlockBtn").on("click", function () {
    toggleRoomBlock();
  });
});
