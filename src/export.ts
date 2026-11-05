import { ensureAccepted, extents, occupancy, volume, type Document } from './core';
export function escapeXML(text: string): string {
  return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);
}
export const views = [
  { name: 'XY', horizontal: 0, vertical: 1 },
  { name: 'XZ', horizontal: 0, vertical: 2 },
  { name: 'ZY', horizontal: 2, vertical: 1 }
] as const;
export function toSVG(document: Document): string {
  ensureAccepted(document);
  const panels = views.map((view, index) => {
    const w = document.container[view.horizontal], h = document.container[view.vertical];
    const boxes = document.boxes.map(b => {
      const e = extents(b);
      return `<rect x="${b.position[view.horizontal]}" y="${h - b.position[view.vertical] - e[view.vertical]}" width="${e[view.horizontal]}" height="${e[view.vertical]}" fill="#dce6ec" fill-opacity="0.65" stroke="#202b36" stroke-width="1" vector-effect="non-scaling-stroke"><title>${escapeXML(b.id)}: ${escapeXML(b.label)}; ${e.join(' × ')} mm</title></rect>`;
    }).join('\n');
    return `<text x="24" y="${74 + index * 290}" font-size="16">${view.name} · ${w} × ${h} mm</text>\n<svg x="24" y="${90 + index * 290}" width="952" height="236" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet"><rect width="${w}" height="${h}" fill="#f3f6f7" stroke="#202b36" vector-effect="non-scaling-stroke"/>${boxes}</svg>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="950" viewBox="0 0 1000 950" role="img" aria-labelledby="title"><title id="title">Spatial Loading Studio — orthographic plan / planta ortográfica</title><rect width="1000" height="950" fill="white"/><g fill="#202b36" font-family="sans-serif"><text x="24" y="30" font-size="16">mm · occupied / ocupado: ${volume(document)} mm³ · rounded / arredondado: ${occupancy(document)}</text>${panels}</g></svg>\n`;
}
export type Download = (name: string, content: string, mime: string) => void;
export const browserDownload: Download = (name, content, mime) => {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement('a');
  try {
    anchor.href = url;
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
};
