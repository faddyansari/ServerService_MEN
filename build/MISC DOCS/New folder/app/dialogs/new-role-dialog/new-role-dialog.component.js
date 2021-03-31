"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewRoleDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var NewRoleDialogComponent = /** @class */ (function () {
    function NewRoleDialogComponent(data, _roleService, _agentService, _authService, dialogRef) {
        var _this = this;
        this.data = data;
        this._roleService = _roleService;
        this._agentService = _agentService;
        this._authService = _authService;
        this.dialogRef = dialogRef;
        this.subscriptions = [];
        this.agentList = [];
        this.roles = [];
        this.deletionRole = '';
        this.errorMsg = '';
        this.loading = false;
        this.agentList = data.agents;
        this.deletionRole = data.deletionRole;
        this.subscriptions.push(this._roleService.roles.subscribe(function (roles) {
            _this.roles = roles;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            _this.userPermissions = data.permissions.settings;
            // console.log(this.userPermissions);
        }));
    }
    NewRoleDialogComponent.prototype.ngOnInit = function () {
    };
    NewRoleDialogComponent.prototype.save = function () {
        var _this = this;
        if (this.userPermissions.rolesAndPermissions.canDeleteRole) {
            this.loading = true;
            this.agentList.map(function (a) {
                if (a.role == _this.deletionRole) {
                    a.showError = true;
                }
                else {
                    a.showError = false;
                }
                return a;
            });
            if (this.agentList.filter(function (a) { return a.showError; }).length) {
                this.errorMsg = 'Please select a different role as this role is going to be deleted.';
                this.loading = false;
            }
            else {
                // console.log('Else');
                this.errorMsg = '';
                this._agentService.AssignNewRolesToUsers(this.agentList).subscribe(function (response) {
                    if (response == 'ok') {
                        _this.dialogRef.close({
                            status: true
                        });
                    }
                    else {
                        _this.errorMsg = 'Error!';
                    }
                    _this.loading = false;
                }, function (err) {
                    _this.loading = false;
                });
                // this.dialogRef.close({
                // })
                // console.log(this.agentList);
            }
        }
        else {
            this.errorMsg = 'Permissions revoked!';
        }
    };
    NewRoleDialogComponent.prototype.checkSelection = function (agent) {
        if (agent.role != this.deletionRole) {
            agent.showError = false;
        }
        else {
            agent.showError = true;
        }
    };
    NewRoleDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-new-role-dialog',
            templateUrl: './new-role-dialog.component.html',
            styleUrls: ['./new-role-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], NewRoleDialogComponent);
    return NewRoleDialogComponent;
}());
exports.NewRoleDialogComponent = NewRoleDialogComponent;
//# sourceMappingURL=new-role-dialog.component.js.map