import { CameraControlUserData } from "../index";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';


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