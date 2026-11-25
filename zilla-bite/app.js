/* Zilla Bite: menu, cart and WhatsApp ordering.
   PRICES ARE PLACEHOLDERS — confirm with the restaurant and edit the numbers below. */
const WA = "923278499197";

/* EasyPaisa / JazzCash accounts — CONFIRM with the restaurant before going live. */
const PAY = {
  EasyPaisa: { number: "0327-8499197", title: "Zilla Bite" },
  JazzCash: { number: "0327-8499197", title: "Zilla Bite" },
};

const TABS = [
  ["sizzlers", "Steaks & Sizzlers"],
  ["chinese", "Chinese"],
  ["pizza", "Pizza"],
  ["fast", "Fast Food"],
  ["drinks", "Drinks"],
];

const MENU = [
  { id: "twin-steaks", cat: "sizzlers", name: "Twin Steaks", tag: "Bestseller", price: 1650, img: "img/steakcover.webp", desc: "Two chicken steaks, cheese sauce, garlic mayo, fries & sautéed beans on a sizzling plate" },
  { id: "chicken-sizzler", cat: "sizzlers", name: "Chicken Sizzler", tag: "Smoky", price: 1450, img: "img/sizzlerfries.webp", desc: "Grilled chicken in house sauce with fries, served smoking on an iron plate", sig: "Served sizzling" },
  { id: "beef-sizzler", cat: "sizzlers", name: "Beef Pepper Sizzler", price: 1750, img: "img/sizzlercover.webp", desc: "Beef strips, capsicum, onion, green beans and sesame on a sizzling board" },
  { id: "mexican-steak", cat: "sizzlers", name: "Mexican Steak", price: 1450, icon: "🥩", desc: "Spicy Mexican-style chicken steak with rice or fries" },
  { id: "mushroom-steak", cat: "sizzlers", name: "Mushroom Steak", price: 1450, icon: "🍄", desc: "Chicken steak under creamy mushroom sauce" },

  { id: "chilli-dry-rice", cat: "chinese", name: "Chicken Chilli Dry with Rice", tag: "Fan favourite", price: 950, img: "img/chillidry.webp", desc: "Crispy chicken tossed with green chilli & capsicum, with egg fried rice", sig: "Fan favourite" },
  { id: "manchurian-rice", cat: "chinese", name: "Chicken Manchurian with Rice", price: 950, img: "img/manchurian.webp", desc: "Sweet & tangy Manchurian with egg fried rice", sig: "Sweet & tangy" },
  { id: "chowmein", cat: "chinese", name: "Chicken Chowmein", price: 850, icon: "🍜", desc: "Wok-tossed noodles with chicken and vegetables" },
  { id: "egg-rice", cat: "chinese", name: "Egg Fried Rice", price: 650, icon: "🍚", desc: "Fluffy rice wok-fried with egg and spring onion" },
  { id: "hot-sour", cat: "chinese", name: "Hot & Sour Soup", price: 450, icon: "🥣", desc: "Classic spicy-tangy soup, one bowl" },

  { id: "zilla-pizza", cat: "pizza", name: "Zilla Special Pizza (Medium)", tag: "House special", price: 1299, img: "img/pizza.webp", desc: "Loaded with chicken, olives, onion, capsicum and extra cheese", sig: "Fresh from the oven" },
  { id: "tikka-pizza", cat: "pizza", name: "Chicken Tikka Pizza (Medium)", price: 1199, icon: "🍕", desc: "Desi tikka chicken, onion and mozzarella" },
  { id: "fajita-pizza", cat: "pizza", name: "Chicken Fajita Pizza (Medium)", price: 1199, icon: "🍕", desc: "Fajita chicken, peppers and mozzarella" },
  { id: "zilla-pizza-l", cat: "pizza", name: "Zilla Special Pizza (Large)", price: 1799, icon: "🍕", desc: "The house special, family size" },

  { id: "zinger", cat: "fast", name: "Zinger Burger", price: 550, icon: "🍔", desc: "Crispy fried chicken fillet, lettuce and mayo" },
  { id: "loaded-fries", cat: "fast", name: "Loaded Fries", price: 550, icon: "🍟", desc: "Fries topped with chicken, cheese sauce and jalapeños" },
  { id: "nuggets", cat: "fast", name: "Chicken Nuggets (6 pcs)", price: 500, icon: "🍗", desc: "Golden nuggets with dip" },
  { id: "fries", cat: "fast", name: "Plain Fries", price: 250, icon: "🍟", desc: "Crispy salted fries" },

  { id: "mint-marg", cat: "drinks", name: "Mint Margarita", price: 350, icon: "🍹", desc: "Fresh mint and lemon, blended with ice" },
  { id: "soft-drink", cat: "drinks", name: "Soft Drink (345ml)", price: 150, icon: "🥤", desc: "Coke, Sprite or Fanta" },
  { id: "water", cat: "drinks", name: "Mineral Water (small)", price: 100, icon: "💧", desc: "" },
];

const byId = Object.fromEntries(MENU.map((m) => [m.id, m]));
const rs = (n) => "Rs " + n.toLocaleString("en-PK");
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
/* iPhone Safari only turns a tap on a plain card into a click if the card has its own click
   listener. The real work happens in the document listener below; this just makes the tap count. */
const tapReady = () => $$("[data-item]").forEach((el) => {
  if (!el.dataset.tapReady) { el.addEventListener("click", () => {}); el.dataset.tapReady = "1"; }
});
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let cart = {};
try { cart = JSON.parse(localStorage.getItem("zilla-cart")) || {}; } catch { cart = {}; }
for (const id in cart) if (!byId[id]) delete cart[id];

/* Add button, or − qty + once the item is in the order */
function ctlInner(id) {
  const n = cart[id] || 0;
  const name = esc(byId[id].name);
  return n
    ? `<span class="step"><button type="button" data-dec="${id}" aria-label="Remove one ${name}">−</button><b>${n}</b><button type="button" data-inc="${id}" aria-label="Add one more ${name}">+</button></span>`
    : `<button class="add" type="button" data-add="${id}">Add <span>+</span></button>`;
}
const ctl = (id) => `<span class="ctl" data-ctl="${id}">${ctlInner(id)}</span>`;

/* ---------- signature cards & prices ---------- */
$$("[data-price-of]").forEach((el) => (el.textContent = rs(byId[el.dataset.priceOf].price)));
$("[data-sig]").innerHTML = MENU.filter((m) => m.sig)
  .map((m) => `<article class="card reveal" data-item="${m.id}">
    <div class="ph"><img src="${m.img}" alt="${esc(m.name)}" loading="lazy"><span class="badge">${esc(m.sig)}</span></div>
    <div class="cb"><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p>
    <div class="buy"><b class="price">${rs(m.price)}</b>${ctl(m.id)}</div></div>
  </article>`)
  .join("");
tapReady();

/* ---------- menu ---------- */
let tab = TABS[0][0];
let q = "";
const tabsEl = $("[data-tabs]");
tabsEl.innerHTML = TABS.map(([k, l]) => `<button role="tab" type="button" data-tab="${k}" aria-selected="${k === tab}">${l}</button>`).join("");

function renderMenu() {
  const list = q
    ? MENU.filter((m) => (m.name + " " + m.desc).toLowerCase().includes(q))
    : MENU.filter((m) => m.cat === tab);
  $("[data-menu]").innerHTML = list.length
    ? list.map((m) => `<div class="item" data-item="${m.id}">
        ${m.img ? `<img src="${m.img}" alt="" loading="lazy">` : `<div class="ic" aria-hidden="true">${m.icon}</div>`}
        <div class="t"><h3>${esc(m.name)}${m.tag ? `<small>${esc(m.tag)}</small>` : ""}</h3>${m.desc ? `<p>${esc(m.desc)}</p>` : ""}</div>
        <div class="r"><b>${rs(m.price)}</b>${ctl(m.id)}</div>
      </div>`).join("")
    : `<p class="nores">Nothing found for “${esc(q)}”. Ask us on WhatsApp, we might still make it!</p>`;
  tapReady();
}
function setTab(k) {
  tab = k;
  $$("[data-tab]").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === k));
  renderMenu();
}
tabsEl.addEventListener("click", (e) => {
  const b = e.target.closest("[data-tab]");
  if (!b) return;
  q = "";
  $("[data-search]").value = "";
  setTab(b.dataset.tab);
});
$("[data-search]").addEventListener("input", (e) => {
  q = e.target.value.trim().toLowerCase();
  renderMenu();
});
$$("[data-tab-link]").forEach((a) => a.addEventListener("click", () => setTab(a.dataset.tabLink)));
renderMenu();

/* ---------- cart ---------- */
const drawer = $("[data-drawer]");
const toastEl = $("[data-toast]");
let toastT;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove("on"), 1800);
}
function save() { try { localStorage.setItem("zilla-cart", JSON.stringify(cart)); } catch (err) { /* storage blocked: cart lives in memory */ } }
function total() { return Object.entries(cart).reduce((s, [id, n]) => s + byId[id].price * n, 0); }
function renderCart() {
  const n = Object.values(cart).reduce((a, b) => a + b, 0);
  $$("[data-count]").forEach((c) => { c.textContent = n; c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); });
  const ids = Object.keys(cart);
  $("[data-empty]").hidden = ids.length > 0;
  $("[data-lines]").hidden = ids.length === 0;
  $("[data-checkout]").hidden = ids.length === 0;
  $("[data-lines]").innerHTML = ids.map((id) => {
    const m = byId[id];
    return `<div class="line"><div class="n">${esc(m.name)}<small>${rs(m.price)} each</small></div>
      <div class="qty"><button type="button" data-dec="${id}" aria-label="Remove one ${esc(m.name)}">−</button><b>${cart[id]}</b><button type="button" data-inc="${id}" aria-label="Add one ${esc(m.name)}">+</button></div></div>`;
  }).join("");
  $("[data-total]").textContent = rs(total());
  if (typeof syncForm === "function") syncForm();
  $$("[data-ctl]").forEach((c) => (c.innerHTML = ctlInner(c.dataset.ctl)));
}
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) { addOne(add.dataset.add); return; }
  const inc = e.target.closest("[data-inc]");
  if (inc) { cart[inc.dataset.inc]++; save(); renderCart(); return; }
  const dec = e.target.closest("[data-dec]");
  if (dec) { const id = dec.dataset.dec; if (--cart[id] <= 0) delete cart[id]; save(); renderCart(); return; }
  if (e.target.closest("[data-open-cart]")) { drawer.hidden = false; document.body.style.overflow = "hidden"; $(".x", drawer).focus(); return; }
  if (e.target.closest("[data-close-cart]")) { closeCart(); return; }
  const item = e.target.closest("[data-item]");
  if (item && !e.target.closest("button, a, input, .ctl")) addOne(item.dataset.item);
});
function addOne(id) { cart[id] = (cart[id] || 0) + 1; save(); renderCart(); toast(`${byId[id].name} added ✓`); }
function closeCart() { drawer.hidden = true; document.body.style.overflow = ""; }
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) closeCart(); });

const form = $("[data-checkout]");
function syncForm() {
  const mode = form.mode.value, pay = form.pay.value;
  form.addr.required = mode === "Delivery";
  form.addr.placeholder = mode === "Delivery" ? "Delivery address *" : mode === "Dine-in" ? "Table no. / arrival time (optional)" : "Pickup time (optional)";
  const box = $("[data-paybox]");
  box.hidden = !PAY[pay];
  if (PAY[pay]) box.innerHTML = `<b>${pay}</b> account: <strong>${PAY[pay].number}</strong> (${esc(PAY[pay].title)})<br>Send <b>${rs(total())}</b>, then share the payment screenshot in the WhatsApp chat.`;
}
form.addEventListener("change", syncForm);
form.addEventListener("input", (e) => { e.target.classList.remove("bad"); $("[data-form-err]").hidden = true; });
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(form);
  const name = f.get("name").trim(), phone = f.get("phone").trim(), addr = f.get("addr").trim(), note = f.get("note").trim();
  const mode = f.get("mode"), pay = f.get("pay");
  const errEl = $("[data-form-err]");
  const bad = (el, msg) => {
    errEl.textContent = msg; errEl.hidden = false;
    el.after(errEl);                                   // show the message right under the field to fix
    $$(".bad", form).forEach((x) => x.classList.remove("bad")); el.classList.add("bad");
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.focus({ preventScroll: true });
  };
  if (!name) return bad(form.name, "Please enter your name");
  if (!/^(\+?92|0)3\d{9}$/.test(phone.replace(/[\s-]/g, ""))) return bad(form.phone, "Enter a valid mobile number, e.g. 0300-1234567");
  if (mode === "Delivery" && !addr) return bad(form.addr, "Please enter your delivery address");
  const lines = Object.entries(cart).map(([id, n]) => `• ${n} × ${byId[id].name} = ${rs(byId[id].price * n)}`);
  const msg = [
    "Assalam o Alaikum Zilla Bite! 💚",
    `New *${mode}* order:`,
    "",
    ...lines,
    "",
    `*Total: ${rs(total())}*`,
    `Payment: ${pay}${PAY[pay] ? " (I will send the screenshot here)" : ""}`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    addr ? `${mode === "Delivery" ? "Address" : "Details"}: ${addr}` : "",
    note ? `Note: ${note}` : "",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
  try { localStorage.setItem("zilla-customer", JSON.stringify({ name, phone, addr })); } catch {}
  $("[data-form-err]").hidden = true;
  const url = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const w = window.open(url, "_blank");
  if (w) { try { w.opener = null; } catch (err) { /* ignore */ } } else { location.href = url; }
});
try { const c = JSON.parse(localStorage.getItem("zilla-customer")) || {}; for (const k of ["name", "phone", "addr"]) if (c[k]) form[k].value = c[k]; } catch {}
renderCart();

/* ---------- header, reveal, lazy video ---------- */
const header = $(".site");
const onScroll = () => header.classList.toggle("solid", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

$$(".head, .feature, .split, .fam-grid, .gallery, .visit, .item").forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
const watchReveal = () => $$(".reveal:not(.in)").forEach((el) => io.observe(el));
watchReveal();
new MutationObserver(watchReveal).observe($("[data-menu]"), { childList: true });

const vo = new IntersectionObserver((es) => es.forEach((en) => {
  const v = en.target;
  if (en.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
}), { threshold: 0.25 });
$$("video[data-autoplay]").forEach((v) => vo.observe(v));
