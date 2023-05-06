let recaptchaToken = null;

function updateToken(token) {
  recaptchaToken = token;
}

function flash(elementId) {
  const element = document.getElementById(elementId);

  const yOffset = -100;
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });

  element.style.border = "2px solid #ff0000";
  element.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
  setTimeout(() => {
    element.style.backgroundColor = "rgba(0, 0, 0, 0)";
    element.style.border = "1px solid #888";
  }, 600);
}

function submit() {
  const required = ["botid", "prefix", "description"];
  for (const v of required) {
    if (!document.getElementById(v).value) {
      $('a[href="##edit"]').click();
      flash(v);
      return;
    }
  }

  const formItems = [
    "botid",
    "prefix",
    "marknsfw",
    "description",
    "invite",
    "support",
    "website",
    "github",
    "tags",
    "owner-ids",
    "note",
    "webhook",
  ];
  const data = {};
  for (const formItem of formItems) {
    data[formItem] = $(`#${formItem}`).val();
  }

  data.id = data.botid;
  data.owners = data["owner-ids"];
  data.long = CKEDITOR.instances.longdesc.getData();
  data.recaptchaToken = recaptchaToken;

  let method = "POST";
  if (location.href.includes("/bots/edit")) method = "PATCH";
  fetch(`/api/bots/${data.id}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((body) => body.json())
    .then((body) => {
      if (!body.success) {
        recaptchaToken = null;
        grecaptcha.reset();
        const opts = {
          type: "error",
          text: body.message,
          theme: "sunset",
          timeout: 3500,
        };
        if (body.button) {
          opts.buttons = [
            Noty.button(body.button.text, "btn btn-success", () => {
              location.href = body.button.url;
            }),
          ];
        }
        new Noty(opts).show();
      } else if (location.href.includes("/bots/edit")) {
        const regex = /^[0-9a-fA-F]{24}$/; // validate that input is a 24-character hexadecimal string
        const id = data.id.trim();
        if (regex.test(id)) location.href = `/bots/${encodeURIComponent(id)}`;
      } else location.href = "/success";
    });
}

$(document).ready(async () => {
  if (location.href.includes("/bots/edit")) {
    const botId = location.href
      .split(location.host)[1]
      .replace("/bots/edit/", "")
      .replace("/", "");
    $("#auth").click(() => {
      fetch(`/api/auth/${botId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              title: "Your authorisation token",
              icon: "info",
              html: `Your authorisation token is <code>${data.auth}</code>`,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Close",
              confirmButtonAriaLabel: "close",
            });
          } else {
            Swal.fire({
              title: "Your authorisation token",
              icon: "error",
              html: "There was an error with your authorisation token.",
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Close",
              confirmButtonAriaLabel: "close",
            });
          }
        });
    });
    $("#reset").click(() => {
      fetch(`/api/auth/reset/${botId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              title: "Your new authorisation token",
              icon: "info",
              html: `Your new authorisation token is <code>${data.auth}</code>`,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Close",
              confirmButtonAriaLabel: "close",
            });
          } else {
            Swal.fire({
              title: "Your new authorisation token",
              icon: "error",
              html: "There was an error with your authorisation token.",
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Close",
              confirmButtonAriaLabel: "close",
            });
          }
        });
    });
  }
  CKEDITOR.replace("longdesc", {
    toolbarGroups: [
      { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
      {
        name: "paragraph",
        groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"],
      },
      { name: "clipboard", groups: ["undo", "clipboard"] },
      {
        name: "editing",
        groups: ["find", "selection", "spellchecker", "editing"],
      },
      { name: "forms", groups: ["forms"] },
      { name: "links", groups: ["links"] },
      { name: "insert", groups: ["insert"] },
      { name: "styles", groups: ["styles"] },
      { name: "colors", groups: ["colors"] },
      { name: "tools", groups: ["tools"] },
      { name: "document", groups: ["mode", "document", "doctools"] },
      { name: "others", groups: ["others"] },
      { name: "about", groups: ["about"] },
    ],
    uiColor: window
      .getComputedStyle(document.body)
      .getPropertyValue("--background-2")
      .replace(" ", ""),
    removeButtons:
      "Save,Templates,Cut,Find,SelectAll,Scayt,Form,Checkbox,Replace,NewPage,Preview,Print,Paste,Copy,PasteText,PasteFromWord,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Superscript,Subscript,Outdent,Indent,CreateDiv,Language,BidiRtl,BidiLtr,Unlink,Anchor,Flash,Font,Smiley,PageBreak,SpecialChar,Iframe,FontSize,ShowBlocks,Maximize,About,Format,Styles",
  });

  /* Tags */
  const select = $("select[multiple]");
  const options = select.find("option");

  const div = $("<div />").addClass("selectMultiple");
  const active = $("<div />");
  const list = $("<ul />");
  const placeholder = select.data("placeholder");

  const span = $("<span />").text(placeholder).appendTo(active);

  options.each(function () {
    const text = $(this).text();
    if ($(this).is(":selected")) {
      active.append($("<a />").html(`<em>${escapeHtml(text)}</em><i></i>`));
      span.addClass("hide");
    } else {
      list.append($("<li />").html(escapeHtml(text)));
    }
  });

  active.append($("<div />").addClass("arrow"));
  div.append(active).append(list);

  select.wrap(div);

  $(document).on("click", ".selectMultiple ul li", function (e) {
    const select = $(this).parent().parent();
    const li = $(this);
    if (!select.hasClass("clicked")) {
      select.addClass("clicked");
      li.prev().addClass("beforeRemove");
      li.next().addClass("afterRemove");
      li.addClass("remove");
      const a = $("<a />")
        .addClass("notShown")
        .html(`<em>${escapeHtml(li.text())}</em><i></i>`)
        .hide()
        .appendTo(select.children("div"));
      a.slideDown(100, () => {
        a.addClass("shown");
        select.children("div").children("span").addClass("hide");
        select.find(`option:contains(${li.text()})`).prop("selected", true);
      });
      if (li.prev().is(":last-child")) {
        li.prev().removeClass("beforeRemove");
      }
      if (li.next().is(":first-child")) {
        li.next().removeClass("afterRemove");
      }

      li.prev().removeClass("beforeRemove");
      li.next().removeClass("afterRemove");

      li.slideUp(400);
      li.remove();
      select.removeClass("clicked");
    }
  });

  $(document).on("click", ".selectMultiple > div a", function (e) {
    const select = $(this).parent().parent();
    const self = $(this);
    self.removeClass().addClass("remove");
    select.addClass("open");
    self.addClass("disappear");
    self.animate({
      width: 0,
      height: 0,
      padding: 0,
      margin: 0,
    });
    const li = $("<li />")
      .text(self.children("em").text())
      .addClass("notShown")
      .appendTo(select.find("ul"));
    li.slideDown(400);
    li.addClass("show");
    select
      .find(`option:contains(${self.children("em").text()})`)
      .prop("selected", false);
    if (!select.find("option:selected").length) {
      select.children("div").children("span").removeClass("hide");
    }
    li.removeClass();
    self.remove();
  });

  $(document).on("click", ".selectMultiple", function (e) {
    $(this).toggleClass("open");
  });

  CKEDITOR.instances.longdesc.on("mode", () => {
    const bg = window
      .getComputedStyle(document.body)
      .getPropertyValue("--background-color");
    const color = window
      .getComputedStyle(document.body)
      .getPropertyValue("--color");
    $(".cke_wysiwyg_frame ")
      .contents()
      .find("body")
      .css({ "background-color": bg, color });
    $(".cke_source ").css({ "background-color": bg, color });
  });
});
CKEDITOR.disableAutoInline = true;

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
