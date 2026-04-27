window.startBot = async function () {

  console.log("🔥 BOT CORE STARTED");

  const load = (src) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });

  await load("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
  await load("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");

  // ✅ YOUR REAL CONFIG
  const firebaseConfig = {
    apiKey: "AIzaSyC7QAIYPrf94wzOBeNvGYk9wJ6HY08urA0",
    authDomain: "wallet-automation-695b2.firebaseapp.com",
    projectId: "wallet-automation-695b2",
    storageBucket: "wallet-automation-695b2.firebasestorage.app",
    messagingSenderId: "1062830743833",
    appId: "1:1062830743833:web:e2e3df4587b106443c2588",
    measurementId: "G-VRN0V2WG8X"
  };

  // prevent duplicate init
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore();

  console.log("✅ Firebase Connected");

  let running = false;
  let target = null;

  // 🔥 COMMAND LISTENER
  db.collection("commands").doc("control")
    .onSnapshot(doc => {
      const data = doc.data();
      if (!data) return;

      console.log("📡 COMMAND:", data);

      if (data.action === "start") {
        running = true;
        target = String(data.amount);
      }

      if (data.action === "stop") {
        running = false;
      }
    });

  const clean = (t) => (t || "").replace(/[^\d]/g, "");

  // 🔥 MAIN LOOP
  setInterval(() => {

    if (!running || !target) return;

    let clicked = false;

    const blocks = document.querySelectorAll("div, li");

    for (let block of blocks) {

      if (clicked) break;

      const text = clean(block.innerText);

      if (text.includes(target)) {

        const btns = block.querySelectorAll("button");

        for (let btn of btns) {

          if (btn.innerText.toLowerCase().includes("buy")) {

            btn.click();
            clicked = true;
            running = false;

            console.log("🛒 CLICKED:", target);

            // 💳 payment click
            setTimeout(() => {
              document.querySelectorAll("button").forEach(b => {
                const t = b.innerText.toLowerCase();

                if (t.includes("upi") || t.includes("pay") || t.includes("mobikwik")) {
                  b.click();
                  console.log("💳 PAYMENT CLICKED");
                }
              });
            }, 1200);

            break;
          }
        }
      }
    }

    if (!clicked) {
      console.log("❌ No match:", target);
    }

  }, 700);

};
