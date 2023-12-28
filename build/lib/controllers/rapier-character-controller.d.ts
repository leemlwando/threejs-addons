import * as RAPIER from '@dimforge/rapier3d-compat';
import { BaseController } from './controller';
import { Vector3 } from 'three/src/math/Vector3';
import { Quaternion } from 'three/src/math/Quaternion';
interface RapierColliderControllerAPI {
    world: RAPIER.World;
    offset: number;
    controller: RAPIER.KinematicCharacterController;
    collider: RAPIER.Collider | null;
    toi: number;
    position: Vector3;
    rotation: Quaternion;
    velocity: Vector3;
}
export declare class RapierColliderController extends BaseController implements RapierColliderControllerAPI {
    world: RAPIER.World;
    offset: number;
    controller: RAPIER.KinematicCharacterController;
    collider: RAPIER.Collider | null;
    toi: number;
    readonly position: Vector3;
    readonly rotation: Quaternion;
    readonly velocity: Vector3;
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
    computeMovement({ collider, desiredMovementVector, filterFlags, filterGroups, filterPredicate }: {
        collider: RAPIER.Collider | null;
        desiredMovementVector: RAPIER.Vector;
        filterFlags?: RAPIER.QueryFilterFlags | undefined;
        filterGroups?: number | undefined;
        filterPredicate?: (collider: RAPIER.Collider) => boolean;
    }): null | number;
    /**
     * @description get computed collisions
     * @returns Array of collisions
     */
    getComputedCollisions(): RAPIER.CharacterCollision[];
    /**
     * @description wether or not collision is imminent
     */
    isCollisionImminent(): boolean;
    /**
     * @description get corrected movement
     */
    getCorrectedMovement(): RAPIER.Vector3;
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
    updateColliderPositionFromVelocity(): void;
    private _updateColliderPosition;
    private _updateColliderQuaternion;
    private _updateColliderVelocity;
}
export {};
