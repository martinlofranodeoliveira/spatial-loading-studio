import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { extents, type Box, type Document, type Vec } from './core';
function useResources(size: Vec, selected: boolean, preview = false) {
  const resources = useMemo(() => {
    const geometry = new THREE.BoxGeometry(...size);
    return {
      geometry,
      material: new THREE.MeshStandardMaterial({ color: selected || preview ? '#a6c0ef' : '#dce6ec', roughness: .82, metalness: 0, transparent: preview, opacity: preview ? .22 : 1, depthWrite: !preview }),
      edges: new THREE.EdgesGeometry(geometry),
      line: new THREE.LineBasicMaterial({ color: selected || preview ? '#235bd4' : '#526875' })
    };
  }, [size[0], size[1], size[2], selected, preview]);
  useEffect(() => () => { resources.geometry.dispose(); resources.material.dispose(); resources.edges.dispose(); resources.line.dispose(); }, [resources]);
  return resources;
}
function SceneBox({ box, selected, onSelect, preview = false }: { preview?: boolean; box: Box; selected: boolean; onSelect: (id: string) => void }) {
  const r = useResources(box.size, selected, preview);
  const e = extents(box);
  const matrix = new THREE.Matrix4().set(
    box.orientation[0], box.orientation[1], box.orientation[2], 0,
    box.orientation[3], box.orientation[4], box.orientation[5], 0,
    box.orientation[6], box.orientation[7], box.orientation[8], 0,
    0, 0, 0, 1
  );
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(box.id); };
  return <mesh name={`${preview ? 'draft' : 'box'}:${box.id}`} userData={{ draft: preview }} geometry={r.geometry} material={r.material} dispose={null}
    position={[box.position[0] + e[0] / 2, box.position[1] + e[1] / 2, box.position[2] + e[2] / 2]} quaternion={[quaternion.x, quaternion.y, quaternion.z, quaternion.w]} onClick={preview ? undefined : click} {...(preview ? { raycast: () => undefined } : {})}>
    <lineSegments name={`${preview ? 'draft-edges' : 'edges'}:${box.id}`} geometry={r.edges} material={r.line} raycast={() => undefined} dispose={null} />
  </mesh>;
}
function ContainerWire({ size }: { size: Vec }) {
  const r = useResources(size, false);
  return <lineSegments name="container-bounds" geometry={r.edges} material={r.line} position={[size[0] / 2, size[1] / 2, size[2] / 2]} raycast={() => undefined} dispose={null} />;
}
export function SceneContent({ document, selected, onSelect, draftPreview }: { draftPreview?: Box; document: Document; selected: string; onSelect: (id: string) => void }) {
  const size = Math.max(document.container[0], document.container[2]);
  return <group name="spatial-document">
    <ambientLight intensity={1.65} />
    <directionalLight position={[6000, 10000, 8000]} intensity={2.2} />
    <gridHelper name="millimetre-grid" args={[size, Math.max(1, Math.ceil(size / 1000)), '#91a5b3', '#d0dce3']} position={[document.container[0] / 2, -1, document.container[2] / 2]} />
    <ContainerWire size={document.container} />
    {document.boxes.map(box => <SceneBox key={box.id} box={box} selected={box.id === selected} onSelect={onSelect} />)}
    {draftPreview && <SceneBox box={draftPreview} selected={false} onSelect={onSelect} preview />}
  </group>;
}
