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
var jquery_1 = require("jquery");
var CrudRequest = /** @class */ (function () {
    function CrudRequest() {
        this.$config = {
            baseUrl: "",
            callbacks: {
                notify: function (data) {
                    alert(data.message);
                },
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
    CrudRequest.prototype.send = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var config = __assign({}, _this.$config, options);
            var data = config.data, callbacks = config.callbacks, method = config.method, baseUrl = config.baseUrl, url = config.url, redirectTo = config.redirectTo, showProgress = config.showProgress, prefix = config.prefix;
            var reloadPage = config.reload;
            var loading = callbacks.loading, reload = callbacks.reload, redirect = callbacks.redirect, checkSuccess = callbacks.checkSuccess, notify = callbacks.notify;
            var ajaxOptions = __assign({}, config.ajaxOptions, { success: function (response) {
                    showProgress && loading && loading(false);
                    if (method.toLowerCase() === 'get' || !checkSuccess) {
                        resolve(response);
                    }
                    else if (checkSuccess) {
                        if (checkSuccess(response)) {
                            resolve(response);
                            // @ts-ignore
                            (redirectTo && redirect && redirect(redirectTo, response)) || (reloadPage && reload && reload());
                        }
                        else {
                            reject(response);
                        }
                        var notification = {
                            type: response.type,
                            message: response.message
                        };
                        config.notify && notify && notify(notification);
                    }
                }, error: function (error) {
                    showProgress && loading && loading(false);
                    var notification = {
                        type: "error"
                    };
                    notification.message = error.status + ": " + error.statusText;
                    config.notify && notify && notify(notification);
                    reject(error);
                } });
            ajaxOptions.type = method;
            ajaxOptions.url = baseUrl + prefix + url;
            ajaxOptions.data = data;
            showProgress && loading && loading(true);
            jquery_1.ajax(ajaxOptions);
        });
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
        return this.send(__assign({ method: "get", prefix: "retrieve/" }, options, { url: url, data: data }));
    };
    CrudRequest.prototype.alert = function (options) {
        return this.$config.callbacks.alert(options);
    };
    CrudRequest.prototype.confirm = function (options) {
        return this.$config.callbacks.confirm(options);
    };
    CrudRequest.prototype.prompt = function (options) {
        return this.$config.callbacks.prompt(options);
    };
    CrudRequest.prototype.dialog = function (name, options) {
        return this.$config.callbacks.dialog(name, options);
    };
    CrudRequest.prototype.notify = function (options) {
        this.$config.callbacks.notify(options);
    };
    return CrudRequest;
}());
exports.CrudRequest = CrudRequest;
