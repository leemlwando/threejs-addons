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

export class RapierColliderController extends BaseController implements RapierColliderControllerAPI {
    world: RAPIER.World;
    offset: number;
    controller: RAPIER.KinematicCharacterController;
    collider: RAPIER.Collider | null = null;
    toi: number = 0;
    readonly position: Vector3 = new Vector3(0, 0, 0);
    readonly rotation: Quaternion = new Quaternion(0, 0, 0, 0);
    readonly velocity: Vector3 = new Vector3(0, 0, 0);
    
    constructor(world: RAPIER.World, offset: number, options: object){
        super({ target: null, options });
        this.world = world;
        this.offset = offset;
        this.controller = this.initCharacterController();
    }

    /**
     * @description sets up the character controller
     * @returns CharacterController
     */
    private initCharacterController(){
       return this.world.createCharacterController(this.offset) as RAPIER.KinematicCharacterController;
    }

    /**
     *  
     * @description compute movements of collider
     * @returns number of collisions
     */
    computeMovement({ collider, desiredMovementVector, filterFlags, filterGroups, filterPredicate } : { 
        collider: RAPIER.Collider | null, 
        desiredMovementVector: RAPIER.Vector, 
        filterFlags?: RAPIER.QueryFilterFlags | undefined,
        filterGroups?: number | undefined,
        filterPredicate?: (collider: RAPIER.Collider) => boolean
    }): null | number {

        let c = collider || this.collider;

        if(!c) return null;

        if(!desiredMovementVector) return null;

        this.controller.computeColliderMovement(c, desiredMovementVector, filterFlags, filterGroups, filterPredicate);

        return this.controller.numComputedCollisions();
    }

    /**
     * @description get computed collisions
     * @returns Array of collisions
     */
    getComputedCollisions(): RAPIER.CharacterCollision[] {
        let collisions: RAPIER.CharacterCollision[] = [];

        for (let i = 0; i < this.controller.numComputedCollisions(); i++) {
            let collision = this.controller.computedCollision(i);
            collisions.push(collision as RAPIER.CharacterCollision);
        }

        return collisions;
    }

    /**
     * @description wether or not collision is imminent
     */
    isCollisionImminent(): boolean {
        let is_collision_imminent = false;

        for (let i = 0; i < this.controller.numComputedCollisions(); i++) {
            let collision = this.controller.computedCollision(i) as RAPIER.CharacterCollision;
            if(collision.toi <= this.toi) is_collision_imminent = true;
        }

        return is_collision_imminent;
    }

    /**
     * @description get corrected movement
     */
    getCorrectedMovement(): RAPIER.Vector3 {
        return this.controller.computedMovement();
    }

    /**
     * @param collider 
     * @param updateTargetPosition Wether or not to update the target position. This forces the controller to try and update target position even if the collider is null
     * @description sets the collider
     */
    setCollider(collider: RAPIER.Collider, updateTargetPosition?: boolean): void {
        this.collider = collider;

        if(!this.target && !updateTargetPosition)return;
        const { x, y, z} = this.collider.translation();
        this.desiredMovementVector = new Vector3(z,y,z);
        this.updateTargetPosition();
    }

    /** @description handle XYZ movements */
    handleTranslateXYZDirection(): void {

        if(!this.collider) return;
        this.setColliderQuaternionFromCameraController();

        const computedTranslation = BaseController.computeTranslationXYZDirection(this);

        if(!computedTranslation) return;

        const { position: desiredMovementVector, velocity: desiredVelocityVector } = computedTranslation;
  
        const shape = this.collider?.shape

        const shapePosition = this.collider?.translation();

        const shapeRotation = this.collider?.rotation();

        const shapeVelocity = desiredVelocityVector.clone()

        let collisions = [];

        let hit = this.world.castShape(shapePosition, shapeRotation, shapeVelocity, shape, this.toi, false, undefined, this.options?.filterGroups, this.collider);
        if (hit != null) {
            collisions.push(hit);
        }

        
        let is_collision_imminent = false
        let collision_imminent = null

        for(const collision of collisions){

            if(collision.toi <= this.toi) is_collision_imminent = true;

            if(is_collision_imminent) collision_imminent = collision

            if(is_collision_imminent) break;
        }

        if(is_collision_imminent && collision_imminent && collision_imminent?.toi <= this.toi){
            this.desiredVelocityVector = new Vector3(0, 0, 0);
        }else{
                    // this.desiredMovementVector = this.isCollisionImminent({ toi: this.offset }) ? new Vector3(correctedMovement.x, correctedMovement.y, correctedMovement.z) : desiredMovementVector;
            this.desiredMovementVector = desiredMovementVector;
            /** carry out corrections based on max an min translation options */
            this.desiredMovementVector.y = Math.min(Math.max(this.desiredMovementVector.y, this.options?.translation?.max?.y), this.options?.translation?.max?.y);

            this.desiredVelocityVector = desiredVelocityVector;
            this.desiredVelocityVector.y = Math.min(Math.max(this.desiredMovementVector.y, this.options?.translation?.max?.y), this.options?.translation?.max?.y);
        
        }

        /** update computational values */
        this.updateColliderPosition();
        this.updateTargetPosition();
        this.updateTargetQuaternion()

        /** update internal values */
        this._updateColliderPosition();
        this._updateColliderQuaternion();
        this._updateColliderVelocity();

    }

    /**
     * @description set max time to impact for collider
     */
    setToi(value: number){
        this.toi = value;
    }

    /** set collider quartenion */
    setColliderQuaternionFromCameraController(){
        if(!this.collider) return;
        if(!this.cameraController) return;
        this.collider.setRotation({ x: this.cameraController?.camera.quaternion.x as number, y: this.cameraController?.camera.quaternion.y as number, z: this.cameraController?.camera.quaternion.z as number, w: this.cameraController?.camera.quaternion.w as number});
    }

    updateColliderPosition(): void {
        if(this.collider) this.collider.setTranslation(this.desiredMovementVector);
    }

    updateColliderPositionFromVelocity(): void {
        if(!this.collider) return;

        const { x, y, z } = this.collider.translation();

        const colliderVec3 = new Vector3(x, y, z);

        colliderVec3.add(this.desiredVelocityVector);

        this.collider.setTranslation(colliderVec3);
    }


    private _updateColliderPosition(): void {
        if(!this.collider) return;
        this.position.copy(this.desiredMovementVector);
    }

    private _updateColliderQuaternion(): void {
        if(!this.collider) return;
        const { x, y, z, w } = this.collider.rotation();
        this.rotation.copy(new Quaternion(x, y, z, w));
    }

    private _updateColliderVelocity(): void {
        if(!this.collider) return;
        this.velocity.copy(this.desiredVelocityVector);
    }
}