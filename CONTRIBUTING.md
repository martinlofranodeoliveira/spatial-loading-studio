# Contributing

Use synthetic fixtures only. Do not include customer code, personal information, secrets, credentials, screenshots without provenance, or claims about deployments or users.

## Local checks

Use Node 22.23.4 and npm 10.9.9, with the npm-generated lockfile:

```sh
npm ci --ignore-scripts
npm test
npm run demo -- --assert
npm run build
```

For interactive work use `npm run dev`. Changes to geometry must preserve `docs/contract.md` or explicitly describe a proposed contract change. Add independent expected examples, not assertions that merely recalculate the implementation predicate. Keep byte/cap checks, atomic rejection, immutability, deterministic order and twenty-snapshot history covered.

Translate every new UI label, error, status and accessible name in both dictionaries. Locale must remain outside the exported document. Keep features operable through labelled keyboard-accessible DOM controls and projections without WebGL.

Do not add runtime network services, asset CDNs, persistence, telemetry or arbitrary code/mesh import. Avoid new dependencies unless essential and explain the need. Do not bypass upstream type errors by disabling strictness or library checking. Generated build output is not source.

Describe which checks you actually ran. JSDOM interactions and R3F scene-object checks are not real browser or WebGL QA. Do not submit fabricated screenshot reviews, benchmark results, standards claims or accessibility certifications. Real browser checks should identify environment and unresolved limitations without including real personal data.

Report security concerns privately through the [repository advisory form](https://github.com/martinlofranodeoliveira/spatial-loading-studio/security/advisories/new), not a public issue. General contact is available at the [official homepage](https://lofranotecnologia.com.br).
