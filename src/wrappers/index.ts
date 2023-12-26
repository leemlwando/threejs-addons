import { UserData } from "../types";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';


export class OrbitControlsWrapper extends OrbitControls {
    userData: UserData
}

export class PointerLockControlsWrapper extends PointerLockControls {
    userData: UserData
}