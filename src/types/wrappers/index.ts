import { CameraControlUserData } from "../index.ts";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


export class OrbitControlsWrapper extends OrbitControls {
    userData: CameraControlUserData | null = null
    constructor(object: any, domElement?: HTMLElement) {
        super(object, domElement)
    }
}

export class PointerLockControlsWrapper extends PointerLockControls {
    userData: CameraControlUserData | null = null
    constructor(object: any, domElement?: HTMLElement) {
        super(object, domElement)
    }
}