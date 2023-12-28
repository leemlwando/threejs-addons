"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraController = void 0;
const Vector3_1 = require("three/src/math/Vector3");
const MathUtils_1 = require("three/src/math/MathUtils");
const types_1 = require("../../types");
const wrappers_1 = require("../../wrappers");
/**
 * @description CameraController class for managing camera and its respective controls.
 */
class CameraController {
    constructor(args) {
        this.controllers = [];
        this.activeController = null;
        /**confgurations */
        this.loopControllerIndex = true;
        /** track controllers */
        this.currentControllerIndex = 0;
        this.previousControllerIndex = 0;
        /** track controls */
        this.currentControlTypeIndex = 0;
        this.previousControlTypeIndex = 0;
        this.loopControlTypeIndex = true;
        /** scene */
        this.scene = null;
        if (args.scene !== null) {
            this.scene = args.scene;
        }
    }
    /** switch controllers */
    switchControllerNext(index) {
        this.previousControllerIndex = this.currentControllerIndex;
        this.currentControllerIndex = index ? index : this.currentControllerIndex + 1;
        const activeControlType = this.getCurrentActiveControlType();
        if (!activeControlType)
            return null;
        if (this.currentControllerIndex > this.controllers.length - 1) {
            if (index)
                throw new Error(`[CameraController] index ${index} is out of range`);
            if (!this.loopControllerIndex)
                return this.currentControllerIndex;
            this.currentControllerIndex = 0;
        }
        /** disable previous controlls */
        this.disableControlsByControllerIndex(this.previousControllerIndex);
        /** enable only controller on active index */
        this.controllers.forEach((controller, index) => controller.active = index === this.currentControllerIndex);
        this.activeController = this.controllers[this.currentControllerIndex];
        /** enable active controlls */
        this.enableActiveControllerControl(activeControlType);
        return this.currentControllerIndex;
    }
    /** toggle controls */
    switchControlTypeNext(index) {
        this.previousControlTypeIndex = this.currentControlTypeIndex;
        this.currentControlTypeIndex = index ? index : this.currentControlTypeIndex + 1;
        if ((this.currentControlTypeIndex) > this.controllers[this.currentControllerIndex].controls.length - 1) {
            if (index !== null)
                throw new Error(`[CameraController] index ${index} is out of range`);
            if (!this.loopControlTypeIndex)
                return this.currentControlTypeIndex;
            this.currentControlTypeIndex = 0;
        }
        this.toggleControlTypeByIndex(this.previousControlTypeIndex, this.currentControlTypeIndex);
        return this.currentControlTypeIndex;
    }
    /** configure each controller to add to the controllers list */
    configureController(args) {
        if (!args)
            throw new Error('no options passed to configure');
        const controls = [];
        const camera = args.camera;
        /** add camera to scene */
        if (this.scene !== null) {
            this.scene.add(camera);
        }
        /** configure camera */
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.fov = 75;
        camera.updateProjectionMatrix();
        for (const control of args.controls) {
            if (control.type === types_1.ControlType.ORBIT_CONTROLS) {
                const orbitControls = new wrappers_1.OrbitControlsWrapper(camera, args.domElement);
                for (const option in control.options) {
                    orbitControls[option] = control.options[option];
                }
                orbitControls.userData = { uuid: (0, MathUtils_1.generateUUID)(), type: types_1.ControlType.ORBIT_CONTROLS, active: false };
                controls.push(orbitControls);
            }
            if (control.type === types_1.ControlType.POINTER_LOCK_CONTROLS) {
                const pointerControls = new wrappers_1.PointerLockControlsWrapper(camera, args.domElement);
                for (const option in control.options) {
                    pointerControls[option] = control.options[option];
                }
                pointerControls.userData = { uuid: (0, MathUtils_1.generateUUID)(), type: types_1.ControlType.POINTER_LOCK_CONTROLS, active: false };
                controls.push(pointerControls);
            }
        }
        const controller = {
            uuid: (0, MathUtils_1.generateUUID)(),
            camera,
            controls,
            active: args.active,
            disable: () => this.disableControlsByControllerIndex(this.currentControllerIndex),
            enable: () => this.enableActiveControllerControl(this.getCurrentActiveControlType())
        };
        this.controllers.push(controller);
    }
    /** set the active controller from your list of controllers */
    setActiveController(index, disableCurrentController) {
        var _a;
        if (index > this.controllers.length - 1)
            throw new Error(`index ${index} is out of range`);
        this.currentControllerIndex = index;
        this.controllers.forEach((controller, index) => controller.active = index === this.currentControllerIndex);
        let previouslyActiveController = this.activeController;
        if (!previouslyActiveController) {
            this.activeController = this.controllers[this.currentControllerIndex];
            this.activeController.camera.aspect = window.innerWidth / window.innerHeight;
            this.updateProjectionMatrix();
            this.activeController.controls.forEach((control) => {
                if (!control.userData)
                    return;
                if ('enabled' in control && control.userData.type === types_1.ControlType.ORBIT_CONTROLS) {
                    control.userData.active = true;
                    control.enabled = true;
                    control.update();
                }
            });
            return;
        }
        let activeControlType = this.getCurrentActiveControlType();
        this.activeController = this.controllers[this.currentControllerIndex];
        this.activeController.camera.aspect = window.innerWidth / window.innerHeight;
        this.updateProjectionMatrix();
        previouslyActiveController.controls.forEach((control) => {
            if (!control.userData)
                return;
            control.userData.active = false;
        });
        (_a = this.activeController) === null || _a === void 0 ? void 0 : _a.controls.forEach((control) => {
            if (!control.userData)
                return;
            control.userData.active = !activeControlType ? control.userData.type === types_1.ControlType.ORBIT_CONTROLS : control.userData.type === activeControlType;
        });
    }
    /** get active control type */
    getCurrentActiveControlType() {
        var _a;
        let activeControl = (_a = this.activeController) === null || _a === void 0 ? void 0 : _a.controls.find((control) => control.userData && control.userData.active === true);
        if (!(activeControl === null || activeControl === void 0 ? void 0 : activeControl.userData))
            return null;
        return activeControl === null || activeControl === void 0 ? void 0 : activeControl.userData.type;
    }
    /** reszie camera aspect ratio */
    onResize({ width, height }) {
        if (!this.activeController)
            return;
        this.activeController.camera.aspect = width / height;
        this.updateProjectionMatrix();
    }
    /** calls updateProjectionMatrix on current active camera */
    updateProjectionMatrix() {
        if (!this.activeController)
            return;
        let c = this.activeController.camera;
        c.updateProjectionMatrix();
    }
    /** disable previous controls */
    disableControlsByControllerIndex(index) {
        if (index === null || index === undefined)
            return;
        this.controllers[index].controls.forEach((control) => {
            if (!control.userData)
                return;
            control.userData.active = false;
            if ('update' in control && control.userData.type === types_1.ControlType.ORBIT_CONTROLS) {
                control.enabled = false;
                control.update();
            }
            if ('disconnect' in control && control.userData.type === types_1.ControlType.POINTER_LOCK_CONTROLS) {
                control.unlock();
                control.disconnect();
            }
        });
    }
    /** enable active controllers control by activeControlType */
    enableActiveControllerControl(activeControlType) {
        if (!this.activeController)
            return;
        this.activeController.controls.forEach(control => {
            if (!control.userData)
                return;
            control.userData.active = control.userData.type === activeControlType;
            if ('update' in control && control.userData.type === types_1.ControlType.ORBIT_CONTROLS && activeControlType === types_1.ControlType.ORBIT_CONTROLS) {
                control.enabled = true;
                control.update();
            }
            if ('lock' in control && control.userData.type === types_1.ControlType.POINTER_LOCK_CONTROLS && activeControlType === types_1.ControlType.POINTER_LOCK_CONTROLS) {
                control.connect();
                control.lock();
            }
        });
    }
    /** toggle Control By index */
    toggleControlTypeByIndex(previousControlTypeIndex, currentControlTypeIndex) {
        var _a;
        if (!this.activeController)
            return;
        if (previousControlTypeIndex === null || previousControlTypeIndex === undefined)
            return;
        let prevControl = this.activeController.controls[previousControlTypeIndex];
        if (!prevControl)
            return;
        if (!prevControl.userData)
            return;
        prevControl.userData.active = false;
        if ('update' in prevControl && (prevControl === null || prevControl === void 0 ? void 0 : prevControl.userData.type) === types_1.ControlType.ORBIT_CONTROLS) {
            prevControl.enabled = false;
            prevControl.update();
        }
        if ('unlock' in prevControl && (prevControl === null || prevControl === void 0 ? void 0 : prevControl.userData.type) === types_1.ControlType.POINTER_LOCK_CONTROLS) {
            prevControl.unlock();
            prevControl.disconnect();
        }
        let currControl = (_a = this.activeController) === null || _a === void 0 ? void 0 : _a.controls[currentControlTypeIndex];
        if (!currControl)
            return;
        if (!currControl.userData)
            return;
        currControl.userData.active = true;
        if ('update' in currControl && (currControl === null || currControl === void 0 ? void 0 : currControl.userData.type) === types_1.ControlType.ORBIT_CONTROLS) {
            /** get previous controls look direction */
            const lookdirection = new Vector3_1.Vector3();
            prevControl.getDirection(lookdirection);
            const lookAtPoint = new Vector3_1.Vector3().copy(this.activeController.camera.position).add(lookdirection);
            currControl.target.copy(lookAtPoint);
            currControl.enabled = true;
            currControl.update();
        }
        if ('lock' in currControl && (currControl === null || currControl === void 0 ? void 0 : currControl.userData.type) === types_1.ControlType.POINTER_LOCK_CONTROLS) {
            currControl.connect();
            currControl.lock();
        }
    }
}
exports.CameraController = CameraController;
//# sourceMappingURL=camera.js.map