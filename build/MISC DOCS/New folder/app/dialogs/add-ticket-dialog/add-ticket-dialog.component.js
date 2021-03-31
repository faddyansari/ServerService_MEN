"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTicketDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var AddTicketDialogComponent = /** @class */ (function () {
    function AddTicketDialogComponent(_authService, _socketService, formbuilder, _ticketService, _utilityService, _formDesignerService, _ticketTemplateService, _ticketAutosvc, dialogRef) {
        var _this = this;
        this._authService = _authService;
        this.formbuilder = formbuilder;
        this._ticketService = _ticketService;
        this._utilityService = _utilityService;
        this._formDesignerService = _formDesignerService;
        this._ticketTemplateService = _ticketTemplateService;
        this._ticketAutosvc = _ticketAutosvc;
        this.dialogRef = dialogRef;
        this.subscriptions = [];
        this.groupsList = [];
        this.selectedTags = [];
        this.watch_agents = [];
        this.selectedWatchers = [];
        this.selectedAgent = [];
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.numberRegex = /^([^0-9]*)$/;
        this.SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
        this.whiteSpace = /^[^\s]+(\s+[^\s]+)*$/;
        this.tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
        this.loading = false;
        this.submitted = false;
        this.cannedForms = [];
        this.ticketTemplates = [];
        this.groups = [];
        this.all_agents = [];
        this.OriginalAgents = [];
        this.endedWatchers = false;
        this.loadingMoreAgentsWatchers = false;
        this.ended = false;
        this.loadingMoreAgents = false;
        this.addTicketForm = formbuilder.group({
            'subject': [null, [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpace)]],
            'state': ['', forms_1.Validators.required],
            'priority': ['', forms_1.Validators.required],
            'cannedForm': [''],
            'assigned_to': ['', []],
            'group': ['', []],
            'tags': [[], []],
            'watchers': [[], []],
            'visitor': formbuilder.group({
                'name': [null, [forms_1.Validators.required, forms_1.Validators.pattern(this.numberRegex), forms_1.Validators.pattern(this.SpecialChar)]],
                'email': [null,
                    [
                        forms_1.Validators.pattern(this.emailPattern),
                        forms_1.Validators.required
                    ]
                ],
                'message': ['Hello!'],
            })
        });
        this.subscriptions.push(_socketService.getSocket().subscribe(function (data) { return _this.socket = data; }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(this._ticketAutosvc.Groups.subscribe(function (data) {
            if (data && data.length) {
                _this.groups = data;
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (data) {
            if (data) {
                _this.all_agents = data;
                _this.watch_agents = data;
                _this.OriginalAgents = data;
            }
        }));
        this.subscriptions.push(this._formDesignerService.WholeForm.subscribe(function (data) {
            if (data && data.length)
                _this.cannedForms = data;
        }));
        /**
         * To check if template is allowed to be in list or not?
         */
        this.subscriptions.push(this._ticketTemplateService.AllTemplates.subscribe(function (data) {
            if (data && data.length) {
                var agents_1 = [];
                data.map(function (res) {
                    if (res.availableFor == "allagents") {
                        _this.ticketTemplates.push(res);
                    }
                    else {
                        //see for agent in group from groups defined in groupNames..
                        var filteredagent = _this.groups.filter(function (g) { return res.groupName.includes(g.group_name); }).map(function (g) { return g.agent_list; });
                        filteredagent.map(function (g) {
                            g.map(function (agent) {
                                if (agent.email == _this.agent.email) {
                                    agents_1.push(agent.email);
                                }
                            });
                        });
                        if (agents_1 && agents_1.length) {
                            _this.ticketTemplates.push(res);
                        }
                    }
                });
            }
        }));
    }
    //ASSIGNED_TO
    AddTicketDialogComponent.prototype.loadMoreAssignAgent = function (value) {
        var _this = this;
        if (!this.ended && !this.loadingMoreAgents && !this.selectedAgent.length) {
            //console.log('Fetch More');
            this.loadingMoreAgents = true;
            this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(function (response) {
                //console.log(response);
                _this.all_agents = _this.all_agents.concat(response.agents);
                _this.ended = response.ended;
                _this.loadingMoreAgents = false;
            });
        }
    };
    AddTicketDialogComponent.prototype.onSearchAssignAgent = function (value) {
        var _this = this;
        console.log('Search');
        if (value) {
            if (!this.selectedAgent.length) {
                var agents_2 = this.all_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    //console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_2.filter(function (a) { return a.email == element.email; }).length) {
                                agents_2.push(element);
                            }
                        });
                    }
                    _this.all_agents = agents_2;
                });
            }
            else {
                var agents = this.all_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.all_agents = agents;
            }
            // this.agentList = agents;
        }
        else {
            this.all_agents = this.OriginalAgents;
            this.ended = false;
            // this.setScrollEvent();
        }
    };
    AddTicketDialogComponent.prototype.onDeSelectAssignAgent = function (value) {
        this.selectedAgent = value;
    };
    //WATCHERS
    AddTicketDialogComponent.prototype.loadMoreWatchers = function (event) {
        var _this = this;
        if (!this.endedWatchers && !this.loadingMoreAgentsWatchers && !this.selectedWatchers.length) {
            //console.log('Fetch More');
            this.loadingMoreAgentsWatchers = true;
            this._utilityService.getMoreAgentsObs(this.watch_agents[this.watch_agents.length - 1].first_name).subscribe(function (response) {
                //console.log(response);
                _this.watch_agents = _this.watch_agents.concat(response.agents);
                _this.endedWatchers = response.ended;
                _this.loadingMoreAgentsWatchers = false;
            });
        }
    };
    AddTicketDialogComponent.prototype.onSearchWatchers = function (value) {
        var _this = this;
        console.log('Search');
        if (value) {
            if (!this.selectedWatchers.length) {
                var agents_3 = this.watch_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    //console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_3.filter(function (a) { return a.email == element.email; }).length) {
                                agents_3.push(element);
                            }
                        });
                    }
                    _this.watch_agents = agents_3;
                });
            }
            else {
                var agents = this.watch_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.watch_agents = agents;
            }
            // this.agentList = agents;
        }
        else {
            this.watch_agents = this.OriginalAgents;
            this.endedWatchers = false;
            // this.setScrollEvent();
        }
    };
    AddTicketDialogComponent.prototype.onDeSelect = function (event) {
        this.selectedWatchers = event;
    };
    AddTicketDialogComponent.prototype.noWhitespaceValidator = function (control) {
        var isWhitespace = (control.value || '').trim().length === 0;
        var isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    };
    AddTicketDialogComponent.prototype.GetAvailableAgents = function () {
        var _this = this;
        if (this.addTicketForm.get('group').value) {
            this._ticketService.getAgentsAgainstGroup([this.addTicketForm.get('group').value]).subscribe(function (agents) {
                if (agents && agents.length) {
                    _this.addTicketForm.get('assigned_to').setValue('');
                    _this.selectedAgent = [];
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
    AddTicketDialogComponent.prototype.submitForm = function () {
        if (this.addTicketForm.valid) {
            //OLD ONE
            // let details = {
            //     message: {
            //         from: this.agent.email,
            //         to: this.addTicketForm.get('visitor').get('email').value,
            //         body: this.addTicketForm.get('visitor').get('message').value,
            //     },
            //     thread: {
            //         subject: this.addTicketForm.get('subject').value.trim(),
            //         state: this.addTicketForm.get('state').value,
            //         priority: this.addTicketForm.get('priority').value,
            //         visitor: {
            //             name: this.addTicketForm.get('visitor').get('name').value,
            //             email: this.addTicketForm.get('visitor').get('email').value,
            //         }
            //     },
            //     // form: {
            //     //     id: this.addTicketForm.get('cannedForm').value ? this.addTicketForm.get('cannedForm').value : '',
            //     //     type: 'cannedForm'
            //     // },
            //     // submittedForm: (this.addTicketForm.get('cannedForm').value) ? this.cannedForms.filter(data => data._id == this.addTicketForm.get('cannedForm').value) : []
            // }
            //TEMPLATE TICKET ->NEW
            var details = {
                message: {
                    from: this.agent.email,
                    to: this.addTicketForm.get('visitor').get('email').value,
                    body: this.addTicketForm.get('visitor').get('message').value,
                },
                thread: {
                    subject: this.addTicketForm.get('subject').value.trim(),
                    state: this.addTicketForm.get('state').value,
                    priority: this.addTicketForm.get('priority').value,
                    group: this.addTicketForm.get('group').value ? this.addTicketForm.get('group').value : '',
                    assigned_to: this.addTicketForm.get('assigned_to').value ? this.addTicketForm.get('assigned_to').value : '',
                    tags: this.addTicketForm.get('tags').value ? this.addTicketForm.get('tags').value : [],
                    watchers: this.addTicketForm.get('watchers').value ? this.addTicketForm.get('watchers').value : [],
                    visitor: {
                        name: this.addTicketForm.get('visitor').get('name').value,
                        email: this.addTicketForm.get('visitor').get('email').value,
                    },
                }
            };
            this.dialogRef.close(details);
        }
    };
    AddTicketDialogComponent.prototype.Close = function (event) {
        this.dialogRef.close();
    };
    AddTicketDialogComponent.prototype.AutoFillTemplate = function (name) {
        var _this = this;
        var template = {};
        this.ticketTemplates.map(function (temp) {
            if (temp.templateName == name) {
                template = temp;
            }
        });
        if (template.group && !template.agent.email) {
            this._ticketService.getAgentsAgainstGroup([template.group]).subscribe(function (agents) {
                if (agents && agents.length) {
                    _this.addTicketForm.get('assigned_to').setValue('');
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
        this.addTicketForm.get('subject').setValue(template.subject);
        this.addTicketForm.get('priority').setValue(template.priority.toUpperCase());
        this.addTicketForm.get('state').setValue(template.status.toUpperCase());
        this.addTicketForm.get('visitor').get('message').setValue(template.message ? template.message : '');
        this.addTicketForm.get('group').setValue(template.group ? template.group : '');
        this.addTicketForm.get('assigned_to').setValue(template.agent ? template.agent.email : '');
        this.addTicketForm.get('tags').setValue(template.tags ? template.tags : []);
        this.addTicketForm.get('watchers').setValue(template.watchers ? template.watchers : []);
        this.addTicketForm.get('cannedForm').setValue(template.cannedForm ? template.cannedForm : '');
        this.templatePopper.hide();
    };
    AddTicketDialogComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('templatePopper')
    ], AddTicketDialogComponent.prototype, "templatePopper", void 0);
    AddTicketDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-add-ticket-dialog',
            templateUrl: './add-ticket-dialog.component.html',
            styleUrls: ['./add-ticket-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AddTicketDialogComponent);
    return AddTicketDialogComponent;
}());
exports.AddTicketDialogComponent = AddTicketDialogComponent;
//# sourceMappingURL=add-ticket-dialog.component.js.map