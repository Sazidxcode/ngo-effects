document.addEventListener("ngo:data-ready", () => {

  const s = document.querySelector("#ngo-state");
  const d = document.querySelector("#ngo-district");
  const out = document.querySelector("#ngo-results");
  const count = document.querySelector("#ngo-count");
  const notice = document.querySelector("#ngo-notice");

  if (!s) return;

  // Detect whether we are on homepage
  const isHomePage = document.body?.dataset.page === "home";

  // Homepage par sirf top 4 NGOs
  const HOME_LIMIT = 4;

  NGOEffects.fillState(s, true);

  function render() {

    const sv = s.value;
    const dv = d.value;

    const match = n =>
      (!sv || NGOEffects.stateMatch(n, sv)) &&
      (!dv || (n.districts || []).includes(dv));

    let exact = NGOEffects.DATA.ngos.filter(match);

    notice.hidden = true;

    let stateFallback = false;

    /*
      If a district has no exact NGO profile,
      keep existing state-level fallback behaviour.
    */
    if (sv && dv && !exact.length) {

      exact = NGOEffects.DATA.ngos.filter(
        n => NGOEffects.stateMatch(n, sv)
      );

      if (exact.length) {

        stateFallback = true;

        notice.hidden = false;

        notice.innerHTML = `
          <b>State-level results</b>
          — No exact district profile is mapped for
          ${NGOEffects.esc(dv)}.
          Showing organisations with a published presence
          in ${NGOEffects.esc(sv)}.
        `;
      }
    }

    /*
      IMPORTANT:
      Homepage → only first 4
      Explore NGOs page → show everything
    */
    const visibleNGOs = isHomePage
      ? exact.slice(0, HOME_LIMIT)
      : exact;


    /*
      Result count
    */
    if (isHomePage) {

      if (exact.length > HOME_LIMIT) {

        count.textContent =
          `Showing ${visibleNGOs.length} of ${exact.length} results`;

      } else {

        count.textContent =
          `${exact.length} result${exact.length === 1 ? "" : "s"}`;
      }

    } else {

      count.textContent =
        `${exact.length} result${exact.length === 1 ? "" : "s"}`;
    }


    /*
      Render cards
    */
    out.innerHTML = visibleNGOs.length

      ? visibleNGOs
          .map(n =>
            NGOEffects.ngoCard(n, {
              district: dv
            })
          )
          .join("")

      : `
        <div class="empty-state">

          <span class="eyebrow">
            NO MATCH
          </span>

          <h1>
            Nothing curated yet.
          </h1>

          <p>
            Use the government registry or wider public NGO
            directory to find additional organisations with
            websites and public profiles.
          </p>

          <div class="empty-actions">

            <a
              class="action-dark"
              href="${NGOEffects.SOURCES.darpan}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Search NGO DARPAN →
            </a>

            <a
              class="action-outline"
              href="${NGOEffects.SOURCES.give}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Give Discover →
            </a>

          </div>

        </div>
      `;


    /*
      Small homepage enhancement:
      Add "View all NGOs" link when more than 4 exist.
    */
    if (
      isHomePage &&
      exact.length > HOME_LIMIT &&
      visibleNGOs.length
    ) {

      const existingViewAll =
        document.querySelector(".home-view-all");

      if (!existingViewAll) {

        const viewAll = document.createElement("div");

        viewAll.className = "home-view-all";

        viewAll.innerHTML = `
          <a href="ngos.html">
            View all ${exact.length} NGOs
            <span>→</span>
          </a>
        `;

        out.insertAdjacentElement("afterend", viewAll);
      }

    } else {

      document
        .querySelector(".home-view-all")
        ?.remove();
    }
  }


  /*
    State change
  */
  s.addEventListener("change", () => {

    NGOEffects.fillDistrict(
      d,
      s.value,
      true
    );

    render();
  });


  /*
    District change
  */
  d.addEventListener("change", render);


  /*
    Initial render
  */
  render();

});