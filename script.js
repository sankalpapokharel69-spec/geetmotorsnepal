/* ============================================================
   GEET MOTORS NEPAL — script.js
   Smooth scroll • Reveal animations • Product grid with
   local images (product-1.jpg ... product-15.jpg)
   WhatsApp booking form • Toast notifications
   ============================================================ */
"use strict";
/* ================= CONFIG ================= */
const CONFIG = {
  WHATSAPP: "9779857035112"
};

/* ================= HELPERS ================= */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

const esc = (str) =>
  String(str ?? "").replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  $("#toastMsg").textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3400);
}

const waLink = (text) =>
  `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(text)}`;

const catLabel = (cat) =>
  ({ ceramic: "Ceramic Coating", detailing: "Detailing & Care", interior: "Interior Care" }[cat] || "Service");

/* ================= PRODUCTS =================
   Images are LOCAL files in the same folder:
   product-1.jpg, product-2.jpg, product-3.jpg ... product-15.jpg   */
const PRODUCTS = [
  { name: "System X Crystal SS Ceramic Coating", cat: "ceramic", price: "On Request", duration: "Multi-Layer Protection",
    img: "product-1.jpg",
    desc: "Brilliant wet-look gloss, strong hydrophobic self-cleaning effect and UV resistance — perfect for daily drivers." },
  { name: "System X Diamond SS Ceramic Coating", cat: "ceramic", price: "On Request", duration: "Lifetime Warranty",
    img: "product-2.jpg",
    desc: "Our flagship lifetime coating — certified protection against minor scratches, fading, yellowing and loss of gloss. Never wax again." },
  { name: "System X Max G+ Ceramic Coating", cat: "ceramic", price: "On Request", duration: "Extended Durability",
    img: "product-3.jpg",
    desc: "Maximum gloss + glass technology for paint, glass, wheels and trims with superior UV and chemical resistance." },
  { name: "Graphene Matrix Coating", cat: "ceramic", price: "On Request", duration: "Self-Healing Tech",
    img: "product-4.jpg",
    desc: "Advanced self-healing graphene technology — glossier than showroom finish with extreme hydrophobic water beading." },
  { name: "Interior Steam Cleaning And Coating", cat: "interior", price: "On Request", duration: "Sanitized & Sealed",
    img: "product-5.jpg",
    desc: "Deep steam sanitation of cabin and upholstery sealed with fabric ceramic protection against stains, spills and odors." },
  { name: "Chemical Wash, Hard Water & Tar Removal", cat: "detailing", price: "On Request", duration: "Same Day Service",
    img: "product-6.jpg",
    desc: "Safe chemical decontamination that dissolves tar, hard-water spots and road grime without harming the paint." },
  { name: "Alloy Wheels Cleaning", cat: "detailing", price: "On Request", duration: "Same Day Service",
    img: "product-7.jpg",
    desc: "Deep wheel cleaning that removes brake dust, grease and embedded dirt from alloy rims." },
  { name: "Scratches & Paint Correction", cat: "detailing", price: "On Request", duration: "Multi-Stage Process",
    img: "product-8.jpg",
    desc: "Multi-stage machine correction that removes swirls, scratches and oxidation for flawless paint." },
  { name: "Fine Polishing", cat: "detailing", price: "On Request", duration: "Mirror Finish",
    img: "product-9.jpg",
    desc: "Ultra-fine finishing polish for a flawless, mirror-like showroom shine every time." },
  { name: "Glass Polishing", cat: "detailing", price: "On Request", duration: "Crystal Clear",
    img: "product-10.jpg",
    desc: "Removes hard-water spots and film from windscreen and windows for perfect visibility." },
  { name: "Ceramic Topup (6–9 Months Life)", cat: "detailing", price: "On Request", duration: "6–9 Months Life",
    img: "product-11.jpg",
    desc: "Quick ceramic refresh that restores gloss and hydrophobic performance between full coatings." },
  { name: "Interior Full Steam Cleaning & Ceramic Coating", cat: "interior", price: "On Request", duration: "Full Cabin Care",
    img: "product-12.jpg",
    desc: "Complete cabin steam sanitation finished with ceramic fabric protection for seats, roof and carpets." },
  { name: "Plastic Trims Dressing", cat: "detailing", price: "On Request", duration: "Like-New Finish",
    img: "product-13.jpg",
    desc: "Restores faded plastic trims back to a rich, like-new satin finish." },
  { name: "Engine Bay Dressing", cat: "detailing", price: "On Request", duration: "Showroom Ready",
    img: "product-14.jpg",
    desc: "Safe steam cleaning and dressing for a clean, protected and showroom-ready engine bay." },
  { name: "Tyre Dressing", cat: "detailing", price: "On Request", duration: "Deep Black Shine",
    img: "product-15.jpg",
    desc: "Deep-black, long-lasting satin finish that makes your tyres look brand new." }
];

/* ================= STATE ================= */
let currentFilter = "all";

/* ================= PRODUCTS (PUBLIC GRID) ================= */
function attachImgFallbacks(scope) {
  $$("img", scope).forEach((img) => {
    const swap = () => {
      if (img.dataset.replaced) return;
      img.dataset.replaced = "1";
      const fb = document.createElement("div");
      fb.className = "img-fallback";
      fb.innerHTML = '<i class="fa-solid fa-car-side"></i>';
      img.replaceWith(fb);
    };
    img.addEventListener("error", swap);
    if (img.complete && img.naturalWidth === 0) swap();
  });
}

function renderProducts(filter = "all") {
  const grid = $("#productGrid");
  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-box-open" style="font-size:1.6rem;display:block;margin-bottom:8px;color:rgba(249,115,22,.6)"></i>No products in this category yet.</div>`;
    return;
  }

  grid.innerHTML = list.map((p, i) => `
    <article class="product-card pop" style="animation-delay:${Math.min(i * 60, 360)}ms">
      <div class="product-media">
        <img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">
        <span class="badge">${esc(catLabel(p.cat))}</span>
      </div>
      <div class="product-body">
        <h3>${esc(p.name)}</h3>
        ${p.duration ? `<p class="p-dur"><i class="fa-solid fa-clock"></i>${esc(p.duration)}</p>` : ""}
        ${p.desc ? `<p class="p-desc">${esc(p.desc)}</p>` : ""}
        <div class="product-foot">
          <span class="price">${esc(p.price || "On Request")}</span>
          <a class="btn-book" target="_blank" rel="noopener"
             href="${waLink(`Hello Geet Motors Nepal! I am interested in booking: ${p.name}`)}">
            <i class="fa-brands fa-whatsapp"></i> Book Now
          </a>
        </div>
      </div>
    </article>
  `).join("");

  attachImgFallbacks(grid);
}

$("#filterTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  $$(".tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  currentFilter = tab.dataset.filter;
  renderProducts(currentFilter);
});

/* ================= BOOKING FORM → WHATSAPP ================= */
$("#bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name    = $("#cName").value.trim();
  const phone   = $("#cPhone").value.trim();
  const vehicle = $("#cVehicle").value.trim();
  const service = $("#cService").value;
  const message = $("#cMessage").value.trim();
  const err     = $("#formError");

  if (!name || !phone || !message) {
    err.classList.remove("show");
    void err.offsetWidth; /* restart shake animation */
    err.classList.add("show");
    (!name ? $("#cName") : !phone ? $("#cPhone") : $("#cMessage")).focus();
    return;
  }
  err.classList.remove("show");

  /* Open WhatsApp with prefilled booking */
  const text = [
    "Hello Geet Motors Nepal!",
    "",
    "*New Service Booking*",
    `Name: ${name}`,
    `Phone: ${phone}`,
    vehicle ? `Vehicle: ${vehicle}` : "",
    `Service: ${service}`,
    `Message: ${message}`
  ].filter(Boolean).join("\n");
  window.open(waLink(text), "_blank");

  e.target.reset();
  toast("Booking sent! Opening WhatsApp…");
});

/* ================= NAVBAR / SCROLL / REVEAL ================= */
function onScroll() {
  const y = window.scrollY;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  $("#scrollProgress").style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  $("#navbar").classList.toggle("scrolled", y > 12);
  $("#toTop").classList.toggle("show", y > 420);

  /* Active nav link */
  let current = "home";
  $$("section[id]").forEach((sec) => {
    if (y >= sec.offsetTop - 130) current = sec.id;
  });
  $$(".nav-link").forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll, { passive: true });

$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* Hamburger menu */
const hamburger = $("#hamburger");
const navLinksEl = $("#navLinks");
hamburger.addEventListener("click", () => {
  const open = navLinksEl.classList.toggle("open");
  hamburger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
$$(".nav-link").forEach((a) =>
  a.addEventListener("click", () => {
    navLinksEl.classList.remove("open");
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

/* Reveal on scroll */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.style.transitionDelay = (el.dataset.delay || 0) + "ms";
    el.classList.add("active");
    revealIO.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
$$(".reveal").forEach((el) => revealIO.observe(el));

/* Logo fallback (if logo.jpg is missing) */
$$(".brand-logo").forEach((img) => {
  const swap = () => {
    if (img.dataset.replaced) return;
    img.dataset.replaced = "1";
    const fb = document.createElement("span");
    fb.className = "brand-logo logo-fallback";
    fb.innerHTML = '<i class="fa-solid fa-car"></i>';
    img.replaceWith(fb);
  };
  img.addEventListener("error", swap);
  if (img.complete && img.naturalWidth === 0) swap();
});

/* ================= INIT ================= */
(function init() {
  renderProducts("all");
  onScroll();
})();