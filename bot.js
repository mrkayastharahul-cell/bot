window.startBot = function () {

  console.log("🔥 BOT CORE STARTED");

  let running = true;
  let target = "";

  const clean = (t) => (t || "").replace(/[^\d]/g, "");

  // 🔥 FIREBASE
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

  // ⚡ FAST DETECTION
  const observer = new MutationObserver(() => {

    if (!running || !target) return;

    let clicked = false;

    const blocks = document.querySelectorAll("div, li");

    for (let block of blocks) {

      if (clicked) break;

      const text = clean(block.innerText);

      // 🔥 EXACT MATCH
      if (text === target) {

        const btn = block.querySelector("button");

        if (btn && btn.innerText.toLowerCase().includes("buy")) {

          btn.click();
          clicked = true;
          running = false;

          console.log("⚡ CLICKED:", target);

          setTimeout(() => {
            document.querySelectorAll("button").forEach(b => {
              const t = b.innerText.toLowerCase();
              if (t.includes("upi") || t.includes("pay") || t.includes("mobikwik")) {
                b.click();
                console.log("💳 PAYMENT CLICKED");
              }
            });
          }, 1000);

          break;
        }
      }
    }

  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

};
