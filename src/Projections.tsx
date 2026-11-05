import React from 'react';
import { extents, type Document } from './core';
import { views } from './export';
import { en, pt, type Locale } from './i18n';
export function Projections({ document, selected, onSelect, locale }: { document: Document; selected: string; onSelect: (id: string) => void; locale: Locale }) {
  const t = locale === 'pt' ? pt : en;
  return <div className="projections">
    {views.map(view => {
      const w = document.container[view.horizontal], h = document.container[view.vertical];
      return <figure key={view.name}>
        <figcaption>{t.projection} {view.name} <span>{w} × {h} mm</span></figcaption>
        <svg viewBox={`-20 -20 ${w + 40} ${h + 40}`} role="group" aria-label={`${t.projection} ${view.name}`}>
          <rect x="0" y="0" width={w} height={h} fill="#f3f6f7" stroke="#657783" vectorEffect="non-scaling-stroke" />
          {document.boxes.map(b => {
            const e = extents(b);
            return <rect key={b.id} x={b.position[view.horizontal]} y={h - b.position[view.vertical] - e[view.vertical]} width={e[view.horizontal]} height={e[view.vertical]}
              fill={b.id === selected ? '#235bd4' : '#c7d8e2'} fillOpacity={b.id === selected ? .72 : .5} stroke={b.id === selected ? '#163e92' : '#435c6d'} strokeWidth={b.id === selected ? 2 : 1} vectorEffect="non-scaling-stroke"
              role="button" tabIndex={0} aria-label={`${b.label} · ${b.id} · ${view.name}`} aria-pressed={b.id === selected}
              onClick={() => onSelect(b.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(b.id); } }}>
              <title>{b.label} · {b.id} · {e.join(' × ')} mm · [{b.position.join(', ')}]</title>
            </rect>;
          })}
        </svg>
      </figure>;
    })}
    <p className="projection-help">{t.planHelp}</p>
  </div>;
}
