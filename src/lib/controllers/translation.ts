import * as THREE from 'three';
import { Vector3 } from 'three/src/math/Vector3';
import { Vector4 } from 'three/src/math/Vector4';
import { Quaternion } from 'three/src/math/Quaternion'
import * as RAPIER from '@dimforge/rapier3d-compat';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { TargetObject } from '../../types/translation';
import { CameraControllerType, ControlType } from '../../types';
import { OrbitControlsWrapper, PointerLockControlsWrapper } from '../../types/wrappers';
import { BaseController } from './controller';
import { RapierColliderController } from './rapier-character-controller';
import { CameraController } from './camera';

interface TranslationControllerAPI {
    RCC: RapierColliderController;
    CCC: CameraController;
    setRCC(RCC: RapierColliderController): void;
    setCCC(CCC: CameraController): void;

}

export class TranslationController extends BaseController implements TranslationControllerAPI {

    RCC: RapierColliderController;
    CCC: CameraController;

    constructor({ options, RCC, CCC }: { options: object, RCC: RapierColliderController, CCC: CameraController }){
        super({ target: null, options });
        this.RCC = RCC;
        this.CCC = CCC;

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

    private translateOrbitControls(): void {

        const orbitControls = this.getOrbitControls() as OrbitControls;

        if(!orbitControls) return;

        if(this.RCC){
            orbitControls.object.position.add(this.RCC.velocity.clone());
            orbitControls.target.add(this.RCC.velocity.clone());
            return
        }

        const { x: px, y: py, z: pz } = orbitControls.object.position;

        const computedTranslation = BaseController.computeTranslationXYZDirection({
            SPEED_UP_CONSTANT: this.SPEED_UP_CONSTANT,
            delta: this.delta,
            direction: this.direction,
            translation: new Vector3(px, py, pz),
            cameraController: this.cameraController as CameraControllerType
        });

        if(!computedTranslation) return;

        const { position: desiredMovementVector, velocity: desiredVelocityVector } = computedTranslation;

        this.desiredMovementVector = desiredMovementVector;
        /** carry out corrections based on max an min translation options */
        this.desiredMovementVector.y = Math.min(Math.max(this.desiredMovementVector.y, this.options?.translation?.max?.y), this.options?.translation?.max?.y);
        this.desiredVelocityVector = desiredVelocityVector;
        this.desiredVelocityVector.y = Math.min(Math.max(this.desiredMovementVector.y, this.options?.translation?.max?.y), this.options?.translation?.max?.y);

        orbitControls.object.position.add(this.desiredVelocityVector);
        orbitControls.target.add(this.desiredVelocityVector);

    }

    private translatePointerLockControls(): void {

         const pointerLockControls = this.getPointLockControls();
 
         if(!pointerLockControls) return;

         if(this.RCC){
            const { x: rccX, y: rccY, z: rccZ } = this.RCC.position.clone();
            if(this.translateZDirection){
                pointerLockControls.camera.position.set(rccX, pointerLockControls.camera.position.y, rccZ);
             }
    
             if(this.translateXDirection){
                pointerLockControls.camera.position.set(rccX, pointerLockControls.camera.position.y, rccZ);
             }
    
             if(this.translateXYZDirection){
                pointerLockControls.camera.position.set(rccX, pointerLockControls.camera.position.y, rccZ);
                pointerLockControls.camera.position.set(rccX, pointerLockControls.camera.position.y, rccZ);
             }
            return
        }
 
         const { x: px, y: py, z: pz } = pointerLockControls.camera.position;

         const computedTranslation = BaseController.computeTranslationXYZDirection({
             SPEED_UP_CONSTANT: this.SPEED_UP_CONSTANT,
             delta: this.delta,
             direction: this.direction,
             translation: new Vector3(px, py, pz),
            //  cameraController: this.cameraController as CameraControllerType //causing funny side effects
         });
 
         if(!computedTranslation) return;
 
         const { position: desiredMovementVector, velocity: desiredVelocityVector } = computedTranslation;
 
         this.desiredMovementVector = desiredMovementVector;
         /** carry out corrections based on max an min translation options */
         this.desiredMovementVector.y = Math.min(Math.max(this.desiredMovementVector.y, this.options?.translation?.max?.y), this.options?.translation?.max?.y);
         this.desiredVelocityVector = desiredVelocityVector;
         this.desiredVelocityVector.y = Math.min(Math.max(this.desiredMovementVector.y, this.options?.translation?.max?.y), this.options?.translation?.max?.y);
         
         if(this.translateZDirection){
            pointerLockControls.moveForward(-this.desiredVelocityVector.z);
         }

         if(this.translateXDirection){
            pointerLockControls.moveRight(this.desiredVelocityVector.x);
         }

         if(this.translateXYZDirection){
            pointerLockControls.moveForward(-this.desiredVelocityVector.z);
            pointerLockControls.moveRight(this.desiredVelocityVector.x);
         }
 
    }

    handleTranslateXYZDirection(){
            
            if(this.getCameraControllerActiveControlType() === ControlType.ORBIT_CONTROLS){
                this.translateOrbitControls();
            }
    
            if(this.getCameraControllerActiveControlType() === ControlType.POINTER_LOCK_CONTROLS){
                this.translatePointerLockControls();
            }
    }

    /** handle simulation */
    update(delta: number){
        this.delta = delta;
        this.velocity.x -= this.velocity.x * this.SLOW_DOWN_CONSTANT * this.delta;
		this.velocity.z -= this.velocity.z * this.SLOW_DOWN_CONSTANT * this.delta;

        if(this.RCC){
            this.translateXDirection = this.RCC.translateXDirection;
            this.translateZDirection = this.RCC.translateZDirection;
            this.translateXYZDirection = this.RCC.translateXYZDirection;
        }

        if(this.translateXDirection || this.translateZDirection || this.translateXYZDirection) return this.handleTranslateXYZDirection();
    }


    /** get orbit controls */

    private getOrbitControls(controller?: CameraControllerType | undefined ) : OrbitControlsWrapper & OrbitControls | null {
        const cameraController = controller || this.cameraController;
        if(!cameraController) return null;
        const orbitControls: OrbitControls & OrbitControlsWrapper = cameraController.controls.find((control: OrbitControlsWrapper | PointerLockControlsWrapper) => control.userData && control.userData.type === ControlType.ORBIT_CONTROLS) as OrbitControls & OrbitControlsWrapper;
        if(!orbitControls)return null;
        return orbitControls;
    } 
    
    private getPointLockControls(controller?: CameraControllerType | undefined) : PointerLockControlsWrapper | null {
        const cameraController = controller || this.cameraController;
        if(!cameraController) return null;
        const pointerLockControls: PointerLockControls & PointerLockControlsWrapper = cameraController.controls.find((control: OrbitControlsWrapper | PointerLockControlsWrapper) => control.userData && control.userData.type === ControlType.POINTER_LOCK_CONTROLS) as PointerLockControls & PointerLockControlsWrapper;
        if(!pointerLockControls)return null;
        return pointerLockControls;
    }
    
    getCameraControllerActiveControlType(): ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | null {
        const control = this.cameraController?.controls.find((control: (OrbitControlsWrapper | PointerLockControlsWrapper)) => control.userData && control.userData.active === true);
        if(!control?.userData) return null;
        return control?.userData.type
    }
}