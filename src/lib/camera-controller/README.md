# Camera Controller

## Introduction

This module is designed to assist with managing multiple cameras and their respective controls within a THREEJS Scene.

## Features

- Change Cameras: Easily switch between different cameras in your scene.
- Switch Controls: Switch between different control schemes attached to the active camera.


## Installation


## Usage
1. Instantiate your camera controller and pass THREEJS Scene an argument

```js
import { CameraController } from 'threejs-addons/build/lib/camera-controller';

let scene = new THREE.Scene(); //create a THREEJS Scene

/** Create an instance of the camera controller */
const cameraController = new CameraController({ scene: scene });

```

2. Configure your camera controllers with all the cameras you need it to control.
`in the example below the cameras are coming from a gltf model already imported in the scene. However this can be a list of any camera you wish to provide to the controller.`

```js
import { ControlType } from 'threejs-addons/build/types';

for(let i = 0; i < gltf.cameras.length; i++){

    cameraController.configureController({
        camera: gltf.cameras[i],
        controls: [
            { type: ControlType.ORBIT_CONTROLS, options: { enabled: false }  }, //to avoid issues; make sure all controls are disabled by default
            { type: ControlType.POINTER_LOCK_CONTROLS, options: { }}
        ],
        domElement: canvasElement //replace with your active canvas element
        active: false
    });

}
```

3. Set your Active Controller

```js
const initialActiveControllerIndex = 0
cameraController.setActiveController(initialActiveControllerIndex);
```

4. Setup your event listerners and toggle cameras with your prefered key(s)

```js
window.addEventListener('keydown', (e) => {

    if(e.key === 'ArrowLeft'){
        cameraController.switchControlTypeNext(null);  // Switch Active Camera Controller's Control
    }

    if(e.key === 'ArrowRight'){
        cameraController.switchControlTypeNext(null);
    }

    if(e.key === 'c'){
        cameraController.switchControllerNext(null);   //Switch Camera Controller
    }

})
```

5. Use the Active Controller's Camera in your loop function

```js
function animate() {

    requestAnimationFrame(animate);

    if(!cameraController.activeController)return;
    
    viewer.renderer.render(viewer.scene, cameraController.activeController?.camera);
}
```

## Contributing
todo

## License
This project is licensed under the MIT License.