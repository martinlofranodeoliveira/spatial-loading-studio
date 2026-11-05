import assert from 'node:assert/strict';
import { change, containerVolume, createSession, demoDocument, Fault, IDENTITY, importText, occupancy, rotate, toJSON, undo, validate, volume } from './core';
import { toSVG } from './export';
const args = process.argv.slice(2);
if (args.some(a => a !== '--assert' && a !== '--json')) {
  process.stderr.write('Usage: npm run demo -- [--assert] [--json]\n');
  process.exitCode = 2;
} else {
  try {
    const document = demoDocument();
    if (args.includes('--assert')) {
      assert.equal(volume(document), 3840000000);
      assert.equal(containerVolume(document), 34560000000);
      assert.equal(occupancy(document), '11.1%');
      const cube = (id: string, x: number) => ({ id, label: id, size: [100, 100, 100], position: [x, 0, 0], orientation: IDENTITY });
      const s = createSession(validate({ version: 1, unit: 'mm', container: [1000, 1000, 1000], boxes: [cube('a', 0), cube('b', 100)] }));
      assert.throws(() => change(s, { ...s.document, boxes: [cube('a', 0), cube('b', 99)] }), (e: unknown) => e instanceof Fault && e.code === 'overlap');
      assert.equal(s.history.length, 0);
      let rotated = s;
      for (let i = 0; i < 4; i++) rotated = rotate(rotated, 'a', 'X');
      assert.equal(toJSON(rotated.document), toJSON(s.document));
      const moved = change(s, { ...s.document, boxes: [cube('a', 0), cube('b', 200)] });
      assert.equal(toJSON(undo(moved).document), toJSON(s.document));
      assert.equal(toJSON(importText(s, toJSON(document)).document), toJSON(document));
      const labelled = validate({ ...document, boxes: document.boxes.map((b, i) => i ? b : { ...b, label: '<&" synthetic' }) });
      const svg = toSVG(labelled);
      assert.ok(svg.includes('&lt;&amp;&quot; synthetic'));
      assert.ok(!svg.includes('<script'));
      assert.equal(toJSON(validate(JSON.parse(toJSON(document)) as unknown)), toJSON(document));
    }
    const result = { version: '0.1.0', synthetic: true, boxes: document.boxes.length, occupied_mm3: volume(document), container_mm3: containerVolume(document), rounded_occupancy: occupancy(document), document };
    if (!args.includes('--json')) {
      process.stdout.write(`Spatial Loading Studio — development 0.1.0\nSynthetic boxes: 6 | occupied: 3840000000 mm³\nContainer: 34560000000 mm³ | occupancy (rounded): 11.1%\n${args.includes('--assert') ? 'Assertions: passed\n' : ''}JSON: `);
    }
    process.stdout.write(JSON.stringify(result) + '\n');
  } catch (error) {
    process.stderr.write(`Demo failed: ${error instanceof Error ? error.message : 'unknown error'}\n`);
    process.exitCode = 1;
  }
}
