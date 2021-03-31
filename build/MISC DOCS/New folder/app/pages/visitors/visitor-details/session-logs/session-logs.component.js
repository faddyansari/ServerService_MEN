"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionLogsComponent = void 0;
var core_1 = require("@angular/core");
var SessionLogsComponent = /** @class */ (function () {
    function SessionLogsComponent() {
        this.Logs = [];
    }
    SessionLogsComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input()
    ], SessionLogsComponent.prototype, "Logs", void 0);
    SessionLogsComponent = __decorate([
        core_1.Component({
            selector: 'app-session-logs',
            templateUrl: './session-logs.component.html',
            styleUrls: ['./session-logs.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], SessionLogsComponent);
    return SessionLogsComponent;
}());
exports.SessionLogsComponent = SessionLogsComponent;
//# sourceMappingURL=session-logs.component.js.map