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
        var _this = this;
        this.defaultConfig = {
            callbacks: {
                checkSuccess: function (_a) {
                    var type = (_a === void 0 ? {} : _a).type;
                    return type === 'success';
                },
                createRequest: function (url, data, options) { return _this.send(__assign({ method: "post", prefix: "create/" }, options, { url: url, data: data })); },
                updateRequest: function (url, data, options) { return _this.send(__assign({ method: "post", prefix: "update/" }, options, { url: url, data: data })); },
                deleteRequest: function (url, data, options) { return _this.send(__assign({ method: "post", prefix: "delete/" }, options, { url: url, data: data })); },
                retrieveRequest: function (url, data, options) { return _this.send(__assign({ method: "get", prefix: "retrieve/", checkDataType: false, notify: false }, options, { url: url, data: data })); }
            }
        };
    }
    CrudRequest.prototype.call = function (callbackName, args) {
        if (args === void 0) { args = []; }
        var callback = this.defaultConfig.callbacks[callbackName];
        if (callback) {
            return callback.apply(this, args);
        }
        else {
            console.warn("No callback defined for '" + callbackName + "'");
        }
    };
    CrudRequest.prototype.config = function (callback) {
        var config = __assign({}, this.defaultConfig);
        callback.apply(this, [config]);
        this.defaultConfig = config;
        return this;
    };
    CrudRequest.prototype.send = function (options) {
        return this.call('sendRequest', [options]);
    };
    CrudRequest.prototype.create = function (url, data, options) {
        return this.call("createRequest", [url, data, options]);
    };
    CrudRequest.prototype.retrieve = function (url, data, options) {
        return this.call("retrieveRequest", [url, data, options]);
    };
    CrudRequest.prototype.update = function (url, data, options) {
        return this.call("updateRequest", [url, data, options]);
    };
    CrudRequest.prototype.delete = function (url, data, options) {
        return this.call("deleteRequest", [url, data, options]);
    };
    CrudRequest.prototype.redirect = function (to, options) {
        this.call("redirect", [to, options]);
    };
    CrudRequest.prototype.reload = function () {
        this.call("confirm");
    };
    CrudRequest.prototype.alert = function (options) {
        return this.call("alert", [options]);
    };
    CrudRequest.prototype.confirm = function (options) {
        return this.call("confirm", [options]);
    };
    CrudRequest.prototype.prompt = function (options) {
        return this.call("prompt", [options]);
    };
    CrudRequest.prototype.dialog = function (name, options) {
        return this.call("dialog", [options]);
    };
    CrudRequest.prototype.notify = function (options) {
        return this.call("notify", [options]);
    };
    CrudRequest.prototype.toggleLoading = function (value) {
        return this.call("loading", [value]);
    };
    CrudRequest.prototype.chooseFile = function (options) {
        if (options === void 0) { options = {}; }
        return this.call("chooseFile", [options]);
    };
    return CrudRequest;
}());
exports.CrudRequest = CrudRequest;
