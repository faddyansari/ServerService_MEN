"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallationComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../dialogs/SnackBar-Dialog/toast-notifications.component");
require("codemirror/mode/javascript/javascript");
var InstallationComponent = /** @class */ (function () {
    function InstallationComponent(http, _authService, _socketService, snackBar) {
        var _this = this;
        this.http = http;
        this._authService = _authService;
        this._socketService = _socketService;
        this.snackBar = snackBar;
        this.codeMirrorOptions = {
            theme: 'base16-light',
            mode: { name: 'javascript' },
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
            autoCloseBrackets: true,
            matchBrackets: true,
            readOnly: true, className: "readOnly",
            lint: true
        };
        this.script = '';
        this.scubscriptions = [];
        this.loading = false;
        this.email = '';
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.invalidEmail = false;
        this.viewContentInfo = false;
        _socketService.getSocket().subscribe(function (data) {
            _this.socket = data;
        });
        _socketService.getScript().subscribe(function (script) {
            if (script == '') {
                _this.socket.emit('displayScript');
            }
            else {
                _this.script = script;
            }
        });
    }
    InstallationComponent.prototype.ngOnInit = function () {
    };
    InstallationComponent.prototype.ngAfterViewInit = function () {
    };
    InstallationComponent.prototype.ngOnDestroy = function () {
        this.scubscriptions.forEach(function (subscript) {
            subscript.unsubscribe();
        });
    };
    InstallationComponent.prototype.RequestCode = function () {
        var _this = this;
        this.invalidEmail = false;
        if (!new RegExp(this.emailPattern).test(this.email)) {
            this.invalidEmail = true;
            return;
        }
        this.loading = true;
        this.socket.emit('sendCode', {
            email: this.email,
            sender: this._authService.Agent.getValue().email
        }, function (response) {
            _this.loading = false;
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: { img: 'ok', msg: 'Code Sent to ' + _this.email },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                }).afterDismissed().subscribe(function (result) {
                    _this.email = '';
                });
            }
            else {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: "Unable To Send Code."
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    };
    InstallationComponent.prototype.toggleInfoArea = function () {
        this.viewContentInfo = !this.viewContentInfo;
    };
    InstallationComponent = __decorate([
        core_1.Component({
            selector: 'app-installation',
            templateUrl: './installation.component.html',
            styleUrls: ['./installation.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], InstallationComponent);
    return InstallationComponent;
}());
exports.InstallationComponent = InstallationComponent;
//# sourceMappingURL=installation.component.js.map