"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateVelocity = void 0;
const Vector3_1 = require("three/src/math/Vector3");
/**
 * @description calculate velocity based on direction vector
 * @param direction
 * @returns velocity
 */
const calculateVelocity = ({ direction, delta, SPEED_UP_CONSTANT }) => {
    let VAL_ENUM = [1, -1];
    let velocity = new Vector3_1.Vector3(0, 0, 0);
    for (const [key, index] of Object.keys(direction)) {
        if (VAL_ENUM.includes(direction[key])) {
            velocity[key] -= direction[key] * SPEED_UP_CONSTANT * delta;
        }
    }
    return velocity;
};
exports.calculateVelocity = calculateVelocity;
