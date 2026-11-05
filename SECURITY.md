# Security policy

Spatial Loading Studio 0.1.0 is a development version, not a certified or production-readiness claim. Security fixes are considered for the current development line; no response-time SLA is offered.

Report vulnerabilities using [GitHub private vulnerability reporting](https://github.com/martinlofranodeoliveira/spatial-loading-studio/security/advisories/new). Do not place exploit details, real personal data, credentials or client documents in public issues. Include a minimal synthetic reproduction, relevant version and expected/observed behavior.

The application has no accounts, telemetry or remote persistence. Imports are bounded before decoding, then strictly validated before atomic replacement. Labels are text; SVG export escapes XML and includes no executable or externally loaded content. The direct object API rejects accessors and custom iterators but is not a sandbox for JavaScript Proxies. Input limits are not a process-isolation or RSS guarantee. Browser and dependency vulnerabilities are outside the geometry contract.

Do not use the result to establish safe loading, support, physical stability, weight capacity or engineering compliance. Download and reload behavior should be tested in the intended browser before relying on a local workflow. Keep an exported accepted document when edits matter; there is no implicit recovery storage.

For general contact, use [Lofrano Tecnologia’s official homepage](https://lofranotecnologia.com.br).
