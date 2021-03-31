"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketViewHistoryComponent = void 0;
var core_1 = require("@angular/core");
var TicketViewHistoryComponent = /** @class */ (function () {
    function TicketViewHistoryComponent(cdRef) {
        this.cdRef = cdRef;
        this.allActivatedPolicies = [];
        this.all_agents = [];
        this.agentList_original = [];
        this.all_groups = [];
        this.ended = false;
        this.loadingMoreAgents = false;
        this.fields = [];
        this.tagList = [];
        this.currAgent = undefined;
        this.loadingReg = false;
        this.showFlyoutModelChange = new core_1.EventEmitter();
        //TICKET ACTION
        this.ticketStatus = new core_1.EventEmitter();
        this.assignedAgent = new core_1.EventEmitter();
        this.AssignedGroup = new core_1.EventEmitter();
        this.TagToAdd = new core_1.EventEmitter();
        this.TagToDelete = new core_1.EventEmitter();
        this.snoozeTime = new core_1.EventEmitter();
        this.loadMore = new core_1.EventEmitter();
        this.SearchAgents = new core_1.EventEmitter();
        //NOTES
        this.ticketnote = new core_1.EventEmitter();
        this.deleteNote = new core_1.EventEmitter();
        //ICON REGISTRATION  
        this.loadingIconSearch = false;
        this.searchedData = [];
        this.countryName = '';
        this.iconRegistration = new core_1.EventEmitter();
        this.iconSearchData = new core_1.EventEmitter();
        this.agentName = '';
        //TASKS
        this.tasks = new core_1.EventEmitter();
        this.checkedTask = new core_1.EventEmitter();
        this.removeId = new core_1.EventEmitter();
        this.updateTask = new core_1.EventEmitter();
        this.demergeInfo = new core_1.EventEmitter();
        //HISTORY
        this.threadId = new core_1.EventEmitter();
        this.SaveCustomFields = new core_1.EventEmitter();
        this.tabs = {
            "ticketDetail": true,
            "taskList": false,
            "editNote": false,
            "activityLog": false,
            "ticketHistory": false,
            "browsingHistory": false,
            "mergedTickets": false,
            "activatedPolicies": false,
            "iconRegistration": false,
            "searchIconCustomer": false
        };
    }
    TicketViewHistoryComponent.prototype.ngOnInit = function () {
    };
    TicketViewHistoryComponent.prototype.onEnter = function (task) {
        this.tasks.emit(task);
    };
    TicketViewHistoryComponent.prototype.TaskDone = function (checkedTask) {
        this.checkedTask.emit(checkedTask);
    };
    TicketViewHistoryComponent.prototype.displaySource = function (source) {
        switch (source) {
            case 'email':
                return { name: 'Email', img: 'email-colored' };
            case 'livechat':
                return { name: 'Live Chat', img: 'visitors-colored' };
            case 'panel':
                return { name: 'Beelinks Portal', img: 'agents-colored' };
            default:
                return { name: 'N/A', img: 'agents' };
        }
    };
    TicketViewHistoryComponent.prototype.deleteTask = function (removeId) {
        this.removeId.emit(removeId);
    };
    TicketViewHistoryComponent.prototype.editedTask = function (updatedTodo) {
        this.updateTask.emit(updatedTodo);
    };
    TicketViewHistoryComponent.prototype.CloseViewHistory = function () {
        this.showFlyoutModelChange.emit(!this.showFlyoutModel);
    };
    TicketViewHistoryComponent.prototype.SaveNote = function (note) {
        this.ticketnote.emit(note);
    };
    TicketViewHistoryComponent.prototype.DeleteNote = function (noteId) {
        this.deleteNote.emit(noteId);
    };
    TicketViewHistoryComponent.prototype.SearchData = function (data) {
        this.iconSearchData.emit(data);
    };
    TicketViewHistoryComponent.prototype.vhListTabs = function (tabName) {
        var _this = this;
        Object.keys(this.tabs).map(function (k) {
            if (k == tabName) {
                _this.tabs[k] = true;
            }
            else {
                _this.tabs[k] = false;
            }
        });
    };
    TicketViewHistoryComponent.prototype.AssignAgentForTicket = function (agent) {
        this.assignedAgent.emit(agent);
    };
    TicketViewHistoryComponent.prototype.AssignGroup = function (group) {
        this.AssignedGroup.emit(group);
    };
    TicketViewHistoryComponent.prototype.SetSelectedThread = function (id) {
        this.threadId.emit(id);
    };
    TicketViewHistoryComponent.prototype.addTags = function (tags) {
        this.TagToAdd.emit(tags);
    };
    TicketViewHistoryComponent.prototype.deleteTags = function (tag) {
        this.TagToDelete.emit(tag);
    };
    TicketViewHistoryComponent.prototype.changeState = function (status) {
        this.ticketStatus.emit(status);
    };
    TicketViewHistoryComponent.prototype.Snooze = function (time) {
        this.snoozeTime.emit(time);
    };
    TicketViewHistoryComponent.prototype.Demerge = function (obj) {
        this.demergeInfo.emit(obj);
    };
    TicketViewHistoryComponent.prototype.loadMoreAgent = function (agent) {
        this.loadMore.emit(agent);
    };
    TicketViewHistoryComponent.prototype.SaveCustomField = function (event) {
        this.SaveCustomFields.emit(event);
    };
    TicketViewHistoryComponent.prototype.OnSearchAgent = function (agent) {
        this.SearchAgents.emit(agent);
    };
    TicketViewHistoryComponent.prototype.RegisterCustomer = function (data) {
        this.iconRegistration.emit(data);
    };
    __decorate([
        core_1.Input('selectedThread')
    ], TicketViewHistoryComponent.prototype, "selectedThread", void 0);
    __decorate([
        core_1.Input('allActivatedPolicies')
    ], TicketViewHistoryComponent.prototype, "allActivatedPolicies", void 0);
    __decorate([
        core_1.Input('permissions')
    ], TicketViewHistoryComponent.prototype, "permissions", void 0);
    __decorate([
        core_1.Input('all_agents')
    ], TicketViewHistoryComponent.prototype, "all_agents", void 0);
    __decorate([
        core_1.Input('agentList_original')
    ], TicketViewHistoryComponent.prototype, "agentList_original", void 0);
    __decorate([
        core_1.Input('all_groups')
    ], TicketViewHistoryComponent.prototype, "all_groups", void 0);
    __decorate([
        core_1.Input('visitor_ticket_history')
    ], TicketViewHistoryComponent.prototype, "visitor_ticket_history", void 0);
    __decorate([
        core_1.Input('ended')
    ], TicketViewHistoryComponent.prototype, "ended", void 0);
    __decorate([
        core_1.Input('loadingMoreAgents')
    ], TicketViewHistoryComponent.prototype, "loadingMoreAgents", void 0);
    __decorate([
        core_1.Input('fields')
    ], TicketViewHistoryComponent.prototype, "fields", void 0);
    __decorate([
        core_1.Input('tagList')
    ], TicketViewHistoryComponent.prototype, "tagList", void 0);
    __decorate([
        core_1.Input('currAgent')
    ], TicketViewHistoryComponent.prototype, "currAgent", void 0);
    __decorate([
        core_1.Input('loadingReg')
    ], TicketViewHistoryComponent.prototype, "loadingReg", void 0);
    __decorate([
        core_1.Input('showFlyoutModel')
    ], TicketViewHistoryComponent.prototype, "showFlyoutModel", void 0);
    __decorate([
        core_1.Output('showFlyoutModelChange')
    ], TicketViewHistoryComponent.prototype, "showFlyoutModelChange", void 0);
    __decorate([
        core_1.Output('ticketStatus')
    ], TicketViewHistoryComponent.prototype, "ticketStatus", void 0);
    __decorate([
        core_1.Output('assignedAgent')
    ], TicketViewHistoryComponent.prototype, "assignedAgent", void 0);
    __decorate([
        core_1.Output('AssignedGroup')
    ], TicketViewHistoryComponent.prototype, "AssignedGroup", void 0);
    __decorate([
        core_1.Output('TagToAdd')
    ], TicketViewHistoryComponent.prototype, "TagToAdd", void 0);
    __decorate([
        core_1.Output('TagToDelete')
    ], TicketViewHistoryComponent.prototype, "TagToDelete", void 0);
    __decorate([
        core_1.Output('snoozeTime')
    ], TicketViewHistoryComponent.prototype, "snoozeTime", void 0);
    __decorate([
        core_1.Output('loadMore')
    ], TicketViewHistoryComponent.prototype, "loadMore", void 0);
    __decorate([
        core_1.Output('SearchAgents')
    ], TicketViewHistoryComponent.prototype, "SearchAgents", void 0);
    __decorate([
        core_1.Output('ticketnote')
    ], TicketViewHistoryComponent.prototype, "ticketnote", void 0);
    __decorate([
        core_1.Output('deleteNote')
    ], TicketViewHistoryComponent.prototype, "deleteNote", void 0);
    __decorate([
        core_1.Input('loadingIconSearch')
    ], TicketViewHistoryComponent.prototype, "loadingIconSearch", void 0);
    __decorate([
        core_1.Input('searchedData')
    ], TicketViewHistoryComponent.prototype, "searchedData", void 0);
    __decorate([
        core_1.Input('countryName')
    ], TicketViewHistoryComponent.prototype, "countryName", void 0);
    __decorate([
        core_1.Output('iconRegistration')
    ], TicketViewHistoryComponent.prototype, "iconRegistration", void 0);
    __decorate([
        core_1.Output('iconSearchData')
    ], TicketViewHistoryComponent.prototype, "iconSearchData", void 0);
    __decorate([
        core_1.Input('agentName')
    ], TicketViewHistoryComponent.prototype, "agentName", void 0);
    __decorate([
        core_1.Output('tasks')
    ], TicketViewHistoryComponent.prototype, "tasks", void 0);
    __decorate([
        core_1.Output('checkedTask')
    ], TicketViewHistoryComponent.prototype, "checkedTask", void 0);
    __decorate([
        core_1.Output('removeId')
    ], TicketViewHistoryComponent.prototype, "removeId", void 0);
    __decorate([
        core_1.Output('updateTask')
    ], TicketViewHistoryComponent.prototype, "updateTask", void 0);
    __decorate([
        core_1.Output('demergeInfo')
    ], TicketViewHistoryComponent.prototype, "demergeInfo", void 0);
    __decorate([
        core_1.Output('threadId')
    ], TicketViewHistoryComponent.prototype, "threadId", void 0);
    __decorate([
        core_1.Output('SaveCustomFields')
    ], TicketViewHistoryComponent.prototype, "SaveCustomFields", void 0);
    TicketViewHistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-view-history',
            templateUrl: './ticket-view-history.component.html',
            styleUrls: ['./ticket-view-history.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], TicketViewHistoryComponent);
    return TicketViewHistoryComponent;
}());
exports.TicketViewHistoryComponent = TicketViewHistoryComponent;
//# sourceMappingURL=ticket-view-history.component.js.map