"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapierColliderController = void 0;
const controller_1 = require("./controller");
const Vector3_1 = require("three/src/math/Vector3");
const Quaternion_1 = require("three/src/math/Quaternion");
class RapierColliderController extends controller_1.BaseController {
    constructor(world, offset, options) {
        super({ target: null, options });
        this.collider = null;
        this.toi = 0;
        this.position = new Vector3_1.Vector3(0, 0, 0);
        this.rotation = new Quaternion_1.Quaternion(0, 0, 0, 0);
        this.velocity = new Vector3_1.Vector3(0, 0, 0);
        this.world = world;
        this.offset = offset;
        this.controller = this.initCharacterController();
    }
    /**
     * @description sets up the character controller
     * @returns CharacterController
     */
    initCharacterController() {
        return this.world.createCharacterController(this.offset);
    }
    /**
     *
     * @description compute movements of collider
     * @returns number of collisions
     */
    computeMovement({ collider, desiredMovementVector, filterFlags, filterGroups, filterPredicate }) {
        let c = collider || this.collider;
        if (!c)
            return null;
        if (!desiredMovementVector)
            return null;
        this.controller.computeColliderMovement(c, desiredMovementVector, filterFlags, filterGroups, filterPredicate);
        return this.controller.numComputedCollisions();
    }
    /**
     * @description get computed collisions
     * @returns Array of collisions
     */
    getComputedCollisions() {
        let collisions = [];
        for (let i = 0; i < this.controller.numComputedCollisions(); i++) {
            let collision = this.controller.computedCollision(i);
            collisions.push(collision);
        }
        return collisions;
    }
    /**
     * @description wether or not collision is imminent
     */
    isCollisionImminent() {
        let is_collision_imminent = false;
        for (let i = 0; i < this.controller.numComputedCollisions(); i++) {
            let collision = this.controller.computedCollision(i);
            if (collision.toi <= this.toi)
                is_collision_imminent = true;
        }
        return is_collision_imminent;
    }
    /**
     * @description get corrected movement
     */
    getCorrectedMovement() {
        return this.controller.computedMovement();
    }
    /**
     * @param collider
     * @param updateTargetPosition Wether or not to update the target position. This forces the controller to try and update target position even if the collider is null
     * @description sets the collider
     */
    setCollider(collider, updateTargetPosition) {
        this.collider = collider;
        if (!this.target && !updateTargetPosition)
            return;
        const { x, y, z } = this.collider.translation();
        this.desiredMovementVector = new Vector3_1.Vector3(z, y, z);
        this.updateTargetPosition();
    }
    /** @description handle XYZ movements */
    handleTranslateXYZDirection() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        if (!this.collider)
            return;
        this.setColliderQuaternionFromCameraController();
        const computedTranslation = controller_1.BaseController.computeTranslationXYZDirection(this);
        if (!computedTranslation)
            return;
        const { position: desiredMovementVector, velocity: desiredVelocityVector } = computedTranslation;
        const shape = (_a = this.collider) === null || _a === void 0 ? void 0 : _a.shape;
        const shapePosition = (_b = this.collider) === null || _b === void 0 ? void 0 : _b.translation();
        const shapeRotation = (_c = this.collider) === null || _c === void 0 ? void 0 : _c.rotation();
        const shapeVelocity = desiredVelocityVector.clone();
        let collisions = [];
        let hit = this.world.castShape(shapePosition, shapeRotation, shapeVelocity, shape, this.toi, false, undefined, (_d = this.options) === null || _d === void 0 ? void 0 : _d.filterGroups, this.collider);
        if (hit != null) {
            collisions.push(hit);
        }
        let is_collision_imminent = false;
        let collision_imminent = null;
        for (const collision of collisions) {
            if (collision.toi <= this.toi)
                is_collision_imminent = true;
            if (is_collision_imminent)
                collision_imminent = collision;
            if (is_collision_imminent)
                break;
        }
        if (is_collision_imminent && collision_imminent && (collision_imminent === null || collision_imminent === void 0 ? void 0 : collision_imminent.toi) <= this.toi) {
            this.desiredVelocityVector = new Vector3_1.Vector3(0, 0, 0);
        }
        else {
            // this.desiredMovementVector = this.isCollisionImminent({ toi: this.offset }) ? new Vector3(correctedMovement.x, correctedMovement.y, correctedMovement.z) : desiredMovementVector;
            this.desiredMovementVector = desiredMovementVector;
            /** carry out corrections based on max an min translation options */
            this.desiredMovementVector.y = Math.min(Math.max(this.desiredMovementVector.y, (_g = (_f = (_e = this.options) === null || _e === void 0 ? void 0 : _e.translation) === null || _f === void 0 ? void 0 : _f.max) === null || _g === void 0 ? void 0 : _g.y), (_k = (_j = (_h = this.options) === null || _h === void 0 ? void 0 : _h.translation) === null || _j === void 0 ? void 0 : _j.max) === null || _k === void 0 ? void 0 : _k.y);
            this.desiredVelocityVector = desiredVelocityVector;
            this.desiredVelocityVector.y = Math.min(Math.max(this.desiredMovementVector.y, (_o = (_m = (_l = this.options) === null || _l === void 0 ? void 0 : _l.translation) === null || _m === void 0 ? void 0 : _m.max) === null || _o === void 0 ? void 0 : _o.y), (_r = (_q = (_p = this.options) === null || _p === void 0 ? void 0 : _p.translation) === null || _q === void 0 ? void 0 : _q.max) === null || _r === void 0 ? void 0 : _r.y);
        }
        /** update computational values */
        this.updateColliderPosition();
        this.updateTargetPosition();
        this.updateTargetQuaternion();
        /** update internal values */
        this._updateColliderPosition();
        this._updateColliderQuaternion();
        this._updateColliderVelocity();
    }
    /**
     * @description set max time to impact for collider
     */
    setToi(value) {
        this.toi = value;
    }
    /** set collider quartenion */
    setColliderQuaternionFromCameraController() {
        var _a, _b, _c, _d;
        if (!this.collider)
            return;
        if (!this.cameraController)
            return;
        this.collider.setRotation({ x: (_a = this.cameraController) === null || _a === void 0 ? void 0 : _a.camera.quaternion.x, y: (_b = this.cameraController) === null || _b === void 0 ? void 0 : _b.camera.quaternion.y, z: (_c = this.cameraController) === null || _c === void 0 ? void 0 : _c.camera.quaternion.z, w: (_d = this.cameraController) === null || _d === void 0 ? void 0 : _d.camera.quaternion.w });
    }
    updateColliderPosition() {
        if (this.collider)
            this.collider.setTranslation(this.desiredMovementVector);
    }
    updateColliderPositionFromVelocity() {
        if (!this.collider)
            return;
        const { x, y, z } = this.collider.translation();
        const colliderVec3 = new Vector3_1.Vector3(x, y, z);
        colliderVec3.add(this.desiredVelocityVector);
        this.collider.setTranslation(colliderVec3);
    }
    _updateColliderPosition() {
        if (!this.collider)
            return;
        this.position.copy(this.desiredMovementVector);
    }
    _updateColliderQuaternion() {
        if (!this.collider)
            return;
        const { x, y, z, w } = this.collider.rotation();
        this.rotation.copy(new Quaternion_1.Quaternion(x, y, z, w));
    }
    _updateColliderVelocity() {
        if (!this.collider)
            return;
        this.velocity.copy(this.desiredVelocityVector);
    }
}
exports.RapierColliderController = RapierColliderController;
//# sourceMappingURL=rapier-character-controller.js.map