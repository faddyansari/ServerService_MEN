"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTicketTemplatesComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var AddTicketTemplatesComponent = /** @class */ (function () {
    function AddTicketTemplatesComponent(formbuilder, _authService, _ticketTemplateService, _ticketAutomationSvc, _ticketService, _globalStateService, _agentService, _utilityService, _formService, snackBar, dialog) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._authService = _authService;
        this._ticketTemplateService = _ticketTemplateService;
        this._ticketAutomationSvc = _ticketAutomationSvc;
        this._ticketService = _ticketService;
        this._globalStateService = _globalStateService;
        this._agentService = _agentService;
        this._utilityService = _utilityService;
        this._formService = _formService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.selectedTemplate = undefined;
        this.subscriptions = [];
        this.groups = [];
        this.agents = [];
        this.all_agents = [];
        this.watch_agents = [];
        this.allTemplates = [];
        this.all_Forms = [];
        this.automatedResponses = [];
        this.defaultConstantValues = undefined;
        this.cloneTemplate = false;
        this.loadingMoreAgents = false;
        this.ended = false;
        this.nsp = '';
        this.email = '';
        this.message = '';
        this.whiteSpace = /^[^\s]+(\s+[^\s]+)*$/;
        this.tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
        this.selectedTags = [];
        this.selectedWatchers = [];
        this.config = {
            placeholder: 'Enter your message here ...',
            height: 250,
            toolbar: [
                ['style', ['style', 'bold', 'italic', 'underline']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['fontName', ['fontName']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                // ['insert', ['linkDialogShow', 'unlink', 'hr']],
                ['view', ['codeview', 'undo', 'redo']],
                ['help', ['help']]
            ],
        };
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.ticketTemplate;
                if (!_this.package.allowed) {
                    _this._globalStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.nsp = this._ticketTemplateService.Agent.nsp;
        this.email = this._ticketTemplateService.Agent.email;
        this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(function (data) {
            if (data) {
                data.map(function (val) {
                    _this.groups.push({ display: val.group_name, value: val.group_name });
                });
            }
        }));
        this.subscriptions.push(this._formService.WholeForm.subscribe(function (data) {
            if (data) {
                _this.all_Forms = data;
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
            _this.all_agents = agents;
            _this.watch_agents = agents;
        }));
        this.subscriptions.push(this._ticketTemplateService.cloneTemplate.subscribe(function (data) {
            if (data) {
                _this.cloneTemplate = data;
            }
        }));
        this.subscriptions.push(this._ticketTemplateService.getAutomatedResponseAgainstAgent().subscribe(function (data) {
            if (data.status == "ok") {
                _this.automatedResponses = data.AutomatedResponses;
            }
        }));
        this.subscriptions.push(this._ticketTemplateService.AllTemplates.subscribe(function (data) {
            if (data && data.length) {
                _this.allTemplates = data;
            }
            else {
                _this.allTemplates = [];
            }
        }));
    }
    AddTicketTemplatesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.newTemplateForm = this.formbuilder.group({
            'templateName': [this.TicketTemplateObject.templateName, forms_1.Validators.required],
            'templateDesc': [this.TicketTemplateObject.templateDesc],
            'availableFor': [this.TicketTemplateObject.availableFor, forms_1.Validators.required],
            'groupName': [this.TicketTemplateObject.groupName],
            'subject': [this.TicketTemplateObject.subject, [forms_1.Validators.required, forms_1.Validators.pattern(this.whiteSpace)]],
            'status': [this.TicketTemplateObject.status, forms_1.Validators.required],
            'priority': [this.TicketTemplateObject.priority, forms_1.Validators.required],
            'group': [this.TicketTemplateObject.group],
            'agent': [this.TicketTemplateObject.agent],
            'cannedForm': [this.TicketTemplateObject.cannedForm],
            'watchers': [this.TicketTemplateObject.watchers],
            'tags': [this.TicketTemplateObject.tags,
                [
                    forms_1.Validators.maxLength(32),
                ]
            ],
            'message': [this.TicketTemplateObject.message]
        });
        //to populate agent according to selected template.
        this.subscriptions.push(this._ticketTemplateService.selectedTemplate.subscribe(function (data) {
            if (data) {
                _this.selectedTemplate = data;
                if (_this.selectedTemplate && _this.selectedTemplate.agent && _this.selectedTemplate.agent.email) {
                    _this.newTemplateForm.get('agent').setValue(_this.selectedTemplate.agent.email);
                }
                else
                    _this.newTemplateForm.get('agent').setValue({});
                if (_this.selectedTemplate.group) {
                    _this.subscriptions.push(_this._ticketService.getAgentsAgainstGroup([_this.newTemplateForm.get('group').value]).subscribe(function (agents) {
                        if (agents && agents.length) {
                            _this.all_agents = agents;
                        }
                        else {
                            _this.all_agents = [];
                        }
                    }));
                }
                else {
                    _this.subscriptions.push(_this._agentService.getAllAgentsList().subscribe(function (agents) {
                        _this.all_agents = agents;
                    }));
                }
                if (_this.selectedTemplate.tags && _this.selectedTemplate.tags.length)
                    _this.selectedTags = _this.selectedTemplate.tags;
                if (_this.selectedTemplate.watchers && _this.selectedTemplate.watchers.length)
                    _this.selectedWatchers = _this.selectedTemplate.watchers;
            }
            else {
                _this.selectedTemplate = undefined;
            }
        }));
        this.onValueChanges();
    };
    AddTicketTemplatesComponent.prototype.onValueChanges = function () {
        var _this = this;
        this.newTemplateForm.valueChanges.subscribe(function (val) {
            _this.formChanges = val;
        });
    };
    AddTicketTemplatesComponent.prototype.ParseAgent = function (agent) {
        var emailKeyVal = {};
        if (!Object.keys(agent).length) {
            emailKeyVal = '';
        }
        else {
            emailKeyVal['email'] = agent;
        }
        return emailKeyVal;
    };
    AddTicketTemplatesComponent.prototype.AddTicketTemplate = function () {
        var _this = this;
        if (this.allTemplates && this.allTemplates.filter(function (data) { return data.templateName.toLowerCase().trim() == _this.newTemplateForm.get('templateName').value.toLowerCase().trim(); }).length > 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Ticket Template name already exists!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            if (this.selectedTags && this.selectedTags.length) {
                this.newTemplateForm.get('tags').setValue(this.selectedTags);
            }
            if (this.selectedWatchers && this.selectedWatchers.length) {
                this.newTemplateForm.get('watchers').setValue(this.selectedWatchers);
            }
            var template = {
                nsp: this.nsp,
                templateName: this.newTemplateForm.get('templateName').value,
                templateDesc: this.newTemplateForm.get('templateDesc').value,
                availableFor: this.newTemplateForm.get('availableFor').value,
                groupName: this.newTemplateForm.get('groupName').value && this.newTemplateForm.get('groupName').value.length ? this.newTemplateForm.get('groupName').value : [],
                subject: this.newTemplateForm.get('subject').value,
                status: this.newTemplateForm.get('status').value,
                priority: this.newTemplateForm.get('priority').value,
                group: this.newTemplateForm.get('group').value,
                agent: this.ParseAgent(this.newTemplateForm.get('agent').value),
                cannedForm: (this.newTemplateForm.get('cannedForm').value),
                tags: this.newTemplateForm.get('tags').value,
                watchers: this.newTemplateForm.get('watchers').value,
                message: this.newTemplateForm.get('message').value,
                created: { date: new Date().toISOString(), by: this.email }
            };
            this._ticketTemplateService.AddTicketTemplate(template).subscribe(function (res) {
                if (res.status == "ok") {
                }
            });
        }
    };
    AddTicketTemplatesComponent.prototype.loadMoreAgents = function (agentsFromDB) {
        var _this = this;
        if (!this.ended && !this.loadingMoreAgents) {
            this.loadingMoreAgents = true;
            this._agentService.getMoreAgentsObs(agentsFromDB).subscribe(function (response) {
                _this.all_agents = _this.all_agents.concat(response.agents);
                _this.ended = response.ended;
                _this.loadingMoreAgents = false;
            });
        }
    };
    AddTicketTemplatesComponent.prototype.Cancel = function () {
        var _this = this;
        // console.log(this.formChanges);
        if (this.formChanges) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._ticketTemplateService.AddTemplate.next(false);
                    _this._ticketTemplateService.selectedTemplate.next(undefined);
                }
                else {
                    return;
                }
            });
        }
        else {
            this._ticketTemplateService.AddTemplate.next(false);
            this._ticketTemplateService.selectedTemplate.next(undefined);
        }
    };
    AddTicketTemplatesComponent.prototype.AddCannedMessage = function (hashtag) {
        var result = '';
        this.automatedResponses.map(function (val) {
            if (val.hashTag == hashtag) {
                result = val.responseText;
            }
        });
        this.newTemplateForm.get('message').setValue(this.newTemplateForm.get('message').value + ' ' + result.toString());
        this.cannedMessages.hide();
    };
    AddTicketTemplatesComponent.prototype.GetAvailableAgents = function () {
        var _this = this;
        // console.log("group", this.newTemplateForm.get('group').value);
        if (this.newTemplateForm.get('group').value) {
            this._ticketService.getAgentsAgainstGroup([this.newTemplateForm.get('group').value]).subscribe(function (agents) {
                if (agents && agents.length) {
                    // console.log(agents);
                    _this.newTemplateForm.get('agent').setValue({});
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
    AddTicketTemplatesComponent.prototype.onDeSelect = function (event) {
        this.selectedWatchers = event;
    };
    AddTicketTemplatesComponent.prototype.UpdateTicketTemplate = function () {
        //console.log(this.selectedWatchers);
        if (this.selectedTags && this.selectedTags.length) {
            this.newTemplateForm.get('tags').setValue(this.selectedTags);
        }
        if (this.selectedWatchers && this.selectedWatchers.length) {
            this.newTemplateForm.get('watchers').setValue(this.selectedWatchers);
        }
        var updatedTemplate = {
            nsp: this.nsp,
            templateName: this.newTemplateForm.get('templateName').value,
            templateDesc: this.newTemplateForm.get('templateDesc').value,
            availableFor: this.newTemplateForm.get('availableFor').value,
            groupName: this.newTemplateForm.get('groupName').value && this.newTemplateForm.get('groupName').value.length ? this.newTemplateForm.get('groupName').value : [],
            subject: this.newTemplateForm.get('subject').value,
            status: this.newTemplateForm.get('status').value,
            priority: this.newTemplateForm.get('priority').value,
            group: this.newTemplateForm.get('group').value,
            agent: this.ParseAgent(this.newTemplateForm.get('agent').value),
            cannedForm: this.newTemplateForm.get('cannedForm').value,
            tags: this.newTemplateForm.get('tags').value,
            message: this.newTemplateForm.get('message').value,
            watchers: this.newTemplateForm.get('watchers').value,
            created: this.TicketTemplateObject.created,
        };
        this.subscriptions.push(this._ticketTemplateService.UpdateTicketTemplate(this.selectedTemplate._id, updatedTemplate).subscribe(function (response) {
            if (response.status == 'ok') {
            }
        }));
    };
    AddTicketTemplatesComponent.prototype.GotoAR = function () {
        this._globalStateService.NavigateForce('/settings/general/automated-responses');
    };
    AddTicketTemplatesComponent.prototype.ngOnDestroy = function () {
        this._ticketTemplateService.AddTemplate.next(false);
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.Input()
    ], AddTicketTemplatesComponent.prototype, "TicketTemplateObject", void 0);
    __decorate([
        core_1.ViewChild('cannedMessages')
    ], AddTicketTemplatesComponent.prototype, "cannedMessages", void 0);
    AddTicketTemplatesComponent = __decorate([
        core_1.Component({
            selector: 'app-add-ticket-templates',
            templateUrl: './add-ticket-templates.component.html',
            styleUrls: ['./add-ticket-templates.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AddTicketTemplatesComponent);
    return AddTicketTemplatesComponent;
}());
exports.AddTicketTemplatesComponent = AddTicketTemplatesComponent;
//# sourceMappingURL=add-ticket-templates.component.js.map