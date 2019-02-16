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
            var config = __assign({}, _this.defaultConfig, options);
            var data = config.data, url = config.url, _a = config.method, method = _a === void 0 ? "get" : _a, _b = config.baseUrl, baseUrl = _b === void 0 ? "" : _b, _c = config.prefix, prefix = _c === void 0 ? "" : _c, _d = config.suffix, suffix = _d === void 0 ? "" : _d, _e = config.extension, extension = _e === void 0 ? "" : _e, _f = config.redirectTo, redirectTo = _f === void 0 ? false : _f, _g = config.showProgress, showProgress = _g === void 0 ? true : _g, _h = config.checkDataType, checkDataType = _h === void 0 ? true : _h, _j = config.notify, notify = _j === void 0 ? true : _j, ajaxOptions = config.ajaxOptions, _k = config.reload, reloadPage = _k === void 0 ? false : _k;
            var requestOptions = __assign({}, ajaxOptions, { method: method, credentials: "include" });
            var _url = baseUrl + prefix + url + suffix + extension;
            if (!_.isEmpty(data)) {
                if (method.toLowerCase() === 'post') {
                    if (!(data instanceof FormData)) {
                        requestOptions.body = new FormData().merge(data);
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
            fetch(_url, requestOptions).then(function (response) {
                return new Promise(function (resolve, reject) {
                    if (response.status === 200) {
                        resolve(response.text());
                    }
                    else {
                        reject(response);
                    }
                });
            }).then(function (responseText) {
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
                    if (!checkDataType || _this.call("checkSuccess", [data])) {
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
            }, function (error) {
                showProgress && _this.toggleLoading(false);
                notify && _this.notify({
                    type: "error",
                    message: "Something went wrong"
                });
                reject(error);
            });
        });
    };
    return config;
}
exports.default = fetchRequest;
