# ThreeJS-Addons

## Introduction
This project is a collection of ThreeJS Addons to speedup productivity when working with ThreeJS projects.
The Project comprises of the following:
- [Camera Controller](./src/docs/CCC.md): Easily switch between different cameras and their respective controls in your scene.
- [Rapier Collider Controller](./src/docs/RCC.md): Enable collision detection, allowing objects to stop on collision.
- [Translation Controller](./src/docs/TCC.md): Move Cameras, Objects, Colliders etc. in your scene.

## Installation

You can get the package via npm:

```bash
npm i --save @threejs-addons/threejs-addons
```

## Usage

To begin using the addons, simply import them into your project

```js
import {
    CameraController,
    RapierColliderController, 
    TranslationController,
 } from '@threejs-addons/threejs-addons';
import { utils } from '@threejs-addons/threejs-addons';

/** get default options for your class instances */
const { DEFAULT_OPTIONS }  = utils;

/** instantiate the camera controller class i.e CCC */
const CCC = new CameraController({ scene: scene }); //controller adds cameras to your scene


/** assuming your application requires collison detection for the controllers **/
/** we have implemented a Rapier collider controller  class or simply RCC */
const offset = 0.5;
const RCC = new RapierColliderController({ world: world as RAPIER.World, offset, options: DEFAULT_OPTIONS });


/** instantiate the translation controller class or simply TCC **/
const TCC = new TranslationController({ options: DEFAULT_OPTIONS });


/** somewhere in your code, you use the TCC to handle all translations */
TCC.setCCC(CCC);
TCC.set(RCC);


/** you may want to set up event listerners some where in your code*/

window.addEventListener('keydown', (e) => {

    if(e.key === 'w'){
        RCC.setTranslateZDirection(true, 1)
        // TCC.setTranslateZDirection(true, 1)
    }

    if(e.key === 's'){
        RCC.setTranslateZDirection(true, -1)
        // TCC.setTranslateZDirection(true, -1)
    }

    if(e.key === 'a'){
        RCC.setTranslateXDirection(true, 1);
        // TCC.setTranslateXDirection(true, 1)
    }
    

    if(e.key === 'd'){
        RCC.setTranslateXDirection(true, -1);
        // TCC.setTranslateXDirection(true, -1)
    }

    if(e.key === 'ArrowLeft'){
        CCC.switchControlTypeNext(null); //switch controls
    }

    if(e.key === 'ArrowRight'){
        CCC.switchControlTypeNext(null); //switch controls
    }

    if(e.key === 'c'){
        CCC.switchControllerNext(null);  //switch cameras          
    }
})

window.addEventListener('keyup', (e) => {
    if(e.key === 'w'){
        RCC.setTranslateZDirection(false, null)
        // TCC.setTranslateZDirection(false, null)
    }

    if(e.key === 's'){
        RCC.setTranslateZDirection(false, null)
        // TCC.setTranslateZDirection(false, null)
    }

    if(e.key === 'a'){
        RCC.setTranslateXDirection(false, null)
        // TCC.setTranslateXDirection(false, null)
    }

    if(e.key === 'd'){
        RCC.setTranslateXDirection(false, null)
        // TCC.setTranslateXDirection(false, null)
    }
})


function animate(){
    /** asuming you have some animate loop in your code*/
    TCC.update(delta, true);
}



```
## API Documentation

The controllers are documented in the following links:

1. [Camera Controller Class(CCC)](./src/docs/CCC.md) .
2. [Rapier Collider Controller Class(RCC)](./src/docs/RCC.md) .
3. [Translation Controller Class(TCC)](./src/docs/TCC.md) .



## Contributing
@todo

## License

This project is licensed under the [MIT License](./LICENSE).