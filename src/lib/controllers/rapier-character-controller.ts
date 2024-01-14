import { World, KinematicCharacterController, Collider, CharacterCollision, QueryFilterFlags } from '@dimforge/rapier3d';
import { BaseController } from './Base.ts';
import { Vector3 } from 'three/src/math/Vector3.js';
import { Quaternion } from 'three/src/math/Quaternion.js';
import { CameraControllerType } from '../../types/index.ts';
import { CameraController } from './camera-controller.ts';

console.log('RapierColliderController', Quaternion);

interface RapierColliderControllerAPI {
   world: World;
   offset: number;
   controller: KinematicCharacterController;
   collider: Collider | null;
   toi: number;
}

export class RapierColliderController extends BaseController implements RapierColliderControllerAPI {
    world: World;
    offset: number;
    controller: KinematicCharacterController;
    collider: Collider | null = null;
    toi: number = 0;
    
    constructor({ world, offset, options, CCC } : { world: World, offset: number, options: object, CCC?: CameraController }){
        super({ target: null, options, CCC });
        this.world = world;
        this.offset = offset;
        this.controller = this.initCharacterController();
    }

    /**
     * @description sets up the character controller
     * @returns CharacterController
     */
    private initCharacterController(){
       return this.world.createCharacterController(this.offset) as KinematicCharacterController;
    }

    /**
     *  
     * @description compute movements of collider
     * @returns number of collisions
     */
    private computeMovement({ collider, desiredMovementVector, filterFlags, filterGroups, filterPredicate } : { 
        collider: Collider | null, 
        desiredMovementVector: Vector3, 
        filterFlags?: QueryFilterFlags | undefined,
        filterGroups?: number | undefined,
        filterPredicate?: (collider: Collider) => boolean
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
    private getComputedCollisions(): CharacterCollision[] {
        let collisions: CharacterCollision[] = [];

        for (let i = 0; i < this.controller.numComputedCollisions(); i++) {
            let collision = this.controller.computedCollision(i);
            collisions.push(collision as CharacterCollision);
        }

        return collisions;
    }

    /**
     * @description wether or not collision is imminent
     */
    private isCollisionImminent(): boolean {
        let is_collision_imminent = false;

        for (let i = 0; i < this.controller.numComputedCollisions(); i++) {
            let collision = this.controller.computedCollision(i) as CharacterCollision;
            if(collision.toi <= this.toi) is_collision_imminent = true;
        }

        return is_collision_imminent;
    }

    /**
     * @description get corrected movement
     */
    private getCorrectedMovement(): Vector3 {
        const { x, y, z } = this.controller.computedMovement();
        return new Vector3(x, y, z);
    }

    /**
     * @param collider 
     * @param updateTargetPosition Wether or not to update the target position. This forces the controller to try and update target position even if the collider is null
     * @description sets the collider
     */
    setCollider(collider: Collider, updateTargetPosition?: boolean): void {
        this.collider = collider;
        if(!this.target && !updateTargetPosition)return;
        const { x, y, z} = this.collider.translation();
        this.desiredMovementVector = new Vector3(x,y,z);
        this.updateTargetPosition();
    }

    /** @description handle XYZ movements */
    handleTranslateXYZDirection(): void {

        if(!this.collider) return;
        this.setColliderQuaternionFromCameraController();

        const { x: cx, y: cy, z: cz } = this.collider.translation();

        const computedTranslation = BaseController.computeTranslationXYZDirection({
            speedFactor: this.speedFactor,
            SPEED_UP_CONSTANT: this.SPEED_UP_CONSTANT,
            delta: this.delta,
            direction: this.direction,
            translation: new Vector3(cx, cy, cz),
            cameraController: this.CCC?.activeController as CameraControllerType
        });

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
            this.desiredMovementVector = desiredMovementVector;
            /** carry out corrections based on max an min translation options */
            // this.desiredMovementVector.y = Math.min(Math.max(this.desiredMovementVector.y, this.options?.translation?.max?.y), this.options?.translation?.max?.y);
            // this.desiredVelocityVector = desiredVelocityVector;
            // this.desiredVelocityVector.y = Math.min(Math.max(this.desiredMovementVector.y, this.options?.translation?.max?.y), this.options?.translation?.max?.y);
            
            this.desiredMovementVector.y = shapePosition.y
            this.desiredVelocityVector = desiredVelocityVector;
            this.desiredVelocityVector.y = 0
        

        }

        /** update computational values */
        this.updateColliderPosition(); // this current colliders position
        this.updateTargetPosition(); //if target is attached
        this.updateTargetQuaternion(); // if target is attached

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
        if(!this.CCC?.activeController) return;
        this.collider.setRotation({ x: this.CCC.activeController?.camera.quaternion.x as number, y: this.CCC.activeController?.camera.quaternion.y as number, z: this.CCC.activeController?.camera.quaternion.z as number, w: this.CCC.activeController?.camera.quaternion.w as number});
    }

    updateColliderPosition(): void {
        if(this.collider) this.collider.setTranslation(this.desiredMovementVector);
    }

    /** update internal this.position value */
    private _updateColliderPosition(): void {
        if(!this.collider) return;
        this.position.copy(this.desiredMovementVector);
    }
    /** update internal this.rotation value */
    private _updateColliderQuaternion(): void {
        if(!this.collider) return;
        const { x, y, z, w } = this.collider.rotation();
        this.rotation.copy(new Quaternion(x, y, z, w));
    }
    /** update internal this.velocity */
    private _updateColliderVelocity(): void {
        if(!this.collider) return;
        this.velocity.copy(this.desiredVelocityVector);
    }


    /** update filter groups on options */
    updateFilterGroups(groups: number){
        this.options.filterGroups = groups;
    }

    /** update options */
    updateOptions(options: object){
        this.options = options;
    }
}