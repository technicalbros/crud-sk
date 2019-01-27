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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var jquery_1 = __importDefault(require("jquery"));
var mergeData = function (formData, data, key) {
    if (_.isObject(data) && !(data instanceof File) && !(data instanceof Blob)) {
        _.each(data, function (value, _key) {
            var name = key ? key + "[" + _key + "]" : _key;
            mergeData(formData, value, name);
        });
    }
    else if (key && data !== undefined) {
        formData.append(key, data || '');
    }
};
FormData.prototype.merge = function (data) {
    mergeData(this, data);
    return this;
};
function ajaxRequest(config) {
    var _this = this;
    var callbacks = config.callbacks;
    callbacks.sendRequest = function (options) {
        var config = __assign({ checkDataType: true, showProgress: true, notify: true }, _this.$config, options);
        var data = config.data, callbacks = config.callbacks, _a = config.method, method = _a === void 0 ? "get" : _a, baseUrl = config.baseUrl, url = config.url, redirectTo = config.redirectTo, showProgress = config.showProgress, _b = config.prefix, prefix = _b === void 0 ? "" : _b, _c = config.suffix, suffix = _c === void 0 ? "" : _c, _d = config.extension, extension = _d === void 0 ? "" : _d, checkDataType = config.checkDataType, notify = config.notify;
        var reloadPage = config.reload;
        var loading = callbacks.loading, reload = callbacks.reload, redirect = callbacks.redirect, checkSuccess = callbacks.checkSuccess, notifyCallback = callbacks.notify;
        return new Promise(function (resolve, reject) {
            var ajaxOptions = __assign({}, config.ajaxOptions, { success: function (responseText) {
                    var response;
                    try {
                        response = JSON.parse(responseText);
                    }
                    catch (e) {
                        response = responseText;
                    }
                    showProgress && _this.toggleLoading(false);
                    if (method.toLowerCase() === 'get') {
                        resolve(response);
                    }
                    else {
                        if (!checkDataType || (checkDataType && checkSuccess(response))) {
                            resolve(response);
                        }
                        else {
                            reject(response);
                        }
                        notify && _this.notify({
                            type: response.type,
                            message: response.message
                        });
                    }
                }, error: function (error) {
                    showProgress && _this.toggleLoading(false);
                    notify && _this.notify({
                        type: "error",
                        message: error.status + ": " + error.statusText
                    });
                    reject(error);
                } });
            ajaxOptions.type = method;
            ajaxOptions.url = baseUrl + prefix + url + suffix + extension;
            if (method.toLowerCase() === 'post' && !(data instanceof FormData)) {
                ajaxOptions.data = new FormData().merge(data);
            }
            else {
                ajaxOptions.data = data;
            }
            if (ajaxOptions.data instanceof FormData) {
                ajaxOptions.type = "post";
                ajaxOptions.cache = false;
                ajaxOptions.processData = false;
                ajaxOptions.contentType = false;
            }
            _this.toggleLoading(true);
            jquery_1.default.ajax(ajaxOptions);
        }).then(function (data) {
            if (redirectTo && redirect) {
                _this.redirect(redirectTo);
            }
            else if (reloadPage && reload) {
                _this.reload();
            }
            return data;
        });
    };
    return config;
}
exports.ajaxRequest = ajaxRequest;
exports.default = ajaxRequest;
