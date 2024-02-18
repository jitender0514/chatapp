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
  var div = document.createElement("div");
  div.innerHTML = data.username + " : " + data.message;
  document.querySelector("#id_message_send_input").value = "";
  document.querySelector(".messages-container").appendChild();
};
