import { ControlType } from '../../types';
import { BaseController } from './controller';
import { RapierColliderController } from './rapier-character-controller';
import { CameraController } from './camera';
interface TranslationControllerAPI {
    RCC: RapierColliderController;
    CCC: CameraController;
    setRCC(RCC: RapierColliderController): void;
    setCCC(CCC: CameraController): void;
}
export declare class TranslationController extends BaseController implements TranslationControllerAPI {
    RCC: RapierColliderController;
    CCC: CameraController;
    constructor({ options, RCC, CCC }: {
        options: object;
        RCC: RapierColliderController;
        CCC: CameraController;
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
    private translateOrbitControls;
    private translatePointerLockControls;
    handleTranslateXYZDirection(): void;
    /** handle simulation */
    update(delta: number): void;
    /** get orbit controls */
    private getOrbitControls;
    private getPointLockControls;
    getCameraControllerActiveControlType(): ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | null;
}
export {};
