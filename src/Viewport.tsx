import React, { Component, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitBinding, NavigationToggle } from './Navigation';
import { fitCamera } from './camera';
import * as THREE from 'three';
import { Focus, RotateCcw, Cuboid, PanelsTopLeft } from 'lucide-react';
import type { Box, Document, Vec } from './core';
import { SceneContent } from './Scene';
import { Projections } from './Projections';
import { en, pt, type Locale } from './i18n';
export function browserCapability(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
}
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}
function ContextWatch({ onFailure }: { onFailure: () => void }) {
  const gl = useThree(s => s.gl);
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return null;
}
function FitCamera({ dimensions, request }: { dimensions: Vec; request: { sequence: number; reset: boolean } }) {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    fitCamera(camera, dimensions, size.width, size.height, request.reset);
    invalidate();
  }, [camera, size.width, size.height, dimensions[0], dimensions[1], dimensions[2], request, invalidate]);
  return null;
}
function Navigation({ dimensions }: { dimensions: Vec }) {
  const { camera, gl, invalidate } = useThree();
  return <OrbitBinding camera={camera} element={gl.domElement} target={[dimensions[0] / 2, dimensions[1] / 2, dimensions[2] / 2]} radius={Math.hypot(...dimensions) / 2} invalidate={invalidate} />;
}
export function Viewport({ document, selected, onSelect, locale, capability = browserCapability, draftPreview, draftActive = false }: { draftPreview?: Box; draftActive?: boolean; document: Document; selected: string; onSelect: (id: string) => void; locale: Locale; capability?: () => boolean }) {
  const t = locale === 'pt' ? pt : en;
  const [available, setAvailable] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'3d' | '2d'>('3d');
  const [loaded, setLoaded] = useState(false);
  const [navigation, setNavigation] = useState(false);
  const [request, setRequest] = useState({ sequence: 0, reset: true });
  useEffect(() => { try { setAvailable(capability()); } catch { setAvailable(false); } }, [capability]);
  const failure = React.useCallback(() => { setAvailable(false); setLoaded(false); setNavigation(false); }, []);
  return <section className="workspace" aria-label={t.scene}>
    <div className="workspace-heading"><span>{t.convention}</span><span className="measurement" aria-label={t.measurement}>{document.container.join(' × ')} mm</span></div>
    {draftActive && <div className="draft-preview-note" role="status" aria-label={t.draftPreview}><strong>{t.draftPreview}</strong><p>{draftPreview ? t.draftHelp : t.draftInvalid}</p></div>}
    <div className={`stage ${available && mode === '3d' ? 'webgl-stage' : 'plan-stage'}`}>
      {available === null ? <p role="status">{t.loading}</p> : available && mode === '3d' ? <>
        {!loaded && <p className="loading" role="status">{t.loading}</p>}
        <SceneBoundary onFailure={failure}>
          <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ fov: 42, position: [10000, 7000, 10000], near: 1, far: 100000 }} onCreated={() => setLoaded(true)} fallback={<p>{t.fallback}</p>}>
            <color attach="background" args={['#f3f6f7']} />
            <ContextWatch onFailure={failure} />
            <SceneContent document={document} selected={selected} onSelect={onSelect} draftPreview={draftPreview} />
            {navigation && <Navigation dimensions={document.container} />}
            <FitCamera dimensions={document.container} request={request} />
          </Canvas>
        </SceneBoundary>
      </> : <>
        {!available && <p className="fallback-note">{t.fallback}</p>}
        <Projections document={document} selected={selected} onSelect={onSelect} locale={locale} draftPreview={draftPreview} />
      </>}
    </div>
    <div className="view-toolbar">
      <NavigationToggle active={navigation} disabled={!available || mode !== '3d'} onChange={setNavigation} locale={locale} />
      <button type="button" onClick={() => { setMode('3d'); setNavigation(false); }} disabled={!available} aria-pressed={mode === '3d' && !!available}><Cuboid aria-hidden="true" />{t.view3d}</button>
      <button type="button" onClick={() => { setMode('2d'); setNavigation(false); }} aria-pressed={mode === '2d' || available === false}><PanelsTopLeft aria-hidden="true" />{t.view2d}</button>
      <button type="button" disabled={!available || mode !== '3d'} onClick={() => setRequest(r => ({ sequence: r.sequence + 1, reset: false }))}><Focus aria-hidden="true" />{t.fit}</button>
      <button type="button" disabled={!available || mode !== '3d'} onClick={() => setRequest(r => ({ sequence: r.sequence + 1, reset: true }))}><RotateCcw aria-hidden="true" />{t.reset}</button>
    </div>
    <p className="view-help">{available && mode === '3d' ? navigation ? t.controls : t.controlsInactive : t.planHelp}</p>
  </section>;
}
