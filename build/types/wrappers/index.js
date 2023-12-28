"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointerLockControlsWrapper = exports.OrbitControlsWrapper = void 0;
const OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
const PointerLockControls_1 = require("three/examples/jsm/controls/PointerLockControls");
class OrbitControlsWrapper extends OrbitControls_1.OrbitControls {
    constructor(object, domElement) {
        super(object, domElement);
        this.userData = null;
    }
}
exports.OrbitControlsWrapper = OrbitControlsWrapper;
class PointerLockControlsWrapper extends PointerLockControls_1.PointerLockControls {
    constructor(object, domElement) {
        super(object, domElement);
        this.userData = null;
    }
}
exports.PointerLockControlsWrapper = PointerLockControlsWrapper;
