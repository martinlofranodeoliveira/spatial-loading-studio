# Implementation design and verification boundaries

## Workspace

The application uses a light technical-maquette workspace: `#f3f6f7` ground, `#202b36` primary ink, `#4b6070` secondary ink, `#235bd4` selection, self-hosted Public Sans variable and Lucide stroke icons. A compact file bar sits above the hierarchy, continuous workspace and numerical inspector. Real dimensions and occupied volume appear as labelled operating information rather than marketing metrics. No client data or screenshots are included.

Selection links a hierarchy entry, mesh material/edges, numerical context and projection rectangles. The inspector edits independent strings, never the accepted object. It applies a complete candidate through the core; a rejection leaves the accepted session and selection alone. A concise alert links to a relevant field. Errors and status keys are translated at render time, so switching locale does not alter geometry or history. Labels supplied by users remain literal text rather than being translated.

On narrower layouts the canvas precedes stacked native details/summary sections for Objects and Properties. Buttons and form controls have minimum44px targets and visible focus styles. Native details allow sections to collapse without a modal. Motion is manual; there are no entrance animations, auto-orbit, easing loops or damped camera movement. Reduced-motion CSS also disables animation and transitions.

These are source implementation decisions, not claims from a rendered review. Real layout, contrast, touch, screen-reader and browser validation must still be performed.

## Authority and resource bounds

`src/core.ts` has no rendering dependencies. It captures descriptors, validates complete documents, canonicalizes ID order and returns frozen objects. Every accepted change is an immutable new document. Undo stores at most twenty references to already-frozen bounded documents. With at most 200 boxes, pair checking is deliberately O(n²), with a fixed upper bound of 19900 pairs. There is no background solver or worker service.

The JSON parser checks encoded size before token decoding, limits recursion and rejects duplicate members. The direct object API avoids getters/custom iterators; it cannot sandbox Proxy traps. File bytes, schema caps and frozen snapshots limit routine work but are not a formal memory or execution sandbox.

## Real scene and fallback

`SceneContent` is separate from Canvas, controls and browser capability checks. Mesh geometry is base-size BoxGeometry, with an exact-orientation-derived quaternion and a centre computed from accepted oriented extents. Three floating matrices are presentation only; they never authorize a commit. Mesh click handlers stop R3F propagation to select the closest clicked mesh, while edges do not raycast.

Geometry, edge geometry and materials created by scene objects are owned by their hooks and explicitly disposed on replacement/unmount. The R3F grid uses renderer lifecycle disposal. The canvas uses demand rendering and DPR `[1,1.5]`. The actual Three.js OrbitControls via pinned three-stdlib2.36.1 is mounted only during explicit navigation mode and invalidates on changes; damping is disabled. The toggle has aria-pressed, an explicit end button and Escape exit with returned focus. Cleanup disposes the controls before restoring the exact previous inline touch-action; a disabled controls instance is insufficient. The native Three0.184 addon can retain a pending global Control-keyup handler after disposal; the qualified stdlib adapter avoids that hook and a held-Control regression verifies no retained keyup listener. Outside navigation, no controls wheel listener is attached. DOM tests exercise the actual controls class and CSS-style lifecycle without a WebGL canvas. Camera fitting uses the enclosing volume’s bounding sphere, FOV, aspect, centre and a padded distance, with a stable0.1mm near plane and far plane covering the allowed zoom distance. The fit does not leave the previous fit-distance nearplane clipping close inspection. Fit preserves direction; reset uses a fixed oblique direction. Resizing recalculates the fit.

The browser performs an actual WebGL capability probe, releases its temporary context, and installs context-loss handling on the real canvas. Render errors or context loss switch to the same document’s exact SVG projections. Core data is outside the scene boundary. Tests can explicitly inject `capability: () => false`; production does not substitute simulated geometry or a screenshot. All geometric operations, selection and exports remain available in DOM controls without WebGL. Tiny or coincident projected rectangles can be selected through the hierarchy.

Fonts are imported from the installed variable-font package. There are no remote assets, HDRI, model loaders, runtime CDN, account requests or telemetry. Static Vite assets use a relative base by default, or an explicit repository base. This does not install an offline service worker.

## Verification implemented in the repository

- Literal independent boundary/contact examples, proper-matrix group checks, four-turn restoration and rejected rotation cases.
- A separate240-case pre-source literal fixture uses signed-permutation matrices, transformed corners and exhaustive unit-cell sets. Another tiny-container oracle enumerates transformed unit-cell centres and compares occupied coordinate sets, acceptance, every conflict pair and volume across exhaustive small placements and seeded cases using all orientations. It does not repeat the production interval predicate.
- Adversarial schemas, non-finite/unsafe/fractional values, labels/IDs, accessor/iterator hazards, duplicate JSON members, input caps, aliasing, exact exports, no-op and undo/import behavior.
- Actual ReactDOM interactions with Testing Library and user-event in both languages, using an outside-only JSDOM VM. The only explicit scheduler shim is Node MessageChannel; ports are tracked and closed. Node global window/document are not installed. File size rejection is tested before read; a newer explicit command revokes an older asynchronous file read, and failed reads clear reading status while preserving accepted state. Downloads use an explicit adapter. Error links explicitly focus the numeric field.
- Actual R3F test-renderer scene objects, BoxGeometry, bounds/orientation, linked click callback, updates and resource disposal; actual PerspectiveCamera projections of all eight container corners at mobile/desktop and extreme dimensions. Numeric quaternion tuples avoid Three CJS/ESMconstructor-identity differences in the Node harness. These tests do not create a GPU canvas.
- An independently asserting CLI demo, strict TypeScript checking, application production build, and assertion that the opening direction comment is the first body child in built HTML.

The test sources and commands are supplied; this document does not assert an observed successful execution. No real browser host, WebGL render, screenshots, visual finish review, pointer QA, responsive QA or accessibility audit is supplied. The design is not claimed finished or reviewed from images. Browser verification must separately inspect actual desktop/mobile sizing, keyboard traversal, screen-reader output, context loss, camera/picking, touch scrolling, real downloads and all fallback transitions.

## References and exclusions

The implementation follows the documented React component/state model, R3F scene model and Three.js geometry APIs:

- https://react.dev/learn
- https://r3f.docs.pmnd.rs/getting-started/introduction
- https://threejs.org/docs/
- Professional spatial-tool reference: https://www.shapr3d.com/

These references are not an endorsement or copied application code. No physical load, support, manufacturing, optimal packing or compliance guarantees are inferred. The repository’s original application code is MIT; dependency notices are separate.
