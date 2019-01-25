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
    else if (key) {
        formData.append(key, data);
    }
};
FormData.prototype.merge = function (data) {
    mergeData(this, data);
    return this;
};
function default_1(config) {
    var _this = this;
    var callbacks = config.callbacks;
    callbacks.sendRequest = function (options) { return new Promise(function (resolve, reject) {
        var config = __assign({ checkDataType: true, notify: true }, _this.$config, options);
        var data = config.data, callbacks = config.callbacks, _a = config.method, method = _a === void 0 ? "get" : _a, baseUrl = config.baseUrl, url = config.url, redirectTo = config.redirectTo, showProgress = config.showProgress, _b = config.prefix, prefix = _b === void 0 ? "" : _b, _c = config.suffix, suffix = _c === void 0 ? "" : _c, _d = config.extension, extension = _d === void 0 ? "" : _d, checkDataType = config.checkDataType;
        var reloadPage = config.reload;
        var loading = callbacks.loading, reload = callbacks.reload, redirect = callbacks.redirect, checkSuccess = callbacks.checkSuccess, notify = callbacks.notify;
        var ajaxOptions = __assign({}, config.ajaxOptions, { success: function (responseText) {
                var response;
                try {
                    response = JSON.parse(responseText);
                }
                catch (e) {
                    response = responseText;
                }
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
                    _this.notify(notification);
                }
            }, error: function (error) {
                _this.toggleLoading(false);
                var notification = {
                    type: "error"
                };
                notification.message = error.status + ": " + error.statusText;
                _this.notify(notification);
                reject(error);
            } });
        ajaxOptions.type = method;
        ajaxOptions.url = baseUrl + prefix + url + suffix + extension;
        if (method.toLowerCase() === 'post' && !(data instanceof FormData)) {
            var formData = new FormData().merge(data);
            ajaxOptions.data = formData;
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
        showProgress && loading && loading(true);
        jquery_1.default.ajax(ajaxOptions);
    }); };
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
        jquery_1.default('input').click();
        return new Promise(function (resolve) {
            jquery_1.default(input).one('change', function (e) {
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
            });
        });
    };
    return config;
}
exports.default = default_1;
