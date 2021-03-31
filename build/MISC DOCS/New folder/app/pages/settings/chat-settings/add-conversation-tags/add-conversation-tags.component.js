"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddConversationTagsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var AddConversationTagsComponent = /** @class */ (function () {
    function AddConversationTagsComponent(_chatSettingService, _appStateService, _authService, _utilityService, formbuilder, snackBar, dialog) {
        var _this = this;
        this._chatSettingService = _chatSettingService;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this._utilityService = _utilityService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.subscriptions = [];
        this.tagList = [];
        this.agentList = undefined;
        this.showForm = false;
        this.edit = false;
        this.package = {};
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
        //#region Form Initializations
        this.tagForm = formbuilder.group({
            'hashTag': [
                null,
                [
                    forms_1.Validators.required,
                    // Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/)
                    // Validators.pattern(/^[ \t]*#([0-9a-zA-Z]+)[ \t]*((,)?#([0-9a-zA-Z]+))*$/)
                    forms_1.Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/)
                ],
                this.CheckTags.bind(this)
            ]
        });
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agentList) {
            _this.agentList = agentList;
        }));
        //#region Initial Data Subscription
        this.subscriptions.push(this._chatSettingService.getChattSettings().subscribe(function (data) {
            if (data && data.tagList)
                _this.tagList = data.tagList;
        }));
        //#endregion
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.tickets;
                _this.agentPermissions = data.permissions.agents;
            }
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            if (agent) {
                _this.Agent = agent;
            }
        }));
        this.subscriptions.push(this._appStateService.currentRoute.subscribe(function (data) {
            _this.route = data;
        }));
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
                if (!_this.package.chats.tags.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
    }
    //#region Async Validators
    AddConversationTagsComponent.prototype.CheckTags = function () {
        var _this = this;
        var matched = false;
        if (this.tagList && this.tagList.length) {
            this.RemoveDuplicateTags((this.tagForm.get('hashTag').value).split(',')).map(function (list) {
                if (_this.tagList.indexOf(list) !== -1)
                    matched = true;
            });
        }
        if (matched) {
            return Observable_1.Observable.of({ 'matched': true });
        }
        else {
            return Observable_1.Observable.of(null);
        }
    };
    AddConversationTagsComponent.prototype.RemoveDuplicateTags = function (array) {
        var arr = {};
        array.map(function (value) { if (value.trim())
            arr[value] = value.trim(); });
        return Object.keys(arr);
    };
    AddConversationTagsComponent.prototype.addTags = function (forVisitors, forAgents) {
        var _this = this;
        if (this.package && this.package.chats.tags.quota <= this.tagList.length) {
            this.snackBar.open("Maximum limit for tags reached", null, {
                duration: 3000,
                panelClass: ['user-alert', 'error']
            });
            return;
        }
        var hashTag = this.tagForm.get('hashTag').value;
        var commaseparatedTags = this.RemoveDuplicateTags(hashTag.split(','));
        commaseparatedTags = this.tagList.concat(commaseparatedTags);
        if (commaseparatedTags && commaseparatedTags.length) {
            this._chatSettingService
                .setNSPChatSettings(commaseparatedTags, 'tagList')
                .subscribe(function (response) {
                if (response.status == "ok") {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Tag List updated Successfully!'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'success']
                    });
                }
                //Do Some Error Logic If Any
                //Check Server Responses For this Event
            });
        }
        this.tagForm.reset();
        this.showForm = false;
    };
    AddConversationTagsComponent.prototype.DeleteTag = function (i) {
        var _this = this;
        if (this.tagList && this.tagList.length) {
            this.tagList.splice(i, 1);
            this._chatSettingService
                .setNSPChatSettings(this.tagList, 'tagList')
                .subscribe(function (response) {
                if (response.status == "ok") {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Tag List updated Successfully!'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            });
        }
        //this._chatSettingService.deleteConversationTag(this.currentConversation.tags[index], index);
    };
    AddConversationTagsComponent.prototype.StopPropagation = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    };
    AddConversationTagsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AddConversationTagsComponent.prototype.ShowForm = function () {
        this.showForm = !this.showForm;
    };
    AddConversationTagsComponent.prototype.setSelectedTag = function (i) {
        this.selectedTag = this.tagList[i];
    };
    AddConversationTagsComponent = __decorate([
        core_1.Component({
            selector: 'app-add-conversation-tags',
            templateUrl: './add-conversation-tags.component.html',
            styleUrls: ['./add-conversation-tags.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], AddConversationTagsComponent);
    return AddConversationTagsComponent;
}());
exports.AddConversationTagsComponent = AddConversationTagsComponent;
//# sourceMappingURL=add-conversation-tags.component.js.map