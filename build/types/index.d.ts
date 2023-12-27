import { Camera, PerspectiveCamera } from 'three';
import { OrbitControlsWrapper, PointerLockControlsWrapper } from './wrappers';
export type Index = number;
export declare enum ControlType {
    'OBJECT_3D' = 0,
    'RAPIER_COLLIDER' = 1,
    'RAPIER_RIGID_BODY' = 2,
    'POINTER_LOCK_CONTROLS' = 3,
    'ORBIT_CONTROLS' = 4
}
export type CameraControlType = ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS;
export type UserData = {
    uuid: string;
    type: ControlType.OBJECT_3D | ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | ControlType.RAPIER_COLLIDER | ControlType.RAPIER_RIGID_BODY;
    active: boolean;
};
export type CameraControlUserData = {
    uuid: string;
    type: ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS;
    active: boolean;
};
export type CameraControllerType = {
    uuid: string;
    camera: PerspectiveCamera;
    controls: (OrbitControlsWrapper | PointerLockControlsWrapper)[];
    active: boolean;
    disable: Function;
    enable: Function;
};
export type configureControllerArgsType = {
    camera: Camera;
    controls: {
        type: CameraControlType;
        options: any;
    }[];
    domElement: HTMLCanvasElement;
    active: boolean;
};
