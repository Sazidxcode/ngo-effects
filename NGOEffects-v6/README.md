# NGOEffects

Static HTML/CSS/Vanilla JS NGO discovery and impact-context platform for India.

## Current build
- 36 State/UT entries.
- 784 bundled district names.
- 41 website-backed curated NGO profiles.
- 32 States/UTs have at least one curated website-backed operating-area profile.
- Exact district mappings where the organisation’s district relationship is explicitly recorded.
- State-level fallback for districts without an exact curated profile.
- Official website links where publicly verified; contact links only where a public contact page was verified.
- Full NGO DARPAN and public NGO-directory links remain available for the complete registry/discovery layer.
- No fabricated NGO outcome numbers.

## Run
Use a local static server for the JSON/data files:
`python -m http.server 8080`
Then open `/NGOEffects/`. The bundled seed also allows the application to boot from `index.html`.
