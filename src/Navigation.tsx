import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { Move3d, X } from 'lucide-react';
import { en, pt, type Locale } from './i18n';
import type { Vec } from './core';

/** The pinned stdlib adapter avoids the native addon's pending Control-key listener.
 * Own the controls and restore the exact pre-connect inline touch policy. */
export function OrbitBinding({ camera, element, target, radius, invalidate }: { camera: THREE.PerspectiveCamera | THREE.OrthographicCamera; element: HTMLElement; target: Vec; radius: number; invalidate: () => void }) {
  useEffect(() => {
    const previous = element.style.touchAction;
    const controls = new OrbitControls(camera, element);
    controls.enableDamping = false;
    controls.minDistance = .1;
    controls.maxDistance = camera instanceof THREE.PerspectiveCamera ? Math.max(1, camera.far - 2 * radius) : 150000;
    controls.target.set(...target);
    controls.update();
    controls.addEventListener('change', invalidate);
    return () => {
      try { controls.removeEventListener('change', invalidate); controls.dispose(); }
      finally { element.style.touchAction = previous; }
    };
  }, [camera, element, target[0], target[1], target[2], radius, invalidate]);
  return null;
}

export function NavigationToggle({ active, disabled, onChange, locale }: { active: boolean; disabled: boolean; onChange: (active: boolean) => void; locale: Locale }) {
  const t = locale === 'pt' ? pt : en;
  const toggle = useRef<HTMLButtonElement>(null);
  const end = () => { onChange(false); toggle.current?.focus(); };
  useEffect(() => {
    if (!active) return;
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); onChange(false); toggle.current?.focus(); } };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [active, onChange]);
  return <><button type="button" ref={toggle} disabled={disabled} aria-pressed={active} onClick={() => onChange(!active)}><Move3d aria-hidden="true" />{t.navigation}</button>{active && <button type="button" onClick={end}><X aria-hidden="true" />{t.endNavigation}</button>}</>;
}
