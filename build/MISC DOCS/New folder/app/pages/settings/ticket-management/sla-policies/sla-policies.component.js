"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlaPoliciesComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var SlaPoliciesComponent = /** @class */ (function () {
    function SlaPoliciesComponent(_authService, _appStateService, _slaPolicyService, snackBar) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this._slaPolicyService = _slaPolicyService;
        this.snackBar = snackBar;
        this.nsp = '';
        this.email = '';
        this.addPolicy = false;
        this.reOrderEnable = false;
        this.selectedPolicy = undefined;
        this.policyObject = undefined;
        this.allSLAPolicies = [];
        this.subscriptions = [];
        this.changeInReorder = false;
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.SLA;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.nsp = this._slaPolicyService.Agent.nsp;
        this.email = this._slaPolicyService.Agent.email;
        this.policyObject = {
            nsp: '',
            policyName: '',
            policyDesc: '',
            policyTarget: [
                {
                    priority: 'Urgent',
                    responseTimeKey: '15',
                    responseTimeVal: 'mins',
                    resolvedTimeKey: '15',
                    resolvedTimeVal: 'mins',
                    hours: 'operationalHours',
                    emailActivationEscalation: true,
                    emailActivationReminder: true
                },
                {
                    priority: 'High',
                    responseTimeKey: '15',
                    responseTimeVal: 'mins',
                    resolvedTimeKey: '15',
                    resolvedTimeVal: 'mins',
                    hours: 'operationalHours',
                    emailActivationEscalation: true,
                    emailActivationReminder: true
                },
                {
                    priority: 'Medium',
                    responseTimeKey: '15',
                    responseTimeVal: 'mins',
                    resolvedTimeKey: '15',
                    resolvedTimeVal: 'mins',
                    hours: 'operationalHours',
                    emailActivationEscalation: true,
                    emailActivationReminder: true
                },
                {
                    priority: 'Low',
                    responseTimeKey: '15',
                    responseTimeVal: 'mins',
                    resolvedTimeKey: '15',
                    resolvedTimeVal: 'mins',
                    hours: 'operationalHours',
                    emailActivationEscalation: true,
                    emailActivationReminder: true
                }
            ],
            policyApplyTo: [{ name: '', value: [] }],
            reminderResponse: [{ type: 'response', responsetimeKey: '15', responsetimeVal: 'mins', emails: [], notifyTo: ['Assigned Agent'] }],
            reminderResolution: [{ type: 'resolution', resolvedtimeKey: '15', resolvedtimeVal: 'mins', emails: [], notifyTo: ['Assigned Agent'] }],
            violationResponse: [{ type: 'response', duration: '', emails: [], notifyTo: ['Assigned Agent'] }],
            violationResolution: [{ type: 'resolution', duration: '', emails: [], notifyTo: ['Assigned Agent'] }],
            activated: false,
            created: { date: new Date().toISOString(), by: this.email },
            lastModified: { date: '', by: '' },
        };
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(this._slaPolicyService.AddSLAPolicy.subscribe(function (data) {
            _this.addPolicy = data;
        }));
        this.subscriptions.push(this._slaPolicyService.changeInReorder.subscribe(function (data) {
            if (data) {
                _this.changeInReorder = data;
            }
        }));
        this.subscriptions.push(this._slaPolicyService.selectedSLAPolicy.subscribe(function (data) {
            _this.selectedPolicy = data;
        }));
        this.subscriptions.push(this._slaPolicyService.reOrderPolicy.subscribe(function (data) {
            _this.reOrderEnable = data;
        }));
        this.subscriptions.push(this._slaPolicyService.AllSLAPolicies.subscribe(function (data) {
            if (data && data.length) {
                _this.allSLAPolicies = data;
            }
            else {
                _this.allSLAPolicies = [];
            }
        }));
    }
    SlaPoliciesComponent.prototype.ngOnInit = function () {
    };
    SlaPoliciesComponent.prototype.SaveReorder = function () {
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'Policies reordered successfully!'
            },
            duration: 2000,
            panelClass: ['user-alert', 'success']
        });
        this._slaPolicyService.reOrderPolicy.next(false);
    };
    SlaPoliciesComponent.prototype.CancelReorder = function () {
        this._slaPolicyService.reOrderPolicy.next(false);
    };
    SlaPoliciesComponent.prototype.ReorderSLAPolicy = function () {
        this._slaPolicyService.reOrderPolicy.next(true);
    };
    SlaPoliciesComponent.prototype.AddSLAPolicy = function () {
        this._slaPolicyService.reOrderPolicy.next(false);
        this._slaPolicyService.AddSLAPolicy.next(true);
        this._slaPolicyService.selectedSLAPolicy.next(undefined);
    };
    SlaPoliciesComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    SlaPoliciesComponent = __decorate([
        core_1.Component({
            selector: 'app-sla-policies',
            templateUrl: './sla-policies.component.html',
            styleUrls: ['./sla-policies.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], SlaPoliciesComponent);
    return SlaPoliciesComponent;
}());
exports.SlaPoliciesComponent = SlaPoliciesComponent;
//# sourceMappingURL=sla-policies.component.js.map