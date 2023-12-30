import { Vector3 } from 'three/src/math/Vector3';
/**
 * @description calculate velocity based on direction vector
 * @param direction
 * @returns velocity
 */
export declare const calculateVelocity: ({ direction, delta, SPEED_UP_CONSTANT, speedFactor }: {
    direction: Vector3;
    SPEED_UP_CONSTANT: number;
    delta: number;
    speedFactor: number;
}) => Vector3;
