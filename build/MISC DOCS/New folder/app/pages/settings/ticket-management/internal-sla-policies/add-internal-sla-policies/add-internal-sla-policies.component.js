"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddInternalSlaPoliciesComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var AddInternalSlaPoliciesComponent = /** @class */ (function () {
    function AddInternalSlaPoliciesComponent(formbuilder, dialog, _utilityService, snackBar, _slaPolicyService, _formDesignerService, _ticketScenarios, _ticketService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this.dialog = dialog;
        this._utilityService = _utilityService;
        this.snackBar = snackBar;
        this._slaPolicyService = _slaPolicyService;
        this._formDesignerService = _formDesignerService;
        this._ticketScenarios = _ticketScenarios;
        this._ticketService = _ticketService;
        this.agentsList = [];
        this.subscriptions = [];
        this.Groups = [];
        this.groupList = [];
        this.allIntPolicies = [];
        this.selectedIntPolicy = undefined;
        this.all_agents = [];
        this.agent_original_list = [];
        this.cannedForms = [];
        this.all_agents_list = [];
        this.watchers_list = [];
        this.form_list = [];
        this.tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
        // public srcList = [{ display: 'Live Chat', value: 'livechat' }, { display: 'Email', value: 'email' }, { display: 'Agent Panel', value: 'panel' }];
        // public stateList = [{ display: 'OPEN', value: 'OPEN' }, { display: 'PENDING', value: 'PENDING' }, { display: 'SOLVED', value: 'SOLVED' }];
        // public priorityList = [{ display: 'LOW', value: 'LOW' }, { display: 'MEDIUM', value: 'MEDIUM' }, { display: 'HIGH', value: 'HIGH' }, { display: 'URGENT', value: 'URGENT' }];
        this.PriorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        this.StateList = ['OPEN', 'PENDING', 'SOLVED'];
        this.SrcList = ['LiveChat', 'Email', 'Panel'];
        this.Merge = ['True', 'False'];
        this.Viewstate = ['READ', 'UNREAD'];
        this.Teams = [];
        this.teamsList = [];
        this.nsp = '';
        this.email = '';
        this.setReminder = false;
        this.op = "";
        this.allscenarios = [];
        this.actualKeys = [];
        this.endedRem = false;
        this.loadingMoreAgentsRem = false;
        this.endedEsc = false;
        this.loadingMoreAgentsEsc = false;
        this.ended = false;
        this.loadingMoreAgents = false;
        this.selectedTags = [];
        this.selectedAgentRem = [];
        this.selectedAgentEsc = [];
        this.selectedAgent = [];
        this.selectedWatchers = [];
        this.violate = {
            '0_mins': 'Immediately',
            '30_mins': 'After 30 Minutes',
            '1_hour': 'After 1 hours',
            '2_hour': 'After 2 hours',
            '4_hour': 'After 4 hours',
            '8_hour': 'After 8 hours',
            '12_hour': 'After 12 hours',
            '1_week': 'After 1 week',
            '2_week': 'After 2 weeks',
            '1_day': 'After 1 day',
            '2_day': 'After 2 days',
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
        this.nsp = this._slaPolicyService.Agent.nsp;
        this.email = this._slaPolicyService.Agent.email;
        this.subscriptions.push(this._slaPolicyService.groupList.subscribe(function (data) {
            if (data) {
                _this.Groups = data;
                // this.Groups.map(val => {
                //   this.groupList.push({ display: val.group_name, value: val.group_name })
                // })
            }
        }));
        this.subscriptions.push(this._ticketScenarios.AllScenarios.subscribe(function (data) {
            if (data && data.length) {
                _this.allscenarios = data;
            }
        }));
        // this.subscriptions.push(this._slaPolicyService.teamsList.subscribe(data => {
        //   if (data) {
        //     this.Teams = data;
        //     this.Teams.map(val => {
        //       this.teamsList.push({ display: val.team_name, value: val.team_name.toLowerCase().replace(/\s/g, '') })
        //     })
        //   }
        // }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
            _this.all_agents = agents;
            _this.watchers_list = agents;
            _this.agent_original_list = agents;
        }));
        this.subscriptions.push(this._formDesignerService.WholeForm.subscribe(function (data) {
            if (data && data.length) {
                _this.cannedForms = data;
                // this.cannedForms.map(val => {
                //   this.form_list.push({ display: val.formName, value: val.formName })
                // })
            }
        }));
        this.subscriptions.push(this._slaPolicyService.AllInternalSLAPolicies.subscribe(function (data) {
            if (data && data.length) {
                _this.allIntPolicies = data;
            }
            else {
                _this.allIntPolicies = [];
            }
        }));
        this.subscriptions.push(this._slaPolicyService.selectedInternalSLAPolicy.subscribe(function (data) {
            if (data) {
                _this.selectedIntPolicy = data;
                _this.InternalPolicyObject = _this.selectedIntPolicy;
                _this.selectedIntPolicy.operations.map(function (act) {
                    if (act.operationName == 'tags') {
                        _this.selectedTags = act.operationValue;
                    }
                    if (act.operationName == 'watchers') {
                        _this.selectedWatchers = act.operationValue;
                    }
                });
                if (_this.selectedIntPolicy.reminder.length) {
                    _this.setReminder = true;
                }
                else {
                    _this.setReminder = false;
                }
            }
            else {
                _this.selectedIntPolicy = undefined;
            }
        }));
    }
    AddInternalSlaPoliciesComponent.prototype.ngOnInit = function () {
        this.InternalPolicyForm = this.formbuilder.group({
            'policyName': [this.InternalPolicyObject.policyName,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(2)
                ]],
            'policyDesc': [this.InternalPolicyObject.policyDesc,
                [
                    forms_1.Validators.minLength(2)
                ]],
            // 'orders':new FormArray(formControls),
            'policyApplyTo': this.formbuilder.array(this.TransformApplyTo(this.InternalPolicyObject.policyApplyTo), forms_1.Validators.required),
            'operator': this.InternalPolicyObject.operator,
            'operations': this.formbuilder.array(this.TransformOperations(this.InternalPolicyObject.operations), forms_1.Validators.required),
            'policyTarget': this.formbuilder.array(this.TransformPolicyTarget(this.InternalPolicyObject.policyTarget), forms_1.Validators.required),
            'reminder': this.formbuilder.array(this.TransformReminder(this.InternalPolicyObject.reminder)),
            'escalation': this.formbuilder.array(this.TransformEscalation(this.InternalPolicyObject.escalation)),
        });
        this.onValueChanges();
    };
    AddInternalSlaPoliciesComponent.prototype.onValueChanges = function () {
        var _this = this;
        this.InternalPolicyForm.valueChanges.subscribe(function (val) {
            _this.formChanges = val;
        });
    };
    AddInternalSlaPoliciesComponent.prototype.setSLAreminders = function () {
        this.setReminder = true;
    };
    AddInternalSlaPoliciesComponent.prototype.AddAction = function () {
        var fb = this.formbuilder.group({
            operationName: [''],
            operationValue: [[]],
            regex: ['']
        });
        var actions = this.InternalPolicyForm.get('operations');
        actions.push(fb);
    };
    AddInternalSlaPoliciesComponent.prototype.DeleteAction = function (index) {
        var actions = this.InternalPolicyForm.get('operations');
        actions.removeAt(index);
    };
    AddInternalSlaPoliciesComponent.prototype.GetAvailableAgents = function (ev) {
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
    AddInternalSlaPoliciesComponent.prototype.TransformApplyTo = function (applyTo) {
        var _this = this;
        var fb = [];
        applyTo.map(function (res) {
            fb.push(_this.formbuilder.group({
                name: [res.name, forms_1.Validators.required],
                value: [res.value, forms_1.Validators.required]
            }));
        });
        return fb;
    };
    AddInternalSlaPoliciesComponent.prototype.TransformPolicyTarget = function (target) {
        var _this = this;
        var fb = [];
        target.map(function (to) {
            fb.push(_this.formbuilder.group({
                priority: [to.priority, forms_1.Validators.required],
                TimeKey: [to.TimeKey, forms_1.Validators.required],
                TimeVal: [to.TimeVal, forms_1.Validators.required],
                emailActivationReminder: [to.emailActivationReminder, forms_1.Validators.required],
                emailActivationEscalation: [to.emailActivationEscalation, forms_1.Validators.required],
            }));
        });
        return fb;
    };
    AddInternalSlaPoliciesComponent.prototype.TransformEscalation = function (escalation) {
        var _this = this;
        var fb = [];
        escalation.map(function (vio) {
            fb.push(_this.formbuilder.group({
                duration: [vio.duration, forms_1.Validators.required],
                emails: [vio.emails],
                notifyTo: [vio.notifyTo]
            }));
        });
        return fb;
    };
    AddInternalSlaPoliciesComponent.prototype.TransformReminder = function (remind) {
        var _this = this;
        var fb = [];
        remind.map(function (rem) {
            fb.push(_this.formbuilder.group({
                timeKey: [rem.timeKey],
                timeVal: [rem.timeVal],
                emails: [rem.emails],
                notifyTo: [rem.notifyTo]
            }));
        });
        return fb;
    };
    AddInternalSlaPoliciesComponent.prototype.TransformOperations = function (operations) {
        var _this = this;
        var fb = [];
        operations.map(function (op) {
            fb.push(_this.formbuilder.group({
                operationName: [op.operationName, forms_1.Validators.required],
                operationValue: [op.operationValue, forms_1.Validators.required],
                regex: [op.regex]
            }));
        });
        return fb;
    };
    AddInternalSlaPoliciesComponent.prototype.GetAvailableActions = function (i) {
        var actionList = {
            'assigned_to': 'Assign To Agent',
            'group': 'Assign To Group',
            'null1': '------------------',
            'priority': 'Set Priority',
            'state': 'Set State',
            'viewState': 'Set ViewState',
            // 'snooze': 'Set Snooze',
            'null2': '------------------',
            'ticketNotes': 'Add Note',
            'tags': 'Add Tag',
            'todo': 'Add Task',
            'watchers': 'Add Watcher',
            'null3': '------------------',
            // 'forwardTicket': 'Forward a Ticket',
            'lastScenarioExecuted': 'Execute Scenario'
        };
        var actions = this.InternalPolicyForm.get('operations');
        actions.controls.map(function (control, index) {
            if (actionList[actions.controls[index].get('operationName').value] && index != i) {
                delete actionList[actions.controls[index].get('operationName').value];
            }
        });
        return actionList;
    };
    AddInternalSlaPoliciesComponent.prototype.addEscalation = function () {
        var val = this.formbuilder.group({
            duration: ['', []],
            emails: [[], []],
            notifyTo: [['Assigned Agent'], []]
        });
        var form = this.InternalPolicyForm.get('escalation');
        form.push(val);
    };
    AddInternalSlaPoliciesComponent.prototype.deleteEscalation = function (index) {
        var violation = this.InternalPolicyForm.get('escalation');
        violation.removeAt(index);
    };
    AddInternalSlaPoliciesComponent.prototype.deleteReminder = function (index) {
        var reminder = this.InternalPolicyForm.get('reminder');
        reminder.removeAt(index);
    };
    AddInternalSlaPoliciesComponent.prototype.AddIntPolicy = function () {
        var _this = this;
        if (this.allIntPolicies && this.allIntPolicies.filter(function (data) { return data.policyName.toLowerCase().trim() == _this.InternalPolicyForm.get('policyName').value.toLowerCase().trim(); }).length > 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Policy name already exists!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            var policy = {
                nsp: this.nsp,
                policyName: this.InternalPolicyForm.get('policyName').value,
                policyDesc: this.InternalPolicyForm.get('policyDesc').value,
                policyTarget: this.ParseTarget(this.InternalPolicyForm.get('policyTarget')),
                policyApplyTo: this.ParseApplyTo(this.InternalPolicyForm.get('policyApplyTo')),
                operator: this.InternalPolicyForm.get('operator').value,
                operations: this.ParseActions(this.InternalPolicyForm.get('operations')),
                activated: false,
                reminder: this.setReminder ? this.ParseReminder(this.InternalPolicyForm.get('reminder')) : [],
                escalation: this.ParseEscalation(this.InternalPolicyForm.get('escalation')),
                created: { date: new Date().toISOString(), by: this.email },
                order: this.allIntPolicies.length + 1
            };
            // console.log(policy)
            this._slaPolicyService.AddInternalPolicy(policy).subscribe(function (res) {
                if (res.status == "ok") {
                }
            });
        }
    };
    AddInternalSlaPoliciesComponent.prototype.UpdateIntPolicy = function () {
        var policy = {
            nsp: this.nsp,
            policyName: this.InternalPolicyForm.get('policyName').value,
            policyDesc: this.InternalPolicyForm.get('policyDesc').value,
            policyTarget: this.ParseTarget(this.InternalPolicyForm.get('policyTarget')),
            policyApplyTo: this.ParseApplyTo(this.InternalPolicyForm.get('policyApplyTo')),
            operator: this.InternalPolicyForm.get('operator').value,
            operations: this.ParseActions(this.InternalPolicyForm.get('operations')),
            activated: this.InternalPolicyObject.activated,
            reminder: this.setReminder ? this.ParseReminder(this.InternalPolicyForm.get('reminder')) : [],
            escalation: this.ParseEscalation(this.InternalPolicyForm.get('escalation')),
            created: this.InternalPolicyObject.created,
            order: this.InternalPolicyObject.order
        };
        // console.log(policy)
        this._slaPolicyService.updateInternalSLAPolicy(this.selectedIntPolicy._id, policy).subscribe(function (res) {
            if (res.status == "ok") {
            }
        });
    };
    AddInternalSlaPoliciesComponent.prototype.UnsetReminder = function () {
        this.setReminder = false;
    };
    AddInternalSlaPoliciesComponent.prototype.ParseReminder = function (reminder) {
        var _this = this;
        var remind = [];
        reminder.controls.map(function (control) {
            // console.log(control.get('notifyTo').value);
            var obj = {
                timeKey: control.get('timeKey').value,
                timeVal: control.get('timeVal').value,
                notifyTo: _this.ConvertToEmail(control.get('notifyTo').value),
                emails: control.get('emails').value,
                time: control.get('timeKey').value && control.get('timeVal').value ? _this.ConvertToSingleUnit(control.get('timeKey').value + '_' + control.get('timeVal').value) : '',
            };
            remind.push(obj);
        });
        // console.log(remind);
        return remind;
    };
    AddInternalSlaPoliciesComponent.prototype.ParseEscalation = function (violation) {
        var _this = this;
        var violate = [];
        violation.controls.map(function (control) {
            var obj = {
                time: control.get('duration').value ? _this.ConvertToSingleUnit(control.get('duration').value) : '',
                duration: control.get('duration').value ? control.get('duration').value : '',
                emails: control.get('emails').value,
                notifyTo: _this.ConvertToEmail(control.get('notifyTo').value)
            };
            violate.push(obj);
        });
        return violate;
    };
    AddInternalSlaPoliciesComponent.prototype.ParseTarget = function (targets) {
        var _this = this;
        var target = [];
        targets.controls.map(function (control) {
            var obj = {
                priority: control.get('priority').value.toUpperCase(),
                TimeKey: control.get('TimeKey').value,
                TimeVal: control.get('TimeVal').value,
                timeInMinutes: _this.ConvertToSingleUnit(control.get('TimeKey').value + '_' + control.get('TimeVal').value),
                emailActivationEscalation: control.get('emailActivationEscalation').value,
                emailActivationReminder: control.get('emailActivationReminder').value,
            };
            target.push(obj);
        });
        return target;
    };
    AddInternalSlaPoliciesComponent.prototype.ParseApplyTo = function (slaApply) {
        var _this = this;
        var applyTo = [];
        slaApply.controls.map(function (control) {
            var obj = {
                name: control.get('name').value,
                value: (control.get('name').value == 'assigned_to' || control.get('name').value == 'watchers') ? _this.ParseValues(control.get('value').value) : control.get('value').value
            };
            applyTo.push(obj);
        });
        return applyTo;
    };
    AddInternalSlaPoliciesComponent.prototype.ParseValues = function (value) {
        var email = [];
        email = (this.ConvertToEmail(value));
        return email;
    };
    AddInternalSlaPoliciesComponent.prototype.ParseActions = function (formArray) {
        var _this = this;
        var actions = [];
        formArray.controls.map(function (control) {
            switch (control.get('operationName').value) {
                case 'tags':
                    control.get('operationValue').value = _this.selectedTags;
                    control.get('regex').setValue(_this.CreateRegex('contains', control.get('operationValue').value));
                    break;
                case 'watchers':
                    control.get('operationValue').value = _this.selectedWatchers;
                    control.get('regex').setValue(_this.CreateRegex('contains', control.get('operationValue').value));
                    break;
                default:
                    control.get('operationValue').value = [control.get('operationValue').value];
                    control.get('regex').setValue(_this.CreateRegex('is', control.get('operationValue').value));
            }
            var obj = {
                operationName: control.get('operationName').value,
                operationValue: control.get('operationValue').value,
                regex: control.get('regex').value
            };
            actions.push(obj);
        });
        return actions;
    };
    AddInternalSlaPoliciesComponent.prototype.GetControls = function (name) {
        return this.InternalPolicyForm.get(name).controls;
    };
    AddInternalSlaPoliciesComponent.prototype.ConvertToSingleUnit = function (time) {
        var key = Number(time.split('_')[0]);
        var val = time.split('_')[1];
        var convertedTime;
        switch (val) {
            case 'mins':
                convertedTime = key;
                break;
            case 'hour':
                convertedTime = key * 60;
                break;
            case 'day':
                convertedTime = key * 1440;
                break;
            case 'week':
                convertedTime = key * 10080;
                break;
            case 'month':
                convertedTime = key * 43800;
                break;
        }
        return convertedTime;
    };
    AddInternalSlaPoliciesComponent.prototype.CreateRegex = function (val, keywords) {
        var keywordString = '';
        switch (val) {
            case 'contains':
                keywordString = '(' + keywords.join('|') + ')';
                break;
            case 'is':
                keywordString = '\\b(' + keywords.join('|') + ')\\b';
                break;
        }
        return keywordString;
    };
    AddInternalSlaPoliciesComponent.prototype.ConvertToEmail = function (emails) {
        var convertedEmails = [];
        emails.map(function (res) {
            if (res == 'Assigned Agent') {
                convertedEmails.push('Assigned Agent');
            }
            else {
                convertedEmails.push(res);
            }
        });
        return convertedEmails;
    };
    AddInternalSlaPoliciesComponent.prototype.GetAvailableViolationDurations = function (j) {
        var _this = this;
        var violation = this.InternalPolicyForm.get('escalation');
        var i = Object.keys(this.violate).findIndex(function (d) { return d == violation.controls[j].get('duration').value; });
        Object.keys(this.violate).map(function (z, index) {
            if (index <= i)
                delete _this.violate[z];
            return z;
        });
        return this.violate;
    };
    AddInternalSlaPoliciesComponent.prototype.EscalationChanged = function (i) {
        var actions = this.InternalPolicyForm.get('escalation');
        actions.controls[i].get('duration').setValue('');
    };
    AddInternalSlaPoliciesComponent.prototype.GetAvailableApplyTo = function (i) {
        var applyToList = {
            'group': 'Group',
            'source': 'Source',
            'state': 'State',
            // 'team': 'Team',
            'assigned_to': 'Assigned To',
            'merged': 'Merged',
            'viewState': 'ViewState',
            'watchers': 'Watchers',
            'priority': 'Priority',
            'tags': 'Tags',
            'cannedForm': 'Canned Form'
        };
        var applyTo = this.InternalPolicyForm.get('policyApplyTo');
        applyTo.controls.map(function (control, index) {
            if (applyToList[applyTo.controls[index].get('name').value] && index != i)
                delete applyToList[applyTo.controls[index].get('name').value];
        });
        return applyToList;
    };
    AddInternalSlaPoliciesComponent.prototype.DeleteApplyTo = function (index) {
        var applyTo = this.InternalPolicyForm.get('policyApplyTo');
        applyTo.removeAt(index);
    };
    AddInternalSlaPoliciesComponent.prototype.addApplyTo = function () {
        var val = this.formbuilder.group({
            name: ['', forms_1.Validators.required],
            value: [[], forms_1.Validators.required]
        });
        var form = this.InternalPolicyForm.get('policyApplyTo');
        form.push(val);
    };
    AddInternalSlaPoliciesComponent.prototype.Cancel = function () {
        var _this = this;
        if (this.formChanges) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._slaPolicyService.selectedInternalSLAPolicy.next(undefined);
                    _this._slaPolicyService.AddInternalSLAPolicy.next(false);
                }
                else {
                    return;
                }
            });
        }
        else {
            this._slaPolicyService.selectedInternalSLAPolicy.next(undefined);
            this._slaPolicyService.AddInternalSLAPolicy.next(false);
        }
    };
    AddInternalSlaPoliciesComponent.prototype.ngOnDestroy = function () {
        this._slaPolicyService.AddInternalSLAPolicy.next(false);
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        this.InternalPolicyObject.reminder.map(function (res) {
            res.emails = [];
            res.notifyTo = ['Assigned Agent'];
        });
        this.InternalPolicyObject.escalation.map(function (res) {
            res.emails = [];
            res.notifyTo = ['Assigned Agent'];
        });
    };
    AddInternalSlaPoliciesComponent.prototype.loadMoreRem = function () {
        var _this = this;
        if (!this.endedRem && !this.loadingMoreAgentsRem && !this.selectedAgentRem.length) {
            this.loadingMoreAgentsRem = true;
            this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(function (response) {
                _this.all_agents = _this.all_agents.concat(response.agents);
                _this.endedRem = response.ended;
                _this.loadingMoreAgentsRem = false;
            });
        }
    };
    AddInternalSlaPoliciesComponent.prototype.onSearchRem = function (value) {
        var _this = this;
        if (value) {
            if (!this.selectedAgentRem.length) {
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
            this.all_agents = this.agent_original_list;
            this.endedRem = false;
        }
    };
    AddInternalSlaPoliciesComponent.prototype.loadMoreEsc = function () {
        var _this = this;
        if (!this.endedEsc && !this.loadingMoreAgentsEsc && !this.selectedAgentEsc.length) {
            //console.log('Fetch More');
            this.loadingMoreAgentsEsc = true;
            this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(function (response) {
                //console.log(response);
                _this.all_agents = _this.all_agents.concat(response.agents);
                _this.endedEsc = response.ended;
                _this.loadingMoreAgentsEsc = false;
            });
        }
    };
    AddInternalSlaPoliciesComponent.prototype.onSearchEsc = function (value) {
        var _this = this;
        if (value) {
            if (!this.selectedAgentEsc.length) {
                var agents_2 = this.all_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
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
        }
        else {
            this.all_agents = this.agent_original_list;
            this.endedEsc = false;
        }
    };
    AddInternalSlaPoliciesComponent.prototype.loadMore = function () {
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
    AddInternalSlaPoliciesComponent.prototype.onSearch = function (value) {
        var _this = this;
        if (value) {
            if (!this.selectedAgent.length) {
                var agents_3 = this.all_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_3.filter(function (a) { return a.email == element.email; }).length) {
                                agents_3.push(element);
                            }
                        });
                    }
                    _this.all_agents = agents_3;
                });
            }
            else {
                var agents = this.all_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.all_agents = agents;
            }
        }
        else {
            this.all_agents = this.agent_original_list;
            this.ended = false;
        }
    };
    __decorate([
        core_1.Input()
    ], AddInternalSlaPoliciesComponent.prototype, "InternalPolicyObject", void 0);
    AddInternalSlaPoliciesComponent = __decorate([
        core_1.Component({
            selector: 'app-add-internal-sla-policies',
            templateUrl: './add-internal-sla-policies.component.html',
            styleUrls: ['./add-internal-sla-policies.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], AddInternalSlaPoliciesComponent);
    return AddInternalSlaPoliciesComponent;
}());
exports.AddInternalSlaPoliciesComponent = AddInternalSlaPoliciesComponent;
//# sourceMappingURL=add-internal-sla-policies.component.js.map