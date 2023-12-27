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


export class TranslationController {
    SLOW_DOWN_CONSTANT: number = 10;
    SPEED_UP_CONSTANT: number = 400;
    velocity: Vector3 = new Vector3(0, 0, 0);
    direction: Vector3 = new Vector3(0, 0, 0);
    target: TargetObject | null = null;
    copyToTarget: (TargetObject)[] = [];
    delta: number = 0;
    translateXDirection: boolean = false;
    translateZDirection: boolean = false;

    /** extra data */
    cameraController: CameraControllerType | null = null;


    constructor(args: any){
        if(args === null) return;
        if(args?.cameraController) this.cameraController = args.cameraController;
        if(args?.copyToTarget) this.copyToTarget = args.copyToTarget;
    }

    /** setup camera controller */

    setCameraController(controller: CameraControllerType){
        this.cameraController = controller;
    }

    /** set translation state */
    setTranslateXDirection(state: boolean, distance: number|null){
        if(distance)this.direction = new Vector3(distance,0,0);
        this.translateXDirection = state;
    }

    setTranslateZDirection(state: boolean, distance: number|null){
        if(distance)this.direction= new Vector3(0,0,distance);
        this.translateZDirection = state;
    }

    /** master controls */
    translateX(value: number): Vector3 | null {

        switch(this.target?.type) {
            case ControlType.OBJECT_3D:
                return this.object3DTranslateX(value, null);
            case ControlType.ORBIT_CONTROLS:
                return this.orbitControlsTranslateX(value, null);
            case ControlType.POINTER_LOCK_CONTROLS:
                return this.pointerControlsTranslateX(value, null);
            case ControlType.RAPIER_COLLIDER:
                return this.rapierColliderTranslateX(value);
            default:
                return null;
        }
       

    }

    translateZ(value: number): Vector3 | null {

        if(!this.target){return null};

        switch(this.target?.type) {
            case ControlType.OBJECT_3D:
                return this.object3DTranslateZ(value, null);
            case ControlType.ORBIT_CONTROLS:
                return this.orbitControlsTranslateZ(value, null);
            case ControlType.POINTER_LOCK_CONTROLS:
                return this.pointerControlsTranslateZ(value, null);
            case ControlType.RAPIER_COLLIDER:
                return this.rapierColliderTranslateZ(value);
            default:
                return null;
        }
    }


    /** @description handle orbit controls -x +x translation */
    private orbitControlsTranslateX(value: number, controller: CameraControllerType | null): Vector3 | null {

        if(!this.target) return null;

        if(!value) return null;

        const object = this.getOrbitControls(controller);

        if(!object) return null;

        const direction = new Vector3(value,0,0);

        this.velocity = this.calculateVelocity(direction);

        this.velocity.multiplyScalar(this.delta)

        if(this.cameraController) this.applyCameraControllerQuaternion();

        this.velocity.y = 0;

        object.object.position.add(this.velocity);
        object.target.add(this.velocity);

        return this.velocity;

    }

    /** @description handle orbit controls -z +z translation */
    private orbitControlsTranslateZ(value: number,controller: CameraControllerType | null): Vector3 | null  {

        if(!this.target) return null;

        if(!value) return null;

        const object: (OrbitControls & OrbitControlsWrapper) | null = this.getOrbitControls(controller);

        if(!object) return null;

        const direction = new Vector3(0,0,value);

        this.velocity = this.calculateVelocity(direction);

        this.velocity.multiplyScalar(this.delta)

        if(this.cameraController) this.applyCameraControllerQuaternion();

        this.velocity.y = 0;

        object.object.position.add(this.velocity);
        object.target.add(this.velocity);

        return this.velocity;

    }

    /** @description handle pointer controls -x +x translation */
    private pointerControlsTranslateX(value: number,controller: CameraControllerType | null): Vector3 | null {

       if(!this.target) return null;

        if(!value) return null;

        const object = this.getPointLockControls(controller);

        if(!object) return null;

        const direction = new Vector3(value,0,0);

        const velocity = this.calculateVelocity(direction);

        velocity.multiplyScalar(this.delta)

        if(this.cameraController) this.applyCameraControllerQuaternion();

        velocity.y = 0;

        object.moveRight(velocity.x);

        return this.velocity;
    }

    /** @description handle pointer controls -z +z translation */
    private pointerControlsTranslateZ(value: number,controller: CameraControllerType | null): Vector3 | null {
        if(!this.target) return null;

        if(!value) return null;

        const object = this.getPointLockControls(controller);

        if(!object){ return null};

        const direction = new Vector3(0,0, value);

        const velocity = this.calculateVelocity(direction);

        velocity.multiplyScalar(this.delta)

        if(this.cameraController) this.applyCameraControllerQuaternion();

        velocity.y = 0;

        object.moveForward(-velocity.z);

        return this.velocity;
    }

    private rapierColliderTranslateX(value: number): Vector3 | null{

        if(!this.target) return null;

        if(!value) return null;

        const object = this.target.object as unknown as RAPIER.Collider

        const direction = new Vector3(value,0,0);

        this.velocity = this.calculateVelocity(direction);

        this.velocity.multiplyScalar(this.delta);

        let currTranslation = new Vector3(object.translation().x, object.translation().y, object.translation().z);

        if(this.cameraController) this.applyCameraControllerQuaternion();

        this.velocity.y = 0;

        currTranslation.add(this.velocity);

        object.setTranslation(currTranslation);

        return this.velocity;
    }

    private rapierColliderTranslateZ(value: number): Vector3 | null{
      
        if(!this.target) return null;

        if(!value) return null;

        const object = this.target.object as unknown as RAPIER.Collider

        const direction = new Vector3(0,0, value);

        this.velocity = this.calculateVelocity(direction);

        this.velocity.multiplyScalar(this.delta);

        let currTranslation = new Vector3(object.translation().x, object.translation().y, object.translation().z);

        if(this.cameraController) this.applyCameraControllerQuaternion();

        this.velocity.y = 0;

        currTranslation.add(this.velocity);

        object.setTranslation(currTranslation);

        return this.velocity;
    }

    private rapierRigidBodyTranslateX(){
        return null;
    }

    private rapierRigidBodyTranslateZ(){
        return null;
    }

    private object3DTranslateX(value: number, controller: THREE.Object3D | null): Vector3 | null {

        if(!this.target) return null;

        if(!value) return null;

        const object = (controller || this.target.object) as THREE.Object3D;

        const direction = new Vector3(value,0,0);

        this.velocity = this.calculateVelocity(direction);

        this.velocity.multiplyScalar(this.delta)

        if(this.cameraController) this.applyCameraControllerQuaternion();

        this.velocity.y = 0;

        object.position.add(this.velocity);

        return this.velocity;
    }

    private object3DTranslateZ(value: number, controller: THREE.Object3D | null): Vector3 | null{

        if(!this.target) return null;

        if(!value) return null;

        const object = (controller || this.target.object) as THREE.Object3D;

        const direction = new Vector3(0,0, value);

        this.velocity = this.calculateVelocity(direction);

        this.velocity.multiplyScalar(this.delta)

        if(this.cameraController) this.applyCameraControllerQuaternion();

        this.velocity.y = 0;

        object.position.add(this.velocity);

        return this.velocity;

    }

    getTargetObjectPosition(){
        if(!this.target) return null;
    }

    /** set target */
    setTargetObject(target: TargetObject){
        this.target = target; 
    }

    /** copy to */

    copyTo(copyToTarget: (TargetObject)[  ] ){
        this.copyToTarget = copyToTarget;
    }


    /** utils */

    applyCameraControllerQuaternion(){
        if(this.cameraController === null)return;

        let quaternion = new Quaternion(
            this.cameraController.camera.quaternion.x,
            this.cameraController.camera.quaternion.y,
            this.cameraController.camera.quaternion.z,
            this.cameraController.camera.quaternion.w
        );

        this.velocity.applyQuaternion(quaternion);
    }

   calculateVelocity(direction: Vector3){
        let VAL_ENUM: (number)[] = [ 1, -1 ]
        let velocity = new Vector3(0, 0, 0);
    
        for(const [key, index] of Object.keys(direction)){
            if(VAL_ENUM.includes(direction[key as 'x' | 'y' | 'z'])){
               velocity[key as 'x' | 'y' | 'z'] -= direction[key as 'x' | 'y' | 'z'] * this.SPEED_UP_CONSTANT * this.delta;
            }
        }
    
        return velocity;
    
    }

    getTargetObjectTranslation(): (Vector3 | Quaternion)[] | null{
        if(!this.target)return null;

        switch(this.target.type){
            case ControlType.OBJECT_3D:
                return[
                    new Vector3().copy((this.target.object as unknown as THREE.Object3D).position)
                ];

            case ControlType.ORBIT_CONTROLS:
                return [
                    new Vector3().copy((this.target.object as unknown as OrbitControls).object.position),
                    new Vector3().copy((this.target.object as unknown as OrbitControls).target),
                ]

            case ControlType.POINTER_LOCK_CONTROLS:
                return [
                    new Vector3().copy((this.target.object as unknown as PointerLockControls).camera.position),
                ]
            case ControlType.RAPIER_COLLIDER:
                const pos = (this.target.object as unknown as RAPIER.Collider).translation();
                const rotation = (this.target.object as unknown as RAPIER.Collider).rotation()
                let rotVec4 = new Vector4(rotation.x, rotation.y, rotation.z, rotation.w);
                return [
                    new Vector3(pos.x, pos.y, pos.z),
                    new Quaternion(
                        rotVec4.x,
                        rotVec4.y,
                        rotVec4.z,
                        rotVec4.w
                    )
                ]
            default:
                return null;
        }
    }

    updateCopyTargetObject(updateActiveCameraController: boolean): void{

        if(this.copyToTarget?.length){

            const translation = this.getTargetObjectTranslation();

            for(const target of this.copyToTarget){
    
                switch(target.type){
                    case ControlType.OBJECT_3D:
                        // if(this.translateXDirection) this.object3DTranslateX(this.direction.x,target.object);
                        // if(this.translateZDirection) this.object3DTranslateZ(this.direction.z,target.object);
                        if(!translation)break;
                        (target.object as unknown as THREE.Object3D).position.copy(translation[0] as unknown as Vector3);
                        break;
                    case ControlType.ORBIT_CONTROLS:
                        if(this.translateXDirection) this.orbitControlsTranslateX(this.direction.x,target.object as CameraControllerType);
                        if(this.translateZDirection) this.orbitControlsTranslateZ(this.direction.z,target.object as CameraControllerType);
                        break;
                    case ControlType.POINTER_LOCK_CONTROLS:
                        if(this.translateXDirection) this.pointerControlsTranslateX(this.direction.x, target.object as CameraControllerType);
                        if(this.translateZDirection) this.pointerControlsTranslateZ(this.direction.z,target.object as CameraControllerType);
                        break;
                    case ControlType.RAPIER_COLLIDER:
                        break;
                    default:
                }
            }

        }

        if(!updateActiveCameraController){return};

        const type = this.getCameraControllerActiveControlType();

        if(!type)return;

        if(![ ControlType.ORBIT_CONTROLS, ControlType.POINTER_LOCK_CONTROLS ].includes(type)){return}

        if(this.translateXDirection) this[ type === ControlType.ORBIT_CONTROLS ? 'orbitControlsTranslateX' : 'pointerControlsTranslateX' ](this.direction.x,this.cameraController);
        if(this.translateZDirection) this[ type === ControlType.ORBIT_CONTROLS ? 'orbitControlsTranslateZ' : 'pointerControlsTranslateZ' ](this.direction.z,this.cameraController);



    }

    
    updateCopyTargetObjectVelocity(updateActiveCameraController: boolean): void{

        if(this.copyToTarget?.length){

            const translation = this.getTargetObjectTranslation();

            for(const target of this.copyToTarget){
    
                switch(target.type){
                    case ControlType.OBJECT_3D:
                        if(this.translateXDirection) this.object3DTranslateX(this.direction.x,target.object as unknown as THREE.Object3D);
                        if(this.translateZDirection) this.object3DTranslateZ(this.direction.z,target.object as unknown as THREE.Object3D);
                        break;
                    case ControlType.ORBIT_CONTROLS:
                        if(this.translateXDirection) this.orbitControlsTranslateX(this.direction.x,target.object as unknown as CameraControllerType);
                        if(this.translateZDirection) this.orbitControlsTranslateZ(this.direction.z,target.object as unknown as CameraControllerType);
                        break;
                    case ControlType.POINTER_LOCK_CONTROLS:
                        if(this.translateXDirection) this.pointerControlsTranslateX(this.direction.x, target.object as unknown as CameraControllerType);
                        if(this.translateZDirection) this.pointerControlsTranslateZ(this.direction.z,target.object as unknown as CameraControllerType)
                        break;
                    case ControlType.RAPIER_COLLIDER:
                        break;
                    default:
                }
            }

        }

        if(!updateActiveCameraController){return};

        const type = this.getCameraControllerActiveControlType();

        if(!type){return};

        if(![ ControlType.ORBIT_CONTROLS, ControlType.POINTER_LOCK_CONTROLS ].includes(type)){return}

        if(this.translateXDirection) this[ type === ControlType.ORBIT_CONTROLS ? 'orbitControlsTranslateX' : 'pointerControlsTranslateX' ](this.direction.x,this.cameraController);
        if(this.translateZDirection) this[ type === ControlType.ORBIT_CONTROLS ? 'orbitControlsTranslateZ' : 'pointerControlsTranslateZ' ](this.direction.z,this.cameraController);
    }

    update(delta: number){
        this.delta = delta;
        this.velocity.x -= this.velocity.x * this.SLOW_DOWN_CONSTANT * this.delta;
		this.velocity.z -= this.velocity.z * this.SLOW_DOWN_CONSTANT * this.delta;

        if(this.translateXDirection) this.translateX(this.direction.x);
        if(this.translateZDirection) this.translateZ(this.direction.z);
    }


    /** get orbit controls */

    getOrbitControls(controller: CameraControllerType | null) : OrbitControlsWrapper | null {
        let c = (controller !== null ? controller.controls : (this.target?.object as CameraControllerType).controls).find((control: OrbitControlsWrapper | PointerLockControlsWrapper) => control.userData && control.userData.type === ControlType.ORBIT_CONTROLS);

        if(!c){ return null }

        return c as OrbitControlsWrapper;
    } 
    
    getPointLockControls(controller: CameraControllerType | null) : PointerLockControlsWrapper | null {
        let c = (controller !== null ? controller.controls : (this.target?.object as CameraControllerType).controls).find(control => control.userData && control.userData.type === ControlType.POINTER_LOCK_CONTROLS);

        if(!c){ return null }

        return c as PointerLockControlsWrapper;
    }
    
    getCameraControllerActiveControlType(): ControlType.ORBIT_CONTROLS | ControlType.POINTER_LOCK_CONTROLS | null {
        const control = this.cameraController?.controls.find((control: (OrbitControlsWrapper | PointerLockControlsWrapper)) => control.userData && control.userData.active === true);

        if(!control?.userData) return null;

        return control?.userData.type
    }
}