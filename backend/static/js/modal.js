// Static backdrop

function getStaticClass(modal) {
  $(modal).addClass("astroui-modal-static");
  $("body").css({ overflow: "hidden" });
  $("body").addClass("astroui-modal-open");
  setTimeout(() => {
    $(modal).removeClass("astroui-modal-static");
  }, 100);
}

// Show modal

function showModal(modal) {
  //   modal.style.display = "flex";
  $(modal).css({ display: "flex" });
  setTimeout(() => {
    $(modal).addClass("show");
    // modal.classList.add("show");
  }, 100);

  $(modal).attr({ "aria-hidden": "false" });
  //   modal.setAttribute("aria-hidden", "false");

  $("body").css({ overflow: "hidden" });
  $("body").addClass("astroui-modal-open");

  //   document.body.style.overflow = "hidden";
  //   document.body.classList.add("astroui-modal-open");
}

// Remove modal

function dismissModal(modal) {
  //   modal.classList.remove("show");

  $(modal).removeClass("show");

  setTimeout(() => {
    // modal.style.display = "none";
    $(modal).css({ display: "none" });
  }, 200);

  $(modal).attr({ "aria-hidden": "true" });

  $("body").css({ overflow: "unset" });
  $("body").removeClass("astroui-modal-open");

  //   modal.setAttribute("aria-hidden", "true");
  //   document.body.style.overflow = "";
  //   document.body.classList.remove("astroui-modal-open");
}

//
// Function on dismissing modal by button close

// const getDismiss = (buttonClose, modal) => {
//   buttonClose.addEventListener("click", () => {
//     dismissModal(modal);
//   });
// };

$(document).ready(function () {
  const modal = $(".modal");

  $("body").on("click", '[data-dismiss="modal"]', function () {
    dismissModal(modal);
  });

  $("body").on("click", '[data-toggle="modal"]', function () {
    showModal(modal);
  });

  // buttonClose.forEach((buttonClose) => {
  //     getDismiss(buttonClose, modal);
  //   });

  // Open modal

  //   trigger.addEventListener("click", () => {
  //     showModal(modal);
  //   });

  // Close modal with press escape

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      dismissModal(modal);
    }
  });
});
