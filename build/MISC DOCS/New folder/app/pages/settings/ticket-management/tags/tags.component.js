"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/switchMap");
var TagsComponent = /** @class */ (function () {
    // pill2 = false;
    function TagsComponent(_authService, formbuilder, _utilityService, _tagService, _groupsAutomationSettings, snackBar, dialog, _ticketService, _ticketAutomationService, _appStateService) {
        var _this = this;
        this._authService = _authService;
        this.formbuilder = formbuilder;
        this._utilityService = _utilityService;
        this._tagService = _tagService;
        this._groupsAutomationSettings = _groupsAutomationSettings;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._ticketService = _ticketService;
        this._ticketAutomationService = _ticketAutomationService;
        this._appStateService = _appStateService;
        this.Group = [];
        this.subscriptions = [];
        this.selectedAgents = [];
        this.dropdownSettings = {};
        this.edit = false;
        this.showForm = false;
        this.showAssignAgentForm = false;
        this.showTagKeywordsForm = false;
        this.showAgentForm = false;
        this.tag_keyword = '';
        this.agent_list = [];
        this.tag_keywords = [];
        this.enableDeleteForAgent = false;
        this.isAgentSelected = false;
        this.isKeywordSelected = false;
        this.enableDeleteForKeywords = false;
        this.pill1 = true;
        this.pill2 = false;
        this.ended = false;
        this.searchValue = '';
        // console.log('Groups Constructor');
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.groups;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.tickets;
                _this.groupPermissions = data.permissions.settings.ticketManagement.groupManagement;
            }
        }));
        this.addGroupForm = this.formbuilder.group({
            'group_name': [null, forms_1.Validators.required],
            'desc': [null, forms_1.Validators.required]
        });
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            if (agent) {
                _this.Agent = agent;
                // console.log(this.Agent);
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (data) {
            // console.log(data);
            if (data) {
                _this.agentList = data;
                _this.agentList_original = data;
            }
        }));
        this.subscriptions.push(this._appStateService.currentRoute.subscribe(function (data) {
            // console.log(data);
            _this.route = data;
        }));
        // this.subscriptions.push(this._groupsAutomationSettings.groupsAutomationSettings.subscribe(data => {
        //     // console.log(data);
        //     if (data) {
        //         this.groupsAutomationSettings = data
        //         this.auto_assign = this.groupsAutomationSettings.auto_assign;
        //     }
        // }));
        // this.subscriptions.push(this._tagsAutomationSettings.auto_assign.subscribe(data=>{
        // 	this.auto_assign = data
        // }));
        this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(function (data) {
            if (data) {
                // console.log(data);
                _this.Group = data;
            }
        }));
        this.subscriptions.push(this._ticketAutomationService.selectedGroup.subscribe(function (data) {
            _this.selectedGroup = data;
            // console.log(data);
            if (_this.selectedGroup) {
                if (_this.selectedGroup.agent_list && _this.selectedGroup.agent_list.length) {
                    _this.agent_list = _this.selectedGroup.agent_list;
                }
                else {
                    _this.agent_list = [];
                }
            }
            // console.log(this.selectedGroup);
        }));
    }
    TagsComponent.prototype.ngOnInit = function () {
    };
    TagsComponent.prototype.ngAfterViewInit = function () {
    };
    TagsComponent.prototype.onItemSelect = function (item) {
        // console.log("Select", item);
        //Only insert tags if its distinct
        if (!this.selectedAgents.includes(item)) {
            this.selectedAgents.push(item);
        }
        // console.log(this.selectedAgents);
    };
    TagsComponent.prototype.resetList = function () {
        this.agentList = this.agentList_original;
    };
    TagsComponent.prototype.setSelectedGroup = function (group_name) {
        this._ticketAutomationService.setSelectedGroup(group_name);
        this.showAgentForm = false;
    };
    // SelectCurrentTag(tag: string) {
    //     this.selectedTag = tag;
    //     let data = this.Tag.tags.find(tag => tag.tag == this.selectedTag);
    //     // this.agent_list = data.agent_list;
    //     // let tagKeywords = data.tag_keywords;
    //     this.tag_keywords = [];
    //     if (tagKeywords) {
    //         tagKeywords.map(keyword => {
    //             let data: any = {
    //                 key: keyword
    //             }
    //             this.tag_keywords.push(data);
    //         });
    //     }
    //     // console.log(data);
    // }
    // onSelectAll(items: any) {
    //     //Empty the List before adding new tags on Select All
    //     this.selectedAgents = [];
    //     items.forEach(element => {
    //         if (!this.selectedAgents.includes(element)) {
    //             this.selectedAgents.push(element);
    //         }
    //     });
    //     // console.log(this.selectedAgents);
    // }
    TagsComponent.prototype.loadMore = function ($event) {
        var _this = this;
        console.log('Scroll');
        if (!this.ended) {
            console.log('Fetch More');
            this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(function (response) {
                console.log(response);
                _this.agentList = _this.agentList.concat(response.agents);
                _this.ended = response.ended;
            });
        }
    };
    TagsComponent.prototype.onSearch = function (value) {
        var _this = this;
        console.log('Search');
        console.log(value);
        if (value) {
            var agents_1 = this.agentList_original.filter(function (a) { return a.email.includes(value.toLowerCase()); });
            this._utilityService.SearchAgent(value).subscribe(function (response) {
                //console.log(response);
                if (response && response.agentList.length) {
                    response.agentList.forEach(function (element) {
                        if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                            agents_1.push(element);
                        }
                    });
                }
                _this.agentList = agents_1;
            });
            // this.agentList = agents;
        }
        else {
            this.agentList = this.agentList_original;
            this.ended = false;
            // this.setScrollEvent();
        }
    };
    TagsComponent.prototype.setPillActive = function (pill) {
        switch (pill) {
            case 'pill1':
                this.pill1 = true;
                this.pill2 = false;
                break;
            case 'pill2':
                this.pill1 = false;
                this.pill2 = true;
                break;
        }
    };
    // onDeSelectAll(items: any) {
    //     this.selectedAgents = [];
    // }
    // onItemDeSelect(item: any) {
    //     // console.log("Deselect", item);
    //     //Remove the deselected item from the filter tag array
    //     const index: number = this.selectedAgents.indexOf(item);
    //     if (index !== -1) {
    //         this.selectedAgents.splice(index, 1);
    //     }
    //     // console.log(this.selectedAgents);
    // }
    TagsComponent.prototype.insertGroup = function () {
        var _this = this;
        var group = {
            group_name: String(this.addGroupForm.get('group_name').value).trim(),
            group_desc: this.addGroupForm.get('desc').value,
            agent_list: [],
            auto_assign: {
                enabled: false,
                type: 'roundrobin'
            }
        };
        if (this.Group && this.Group.filter(function (data) { return data.group_name == group.group_name.toLowerCase(); }).length > 0) {
            // console.log("already exists");
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Group Name already exists!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'error']
            });
        }
        else {
            this._ticketAutomationService.insertGroup(group).subscribe(function (response) {
                if (response == 'ok') {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Group added Successfully!'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'success']
                    });
                    _this.addGroupForm.controls['group_name'].setValue('');
                    _this.addGroupForm.controls['desc'].setValue('');
                }
                else {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: response
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                }
            });
        }
    };
    TagsComponent.prototype.StopPropagation = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    };
    TagsComponent.prototype.deleteGroup = function (group_name) {
        // this._ticketService.getTicketsByGroup(group_name).subscribe(res=>{
        //     if(res.status =="ok"){
        //         console.log(res);
        //         if(res.data.group == group_name ){
        //             this.dialog.open(ConfirmationDialogComponent, {
        //                 panelClass: ['confirmation-dialog'],
        //                 data: { headermsg: 'Are You Sure You Want To Delete this Group? Deleting this group will move tickets assigned this group to Default group' }
        //             }).afterClosed().subscribe(data => {
        //                 if (data == 'ok') {
        //                     // this._ticketService.moveTicketsToDefault("default group");
        //                 }
        //             });
        //         }
        //     }
        var _this = this;
        // })
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Delete?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._ticketAutomationService.deleteGroup(group_name);
                _this.showAssignAgentForm = false;
                _this.agent_list = [];
                // this.showTagKeywordsForm = false;
                // this.tag_keywords = [];
            }
        });
    };
    // deleteTag(tag_name: any) {
    //     this.dialog.open(ConfirmationDialogComponent, {
    //         panelClass: ['confirmation-dialog'],
    //         data: { headermsg: 'Are You Sure You Want To Delete?' }
    //     }).afterClosed().subscribe(data => {
    //         if (data == 'ok') {
    //             this._tagService.deleteTag(tag_name);
    //             this.selectedTag = '';
    //             this.showAssignAgentForm = false;
    //             this.agent_list = [];
    //             this.showTagKeywordsForm = false;
    //             this.tag_keywords = [];
    //         }
    //     });
    // }
    TagsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    TagsComponent.prototype.SetAutoAssign = function (value) {
        this.selectedGroup.auto_assign.enabled = value;
        // console.log(this.auto_assign);
    };
    TagsComponent.prototype.SaveAutoAssign = function () {
        this._ticketAutomationService.setAutoAssign(this.selectedGroup.group_name, this.selectedGroup.auto_assign);
    };
    // Agent UnAssign Work
    TagsComponent.prototype.SelectAllAgents = function (event) {
        this.agent_list.map(function (agent) { return agent.checked = event.target.checked; });
        if (this.agent_list.every(function (data) { return data.checked; })) {
            this.isAgentSelected = true;
        }
        else {
            this.isAgentSelected = false;
        }
    };
    TagsComponent.prototype.isAllAgentsChecked = function () {
        return this.agent_list.every(function (data) { return data.checked; });
    };
    TagsComponent.prototype.cancelAssignAgent = function () {
        this.agent_list.map(function (agent) { return agent.checked = false; });
        this.isAgentSelected = false;
    };
    TagsComponent.prototype.agentChecked = function () {
        var value = false;
        this.agent_list.some(function (agent) {
            if (agent.checked) {
                return value = agent.checked;
            }
        });
        this.isAgentSelected = value;
    };
    TagsComponent.prototype.UnAssignSelectedAgents = function () {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Unassign Selected Agents?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                //   console.log('Delete!');
                var deleteList = _this.agent_list.filter(function (agent) { return agent.checked; });
                // console.log(deleteList);
                deleteList.map(function (agent) {
                    // console.log(agent.email);
                    _this.UnAssignAgent(agent.email);
                });
                _this.isAgentSelected = false;
            }
        });
    };
    TagsComponent.prototype.UnAssignAgent = function (email) {
        if (this.selectedGroup) {
            this._ticketAutomationService.unAssignAgent(email, this.selectedGroup.group_name);
        }
    };
    TagsComponent.prototype.toggleAdmin = function (email, value) {
        //    console.log(value);
        this._ticketAutomationService.ToggleAdmin(this.selectedGroup.group_name, email, value);
    };
    TagsComponent.prototype.toggleExclude = function (email, value) {
        //    console.log(value);
        // let turnCount = 0;
        // if(!value){
        //     let maxCounts = this.selectedGroup.agent_list.map(a =>a.turnCount);
        //     turnCount = Math.max(...maxCounts);
        //     if(turnCount != 0) turnCount = turnCount - 1;
        // }
        this._ticketAutomationService.ToggleExclude(this.selectedGroup.group_name, email, value);
    };
    // Agent UnAssign Work End
    TagsComponent.prototype.AssignAgent = function () {
        // console.log("here");
        // console.log(this.selectedAgents);
        var _this = this;
        this.selectedAgents.forEach(function (agent) {
            if (_this.agent_list && _this.agent_list.filter(function (data) { return data.email == agent; }).length > 0) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Selected agent already exists'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'error']
                });
            }
            else {
                if (_this.selectedGroup) {
                    // let maxCounts = this.selectedGroup.agent_list.map(a =>a.turnCount);
                    // let turnCount = Math.max(...maxCounts);
                    // if(turnCount != 0) turnCount = turnCount - 1;
                    _this._ticketAutomationService.assignAgent(agent, _this.selectedGroup.group_name);
                }
            }
        });
        this.selectedAgents = [];
    };
    TagsComponent.prototype.filteredGroups = function () {
        var _this = this;
        if (this.groupPermissions && this.groupPermissions.canView == 'all') {
            return this.Group;
        }
        else if (this.groupPermissions && this.groupPermissions.canView == 'custom') {
            var filteredGroups_1 = [];
            this.groupPermissions.groupViewList.forEach(function (g) {
                filteredGroups_1 = filteredGroups_1.concat(_this.Group.filter(function (group) { return group.group_name == g; }));
            });
            return filteredGroups_1;
        }
        else if (this.groupPermissions && this.groupPermissions.canView == 'admins') {
            var filteredGroups = [];
            filteredGroups = this.Group.filter(function (group) { return group.agent_list.filter(function (a) { return a.email == _this.Agent.email && a.isAdmin; }).length; });
            return filteredGroups;
        }
        else {
            return this.Group;
        }
    };
    TagsComponent.prototype.checkVisibility = function () {
        var _this = this;
        if (this.selectedGroup) {
            if (this.filteredGroups().filter(function (g) { return g.group_name == _this.selectedGroup.group_name; }).length) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    TagsComponent.prototype.ShowForm = function () {
        this.showForm = !this.showForm;
    };
    TagsComponent.prototype.ShowAssignAgentForm = function () {
        this.showAssignAgentForm = !this.showAssignAgentForm;
    };
    TagsComponent.prototype.addAgentForm = function () {
        this.showAgentForm = !this.showAgentForm;
    };
    TagsComponent = __decorate([
        core_1.Component({
            selector: 'app-tags',
            templateUrl: './tags.component.html',
            styleUrls: ['./tags.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TagsComponent);
    return TagsComponent;
}());
exports.TagsComponent = TagsComponent;
//# sourceMappingURL=tags.component.js.map