"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationController = void 0;
const Vector3_1 = require("three/src/math/Vector3");
const types_1 = require("../../types");
const controller_1 = require("./controller");
class TranslationController extends controller_1.BaseController {
    constructor({ options, RCC, CCC }) {
        super({ target: null, options });
        this.RCC = RCC;
        this.CCC = CCC;
    }
    /**
     * @description setup rapier coontroller class instance
     * @param RCC RapierColliderController
    */
    setRCC(RCC) {
        this.RCC = RCC;
    }
    /**
     * @description setup up camera controller class instance
     * @param CCC CameraController
     * */
    setCCC(CCC) {
        this.CCC = CCC;
    }
    translateOrbitControls() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const orbitControls = this.getOrbitControls();
        if (!orbitControls)
            return;
        if (this.RCC) {
            orbitControls.object.position.add(this.RCC.velocity.clone());
            orbitControls.target.add(this.RCC.velocity.clone());
            return;
        }
        const { x: px, y: py, z: pz } = orbitControls.object.position;
        const computedTranslation = controller_1.BaseController.computeTranslationXYZDirection({
            SPEED_UP_CONSTANT: this.SPEED_UP_CONSTANT,
            delta: this.delta,
            direction: this.direction,
            translation: new Vector3_1.Vector3(px, py, pz),
            cameraController: this.cameraController
        });
        if (!computedTranslation)
            return;
        const { position: desiredMovementVector, velocity: desiredVelocityVector } = computedTranslation;
        this.desiredMovementVector = desiredMovementVector;
        /** carry out corrections based on max an min translation options */
        this.desiredMovementVector.y = Math.min(Math.max(this.desiredMovementVector.y, (_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.translation) === null || _b === void 0 ? void 0 : _b.max) === null || _c === void 0 ? void 0 : _c.y), (_f = (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.translation) === null || _e === void 0 ? void 0 : _e.max) === null || _f === void 0 ? void 0 : _f.y);
        this.desiredVelocityVector = desiredVelocityVector;
        this.desiredVelocityVector.y = Math.min(Math.max(this.desiredMovementVector.y, (_j = (_h = (_g = this.options) === null || _g === void 0 ? void 0 : _g.translation) === null || _h === void 0 ? void 0 : _h.max) === null || _j === void 0 ? void 0 : _j.y), (_m = (_l = (_k = this.options) === null || _k === void 0 ? void 0 : _k.translation) === null || _l === void 0 ? void 0 : _l.max) === null || _m === void 0 ? void 0 : _m.y);
        orbitControls.object.position.add(this.desiredVelocityVector);
        orbitControls.target.add(this.desiredVelocityVector);
    }
    translatePointerLockControls() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const pointerLockControls = this.getPointLockControls();
        if (!pointerLockControls)
            return;
        if (this.RCC) {
            const { x: rccX, y: rccY, z: rccZ } = this.RCC.position.clone();
            if (this.translateZDirection) {
                pointerLockControls.camera.position.set(rccX, pointerLockControls.camera.position.y, rccZ);
            }
            if (this.translateXDirection) {
                pointerLockControls.camera.position.set(rccX, pointerLockControls.camera.position.y, rccZ);
            }
            if (this.translateXYZDirection) {
                pointerLockControls.camera.position.set(rccX, pointerLockControls.camera.position.y, rccZ);
                pointerLockControls.camera.position.set(rccX, pointerLockControls.camera.position.y, rccZ);
            }
            return;
        }
        const { x: px, y: py, z: pz } = pointerLockControls.camera.position;
        const computedTranslation = controller_1.BaseController.computeTranslationXYZDirection({
            SPEED_UP_CONSTANT: this.SPEED_UP_CONSTANT,
            delta: this.delta,
            direction: this.direction,
            translation: new Vector3_1.Vector3(px, py, pz),
            //  cameraController: this.cameraController as CameraControllerType //causing funny side effects
        });
        if (!computedTranslation)
            return;
        const { position: desiredMovementVector, velocity: desiredVelocityVector } = computedTranslation;
        this.desiredMovementVector = desiredMovementVector;
        /** carry out corrections based on max an min translation options */
        this.desiredMovementVector.y = Math.min(Math.max(this.desiredMovementVector.y, (_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.translation) === null || _b === void 0 ? void 0 : _b.max) === null || _c === void 0 ? void 0 : _c.y), (_f = (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.translation) === null || _e === void 0 ? void 0 : _e.max) === null || _f === void 0 ? void 0 : _f.y);
        this.desiredVelocityVector = desiredVelocityVector;
        this.desiredVelocityVector.y = Math.min(Math.max(this.desiredMovementVector.y, (_j = (_h = (_g = this.options) === null || _g === void 0 ? void 0 : _g.translation) === null || _h === void 0 ? void 0 : _h.max) === null || _j === void 0 ? void 0 : _j.y), (_m = (_l = (_k = this.options) === null || _k === void 0 ? void 0 : _k.translation) === null || _l === void 0 ? void 0 : _l.max) === null || _m === void 0 ? void 0 : _m.y);
        if (this.translateZDirection) {
            pointerLockControls.moveForward(-this.desiredVelocityVector.z);
        }
        if (this.translateXDirection) {
            pointerLockControls.moveRight(this.desiredVelocityVector.x);
        }
        if (this.translateXYZDirection) {
            pointerLockControls.moveForward(-this.desiredVelocityVector.z);
            pointerLockControls.moveRight(this.desiredVelocityVector.x);
        }
    }
    handleTranslateXYZDirection() {
        if (this.getCameraControllerActiveControlType() === types_1.ControlType.ORBIT_CONTROLS) {
            this.translateOrbitControls();
        }
        if (this.getCameraControllerActiveControlType() === types_1.ControlType.POINTER_LOCK_CONTROLS) {
            this.translatePointerLockControls();
        }
    }
    /** handle simulation */
    update(delta) {
        this.delta = delta;
        this.velocity.x -= this.velocity.x * this.SLOW_DOWN_CONSTANT * this.delta;
        this.velocity.z -= this.velocity.z * this.SLOW_DOWN_CONSTANT * this.delta;
        if (this.RCC) {
            this.translateXDirection = this.RCC.translateXDirection;
            this.translateZDirection = this.RCC.translateZDirection;
            this.translateXYZDirection = this.RCC.translateXYZDirection;
        }
        if (this.translateXDirection || this.translateZDirection || this.translateXYZDirection)
            return this.handleTranslateXYZDirection();
    }
    /** get orbit controls */
    getOrbitControls(controller) {
        const cameraController = controller || this.cameraController;
        if (!cameraController)
            return null;
        const orbitControls = cameraController.controls.find((control) => control.userData && control.userData.type === types_1.ControlType.ORBIT_CONTROLS);
        if (!orbitControls)
            return null;
        return orbitControls;
    }
    getPointLockControls(controller) {
        const cameraController = controller || this.cameraController;
        if (!cameraController)
            return null;
        const pointerLockControls = cameraController.controls.find((control) => control.userData && control.userData.type === types_1.ControlType.POINTER_LOCK_CONTROLS);
        if (!pointerLockControls)
            return null;
        return pointerLockControls;
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