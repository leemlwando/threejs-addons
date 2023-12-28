import { Vector3 } from 'three/src/math/Vector3';
import { Quaternion } from 'three/src/math/Quaternion';
import { CameraControllerType } from "../../types";
import { TranslationController } from "./translation-controller";
import { RapierColliderController } from "./rapier-character-controller";
import { CameraController } from "./camera-controller";
interface ControllerAPI {
    options: any;
    target: any;
    _target: any;
    setTarget(target: any): void;
    update(delta: number, updateController?: boolean): void;
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
    position: Vector3;
    rotation: Quaternion;
    velocity: Vector3;
    direction: Vector3;
    delta: number;
    SPEED_UP_CONSTANT: number;
    SLOW_DOWN_CONSTANT: number;
    desiredMovementVector: Vector3;
    desiredVelocityVector: Vector3;
    cameraController?: CameraControllerType;
    RCC?: RapierColliderController;
    CCC?: CameraController;
    TCC?: TranslationController;
    setRCC(RCC: RapierColliderController): void;
    setCCC(CCC: CameraController): void;
    setTCC(TCC: TranslationController): void;
}
export declare class BaseController implements ControllerAPI {
    options: any;
    target: any;
    _target: any;
    translateXDirection: boolean;
    translateYDirection: boolean;
    translateZDirection: boolean;
    translateXYZDirection: boolean;
    direction: Vector3;
    position: Vector3;
    rotation: Quaternion;
    velocity: Vector3;
    delta: number;
    SPEED_UP_CONSTANT: number;
    SLOW_DOWN_CONSTANT: number;
    desiredMovementVector: Vector3;
    desiredVelocityVector: Vector3;
    cameraController?: CameraControllerType;
    RCC?: RapierColliderController;
    CCC?: CameraController;
    TCC?: TranslationController;
    constructor({ CCC, RCC, TCC, target, options }: {
        target: any;
        options: object;
        CCC?: CameraController;
        RCC?: RapierColliderController;
        TCC?: TranslationController;
    });
    /**
     * @description setup rapier coontroller class instance
     * @param RCC RapierColliderController
    */
    setRCC(RCC: RapierColliderController): void;
    /**
     * @description setup up camera controller class instance
     * @param CCC CameraController
     * */
    setCCC(CCC: CameraController): void;
    /**
     * @description setup up translation controller class instance
     * @param TCC TranslationController
     * */
    setTCC(TCC: TranslationController): void;
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
    /**
     *
     * @param
     * @returns
     */
    static computeTranslationXYZDirection({ translation, direction, SPEED_UP_CONSTANT, delta, cameraController }: {
        translation: Vector3;
        direction: Vector3;
        SPEED_UP_CONSTANT: number;
        delta: number;
        cameraController?: CameraControllerType | undefined;
    }): {
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
    resetVelocity(): void;
    /**
     * @description updates the controller
     */
    update(delta: number, updateController?: boolean): void;
    updateCameraControllerByMovementVector(): void;
    updateCameraControllerByVelocityVector(): void;
}
export {};
