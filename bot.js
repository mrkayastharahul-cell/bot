const clean = (t) => (t || "").replace(/[^\d]/g, "");

const observer = new MutationObserver(() => {

  if (!running || !target) return;

  let clicked = false;

  const blocks = document.querySelectorAll("div, li");

  for (let block of blocks) {

    if (clicked) break;

    const text = clean(block.innerText);

    // 🔥 EXACT MATCH (not loose match)
    if (text === target || text.includes(target)) {

      const btn = block.querySelector("button");

      if (btn && btn.innerText.toLowerCase().includes("buy")) {

        btn.click();
        clicked = true;
        running = false;

        console.log("⚡ INSTANT CLICK:", target);

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

// 🔥 WATCH PAGE CHANGES
observer.observe(document.body, {
  childList: true,
  subtree: true
});
