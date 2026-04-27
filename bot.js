window.startBot = async function () {

  console.log("🔥 Bot Core Started");

  // load firebase
  function load(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  await load("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
  await load("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  console.log("✅ Firebase Connected");

  let running = false;
  let target = null;

  // listen commands
  db.collection("commands").doc("control")
    .onSnapshot(doc => {
      const data = doc.data();
      if (!data) return;

      console.log("📡 CMD:", data);

      if (data.action === "start") {
        running = true;
        target = String(data.amount);
      }

      if (data.action === "stop") {
        running = false;
      }
    });

  const clean = t => (t || "").replace(/[^\d]/g, "");

  // main loop
  setInterval(() => {
    if (!running || !target) return;

    let clicked = false;

    document.querySelectorAll("div").forEach(block => {
      if (clicked) return;

      if (clean(block.innerText).includes(target)) {
        const btn = block.querySelector("button");

        if (btn && btn.innerText.toLowerCase().includes("buy")) {
          btn.click();
          clicked = true;
          running = false;

          console.log("🛒 CLICKED:", target);
        }
      }
    });

  }, 700);

};
