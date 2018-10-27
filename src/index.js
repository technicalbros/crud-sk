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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jquery_1 = __importDefault(require("jquery"));
var _ = __importStar(require("lodash"));
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
            var config = __assign({ checkDataType: true, notify: true }, _this.$config, options);
            var data = config.data, callbacks = config.callbacks, method = config.method, baseUrl = config.baseUrl, url = config.url, redirectTo = config.redirectTo, showProgress = config.showProgress, _a = config.prefix, prefix = _a === void 0 ? "" : _a, checkDataType = config.checkDataType;
            var reloadPage = config.reload;
            var loading = callbacks.loading, reload = callbacks.reload, redirect = callbacks.redirect, checkSuccess = callbacks.checkSuccess, notify = callbacks.notify;
            var ajaxOptions = __assign({}, config.ajaxOptions, { success: function (response) {
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
            if (method.toLowerCase() === 'post') {
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
        return this.send(__assign({ method: "get", prefix: "retrieve/", checkDataType: false, notify: false }, options, { url: url, data: data }));
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
    CrudRequest.prototype.chooseFile = function (options) {
        if (options === void 0) { options = {}; }
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
    return CrudRequest;
}());
exports.CrudRequest = CrudRequest;
window.CrudRequest = CrudRequest;
