export type Vec = readonly [number, number, number];
export type Mat = readonly [number, number, number, number, number, number, number, number, number];
export type Box = Readonly<{ id: string; label: string; size: Vec; position: Vec; orientation: Mat }>;
export type Document = Readonly<{ version: 1; unit: 'mm'; container: Vec; boxes: readonly Box[] }>;
export type Session = Readonly<{ document: Document; history: readonly Document[] }>;
export type Axis = 'X' | 'Y' | 'Z';
export const MAX_IMPORT_BYTES = 256 * 1024;
export const IDENTITY: Mat = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
export class Fault extends Error {
  constructor(public readonly code: string, public readonly field = '', public readonly details: readonly string[] = []) {
    super(`${code}${field ? `: ${field}` : ''}${details.length ? ` (${details.join(', ')})` : ''}`);
    this.name = 'Fault';
  }
}
const turns: Record<Axis, Mat> = {
  X: [1, 0, 0, 0, 0, -1, 0, 1, 0],
  Y: [0, 0, 1, 0, 1, 0, -1, 0, 0],
  Z: [0, -1, 0, 1, 0, 0, 0, 0, 1]
};
export function multiply(a: Mat, b: Mat): Mat {
  const result: number[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    let n = 0;
    for (let k = 0; k < 3; k++) n += a[r * 3 + k] * b[k * 3 + c];
    result.push(n === 0 ? 0 : n);
  }
  return Object.freeze(result) as unknown as Mat;
}
function orientations(): readonly Mat[] {
  const found = new Map<string, Mat>([[IDENTITY.join(','), IDENTITY]]);
  const queue = [IDENTITY];
  for (let i = 0; i < queue.length; i++) for (const axis of ['X', 'Y', 'Z'] as const) {
    const matrix = multiply(turns[axis], queue[i]);
    const key = matrix.join(',');
    if (!found.has(key)) { found.set(key, matrix); queue.push(matrix); }
  }
  return Object.freeze(queue);
}
export const ORIENTATIONS = orientations();
const matrixKeys = new Set(ORIENTATIONS.map(m => m.join(',')));
const accepted = new WeakSet<object>();
const sessions = new WeakSet<object>();
const encoder = new TextEncoder();
const fail = (code: string, field = '', details: readonly string[] = []): never => { throw new Fault(code, field, details); };

function record(value: unknown, keys: readonly string[], path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return fail('type', path);
  const prototype: unknown = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return fail('type', path);
  const own = Reflect.ownKeys(value);
  if (own.length !== keys.length || own.some(k => typeof k !== 'string' || !keys.includes(k))) return fail('keys', path);
  const copy: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  for (const key of keys) {
    const d = Object.getOwnPropertyDescriptor(value, key);
    if (!d || !('value' in d) || !d.enumerable) return fail('accessor', `${path}.${key}`);
    copy[key] = d.value as unknown;
  }
  return copy;
}
function array(value: unknown, max: number, path: string, exact?: number): unknown[] {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype) return fail('type', path);
  const ld = Object.getOwnPropertyDescriptor(value, 'length');
  const length: unknown = ld && 'value' in ld ? ld.value : undefined;
  if (typeof length !== 'number' || length > max || (exact !== undefined && length !== exact)) return fail('count', path);
  const keys = Reflect.ownKeys(value);
  if (keys.length !== length + 1) return fail('keys', path);
  const result: unknown[] = [];
  for (let i = 0; i < length; i++) {
    const d = Object.getOwnPropertyDescriptor(value, String(i));
    if (!d || !('value' in d) || !d.enumerable) return fail('accessor', `${path}[${i}]`);
    result.push(d.value as unknown);
  }
  return result;
}
function integer(value: unknown, min: number, max: number, path: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) return fail('range', path);
  return value === 0 ? 0 : value;
}
function vector(value: unknown, min: number, path: string): Vec {
  const a = array(value, 3, path, 3);
  return Object.freeze(a.map((v, i) => integer(v, min, 12000, `${path}[${i}]`))) as unknown as Vec;
}
function readBox(value: unknown, index: number): Box {
  const path = `boxes[${index}]`;
  const b = record(value, ['id', 'label', 'size', 'position', 'orientation'], path);
  if (typeof b.id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(b.id)) return fail('id', `${path}.id`);
  if (typeof b.label !== 'string' || b.label.includes('\0') || b.label.length > 128 || encoder.encode(b.label).length > 128 || /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(b.label)) return fail('label', `${path}.label`);
  const m = array(b.orientation, 9, `${path}.orientation`, 9).map((v, i) => integer(v, -1, 1, `${path}.orientation[${i}]`));
  if (!matrixKeys.has(m.join(','))) return fail('orientation', `${path}.orientation`);
  return Object.freeze({ id: b.id, label: b.label, size: vector(b.size, 1, `${path}.size`), position: vector(b.position, 0, `${path}.position`), orientation: Object.freeze(m) as unknown as Mat });
}
export function extents(box: Box): Vec {
  return [0, 1, 2].map(r => Math.abs(box.orientation[r * 3]) * box.size[0] + Math.abs(box.orientation[r * 3 + 1]) * box.size[1] + Math.abs(box.orientation[r * 3 + 2]) * box.size[2]) as unknown as Vec;
}
export function overlaps(a: Box, b: Box): boolean {
  const ae = extents(a), be = extents(b);
  return [0, 1, 2].every(i => a.position[i] < b.position[i] + be[i] && b.position[i] < a.position[i] + ae[i]);
}
export function conflictPairs(boxes: readonly Box[]): readonly (readonly [string, string])[] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) if (overlaps(boxes[i], boxes[j])) pairs.push([boxes[i].id, boxes[j].id]);
  return pairs;
}
export function validate(value: unknown): Document {
  const d = record(value, ['version', 'unit', 'container', 'boxes'], 'document');
  if (d.version !== 1 || d.unit !== 'mm') return fail('schema', 'document');
  const container = vector(d.container, 1, 'container');
  const boxes = array(d.boxes, 200, 'boxes').map(readBox);
  boxes.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const ids = new Set<string>();
  for (const b of boxes) {
    if (ids.has(b.id)) return fail('duplicate', 'boxes', [b.id]);
    ids.add(b.id);
    const e = extents(b);
    if ([0, 1, 2].some(i => b.position[i] + e[i] > container[i])) return fail('bounds', `boxes[${boxes.indexOf(b)}].position`, [b.id]);
  }
  const pair = conflictPairs(boxes)[0];
  if (pair) return fail('overlap', 'boxes', pair);
  const result: Document = Object.freeze({ version: 1, unit: 'mm', container, boxes: Object.freeze(boxes) });
  accepted.add(result);
  return result;
}
export function ensureAccepted(document: Document): void {
  if (!accepted.has(document)) fail('document');
}
export function toJSON(document: Document): string {
  ensureAccepted(document);
  return JSON.stringify(document, null, 2) + '\n';
}
export function volume(document: Document): number {
  ensureAccepted(document);
  return document.boxes.reduce((sum, b) => sum + b.size[0] * b.size[1] * b.size[2], 0);
}
export function containerVolume(document: Document): number {
  ensureAccepted(document);
  return document.container[0] * document.container[1] * document.container[2];
}
export function occupancy(document: Document): string { return (100 * volume(document) / containerVolume(document)).toFixed(1) + '%'; }

// Bounded JSON grammar, including duplicate-member rejection. This is not an RSS sandbox.
export function parseDocument(text: string): Document {
  if (typeof text !== 'string') return fail('type', 'import');
  if (text.length > MAX_IMPORT_BYTES || encoder.encode(text).length > MAX_IMPORT_BYTES) return fail('bytes', 'import');
  let i = 0;
  const ws = () => { while (i < text.length && /[\x20\t\r\n]/.test(text[i])) i++; };
  const bad = (): never => fail('json', 'import');
  const string = (): string => {
    const start = i++;
    while (i < text.length) {
      const c = text[i++];
      if (c === '"') {
        try { return JSON.parse(text.slice(start, i)) as string; } catch { return bad(); }
      }
      if (c === '\\') i++;
    }
    return bad();
  };
  const value = (depth: number): unknown => {
    if (depth > 16) return fail('depth', 'import');
    ws();
    const c = text[i];
    if (c === '"') return string();
    if (c === '{') {
      i++; ws();
      const out: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
      const keys = new Set<string>();
      if (text[i] === '}') { i++; return out; }
      while (i < text.length) {
        ws(); if (text[i] !== '"') return bad();
        const key = string();
        if (keys.has(key)) return fail('duplicateKey', 'import');
        keys.add(key); ws(); if (text[i++] !== ':') return bad();
        out[key] = value(depth + 1); ws();
        const end = text[i++];
        if (end === '}') return out;
        if (end !== ',') return bad();
      }
      return bad();
    }
    if (c === '[') {
      i++; ws(); const out: unknown[] = [];
      if (text[i] === ']') { i++; return out; }
      while (i < text.length) {
        out.push(value(depth + 1)); ws();
        const end = text[i++];
        if (end === ']') return out;
        if (end !== ',') return bad();
      }
      return bad();
    }
    for (const [literal, result] of [['true', true], ['false', false], ['null', null]] as const) {
      if (text.startsWith(literal, i)) { i += literal.length; return result; }
    }
    const number = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(text.slice(i));
    if (!number) return bad();
    i += number[0].length;
    return Number(number[0]);
  };
  const result = value(0); ws();
  if (i !== text.length) return bad();
  return validate(result);
}
function makeSession(document: Document, history: readonly Document[]): Session {
  const s = Object.freeze({ document, history: Object.freeze([...history]) });
  sessions.add(s);
  return s;
}
function checkSession(s: Session): void { if (!sessions.has(s)) fail('document'); }
export function createSession(document: Document = demoDocument()): Session {
  ensureAccepted(document);
  return makeSession(document, []);
}
export function change(s: Session, candidate: unknown, imported = false): Session {
  checkSession(s);
  const document = validate(candidate);
  if (!imported && toJSON(document) === toJSON(s.document)) return s;
  return makeSession(document, [...s.history, s.document].slice(-20));
}
export function importText(s: Session, text: string): Session { return change(s, parseDocument(text), true); }
export function undo(s: Session): Session {
  checkSession(s);
  return s.history.length ? makeSession(s.history[s.history.length - 1], s.history.slice(0, -1)) : s;
}
export function rotate(s: Session, id: string, axis: Axis): Session {
  checkSession(s);
  if (axis !== 'X' && axis !== 'Y' && axis !== 'Z') return fail('orientation', 'orientation');
  if (!s.document.boxes.some(b => b.id === id)) return fail('id', 'id');
  return change(s, { ...s.document, boxes: s.document.boxes.map(b => b.id === id ? { ...b, orientation: multiply(turns[axis], b.orientation) } : b) });
}
export function demoDocument(): Document {
  const positions: Vec[] = [[0, 0, 0], [1000, 0, 0], [2000, 0, 0], [0, 0, 800], [1000, 0, 800], [0, 800, 0]];
  return validate({ version: 1, unit: 'mm', container: [6000, 2400, 2400], boxes: positions.map((position, i) => ({ id: `box-00${i + 1}`, label: `B0${i + 1}`, size: [1000, 800, 800], position, orientation: IDENTITY })) });
}
