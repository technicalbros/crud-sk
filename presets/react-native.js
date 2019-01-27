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
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var URLSearchParams = require("url-search-params");
var isFile = function (value) {
    if (value.uri && value.name && value.type) {
        return true;
    }
    else {
        return false;
    }
};
var mergeData = function (formData, data, key) {
    if (_.isObject(data) && !isFile(data)) {
        _.each(data, function (value, _key) {
            var name = key ? key + "[" + _key + "]" : _key;
            mergeData(formData, value, name);
        });
    }
    else if (key && data !== undefined) {
        formData.append(key, (data !== false && !data) ? "" : data);
    }
};
FormData.prototype.merge = function (data) {
    mergeData(this, data);
    return this;
};
URLSearchParams.prototype.merge = function (data) {
    mergeData(this, data);
    return this;
};
function fetchRequest(config) {
    var callbacks = config.callbacks;
    callbacks.sendRequest = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var config = __assign({ checkDataType: true, showProgress: true, notify: true }, _this.$config, options);
            var data = config.data, callbacks = config.callbacks, _a = config.method, method = _a === void 0 ? "get" : _a, baseUrl = config.baseUrl, url = config.url, redirectTo = config.redirectTo, showProgress = config.showProgress, _b = config.prefix, prefix = _b === void 0 ? "" : _b, _c = config.suffix, suffix = _c === void 0 ? "" : _c, _d = config.extension, extension = _d === void 0 ? "" : _d, checkDataType = config.checkDataType, ajaxOptions = config.ajaxOptions, reloadPage = config.reload;
            var loading = callbacks.loading, reload = callbacks.reload, redirect = callbacks.redirect, checkSuccess = callbacks.checkSuccess, notify = callbacks.notify;
            var requestOptions = __assign({}, ajaxOptions, { method: method, credentials: "include" });
            var _url = baseUrl + prefix + url + suffix + extension;
            if (!_.isEmpty(data)) {
                if (method.toLowerCase() === 'post') {
                    if (!(data instanceof FormData)) {
                        console.log('formData', data);
                        var formData = new FormData().merge(data);
                        requestOptions.body = formData;
                    }
                }
                else {
                    var params = new URLSearchParams().merge(data);
                    _url += "?" + params;
                }
                if (requestOptions.body instanceof FormData) {
                    requestOptions.headers = {
                        'Content-Type': 'multipart/form-data',
                    };
                }
            }
            _this.toggleLoading(true);
            fetch(_url, requestOptions).then(function (data) {
                data.json().then(function (response) {
                    showProgress && loading && _this.toggleLoading(false);
                    if (checkSuccess) {
                        if (checkDataType && checkSuccess(response)) {
                            resolve(response);
                            // @ts-ignore
                            redirectTo && _this.redirect(redirectTo);
                            reloadPage && _this.reload();
                        }
                        else if (!checkDataType) {
                            resolve(response);
                        }
                        else {
                            reject(response);
                        }
                        _this.notify({
                            type: response.type,
                            message: response.message
                        });
                    }
                    else {
                        resolve(response);
                    }
                }).catch(function (e) {
                    showProgress && loading && _this.toggleLoading(false);
                    notify && _this.notify({
                        type: "error",
                        message: "Something went wrong"
                    });
                });
            }, function (error) {
                showProgress && loading && _this.toggleLoading(false);
                reject(error);
            });
        });
    };
    return config;
}
exports.default = fetchRequest;
