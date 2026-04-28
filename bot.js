window.startBot = function () {

  console.log("🔥 BOT CORE STARTED");

  let uiRunning = false;
  let uiTarget = "";

  // ===== 🔐 FIREBASE CONFIG =====
  const firebaseConfig = {
    apiKey: "AIzaSyC7QAIYPrf94wzOBeNvGYk9wJ6HY08urA0",
    authDomain: "wallet-automation-695b2.firebaseapp.com",
    projectId: "wallet-automation-695b2"
  };

  // ===== 🔌 LOAD FIREBASE =====
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

    // ===== 🎯 FIREBASE LISTENER (optional control) =====
    db.collection("commands").doc("control")
      .onSnapshot(doc => {

        const data = doc.data();
        if (!data) return;

        console.log("📡 COMMAND:", data);

        if (data.action === "target_buy") {
          uiTarget = data.amount;
          uiRunning = true;
          updateStatus("REMOTE → " + uiTarget);
        }

        if (data.action === "stop") {
          uiRunning = false;
          updateStatus("STOPPED (REMOTE)");
        }

      });

  });

  // ===== 🧩 UI PANEL =====
  (function createUI(){

    const box = document.createElement("div");
    box.style = `
      position:fixed;
      bottom:20px;
      right:20px;
      background:#111;
      color:#fff;
      padding:12px;
      border-radius:10px;
      z-index:99999;
      font-size:12px;
      width:200px;
      box-shadow:0 0 10px rgba(0,0,0,0.5);
    `;

    box.innerHTML = `
      <div style="margin-bottom:6px;">🔥 AUTO BOT</div>
      <input id="amt" placeholder="Enter Amount" 
        style="width:100%;margin-bottom:6px;padding:4px;" />
      <button id="startBtn" style="width:100%;margin-bottom:4px;">▶ Start</button>
      <button id="stopBtn" style="width:100%;">⏹ Stop</button>
      <div id="status" style="margin-top:6px;font-size:10px;color:#0f0;">IDLE</div>
    `;

    document.body.appendChild(box);

    window.updateStatus = (txt) => {
      document.getElementById("status").innerText = txt;
    };

    document.getElementById("startBtn").onclick = () => {
      const val = document.getElementById("amt").value;

      if (!val) return alert("Enter amount");

      uiTarget = val;
      uiRunning = true;

      updateStatus("RUNNING → " + val);

      console.log("▶ START:", val);
    };

    document.getElementById("stopBtn").onclick = () => {
      uiRunning = false;
      uiTarget = "";

      updateStatus("STOPPED");

      console.log("⏹ STOPPED");
    };

  })();

  // ===== 💳 PAYMENT SELECT =====
  function selectPayment() {

    console.log("💳 Searching payment...");

    let paid = false;

    document.querySelectorAll("div").forEach(block => {

      if (paid) return;

      const text = (block.innerText || "").toLowerCase();

      if (
        text.includes("mobikwik") ||
        text.includes("phonepe") ||
        text.includes("super") ||
        text.includes("upi")
      ) {

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

  // ===== ⚡ MAIN AUTO ENGINE =====
  setInterval(() => {

    if (!uiRunning || !uiTarget) return;

    let clicked = false;

    const buttons = document.querySelectorAll("button");

    buttons.forEach(btn => {

      if (clicked) return;

      const btnText = (btn.innerText || "").toLowerCase();

      if (btnText.includes("buy")) {

        let container = btn.closest("div");

        for (let i = 0; i < 3; i++) {
          if (container && !container.innerText.includes(uiTarget)) {
            container = container.parentElement;
          }
        }

        if (!container) return;

        const text = (container.innerText || "").replace(/[^\d]/g, "");

        if (text.includes(uiTarget)) {

          btn.click();
          clicked = true;

          updateStatus("CLICKED → " + uiTarget);

          console.log("⚡ CLICKED:", uiTarget);

          setTimeout(selectPayment, 600);
        }

      }

    });

  }, 300);

};
