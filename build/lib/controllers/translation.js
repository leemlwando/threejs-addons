"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationController = void 0;
const Vector3_1 = require("three/src/math/Vector3");
const Vector4_1 = require("three/src/math/Vector4");
const Quaternion_1 = require("three/src/math/Quaternion");
const types_1 = require("../../types");
class TranslationController {
    constructor(args) {
        this.SLOW_DOWN_CONSTANT = 10;
        this.SPEED_UP_CONSTANT = 400;
        this.velocity = new Vector3_1.Vector3(0, 0, 0);
        this.direction = new Vector3_1.Vector3(0, 0, 0);
        this.target = null;
        this.copyToTarget = [];
        this.delta = 0;
        this.translateXDirection = false;
        this.translateZDirection = false;
        /** extra data */
        this.cameraController = null;
        if (args === null)
            return;
        if (args === null || args === void 0 ? void 0 : args.cameraController)
            this.cameraController = args.cameraController;
        if (args === null || args === void 0 ? void 0 : args.copyToTarget)
            this.copyToTarget = args.copyToTarget;
    }
    /** setup camera controller */
    setCameraController(controller) {
        this.cameraController = controller;
    }
    /** set translation state */
    setTranslateXDirection(state, distance) {
        if (distance)
            this.direction = new Vector3_1.Vector3(distance, 0, 0);
        this.translateXDirection = state;
    }
    setTranslateZDirection(state, distance) {
        if (distance)
            this.direction = new Vector3_1.Vector3(0, 0, distance);
        this.translateZDirection = state;
    }
    /** master controls */
    translateX(value) {
        var _a;
        switch ((_a = this.target) === null || _a === void 0 ? void 0 : _a.type) {
            case types_1.ControlType.OBJECT_3D:
                return this.object3DTranslateX(value, null);
            case types_1.ControlType.ORBIT_CONTROLS:
                return this.orbitControlsTranslateX(value, null);
            case types_1.ControlType.POINTER_LOCK_CONTROLS:
                return this.pointerControlsTranslateX(value, null);
            case types_1.ControlType.RAPIER_COLLIDER:
                return this.rapierColliderTranslateX(value);
            default:
                return null;
        }
    }
    translateZ(value) {
        var _a;
        if (!this.target) {
            return null;
        }
        ;
        switch ((_a = this.target) === null || _a === void 0 ? void 0 : _a.type) {
            case types_1.ControlType.OBJECT_3D:
                return this.object3DTranslateZ(value, null);
            case types_1.ControlType.ORBIT_CONTROLS:
                return this.orbitControlsTranslateZ(value, null);
            case types_1.ControlType.POINTER_LOCK_CONTROLS:
                return this.pointerControlsTranslateZ(value, null);
            case types_1.ControlType.RAPIER_COLLIDER:
                return this.rapierColliderTranslateZ(value);
            default:
                return null;
        }
    }
    /** @description handle orbit controls -x +x translation */
    orbitControlsTranslateX(value, controller) {
        if (!this.target)
            return null;
        if (!value)
            return null;
        const object = this.getOrbitControls(controller);
        if (!object)
            return null;
        const direction = new Vector3_1.Vector3(value, 0, 0);
        this.velocity = this.calculateVelocity(direction);
        this.velocity.multiplyScalar(this.delta);
        if (this.cameraController)
            this.applyCameraControllerQuaternion();
        this.velocity.y = 0;
        object.object.position.add(this.velocity);
        object.target.add(this.velocity);
        return this.velocity;
    }
    /** @description handle orbit controls -z +z translation */
    orbitControlsTranslateZ(value, controller) {
        if (!this.target)
            return null;
        if (!value)
            return null;
        const object = this.getOrbitControls(controller);
        if (!object)
            return null;
        const direction = new Vector3_1.Vector3(0, 0, value);
        this.velocity = this.calculateVelocity(direction);
        this.velocity.multiplyScalar(this.delta);
        if (this.cameraController)
            this.applyCameraControllerQuaternion();
        this.velocity.y = 0;
        object.object.position.add(this.velocity);
        object.target.add(this.velocity);
        return this.velocity;
    }
    /** @description handle pointer controls -x +x translation */
    pointerControlsTranslateX(value, controller) {
        if (!this.target)
            return null;
        if (!value)
            return null;
        const object = this.getPointLockControls(controller);
        if (!object)
            return null;
        const direction = new Vector3_1.Vector3(value, 0, 0);
        const velocity = this.calculateVelocity(direction);
        velocity.multiplyScalar(this.delta);
        if (this.cameraController)
            this.applyCameraControllerQuaternion();
        velocity.y = 0;
        object.moveRight(velocity.x);
        return this.velocity;
    }
    /** @description handle pointer controls -z +z translation */
    pointerControlsTranslateZ(value, controller) {
        if (!this.target)
            return null;
        if (!value)
            return null;
        const object = this.getPointLockControls(controller);
        if (!object) {
            return null;
        }
        ;
        const direction = new Vector3_1.Vector3(0, 0, value);
        const velocity = this.calculateVelocity(direction);
        velocity.multiplyScalar(this.delta);
        if (this.cameraController)
            this.applyCameraControllerQuaternion();
        velocity.y = 0;
        object.moveForward(-velocity.z);
        return this.velocity;
    }
    rapierColliderTranslateX(value) {
        if (!this.target)
            return null;
        if (!value)
            return null;
        const object = this.target.object;
        const direction = new Vector3_1.Vector3(value, 0, 0);
        this.velocity = this.calculateVelocity(direction);
        this.velocity.multiplyScalar(this.delta);
        let currTranslation = new Vector3_1.Vector3(object.translation().x, object.translation().y, object.translation().z);
        if (this.cameraController)
            this.applyCameraControllerQuaternion();
        this.velocity.y = 0;
        currTranslation.add(this.velocity);
        object.setTranslation(currTranslation);
        return this.velocity;
    }
    rapierColliderTranslateZ(value) {
        if (!this.target)
            return null;
        if (!value)
            return null;
        const object = this.target.object;
        const direction = new Vector3_1.Vector3(0, 0, value);
        this.velocity = this.calculateVelocity(direction);
        this.velocity.multiplyScalar(this.delta);
        let currTranslation = new Vector3_1.Vector3(object.translation().x, object.translation().y, object.translation().z);
        if (this.cameraController)
            this.applyCameraControllerQuaternion();
        this.velocity.y = 0;
        currTranslation.add(this.velocity);
        object.setTranslation(currTranslation);
        return this.velocity;
    }
    static translateControls(cameraController, velocity, directionState) {
        const controls = cameraController.controls;
        const control = controls.find(control => control.userData && control.userData.active === true);
        if (!(control === null || control === void 0 ? void 0 : control.userData))
            return null;
        switch (control.userData.type) {
            case types_1.ControlType.ORBIT_CONTROLS:
                control.object.position.add(velocity);
                control.target.add(velocity);
                break;
            case types_1.ControlType.POINTER_LOCK_CONTROLS:
                control[(directionState === null || directionState === void 0 ? void 0 : directionState.translateXDirection) ? 'moveRight' : 'moveForward']((directionState === null || directionState === void 0 ? void 0 : directionState.translateXDirection) ? velocity.x : velocity.z);
            default:
                return null;
        }
    }
    rapierRigidBodyTranslateX() {
        return null;
    }
    rapierRigidBodyTranslateZ() {
        return null;
    }
    object3DTranslateX(value, controller) {
        if (!this.target)
            return null;
        if (!value)
            return null;
        const object = (controller || this.target.object);
        const direction = new Vector3_1.Vector3(value, 0, 0);
        this.velocity = this.calculateVelocity(direction);
        this.velocity.multiplyScalar(this.delta);
        if (this.cameraController)
            this.applyCameraControllerQuaternion();
        this.velocity.y = 0;
        object.position.add(this.velocity);
        return this.velocity;
    }
    object3DTranslateZ(value, controller) {
        if (!this.target)
            return null;
        if (!value)
            return null;
        const object = (controller || this.target.object);
        const direction = new Vector3_1.Vector3(0, 0, value);
        this.velocity = this.calculateVelocity(direction);
        this.velocity.multiplyScalar(this.delta);
        if (this.cameraController)
            this.applyCameraControllerQuaternion();
        this.velocity.y = 0;
        object.position.add(this.velocity);
        return this.velocity;
    }
    getTargetObjectPosition() {
        if (!this.target)
            return null;
    }
    /** set target */
    setTargetObject(target) {
        this.target = target;
    }
    /** copy to */
    copyTo(copyToTarget) {
        this.copyToTarget = copyToTarget;
    }
    /** utils */
    applyCameraControllerQuaternion() {
        if (this.cameraController === null)
            return;
        let quaternion = new Quaternion_1.Quaternion(this.cameraController.camera.quaternion.x, this.cameraController.camera.quaternion.y, this.cameraController.camera.quaternion.z, this.cameraController.camera.quaternion.w);
        this.velocity.applyQuaternion(quaternion);
    }
    calculateVelocity(direction) {
        let VAL_ENUM = [1, -1];
        let velocity = new Vector3_1.Vector3(0, 0, 0);
        for (const [key, index] of Object.keys(direction)) {
            if (VAL_ENUM.includes(direction[key])) {
                velocity[key] -= direction[key] * this.SPEED_UP_CONSTANT * this.delta;
            }
        }
        return velocity;
    }
    getTargetObjectTranslation() {
        if (!this.target)
            return null;
        switch (this.target.type) {
            case types_1.ControlType.OBJECT_3D:
                return [
                    new Vector3_1.Vector3().copy(this.target.object.position)
                ];
            case types_1.ControlType.ORBIT_CONTROLS:
                return [
                    new Vector3_1.Vector3().copy(this.target.object.object.position),
                    new Vector3_1.Vector3().copy(this.target.object.target),
                ];
            case types_1.ControlType.POINTER_LOCK_CONTROLS:
                return [
                    new Vector3_1.Vector3().copy(this.target.object.camera.position),
                ];
            case types_1.ControlType.RAPIER_COLLIDER:
                const pos = this.target.object.translation();
                const rotation = this.target.object.rotation();
                let rotVec4 = new Vector4_1.Vector4(rotation.x, rotation.y, rotation.z, rotation.w);
                return [
                    new Vector3_1.Vector3(pos.x, pos.y, pos.z),
                    new Quaternion_1.Quaternion(rotVec4.x, rotVec4.y, rotVec4.z, rotVec4.w)
                ];
            default:
                return null;
        }
    }
    updateCopyTargetObject(updateActiveCameraController) {
        var _a;
        if ((_a = this.copyToTarget) === null || _a === void 0 ? void 0 : _a.length) {
            const translation = this.getTargetObjectTranslation();
            for (const target of this.copyToTarget) {
                switch (target.type) {
                    case types_1.ControlType.OBJECT_3D:
                        // if(this.translateXDirection) this.object3DTranslateX(this.direction.x,target.object);
                        // if(this.translateZDirection) this.object3DTranslateZ(this.direction.z,target.object);
                        if (!translation)
                            break;
                        target.object.position.copy(translation[0]);
                        break;
                    case types_1.ControlType.ORBIT_CONTROLS:
                        if (this.translateXDirection)
                            this.orbitControlsTranslateX(this.direction.x, target.object);
                        if (this.translateZDirection)
                            this.orbitControlsTranslateZ(this.direction.z, target.object);
                        break;
                    case types_1.ControlType.POINTER_LOCK_CONTROLS:
                        if (this.translateXDirection)
                            this.pointerControlsTranslateX(this.direction.x, target.object);
                        if (this.translateZDirection)
                            this.pointerControlsTranslateZ(this.direction.z, target.object);
                        break;
                    case types_1.ControlType.RAPIER_COLLIDER:
                        break;
                    default:
                }
            }
        }
        if (!updateActiveCameraController) {
            return;
        }
        ;
        const type = this.getCameraControllerActiveControlType();
        if (!type)
            return;
        if (![types_1.ControlType.ORBIT_CONTROLS, types_1.ControlType.POINTER_LOCK_CONTROLS].includes(type)) {
            return;
        }
        if (this.translateXDirection)
            this[type === types_1.ControlType.ORBIT_CONTROLS ? 'orbitControlsTranslateX' : 'pointerControlsTranslateX'](this.direction.x, this.cameraController);
        if (this.translateZDirection)
            this[type === types_1.ControlType.ORBIT_CONTROLS ? 'orbitControlsTranslateZ' : 'pointerControlsTranslateZ'](this.direction.z, this.cameraController);
    }
    updateCopyTargetObjectVelocity(updateActiveCameraController) {
        var _a;
        if ((_a = this.copyToTarget) === null || _a === void 0 ? void 0 : _a.length) {
            const translation = this.getTargetObjectTranslation();
            for (const target of this.copyToTarget) {
                switch (target.type) {
                    case types_1.ControlType.OBJECT_3D:
                        if (this.translateXDirection)
                            this.object3DTranslateX(this.direction.x, target.object);
                        if (this.translateZDirection)
                            this.object3DTranslateZ(this.direction.z, target.object);
                        break;
                    case types_1.ControlType.ORBIT_CONTROLS:
                        if (this.translateXDirection)
                            this.orbitControlsTranslateX(this.direction.x, target.object);
                        if (this.translateZDirection)
                            this.orbitControlsTranslateZ(this.direction.z, target.object);
                        break;
                    case types_1.ControlType.POINTER_LOCK_CONTROLS:
                        if (this.translateXDirection)
                            this.pointerControlsTranslateX(this.direction.x, target.object);
                        if (this.translateZDirection)
                            this.pointerControlsTranslateZ(this.direction.z, target.object);
                        break;
                    case types_1.ControlType.RAPIER_COLLIDER:
                        break;
                    default:
                }
            }
        }
        if (!updateActiveCameraController) {
            return;
        }
        ;
        const type = this.getCameraControllerActiveControlType();
        if (!type) {
            return;
        }
        ;
        if (![types_1.ControlType.ORBIT_CONTROLS, types_1.ControlType.POINTER_LOCK_CONTROLS].includes(type)) {
            return;
        }
        if (this.translateXDirection)
            this[type === types_1.ControlType.ORBIT_CONTROLS ? 'orbitControlsTranslateX' : 'pointerControlsTranslateX'](this.direction.x, this.cameraController);
        if (this.translateZDirection)
            this[type === types_1.ControlType.ORBIT_CONTROLS ? 'orbitControlsTranslateZ' : 'pointerControlsTranslateZ'](this.direction.z, this.cameraController);
    }
    update(delta) {
        this.delta = delta;
        this.velocity.x -= this.velocity.x * this.SLOW_DOWN_CONSTANT * this.delta;
        this.velocity.z -= this.velocity.z * this.SLOW_DOWN_CONSTANT * this.delta;
        if (this.translateXDirection)
            this.translateX(this.direction.x);
        if (this.translateZDirection)
            this.translateZ(this.direction.z);
    }
    /** get orbit controls */
    getOrbitControls(controller) {
        var _a;
        let c = (controller !== null ? controller.controls : ((_a = this.target) === null || _a === void 0 ? void 0 : _a.object).controls).find((control) => control.userData && control.userData.type === types_1.ControlType.ORBIT_CONTROLS);
        if (!c) {
            return null;
        }
        return c;
    }
    getPointLockControls(controller) {
        var _a;
        let c = (controller !== null ? controller.controls : ((_a = this.target) === null || _a === void 0 ? void 0 : _a.object).controls).find(control => control.userData && control.userData.type === types_1.ControlType.POINTER_LOCK_CONTROLS);
        if (!c) {
            return null;
        }
        return c;
    }
    getCameraControllerActiveControlType() {
        var _a;
        const control = (_a = this.cameraController) === null || _a === void 0 ? void 0 : _a.controls.find((control) => control.userData && control.userData.active === true);
        if (!(control === null || control === void 0 ? void 0 : control.userData))
            return null;
        return control === null || control === void 0 ? void 0 : control.userData.type;
    }
}
exports.TranslationController = TranslationController;
//# sourceMappingURL=translation.js.map