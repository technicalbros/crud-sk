/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar jquery_1 = __webpack_require__(/*! jquery */ \"jquery\");\r\nvar CrudRequest = /** @class */ (function () {\r\n    function CrudRequest() {\r\n        this.$config = {\r\n            baseUrl: \"\",\r\n            callbacks: {\r\n                notify: function (data) {\r\n                    alert(data.message);\r\n                },\r\n                checkSuccess: function (data) {\r\n                    if (data.type === 'success') {\r\n                        return true;\r\n                    }\r\n                    else {\r\n                        return false;\r\n                    }\r\n                }\r\n            }\r\n        };\r\n    }\r\n    CrudRequest.prototype.send = function (options) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            var config = __assign({}, _this.$config, options);\r\n            var data = config.data, callbacks = config.callbacks, method = config.method, baseUrl = config.baseUrl, url = config.url, redirectTo = config.redirectTo, showProgress = config.showProgress, prefix = config.prefix;\r\n            var reloadPage = config.reload;\r\n            var loading = callbacks.loading, reload = callbacks.reload, redirect = callbacks.redirect, checkSuccess = callbacks.checkSuccess, notify = callbacks.notify;\r\n            var ajaxOptions = __assign({}, config.ajaxOptions, { success: function (response) {\r\n                    showProgress && loading && loading(false);\r\n                    if (method.toLowerCase() === 'get' || !checkSuccess) {\r\n                        resolve(response);\r\n                    }\r\n                    else if (checkSuccess) {\r\n                        if (checkSuccess(response)) {\r\n                            resolve(response);\r\n                            // @ts-ignore\r\n                            (redirectTo && redirect && redirect(redirectTo, response)) || (reloadPage && reload && reload());\r\n                        }\r\n                        else {\r\n                            reject(response);\r\n                        }\r\n                        var notification = {\r\n                            type: response.type,\r\n                            message: response.message\r\n                        };\r\n                        config.notify && notify && notify(notification);\r\n                    }\r\n                }, error: function (error) {\r\n                    showProgress && loading && loading(false);\r\n                    var notification = {\r\n                        type: \"error\"\r\n                    };\r\n                    notification.message = error.status + \": \" + error.statusText;\r\n                    config.notify && notify && notify(notification);\r\n                    reject(error);\r\n                } });\r\n            ajaxOptions.type = method;\r\n            ajaxOptions.url = baseUrl + prefix + url;\r\n            ajaxOptions.data = data;\r\n            showProgress && loading && loading(true);\r\n            jquery_1.ajax(ajaxOptions);\r\n        });\r\n    };\r\n    CrudRequest.prototype.create = function (url, data, options) {\r\n        return this.send(__assign({ method: \"post\", prefix: \"create/\" }, options, { url: url, data: data }));\r\n    };\r\n    CrudRequest.prototype.update = function (url, data, options) {\r\n        return this.send(__assign({ method: \"post\", prefix: \"update/\" }, options, { url: url, data: data }));\r\n    };\r\n    CrudRequest.prototype.delete = function (url, data, options) {\r\n        return this.send(__assign({ method: \"post\", prefix: \"delete/\" }, options, { url: url, data: data }));\r\n    };\r\n    CrudRequest.prototype.retrieve = function (url, data, options) {\r\n        return this.send(__assign({ method: \"get\", prefix: \"retrieve/\" }, options, { url: url, data: data }));\r\n    };\r\n    CrudRequest.prototype.alert = function (options) {\r\n        return this.$config.callbacks.alert(options);\r\n    };\r\n    CrudRequest.prototype.confirm = function (options) {\r\n        return this.$config.callbacks.confirm(options);\r\n    };\r\n    CrudRequest.prototype.prompt = function (options) {\r\n        return this.$config.callbacks.prompt(options);\r\n    };\r\n    CrudRequest.prototype.dialog = function (name, options) {\r\n        return this.$config.callbacks.dialog(name, options);\r\n    };\r\n    CrudRequest.prototype.notify = function (options) {\r\n        this.$config.callbacks.notify(options);\r\n    };\r\n    return CrudRequest;\r\n}());\r\nexports.CrudRequest = CrudRequest;\r\nwindow.CrudRequest = CrudRequest;\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = jQuery;\n\n//# sourceURL=webpack:///external_%22jQuery%22?");

/***/ })

/******/ });