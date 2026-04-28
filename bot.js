window.startBot = function () {

  console.log("🔥 BOT CORE STARTED");

  let running = false;
  let target = "";

  const clean = (t) => (t || "").replace(/[^\d]/g, "");

  // 🔥 LOAD FIREBASE
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

    // 🔥 LISTEN COMMAND
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

    // ⚡ FAST LOOP (MAIN ENGINE)
    setInterval(() => {

      if (!running || !target) return;

      let clicked = false;

      const blocks = document.querySelectorAll("div");

      blocks.forEach(block => {

        if (clicked) return;

        const text = clean(block.innerText);

        // 🔥 STRICT MATCH
        if (text === target) {

          const btns = block.querySelectorAll("button");

          btns.forEach(btn => {
            const t = btn.innerText.toLowerCase();

            if (t.includes("buy")) {

              btn.click();
              clicked = true;
              running = false;

              console.log("⚡ CLICKED:", target);

              // 💳 PAYMENT AUTO
              setTimeout(() => {
                document.querySelectorAll("button").forEach(b => {
                  const tt = b.innerText.toLowerCase();

                  if (
                    tt.includes("upi") ||
                    tt.includes("pay") ||
                    tt.includes("mobikwik") ||
                    tt.includes("bank")
                  ) {
                    b.click();
                    console.log("💳 PAYMENT CLICKED");
                  }
                });
              }, 800);

            }
          });

        }

      });

    }, 300);

  })();

};
