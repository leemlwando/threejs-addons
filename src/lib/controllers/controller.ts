import RAPIER from "@dimforge/rapier3d-compat";
import { Vector3 } from 'three/src/math/Vector3';
import { calculateVelocity } from "../../utils/helpers";
import { CameraControllerType } from "../../types";
import { TranslationController } from "./translation";

interface Controller {
    options: any;
    target: any;
    _target: any;
    setTarget(target: any): void;
    update(delta: number): void;
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
    direction: Vector3;
    delta: number;
    SPEED_UP_CONSTANT: number;
    desiredMovementVector: Vector3;
    desiredVelocityVector: Vector3;
    cameraController?: CameraControllerType;
    /** static methods */
    //computeTranslationXDirection(self: any): Vector3;
}

export class BaseController implements Controller {
    options: any;
    target: any;
    translateXDirection: boolean = false;
    translateYDirection: boolean = false;
    translateZDirection: boolean = false;
    translateXYZDirection: boolean = false;
    direction: Vector3 = new Vector3(0, 0, 0);
    delta: number = 0;
    _target: any;
    SPEED_UP_CONSTANT: number = 400;
    desiredMovementVector: Vector3 = new Vector3(0,0,0);
    desiredVelocityVector: Vector3 = new Vector3(0,0,0);
    cameraController?: CameraControllerType;

    constructor({ target, options }: { target: any, options: object }) {
        if(target) this.setTarget(target);
        if(options) this.options = options;

        console.log('options', options)
    }

    /**
     * @description sets camera controller
     */
    setCameraController(cameraController: CameraControllerType) {
        this.cameraController = cameraController;
    }

    /** @description states whether or not we should translate target in x direction */
    setTranslateXDirection(state: boolean, value: number) {
        this.translateXDirection = state;
        this.direction = new Vector3(value,0,0);
    }

    /** @description states whether or not we should translate target in y direction */
    setTranslateYDirection(state: boolean, value: number) {
        this.translateYDirection = state;
        this.direction = new Vector3(0,value,0);
    }

    /** @description states whether or not we should translate target in z direction */
    setTranslateZDirection(state: boolean, value: number) {
        this.translateZDirection = state;
        this.direction = new Vector3(0,0,value);
    }

    /** 
     * @description states whether or not we should translate target in x, y, and z directions
     * @remarks perfect for applying forces/impulses 
     * */
    setTranslateXYZDirection(state: boolean, direction: Vector3) {
        this.translateXYZDirection = state;
        this.direction = direction;
    }

    /**
     * @deprecated
     * @param self 
     * @returns 
     */
    static computeTranslationXDirection(self: any): Vector3 {

        let position = new Vector3(self.target.position.x, self.target.position.y, self.target.position.z);
        
        const velocity = calculateVelocity(self);

        velocity.multiplyScalar(self.delta);

        if(self.cameraController) velocity.applyQuaternion(self.cameraController.camera.quaternion);

        position.add(velocity)

        return position;
    }

    static computeTranslationXYZDirection(self: any): { position: Vector3, velocity: Vector3 } | null {

        // let position = new Vector3(self.target.position.x, self.target.position.y, self.target.position.z);

        if(!self.collider) return null;

        const { x: cx, y: cy, z: cz } = self.collider.translation();

        const position = new Vector3(cx, cy, cz);
        
        const velocity = calculateVelocity(self);

        velocity.multiplyScalar(self.delta);

        if(self.cameraController) velocity.applyQuaternion(self.cameraController.camera.quaternion);

        position.add(velocity);

        return { position, velocity };
    }

    handleTranslateXDirection(): void {
 
        let position = new Vector3(this._target.position.x, this._target.position.y, this._target.position.z);

        const velocity = calculateVelocity(this);

        position.add(velocity);

        this.desiredMovementVector = position
    }

    handleTranslateYDirection(): void {
        
    }

    handleTranslateZDirection(): void {
        
    }

    handleTranslateXYZDirection(): void {
        
    }

    updateTargetPosition(): Vector3 | null {
        if(!this.target) return null;
        this.target.position.copy(this.desiredMovementVector);
        return this.target.position;
    }

    updateTargetQuaternion(): void {
        if(!this.cameraController)return;

        if(!this.target) return;
        this.target.quaternion.copy(this.cameraController.camera.quaternion);
        return;
    }

    /**
     * @description sets the target of the controller
     */
    setTarget(target: any) {
        this._target = target;
        this.target = target;
    }

    /**
     * @description updates the controller
     */
    update(delta: number) {
        this.delta = delta;
        if(this.translateXDirection || this.translateYDirection || this.translateZDirection || this.translateXYZDirection) this.handleTranslateXYZDirection();
        // if(this.translateXDirection) return this.handleTranslateXDirection();
        // if(this.translateYDirection) return this.handleTranslateYDirection();
        // if(this.translateZDirection) return this.handleTranslateZDirection();
        // if(this.translateXYZDirection) return this.handleTranslateXYZDirection();
    }

    updateCameraControllerByMovementVector() {
        if(!this.cameraController) return;
        this.cameraController.camera.position.copy(this.desiredMovementVector);
        // TranslationController.translateControls(this.cameraController, this.desiredMovementVector, this);
    }

    updateCameraControllerByVelocityVector() {
        if(!this.cameraController) return;
        this.cameraController.camera.position.add(this.desiredVelocityVector);
        // TranslationController.translateControls(this.cameraController, this.desiredMovementVector, this);
        
    }

}