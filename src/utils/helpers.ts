import { Vector3 } from 'three/src/math/Vector3';

/**
 * @description calculate velocity based on direction vector
 * @param direction 
 * @returns velocity
 */
export const calculateVelocity = ( { direction, delta, SPEED_UP_CONSTANT, speedFactor }: {direction: Vector3, SPEED_UP_CONSTANT: number, delta: number, speedFactor: number }) => {
    let VAL_ENUM: (number)[] = [ 1, -1 ]
    let velocity = new Vector3(0, 0, 0);

    for(const [key, index] of Object.keys(direction)){
        if(VAL_ENUM.includes(direction[key as 'x' | 'y' | 'z'])){
           velocity[key as 'x' | 'y' | 'z'] -= direction[key as 'x' | 'y' | 'z'] * SPEED_UP_CONSTANT * delta * speedFactor;
        }
    }

    return velocity;
}