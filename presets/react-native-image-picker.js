"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_image_picker_1 = __importDefault(require("react-native-image-picker"));
function default_1($config) {
    $config.callbacks.chooseFile = function (options) { return new Promise(function (resolve, reject) {
        var options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        react_native_image_picker_1.default.showImagePicker(options, function (response) {
            if (response.didCancel || response.error) {
                reject(response);
            }
            else {
                resolve(__assign({}, response, { type: response.type || 'image/jpeg', url: response.uri, name: response.fileName }));
            }
        });
    }); };
    return $config;
}
exports.default = default_1;
