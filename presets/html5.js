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
var isFile = function (value) { return (value instanceof File || value instanceof Blob); };
var mergeData = function (formData, data, key) {
    if (_.isObject(data) && !isFile(data)) {
        _.each(data, function (value, _key) {
            var name = key ? key + "[" + _key + "]" : _key;
            mergeData(formData, value, name);
        });
    }
    else if (key && data !== undefined) {
        // @ts-ignore
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
function fetchRequest($config) {
    $config.callbacks.sendRequest = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var config = __assign({ checkDataType: true, notify: true }, _this.$config, options);
            var data = config.data, callbacks = config.callbacks, _a = config.method, method = _a === void 0 ? "get" : _a, _b = config.baseUrl, baseUrl = _b === void 0 ? '' : _b, url = config.url, redirectTo = config.redirectTo, _c = config.showProgress, showProgress = _c === void 0 ? true : _c, _d = config.prefix, prefix = _d === void 0 ? "" : _d, _e = config.suffix, suffix = _e === void 0 ? "" : _e, _f = config.extension, extension = _f === void 0 ? "" : _f, checkDataType = config.checkDataType;
            var reloadPage = config.reload;
            var loading = callbacks.loading, reload = callbacks.reload, redirect = callbacks.redirect, checkSuccess = callbacks.checkSuccess, notify = callbacks.notify;
            var successCallback = function (responseText) {
                var response;
                try {
                    response = JSON.parse(responseText);
                }
                catch (e) {
                    response = responseText;
                }
                // @ts-ignore
                showProgress && loading && loading(false);
                if (method.toLowerCase() === 'get' || !checkSuccess) {
                    resolve(response);
                }
                else if (checkSuccess) {
                    if (checkDataType && checkSuccess(response)) {
                        resolve(response);
                        // @ts-ignore
                        (redirectTo && redirect && redirect(redirectTo, response)) || (reloadPage && reload && reload());
                    }
                    else if (!checkDataType) {
                        resolve(response);
                    }
                    else {
                        reject(response);
                    }
                    var notification = {
                        type: response.type,
                        message: response.message
                    };
                    // @ts-ignore
                    config.notify && notify && notify(notification);
                }
            };
            var errorCallback = function (error) {
                // @ts-ignore
                showProgress && loading && loading(false);
                var notification = {
                    type: "error"
                };
                notification.message = error.status + ": " + error.statusText;
                // @ts-ignore
                config.notify && notify && notify(notification);
                reject(error);
            };
            var ajaxOptions = __assign({ headers: {}, credentials: "include" }, config.ajaxOptions);
            ajaxOptions.method = method;
            var fullUrl = baseUrl + prefix + url + suffix + extension;
            if (method.toLowerCase() === 'post' && !(data instanceof FormData)) {
                var formData = new FormData().merge(data);
                ajaxOptions.body = formData;
            }
            if (ajaxOptions.body instanceof FormData) {
                ajaxOptions.method = "post";
            }
            else if (data) {
                var params = new URLSearchParams().merge(data);
                fullUrl += "?" + params;
            }
            // @ts-ignore
            showProgress && loading && loading(true);
            fetch(fullUrl, ajaxOptions).then(function (response) {
                return new Promise(function (resolve, reject) {
                    if (response.status === 200) {
                        resolve(response.text());
                    }
                    else {
                        reject(response);
                    }
                });
            }).then(successCallback, errorCallback);
        });
    };
    return $config;
}
exports.fetchRequest = fetchRequest;
function chooseFile(config) {
    var callbacks = config.callbacks;
    callbacks.chooseFile = function (options) {
        var multiple = options.multiple, accept = options.accept;
        var input = document.querySelector('.sk-file-input');
        if (!input) {
            input = document.createElement('input');
            input.type = "file";
            input.accept = _.isArray(accept) ? accept.join(",") : accept;
            input.multiple = multiple;
            input.style.display = "none";
            input.className = "sk-file-input";
            document.querySelector("body").appendChild(input);
        }
        input.click();
        return new Promise(function (resolve) {
            var changeHandler = function (e) {
                var files = e.currentTarget.files;
                var filesArray = [];
                _.each(files, function (file) {
                    file.url = URL.createObjectURL(file);
                    filesArray.push(file);
                });
                if (multiple) {
                    resolve(filesArray);
                }
                else {
                    resolve(files[0]);
                }
            };
            input.addEventListener('change', changeHandler);
        });
    };
    return config;
}
exports.chooseFile = chooseFile;
