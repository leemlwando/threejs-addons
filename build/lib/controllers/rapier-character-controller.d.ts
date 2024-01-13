import { World, KinematicCharacterController, Collider } from '@dimforge/rapier3d';
import { BaseController } from './Base';
import { CameraController } from './camera-controller';
interface RapierColliderControllerAPI {
    world: World;
    offset: number;
    controller: KinematicCharacterController;
    collider: Collider | null;
    toi: number;
}
export declare class RapierColliderController extends BaseController implements RapierColliderControllerAPI {
    world: World;
    offset: number;
    controller: KinematicCharacterController;
    collider: Collider | null;
    toi: number;
    constructor({ world, offset, options, CCC }: {
        world: World;
        offset: number;
        options: object;
        CCC?: CameraController;
    });
    /**
     * @description sets up the character controller
     * @returns CharacterController
     */
    private initCharacterController;
    /**
     *
     * @description compute movements of collider
     * @returns number of collisions
     */
    private computeMovement;
    /**
     * @description get computed collisions
     * @returns Array of collisions
     */
    private getComputedCollisions;
    /**
     * @description wether or not collision is imminent
     */
    private isCollisionImminent;
    /**
     * @description get corrected movement
     */
    private getCorrectedMovement;
    /**
     * @param collider
     * @param updateTargetPosition Wether or not to update the target position. This forces the controller to try and update target position even if the collider is null
     * @description sets the collider
     */
    setCollider(collider: Collider, updateTargetPosition?: boolean): void;
    /** @description handle XYZ movements */
    handleTranslateXYZDirection(): void;
    /**
     * @description set max time to impact for collider
     */
    setToi(value: number): void;
    /** set collider quartenion */
    setColliderQuaternionFromCameraController(): void;
    updateColliderPosition(): void;
    /** update internal this.position value */
    private _updateColliderPosition;
    /** update internal this.rotation value */
    private _updateColliderQuaternion;
    /** update internal this.velocity */
    private _updateColliderVelocity;
    /** update filter groups on options */
    updateFilterGroups(groups: number): void;
    /** update options */
    updateOptions(options: object): void;
}
export {};
