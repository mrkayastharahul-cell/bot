window.startBot = function () {

  console.log("🔥 BOT STARTED");

  let running = false;
  let target = "";
  let tried = [];

  // 🔊 sounds
  const ding = () => new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
  const chime = () => new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg").play();

  // ===== UI =====
  (function () {
    const box = document.createElement("div");
    box.style = `
      position:fixed; bottom:20px; right:20px;
      background:#111; color:#fff; padding:10px;
      border-radius:10px; z-index:99999; width:180px;
      font-size:12px;
    `;

    box.innerHTML = `
      <div>🔥 BOT</div>
      <input id="amt" placeholder="Amount" style="width:100%;margin:5px 0;padding:4px;">
      <button id="start">▶ Start</button>
      <button id="stop">⏹ Stop</button>
      <div id="st">IDLE</div>
    `;

    document.body.appendChild(box);

    const st = document.getElementById("st");

    document.getElementById("start").onclick = () => {
      const val = document.getElementById("amt").value;
      if (!val) return alert("Enter amount");

      target = val;
      running = true;
      tried = [];

      st.innerText = "RUNNING → " + val;
      console.log("▶ START:", val);
    };

    document.getElementById("stop").onclick = () => {
      running = false;
      st.innerText = "STOPPED";
      console.log("⏹ STOP");
    };
  })();

  // ===== HELPERS =====
  const clean = (t) => (t || "").replace(/[^\d]/g, "");

  const isPaymentPage = () =>
    document.body.innerText.toLowerCase().includes("select method payment");

  function clickDefault() {
    document.querySelectorAll("div,button").forEach(el => {
      if ((el.innerText || "").toLowerCase().includes("default")) {
        el.click();
      }
    });
  }

  function findMatches() {
    const res = [];
    document.querySelectorAll("button").forEach(btn => {
      const text = clean(btn.closest("div")?.innerText);
      if (text.includes(target)) res.push(btn);
    });
    return res.slice(0, 3);
  }

  function highlight(btns) {
    btns.forEach(b => b.style.border = "2px solid red");
  }

  async function tryClicks(btns) {
    for (let btn of btns) {

      if (!running) return;

      if (tried.includes(btn)) continue;
      tried.push(btn);

      console.log("⚡ Trying...");

      btn.click();

      await new Promise(r => setTimeout(r, 800));

      if (isPaymentPage()) {
        handlePayment();
        return;
      }
    }

    console.log("🔁 Retry loop");
  }

  function handlePayment() {
    console.log("💳 Payment page detected");

    ding();

    setTimeout(() => {
      document.querySelectorAll("div").forEach(el => {
        const t = (el.innerText || "").toLowerCase();

        if (t.includes("mobikwik")) {
          el.click();
          chime();
          console.log("💳 Mobikwik clicked");
          running = false;
        }
      });
    }, 500);
  }

  // ===== MAIN LOOP =====
  setInterval(async () => {

    if (!running || !target) return;

    if (isPaymentPage()) {
      handlePayment();
      return;
    }

    clickDefault();

    const matches = findMatches();
    if (matches.length === 0) return;

    highlight(matches);

    await tryClicks(matches);

  }, 600);

};
