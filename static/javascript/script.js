// ---- Sidebar user account (Base44 style) ----
// Paste at the very bottom of your existing static/javascript/script.js
(function () {
  const USER = { name: "", email: "" }; // change these

  const css = `
    .uc-side{margin-top:auto;padding:16px 18px 18px;border-top:1px solid rgba(255,255,255,.12);
      display:grid;gap:12px;font-family:inherit;color:#fff}
    .uc-side .uc-status{justify-self:start;display:inline-flex;align-items:center;gap:8px;
      padding:7px 14px;border-radius:99px;background:rgba(255,255,255,.1);font-size:13px;font-weight:600}
    .uc-side .uc-dot{width:8px;height:8px;border-radius:50%;background:#ef4444}
    .uc-side .uc-status.on .uc-dot{background:#3ecf8e}
    .uc-side .uc-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
    .uc-side b{display:block;font-size:15px;line-height:1.3}
    .uc-side small{display:block;font-size:13px;color:#aebaf0;word-break:break-all}
    .uc-side button{flex:none;width:36px;height:36px;border:0;border-radius:10px;background:transparent;
      color:#cdd5f7;cursor:pointer;display:grid;place-items:center}
    .uc-side button:hover{background:rgba(255,255,255,.1)}
    .uc-side svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;
      stroke-linecap:round;stroke-linejoin:round}
    .uc-float{position:fixed;left:0;bottom:0;width:272px;z-index:50;background:#10163f}`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const box = document.createElement("div");
  box.className = "uc-side";
  box.innerHTML =
    '<span class="uc-status"><i class="uc-dot"></i><span>API offline</span></span>' +
    '<div class="uc-row"><div><b></b><small></small></div>' +
    '<button type="button" aria-label="Sign out"><svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg></button></div>';
  box.querySelector("b").textContent = USER.name;
  box.querySelector("small").textContent = USER.email;
  box.querySelector("button").onclick = () => {
    const msg = "Signed out (demo account)";
    typeof toast === "function" ? toast(msg) : alert(msg);
  };

  function mount() {
    // Goes at the bottom of your sidebar; floats bottom-left if none is found.
    const side = document.querySelector("#sidebar, aside.sidebar, .sidebar, aside");
    if (side) side.appendChild(box);
    else { box.classList.add("uc-float"); document.body.appendChild(box); }

    // Live API status chip, like "API offline" in the layout.
    const base = typeof API_BASE !== "undefined" ? API_BASE : "";
    const chip = box.querySelector(".uc-status");
    fetch(base + "/api/stats")
      .then((r) => { if (!r.ok) throw 0; chip.classList.add("on"); chip.lastChild.textContent = "API online"; })
      .catch(() => {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
