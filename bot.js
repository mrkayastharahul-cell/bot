window.startBot = function () {

  console.log("🔥 BOT CORE STARTED");

  let running = false;
  let target = "";

  // 🔥 Load Firebase
  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });

  (async () => {

    await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
    await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");

    const firebaseConfig = {
      apiKey: "AIzaSyC7QAIYPrf94wzOBeNvGYk9wJ6HY08urA0",
      authDomain: "wallet-automation-695b2.firebaseapp.com",
      projectId: "wallet-automation-695b2"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    console.log("✅ Firebase Connected");

    // 🔥 Listen for command
    db.collection("commands").doc("control").onSnapshot((doc) => {

      const data = doc.data();
      if (!data) return;

      console.log("📡 COMMAND:", data);

      if (data.action === "target_buy") {
        target = data.amount;
        running = true;
        console.log("🎯 TARGET SET:", target);
      }

    });

    // ⚡ FINAL CLICK ENGINE (SMART TARGETING)
    setInterval(() => {

      if (!running || !target) return;

      let clicked = false;

      const buttons = document.querySelectorAll("button");

      buttons.forEach(btn => {

        if (clicked) return;

        const btnText = (btn.innerText || "").toLowerCase();

        if (btnText.includes("buy")) {

          // 🔥 Go up to find correct card/row
          let container = btn.closest("div");

          // try expanding scope (important for your UI)
          for (let i = 0; i < 3; i++) {
            if (container && !container.innerText.includes(target)) {
              container = container.parentElement;
            }
          }

          if (!container) return;

          const text = (container.innerText || "").replace(/[^\d]/g, "");

          // 🔥 MATCH LOGIC
          if (text.includes(target)) {

            btn.click();
            clicked = true;
            running = false;

            console.log("⚡ CLICKED:", target);

            // 💳 AUTO PAYMENT
            setTimeout(() => {
              document.querySelectorAll("button").forEach(b => {
                const t = (b.innerText || "").toLowerCase();

                if (
                  t.includes("upi") ||
                  t.includes("pay") ||
                  t.includes("mobikwik") ||
                  t.includes("bank")
                ) {
                  b.click();
                  console.log("💳 PAYMENT CLICKED:", t);
                }
              });
            }, 800);

          }

        }

      });

    }, 300);

  })();

};
