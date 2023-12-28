"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapierColliderController = exports.TranslationController = exports.CameraController = void 0;
const camera_controller_1 = require("./lib/camera-controller");
Object.defineProperty(exports, "CameraController", { enumerable: true, get: function () { return camera_controller_1.CameraController; } });
const translation_controller_1 = require("./lib/translation-controller");
Object.defineProperty(exports, "TranslationController", { enumerable: true, get: function () { return translation_controller_1.TranslationController; } });
const controllers_1 = require("./lib/controllers");
Object.defineProperty(exports, "RapierColliderController", { enumerable: true, get: function () { return controllers_1.RapierColliderController; } });
__exportStar(require("./utils/options"), exports);
__exportStar(require("./utils/helpers"), exports);
__exportStar(require("./utils/constants"), exports);
//# sourceMappingURL=index.js.map