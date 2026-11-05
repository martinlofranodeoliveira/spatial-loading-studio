import { ensureAccepted, extents, IDENTITY, overlaps, validate, type Box, type Document, type Vec } from './core';

export function initialSize(document: Document): Vec {
  ensureAccepted(document);
  return [Math.min(1000, document.container[0]), Math.min(800, document.container[1]), Math.min(800, document.container[2])];
}

// A bounded suggestion, not a packing solver: origin and the three positive faces
// of each accepted box. Absence of a candidate is not proof that no space exists.
export function suggestNewBox(document: Document, id: string): Box | null {
  ensureAccepted(document);
  if (document.boxes.length >= 200) return null;
  const size = initialSize(document);
  const points: Vec[] = [[0, 0, 0]];
  for (const box of document.boxes) {
    const extent = extents(box);
    for (let axis = 0; axis < 3; axis++) {
      const point = [...box.position] as [number, number, number];
      point[axis] += extent[axis];
      points.push(point);
    }
  }
  points.sort((a, b) => a[1] - b[1] || a[2] - b[2] || a[0] - b[0]);
  const seen = new Set<string>();
  for (const position of points) {
    const key = position.join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    if (position.some((v, axis) => v + size[axis] > document.container[axis])) continue;
    const candidate: Box = { id, label: '', size, position, orientation: IDENTITY };
    if (document.boxes.some(box => overlaps(box, candidate))) continue;
    const accepted = validate({ ...document, boxes: [...document.boxes, candidate] });
    return accepted.boxes.find(box => box.id === id)!;
  }
  return null;
}
