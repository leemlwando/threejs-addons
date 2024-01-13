import { Vector3 } from 'three/src/math/Vector3.js';
import { Quaternion } from 'three/src/math/Quaternion.js';
import { calculateVelocity } from "../../utils/helpers.ts";
import { CameraControllerType } from "../../types/index.ts";
import { TranslationController } from "./translation-controller.ts";
import { RapierColliderController } from "./rapier-character-controller.ts";
import { CameraController } from "./camera-controller.ts";

interface ControllerAPI {
    options: any;
    target: any;
    _target: any;
    setTarget(target: any): void;
    update(delta: number, updateController?: boolean): void;
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
    position: Vector3;
    rotation: Quaternion;
    velocity: Vector3;
    direction: Vector3;
    delta: number;
    SPEED_UP_CONSTANT: number;
    SLOW_DOWN_CONSTANT: number;
    speedFactor: number;
    desiredMovementVector: Vector3;
    desiredVelocityVector: Vector3;
    cameraController?: CameraControllerType;

    RCC?: RapierColliderController;
    CCC?: CameraController;
    TCC?: TranslationController;
    setRCC(RCC: RapierColliderController): void;
    setCCC(CCC: CameraController): void;
    setTCC(TCC: TranslationController): void;
    updateSpeedFactor(increment: number): void;
    setSpeedFactor(speedFactor: number): void;
    /** static methods */
}

export class BaseController implements ControllerAPI {
    options: any;
    target: any;
    _target: any;
    translateXDirection: boolean = false;
    translateYDirection: boolean = false;
    translateZDirection: boolean = false;
    translateXYZDirection: boolean = false;
    direction: Vector3 = new Vector3(0, 0, 0);
    position: Vector3 = new Vector3(0, 0, 0);
    rotation: Quaternion = new Quaternion(0, 0, 0, 0);
    velocity: Vector3 = new Vector3(0, 0, 0);
    delta: number = 0;
    SPEED_UP_CONSTANT: number = 400;
    SLOW_DOWN_CONSTANT: number = 10;
    speedFactor: number = 0.15;
    desiredMovementVector: Vector3 = new Vector3(0,0,0);
    desiredVelocityVector: Vector3 = new Vector3(0,0,0);
    cameraController?: CameraControllerType;

    RCC?: RapierColliderController;
    CCC?: CameraController;
    TCC?: TranslationController;
    

    constructor({ CCC, RCC, TCC, target, options }: { target: any, options: object, CCC?: CameraController, RCC?: RapierColliderController, TCC?: TranslationController }) {
        if(target) this.setTarget(target);
        if(options) this.options = options;
        if(CCC) this.setCCC(CCC);
        if(RCC) this.setRCC(RCC);
        if(TCC) this.setTCC(TCC);
    }

    /** 
     * @description setup rapier coontroller class instance 
     * @param RCC RapierColliderController
    */
    setRCC(RCC: RapierColliderController){
        this.RCC = RCC;
    }
    
    /** 
     * @description setup up camera controller class instance
     * @param CCC CameraController 
     * */
    setCCC(CCC: CameraController){
        this.CCC = CCC;
    }

    /** 
     * @description setup up translation controller class instance
     * @param TCC TranslationController 
     * */
    setTCC(TCC: TranslationController){
        this.TCC = TCC;
    }

    /**
     * @description set speedfactor
     * @param speedFactor: number
     */
    setSpeedFactor(speedFactor: number): void {
        this.speedFactor = speedFactor;
    }

    updateSpeedFactor(increment: number): void {
        this.speedFactor = Math.max(0.01, Math.min((this.speedFactor + increment), 1));
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

    /**
     * 
     * @param  
     * @returns 
     */
    static computeTranslationXYZDirection({ translation, direction, SPEED_UP_CONSTANT, delta, cameraController, speedFactor  }: { translation: Vector3, direction: Vector3, SPEED_UP_CONSTANT: number,  delta: number, speedFactor: number, cameraController?: CameraControllerType | undefined }): { position: Vector3, velocity: Vector3 } | null {

        const { x, y, z } = translation;

        const position = new Vector3(x, y, z);
        
        const velocity = calculateVelocity({ SPEED_UP_CONSTANT, delta, direction, speedFactor });

        velocity.multiplyScalar(delta);

        if(cameraController !== undefined) velocity.applyQuaternion(cameraController.camera.quaternion);

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

    resetVelocity() {
        this.velocity = new Vector3(0,0,0);
    }

    /**
     * @description updates the controller
     */
    update(delta: number, updateController?: boolean) {
        this.delta = delta;
        // this.resetVelocity(); //reset on every tick
        if(this.translateXDirection || this.translateYDirection || this.translateZDirection || this.translateXYZDirection) return this.handleTranslateXYZDirection();
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