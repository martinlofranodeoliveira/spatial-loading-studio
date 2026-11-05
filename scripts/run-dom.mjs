import { JSDOM, VirtualConsole } from 'jsdom';
import { MessageChannel } from 'node:worker_threads';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const channels = [];
class TrackedMessageChannel extends MessageChannel { constructor() { super(); channels.push(this); } }
const errors = [];
const console = new VirtualConsole();
console.on('jsdomError', e => errors.push(e.message));
console.on('error', (...args) => errors.push(args.map(String).join(' ')));
console.on('warn', (...args) => errors.push(args.map(String).join(' ')));
const dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only', url: 'https://tests.invalid/', pretendToBeVisual: true, virtualConsole: console });
Object.defineProperty(dom.window, 'MessageChannel', { value: TrackedMessageChannel });
let timer;
try {
  vm.runInContext(await readFile('build/dom/dom.iife.js', 'utf8'), dom.getInternalVMContext(), { timeout: 10000, filename: 'dom-tests.js' });
  const result = await Promise.race([dom.window.__domTests, new Promise((_, reject) => { timer = setTimeout(() => reject(Error('DOM test deadline exceeded')), 60000); })]);
  if (errors.length) throw Error('JSDOM diagnostics: ' + errors.join('; '));
  process.stdout.write(JSON.stringify({ ...result, environment: 'JSDOM outside-only VM', shim: 'tracked Node MessageChannel; ports closed', node_globals_mixed: false }) + '\n');
} finally {
  clearTimeout(timer);
  for (const channel of channels) { channel.port1.close(); channel.port2.close(); }
  dom.window.close();
}
