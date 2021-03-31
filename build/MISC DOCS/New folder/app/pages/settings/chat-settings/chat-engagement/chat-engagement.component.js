"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEngagementComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var ChatEngagementComponent = /** @class */ (function () {
    function ChatEngagementComponent(formbuilder, _chatSettingsService, _authService, snackBar, _appStateService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._chatSettingsService = _chatSettingsService;
        this._authService = _authService;
        this.snackBar = snackBar;
        this._appStateService = _appStateService;
        this.production = true;
        this.nsp = '';
        this.showRulesetForm = false;
        this.subscriptions = [];
        this.RuleSets = [];
        this.selectedRule = '';
        this.workFlowError = false;
        this.rulsetError = false;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
        this.subscriptions.push(_chatSettingsService.chatSettings.subscribe(function (settings) {
            if (settings) {
                _this.assignmentSettings = settings.assignments;
                if (_this.assignmentSettings.ruleSets) {
                    _this.RuleSets = _this.assignmentSettings.ruleSets;
                }
                if (_this.assignmentSettings && _this.assignmentSettingsForm) {
                    _this.assignmentSettingsForm.get('email').setValue(_this.assignmentSettings.priorityAgent);
                }
            }
        }));
        this.subscriptions.push(_chatSettingsService.getSavingStatus('assignments').subscribe(function (status) {
            _this.loading = status;
        }));
        this.subscriptions.push(_authService.Production.subscribe(function (production) {
            _this.production = production;
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.nsp = agent.nsp;
        }));
        this.assignmentSettingsForm = formbuilder.group({
            'email': [
                (this.assignmentSettings && this.assignmentSettings.priorityAgent) ? this.assignmentSettings.priorityAgent : '',
                [
                    forms_1.Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                ]
            ]
        });
        this.ruleSetOneForm = formbuilder.group({
            'activityTime': [null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.min(1),
                    forms_1.Validators.max(1440)
                ]
            ],
        });
        this.ruleSetTwoForm = formbuilder.group({
            'pagesVisited': [null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.min(1)
                ]
            ]
        });
        this.ruleSetThreeForm = formbuilder.group({
            'pageUrl': [null, forms_1.Validators.required]
        });
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
                if (!_this.package.chats.chatEngagement.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
    }
    ChatEngagementComponent.prototype.ngOnInit = function () {
    };
    ChatEngagementComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatEngagementComponent.prototype.SetAssignmentSettings = function (value) {
        if (value == 'mEng') {
            this.assignmentSettings.mEng = true;
            this.assignmentSettings.aEng = false;
        }
        else {
            this.assignmentSettings.mEng = false;
            this.assignmentSettings.aEng = true;
        }
    };
    ChatEngagementComponent.prototype.Submit = function (aEng, mEng, botEnabled) {
        var _this = this;
        //console.log('Submitting');
        this.workFlowError = false;
        this.rulsetError = false;
        this._chatSettingsService.setNSPChatSettings({
            aEng: aEng,
            mEng: mEng,
            botEnabled: botEnabled,
            priorityAgent: this.assignmentSettingsForm.get('email').value,
            ruleSets: this.RuleSets
        }, 'assignments')
            .subscribe(function (response) {
            //Do Some Error Logic If Any
            //Check Server Responses For this Event
            if (response.status == 'error') {
                if (response.reason.length < 2) {
                    response.reason.map(function (error) {
                        switch (error) {
                            case "workflowNotDefined":
                                //this.workFlowError = true;
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'warning',
                                        msg: 'Unable To Enable Chat Bot Please Define Workflow First.'
                                    },
                                    duration: 3000,
                                    panelClass: ['user-alert', 'error']
                                });
                                _this.assignmentSettings.botEnabled = false;
                                break;
                            case "ruleSetsEmpty":
                                //this.rulsetError = true;
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'warning',
                                        msg: 'Unable To Enable Automatic Assignment Since RuleSets Are Empty.'
                                    },
                                    duration: 3000,
                                    panelClass: ['user-alert', 'error']
                                });
                                _this.assignmentSettings.mEng = true;
                                _this.assignmentSettings.aEng = false;
                                break;
                            // default:
                            // 	break;
                        }
                    });
                }
                else {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Unable To Enable Automatic Assignment Since RuleSets Are Empty. <br> Unable To Enable Chat Bot Please Define Workflow First.'
                        },
                        duration: 50000000,
                        panelClass: ['user-alert', 'error']
                    });
                    _this.assignmentSettings.botEnabled = false;
                    _this.assignmentSettings.mEng = true;
                    _this.assignmentSettings.aEng = false;
                }
            }
            else {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Assignment Settings Updated Successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    ChatEngagementComponent.prototype.SelectRuleSet = function (value) {
        if (value) {
            //console.log(value);
            this.selectedRule = value;
        }
        else {
            //console.log('Please select rule!');
        }
    };
    ChatEngagementComponent.prototype.ToggleRulesetForm = function () {
        this.showRulesetForm = !this.showRulesetForm;
    };
    ChatEngagementComponent.prototype.CreateRule = function (form, id) {
        var _this = this;
        // console.log(form);
        if (form.valid) {
            var ruleSchema_1 = form.value;
            ruleSchema_1.id = id;
            if (this.RuleSets.length) {
                var ruleSet = this.RuleSets.filter(function (element) { return element.id == ruleSchema_1.id; });
                if (ruleSet && ruleSet.length) {
                    if (ruleSet[0].id == 'r_particular_page') {
                        if (!ruleSet[0].pageUrl.includes(form.get('pageUrl').value)) {
                            ruleSet[0].pageUrl.push(form.get('pageUrl').value);
                            // console.log(this.RuleSets);
                            this._chatSettingsService.setNSPChatSettings({
                                aEng: this.assignmentSettings.aEng,
                                mEng: this.assignmentSettings.mEng,
                                botEnabled: this.assignmentSettings.botEnabled,
                                priorityAgent: this.assignmentSettingsForm.get('email').value,
                                ruleSets: this.RuleSets
                            }, 'assignments')
                                .subscribe(function (response) {
                                if (response.status == "ok") {
                                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                        data: {
                                            img: 'ok',
                                            msg: 'Ruleset added Successfully!'
                                        },
                                        duration: 3000,
                                        panelClass: ['user-alert', 'success']
                                    });
                                }
                                //Do Some Error Logic If Any
                                //Check Server Responses For this Event
                            });
                            form.reset();
                        }
                        else {
                            // console.log('url already inserted');
                            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                data: {
                                    img: 'warning',
                                    msg: 'Url is already inserted for selected rule!'
                                },
                                duration: 3000,
                                panelClass: ['user-alert', 'error']
                            });
                        }
                    }
                    else {
                        // console.log('already inserted');
                        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'This ruleset is already inserted and is only allowed once.'
                            },
                            duration: 3000,
                            panelClass: ['user-alert', 'error']
                        });
                    }
                }
                else {
                    //	console.log('inserting...');
                    if (ruleSchema_1.id == 'r_particular_page') {
                        ruleSchema_1.pageUrl = [ruleSchema_1.pageUrl];
                    }
                    // console.log(ruleSchema);
                    this.RuleSets.push(ruleSchema_1);
                    // console.log(this.RuleSets);
                    this._chatSettingsService.setNSPChatSettings({
                        aEng: this.assignmentSettings.aEng,
                        mEng: this.assignmentSettings.mEng,
                        botEnabled: this.assignmentSettings.botEnabled,
                        priorityAgent: this.assignmentSettingsForm.get('email').value,
                        ruleSets: this.RuleSets
                    }, 'assignments')
                        .subscribe(function (response) {
                        //Do Some Error Logic If Any
                        //Check Server Responses For this Event
                    });
                    form.reset();
                }
            }
            else {
                //console.log('inserting...');
                if (ruleSchema_1.id == 'r_particular_page') {
                    ruleSchema_1.pageUrl = [ruleSchema_1.pageUrl];
                }
                // console.log(ruleSchema);
                this.RuleSets.push(ruleSchema_1);
                //console.log(this.RuleSets);
                this._chatSettingsService.setNSPChatSettings({
                    aEng: this.assignmentSettings.aEng,
                    mEng: this.assignmentSettings.mEng,
                    botEnabled: this.assignmentSettings.botEnabled,
                    priorityAgent: this.assignmentSettingsForm.get('email').value,
                    ruleSets: this.RuleSets
                }, 'assignments')
                    .subscribe(function (response) {
                    //console.log(response);
                    //Do Some Error Logic If Any
                    //Check Server Responses For this Event
                });
                form.reset();
            }
        }
        else {
            //console.log('invalid form');
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Invalid form!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'error']
            });
        }
        this.showRulesetForm = false;
        this.selectedRule = '';
    };
    ChatEngagementComponent.prototype.deleteRule = function (id, url) {
        var _this = this;
        if (url === void 0) { url = undefined; }
        var index = this.RuleSets.findIndex(function (data) { return data.id == id; });
        if (url && index != -1) {
            var rule = this.RuleSets[index];
            var urlIndex = rule.pageUrl.findIndex(function (data) { return data == url; });
            if (urlIndex != -1) {
                rule.pageUrl.splice(urlIndex, 1);
            }
            if (!rule.pageUrl.length) {
                this.RuleSets.splice(index, 1);
            }
        }
        else {
            this.RuleSets.splice(index, 1);
        }
        if (this.RuleSets && !this.RuleSets.length) {
            this.assignmentSettings.aEng = false;
            this.assignmentSettings.mEng = true;
        }
        this._chatSettingsService.setNSPChatSettings({
            aEng: this.assignmentSettings.aEng,
            mEng: this.assignmentSettings.mEng,
            botEnabled: this.assignmentSettings.botEnabled,
            priorityAgent: this.assignmentSettingsForm.get('email').value,
            ruleSets: this.RuleSets
        }, 'assignments')
            .subscribe(function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Ruleset deleted Successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
            //console.log(response);
            //Do Some Error Logic If Any
            //Check Server Responses For this Event
        });
    };
    ChatEngagementComponent = __decorate([
        core_1.Component({
            selector: 'app-chat-engagement',
            templateUrl: './chat-engagement.component.html',
            styleUrls: ['./chat-engagement.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], ChatEngagementComponent);
    return ChatEngagementComponent;
}());
exports.ChatEngagementComponent = ChatEngagementComponent;
//# sourceMappingURL=chat-engagement.component.js.map