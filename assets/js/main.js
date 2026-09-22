(() => {
  "use strict";
  const seed = window.NGOEffectsSeedData || {};
  const DATA = {
    states: seed.states || [],
    districts: seed.districts || {},
    ngos: seed.ngos || [],
    impact: seed.impact || {},
    meta: seed.meta || {},
  };
  const SOURCES = {
    igod: "https://igod.gov.in/sg/district/states",
    lgd: "https://lgdirectory.gov.in/",
    ogdDistricts:
      "https://data.gov.in/resource/local-government-directory-lgd-districts",
    darpan: "https://ngodarpan.gov.in/index.php/search",
    give: "https://discover.give.do/",
  };
  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[c],
    );
  const norm = (v) =>
    String(v ?? "")
      .toLocaleLowerCase()
      .trim();
  function shell() {
    const nav = document.querySelector("[data-nav]"),
      page = document.body?.dataset.page || "";
    if (nav) {
      nav.className = "site-header";
      nav.innerHTML = `<div class="shell nav-inner"><a class="brand" href="index.html"><div class="brand-mark"> <img src="assets/images/favicon.png" alt="NGOEffects"> </div><span><b>NGO</b>Effects</span></a><button class="nav-toggle" aria-expanded="false" aria-controls="site-menu"><span></span><span></span></button><nav class="nav-menu" id="site-menu"><a data-page-link="home" href="index.html">Home</a><a data-page-link="impact" href="impact.html">Impact Tracker</a><a data-page-link="ngos" href="ngos.html">Explore NGOs</a><a data-page-link="about" href="about.html">About</a></nav></div>`;
      nav.querySelector(`[data-page-link="${page}"]`)?.classList.add("active");
      const t = nav.querySelector(".nav-toggle"),
        m = nav.querySelector(".nav-menu");
      t?.addEventListener("click", () => {
        const o = t.getAttribute("aria-expanded") === "true";
        t.setAttribute("aria-expanded", String(!o));
        m.classList.toggle("open", !o);
      });
    }
    const f = document.querySelector("[data-footer]");
    if (f) {
      f.className = "site-footer";
      f.innerHTML = `<div class="shell footer-grid"><div class="footer-main"><a class="brand" href="index.html"><span class="brand-mark">NE</span><span><b>NGO</b>Effects</span></a><p>Discover social-sector work by place. Move from a district to the organisations actually listed for it.</p></div><div><span class="footer-label">Navigate</span><a href="index.html">Home</a><a href="impact.html">Impact Tracker</a><a href="ngos.html">Explore NGOs</a><a href="about.html">About</a></div><div><span class="footer-label">Source layer</span><a href="${SOURCES.darpan}" target="_blank" rel="noopener noreferrer">NGO DARPAN ↗</a><a href="${SOURCES.igod}" target="_blank" rel="noopener noreferrer">India.gov Districts ↗</a><a href="${SOURCES.give}" target="_blank" rel="noopener noreferrer">Give Discover ↗</a></div><div><span class="footer-label">Project</span><a href="https://sazid.in/" target="_blank" >Developed by Sazid Hussain ↗</a><small>Directory inclusion is not an endorsement.</small><span class="image-credit">Card photography: Wikimedia Commons</span></div></div>`;
    }
  }
  function fillState(el, all = false) {
    if (!el) return;
    el.innerHTML =
      `<option value="">${all ? "All states / UTs" : "Select state / UT"}</option>` +
      DATA.states
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((s) => `<option value="${esc(s.name)}">${esc(s.name)}</option>`)
        .join("");
  }
  function fillDistrict(el, state, all = false) {
    const a = DATA.districts[state] || [];
    el.innerHTML =
      `<option value="">${all ? "All districts" : a.length ? "Select district" : "No district data"}</option>` +
      a
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((d) => `<option value="${esc(d)}">${esc(d)}</option>`)
        .join("");
    el.disabled = !state || !a.length;
  }
  function stateMatch(n, state) {
    return n.state === state || (n.operatingStates || []).includes(state);
  }
  function ngosFor(state, district) {
    return DATA.ngos.filter(
      (n) =>
        stateMatch(n, state) &&
        (!district || (n.districts || []).includes(district)),
    );
  }
  function stateLevelFor(state, district) {
    return DATA.ngos.filter(
      (n) =>
        stateMatch(n, state) &&
        (!district || (n.districts || []).includes(district)),
    );
  }
  const NGO_IMAGES = [
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Children_in_Raisen_district,_MP,_India.jpg",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Young_Baiga_women,_India.jpg",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Children_at_a_rural_school_provided_with_lunch_Uttar_Pradesh_India.jpg",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/School_children_-_WASH_in_schools_-_India_(26658520829).jpg",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Health_Systems_Strengthening_and_Motherhood_-_India_(16433703824).jpg",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Boy_and_girl_go_to_school.jpg",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/World-yoga-association-event-in-tamil-nadu-state-for-children-and-school-1.jpg",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Doctor_checking_the_health_of_a_girl_child_at_the_Health_Camp_organised_as_a_part_of_the_Bharat_Nirman_Public_Information_Campaign,_at_Pollachi_in_Coimbatore_district,_Tamil_Nadu_on_August_28,_2011.jpg",
  ];
  function imageFor(n) {
    let h = 0;
    for (const c of String(n.id || n.name).toLowerCase())
      h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return NGO_IMAGES[h % NGO_IMAGES.length];
  }
  function ngoCard(n, opts = {}) {
    const tags = (n.sectors || [])
      .slice(0, 4)
      .map((s) => `<span>${esc(s)}</span>`)
      .join("");
    const exact = opts.district
      ? (n.districts || []).includes(opts.district)
      : false;
    const image = imageFor(n);
    return `<article class="ngo-card">
   <div class="ngo-card-image-wrap"><img class="ngo-card-image" src="${image}" alt="Open-source community work image">
   <span class="ngo-image-credit">Wikimedia Commons</span></div>
   <div class="ngo-card-body">
    <div class="ngo-card-top"><span class="badge">${exact ? "District profile" : "State-level profile"}</span><span>${esc(n.state)}</span></div>
    <h3>${esc(n.name)}</h3><p>${esc(n.description)}</p>
    <div class="tags">${tags}</div>
    <div class="ngo-location">${esc((n.districts || []).join(" · ") || "State / regional coverage")}</div>
    <div class="ngo-actions"><a class="visit-link" href="ngo.html?id=${encodeURIComponent(n.id)}">View profile <b>→</b></a>
      <div class="ngo-primary">${n.website ? `<a href="${esc(n.website)}" target="_blank" rel="noopener noreferrer">Visit</a>` : ""}${n.contactPage ? `<a href="${esc(n.contactPage)}" target="_blank" rel="noopener noreferrer">Contact</a>` : ""}</div>
    </div>
   </div>
 </article>`;
  }
  function renderStateOverview(t) {
    if (!t) return;
    const states = DATA.states.length,
      dist = Object.values(DATA.districts).reduce((a, v) => a + v.length, 0),
      profiles = DATA.ngos.length,
      covered = new Set(DATA.ngos.flatMap((n) => n.operatingStates || [])).size;
    t.innerHTML = `<div class="overview-number"><span>States & UTs</span><strong>${states}</strong><small>Administrative coverage</small></div><div class="overview-number"><span>Districts</span><strong>${dist}</strong><small>Current bundled geography</small></div><div class="overview-number"><span>Website-backed NGOs</span><strong>${profiles}</strong><small>Curated public profiles</small></div><div class="overview-number overview-accent"><span>States with NGO coverage</span><strong>${covered}</strong><small>Using HQ + published operating areas</small></div>`;
  }
  window.NGOEffects = {
    DATA,
    SOURCES,
    esc,
    norm,
    fillState,
    fillDistrict,
    ngosFor,
    stateLevelFor,
    stateMatch,
    ngoCard,
    renderStateOverview,
  };
  function boot() {
    shell();
    document.dispatchEvent(new CustomEvent("ngo:data-ready", { detail: DATA }));
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", boot, { once: true })
    : boot();
})();
