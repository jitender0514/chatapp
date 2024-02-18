$(document).ready(function () {
    //----------------------------------------------------------------
    // WEB SOCKET CONNECTIONS AND MESSAGES HANDLING
  const chatSocket = new WebSocket("ws://" + window.location.host + "/");
  chatSocket.onopen = function (e) {
    console.log("The connection was setup successfully !");
  };
  chatSocket.onclose = function (e) {
    console.log("Something unexpected happened !");
  };

  chatSocket.onmessage = function (e) {
    console.log(e);
    const data = JSON.parse(e.data);
    const message = data.username == USERNAME ? sendChatTemplate(data) : incomingChatTemplate(data);
    $("#id_message_send_input").val( "");
    $(".messages-container").append(message);
  };


  // handle send message
  $("#id_message_send_input").focus();
  $( "#id_message_send_input" ).on( "keyup", function(e) {
    if (e.keyCode == 13) {
        $("#id_message_send_button").trigger('click');
    }
  } );


  $( "#id_message_send_button" ).on( "click", function() {
    const msg = $( "#id_message_send_input" ).val();
    if( $.trim(msg)) {
        console.log(JSON.stringify({
            message: msg,
            username: USERNAME,
            created: moment().format(),
          }))
        chatSocket.send(
          JSON.stringify({
            message: msg,
            username: USERNAME,
            created: moment().format(),
          })
        );
    }
  } );


  // ----------------------------------------------------------------


  // Updated the timings of the messages
  setInterval(function () {
    updateTime();
  }, 1000);
});

const updateTime = () => {
  $(".text-time").each(function () {
    const dateTime = $(this).attr("data-time");
    if (!dateTime) {
      return;
    }
    try {
      const timeObj = moment(dateTime);
      $(this).text(moment(timeObj).from(moment()));
    } catch (e) {
      $(this).text("Invalid");
      return;
    }
  });
};

const incomingChatTemplate = (chatObj) => {
  return `
    <li class="flex justify-end">
      <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
        <p class="text-slate-400 text-xs text-time" data-time="${chatObj.created}"></p>
        <span class="block">${chatObj.message}</span>
      </div>
    </li>
    `;
};

const sendChatTemplate = (chatObj) => {
  return `
    <li class="flex justify-start">
      <div class="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
        <p class="text-slate-400 text-xs text-time" data-time="${chatObj.created}"></p>
        <span class="block">${chatObj.message}</span>
      </div>
    </li>
    `;
};
