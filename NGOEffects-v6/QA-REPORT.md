# NGOEffects v5 QA

Previous v4 was not actually robust because it depended on `fetch()` of local JSON. Opening `index.html` directly can block local fetches in browsers, so the data-ready event never fired.

v5 fixes that architecture:
- `assets/js/data.js` is loaded before `main.js` on every page.
- The application boots from bundled seed data, so direct `file://` opening does not depend on Fetch/CORS.
- JSON files remain present as the editable data source.
- State/District data contains 36 States/UTs and 784 district names.
- Home overview, Impact Tracker, Explore NGOs and NGO Profile all consume the same data layer.
- Impact Tracker renders directory coverage and sector bars rather than fabricated outcome statistics.
- Explore NGO district fallback is implemented.
- External Visit/Contact links use `noopener noreferrer`.
- Mobile navigation and active navigation state are implemented.
- No React/Next/Node/backend dependency.
