import * as THREE from 'three';
import type { Vec } from './core';
/** Fits the bounding sphere without tying the near plane to a previous zoom. */
export function fitCamera(camera: THREE.PerspectiveCamera, dimensions: Vec, width: number, height: number, reset: boolean): void {
  const target = new THREE.Vector3(dimensions[0] / 2, dimensions[1] / 2, dimensions[2] / 2);
  const direction = reset ? new THREE.Vector3(1, .72, 1.18).normalize() : camera.position.clone().sub(target).normalize();
  if (direction.lengthSq() === 0) direction.set(1, .72, 1.18).normalize();
  const radius = Math.hypot(...dimensions) / 2;
  const vertical = THREE.MathUtils.degToRad(camera.fov / 2);
  camera.aspect = Math.max(1, width) / Math.max(1, height);
  const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
  const distance = radius / Math.sin(Math.min(vertical, horizontal)) * 1.12;
  camera.position.copy(target).addScaledVector(direction, distance);
  camera.near = .1;
  camera.far = Math.max(200000, distance + radius * 6);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}
