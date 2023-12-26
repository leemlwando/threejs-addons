import { UserData } from "../types";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
export declare class OrbitControlsWrapper extends OrbitControls {
    userData: UserData | null;
    constructor(object: any, domElement?: HTMLElement);
}
export declare class PointerLockControlsWrapper extends PointerLockControls {
    userData: UserData | null;
    constructor(object: any, domElement?: HTMLElement);
}
