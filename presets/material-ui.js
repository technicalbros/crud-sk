"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var core_1 = require("@material-ui/core");
function notify($config) {
    return $config;
}
exports.notify = notify;
// @ts-ignore
var NotifySnackBar = /** @class */ (function (_super) {
    __extends(NotifySnackBar, _super);
    function NotifySnackBar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            show: false,
        };
        _this.props.crud.config(function (config) {
            var callbacks = config.callbacks;
            callbacks.notify = function (data) { return new Promise(function () {
                if (data.type === "error") {
                    _this.setState({
                        show: true,
                        message: String(data.message),
                        className: _this.props.classes.error_snackbar,
                        action: React.createElement(core_1.Button, { color: "inherit", onClick: function () { return _this.hide(); } }, "Hide")
                    });
                }
                else if (data.type === 'success') {
                    _this.setState({
                        show: true,
                        message: String(data.message),
                        className: _this.props.classes.success_snackbar,
                        action: React.createElement(core_1.Button, { color: "inherit", onClick: function () { return _this.hide(); } }, "Hide")
                    });
                }
            }); };
            return config;
        });
        return _this;
    }
    NotifySnackBar.prototype.hide = function () {
        this.setState({
            hide: false
        });
    };
    NotifySnackBar.prototype.render = function () {
        var _this = this;
        return React.createElement(core_1.Snackbar, { autoHideDuration: 2000, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            }, open: this.state.show, onClose: function () { return _this.setState({
                show: true
            }); } },
            React.createElement(core_1.SnackbarContent, { className: this.state.className, message: this.state.message, action: this.state.action }));
    };
    NotifySnackBar = __decorate([
        core_1.withStyles({
            error_snackbar: {
                backgroundColor: 'red'
            },
            success_snackbar: {
                backgroundColor: 'green'
            },
        }),
        __metadata("design:paramtypes", [Object])
    ], NotifySnackBar);
    return NotifySnackBar;
}(React.Component));
exports.NotifySnackBar = NotifySnackBar;
