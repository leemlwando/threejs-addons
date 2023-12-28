import { ControlType } from '../../types';
import { BaseController } from './Base';
import { RapierColliderController } from './rapier-character-controller';
import { CameraController } from './camera-controller';
export declare class TranslationController extends BaseController {
    constructor({ options, RCC, CCC, TCC }: {
        options: object;
        RCC?: RapierColliderController;
        CCC?: CameraController;
        TCC?: TranslationController;
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
