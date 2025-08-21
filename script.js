// ====== ⭐ Falling Stars (canvas) ======
(() => {
  const c = document.getElementById("stars");
  const ctx = c.getContext("2d");
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  let W, H, stars;

  function resize() {
    W = c.width = Math.floor(innerWidth * DPR);
    H = c.height = Math.floor(innerHeight * DPR);
    c.style.width = innerWidth + "px";
    c.style.height = innerHeight + "px";
    // build star field
    const count = Math.floor((innerWidth * innerHeight) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 * DPR,
      s: 0.4 * DPR + Math.random() * 1.6 * DPR
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.y += s.s;
      if (s.y > H) { s.y = -5; s.x = Math.random() * W; }
    }
    requestAnimationFrame(draw);
  }
  addEventListener("resize", resize);
  resize(); draw();
})();

// ====== 🎵 Music Toggle ======
(() => {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");
  btn.addEventListener("click", () => {
    if (audio.paused) { audio.play(); btn.textContent = "🔊 Pause"; }
    else { audio.pause(); btn.textContent = "▶️ Play"; }
  });
})();

// ====== 🌍 Build Place Cards with Tap-to-Reveal + ❤️ burst ======
(() => {
  const container = document.getElementById("places");

  PLACES.forEach(({ name, imgLeft, imgRight, quote }, idx) => {
    const section = document.createElement("section");
    section.className = "place";

    section.innerHTML = `
      <h2>✈️ ${name}</h2>
      <div class="row">
        <img src="images/${imgLeft}" alt="${name} photo left" />
        <div class="btnBox" style="justify-self:center">
          <button class="btn" data-index="${idx}">Tap to Reveal 💗</button>
          <p class="quote"><span class="typewriter"></span></p>
        </div>
        <img src="images/${imgRight}" alt="${name} photo right" />
      </div>
    `;

    const btn = section.querySelector(".btn");
    const qEl = section.querySelector(".quote");
    const tw = section.querySelector(".typewriter");

    btn.addEventListener("click", () => {
      // reveal with typewriter
      qEl.style.display = "block";
      typeWriter(tw, quote, 18);
      // heart burst
      burstHearts(btn.closest(".place"));
      // hide button after first reveal
      btn.style.display = "none";
      // if last card, show final message after a tiny delay
      if (idx === PLACES.length - 1) {
        setTimeout(showFinal, 1200);
      }
    });

    container.appendChild(section);
  });
})();

// ====== ⌨️ Typewriter helper ======
function typeWriter(target, text, speed=20){
  target.textContent = "";
  let i = 0;
  (function tick(){
    if(i <= text.length){
      target.textContent = text.slice(0, i);
      i++;
      setTimeout(tick, speed);
    }
  })();
}

// ====== ❤️ Hearts Burst ======
function burstHearts(scope){
  const N = 20;
  const rect = scope.getBoundingClientRect();
  for(let i=0;i<N;i++){
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = Math.random() > .5 ? "❤️" : "💖";
    h.style.left = (rect.left + rect.width/2 + (Math.random()*140-70)) + "px";
    h.style.top  = (rect.top + window.scrollY + rect.height/2 + 20) + "px";
    h.style.fontSize = (14 + Math.random()*18) + "px";
    document.body.appendChild(h);
    setTimeout(()=>h.remove(), 3400);
  }
}

// ====== 💌 Final message (type + glow) ======
function showFinal(){
  const el = document.getElementById("finalQuote");
  typeWriter(el, "💖 " + FINAL_MESSAGE, 22);
}
