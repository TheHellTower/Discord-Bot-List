Array.prototype.shuffle = function () {
  const a = this;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

async function load() {
  let n = 0;
  let BotList = await fetch("/api/bots/list");
  BotList = await BotList.json();
  BotList = BotList.sort((a, b) => b.likes - a.likes);

  $("#loading").css("display", "none");

  const selection = BotList.slice(n, n + 10);
  loadMore(selection);

  $(window).scroll(() => {
    if (
      $(window).scrollTop() + $(window).height() >
      $(document).height() - 200
    ) {
      n += 10;
      loadMore(BotList.slice(n, n + 10));
    }
  });
}

function loadMore(res) {
  res.forEach((bot) => {
    if (bot.state == "unverified") return;

    const html = `
        <div class="card">
            <img src="${bot.logo}" class="icon">
            <h2 class="title">
                ${bot.username}
                <a class="likes" href="/bots/like/${bot.botid}">
                    <i class="far fa-heart"></i>${bot.likes || 0}
                </a>
            </h2>
            <p class="desc">${bot.description}</p>
            <a href="/bots/${bot.botid}" class="button small">View bot info</a>
        </div>`;

    document.getElementById("cards").insertAdjacentHTML("beforeend", html);
  });
}

function search() {
  if (document.getElementById("search").contentEditable === "false") return;
  const s = String(
    document.getElementById("search").innerHTML.toLowerCase()
  ).replaceAll("<br>", "");
  const cards = document.getElementById("cards");
  cards.style.display = "none";
  if (document.getElementById("loading"))
    document.getElementById("loading").display = "block";
  if (cards) {
    let cardsVisible = 0;

    const list = cards.children;
    for (var i = 1; i < list.length; i++) {
      const card = list[i];
      const title = card.children[1].innerHTML.toLowerCase();
      const desc = card.children[2].innerHTML.toLowerCase();
      if (!title.includes(s) && !desc.includes(s)) card.style.display = "none";
      else {
        card.style.display = "inline-block";
        cardsVisible++;
      }
    }

    if (cardsVisible === 0) {
      document.getElementById(
        "searchMore"
      ).innerHTML = `No bots found. Would you like to <a href="/bots/search/?q=${s}">search all bots</a>?`;
      document.getElementById("searchMore").style.display = "block";
    } else {
      document.getElementById(
        "searchMore"
      ).innerHTML = `Would you like to <a href="/bots/search/?q=${s}">search all bots</a>`;
      document.getElementById("searchMore").style.display = "block";
    }

    if (document.getElementById("search").innerHTML === "") {
      document.getElementById("searchMore").style.display = "none";
      for (var i = 1; i < list.length; i++) {
        const card = list[i];
        card.style.display = "inline-block";
      }
    }
  }
  if (document.getElementById("loading"))
    document.getElementById("loading").display = "none";
  cards.style.display = "block";
}
