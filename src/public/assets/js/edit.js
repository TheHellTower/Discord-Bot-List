function wait(seconds) {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(true);
    }, 1000 * seconds);
  });
}

$(document).ready(async () => {
  $(".link").click((e) => {
    $(".section").hide();
    $($.parseHTML(decodeURIComponent($(e.target).data("target")))).show();
  });

  $(document).on("click", ".delete", async function () {
    const name = $(this).data("name");
    const id = $(this).data("id");

    await Swal.fire({
      title: `Deleting ${name}`,
      icon: "warning",
      html: `Type <u>${escapeHtml(name)}</u> to confirm`,
      showCancelButton: true,
      input: "text",
      confirmButtonText: "Delete",
      preConfirm: async (inputName) => {
        if (inputName.toLowerCase() !== name.toLowerCase()) {
          Swal.update({
            title: "Cancelled",
            html: "",
            showConfirmButton: false,
            showCancelButton: false,
          });
          document.getElementsByClassName("swal2-content")[0].remove();
          await wait(1);
        } else {
          const encodedId = encodeURIComponent(id);
          await fetch(`/api/bots/${encodedId}`, {
            method: "DELETE",
          });
          location.href = "/me";
        }
      },
    });
  });
});

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
