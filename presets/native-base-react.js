"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_base_1 = require("native-base");
function notify($config) {
    $config.callbacks.notify = function (data) { return new Promise(function (resolve) {
        native_base_1.Toast.show({
            text: data.message,
            buttonText: "Hide",
            type: data.type === "success" ? "success" : "danger",
            onClose: resolve
        });
    }); };
    return $config;
}
exports.notify = notify;
