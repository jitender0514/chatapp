toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "1000",
  "hideDuration": "3000",
  "timeOut": "3000",
  "extendedTimeOut": "1500",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}



$(document).ready(function () {
  var MEMBERS = [];

  function fromReset(formId) {
    $(formId).trigger("reset");
    MEMBERS = [];
    displaySelectedMember();
  }

  const Validations = {
    members: function () {
      let result = { error: false, msg: "" };
      if (MEMBERS.length === 0) {
        result = { error: true, msg: "This field is required" };
      }
      return result;
    },
    name: function (val) {
      let result = { error: false, msg: "" };
      const value = $.trim(val);

      if (value.length === 0) {
        result = { error: true, msg: "This field is required" };
      } else if (value.length <= 3) {
        result = {
          error: true,
          msg: "Characters should be greater than 3 characters",
        };
      } else if (value.length >= 100) {
        result = {
          error: true,
          msg: "Characters should be less than 100 characters",
        };
      }
      return result;
    },
    type: function (val) {
      let result = { error: false, msg: "" };
      if (!val) {
        result = { error: true, msg: "This field is required" };
      }
      return result;
    },
  };

  function displayError(fieldName, errorMsg) {
    if (errorMsg) {
      $(
        `#createRoomForm select[name="${fieldName}"], input[name="${fieldName}"]`
      )
        .addClass("border-red-500")
        .next()
        .text(errorMsg);
    } else {
      $(
        `#createRoomForm select[name="${fieldName}"], input[name="${fieldName}"]`
      )
        .removeClass("border-red-500")
        .next()
        .text("");
    }
  }

  $("body").on("change", `#createRoomForm select[name="type"]`, function () {
    const type = $(this).val();
    const result = Validations.type(type);
    if (result.error) {
      displayError("type", result.msg);
    } else {
      displayError("type", null);
    }

    MEMBERS = [];
    displaySelectedMember();
  });

  $("body").on("change", `#createRoomForm input[name="name"]`, function () {
    const name = $(this).val();
    const result = Validations.type(name);
    if (result.error) {
      displayError("name", result.msg);
    } else {
      displayError("name", null);
    }
  });

  async function createRoomHandler(sendData) {
    const resp = await createRoomApi(sendData);
    fromReset("#createRoomForm");

    // Initialize
    CHAT_ROOM_MANAGER.setChatMessage(resp, []);
    displayChatRoom(CHAT_ROOM_MANAGER);
    toastr["success"]("Room created successfully!!");

  }

  $("body").on("submit", "#createRoomForm", function (e) {
    e.preventDefault();
    let formData = $(this).serializeArray();

    let hasError = false;

    let sendData = {};

    formData.forEach((data) => {
      const result = Validations[data.name](data.value);

      sendData[data.name] = data.value;
      if (result.error) {
        displayError(data.name, result.msg);
        hasError = true;
      }
    });

    if (!hasError) {
      sendData["members"] = MEMBERS.map((member) => member.id);
      createRoomHandler(sendData);
    }
  });

  $("body").on("click", ".delete-member", function (e) {
    const memberId = $(this).attr("data-id");
    MEMBERS = MEMBERS.filter(function (member) {
      return member.id != memberId;
    });
    displaySelectedMember();
  });

  function displaySelectedMember() {

    if (MEMBERS.length === 0) {
      $("#memberList").empty();
    }

    let members = [];
    MEMBERS.forEach(function (member) {
      members.push(
        `<div class="text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-blue-200 text-blue-700 rounded-full ml-2">
          <span >${member.username}</span>
          <span data-id=${member.id} class="ml-1 delete-member text-red-700 hover:text-red-500 cursor-pointer">
          <svg class="w-6 h-6 text-red-700 hover:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          </span>
        </div>`
      );
    });

    $("#memberList").html(members);
  }

  function addMember(member) {
    const roomType = $(`#createRoomForm select[name="type"]`).first().val();
    if (roomType === "D") {
      MEMBERS = [member];
    } else {
      MEMBERS.push(member);
      let uniqueMember = {};
      MEMBERS.forEach(function (member) {
        uniqueMember[member.id] = member;
      });
      MEMBERS = Object.values(uniqueMember);
    }
  }

  $("#members").autocomplete({
    source: async function (request, response) {
      const data = await fetchUsersApi({ term: request.term });
      response(
        data.map((o) => {
          return {
            original: o,
            id: o.id,
            value: o.username,
          };
        })
      );
    },
    minLength: 0,
    select: function (event, ui) {
      addMember(ui.item.original);
      displaySelectedMember();

      const result = Validations.members(MEMBERS);

      if (result.error) {
        displayError("members", result.msg);
      } else {
        displayError("members", null);
      }

      this.value = "";
      return false;
    },
  });
});
