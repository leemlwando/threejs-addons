import { Camera, PerspectiveCamera } from 'three';
import { OrbitControlsWrapper, PointerLockControlsWrapper } from '../wrappers';

export type Index = number;

export enum ControlType {
    'OBJECT_3D',
    'RAPIER_COLLIDER',
    'RAPIER_RIGID_BODY',
    'POINTER_LOCK_CONTROLS',
    'ORBIT_CONTROLS'
}

export type CameraControlType = ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS;

export type UserData = {
    uuid: string,
    type: ControlType.OBJECT_3D | ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | ControlType.RAPIER_COLLIDER | ControlType.RAPIER_RIGID_BODY
    active: boolean
}

export type CameraControllerType = { 
    uuid: string,  
    camera: PerspectiveCamera, 
    controls: [ OrbitControlsWrapper | PointerLockControlsWrapper ]
    active: boolean, 
    disable: Function, 
    enable: Function 
};

export type configureControllerArgsType = { 
    camera: Camera, 
    controls: { type: CameraControlType, options: any }[], 
    domElement: HTMLCanvasElement,
    active: boolean 
}