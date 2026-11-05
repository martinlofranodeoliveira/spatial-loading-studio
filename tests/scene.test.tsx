import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { createSession, IDENTITY, rotate, validate } from '../src/core';
import { SceneContent } from '../src/Scene';
import { fitCamera } from '../src/camera';
import type { Vec } from '../src/core';
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
test('real scene objects, geometry, world orientation, selection, update and disposal without WebGL', async () => {
  const d = validate({ version: 1, unit: 'mm', container: [1000, 1000, 1000], boxes: [{ id: 'a', label: 'A', size: [100, 200, 300], position: [10, 20, 30], orientation: IDENTITY }] });
  let selection = '', stopped = false;
  const select = (id: string) => { selection = id; };
  const renderer = await ReactThreeTestRenderer.create(<SceneContent document={d} selected="a" onSelect={select} />).catch(error => { console.dir(error, {depth: 8}); throw error; });
  try {
    const initial = renderer.scene.findByProps({ name: 'box:a' }).instance as THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    assert.ok(initial.isMesh); assert.ok(initial.geometry.isBufferGeometry);
    assert.deepEqual([initial.geometry.parameters.width, initial.geometry.parameters.height, initial.geometry.parameters.depth], [100, 200, 300]);
    assert.deepEqual(initial.position.toArray(), [60, 120, 180]);
    initial.updateWorldMatrix(true, true);
    const bounds = new THREE.Box3().setFromObject(initial);
    assert.deepEqual(bounds.min.toArray(), [10, 20, 30]); assert.deepEqual(bounds.max.toArray(), [110, 220, 330]);
    await renderer.fireEvent(renderer.scene.findByProps({ name: 'box:a' }), 'click', { stopPropagation() { stopped = true; } });
    assert.equal(selection, 'a'); assert.ok(stopped);
    let disposed = 0;
    initial.geometry.addEventListener('dispose', () => disposed++);
    initial.material.addEventListener('dispose', () => disposed++);
    const rotated = rotate(createSession(d), 'a', 'Y').document;
    await renderer.update(<SceneContent document={rotated} selected="" onSelect={select} />);
    assert.equal(disposed, 2);
    const mesh = renderer.scene.findByProps({ name: 'box:a' }).instance as THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    assert.deepEqual(mesh.position.toArray(), [160, 120, 80]);
    assert.deepEqual([mesh.geometry.parameters.width, mesh.geometry.parameters.height, mesh.geometry.parameters.depth], [100, 200, 300]);
    mesh.updateWorldMatrix(true, true);
    const rotatedBounds = new THREE.Box3().setFromObject(mesh);
    for (const [actual, expected] of [[rotatedBounds.min.x, 10], [rotatedBounds.min.y, 20], [rotatedBounds.min.z, 30], [rotatedBounds.max.x, 310], [rotatedBounds.max.y, 220], [rotatedBounds.max.z, 130]]) assert.ok(Math.abs(actual - expected) < 1e-9);
    const direction = new THREE.Vector3(1, 0, 0).applyQuaternion(mesh.quaternion);
    assert.ok(direction.distanceTo(new THREE.Vector3(0, 0, -1)) < 1e-12);
    let finalDisposal = 0;
    mesh.geometry.addEventListener('dispose', () => finalDisposal++);
    mesh.material.addEventListener('dispose', () => finalDisposal++);
    await renderer.unmount();
    assert.equal(finalDisposal, 2);
  } catch (error) { await renderer.unmount(); throw error; }
});

test('actual PerspectiveCamera fits all8 corners at mobile/desktop/extreme dimensions with zoom-safe clipping',()=>{
  for(const dimensions of [[6000,2400,2400],[1,1,1],[12000,12000,12000]] as Vec[])for(const [w,h] of [[340,620],[1200,700],[320,390],[20,1000]]){
    const camera=new THREE.PerspectiveCamera(42,w/h,1,100000);fitCamera(camera,dimensions,w,h,true);
    const center=new THREE.Vector3(...dimensions).multiplyScalar(.5);const direction=camera.position.clone().sub(center).normalize();
    for(const x of [0,dimensions[0]])for(const y of [0,dimensions[1]])for(const z of [0,dimensions[2]]){
      const projected=new THREE.Vector3(x,y,z).project(camera);assert.ok(Math.abs(projected.x)<=1&&Math.abs(projected.y)<=1&&Math.abs(projected.z)<=1,'allcontainercorners fit actual frustum');
    }
    const farDistance=camera.far-Math.hypot(...dimensions);camera.position.copy(center).addScaledVector(direction,farDistance);camera.lookAt(center);camera.updateMatrixWorld();
    for(const x of [0,dimensions[0]])for(const y of [0,dimensions[1]])for(const z of [0,dimensions[2]])assert.ok(new THREE.Vector3(x,y,z).project(camera).z<1,'allowed farzoom does not clip bounds');
    assert.equal(camera.near,.1,'nearplane permits close inspection afterfit');
  }
});
