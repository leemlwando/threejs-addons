import { CameraControlUserData } from "../types";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
export declare class OrbitControlsWrapper extends OrbitControls {
    userData: CameraControlUserData | null;
    constructor(object: any, domElement?: HTMLElement);
}
export declare class PointerLockControlsWrapper extends PointerLockControls {
    userData: CameraControlUserData | null;
    constructor(object: any, domElement?: HTMLElement);
}
