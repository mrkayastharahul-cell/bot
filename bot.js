window.startBot = function () {

  console.log("🔥 BOT CORE STARTED");

  const firebaseConfig = {
    apiKey: "AIzaSyC7QAIYPrf94wzOBeNvGYk9wJ6HY08urA0",
    authDomain: "wallet-automation-695b2.firebaseapp.com",
    projectId: "wallet-automation-695b2",
    storageBucket: "wallet-automation-695b2.firebasestorage.app",
    messagingSenderId: "1062830743833",
    appId: "1:1062830743833:web:e2e3df4587b106443c2588",
    measurementId: "G-VRN0V2WG8X"
  };

  function loadFirebase() {
    return new Promise((resolve) => {
      if (window.firebase) return resolve();

      const s1 = document.createElement("script");
      s1.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";

      const s2 = document.createElement("script");
      s2.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

      s1.onload = () => document.body.appendChild(s2);
      s2.onload = () => resolve();

      document.body.appendChild(s1);
    });
  }

  loadFirebase().then(() => {

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    console.log("✅ Firebase Connected");

    let target = "";

    // 🎯 Listen Firebase
    db.collection("commands").doc("control")
      .onSnapshot(doc => {

        const data = doc.data();
        if (!data) return;

        console.log("📡 COMMAND:", data);

        if (data.action === "target_buy") {
          target = data.amount;
          console.log("🎯 TARGET SET:", target);
          findAndBuy(target);
        }

      });

    // 🧠 Clean text
    function clean(text) {
      return text.replace(/[^\d]/g, "");
    }

    // 🔍 Find and click Buy
    function findAndBuy(targetAmount) {

      let clicked = false;

      const blocks = document.querySelectorAll("div, li");

      blocks.forEach(block => {

        if (clicked) return;

        const text = clean(block.innerText || "");

        if (text.includes(targetAmount)) {

          const btn = block.querySelector("button");

          if (btn && btn.innerText.toLowerCase().includes("buy")) {

            btn.click();
            clicked = true;

            console.log("⚡ CLICKED:", targetAmount);

            setTimeout(selectPayment, 700);
          }
        }
      });

      if (!clicked) {
        console.log("❌ No match for:", targetAmount);
      }
    }

    // 💳 STRONG PAYMENT SELECT (FINAL FIX)
    function selectPayment() {

      console.log("💳 Searching payment options...");

      let paid = false;

      const blocks = document.querySelectorAll("div");

      blocks.forEach(block => {

        if (paid) return;

        const text = (block.innerText || "").toLowerCase();

        if (
          text.includes("mobikwik") ||
          text.includes("phonepe") ||
          text.includes("super") ||
          text.includes("upi")
        ) {

          // 🔥 Force click (works on tricky UI)
          block.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
          }));

          paid = true;

          console.log("💳 PAYMENT CLICKED:", text.slice(0, 50));
        }

      });

      if (!paid) {
        console.log("❌ No payment option found");
      }
    }

  });

};
