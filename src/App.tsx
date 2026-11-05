import React, { useEffect, useRef, useState } from 'react';
import { Box as BoxIcon, Plus, Trash2, Undo2, Download as DownloadIcon, Upload, RotateCw, Check, X } from 'lucide-react';
import { change, createSession, demoDocument, extents, Fault, IDENTITY, importText, MAX_IMPORT_BYTES, rotate, toJSON, undo, volume, containerVolume, type Session, type Vec } from './core';
import { browserDownload, toSVG, type Download } from './export';
import { en, pt, errorText, type Locale } from './i18n';
import { Viewport } from './Viewport';
type Draft = { id: string; label: string; size: string[]; position: string[] };
type Status = 'idle' | 'ready' | 'applied' | 'added' | 'removed' | 'imported' | 'undone' | 'noChange' | 'exported' | 'reading';
function numbers(values: string[], field: string): Vec {
  return values.map((s, i) => {
    if (!/^\d{1,5}$/.test(s)) throw new Fault('number', `${field}-${i}`);
    return Number(s);
  }) as unknown as Vec;
}
function anchorFor(error: unknown, fallback: string): string {
  if (!(error instanceof Fault) || fallback.startsWith('container-')) return fallback;
  if (/^(size|position|container)-[012]$/.test(error.field)) return error.field;
  if (error.field.startsWith('container')) return 'container-0';
  for (const key of ['size', 'position']) if (error.field.includes(key)) return `${key}-0`;
  if (error.field.includes('label')) return 'box-label';
  if (error.field.endsWith('.id')) return 'box-id';
  return fallback;
}
export function App({ capability, download = browserDownload }: { capability?: () => boolean; download?: Download }) {
  const [session, setSession] = useState(() => createSession(demoDocument()));
  const current = useRef(session);
  const [locale, setLocale] = useState<Locale>('pt');
  const t = locale === 'pt' ? pt : en;
  const [selected, setSelected] = useState('box-001');
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>({ id: '', label: '', size: ['1000', '800', '800'], position: ['0', '0', '0'] });
  const [container, setContainer] = useState(['6000', '2400', '2400']);
  const [json, setJSON] = useState('');
  const [status, setStatus] = useState<Status>('ready');
  const [error, setError] = useState<{ value: unknown; anchor: string } | null>(null);
  const readSequence = useRef(0);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; readSequence.current++; }; }, []);
  const doc = session.document;
  const box = doc.boxes.find(b => b.id === selected);
  useEffect(() => {
    setAdding(false);
    if (box) setDraft({ id: box.id, label: box.label, size: box.size.map(String), position: box.position.map(String) });
  }, [doc, selected]);
  useEffect(() => setContainer(doc.container.map(String)), [doc]);
  function accept(next: Session, message: Status, preferred = selected) {
    const previous = current.current;
    current.current = next;
    setSession(next);
    if (!next.document.boxes.some(b => b.id === preferred)) preferred = next.document.boxes[0]?.id ?? '';
    setSelected(preferred);
    setError(null);
    setStatus(next === previous ? 'noChange' : message);
  }
  function run(action: () => Session, message: Status, fallback = 'box-id', preferred?: string) {
    readSequence.current++; // A newer explicit command revokes an older asynchronous import.
    try { accept(action(), message, preferred); }
    catch (value) { setStatus('idle'); setError({ value, anchor: anchorFor(value, fallback) }); }
  }
  function beginAdd() {
    let n = 1;
    while (doc.boxes.some(b => b.id === `new-${n}`)) n++;
    setDraft({ id: `new-${n}`, label: '', size: ['1000', '800', '800'], position: ['0', '0', '0'] });
    setAdding(true); setError(null);
  }
  function applyBox(event: React.FormEvent) {
    event.preventDefault();
    run(() => {
      const updated = { id: draft.id, label: draft.label, size: numbers(draft.size, 'size'), position: numbers(draft.position, 'position'), orientation: adding ? IDENTITY : box!.orientation };
      const d = current.current.document;
      const boxes = adding ? [...d.boxes, updated] : d.boxes.map(b => b.id === selected ? updated : b);
      return change(current.current, { ...d, boxes });
    }, adding ? 'added' : 'applied', 'position-0', draft.id);
  }
  function doImport(text: string) { run(() => importText(current.current, text), 'imported', 'import-json'); }
  async function readFile(file: File) {
    const sequence = ++readSequence.current;
    if (file.size > MAX_IMPORT_BYTES) { setStatus('idle'); setError({ value: new Fault('bytes'), anchor: 'import-file' }); return; }
    setStatus('reading');
    try {
      const text = await file.text();
      if (alive.current && sequence === readSequence.current) doImport(text);
    } catch {
      if (alive.current && sequence === readSequence.current) { setStatus('idle'); setError({ value: new Fault('io'), anchor: 'import-file' }); }
    }
  }
  function exportFile(kind: 'json' | 'svg') {
    try {
      const d = current.current.document;
      download(`spatial-plan.${kind}`, kind === 'json' ? toJSON(d) : toSVG(d), kind === 'json' ? 'application/json;charset=utf-8' : 'image/svg+xml;charset=utf-8');
      setError(null); setStatus('exported');
    } catch (value) { setError({ value, anchor: `export-${kind}` }); }
  }
  function numericField(id: string, label: string, value: string, onChange: (value: string) => void) {
    return <label key={id} htmlFor={id}>{label}<input id={id} inputMode="numeric" value={value} maxLength={16} onChange={event => onChange(event.target.value)} aria-invalid={error?.anchor === id || undefined} aria-describedby={error?.anchor === id ? 'error-summary' : undefined} /></label>;
  }
  const format = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 0 });
  const percent = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(volume(doc) * 100 / containerVolume(doc));
  return <main lang={locale === 'pt' ? 'pt-BR' : 'en'}>
    <header className="topbar">
      <div className="identity"><BoxIcon aria-hidden="true" /><div><h1>{t.title}</h1><span>{t.version}</span></div></div>
      <nav className="file-toolbar" aria-label={t.fileActions}>
        <button type="button" disabled={!session.history.length} onClick={() => run(() => undo(current.current), 'undone')}><Undo2 aria-hidden="true" />{t.undo}<span className="history-count">{session.history.length}/20</span></button>
        <button type="button" id="export-json" onClick={() => exportFile('json')}><DownloadIcon aria-hidden="true" />{t.exportJSON}</button>
        <button type="button" id="export-svg" onClick={() => exportFile('svg')}><DownloadIcon aria-hidden="true" />{t.exportSVG}</button>
      </nav>
      <label className="locale">{t.language}<select value={locale} onChange={event => setLocale(event.target.value as Locale)}><option value="pt">Português</option><option value="en">English</option></select></label>
    </header>
    {error && <div className="error-summary" id="error-summary" role="alert"><strong>{t.errorHeading}. </strong>{errorText(error.value, locale)} <a href={`#${error.anchor}`} onClick={event => { event.preventDefault(); document.getElementById(error.anchor)?.focus(); }}>{t.review}</a></div>}
    <div className="editor-layout">
      <aside className="hierarchy">
        <details open><summary>{t.objects} <span>{doc.boxes.length}/200</span></summary>
          <button type="button" className="add-button" disabled={doc.boxes.length >= 200} onClick={beginAdd}><Plus aria-hidden="true" />{t.add}</button>
          {!doc.boxes.length && <p className="empty">{t.empty}</p>}
          <ul className="object-list">{doc.boxes.map(b => <li key={b.id}><button type="button" aria-pressed={selected === b.id && !adding} onClick={() => { setSelected(b.id); setAdding(false); setDraft({ id: b.id, label: b.label, size: b.size.map(String), position: b.position.map(String) }); setError(null); }}><BoxIcon aria-hidden="true" /><span>{b.label || b.id}<small>{b.id}</small></span><span className="sr-only">{b.label ? ` · ${b.id}` : ''}</span></button></li>)}</ul>
        </details>
        <details className="import-panel"><summary><Upload aria-hidden="true" />{t.importTitle}</summary>
          <p>{t.importHelp}</p>
          <label htmlFor="import-file">{t.importFile}<input id="import-file" type="file" accept=".json,application/json" onChange={event => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; if (file) void readFile(file); }} /></label>
          <label htmlFor="import-json">{t.importText}<textarea id="import-json" value={json} maxLength={MAX_IMPORT_BYTES} onChange={event => setJSON(event.target.value)} spellCheck={false} /></label>
          <button type="button" onClick={() => doImport(json)}>{t.importApply}</button>
        </details>
      </aside>
      <Viewport document={doc} selected={adding ? '' : selected} onSelect={id => { setSelected(id); setAdding(false); setError(null); }} locale={locale} capability={capability} />
      <aside className="inspector">
        <details open><summary>{t.properties}</summary>
          {(box || adding) ? <form onSubmit={applyBox}>
            <div className="selection-context"><BoxIcon aria-hidden="true" /><strong>{adding ? t.newBox : box!.label || box!.id}</strong><span>{adding ? '' : box!.id}</span></div>
            <label htmlFor="box-id">{t.id}<input id="box-id" value={draft.id} readOnly={!adding} maxLength={64} onChange={event => setDraft({ ...draft, id: event.target.value })} /></label>
            <label htmlFor="box-label">{t.label}<input id="box-label" value={draft.label} maxLength={128} onChange={event => setDraft({ ...draft, label: event.target.value })} /></label>
            <fieldset><legend>{t.baseDimensions}</legend>{[t.sizeX, t.sizeY, t.sizeZ].map((label, i) => numericField(`size-${i}`, label, draft.size[i], value => setDraft({ ...draft, size: draft.size.map((n, j) => j === i ? value : n) })))}</fieldset>
            <fieldset><legend>{t.convention}</legend>{[t.positionX, t.positionY, t.positionZ].map((label, i) => numericField(`position-${i}`, label, draft.position[i], value => setDraft({ ...draft, position: draft.position.map((n, j) => j === i ? value : n) })))}</fieldset>
            <button className="primary" type="submit"><Check aria-hidden="true" />{t.apply}</button>
            {adding ? <button type="button" onClick={() => { setAdding(false); if (box) setDraft({ id: box.id, label: box.label, size: box.size.map(String), position: box.position.map(String) }); setError(null); }}><X aria-hidden="true" />{t.cancel}</button> : <>
              <div className="rotation-controls">{(['X', 'Y', 'Z'] as const).map(axis => <button type="button" key={axis} onClick={() => run(() => rotate(current.current, selected, axis), 'applied', 'position-0')}><RotateCw aria-hidden="true" />{t[`rotate${axis}`]}</button>)}</div>
              <output className="orientation" aria-label={t.orientation}>{box!.orientation.slice(0, 3).join(' ')}<br />{box!.orientation.slice(3, 6).join(' ')}<br />{box!.orientation.slice(6, 9).join(' ')}</output>
              <p className="extent-readout">{t.extents}: {extents(box!).join(' × ')} mm</p>
              <button type="button" className="remove" onClick={() => run(() => change(current.current, { ...current.current.document, boxes: current.current.document.boxes.filter(b => b.id !== selected) }), 'removed')}><Trash2 aria-hidden="true" />{t.remove}</button>
            </>}
          </form> : <p className="empty">{t.noSelection}</p>}
        </details>
        <details className="container-panel"><summary>{t.volume}</summary><form onSubmit={event => { event.preventDefault(); run(() => change(current.current, { ...current.current.document, container: numbers(container, 'container') }), 'applied', 'container-0'); }}>
          {[t.containerX, t.containerY, t.containerZ].map((label, i) => numericField(`container-${i}`, label, container[i], value => setContainer(container.map((n, j) => i === j ? value : n))))}
          <button type="submit">{t.resize}</button>
        </form></details>
      </aside>
    </div>
    <footer>
      <div className="statistics"><span>{t.count}: <b>{doc.boxes.length}</b></span><span>{t.occupied}: <b>{format.format(volume(doc))} mm³</b></span><span>{t.occupancy}: <b>{percent}%</b></span></div>
      <p role="status" aria-label={t.operationStatus} aria-live="polite">{t[status]}</p>
      <div className="footnote"><span>{t.limits}</span><a href="https://lofranotecnologia.com.br">{t.contact}</a></div>
    </footer>
  </main>;
}
