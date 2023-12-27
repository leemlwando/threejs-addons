import * as RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { CameraControlType, CameraControllerType, ControlType } from '.';
import { OrbitControlsWrapper, PointerLockControlsWrapper } from './wrappers';

export type Velocity = THREE.Vector3;

export type Constant = number;

export type TargetObject = { 
    object: THREE.Object3D & RAPIER.Collider & RAPIER.RigidBody & OrbitControls & PointerLockControls & PointerLockControlsWrapper & OrbitControlsWrapper | CameraControllerType, 
    type: ControlType.OBJECT_3D | ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | ControlType.RAPIER_COLLIDER | ControlType.RAPIER_RIGID_BODY, 
    uuid: string,
    options: { max: { x: number, y:number, z: number }, min: { x: number, y:number, z: number } }
}