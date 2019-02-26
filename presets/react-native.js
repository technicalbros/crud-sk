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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var config = __assign({}, _this.defaultConfig, options);
                        var data = config.data, url = config.url, _a = config.method, method = _a === void 0 ? "get" : _a, _b = config.baseUrl, baseUrl = _b === void 0 ? "" : _b, _c = config.prefix, prefix = _c === void 0 ? "" : _c, _d = config.suffix, suffix = _d === void 0 ? "" : _d, _e = config.extension, extension = _e === void 0 ? "" : _e, _f = config.showProgress, showProgress = _f === void 0 ? true : _f, _g = config.checkDataType, checkDataType = _g === void 0 ? true : _g, _h = config.notify, notify = _h === void 0 ? true : _h, ajaxOptions = config.ajaxOptions;
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
                        }, function (error) {
                            showProgress && _this.toggleLoading(false);
                            notify && _this.notify({
                                type: "error",
                                message: "Something went wrong"
                            });
                            reject(error);
                        });
                    })];
            });
        });
    };
    return config;
}
exports.default = fetchRequest;
