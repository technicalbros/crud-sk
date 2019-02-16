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
    $config.callbacks.redirect = function (to) {
        window.location.href = to;
    };
    $config.callbacks.reload = function () { return window.location.reload(); };
    $config.callbacks.alert = function (_a) {
        var title = _a.title, textContent = _a.textContent;
        return new Promise(function () {
            alert(title + " : " + textContent);
        });
    };
    $config.callbacks.sendRequest = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var config = __assign({}, _this.defaultConfig, options);
            var data = config.data, url = config.url, _a = config.method, method = _a === void 0 ? "get" : _a, _b = config.baseUrl, baseUrl = _b === void 0 ? "" : _b, _c = config.prefix, prefix = _c === void 0 ? "" : _c, _d = config.suffix, suffix = _d === void 0 ? "" : _d, _e = config.extension, extension = _e === void 0 ? "" : _e, _f = config.redirectTo, redirectTo = _f === void 0 ? false : _f, _g = config.showProgress, showProgress = _g === void 0 ? true : _g, _h = config.checkDataType, checkDataType = _h === void 0 ? true : _h, _j = config.notify, notify = _j === void 0 ? true : _j, _k = config.reload, reloadPage = _k === void 0 ? false : _k;
            var successCallback = function (responseText) {
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
                    if (!checkDataType || _this.call("checkSuccess", [response])) {
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
            };
            var errorCallback = function (error) {
                showProgress && _this.toggleLoading(false);
                notify && _this.notify({
                    type: "error",
                    message: error.status + ": " + error.statusText
                });
                reject(error);
            };
            var ajaxOptions = __assign({ headers: {}, credentials: "include" }, config.ajaxOptions);
            ajaxOptions.method = method;
            var fullUrl = baseUrl + prefix + url + suffix + extension;
            if (method.toLowerCase() === 'post' && !(data instanceof FormData)) {
                ajaxOptions.body = new FormData().merge(data);
            }
            if (ajaxOptions.body instanceof FormData) {
                ajaxOptions.method = "post";
            }
            else if (data) {
                var params = new URLSearchParams().merge(data);
                fullUrl += "?" + params;
            }
            showProgress && _this.toggleLoading(true);
            fetch(fullUrl, ajaxOptions).then(function (response) {
                return new Promise(function (resolve, reject) {
                    if (response.status === 200) {
                        resolve(response.text());
                    }
                    else {
                        reject(response);
                    }
                });
            }).then(successCallback, errorCallback).then(function (data) {
                if (redirectTo) {
                    _this.redirect(redirectTo);
                }
                else if (reloadPage) {
                    _this.reload();
                }
                return data;
            });
        });
    };
    return $config;
}
exports.fetchRequest = fetchRequest;
function chooseFile(config) {
    var callbacks = config.callbacks;
    callbacks.chooseFile = function (_a) {
        var _b = _a === void 0 ? {} : _a, multiple = _b.multiple, accept = _b.accept;
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
function redirect(config) {
    var callbacks = config.callbacks;
    callbacks.redirect = function (to) {
        window.location.href = to;
    };
    callbacks.reload = function () { return window.location.reload(); };
    return config;
}
exports.redirect = redirect;
function reload(config) {
    var callbacks = config.callbacks;
    callbacks.reload = function () { return window.location.reload(); };
    return config;
}
exports.reload = reload;
