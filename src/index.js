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
Object.defineProperty(exports, "__esModule", { value: true });
var CrudRequest = /** @class */ (function () {
    function CrudRequest() {
        this.$config = {
            baseUrl: "",
            callbacks: {
                notify: function (data) { return new Promise(function (resolve, reject) {
                    alert(data.message);
                }); },
                checkSuccess: function (data) {
                    if (data.type === 'success') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        };
    }
    CrudRequest.prototype.config = function (callback) {
        this.$config = callback.apply(this, [__assign({}, this.$config)]);
        return this;
    };
    CrudRequest.prototype.send = function (options) {
        return this.$config.callbacks.sendRequest.apply(this, [options]);
    };
    CrudRequest.prototype.create = function (url, data, options) {
        return this.send(__assign({ method: "post", prefix: "create/" }, options, { url: url, data: data }));
    };
    CrudRequest.prototype.update = function (url, data, options) {
        return this.send(__assign({ method: "post", prefix: "update/" }, options, { url: url, data: data }));
    };
    CrudRequest.prototype.delete = function (url, data, options) {
        return this.send(__assign({ method: "post", prefix: "delete/" }, options, { url: url, data: data }));
    };
    CrudRequest.prototype.retrieve = function (url, data, options) {
        return this.send(__assign({ method: "get", prefix: "retrieve/", checkDataType: false, notify: false }, options, { url: url, data: data }));
    };
    CrudRequest.prototype.alert = function (options) {
        return this.$config.callbacks.alert.apply(this, [options]);
    };
    CrudRequest.prototype.confirm = function (options) {
        return this.$config.callbacks.confirm.apply(this, [options]);
    };
    CrudRequest.prototype.prompt = function (options) {
        return this.$config.callbacks.prompt.apply(this, [options]);
    };
    CrudRequest.prototype.dialog = function (name, options) {
        return this.$config.callbacks.dialog.apply(this, [name, options]);
    };
    CrudRequest.prototype.notify = function (options) {
        return this.$config.callbacks.notify.apply(this, [options]);
    };
    CrudRequest.prototype.chooseFile = function (options) {
        if (options === void 0) { options = {}; }
        return this.$config.callbacks.chooseFile.apply(this, [options]);
    };
    return CrudRequest;
}());
exports.CrudRequest = CrudRequest;
