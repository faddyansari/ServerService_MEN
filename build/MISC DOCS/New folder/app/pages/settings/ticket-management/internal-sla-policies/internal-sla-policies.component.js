"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalSlaPoliciesComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var InternalSlaPoliciesComponent = /** @class */ (function () {
    function InternalSlaPoliciesComponent(_appStateService, _slaPolicyService, snackBar) {
        var _this = this;
        this._appStateService = _appStateService;
        this._slaPolicyService = _slaPolicyService;
        this.snackBar = snackBar;
        this.email = '';
        this.nsp = '';
        this.selectedInternalPolicy = undefined;
        this.InternalpolicyObject = undefined;
        this.allInternalSLAPolicies = [];
        this.subscriptions = [];
        this.addInternalPolicy = false;
        this.reOrderEnable = false;
        this.changeInReorder = false;
        this.nsp = this._slaPolicyService.Agent.nsp;
        this.email = this._slaPolicyService.Agent.email;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(this._slaPolicyService.AddInternalSLAPolicy.subscribe(function (data) {
            _this.addInternalPolicy = data;
        }));
        this.subscriptions.push(this._slaPolicyService.changeInReorderInt.subscribe(function (data) {
            if (data) {
                _this.changeInReorder = data;
            }
        }));
        this.subscriptions.push(this._slaPolicyService.selectedInternalSLAPolicy.subscribe(function (data) {
            _this.selectedInternalPolicy = data;
        }));
        this.subscriptions.push(this._slaPolicyService.reOrderIntPolicy.subscribe(function (data) {
            _this.reOrderEnable = data;
        }));
        this.subscriptions.push(this._slaPolicyService.AllInternalSLAPolicies.subscribe(function (data) {
            if (data && data.length) {
                _this.allInternalSLAPolicies = data;
            }
            else {
                _this.allInternalSLAPolicies = [];
            }
        }));
        this.InternalpolicyObject = {
            nsp: '',
            policyName: '',
            policyDesc: '',
            operator: "or",
            operations: [{ operationName: '', operationValue: [], regex: '' }],
            policyTarget: [
                {
                    priority: 'Urgent',
                    // operator:'OR',
                    // operation:[],
                    TimeKey: '15',
                    TimeVal: 'mins',
                    emailActivationEscalation: true,
                    emailActivationReminder: true
                },
                {
                    priority: 'High',
                    // operator:'OR',
                    // operation:[],
                    TimeKey: '15',
                    TimeVal: 'mins',
                    emailActivationEscalation: true,
                    emailActivationReminder: true
                },
                {
                    priority: 'Medium',
                    // operator:'OR',
                    // operation:[],
                    TimeKey: '15',
                    TimeVal: 'mins',
                    emailActivationEscalation: true,
                    emailActivationReminder: true
                },
                {
                    priority: 'Low',
                    TimeKey: '15',
                    TimeVal: 'mins',
                    emailActivationEscalation: true,
                    emailActivationReminder: true
                }
            ],
            policyApplyTo: [{ name: '', value: [] }],
            reminder: [{ timeKey: '15', timeVal: 'mins', emails: [], notifyTo: ['Assigned Agent'] }],
            escalation: [{ duration: '', emails: [], notifyTo: ['Assigned Agent'] }],
            activated: false,
            created: { date: new Date().toISOString(), by: this.email },
            lastModified: { date: '', by: '' },
        };
    }
    InternalSlaPoliciesComponent.prototype.ngOnInit = function () {
    };
    InternalSlaPoliciesComponent.prototype.AddInternalSLAPolicy = function () {
        this._slaPolicyService.reOrderIntPolicy.next(false);
        this._slaPolicyService.AddInternalSLAPolicy.next(true);
    };
    InternalSlaPoliciesComponent.prototype.SaveReorder = function () {
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'Policies reordered successfully!'
            },
            duration: 2000,
            panelClass: ['user-alert', 'success']
        });
        this._slaPolicyService.reOrderIntPolicy.next(false);
    };
    InternalSlaPoliciesComponent.prototype.CancelReorder = function () {
        this._slaPolicyService.reOrderIntPolicy.next(false);
    };
    InternalSlaPoliciesComponent.prototype.ReorderSLAPolicy = function () {
        this._slaPolicyService.reOrderIntPolicy.next(true);
    };
    InternalSlaPoliciesComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    InternalSlaPoliciesComponent = __decorate([
        core_1.Component({
            selector: 'app-internal-sla-policies',
            templateUrl: './internal-sla-policies.component.html',
            styleUrls: ['./internal-sla-policies.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], InternalSlaPoliciesComponent);
    return InternalSlaPoliciesComponent;
}());
exports.InternalSlaPoliciesComponent = InternalSlaPoliciesComponent;
//# sourceMappingURL=internal-sla-policies.component.js.map