"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTicketScenarioAutomationComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var AddTicketScenarioAutomationComponent = /** @class */ (function () {
    function AddTicketScenarioAutomationComponent(formbuilder, _scenarioService, _ticketAutomationSvc, snackBar, _utilityService, _appStateService, _ticketService, dialog, _authService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._scenarioService = _scenarioService;
        this._ticketAutomationSvc = _ticketAutomationSvc;
        this.snackBar = snackBar;
        this._utilityService = _utilityService;
        this._appStateService = _appStateService;
        this._ticketService = _ticketService;
        this.dialog = dialog;
        this._authService = _authService;
        this.nsp = '';
        this.email = '';
        this.selectedTags = [];
        this.selectedWatchers = [];
        this.selectedAgent = [];
        this.subscriptions = [];
        this.allScenarios = [];
        this.priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        this.stateList = ['OPEN', 'PENDING', 'SOLVED', 'CLOSED'];
        this.cloneScenario = false;
        this.selectedscenario = undefined;
        this.all_agents = [];
        this.watch_agents = [];
        this.originalAgents = [];
        this.ended = false;
        this.loadingMoreAgents = false;
        this.groups = [];
        this.tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
        this.datePickerConfig = {
            format: 'MM-DD-YYYY HH:mm',
            unSelectOnClick: false,
            closeOnSelect: true,
            hideInputContainer: false,
            hideOnOutsideClick: true,
            showGoToCurrent: true
        };
        this.config = {
            placeholder: 'Add Note..',
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['table', ['table']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontstyle', ['backcolor']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['linkDialogShow', 'unlink']],
                ['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]
            ]
        };
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.scenarioAutomation;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.nsp = this._scenarioService.Agent.nsp;
        this.email = this._scenarioService.Agent.email;
        this.subscriptions.push(this._scenarioService.AllScenarios.subscribe(function (data) {
            if (data && data.length) {
                _this.allScenarios = data;
            }
            else {
                _this.allScenarios = [];
            }
        }));
        this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(function (data) {
            if (data) {
                _this.groups = data;
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (data) {
            if (data) {
                _this.all_agents = data;
                _this.watch_agents = data;
                _this.originalAgents = data;
            }
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (data) {
            if (data) {
                _this.agent = data.email;
            }
        }));
        this.subscriptions.push(this._scenarioService.cloneScenario.subscribe(function (data) {
            _this.cloneScenario = data;
        }));
        this.subscriptions.push(this._scenarioService.selectedScenario.subscribe(function (data) {
            if (data) {
                _this.selectedscenario = data;
                _this.selectedscenario.actions.map(function (act) {
                    if (act.scenarioName == 'tagAssign') {
                        _this.selectedTags = act.scenarioValue;
                    }
                    if (act.scenarioName == 'watcherAssign') {
                        _this.selectedWatchers = act.scenarioValue;
                    }
                });
            }
            else {
                _this.selectedscenario = undefined;
            }
        }));
    }
    AddTicketScenarioAutomationComponent.prototype.ngOnInit = function () {
        this.scenarioForm = this.formbuilder.group({
            'scenarioTitle': [this.TicketScenarioObject.scenarioTitle,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(2)
                ]],
            'scenarioDesc': [this.TicketScenarioObject.scenarioDesc,
                [
                    forms_1.Validators.minLength(2)
                ]],
            'availableFor': [this.TicketScenarioObject.availableFor, []],
            'groupName': [this.TicketScenarioObject.groupName],
            'actions': this.formbuilder.array(this.TransformActions(this.TicketScenarioObject.actions), forms_1.Validators.required)
        });
        this.onValueChanges();
        // if (this.scenarioForm.get('actions').value.some(action => action.scenarioName == "groupAssign")) {
        //   console.log("yes");
        //   // this.subscriptions.push(this._ticketService.getAgentsAgainstGroup([this.sce.get('group').value]).subscribe(agents => {
        //   //   if (agents && agents.length) {
        //   //     this.all_agents = agents;
        //   //   }
        //   //   else {
        //   //     this.all_agents = []
        //   //   }
        //   // }));
        // } else {
        //   console.log("no");
        //   this.subscriptions.push(this._agentService.getAllAgentsList().subscribe(agents => {
        //     this.all_agents = agents;
        //   }));
        // }
    };
    AddTicketScenarioAutomationComponent.prototype.onValueChanges = function () {
        var _this = this;
        this.scenarioForm.valueChanges.subscribe(function (val) {
            _this.formChanges = val;
        });
    };
    AddTicketScenarioAutomationComponent.prototype.GetAvailableAgents = function (ev) {
        var _this = this;
        if (ev.target.value) {
            this._ticketService.getAgentsAgainstGroup([ev.target.value]).subscribe(function (agents) {
                if (agents && agents.length) {
                    _this.all_agents = agents;
                }
                else {
                    _this.all_agents = [];
                }
            });
        }
        else {
            this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
                _this.all_agents = agents;
            });
        }
    };
    AddTicketScenarioAutomationComponent.prototype.TransformActions = function (actions) {
        var _this = this;
        var fb = [];
        actions.map(function (action) {
            fb.push(_this.formbuilder.group({
                scenarioName: [action.scenarioName, [forms_1.Validators.required]],
                scenarioValue: [action.scenarioValue, []]
            }));
        });
        return fb;
    };
    AddTicketScenarioAutomationComponent.prototype.loadMoreAgents = function (agentsFromDB) {
        var _this = this;
        if (!this.ended && !this.loadingMoreAgents) {
            this.loadingMoreAgents = true;
            this._utilityService.getMoreAgentsObs(agentsFromDB).subscribe(function (response) {
                _this.all_agents = _this.all_agents.concat(response.agents);
                _this.ended = response.ended;
                _this.loadingMoreAgents = false;
            });
        }
    };
    AddTicketScenarioAutomationComponent.prototype.SearchAgent = function (value) {
        var _this = this;
        if (value) {
            if (!this.selectedAgent.length) {
                var agents_1 = this.all_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                                agents_1.push(element);
                            }
                        });
                    }
                    _this.all_agents = agents_1;
                });
            }
            else {
                var agents = this.all_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.all_agents = agents;
            }
        }
        else {
            this.all_agents = this.originalAgents;
            this.ended = false;
        }
    };
    AddTicketScenarioAutomationComponent.prototype.LoadMoreAgent = function () {
        var _this = this;
        if (!this.ended && !this.loadingMoreAgents && !this.selectedAgent.length) {
            this.loadingMoreAgents = true;
            this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(function (response) {
                _this.all_agents = _this.all_agents.concat(response.agents);
                _this.ended = response.ended;
                _this.loadingMoreAgents = false;
            });
        }
    };
    AddTicketScenarioAutomationComponent.prototype.moveUp = function (index) {
        if (index >= 1) {
            this.swap(this.scenarioForm.controls.actions.controls, index, index - 1);
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No action above, Not allowed!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
    };
    AddTicketScenarioAutomationComponent.prototype.moveDown = function (index) {
        if (index < this.scenarioForm.get('actions').length - 1) {
            this.swap(this.scenarioForm.controls.actions.controls, index, index + 1);
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No action below, Not allowed!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
    };
    AddTicketScenarioAutomationComponent.prototype.swap = function (array, index1, index2) {
        var temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    };
    AddTicketScenarioAutomationComponent.prototype.GetAvailableActions = function (i) {
        var actionList = {
            'agentAssign': 'Assign To Agent',
            'groupAssign': 'Assign To Group',
            'null1': '------------------',
            'priorityAssign': 'Set Priority',
            'stateAssign': 'Set State',
            'viewStateAssign': 'Set ViewState',
            'snoozeAssign': 'Set Snooze',
            'null2': '------------------',
            'noteAssign': 'Add Note',
            'tagAssign': 'Add Tag',
            'taskAssign': 'Add Task',
            'watcherAssign': 'Add Watcher'
            // 'null3': '------------------',
            // 'emailToGroup': 'Send Email to Group',
            // 'emailToAgent': 'Send Email to Agent',
        };
        var actions = this.scenarioForm.get('actions');
        actions.controls.map(function (control, index) {
            // if (actions.controls[index].get('scenarioName').value == "stateAssign" && actions.controls[index].get('scenarioValue').value == "CLOSED") {
            //   delete actionList['agentAssign'];
            // }
            if (actionList[actions.controls[index].get('scenarioName').value] && index != i) {
                delete actionList[actions.controls[index].get('scenarioName').value];
            }
        });
        return actionList;
    };
    AddTicketScenarioAutomationComponent.prototype.GetControls = function (name) {
        return this.scenarioForm.get(name).controls;
    };
    AddTicketScenarioAutomationComponent.prototype.AddAction = function () {
        var fb = this.formbuilder.group({
            scenarioName: [''],
            scenarioValue: ['']
        });
        var actions = this.scenarioForm.get('actions');
        actions.push(fb);
    };
    AddTicketScenarioAutomationComponent.prototype.DeleteAction = function (index, name) {
        // console.log(name)
        var actions = this.scenarioForm.get('actions');
        actions.removeAt(index);
        if (name == 'groupAssign') {
            this.all_agents = this.originalAgents;
        }
    };
    AddTicketScenarioAutomationComponent.prototype.AddTicketScenario = function () {
        var _this = this;
        if (this.allScenarios && this.allScenarios.filter(function (data) { return data.scenarioTitle.toLowerCase().trim() == _this.scenarioForm.get('scenarioTitle').value.toLowerCase().trim(); }).length > 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Ticket Scenario name already exists!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            var scenario = {
                nsp: this.nsp,
                scenarioTitle: this.scenarioForm.get('scenarioTitle').value,
                scenarioDesc: this.scenarioForm.get('scenarioDesc').value,
                availableFor: this.ParseAvailabeFor(this.scenarioForm.get('availableFor').value),
                groupName: this.scenarioForm.get('groupName').value && this.scenarioForm.get('groupName').value.length ? this.scenarioForm.get('groupName').value : [],
                actions: this.ParseActions(this.scenarioForm.get('actions')),
                created: { date: new Date().toISOString(), by: this.email }
            };
            // console.log(scenario);
            this._scenarioService.AddTicketScenario(scenario).subscribe(function (res) {
                if (res.status == "ok") {
                }
            });
        }
    };
    AddTicketScenarioAutomationComponent.prototype.UpdateTicketScenario = function () {
        var scenario = {
            nsp: this.nsp,
            scenarioTitle: this.scenarioForm.get('scenarioTitle').value,
            scenarioDesc: this.scenarioForm.get('scenarioDesc').value,
            availableFor: this.scenarioForm.get('availableFor').value,
            groupName: this.scenarioForm.get('groupName').value && this.scenarioForm.get('groupName').value.length ? this.scenarioForm.get('groupName').value : [],
            actions: this.ParseActions(this.scenarioForm.get('actions')),
            created: this.TicketScenarioObject.created
        };
        this.subscriptions.push(this._scenarioService.updateScenario(this.selectedscenario._id, scenario).subscribe(function (response) {
            if (response.status == 'ok') {
            }
        }));
    };
    AddTicketScenarioAutomationComponent.prototype.Cancel = function () {
        var _this = this;
        if (this.formChanges) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._scenarioService.AddScenario.next(false);
                    _this._scenarioService.selectedScenario.next(undefined);
                }
                else {
                    return;
                }
            });
        }
        else {
            this._scenarioService.AddScenario.next(false);
            this._scenarioService.selectedScenario.next(undefined);
        }
    };
    AddTicketScenarioAutomationComponent.prototype.ParseAvailabeFor = function (avFor) {
        var str = '';
        if (avFor == "me")
            str = this.agent;
        else
            str = avFor;
        return str;
    };
    AddTicketScenarioAutomationComponent.prototype.ParseActions = function (formArray) {
        var _this = this;
        var actions = [];
        formArray.controls.map(function (control) {
            switch (control.get('scenarioName').value) {
                case 'tagAssign':
                    control.get('scenarioValue').value = _this.selectedTags;
                    break;
                case 'watcherAssign':
                    control.get('scenarioValue').value = _this.selectedWatchers;
                    break;
                default:
                    control.get('scenarioValue').value = control.get('scenarioValue').value;
            }
            var obj = {
                scenarioName: control.get('scenarioName').value,
                scenarioValue: control.get('scenarioValue').value,
            };
            actions.push(obj);
        });
        return actions;
    };
    AddTicketScenarioAutomationComponent.prototype.ngOnDestroy = function () {
        this._scenarioService.AddScenario.next(false);
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.Input()
    ], AddTicketScenarioAutomationComponent.prototype, "TicketScenarioObject", void 0);
    AddTicketScenarioAutomationComponent = __decorate([
        core_1.Component({
            selector: 'app-add-ticket-scenario-automation',
            templateUrl: './add-ticket-scenario-automation.component.html',
            styleUrls: ['./add-ticket-scenario-automation.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AddTicketScenarioAutomationComponent);
    return AddTicketScenarioAutomationComponent;
}());
exports.AddTicketScenarioAutomationComponent = AddTicketScenarioAutomationComponent;
//# sourceMappingURL=add-ticket-scenario-automation.component.js.map