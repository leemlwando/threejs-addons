import { CameraControlUserData } from "../index.ts";
import { OrbitControls, PointerLockControls } from '@deps';


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