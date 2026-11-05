# Third-party dependencies

The original Spatial Loading Studio source is MIT, copyright 2026 Lofrano Tecnologia. Dependencies retain their own licenses and notices. Installations must retain the license files distributed with the packages; this document does not relicense them.

Direct runtime packages are pinned exactly in `package.json`: React/ReactDOM 19.3.1, React Three Fiber 9.8.2, Three.js 0.184.0, Drei 10.7.9, three-stdlib2.36.1, Lucide React 1.69.0, and the Public Sans packages 5.3.0. Development versions are pinned there too. No lockfile or integrity hashes are hand-authored.

- Public Sans is distributed under the SIL Open Font License 1.1. The app imports `@fontsource-variable/public-sans/wght.css`; Vite bundles the supplied variable-font assets. The exact package OFL notice is retained in public/licenses/PublicSans-OFL.txt and copied into the static build; preserve it with redistribution. The static Public Sans package is included in the specified dependency set but not fetched at runtime.
- Lucide is distributed under the ISC license. The app uses the actual package’s SVG React components, not Unicode icon substitutions.
- React, ReactDOM, Three.js, React Three Fiber and Drei distribute their own open-source licenses and transitive notices. Consult installed package license files and the npm-generated dependency lock for the complete resolved graph.
- Vite, TypeScript, Testing Library, JSDOM and the R3F test renderer are development tooling, not remotely invoked services.

There are no bundled external models, images, HDRI or remotely fetched fonts. Font and dependency source code are not claimed as original Lofrano code.

The production build copies [application and bundled dependency notices](../public/licenses/THIRD-PARTY.txt) and [the font OFL text](../public/licenses/PublicSans-OFL.txt) to `dist/licenses/`. The notice list follows the actually retained production module IDs and exact installed package versions; the Fiber npm archive omits its license file, so its exact upstream v9.8.2 release-tag license is retained. Provenance and content hashes are in `dependency-metadata/bundled-notices.json`. This record does not assert a complete transitive legal audit.
