"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const Vector3_1 = require("three/src/math/Vector3");
const Quaternion_1 = require("three/src/math/Quaternion");
const helpers_1 = require("../../utils/helpers");
class BaseController {
    constructor({ CCC, RCC, TCC, target, options }) {
        this.translateXDirection = false;
        this.translateYDirection = false;
        this.translateZDirection = false;
        this.translateXYZDirection = false;
        this.direction = new Vector3_1.Vector3(0, 0, 0);
        this.position = new Vector3_1.Vector3(0, 0, 0);
        this.rotation = new Quaternion_1.Quaternion(0, 0, 0, 0);
        this.velocity = new Vector3_1.Vector3(0, 0, 0);
        this.delta = 0;
        this.SPEED_UP_CONSTANT = 400;
        this.SLOW_DOWN_CONSTANT = 10;
        this.desiredMovementVector = new Vector3_1.Vector3(0, 0, 0);
        this.desiredVelocityVector = new Vector3_1.Vector3(0, 0, 0);
        if (target)
            this.setTarget(target);
        if (options)
            this.options = options;
        if (CCC)
            this.setCCC(CCC);
        if (RCC)
            this.setRCC(RCC);
        if (TCC)
            this.setTCC(TCC);
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
    /**
     * @description setup up translation controller class instance
     * @param TCC TranslationController
     * */
    setTCC(TCC) {
        this.TCC = TCC;
    }
    /**
     * @description sets camera controller
     */
    setCameraController(cameraController) {
        this.cameraController = cameraController;
    }
    /** @description states whether or not we should translate target in x direction */
    setTranslateXDirection(state, value) {
        this.translateXDirection = state;
        this.direction = new Vector3_1.Vector3(value, 0, 0);
    }
    /** @description states whether or not we should translate target in y direction */
    setTranslateYDirection(state, value) {
        this.translateYDirection = state;
        this.direction = new Vector3_1.Vector3(0, value, 0);
    }
    /** @description states whether or not we should translate target in z direction */
    setTranslateZDirection(state, value) {
        this.translateZDirection = state;
        this.direction = new Vector3_1.Vector3(0, 0, value);
    }
    /**
     * @description states whether or not we should translate target in x, y, and z directions
     * @remarks perfect for applying forces/impulses
     * */
    setTranslateXYZDirection(state, direction) {
        this.translateXYZDirection = state;
        this.direction = direction;
    }
    /**
     * @deprecated
     * @param self
     * @returns
     */
    static computeTranslationXDirection(self) {
        let position = new Vector3_1.Vector3(self.target.position.x, self.target.position.y, self.target.position.z);
        const velocity = (0, helpers_1.calculateVelocity)(self);
        velocity.multiplyScalar(self.delta);
        if (self.cameraController)
            velocity.applyQuaternion(self.cameraController.camera.quaternion);
        position.add(velocity);
        return position;
    }
    /**
     *
     * @param
     * @returns
     */
    static computeTranslationXYZDirection({ translation, direction, SPEED_UP_CONSTANT, delta, cameraController }) {
        const { x, y, z } = translation;
        const position = new Vector3_1.Vector3(x, y, z);
        const velocity = (0, helpers_1.calculateVelocity)({ SPEED_UP_CONSTANT, delta, direction });
        velocity.multiplyScalar(delta);
        if (cameraController !== undefined)
            velocity.applyQuaternion(cameraController.camera.quaternion);
        position.add(velocity);
        return { position, velocity };
    }
    handleTranslateXDirection() {
        let position = new Vector3_1.Vector3(this._target.position.x, this._target.position.y, this._target.position.z);
        const velocity = (0, helpers_1.calculateVelocity)(this);
        position.add(velocity);
        this.desiredMovementVector = position;
    }
    handleTranslateYDirection() {
    }
    handleTranslateZDirection() {
    }
    handleTranslateXYZDirection() {
    }
    updateTargetPosition() {
        if (!this.target)
            return null;
        this.target.position.copy(this.desiredMovementVector);
        return this.target.position;
    }
    updateTargetQuaternion() {
        if (!this.cameraController)
            return;
        if (!this.target)
            return;
        this.target.quaternion.copy(this.cameraController.camera.quaternion);
        return;
    }
    /**
     * @description sets the target of the controller
     */
    setTarget(target) {
        this._target = target;
        this.target = target;
    }
    resetVelocity() {
        this.velocity = new Vector3_1.Vector3(0, 0, 0);
    }
    /**
     * @description updates the controller
     */
    update(delta, updateController) {
        this.delta = delta;
        // this.resetVelocity(); //reset on every tick
        if (this.translateXDirection || this.translateYDirection || this.translateZDirection || this.translateXYZDirection)
            return this.handleTranslateXYZDirection();
        // if(this.translateXDirection) return this.handleTranslateXDirection();
        // if(this.translateYDirection) return this.handleTranslateYDirection();
        // if(this.translateZDirection) return this.handleTranslateZDirection();
        // if(this.translateXYZDirection) return this.handleTranslateXYZDirection();
    }
    updateCameraControllerByMovementVector() {
        if (!this.cameraController)
            return;
        this.cameraController.camera.position.copy(this.desiredMovementVector);
        // TranslationController.translateControls(this.cameraController, this.desiredMovementVector, this);
    }
    updateCameraControllerByVelocityVector() {
        if (!this.cameraController)
            return;
        this.cameraController.camera.position.add(this.desiredVelocityVector);
        // TranslationController.translateControls(this.cameraController, this.desiredMovementVector, this);
    }
}
exports.BaseController = BaseController;
