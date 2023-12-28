import { ControlType } from '../../types';
import { BaseController } from './controller';
import { RapierColliderController } from './rapier-character-controller';
import { CameraController } from './camera';
export declare class TranslationController extends BaseController {
    constructor({ options, RCC, CCC }: {
        options: object;
        RCC: RapierColliderController;
        CCC: CameraController;
    });
    private translateOrbitControls;
    private translatePointerLockControls;
    handleTranslateXYZDirection(): void;
    /** handle simulation */
    update(delta: number, updateRCC: boolean): void;
    /** get orbit controls */
    private getOrbitControls;
    private getPointLockControls;
    getCameraControllerActiveControlType(): ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | null;
}
