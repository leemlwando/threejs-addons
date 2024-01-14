import { CameraControlUserData } from "../types/index.ts";
import { OrbitControls } from '@deps';
import { PointerLockControls } from '@deps';


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