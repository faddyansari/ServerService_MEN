"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var TeamsComponent = /** @class */ (function () {
    function TeamsComponent(_authService, _appStateService, formbuilder, _utilityService, _teamService, dialog) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this._utilityService = _utilityService;
        this._teamService = _teamService;
        this.dialog = dialog;
        this.subscriptions = [];
        this.showForm = false;
        this.showAddAgentForm = false;
        this.editForm = false;
        this.agentList = [];
        this.agentList_original = [];
        this.selectedAgents = [];
        this.ended = false;
        this.isAgentSelected = false;
        this.searchValue = '';
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.team;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.tickets;
                _this.teamPermissions = data.permissions.settings.ticketManagement.teamManagement;
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (data) {
            // console.log(data);
            if (data) {
                _this.agentList = data;
                _this.agentList_original = data;
            }
        }));
        this.subscriptions.push(_teamService.Teams.subscribe(function (data) {
            _this.Teams = data;
        }));
        this.subscriptions.push(_teamService.selectedTeam.subscribe(function (data) {
            _this.selectedTeam = data;
            // console.log(this.selectedTeam);
        }));
        this.addTeamForm = this.formbuilder.group({
            'team_name': [null, forms_1.Validators.required],
            'desc': [null, forms_1.Validators.required]
        });
        this.editTeamForm = this.formbuilder.group({
            '_id': [{ value: null, disabled: true }, forms_1.Validators.required],
            'team_name': [null, forms_1.Validators.required],
            'desc': [null, forms_1.Validators.required]
        });
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            if (agent) {
                _this.Agent = agent;
                // console.log(this.Agent);
            }
        }));
    }
    TeamsComponent.prototype.ngOnInit = function () {
    };
    TeamsComponent.prototype.insertTeam = function () {
        var _this = this;
        if (!this.Teams.filter(function (t) { return t.team_name == _this.addTeamForm.get('team_name').value; }).length) {
            this._teamService.insertTeam(this.addTeamForm.value).subscribe(function (response) {
                // console.log(response);	
                if (response.status == 'ok') {
                    _this.showForm = false;
                    _this.addTeamForm.reset();
                }
            });
        }
        else {
            console.log('A team with this name already exists!');
        }
    };
    TeamsComponent.prototype.deleteTeam = function (event, id) {
        var _this = this;
        event.stopPropagation();
        event.stopImmediatePropagation();
        this._teamService.deleteTeam(id).subscribe(function (response) {
            // console.log(response);	
            if (_this.selectedTeam && _this.selectedTeam._id == id) {
                // this.selectedTeam = undefined;
                _this.showAddAgentForm = false;
            }
        });
    };
    TeamsComponent.prototype.updateTeam = function (id) {
        var _this = this;
        if (!this.Teams.filter(function (t) { return t.team_name == _this.addTeamForm.get('team_name').value; }).length) {
        }
    };
    TeamsComponent.prototype.setSelectedTeam = function (id) {
        // console.log(this.Teams.length);
        this._teamService.setSelectedTeam(id);
    };
    TeamsComponent.prototype.AddAgents = function () {
        var _this = this;
        this._teamService.addAgentsForTeam(this.selectedTeam._id, this.selectedAgents).subscribe(function (response) {
            if (response.status == 'ok') {
                _this.selectedAgents = [];
                _this.showAddAgentForm = false;
            }
        });
    };
    TeamsComponent.prototype.isAllAgentsChecked = function () {
        if (this.selectedTeam.agents.length) {
            return this.selectedTeam.agents.every(function (data) { return data.checked; });
        }
        else
            return false;
    };
    TeamsComponent.prototype.SelectAllAgents = function (event) {
        this.selectedTeam.agents.map(function (agent) { return agent.checked = event.target.checked; });
        if (this.selectedTeam.agents.every(function (data) { return data.checked; })) {
            this.isAgentSelected = true;
        }
        else {
            this.isAgentSelected = false;
        }
    };
    TeamsComponent.prototype.toggleAgentSelect = function (email) {
        this.selectedTeam.agents.map(function (agent) {
            if (agent.email == email) {
                agent.checked = !agent.checked;
                return agent;
            }
        });
        if (this.selectedTeam.agents.filter(function (data) { return data.checked; }).length) {
            this.isAgentSelected = true;
        }
        else {
            this.isAgentSelected = false;
        }
    };
    TeamsComponent.prototype.RemoveSelectedAgents = function () {
        var _this = this;
        console.log(this.selectedTeam.agents.filter(function (a) { return a.checked; }));
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Unassign Selected Agents?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                //   console.log('Delete!');
                var deleteList = _this.selectedTeam.agents.filter(function (agent) { return agent.checked; });
                // console.log(deleteList);
                deleteList.map(function (agent) {
                    // console.log(agent.email);
                    _this.removeAgent(agent.email);
                });
                _this.isAgentSelected = false;
            }
        });
    };
    TeamsComponent.prototype.removeAgent = function (email) {
        if (this.selectedTeam) {
            this._teamService.removeAgentsForTeam(this.selectedTeam._id, email);
        }
    };
    TeamsComponent.prototype.toggleExclude = function (email, value) {
        //    console.log(value);
        this._teamService.ToggleExclude(this.selectedTeam.team_name, email, value);
    };
    TeamsComponent.prototype.cancelRemoveAgent = function () {
        this.selectedTeam.agents.map(function (agent) { return agent.checked = false; });
        this.isAgentSelected = false;
    };
    TeamsComponent.prototype.filteredTeams = function () {
        var _this = this;
        if (this.teamPermissions && this.teamPermissions.canView == 'all') {
            return this.Teams;
        }
        else if (this.teamPermissions && this.teamPermissions.canView == 'custom') {
            var filteredTeams_1 = [];
            this.teamPermissions.teamViewList.forEach(function (t) {
                filteredTeams_1 = filteredTeams_1.concat(_this.Teams.filter(function (team) { return team.team_name == t; }));
            });
            return filteredTeams_1;
        }
        else if (this.teamPermissions && this.teamPermissions.canView == 'members') {
            var filteredTeams = [];
            filteredTeams = this.Teams.filter(function (team) { return team.agents.filter(function (a) { return a.email == _this.Agent.email; }).length; });
            return filteredTeams;
        }
        else {
            return this.Teams;
        }
    };
    TeamsComponent.prototype.checkVisibility = function () {
        var _this = this;
        if (this.selectedTeam) {
            if (this.filteredTeams().filter(function (t) { return t.team_name == _this.selectedTeam.team_name; }).length) {
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
    TeamsComponent.prototype.agentChecked = function () {
        var value = false;
        this.selectedTeam.agents.some(function (agent) {
            if (agent.checked) {
                return value = agent.checked;
            }
        });
        this.isAgentSelected = value;
    };
    TeamsComponent.prototype.ShowForm = function () {
        this.showForm = !this.showForm;
    };
    TeamsComponent.prototype.ShowAddAgentForm = function () {
        this.showAddAgentForm = !this.showAddAgentForm;
    };
    //Edit
    TeamsComponent.prototype.editTeam = function (team) {
        this.editTeamForm.get('_id').setValue(team._id);
        this.editTeamForm.get('team_name').setValue(team.team_name);
        this.editTeamForm.get('desc').setValue(team.desc);
        this.editForm = true;
    };
    TeamsComponent.prototype.save = function () {
        // console.log(this.editTeamForm.get('_id').value);
        // console.log(this.editTeamForm.value);
        var _this = this;
        if (!this.Teams.filter(function (t) { return t.team_name.toLowerCase() == _this.editTeamForm.get('team_name').value.toLowerCase() && t._id != _this.editTeamForm.get('_id').value; }).length) {
            this._teamService.editTeam(this.editTeamForm.get('_id').value, this.editTeamForm.value).subscribe(function (status) {
                if (status == 'ok') {
                    _this.editTeamForm.reset();
                    _this.editForm = false;
                }
                else {
                    alert('Error!');
                }
            });
        }
        else {
            alert('Team name already exists!');
        }
    };
    TeamsComponent.prototype.cancel = function () {
        this.editTeamForm.reset();
        this.editForm = false;
    };
    //Custom select events
    TeamsComponent.prototype.loadMore = function ($event) {
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
    TeamsComponent.prototype.onSearch = function (value) {
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
    TeamsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    TeamsComponent = __decorate([
        core_1.Component({
            selector: 'app-teams',
            templateUrl: './teams.component.html',
            styleUrls: ['./teams.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TeamsComponent);
    return TeamsComponent;
}());
exports.TeamsComponent = TeamsComponent;
//# sourceMappingURL=teams.component.js.map