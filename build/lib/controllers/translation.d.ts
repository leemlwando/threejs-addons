import * as THREE from 'three';
import { Vector3 } from 'three/src/math/Vector3';
import { Quaternion } from 'three/src/math/Quaternion';
import { TargetObject } from '../../types/translation';
import { CameraControllerType, ControlType } from '../../types';
import { OrbitControlsWrapper, PointerLockControlsWrapper } from '../../types/wrappers';
export declare class TranslationController {
    SLOW_DOWN_CONSTANT: number;
    SPEED_UP_CONSTANT: number;
    velocity: Vector3;
    direction: Vector3;
    target: TargetObject | null;
    copyToTarget: (TargetObject)[];
    delta: number;
    translateXDirection: boolean;
    translateZDirection: boolean;
    /** extra data */
    cameraController: CameraControllerType | null;
    constructor(args: any);
    /** setup camera controller */
    setCameraController(controller: CameraControllerType): void;
    /** set translation state */
    setTranslateXDirection(state: boolean, distance: number | null): void;
    setTranslateZDirection(state: boolean, distance: number | null): void;
    /** master controls */
    translateX(value: number): Vector3 | null;
    translateZ(value: number): Vector3 | null;
    /** @description handle orbit controls -x +x translation */
    private orbitControlsTranslateX;
    /** @description handle orbit controls -z +z translation */
    private orbitControlsTranslateZ;
    /** @description handle pointer controls -x +x translation */
    private pointerControlsTranslateX;
    /** @description handle pointer controls -z +z translation */
    private pointerControlsTranslateZ;
    private rapierColliderTranslateX;
    private rapierColliderTranslateZ;
    static translateControls(cameraController: CameraControllerType, velocity: Vector3, directionState?: {
        translateXDirection: boolean;
        translateZDirection: boolean;
    }): null | undefined;
    private rapierRigidBodyTranslateX;
    private rapierRigidBodyTranslateZ;
    private object3DTranslateX;
    private object3DTranslateZ;
    getTargetObjectPosition(): null | undefined;
    /** set target */
    setTargetObject(target: TargetObject): void;
    /** copy to */
    copyTo(copyToTarget: (TargetObject)[]): void;
    /** utils */
    applyCameraControllerQuaternion(): void;
    calculateVelocity(direction: Vector3): THREE.Vector3;
    getTargetObjectTranslation(): (Vector3 | Quaternion)[] | null;
    updateCopyTargetObject(updateActiveCameraController: boolean): void;
    updateCopyTargetObjectVelocity(updateActiveCameraController: boolean): void;
    update(delta: number): void;
    /** get orbit controls */
    getOrbitControls(controller: CameraControllerType | null): OrbitControlsWrapper | null;
    getPointLockControls(controller: CameraControllerType | null): PointerLockControlsWrapper | null;
    getCameraControllerActiveControlType(): ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | null;
}
