# Spatial Loading Studio

Development **0.1.0** · Original software by [Lofrano Tecnologia](https://lofranotecnologia.com.br) · MIT

[Português](README.pt-BR.md)

A local spatial placement editor for bounded boxes. Inspect six synthetic boxes in a real React Three Fiber / Three.js scene, select an object, edit integer millimetres, rotate it by world-axis quarter turns, undo, and export a deterministic plan. The default interface is Portuguese; the language selector provides a complete English interface.

This is a development concept tool, not a load, support, safety, manufacturing or engineering certification tool. There are no accounts, remote storage, telemetry, external APIs or runtime asset services.

## Install and run

Use Node 22.23.4 and npm 10.9.9 for the recorded dependency environment. Direct dependency versions are exact in `package.json`; install from a checkout with its npm-generated lockfile:

```sh
npm ci --ignore-scripts
npm run dev
```

Open the local URL printed by Vite. Installation needs the npm packages; the installed application and CLI do not need an API or network connection. Public Sans variable font files and all code are bundled locally.

```sh
npm test
npm run demo -- --assert
npm run demo -- --assert --json
npm run build
npm run preview
```

`npm test` first runs strict TypeScript checking with library checking enabled, builds the static application, checks the preserved opening HTML comment, then builds and runs Node core/scene tests and ReactDOM interaction tests. The CLI assertions run separately with `npm run demo -- --assert`.

The default Vite base is `./`, suitable for a repository subpath. An explicit base is also supported:

```sh
APP_BASE=/spatial-loading-studio/ npm run build
```

This is a static build, not an offline service-worker installation. A previously opened URL is not guaranteed to work without a local server or browser cache. No publishing or deployment workflow is included.

## Try a task

1. Select **B06** in the hierarchy or a projection. Its minimum corner is `[0,800,0]` mm.
2. Set minimum X to `100` and apply. The box remains above the lower layer without a support calculation.
3. Try minimum X `12000`. The error links to the field; accepted geometry, selection and history remain unchanged.
4. Restore X `100`, rotate +90° about X, and undo. Rotation changes the exact orientation even when oriented dimensions are equal.
5. Export JSON or the standalone three-view SVG. Exports always use accepted geometry, never drafts.

Camera movement is opt-in: choose **Navigate in 3D** to orbit, pan or zoom. **End navigation** or Escape disconnects the controls and returns focus to the toggle. Inactive navigation leaves ordinary page scrolling available. Fit/reset and object selection remain available without entering navigation mode. This lifecycle is checked with real controls in a simulated DOM; real touch/wheel behavior still requires browser QA.

The inspector edits **base dimensions**, position and label. Its oriented-dimension readout reflects the current matrix. Container resizing is under **Bounding volume**. New boxes start with editable dimensions and position; addition does not search for free space. The import section accepts a file or pasted JSON. A valid import is one undoable replacement, even when identical to the current document.

If WebGL is unavailable, fails, or loses context, the same document stays editable through three exact orthographic projections and labelled DOM controls. Projection rectangles are selectable with Enter or Space. The hierarchy remains useful when small or overlapping projections are difficult to pick.

## Example demo output

The human-readable prefix for `npm run demo -- --assert` is:

```text
Spatial Loading Studio — development 0.1.0
Synthetic boxes: 6 | occupied: 3840000000 mm³
Container: 34560000000 mm³ | occupancy (rounded): 11.1%
Assertions: passed
```

It is followed by one `JSON:` line with the full deterministic result and document. `--json` suppresses the human prefix and emits one JSON object. Example machine fields are `occupied_mm3: 3840000000`, `container_mm3: 34560000000` and `rounded_occupancy: "11.1%"`. These are arithmetic expectations from synthetic fixtures, not performance or deployment claims. The CLI exits nonzero if an assertion fails.

## Small core example

```ts
import { createSession, demoDocument, rotate, toJSON, undo } from './src/core';

const initial = createSession(demoDocument());
const turned = rotate(initial, 'box-006', 'X');
const restored = undo(turned);
console.log(toJSON(restored.document));
```

`validate(unknown)` captures own data fields and returns a deeply frozen document. `change(session, candidate)` validates before replacing anything; it throws a structured `Fault` on rejection. `importText` bounds UTF-8 input before decoding. See [the exact contract](docs/contract.md) before calling these functions.

## Why this design

The light technical workspace puts geometry between a stable object list and numerical inspector. A small blue selection signal links the real mesh, hierarchy, inspector and projections. The authority is a dependency-free integer core, not a renderer’s bounding-box collision helper. Face, edge and corner contact are legal; only positive interior overlap on every axis is rejected.

[Design and verification boundaries](docs/design.md) explain camera fitting, disposal, fallback, localization and testing. [Third-party notices](docs/third-party.md) distinguish dependency licenses from the original MIT code.

## Limits and verification boundaries

- Maximum 200 boxes; each dimension 1–12000 mm; 256 KiB JSON imports; twenty successful-command undo snapshots. No redo or automatic persistence.
- Only 24 right-handed axis-aligned orientations; no arbitrary angles, meshes, packing optimization, gravity, weight or support model.
- Occupancy is geometric volume, rounded to one decimal place for display. Portuguese uses `11,1%`; exported plans use a locale-independent `11.1%`.
- JSON is a strict documented subset, with duplicate members rejected, not an implementation of every interchange or engineering standard.
- DOM tests run in an outside-only JSDOM VM. Scene tests inspect actual Three.js scene objects without a GPU. Neither proves real WebGL rendering, responsive layout, pointer usability or accessibility in a browser.
- Real browser, WebGL, pointer, responsive and accessibility QA remains unperformed. No screenshots or rendered design review are supplied, and the visual design is not claimed finished.
- Browser file reads/downloads may fail; errors preserve accepted state. Reloading discards unsaved edits. Proxy objects are not sandboxed by the public validator.

Security reports: [GitHub private vulnerability reporting](https://github.com/martinlofranodeoliveira/spatial-loading-studio/security/advisories/new). General contact: [official homepage](https://lofranotecnologia.com.br).
