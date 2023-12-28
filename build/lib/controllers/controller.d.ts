import { Vector3 } from 'three/src/math/Vector3';
import { CameraControllerType } from "../../types";
interface Controller {
    options: any;
    target: any;
    _target: any;
    setTarget(target: any): void;
    update(delta: number): void;
    translateXDirection: boolean;
    setTranslateXDirection(state: boolean, value: number): void;
    handleTranslateXDirection(): void;
    translateYDirection: boolean;
    setTranslateYDirection(state: boolean, value: number): void;
    handleTranslateYDirection(): void;
    translateZDirection: boolean;
    setTranslateZDirection(state: boolean, value: number): void;
    handleTranslateZDirection(): void;
    translateXYZDirection: boolean;
    setTranslateXYZDirection(state: boolean, direction: Vector3): void;
    handleTranslateXYZDirection(): void;
    direction: Vector3;
    delta: number;
    SPEED_UP_CONSTANT: number;
    desiredMovementVector: Vector3;
    desiredVelocityVector: Vector3;
    cameraController?: CameraControllerType;
}
export declare class BaseController implements Controller {
    options: any;
    target: any;
    translateXDirection: boolean;
    translateYDirection: boolean;
    translateZDirection: boolean;
    translateXYZDirection: boolean;
    direction: Vector3;
    delta: number;
    _target: any;
    SPEED_UP_CONSTANT: number;
    desiredMovementVector: Vector3;
    desiredVelocityVector: Vector3;
    cameraController?: CameraControllerType;
    constructor({ target, options }: {
        target: any;
        options: object;
    });
    /**
     * @description sets camera controller
     */
    setCameraController(cameraController: CameraControllerType): void;
    /** @description states whether or not we should translate target in x direction */
    setTranslateXDirection(state: boolean, value: number): void;
    /** @description states whether or not we should translate target in y direction */
    setTranslateYDirection(state: boolean, value: number): void;
    /** @description states whether or not we should translate target in z direction */
    setTranslateZDirection(state: boolean, value: number): void;
    /**
     * @description states whether or not we should translate target in x, y, and z directions
     * @remarks perfect for applying forces/impulses
     * */
    setTranslateXYZDirection(state: boolean, direction: Vector3): void;
    /**
     * @deprecated
     * @param self
     * @returns
     */
    static computeTranslationXDirection(self: any): Vector3;
    static computeTranslationXYZDirection(self: any): {
        position: Vector3;
        velocity: Vector3;
    } | null;
    handleTranslateXDirection(): void;
    handleTranslateYDirection(): void;
    handleTranslateZDirection(): void;
    handleTranslateXYZDirection(): void;
    updateTargetPosition(): Vector3 | null;
    updateTargetQuaternion(): void;
    /**
     * @description sets the target of the controller
     */
    setTarget(target: any): void;
    /**
     * @description updates the controller
     */
    update(delta: number): void;
    updateCameraControllerByMovementVector(): void;
    updateCameraControllerByVelocityVector(): void;
}
export {};
