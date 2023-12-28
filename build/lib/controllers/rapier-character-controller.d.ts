import * as RAPIER from '@dimforge/rapier3d-compat';
import { BaseController } from './controller';
interface RapierColliderControllerAPI {
    world: RAPIER.World;
    offset: number;
    controller: RAPIER.KinematicCharacterController;
    collider: RAPIER.Collider | null;
    toi: number;
}
export declare class RapierColliderController extends BaseController implements RapierColliderControllerAPI {
    world: RAPIER.World;
    offset: number;
    controller: RAPIER.KinematicCharacterController;
    collider: RAPIER.Collider | null;
    toi: number;
    constructor(world: RAPIER.World, offset: number, options: object);
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
    setCollider(collider: RAPIER.Collider, updateTargetPosition?: boolean): void;
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
}
export {};
