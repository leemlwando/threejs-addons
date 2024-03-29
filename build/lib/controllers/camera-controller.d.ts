import { Scene } from 'three/src/scenes/Scene';
import { CameraControllerType, ControlType, Index, configureControllerArgsType } from '../../types';
interface CameraControllerAPI {
    /** controllers */
    controllers: CameraControllerType[];
    activeController: CameraControllerType | null;
    /** configurations */
    loopControllerIndex: boolean;
    /** track controllers */
    currentControllerIndex: Index;
    previousControllerIndex: Index | null;
    /** track controls */
    currentControlTypeIndex: Index;
    previousControlTypeIndex: Index | null;
    loopControlTypeIndex: boolean;
    /** scene */
    scene?: Scene | undefined;
    /** methods */
    switchControllerNext(index: Index | null): Index | null;
    switchControlTypeNext(index: Index | null): Index;
    configureController(args: configureControllerArgsType): void;
    setActiveController(index: Index, disableCurrentController: boolean): void;
    getCurrentActiveControlType(): ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | null;
    onResize({ width, height }: {
        width: number;
        height: number;
    }): void;
    updateProjectionMatrix(): void;
}
/**
 * @description CameraController class for managing camera and its respective controls.
 */
export declare class CameraController implements CameraControllerAPI {
    controllers: CameraControllerType[];
    activeController: CameraControllerType | null;
    /**confgurations */
    loopControllerIndex: boolean;
    /** track controllers */
    currentControllerIndex: Index;
    previousControllerIndex: Index | null;
    /** track controls */
    currentControlTypeIndex: Index;
    previousControlTypeIndex: Index | null;
    loopControlTypeIndex: boolean;
    /** scene */
    scene?: Scene | undefined;
    constructor(args: {
        scene?: Scene;
    });
    /** switch controllers */
    switchControllerNext(index: Index | null): Index | null;
    /** toggle controls */
    switchControlTypeNext(index: Index | null): Index;
    /** configure each controller to add to the controllers list */
    configureController(args: configureControllerArgsType): void;
    /** set the active controller from your list of controllers */
    setActiveController(index: Index, disableCurrentController: boolean): void;
    /** get active control type */
    getCurrentActiveControlType(): ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | null;
    /** reszie camera aspect ratio */
    onResize({ width, height }: {
        width: number;
        height: number;
    }): void;
    /** calls updateProjectionMatrix on current active camera */
    updateProjectionMatrix(): void;
    /** disable previous controls */
    private disableControlsByControllerIndex;
    /** enable active controllers control by activeControlType */
    private enableActiveControllerControl;
    /** toggle Control By index */
    private toggleControlTypeByIndex;
    private normalizeOrbitControlsTarget;
}
export {};
