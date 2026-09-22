# NGOEffects data sources — September 2026

## Administrative geography
The bundled State/UT and District layer follows a September 2026 public district dataset derived from the Government of India iGoD district directory. The build contains 36 State/UT entries and 784 district names.

## NGO discovery and verification
- **NGO DARPAN** — Government of India / NITI Aayog repository and search surface.
- **India.gov district NGO/public-utility pages** — district administrations publish local NGO listings in some districts.
- **Give Discover** — secondary discovery/reference layer for public organisation profiles and state-level operational information.
- **Individual NGO websites** — primary source for website/contact links and published operating-area information.

## Linking rule
A Visit link is included only when a public organisation website was found. A Contact link is included only when a public contact page was found during review. Missing links are left out rather than fabricated.

## Coverage rule
- `districts[]` means an explicit district-level mapping in the curated dataset.
- `operatingStates[]` means a state/region presence supported by a public organisation source or directory profile.
- When a selected district has no exact curated match, the interface shows State-level Results when available and labels them clearly.

## Impact rule
NGOEffects does not invent people-reached, programme, beneficiary or percentage metrics. The tracker currently visualizes directory coverage and sector representation. NGO-published impact metrics can be added later as source-attributed records.


## Visual assets
The interface uses public Wikimedia Commons imagery for contextual visuals. Images are linked to their Wikimedia file redirects in the HTML/JS rather than represented as NGO-owned photography. Current visual references include Children in Raisen district (MP), Children at a rural school in Uttar Pradesh, and Young Baiga women in India. Verify the file page/license before republishing outside this project.
