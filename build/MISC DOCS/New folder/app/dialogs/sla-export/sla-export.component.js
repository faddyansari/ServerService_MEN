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
exports.SlaExportComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var toast_notifications_component_1 = require("../SnackBar-Dialog/toast-notifications.component");
var SlaExportComponent = /** @class */ (function () {
    function SlaExportComponent(data, _ticketAutomationSvc, _ticketService, dialogRef, snackBar) {
        var _this = this;
        this.data = data;
        this._ticketAutomationSvc = _ticketAutomationSvc;
        this._ticketService = _ticketService;
        this.dialogRef = dialogRef;
        this.snackBar = snackBar;
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.emails = [];
        this.selectedLink = "group";
        this.prioritys = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        this.states = ['OPEN', 'PENDING', 'SOLVED'];
        this.sources = ['livechat', 'email', 'panel'];
        this.groups = [];
        this.subscriptions = [];
        this.wiseName = 'group';
        this.wiseValue = [];
        this.dynamicDropdownSettings = {
            singleSelection: false,
            itemsShowLimit: 3,
            textField: 'group_name',
            "allowSearchFilter": true
        };
        this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(function (data) {
            if (data) {
                _this.groups = data;
                // data.map(val => {
                //   this.groups.push({ display: val.group_name, value: val.group_name })
                // })
            }
        }));
    }
    SlaExportComponent.prototype.ngOnInit = function () {
    };
    SlaExportComponent.prototype.setradio = function (e) {
        this.selectedLink = e;
    };
    SlaExportComponent.prototype.isSelected = function (name) {
        if (!this.selectedLink) { // if no radio button is selected, always return false so every nothing is shown
            return false;
        }
        return (this.selectedLink === name); // if current radio button is selected, return true, else return false
    };
    SlaExportComponent.prototype.Export = function () {
        var _this = this;
        console.log(this.wiseName);
        console.log(this.wiseValue);
        console.log(this.data);
        console.log(this.dates);
        var obj;
        var ticketIds;
        if (this.wiseName && this.wiseValue) {
            obj = {
                name: this.wiseName,
                value: this.wiseValue
            };
        }
        if (this.data && this.data.length) {
            ticketIds = this.data.map(function (e) { return e._id; });
        }
        this._ticketService.exportSlaReport(this.dates != undefined ? this.dates.from : '', this.dates != undefined ? this.dates.to : '', this.emails, obj ? obj : undefined, ticketIds ? ticketIds : []).subscribe(function (res) {
            if (res.status == "ok") {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Success! you will get a download link on your email in a while..'
                    },
                    duration: 5000,
                    panelClass: ['user-alert', 'success']
                });
                _this.dialogRef.close({
                    status: true
                });
            }
        });
    };
    SlaExportComponent.prototype.dateChanged = function (event) {
        if (event.status) {
            this.dates = event.dates;
        }
        else {
            this.dates = undefined;
        }
    };
    SlaExportComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    SlaExportComponent = __decorate([
        core_1.Component({
            selector: 'app-sla-export',
            templateUrl: './sla-export.component.html',
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], SlaExportComponent);
    return SlaExportComponent;
}());
exports.SlaExportComponent = SlaExportComponent;
//# sourceMappingURL=sla-export.component.js.map