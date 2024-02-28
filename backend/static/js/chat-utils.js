const convertToMomentObj = (dateTimeStr) => {
    try {
      return moment(dateTimeStr);
    } catch (e) {
      return null;
    }
  };

const humanReadableForm = (dateTimeStr, formatStr='ll') => {
    try {
      return moment(dateTimeStr).format(formatStr);
    } catch (e) {
      return "";
    }
  };


const compareTime = (dateTimeStr) => {
  try {
    const timeObj = moment(dateTimeStr);
    return moment(timeObj).from(moment());
  } catch (e) {
    return "Invalid";
  }
};

const updateTime = () => {
  $(".text-time").each(function () {
    const dateTime = $(this).attr("data-time");
    if (!dateTime) {
      return;
    }
    $(this).text(compareTime(dateTime));
  });
};


const displayShortMsg = (msg, len=20) => {
    if (msg) {
        if (msg.length > len) {
            return msg.substring(0, len) + "...";
        }
        return msg;
    }
};


const initialChatMessageTemplate = (roomObj, currentUser) => {
    return `
    <li class="flex justify-center">
      <div class="w-full">
        <div class="w-full text-center px-4 py-2 text-gray-700 bg-orange-100 text-sm rounded shadow">
          <span class="block">
            ${
                (roomObj.create_by) ?
                roomObj.create_by==currentUser ? 'This Room has been created by "You" on '+humanReadableForm(roomObj.created)+'. This is the very beginning of this room.' 
                : 'This Room has been created by "'+ roomObj.creator.username +'" on '+humanReadableForm(roomObj.created)+'. This is the very beginning of this room.'
                : 'This Room has been created on '+humanReadableForm(roomObj.created)+'.This is the very beginning of this room.'

            }
            </span>
        </div>
        </div>
      </li>
    `
}


const topRoomInformation = (chatRoom, currentUser = USERID) => {

    const roomObj = chatRoom.chatRoom;
    const colorClass = chatRoom.colorClass;

    let members= [];
    
    roomObj.all_members.forEach(member => {
        if (member.id == currentUser) {
            members.push(`<span class="font-bold text-sm text-blue-500">@You</span>`);
        } else {
            members.push(`<span class="font-bold text-sm ${chatRoom.memberTxtColor[member.id]}">@${chatRoom.getUserNameById(member.id)}</span>`);
        }
        
    })



    return `
    <div class="flex justify-between">
        <div class="flex items-center">
            <div class="flex items-center justify-center w-10 h-10 rounded-full ${colorClass}">
                <strong>${roomObj.short_name}</strong>
            </div>              
            <span class="block ml-2 font-bold text-gray-600">${roomObj.name}</span>
        </div>
        <div class="flex items-center flex-col">
            <div class="block w-full text-right">
                <span class="block font-bold text-sm">Members</span>
            </div>
            <div class="flex items-right">
                ${members.join("&nbsp;")}
            </div>              
        </div>
    </div>
    `
}

const typingMsgTemplate = () => {
  return `
      <li id="typingMsgContainer" class="flex justify-end">
        <div>
            <span class=" block text-right font-bold text-sm">
                
            </span>
            <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-white rounded shadow">
                <img height="40px" src=${TYPING_MSG} alt="typing">
            </div>
        </div>
      </li>
      `;
};

const incomingChatTemplate= (chatObj, userName, textColor) => {
    return `
        <li class="flex justify-end">
          <div>
          <span class="block text-right ${textColor} font-bold text-sm">${userName}</span>
          <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
            <p class="text-slate-400 text-xs text-time" data-time="${chatObj.created}">${compareTime(chatObj.created)}</p>
            <span class="block">${chatObj.message}</span>
          </div>
          </div>
        </li>
        `;
  };

const sendChatTemplate = (chatObj) => {
  return `
      <li class="flex justify-start">
      <div>
        <span class="block text-left font-bold text-blue-500 text-sm">You</span>
        <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-white rounded shadow">
          <p class="text-slate-400 text-xs text-time" data-time="${chatObj.created}">${compareTime(chatObj.created)}</p>
          <span class="block">${chatObj.message}</span>
        </div>
        </div>
      </li>
      `;
};

const roomTemplate = (roomObj, colorClass) => {
  return `
    <div data-id="${
      roomObj.id
    }"  class="h-17 chat-room-elem chat-room-elem-box w-full flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
    <div class="flex items-center justify-center w-11 h-10 rounded-full ${colorClass}">
        <strong>${roomObj.short_name}</strong>
      </div>
    <div class="w-full pb-2">
      <div class="flex justify-between">
        <span class="block ml-2 font-semibold text-gray-600">${
          displayShortMsg(roomObj.name, 15)
        }</span>
        <span class="block italic ml-2 text-sm text-gray-600 text-time" data-time="${roomObj.last_msg ? roomObj.last_msg.created : '' }">${ roomObj.last_msg ? compareTime(roomObj.last_msg.created ) : 'Initialize' }</span>
      </div>
      <span class="room-msg block ml-2 text-sm text-gray-500">${roomObj.last_msg ? displayShortMsg(roomObj.last_msg.message) : ''}</span>
    </div>
  </div>
    
    `;
};

function randomBgColorClass() {
  var colors = [
    "bg-red-300  border border-red-800 text-red-800",
    "bg-orange-300  border border-orange-800 text-orange-800",
    "bg-amber-300  border border-amber-800 text-amber-800",
    "bg-yellow-300  border border-yellow-800 text-yellow-800",
    "bg-lime-300  border border-lime-800 text-lime-800",
    "bg-green-300  border border-green-800 text-green-800",
    "bg-emerald-300  border border-emerald-800 text-emerald-800",
    "bg-teal-300  border border-teal-800 text-teal-800",
    "bg-cyan-300  border border-cyan-800 text-cyan-800",
    "bg-sky-300  border border-sky-800 text-sky-800",
    "bg-blue-300  border border-blue-800 text-blue-800",
    "bg-indigo-300  border border-indigo-800 text-indigo-800",
    "bg-violet-300  border border-violet-800 text-violet-800",
    "bg-purple-300  border border-purple-800 text-purple-800",
    "bg-fuchsia-300  border border-fuchsia-800 text-fuchsia-800",
    "bg-pink-300  border border-pink-800 text-pink-800",
    "bg-rose-300  border border-rose-800 text-rose-800",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}


class RandomColorClass {
    constructor() {
        this.bgColors = [
            "bg-red-300 border border-red-800 text-red-800",
            "bg-orange-300 border border-orange-800 text-orange-800",
            "bg-amber-300 border border-amber-800 text-amber-800",
            "bg-yellow-300 border border-yellow-800 text-yellow-800",
            "bg-lime-300 border border-lime-800 text-lime-800",
            "bg-green-300 border border-green-800 text-green-800",
            "bg-emerald-300 border border-emerald-800 text-emerald-800",
            "bg-teal-300 border border-teal-800 text-teal-800",
            "bg-cyan-300 border border-cyan-800 text-cyan-800",
            "bg-sky-300 border border-sky-800 text-sky-800",
            "bg-blue-300 border border-blue-800 text-blue-800",
            "bg-indigo-300 border border-indigo-800 text-indigo-800",
            "bg-violet-300 border border-violet-800 text-violet-800",
            "bg-purple-300 border border-purple-800 text-purple-800",
            "bg-fuchsia-300 border border-fuchsia-800 text-fuchsia-800",
            "bg-pink-300 border border-pink-800 text-pink-800",
            "bg-rose-300 border border-rose-800 text-rose-800",
          ];
        this.textColor = this.bgColors.map(bg=> {
            const colors = bg.split(' ');
            return colors[colors.length - 1];
        });
    }

    getRandomBgColor() {
        return this.bgColors[Math.floor(Math.random() * this.bgColors.length)];
    }

    getRandomTxtColor(notIncluded=[]) {
        let allowedColors =  this.textColor;
        let count = notIncluded.length;
        if (count >= allowedColors.length) {
            count = count % allowedColors.length;
        }
        if (count == 0) { 
            return allowedColors[Math.floor(Math.random() * allowedColors.length)];
            
        } 

        const startPoint = (notIncluded.length - count) < 0 ? 0 : notIncluded.length - count;


        const remainingNotIncluded = notIncluded.slice(startPoint);

        allowedColors = allowedColors.filter(color => remainingNotIncluded.indexOf(color) == -1);


        return allowedColors[Math.floor(Math.random() * allowedColors.length)];   
    }
}

function getRandomBgColor() {
    const randomColorObj = new RandomColorClass();
    return randomColorObj.getRandomBgColor();
}

function getRandomTxtColor(notIncluded=[]) {
    const randomColorObj = new RandomColorClass();
    return randomColorObj.getRandomTxtColor(notIncluded);
}



function getMembersName(memberList, notDisplayMbrIds) { 
    let memberNames = []
    
    memberList.forEach(member => {
        if (!notDisplayMbrIds.includes( member.id) )  {
            memberNames.push(member.username);
        }
    });
    return memberNames;
}


function displayMembersName(memberList, notDisplayMbrIds) {
    let memberNames = getMembersName(memberList, notDisplayMbrIds);
    return memberNames.join(", ");
}


function toggleRoomBlock() {

    if ($(".room-container-block").hasClass("hidden")) {
        $(".room-container-block").removeClass("hidden");
        $(".messages-container-block").addClass("hidden");
        sortRoomElements();
    } else {
        $(".room-container-block").addClass("hidden");
        $(".messages-container-block").removeClass("hidden");
    }
}


function updateRoomTime(msgObj) {
    const roomEle =  $(`div.chat-room-elem[data-id='${msgObj.room}']`).first();
    if (roomEle) {
        roomEle.find(".text-time").text(compareTime(msgObj.created));
        roomEle.find(".text-time").attr("data-time", msgObj.created);
        roomEle.find(".room-msg").text(displayShortMsg(msgObj.message));

        updatedSortData();
    }
}



function showTypingName(userId, name, txtColor) {
    if ($("#typingMsgContainer").hasClass("hidden") ){
        $("#typingMsgContainer").removeClass("hidden");
    }
    if ($("#typingUserNames").find(`span[data-user=${parseInt(userId)}]`).length === 0) {
        $("#typingUserNames").html(`<span data-user=${parseInt(userId)} class="${txtColor}">${name}</span>`);
    }
}
function removeTypingName(userId) {
    if ($("#typingUserNames").find(`span[data-user=${parseInt(userId)}]`).length <= 1) {
        hideTypingMsgContainer();
    } else {
        $("#typingUserNames").find(`span[data-user=${parseInt(userId)}]`).remove();
    }
}

function hideTypingMsgContainer() {
    $("#typingMsgContainer").addClass("hidden");
    $("#typingUserNames").find('span').remove();
}