"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketActionsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var TicketActionsComponent = /** @class */ (function () {
    function TicketActionsComponent(formbuilder, _ticketService, snackBar) {
        this.formbuilder = formbuilder;
        this._ticketService = _ticketService;
        this.snackBar = snackBar;
        this.tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
        // @Input('tagsFromBackend') tagsFromBackend: any;
        this._all_agents = [];
        this.agentList_original = [];
        this.ended = false;
        this.loadingMoreAgents = false;
        this.all_groups = [];
        this.fields = [];
        this.tagList = [];
        this.status = new core_1.EventEmitter();
        this.TagToAdd = new core_1.EventEmitter();
        this.TagToDelete = new core_1.EventEmitter();
        this.assignedAgent = new core_1.EventEmitter();
        this.assignedGroup = new core_1.EventEmitter();
        this.snoozeTime = new core_1.EventEmitter();
        this.loadMoreArg = new core_1.EventEmitter();
        this.SearchAgents = new core_1.EventEmitter();
        this.SaveCustomFields = new core_1.EventEmitter();
        this.subscriptions = [];
        this.datePickerConfig = {
            format: 'MM-DD-YYYY HH:mm',
            unSelectOnClick: false,
            closeOnSelect: true,
            hideInputContainer: false,
            hideOnOutsideClick: true,
            showGoToCurrent: true
        };
        this.selectedStatus = '';
        this.selectedGroup = '';
        this.selectedAgent = [];
        this.snooze_time = '';
        this.savingCustomFields = {};
        this.minimumSnoozeTimeError = false;
        this.tagForm = formbuilder.group({
            'hashTag': [
                '',
                [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(32),
                    forms_1.Validators.pattern(this.tagPattern)
                ],
            ]
        });
    }
    Object.defineProperty(TicketActionsComponent.prototype, "selectedThread", {
        get: function () {
            return this._selectedThread;
        },
        set: function (value) {
            this._selectedThread = value;
            this.selectedStatus = '';
            this.selectedGroup = this._selectedThread && this._selectedThread.group ? this._selectedThread.group : '';
            this.selectedAgent = this._selectedThread && this._selectedThread.assigned_to ? [this._selectedThread.assigned_to] : [];
            this.snooze_time = this._selectedThread && this._selectedThread.snoozes && this._selectedThread.snoozes.snooze_time ? this._selectedThread.snoozes.snooze_time : '';
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TicketActionsComponent.prototype, "all_agents", {
        get: function () {
            return this._all_agents;
        },
        set: function (value) {
            this._all_agents = value;
        },
        enumerable: false,
        configurable: true
    });
    TicketActionsComponent.prototype.ngOnInit = function () {
        this.selectedStatus = '';
        this.selectedGroup = this.selectedThread && this.selectedThread.group ? this.selectedThread.group : '';
        this.selectedAgent = this.selectedThread && this.selectedThread.assigned_to ? [this.selectedThread.assigned_to] : [];
        // console.log(this.selectedAgent);
        this.snooze_time = this.selectedThread && this.selectedThread.snoozes && this.selectedThread.snoozes.snooze_time ? this.selectedThread.snoozes.snooze_time : '';
    };
    TicketActionsComponent.prototype.DateSelected = function (event) {
        //Write Any Transforming Logic
        this.minimumSnoozeTimeError = false;
        this.minimumsnoozeTime = new Date(new Date(this.selectedThread && this.selectedThread.datetime).setMinutes(new Date().getMinutes() + 20)).toISOString();
        if (!!event.date.valueOf() && new Date(event.date.valueOf()).toISOString() < this.minimumsnoozeTime) {
            this.minimumSnoozeTimeError = true;
        }
    };
    TicketActionsComponent.prototype.changeStatus = function (state) {
        this.status.emit(state);
        this.selectedStatus = '';
    };
    TicketActionsComponent.prototype.selectTag = function (event) {
        var _this = this;
        if (event.target && event.target.value) {
            var intersection = void 0;
            var hashTag = event.target.value;
            if (!this.tagPattern.test(hashTag)) {
                this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Invalid tag!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'warning']
                });
                this.tagForm.reset();
                return;
            }
            if (this.selectedThread.tags && this.selectedThread.tags.length && this.selectedThread.tags.length >= 6) {
                this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: '/warning',
                        msg: 'Maximum tags limit reached!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'warning']
                });
                this.tagForm.reset();
                return;
            }
            var commaseparatedTags = this.RemoveDuplicateTags(hashTag.split(','));
            if (this.selectedThread && this.selectedThread.tags && this.selectedThread.tags.length) {
                intersection = commaseparatedTags.filter(function (element) { return !_this.selectedThread.tags.includes(element); });
                if (intersection && intersection.length) {
                    this.TagToAdd.emit(intersection);
                    this.tagForm.reset();
                }
                else {
                    this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Tag already added'
                        },
                        duration: 5000,
                        panelClass: ['user-alert', 'warning']
                    });
                    this.tagForm.reset();
                }
            }
            else {
                this.TagToAdd.emit(commaseparatedTags);
                this.tagForm.reset();
            }
        }
        //if custom writing is not allowed : if (this.tagList.indexOf(event.target.value) !== -1)
    };
    TicketActionsComponent.prototype.RemoveDuplicateTags = function (array) {
        var arr = {};
        array.map(function (value) { if (value.trim())
            arr[value] = value.trim(); });
        return Object.keys(arr);
    };
    TicketActionsComponent.prototype.DeleteTag = function (tag, i) {
        this.selectedThread.tags.splice(i, 1);
        this.TagToDelete.emit(tag);
    };
    TicketActionsComponent.prototype.AssignAgentForTicket = function (selectedAgent) {
        // console.log(selectedAgent);
        this.assignedAgent.emit(selectedAgent);
    };
    TicketActionsComponent.prototype.AssignGroupForTicket = function (selectedGroup) {
        this.assignedGroup.emit(selectedGroup);
    };
    TicketActionsComponent.prototype.Snooze = function (time) {
        this.snoozeTime.emit(time);
    };
    TicketActionsComponent.prototype.loadMore = function (event) {
        console.log('Load More!');
        this.loadMoreArg.emit(this.all_agents[this.all_agents.length - 1].first_name);
    };
    TicketActionsComponent.prototype.onSearch = function (value) {
        console.log('Search Agents');
        if (value) {
            // console.log(value);
            this.SearchAgents.emit(value);
        }
        else {
            this.all_agents = this.agentList_original;
        }
    };
    TicketActionsComponent.prototype.SaveCustomField = function (threadID, fieldName, fieldvalue) {
        console.log('Save custom fields!');
        this.savingCustomFields[fieldName] = true;
        // console.log(fieldName, fieldvalue);
        // this.selectedThread_copy.dynamicFields[fieldName] = fieldvalue;
        // console.log(this.selectedThread_copy[fieldName]);
        this.SaveCustomFields.emit({ threadID: threadID, fieldName: fieldName, fieldvalue: fieldvalue });
        this.savingCustomFields[fieldName] = false;
    };
    TicketActionsComponent.prototype.getAgentsForSelectedGroup = function () {
        console.log(this.selectedGroup);
    };
    __decorate([
        core_1.Input('permissions')
    ], TicketActionsComponent.prototype, "permissions", void 0);
    __decorate([
        core_1.Input()
    ], TicketActionsComponent.prototype, "selectedThread", null);
    __decorate([
        core_1.Input()
    ], TicketActionsComponent.prototype, "all_agents", null);
    __decorate([
        core_1.Input('agentList_original')
    ], TicketActionsComponent.prototype, "agentList_original", void 0);
    __decorate([
        core_1.Input('ended')
    ], TicketActionsComponent.prototype, "ended", void 0);
    __decorate([
        core_1.Input('loadingMoreAgents')
    ], TicketActionsComponent.prototype, "loadingMoreAgents", void 0);
    __decorate([
        core_1.Input('all_groups')
    ], TicketActionsComponent.prototype, "all_groups", void 0);
    __decorate([
        core_1.Input('fields')
    ], TicketActionsComponent.prototype, "fields", void 0);
    __decorate([
        core_1.Input('tagList')
    ], TicketActionsComponent.prototype, "tagList", void 0);
    __decorate([
        core_1.Output('status')
    ], TicketActionsComponent.prototype, "status", void 0);
    __decorate([
        core_1.Output('TagToAdd')
    ], TicketActionsComponent.prototype, "TagToAdd", void 0);
    __decorate([
        core_1.Output('TagToDelete')
    ], TicketActionsComponent.prototype, "TagToDelete", void 0);
    __decorate([
        core_1.Output('assignedAgent')
    ], TicketActionsComponent.prototype, "assignedAgent", void 0);
    __decorate([
        core_1.Output('assignedGroup')
    ], TicketActionsComponent.prototype, "assignedGroup", void 0);
    __decorate([
        core_1.Output('snoozeTime')
    ], TicketActionsComponent.prototype, "snoozeTime", void 0);
    __decorate([
        core_1.Output('loadMoreArg')
    ], TicketActionsComponent.prototype, "loadMoreArg", void 0);
    __decorate([
        core_1.Output('SearchAgents')
    ], TicketActionsComponent.prototype, "SearchAgents", void 0);
    __decorate([
        core_1.Output('SaveCustomFields')
    ], TicketActionsComponent.prototype, "SaveCustomFields", void 0);
    TicketActionsComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-actions',
            templateUrl: './ticket-actions.component.html',
            styleUrls: ['./ticket-actions.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], TicketActionsComponent);
    return TicketActionsComponent;
}());
exports.TicketActionsComponent = TicketActionsComponent;
//# sourceMappingURL=ticket-actions.component.js.map