"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapierColliderController = void 0;
const Base_1 = require("./Base");
const Vector3_1 = require("three/src/math/Vector3");
const Quaternion_1 = require("three/src/math/Quaternion");
class RapierColliderController extends Base_1.BaseController {
    constructor({ world, offset, options, RCC, CCC }) {
        super({ target: null, options, RCC, CCC });
        this.collider = null;
        this.toi = 0;
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        if (!this.collider)
            return;
        this.setColliderQuaternionFromCameraController();
        const { x: cx, y: cy, z: cz } = this.collider.translation();
        const computedTranslation = Base_1.BaseController.computeTranslationXYZDirection({
            SPEED_UP_CONSTANT: this.SPEED_UP_CONSTANT,
            delta: this.delta,
            direction: this.direction,
            translation: new Vector3_1.Vector3(cx, cy, cz),
            cameraController: (_a = this.CCC) === null || _a === void 0 ? void 0 : _a.activeController
        });
        if (!computedTranslation)
            return;
        const { position: desiredMovementVector, velocity: desiredVelocityVector } = computedTranslation;
        const shape = (_b = this.collider) === null || _b === void 0 ? void 0 : _b.shape;
        const shapePosition = (_c = this.collider) === null || _c === void 0 ? void 0 : _c.translation();
        const shapeRotation = (_d = this.collider) === null || _d === void 0 ? void 0 : _d.rotation();
        const shapeVelocity = desiredVelocityVector.clone();
        let collisions = [];
        let hit = this.world.castShape(shapePosition, shapeRotation, shapeVelocity, shape, this.toi, false, undefined, (_e = this.options) === null || _e === void 0 ? void 0 : _e.filterGroups, this.collider);
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
            this.desiredMovementVector = desiredMovementVector;
            /** carry out corrections based on max an min translation options */
            this.desiredMovementVector.y = Math.min(Math.max(this.desiredMovementVector.y, (_h = (_g = (_f = this.options) === null || _f === void 0 ? void 0 : _f.translation) === null || _g === void 0 ? void 0 : _g.max) === null || _h === void 0 ? void 0 : _h.y), (_l = (_k = (_j = this.options) === null || _j === void 0 ? void 0 : _j.translation) === null || _k === void 0 ? void 0 : _k.max) === null || _l === void 0 ? void 0 : _l.y);
            this.desiredVelocityVector = desiredVelocityVector;
            this.desiredVelocityVector.y = Math.min(Math.max(this.desiredMovementVector.y, (_p = (_o = (_m = this.options) === null || _m === void 0 ? void 0 : _m.translation) === null || _o === void 0 ? void 0 : _o.max) === null || _p === void 0 ? void 0 : _p.y), (_s = (_r = (_q = this.options) === null || _q === void 0 ? void 0 : _q.translation) === null || _r === void 0 ? void 0 : _r.max) === null || _s === void 0 ? void 0 : _s.y);
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
    setToi(value) {
        this.toi = value;
    }
    /** set collider quartenion */
    setColliderQuaternionFromCameraController() {
        var _a, _b, _c, _d, _e;
        if (!this.collider)
            return;
        if (!((_a = this.CCC) === null || _a === void 0 ? void 0 : _a.activeController))
            return;
        this.collider.setRotation({ x: (_b = this.CCC.activeController) === null || _b === void 0 ? void 0 : _b.camera.quaternion.x, y: (_c = this.CCC.activeController) === null || _c === void 0 ? void 0 : _c.camera.quaternion.y, z: (_d = this.CCC.activeController) === null || _d === void 0 ? void 0 : _d.camera.quaternion.z, w: (_e = this.CCC.activeController) === null || _e === void 0 ? void 0 : _e.camera.quaternion.w });
    }
    updateColliderPosition() {
        if (this.collider)
            this.collider.setTranslation(this.desiredMovementVector);
    }
    /** update internal this.position value */
    _updateColliderPosition() {
        if (!this.collider)
            return;
        this.position.copy(this.desiredMovementVector);
    }
    /** update internal this.rotation value */
    _updateColliderQuaternion() {
        if (!this.collider)
            return;
        const { x, y, z, w } = this.collider.rotation();
        this.rotation.copy(new Quaternion_1.Quaternion(x, y, z, w));
    }
    /** update internal this.velocity */
    _updateColliderVelocity() {
        if (!this.collider)
            return;
        this.velocity.copy(this.desiredVelocityVector);
    }
}
exports.RapierColliderController = RapierColliderController;
//# sourceMappingURL=rapier-character-controller.js.map