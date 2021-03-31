"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var Observable_1 = require("rxjs/Observable");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var RulesComponent = /** @class */ (function () {
    function RulesComponent(formbuilder, _socketService, _authService, _assignmentRuleService, snackBar, dialog, _appStateService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._socketService = _socketService;
        this._authService = _authService;
        this._assignmentRuleService = _assignmentRuleService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._appStateService = _appStateService;
        this.ruleTag = '';
        this.ruleName = '';
        //automatedMessagesList = [];
        this.subscriptions = [];
        //editingMessagesMap = {};
        this.loading = false;
        this.working = false;
        this.fetching = false;
        this.RulesList = [];
        this.rulesMap = [];
        this.filterKeys = [];
        this.showRulesForm = false;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
        this.subscriptions.push(_socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        }));
        this.subscriptions.push(_assignmentRuleService.fetchingCases.subscribe(function (data) {
            _this.fetching = data;
        }));
        this.subscriptions.push(_socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        }));
        this.subscriptions.push(_authService.getRequestState().subscribe(function (requestState) {
            _this.loading = requestState;
        }));
        this.subscriptions.push(_assignmentRuleService.RulesList.subscribe(function (list) {
            //console.log(list);
            if (list && list.length) {
                _this.RulesList = list;
                _this.UpdateRulesMap(list);
                // list.map(rule => {
                //   if (this.rulesMap[rule._id] == undefined) {
                //     this.rulesMap[rule._id] = {};
                //   }
                //   if (!this.rulesMap[rule._id].selected) {
                //     this.rulesMap[rule._id].selected = false;
                //     this.rulesMap[rule._id] = JSON.parse(JSON.stringify(rule));
                //   }
                // });
            }
        }));
        this.subscriptions.push(_assignmentRuleService.filterKeys.subscribe(function (keys) {
            _this.filterKeys = keys;
        }));
        this.assignmentRuleForm = formbuilder.group({
            'ruleName': [
                null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(50),
                ],
                this.CheckRuleName.bind(this)
            ],
            'ruleKeyValue': [
                null,
                [
                    forms_1.Validators.required
                ]
            ],
            'ruleKeyName': [
                null,
                [
                    forms_1.Validators.required
                ],
                this.FilterKeys.bind(this)
            ],
            'ruleKeyType': [],
            'ruleKeyOperator': [],
        });
    }
    RulesComponent.prototype.ngOnInit = function () {
    };
    RulesComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    RulesComponent.prototype.AddAssignmentRule = function () {
        var _this = this;
        if (this.assignmentRuleForm.valid) {
            this._authService.setRequestState(true);
            var rule = {
                ruleName: this.assignmentRuleForm.get('ruleName').value,
                type: (this.assignmentRuleForm.get('ruleKeyType').value) ? this.assignmentRuleForm.get('ruleKeyType').value : 'any',
                key: this.assignmentRuleForm.get('ruleKeyName').value,
                value: this.assignmentRuleForm.get('ruleKeyValue').value,
                operator: this.assignmentRuleForm.get('ruleKeyOperator').value,
            };
            this._assignmentRuleService.AddNewRule(rule).subscribe(function (data) {
                if (data) {
                    _this._authService.setRequestState(false);
                    //this._authService.updateAutomatedMessages(this.assignmentRuleForm.get('hashTag').value, this.assignmentRuleForm.get('ruleName').value);
                    //this.assignmentRuleForm.reset();
                    //this.RulesList = this.RulesList.concat(rule);
                    //this.UpdateRulesMap(this.RulesList);
                    _this.assignmentRuleForm.reset();
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: { img: 'ok', msg: 'Assignment Rule Added Successfully' },
                        duration: 3000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            }, function (err) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: { img: 'warning', msg: 'Cannot Add Assignment Rule' },
                    duration: 3000,
                    panelClass: ['user-alert', 'error']
                });
            });
        }
    };
    RulesComponent.prototype.DeleteAssignmetRule = function (id) {
        //console.log(id);
        var _this = this;
        event.preventDefault();
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Delete the Assignment Rule' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._authService.setRequestState(true);
                _this._assignmentRuleService.DeleteNewRule({ id: id }).subscribe(function (data) {
                    if (data.status == 'ok') {
                        _this._authService.setRequestState(false);
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: { img: 'ok', msg: 'Assignment Rule Deleted Successfully' },
                            duration: 3000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                }, function (err) {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: { img: 'warning', msg: 'Cannot Delete Assignment Rule' },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                });
            }
        });
    };
    //After Edit Button Events
    RulesComponent.prototype.Edit = function (event, hashTag) {
        event.preventDefault();
        // this.editingMessagesMap[hashTag].error = false;
        // if (!this.editingMessagesMap[hashTag].ruleName) {
        //   this.editingMessagesMap[hashTag].error = true;
        //   return
        // };
        // this.socket.emit('editAutomatedResponse', {
        //   hashTag: hashTag,
        //   ruleName: this.editingMessagesMap[hashTag].ruleName
        // }, (response) => {
        //   if (response.status == 'ok') {
        //     this._authService.EditupdateAutomatedMessages(
        //       response.hashTag,
        //       this.editingMessagesMap[response.hashTag].ruleName
        //     );
        //     this.editingMessagesMap[hashTag].selected = false;
        //     this.snackBar.openFromComponent(ToastNotifications, {
        //       data: { img: 'ok', msg: 'Automated Message Edited Successfully' },
        //       duration: 3000,
        //       panelClass: ['user-alert', 'success']
        //     })
        //   }
        // });
    };
    RulesComponent.prototype.CancelEdit = function (previousRule) {
        this.rulesMap[previousRule._id].operator = previousRule.operator;
        this.rulesMap[previousRule._id].type = previousRule.type;
        this.rulesMap[previousRule._id].key = previousRule.key;
        this.rulesMap[previousRule._id].value = previousRule.value;
        this.rulesMap[previousRule._id].selected = false;
    };
    RulesComponent.prototype.toggleRulesForm = function () {
        this.showRulesForm = !this.showRulesForm;
    };
    RulesComponent.prototype.EditRule = function (id) {
        return this.rulesMap[id].selected;
    };
    RulesComponent.prototype.CheckEdit = function (id) {
        return this.rulesMap[id].selected;
    };
    RulesComponent.prototype.CheckDelete = function (id) {
        return; //this.deleting[id];
    };
    RulesComponent.prototype.EnableEdit = function (_id) {
        if (!_id)
            return;
        this.rulesMap[_id].selected = true;
    };
    // CancelEdit(id: string, previousCriteria: string, previousMatchingCriteria: string) {
    //   this.rulesMap[id].criteria = previousCriteria;
    //   this.rulesMap[id].matchingCriteria = previousMatchingCriteria;
    //   this.rulesMap[id].selected = false;
    // }
    RulesComponent.prototype.SubmitEdit = function (id) {
        var _this = this;
        this._assignmentRuleService.EditRule({
            _id: id,
            key: this.rulesMap[id].key,
            value: this.rulesMap[id].value,
            type: this.rulesMap[id].type,
            operator: this.rulesMap[id].operator
        }).subscribe(function (response) {
            _this.rulesMap[id].selected = false;
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: { img: 'ok', msg: 'Rule Edited Successfully' },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    RulesComponent.prototype.DeleteCase = function (id) {
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Delete Case' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                // this.deleting[id] = true;
                // this._chatBotSettings.DeleteCase(id).subscribe(response => {
                //   delete this.deleting[id];
                //   if (response.status == 'assigned') {
                //     this.snackBar.openFromComponent(ToastNotifications, {
                //       data: { img: 'warning', msg: 'Case Has Already Been Assigned To One Of The StateMachines' },
                //       duration: 3000,
                //       panelClass: ['user-alert', 'error']
                //     });
                //   }
                // }, err => {
                //   delete this.deleting[id];
                // });
            }
        });
    };
    RulesComponent.prototype.CheckRuleName = function (control) {
        var name = this.assignmentRuleForm.get('ruleName');
        for (var i = 0; i < this.RulesList.length; i++) {
            if (this.RulesList[i].ruleName == name.value) {
                return Observable_1.Observable.of({ 'matched': true });
            }
        }
        return Observable_1.Observable.of(null);
    };
    RulesComponent.prototype.FilterKeys = function (control) {
        var keys = this.assignmentRuleForm.get('ruleKeyName').value;
        var pattern = new RegExp(keys, 'gi');
        if (this.filterKeys.indexOf(keys) !== -1)
            return Observable_1.Observable.of(null);
        var matched = false;
        this.filterKeys.map(function (key) {
            if (key.match(pattern)) {
                matched = true;
            }
            return key;
        });
        if (matched)
            return Observable_1.Observable.of(null);
        else {
            this._assignmentRuleService.GetFilters(keys).subscribe(function (data) {
            }, function (err) {
                console.log("error in get filters");
            });
            return Observable_1.Observable.of(null);
        }
    };
    RulesComponent.prototype.UpdateRulesMap = function (list) {
        var _this = this;
        list.map(function (rule) {
            if (_this.rulesMap[rule._id] == undefined) {
                _this.rulesMap[rule._id] = {};
            }
            if (!_this.rulesMap[rule._id].selected) {
                _this.rulesMap[rule._id].selected = false;
                _this.rulesMap[rule._id] = JSON.parse(JSON.stringify(rule));
            }
        });
    };
    __decorate([
        core_1.ViewChild('ruleName')
    ], RulesComponent.prototype, "tagNameElement", void 0);
    RulesComponent = __decorate([
        core_1.Component({
            selector: 'app-rules',
            templateUrl: './rules.component.html',
            styleUrls: ['./rules.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], RulesComponent);
    return RulesComponent;
}());
exports.RulesComponent = RulesComponent;
//# sourceMappingURL=rules.component.js.map