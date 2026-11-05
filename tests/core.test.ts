import { initialSize, suggestNewBox } from '../src/placement';
import test from 'node:test';
import assert from 'node:assert/strict';
import { change, conflictPairs, containerVolume, createSession, demoDocument, extents, Fault, IDENTITY, importText, MAX_IMPORT_BYTES, multiply, occupancy, ORIENTATIONS, parseDocument, rotate, toJSON, undo, validate, volume, type Box, type Mat, type Vec } from '../src/core';
import { toSVG } from '../src/export';
import cellFixtures from './fixtures/cell-oracles.json';
const box = (id: string, position: Vec, size: Vec = [100, 100, 100], orientation: Mat = IDENTITY): Box => ({ id, label: id, size, position, orientation });
const doc = (boxes: readonly Box[], container: Vec = [1000, 1000, 1000]) => ({ version: 1, unit: 'mm', container, boxes });
const fault = (code: string) => (e: unknown) => e instanceof Fault && e.code === code;

test('literal face, edge, corner contacts and exact inclusive boundary', () => {
  for (const position of [[100, 0, 0], [100, 100, 0], [100, 100, 100]] as Vec[]) {
    assert.equal(validate(doc([box('a', [0, 0, 0]), box('b', position)])).boxes.length, 2);
  }
  const s = createSession(validate(doc([box('a', [0, 0, 0]), box('b', [100, 0, 0])])));
  const before = toJSON(s.document);
  assert.throws(() => change(s, doc([box('a', [0, 0, 0]), box('b', [99, 0, 0])])), fault('overlap'));
  assert.equal(toJSON(s.document), before); assert.equal(s.history.length, 0);
  const edge = createSession(validate(doc([box('a', [900, 900, 900])])));
  for (let axis = 0; axis < 3; axis++) {
    const p = [900, 900, 900]; p[axis]++;
    assert.throws(() => change(edge, doc([box('a', p as unknown as Vec)])), fault('bounds'));
    assert.equal(edge.history.length, 0);
    assert.equal(toJSON(edge.document), toJSON(validate(doc([box('a', [900, 900, 900])]))));
  }
});

test('proper rotation group, inverse closure, world premultiplication, four turns', () => {
  assert.equal(ORIENTATIONS.length, 24);
  assert.equal(new Set(ORIENTATIONS.map(m => m.join(','))).size, 24);
  for (const m of ORIENTATIONS) {
    for (let r = 0; r < 3; r++) for (let s = 0; s < 3; s++) assert.equal([0, 1, 2].reduce((sum, c) => sum + m[r * 3 + c] * m[s * 3 + c], 0), r === s ? 1 : 0);
    const det = m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
    assert.equal(det, 1);
    const inverse = [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]] as Mat;
    assert.deepEqual(multiply(m, inverse), IDENTITY);
    for (const n of ORIENTATIONS) assert.ok(ORIENTATIONS.some(o => o.join(',') === multiply(m, n).join(',')));
    for (const axis of ['X', 'Y', 'Z'] as const) {
      let s = createSession(validate(doc([box('a', [10, 20, 30], [100, 200, 300], m)])));
      const before = toJSON(s.document);
      for (let i = 0; i < 4; i++) s = rotate(s, 'a', axis);
      assert.equal(toJSON(s.document), before);
    }
  }
  let s = createSession(validate(doc([box('a', [0, 0, 0], [100, 200, 300])])));
  s = rotate(rotate(s, 'a', 'X'), 'a', 'Y');
  assert.deepEqual(s.document.boxes[0].orientation, [0, 1, 0, 0, 0, -1, -1, 0, 0]);
  const outside = createSession(validate(doc([box('a', [900, 0, 0], [100, 200, 300])])));
  assert.throws(() => rotate(outside, 'a', 'Y'), fault('bounds')); assert.equal(outside.history.length, 0);
  const collision = createSession(validate(doc([box('a', [0, 0, 0], [100, 200, 100]), box('b', [100, 0, 0])])));
  assert.throws(() => rotate(collision, 'a', 'Z'), fault('overlap')); assert.equal(collision.history.length, 0);
});

// Independent oracle: transform centres of base unit cells, translate negative axes
// to the minimum corner, and compare coordinate sets. No interval predicate.
function cells(b: Box): Set<string> {
  const output = new Set<string>();
  for (let x = 0; x < b.size[0]; x++) for (let y = 0; y < b.size[1]; y++) for (let z = 0; z < b.size[2]; z++) {
    const source = [2 * x + 1, 2 * y + 1, 2 * z + 1];
    const target = [0, 0, 0];
    for (let row = 0; row < 3; row++) {
      let doubled = 0;
      for (let col = 0; col < 3; col++) {
        const sign = b.orientation[3 * row + col];
        doubled += sign * source[col];
        if (sign < 0) doubled += 2 * b.size[col];
      }
      target[row] = b.position[row] + Math.floor(doubled / 2);
    }
    output.add(target.join(','));
  }
  return output;
}
function oracle(boxes: readonly Box[], container: Vec) {
  const occupied = boxes.map(cells);
  const pairs: [string, string][] = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    if ([...occupied[i]].some(c => occupied[j].has(c))) pairs.push([boxes[i].id, boxes[j].id]);
  }
  const inside = occupied.every(set => [...set].every(key => key.split(',').every((n, axis) => Number(n) >= 0 && Number(n) < container[axis])));
  return { pairs, valid: inside && !pairs.length, occupied: new Set(occupied.flatMap(set => [...set])).size };
}
test('exhaustive tiny placements and seeded unit-cell oracle across all orientations', () => {
  let seed = 325;
  const random = (max: number) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; };
  const cases: { boxes: Box[]; container: Vec }[] = [];
  for (let x = 0; x <= 3; x++) for (let y = 0; y <= 3; y++) for (let z = 0; z <= 3; z++) cases.push({ boxes: [box('a', [0, 0, 0], [2, 1, 2]), box('b', [x, y, z], [1, 2, 1])], container: [4, 4, 4] });
  // Guarantee overlapping inputs under every orientation in addition to seeded samples.
  for (const orientation of ORIENTATIONS) cases.push({container:[8,8,8],boxes:[box('a',[0,0,0],[1,2,3],orientation),box('b',[0,0,0],[3,2,1])]});
  for (const orientation of ORIENTATIONS) for (let i = 0; i < 32; i++) {
    const vector = (min: number, span: number): Vec => [min + random(span), min + random(span), min + random(span)];
    cases.push({ container: vector(3, 6), boxes: [box('a', vector(0, 8), vector(1, 3), orientation), box('b', vector(0, 8), vector(1, 3), ORIENTATIONS[random(24)]), box('c', vector(0, 8), vector(1, 3), ORIENTATIONS[random(24)])] });
  }
  let valid = 0, invalid = 0, conflicts = 0;
  for (const c of cases) {
    const expected = oracle(c.boxes, c.container);
    assert.deepEqual(conflictPairs(c.boxes), expected.pairs);
    conflicts += expected.pairs.length;
    let accepted = false;
    try {
      const actual = validate(doc(c.boxes, c.container)); accepted = true;
      assert.equal(volume(actual), expected.occupied);
    } catch (e) { if (!(e instanceof Fault)) throw e; }
    assert.equal(accepted, expected.valid, JSON.stringify(c));
    if (accepted) valid++; else invalid++;
  }
  assert.ok(valid > 10 && invalid > 100 && conflicts > 10, JSON.stringify({valid,invalid,conflicts}));
});

test('strict schema, caps, malformed data, duplicate JSON and safe prototype-like IDs', () => {
  const base = demoDocument();
  const raw = () => JSON.parse(toJSON(base)) as { boxes: Record<string, unknown>[]; container: unknown[]; version: number };
  for (const n of [NaN, Infinity, -Infinity, .5, -1, Number.MAX_SAFE_INTEGER + 1, '100', null]) {
    const d = raw(); d.container[0] = n; assert.throws(() => validate(d), fault('range'));
  }
  for (const label of ['\0', 'é'.repeat(65), '\ud800']) { const d = raw(); d.boxes[0].label = label; assert.throws(() => validate(d), fault('label')); }
  for (const id of ['', 'a b', 'é', 'x'.repeat(65)]) { const d = raw(); d.boxes[0].id = id; assert.throws(() => validate(d), fault('id')); }
  const d = raw(); d.boxes[1].id = d.boxes[0].id; assert.throws(() => validate(d), fault('duplicate'));
  assert.throws(() => validate({ ...base, extra: 1 }), fault('keys'));
  assert.throws(() => validate({ ...base, version: 2 }), fault('schema'));
  assert.throws(() => validate({ ...base, boxes: Array(201).fill(base.boxes[0]) }), fault('count'));
  assert.throws(() => validate({ ...base, boxes: [null] }), fault('type'));
  assert.throws(() => validate({ ...base, boxes: [{ ...base.boxes[0], orientation: [1, 0, 0, 0, 1, 0, 0, 0, -1] }] }), fault('orientation'));
  assert.throws(() => validate({ ...base, boxes: [{ ...base.boxes[0], orientation: null }] }), fault('type'));
  assert.throws(() => parseDocument('x'.repeat(MAX_IMPORT_BYTES + 1)), fault('bytes'));
  assert.throws(() => parseDocument('"' + 'é'.repeat(140000) + '"'), fault('bytes'));
  assert.throws(() => parseDocument('{"version":1,"version":1}'), fault('duplicateKey'));
  assert.throws(() => parseDocument('{"a":1,"\\u0061":2}'), fault('duplicateKey'));
  for (const text of ['{} garbage', '[1,]', '{"a":01}', '{"a":"\n"}', '\ufeff{}', 'null', '{']) assert.throws(() => parseDocument(text), Fault);
  assert.throws(() => parseDocument('['.repeat(18) + '0' + ']'.repeat(18)), fault('depth'));
  const safe = validate(doc([box('__proto__', [0, 0, 0]), box('constructor', [100, 0, 0])]));
  assert.equal(safe.boxes[0].id, '__proto__');
  assert.equal(({} as Record<string, unknown>).polluted, undefined);
  let touched = 0;
  const getter = { ...base };
  Object.defineProperty(getter, 'boxes', { enumerable: true, get() { touched++; throw Error('getter executed'); } });
  assert.throws(() => validate(getter), fault('accessor')); assert.equal(touched, 0);
  const nested = raw(); Object.defineProperty(nested.boxes[0], 'size', { enumerable: true, get() { touched++; return []; } });
  assert.throws(() => validate(nested), fault('accessor')); assert.equal(touched, 0);
  const iterable = [...base.boxes]; Object.defineProperty(iterable, Symbol.iterator, { value() { touched++; throw Error('iterator executed'); } });
  assert.throws(() => validate({ ...base, boxes: iterable }), fault('keys')); assert.equal(touched, 0);
  assert.throws(() => validate({ ...base, boxes: new Array(1) }), Fault);
});

test('immutable snapshots, deterministic order, no-op, atomic import and twenty-command undo', () => {
  const input = { version: 1, unit: 'mm', container: [1000, 1000, 1000], boxes: [{ ...box('a', [0, 0, 0]), position: [0, 0, 0] }] };
  const accepted = validate(input); input.boxes[0].position[0] = 999; input.container[0] = 1;
  assert.equal(accepted.boxes[0].position[0], 0); assert.equal(accepted.container[0], 1000);
  // Deliberately escape the readonly type to exercise runtime freezing.
  assert.throws(() => { (accepted.boxes[0].position as unknown as number[])[0] = 1; }, TypeError);
  let s = createSession(accepted); assert.equal(change(s, accepted), s); assert.equal(undo(s), s);
  const original = toJSON(s.document);
  for (let i = 1; i <= 25; i++) s = change(s, doc([box('a', [i, 0, 0])]));
  assert.equal(s.history.length, 20);
  for (let i = 0; i < 20; i++) s = undo(s);
  assert.equal(s.document.boxes[0].position[0], 5); assert.equal(s.history.length, 0);
  const before = s;
  for (const text of [JSON.stringify({ ...demoDocument(), boxes: Array(201).fill(demoDocument().boxes[0]) }), '{', ' '.repeat(MAX_IMPORT_BYTES + 1), '{"version":99}', JSON.stringify(doc([box('a', [0, 0, 0]), box('a', [100, 0, 0])]))]) {
    assert.throws(() => importText(s, text), Fault); assert.equal(s, before); assert.equal(s.history.length, 0);
  }
  const imported = importText(s, original); assert.equal(imported.history.length, 1); assert.equal(undo(imported).document, s.document);
  const sameImport = importText(s, toJSON(s.document)); assert.equal(sameImport.history.length, 1);
  const ordering = validate(doc([box('a', [0, 0, 0]), box('Z', [100, 0, 0]), box('_', [200, 0, 0])]));
  assert.deepEqual(ordering.boxes.map(b => b.id), ['Z', '_', 'a']);
  const negativeZero = validate(doc([box('a', [-0, 0, 0])])); assert.equal(Object.is(negativeZero.boxes[0].position[0], -0), false);
});

test('exact demo and safe standalone three-view SVG', () => {
  const d = demoDocument(); assert.equal(volume(d), 3840000000); assert.equal(containerVolume(d), 34560000000); assert.equal(occupancy(d), '11.1%');
  assert.deepEqual(extents(d.boxes[0]), [1000, 800, 800]);
  const labelled = validate({ ...d, boxes: d.boxes.map((b, i) => i ? b : { ...b, label: '<script>&"\' Ω' }) });
  const svg = toSVG(labelled);
  assert.equal((svg.match(/&lt;script&gt;&amp;&quot;&apos; Ω/g) ?? []).length, 3);
  assert.ok(svg.includes('XY · 6000 × 2400 mm')); assert.ok(svg.includes('XZ · 6000 × 2400 mm')); assert.ok(svg.includes('ZY · 2400 × 2400 mm'));
  assert.ok(!/<script|foreignObject|\bon\w+=|href=/.test(svg));
  assert.equal(toSVG(labelled), svg); assert.equal(toJSON(parseDocument(toJSON(labelled))), toJSON(labelled));
  assert.equal(volume(validate(doc([], [12000, 12000, 12000]))), 0);
});

test('pre-source independent corner/unit-cell literal fixtures across24 rotations',()=>{
  assert.equal(cellFixtures.orientations.length,24);assert.equal(cellFixtures.cases.length,240);
  for(const row of cellFixtures.cases){
    const [container,sizeA,orientationA,positionA,sizeB,orientationB,positionB,insideA,insideB,shared,legal,volumeA,volumeB]=row as unknown as [Vec,Vec,number,Vec,Vec,number,Vec,boolean,boolean,number,boolean,number,number];
    const a=box('a',positionA,sizeA,cellFixtures.orientations[orientationA] as unknown as Mat),b=box('b',positionB,sizeB,cellFixtures.orientations[orientationB] as unknown as Mat);
    assert.deepEqual(conflictPairs([a,b]),shared?[['a','b']]:[]);
    for(const [one,inside,expectedVolume] of [[a,insideA,volumeA],[b,insideB,volumeB]] as const){if(inside)assert.equal(volume(validate(doc([one],container))),expectedVolume);else assert.throws(()=>validate(doc([one],container)),fault('bounds'));}
    if(legal)assert.equal(volume(validate(doc([a,b],container))),volumeA+volumeB);else assert.throws(()=>validate(doc([a,b],container)),Fault);
  }
});


test('new-box suggestions are bounded, validated and do not mutate accepted work', () => {
  const document=demoDocument(), before=toJSON(document);
  const box=suggestNewBox(document,'new-1');
  assert.ok(box);assert.deepEqual(box.position,[3000,0,0]);
  validate({...document,boxes:[...document.boxes,box]});
  assert.equal(toJSON(document),before);assert.deepEqual(suggestNewBox(document,'new-1'),box);
  const full=validate({version:1,unit:'mm',container:[10,20,30],boxes:[{id:'full',label:'',size:[10,20,30],position:[0,0,0],orientation:IDENTITY}]});
  assert.equal(suggestNewBox(full,'new-1'),null);
  const empty=validate({...full,boxes:[]});
  assert.deepEqual(initialSize(empty),[10,20,30]);assert.deepEqual(suggestNewBox(empty,'new-1')!.position,[0,0,0]);
  const crowded=validate({version:1,unit:'mm',container:[200,1,1],boxes:Array.from({length:200},(_,i)=>({id:`b${i}`,label:'',size:[1,1,1],position:[i,0,0],orientation:IDENTITY}))});
  assert.equal(suggestNewBox(crowded,'new-1'),null);
});
