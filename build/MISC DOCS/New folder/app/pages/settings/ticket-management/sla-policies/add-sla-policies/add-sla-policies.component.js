"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSlaPoliciesComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var AddSlaPoliciesComponent = /** @class */ (function () {
    function AddSlaPoliciesComponent(_authService, _appStateService, formbuilder, dialog, snackBar, _slaPolicyService, _utilityService) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this._slaPolicyService = _slaPolicyService;
        this._utilityService = _utilityService;
        this.nsp = '';
        this.email = '';
        this.endedAgents = false;
        this.loadingMoreAgents = false;
        this.disableButton = false;
        this.selectedPolicy = undefined;
        this.subscriptions = [];
        this.allSLAPolicies = [];
        this.Groups = [];
        this.Teams = [];
        this.groupList = [];
        this.agentList_original = [];
        this.teamsList = [];
        this.srcList = ['LiveChat', 'Email', 'Panel'];
        this.agentsList = [];
        this.AgentsList = [];
        this.selectedOption = '';
        this.setReminder = false;
        this.tempArr = [];
        this.selectedWatchers = [];
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.endedRemResv = false;
        this.loadingMoreAgentsRemResv = false;
        this.selectedAgentRemResv = [];
        this.endedRemResp = false;
        this.loadingMoreAgentsRemResp = false;
        this.selectedAgentRemResp = [];
        this.endedVioResv = false;
        this.loadingMoreAgentsVioResv = false;
        this.selectedAgentVioResv = [];
        this.endedVioResp = false;
        this.loadingMoreAgentsVioResp = false;
        this.selectedAgentVioResp = [];
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.SLA;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.nsp = this._slaPolicyService.Agent.nsp;
        this.email = this._slaPolicyService.Agent.email;
        this.subscriptions.push(this._slaPolicyService.groupList.subscribe(function (data) {
            if (data) {
                _this.Groups = data;
                _this.Groups.map(function (val) {
                    _this.groupList.push({ display: val.group_name, value: val.group_name });
                });
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
            _this.AgentsList = agents;
            _this.agentList_original = agents;
        }));
        this.subscriptions.push(this._slaPolicyService.selectedSLAPolicy.subscribe(function (data) {
            if (data) {
                _this.selectedPolicy = data;
                _this.PolicyObject = _this.selectedPolicy;
                if (_this.selectedPolicy.reminderResolution.length || _this.selectedPolicy.reminderResponse.length) {
                    _this.setReminder = true;
                }
                else {
                    _this.setReminder = false;
                }
            }
            else {
                _this.selectedPolicy = undefined;
            }
        }));
        this.subscriptions.push(this._slaPolicyService.AllSLAPolicies.subscribe(function (data) {
            if (data && data.length) {
                _this.allSLAPolicies = data;
            }
            else {
                _this.allSLAPolicies = [];
            }
        }));
    }
    AddSlaPoliciesComponent.prototype.ngOnInit = function () {
        this.policyForm = this.formbuilder.group({
            'policyName': [this.PolicyObject.policyName,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(2)
                ]],
            'policyDesc': [this.PolicyObject.policyDesc,
                [
                    forms_1.Validators.minLength(2)
                ]],
            'policyApplyTo': this.formbuilder.array(this.TransformApplyTo(this.PolicyObject.policyApplyTo), forms_1.Validators.required),
            'policyTarget': this.formbuilder.array(this.TransformPolicyTarget(this.PolicyObject.policyTarget), forms_1.Validators.required),
            'reminderResponse': this.formbuilder.array(this.TransformReminder(this.PolicyObject.reminderResponse)),
            'reminderResolution': this.formbuilder.array(this.TransformReminder(this.PolicyObject.reminderResolution)),
            'violationResponse': this.formbuilder.array(this.TransformViolation(this.PolicyObject.violationResponse)),
            'violationResolution': this.formbuilder.array(this.TransformViolation(this.PolicyObject.violationResolution))
        });
        this.onValueChanges();
    };
    AddSlaPoliciesComponent.prototype.onValueChanges = function () {
        var _this = this;
        this.policyForm.valueChanges.subscribe(function (val) {
            _this.formChanges = val;
        });
    };
    AddSlaPoliciesComponent.prototype.TransformApplyTo = function (applyTo) {
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
    AddSlaPoliciesComponent.prototype.addApplyTo = function () {
        var val = this.formbuilder.group({
            name: ['', forms_1.Validators.required],
            value: [[], forms_1.Validators.required]
        });
        var form = this.policyForm.get('policyApplyTo');
        form.push(val);
    };
    AddSlaPoliciesComponent.prototype.setSLAreminders = function () {
        this.setReminder = true;
    };
    AddSlaPoliciesComponent.prototype.UnsetReminder = function () {
        this.setReminder = false;
    };
    AddSlaPoliciesComponent.prototype.TransformPolicyTarget = function (target) {
        var _this = this;
        var fb = [];
        target.map(function (to) {
            fb.push(_this.formbuilder.group({
                priority: [to.priority, forms_1.Validators.required],
                responseTimeKey: [to.responseTimeKey, forms_1.Validators.required],
                responseTimeVal: [to.responseTimeVal, forms_1.Validators.required],
                resolvedTimeKey: [to.resolvedTimeKey, forms_1.Validators.required],
                resolvedTimeVal: [to.resolvedTimeVal, forms_1.Validators.required],
                hours: [to.hours, forms_1.Validators.required],
                emailActivationReminder: [to.emailActivationReminder, forms_1.Validators.required],
                emailActivationEscalation: [to.emailActivationEscalation, forms_1.Validators.required],
            }));
        });
        return fb;
    };
    AddSlaPoliciesComponent.prototype.TransformReminder = function (remind) {
        var _this = this;
        var fb = [];
        remind.map(function (rem) {
            fb.push(_this.formbuilder.group({
                type: [rem.type],
                responsetimeKey: [rem.responsetimeKey],
                responsetimeVal: [rem.responsetimeVal],
                resolvedtimeKey: [rem.resolvedtimeKey],
                resolvedtimeVal: [rem.resolvedtimeVal],
                emails: [rem.emails],
                notifyTo: [rem.notifyTo]
            }));
        });
        return fb;
    };
    AddSlaPoliciesComponent.prototype.TransformViolation = function (violation) {
        var _this = this;
        var fb = [];
        violation.map(function (vio) {
            fb.push(_this.formbuilder.group({
                type: [vio.type],
                duration: [vio.duration, forms_1.Validators.required],
                emails: [vio.emails],
                notifyTo: [vio.notifyTo]
            }));
        });
        return fb;
    };
    AddSlaPoliciesComponent.prototype.GetControls = function (name) {
        return this.policyForm.get(name).controls;
    };
    AddSlaPoliciesComponent.prototype.deleteReminder = function (index, name) {
        var reminder = this.policyForm.get(name);
        reminder.removeAt(index);
    };
    AddSlaPoliciesComponent.prototype.deleteViolation = function (index, name) {
        var violation = this.policyForm.get(name);
        violation.removeAt(index);
    };
    AddSlaPoliciesComponent.prototype.GetAvailableApplyTo = function (i) {
        var applyToList = {
            'group': 'Group',
            'source': 'Source',
        };
        var applyTo = this.policyForm.get('policyApplyTo');
        applyTo.controls.map(function (control, index) {
            if (applyToList[applyTo.controls[index].get('name').value] && index != i)
                delete applyToList[applyTo.controls[index].get('name').value];
        });
        return applyToList;
    };
    AddSlaPoliciesComponent.prototype.GetAvailableViolationDurations = function (j) {
        var violate = {
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
        var violation = this.policyForm.get('violationResolution');
        violation.controls.map(function (control, index) {
            if (violate[violation.controls[index].get('duration').value] && index != j) {
                delete violate[violation.controls[index].get('duration').value];
            }
        });
        return violate;
    };
    // GetAvailableViolation(index) {
    //   this.tempArr = Array.from(this.arr);
    //   let violation = this.policyForm.get('violationResolution') as FormArray;
    //   let ind = this.tempArr.findIndex(data => data.value == violation.controls[index].get('duration').value);
    //   if (ind != -1) {
    //     this.tempArr = this.tempArr.slice(ind + 1, this.tempArr.length);
    //   }
    //   return this.tempArr;
    // }
    AddSlaPoliciesComponent.prototype.DeleteApplyTo = function (index) {
        var applyTo = this.policyForm.get('policyApplyTo');
        applyTo.removeAt(index);
    };
    AddSlaPoliciesComponent.prototype.addReminder = function (name) {
        var val = this.formbuilder.group({
            type: [name],
            responsetimeKey: ['15', []],
            responsetimeVal: ['mins', []],
            resolvedtimeKey: ['15', []],
            resolvedtimeVal: ['mins', []],
            time: ['8hours', []],
            emails: [[], []],
            notifyTo: [['Assigned Agent'], []]
        });
        var form = this.policyForm.get(name);
        form.push(val);
    };
    AddSlaPoliciesComponent.prototype.addViolation = function (name) {
        var val = this.formbuilder.group({
            type: name == 'violationResolution' ? ['resolution'] : ['response'],
            time: ['', []],
            duration: ['', []],
            emails: [[], []],
            notifyTo: [['Assigned Agent'], []]
        });
        var form = this.policyForm.get(name);
        form.push(val);
    };
    AddSlaPoliciesComponent.prototype.AddPolicy = function () {
        var _this = this;
        if (this.allSLAPolicies && this.allSLAPolicies.filter(function (data) { return data.policyName.toLowerCase().trim() == _this.policyForm.get('policyName').value.toLowerCase().trim(); }).length > 0) {
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
                policyName: this.policyForm.get('policyName').value,
                policyDesc: this.policyForm.get('policyDesc').value,
                policyTarget: this.ParseTarget(this.policyForm.get('policyTarget')),
                policyApplyTo: this.policyForm.get('policyApplyTo').value,
                reminderResponse: this.setReminder ? this.ParseReminderResponse(this.policyForm.get('reminderResponse')) : [],
                reminderResolution: this.setReminder ? this.ParseReminderResolve(this.policyForm.get('reminderResolution')) : [],
                violationResponse: this.ParseViolation(this.policyForm.get('violationResponse')),
                violationResolution: this.ParseViolation(this.policyForm.get('violationResolution')),
                activated: false,
                created: { date: new Date().toISOString(), by: this.email },
                order: this.allSLAPolicies.length + 1
            };
            // console.log(policy)
            this._slaPolicyService.AddPolicy(policy).subscribe(function (res) {
                if (res.status == "ok") {
                }
            });
        }
    };
    AddSlaPoliciesComponent.prototype.ParseViolation = function (violation) {
        var _this = this;
        var violate = [];
        violation.controls.map(function (control) {
            var obj = {
                type: control.get('type').value,
                time: control.get('duration').value ? _this.ConvertToSingleUnit(control.get('duration').value) : '',
                duration: control.get('duration').value ? control.get('duration').value : '',
                emails: control.get('emails').value,
                notifyTo: control.get('notifyTo').value
            };
            violate.push(obj);
        });
        return violate;
    };
    AddSlaPoliciesComponent.prototype.ParseTarget = function (targets) {
        var _this = this;
        var target = [];
        targets.controls.map(function (control) {
            var obj = {
                priority: control.get('priority').value.toUpperCase(),
                responseTimeKey: control.get('responseTimeKey').value,
                responseTimeVal: control.get('responseTimeVal').value,
                resolvedTimeKey: control.get('resolvedTimeKey').value,
                resolvedTimeVal: control.get('resolvedTimeVal').value,
                timeResolved: _this.ConvertToSingleUnit(control.get('resolvedTimeKey').value + '_' + control.get('resolvedTimeVal').value),
                timeResponse: _this.ConvertToSingleUnit(control.get('responseTimeKey').value + '_' + control.get('responseTimeVal').value),
                hours: null,
                emailActivationEscalation: control.get('emailActivationEscalation').value,
                emailActivationReminder: control.get('emailActivationReminder').value,
            };
            target.push(obj);
        });
        return target;
    };
    AddSlaPoliciesComponent.prototype.ParseReminderResponse = function (reminder) {
        var _this = this;
        var remind = [];
        reminder.controls.map(function (control) {
            var obj = {
                type: control.get('type').value,
                responsetimeKey: control.get('responsetimeKey').value,
                responsetimeVal: control.get('responsetimeVal').value,
                // time: this.ConvertToSingleUnit(control.get('responsetimeKey').value + control.get('responsetimeVal').value),
                notifyTo: control.get('notifyTo').value,
                emails: control.get('emails').value,
                time: control.get('responsetimeKey').value && control.get('responsetimeVal').value ? _this.ConvertToSingleUnit(control.get('responsetimeKey').value + '_' + control.get('responsetimeVal').value) : '',
            };
            remind.push(obj);
        });
        return remind;
    };
    AddSlaPoliciesComponent.prototype.ParseReminderResolve = function (reminder) {
        var _this = this;
        var remind = [];
        reminder.controls.map(function (control) {
            var obj = {
                type: control.get('type').value,
                resolvedtimeKey: control.get('resolvedtimeKey').value,
                resolvedtimeVal: control.get('resolvedtimeVal').value,
                emails: control.get('emails').value,
                time: _this.ConvertToSingleUnit(control.get('resolvedtimeKey').value + '_' + control.get('resolvedtimeVal').value),
                notifyTo: control.get('notifyTo').value
            };
            remind.push(obj);
        });
        return remind;
    };
    // ConvertToEmail(emails) {
    // 	console.log(emails);
    // 	let convertedEmails = [];
    // 	emails.map(res => {
    // 		if (res == 'Assigned Agent') {
    // 			this.AgentsList.filter(data => {
    // 				if (data.first_name + data.last_name == res) {
    // 					convertedEmails.push(data.email);
    // 				}
    // 			})
    // 		}
    // 	})
    // 	return convertedEmails;
    // }
    AddSlaPoliciesComponent.prototype.ConvertToSingleUnit = function (time) {
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
    AddSlaPoliciesComponent.prototype.Validate = function (ind, respkey, respVal, resvKey, resvVal) {
        var RespTime = this.ConvertToSingleUnit(respkey + '_' + respVal);
        var ResvTime = this.ConvertToSingleUnit(resvKey + '_' + resvVal);
        if (RespTime > ResvTime) {
            document.getElementById(ind).style.backgroundColor = "red";
            this.disableButton = true;
        }
        else {
            document.getElementById(ind).style.backgroundColor = "white";
            this.disableButton = false;
        }
    };
    AddSlaPoliciesComponent.prototype.UpdatePolicy = function () {
        var updatedpolicy = {
            nsp: this.nsp,
            policyName: this.policyForm.get('policyName').value,
            policyDesc: this.policyForm.get('policyDesc').value,
            policyTarget: this.ParseTarget(this.policyForm.get('policyTarget')),
            policyApplyTo: this.policyForm.get('policyApplyTo').value,
            reminderResponse: this.ParseReminderResponse(this.policyForm.get('reminderResponse')),
            reminderResolution: this.ParseReminderResolve(this.policyForm.get('reminderResolution')),
            violationResponse: this.ParseViolation(this.policyForm.get('violationResponse')),
            violationResolution: this.ParseViolation(this.policyForm.get('violationResolution')),
            activated: this.PolicyObject.activated,
            created: this.PolicyObject.created,
            order: this.PolicyObject.order
        };
        this._slaPolicyService.updateSLAPolicy(this.selectedPolicy._id, updatedpolicy).subscribe(function (res) {
            if (res.status == "ok") {
            }
        });
    };
    AddSlaPoliciesComponent.prototype.Cancel = function () {
        var _this = this;
        if (this.formChanges) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._slaPolicyService.selectedSLAPolicy.next(undefined);
                    _this._slaPolicyService.AddSLAPolicy.next(false);
                }
                else {
                    return;
                }
            });
        }
        else {
            this._slaPolicyService.selectedSLAPolicy.next(undefined);
            this._slaPolicyService.AddSLAPolicy.next(false);
        }
    };
    AddSlaPoliciesComponent.prototype.loadMoreRemResp = function () {
        var _this = this;
        if (!this.endedRemResp && !this.loadingMoreAgentsRemResp && !this.selectedAgentRemResp.length) {
            this.loadingMoreAgentsRemResp = true;
            this._utilityService.getMoreAgentsObs(this.AgentsList[this.AgentsList.length - 1].first_name).subscribe(function (response) {
                _this.AgentsList = _this.AgentsList.concat(response.agents);
                _this.endedRemResp = response.ended;
                _this.loadingMoreAgentsRemResp = false;
            });
        }
    };
    AddSlaPoliciesComponent.prototype.loadMoreRemResv = function () {
        var _this = this;
        if (!this.endedRemResv && !this.loadingMoreAgentsRemResv && !this.selectedAgentRemResv.length) {
            this.loadingMoreAgentsRemResv = true;
            this._utilityService.getMoreAgentsObs(this.AgentsList[this.AgentsList.length - 1].first_name).subscribe(function (response) {
                _this.AgentsList = _this.AgentsList.concat(response.agents);
                _this.endedRemResv = response.ended;
                _this.loadingMoreAgentsRemResv = false;
            });
        }
    };
    AddSlaPoliciesComponent.prototype.loadMoreVioResp = function () {
        var _this = this;
        if (!this.endedVioResp && !this.loadingMoreAgentsVioResp && !this.selectedAgentVioResp.length) {
            this.loadingMoreAgentsVioResp = true;
            this._utilityService.getMoreAgentsObs(this.AgentsList[this.AgentsList.length - 1].first_name).subscribe(function (response) {
                _this.AgentsList = _this.AgentsList.concat(response.agents);
                _this.endedVioResp = response.ended;
                _this.loadingMoreAgentsVioResp = false;
            });
        }
    };
    AddSlaPoliciesComponent.prototype.loadMoreVioResv = function () {
        var _this = this;
        if (!this.endedVioResv && !this.loadingMoreAgentsVioResv && !this.selectedAgentVioResv.length) {
            this.loadingMoreAgentsVioResv = true;
            this._utilityService.getMoreAgentsObs(this.AgentsList[this.AgentsList.length - 1].first_name).subscribe(function (response) {
                _this.AgentsList = _this.AgentsList.concat(response.agents);
                _this.endedVioResv = response.ended;
                _this.loadingMoreAgentsVioResv = false;
            });
        }
    };
    AddSlaPoliciesComponent.prototype.onSearchRemResp = function (value) {
        var _this = this;
        if (value) {
            if (!this.selectedAgentRemResp.length) {
                var agents_1 = this.AgentsList.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                                agents_1.push(element);
                            }
                        });
                    }
                    _this.AgentsList = agents_1;
                });
            }
            else {
                var agents = this.AgentsList.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.AgentsList = agents;
            }
        }
        else {
            this.AgentsList = this.agentList_original;
            this.endedRemResp = false;
        }
    };
    AddSlaPoliciesComponent.prototype.onSearchRemResv = function (value) {
        var _this = this;
        if (value) {
            if (!this.selectedAgentRemResv.length) {
                var agents_2 = this.AgentsList.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_2.filter(function (a) { return a.email == element.email; }).length) {
                                agents_2.push(element);
                            }
                        });
                    }
                    _this.AgentsList = agents_2;
                });
            }
            else {
                var agents = this.AgentsList.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.AgentsList = agents;
            }
        }
        else {
            this.AgentsList = this.agentList_original;
            this.endedRemResv = false;
        }
    };
    AddSlaPoliciesComponent.prototype.onSearchVioResp = function (value) {
        var _this = this;
        if (value) {
            if (!this.selectedAgentVioResp.length) {
                var agents_3 = this.AgentsList.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_3.filter(function (a) { return a.email == element.email; }).length) {
                                agents_3.push(element);
                            }
                        });
                    }
                    _this.AgentsList = agents_3;
                });
            }
            else {
                var agents = this.AgentsList.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.AgentsList = agents;
            }
        }
        else {
            this.AgentsList = this.agentList_original;
            this.endedVioResp = false;
        }
    };
    AddSlaPoliciesComponent.prototype.onSearchVioResv = function (value) {
        var _this = this;
        if (value) {
            if (!this.selectedAgentVioResv.length) {
                var agents_4 = this.AgentsList.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_4.filter(function (a) { return a.email == element.email; }).length) {
                                agents_4.push(element);
                            }
                        });
                    }
                    _this.AgentsList = agents_4;
                });
            }
            else {
                var agents = this.AgentsList.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.AgentsList = agents;
            }
        }
        else {
            this.AgentsList = this.agentList_original;
            this.endedVioResv = false;
        }
    };
    AddSlaPoliciesComponent.prototype.ngOnDestroy = function () {
        this._slaPolicyService.AddSLAPolicy.next(false);
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        this.PolicyObject.reminderResolution.map(function (res) {
            res.emails = [];
            res.notifyTo = ['Assigned Agent'];
        });
        this.PolicyObject.reminderResponse.map(function (res) {
            res.emails = [];
            res.notifyTo = ['Assigned Agent'];
        });
        this.PolicyObject.violationResolution.map(function (res) {
            res.emails = [];
            res.notifyTo = ['Assigned Agent'];
        });
        this.PolicyObject.violationResponse.map(function (res) {
            res.emails = [];
            res.notifyTo = ['Assigned Agent'];
        });
    };
    __decorate([
        core_1.Input()
    ], AddSlaPoliciesComponent.prototype, "PolicyObject", void 0);
    AddSlaPoliciesComponent = __decorate([
        core_1.Component({
            selector: 'app-add-sla-policies',
            templateUrl: './add-sla-policies.component.html',
            styleUrls: ['./add-sla-policies.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AddSlaPoliciesComponent);
    return AddSlaPoliciesComponent;
}());
exports.AddSlaPoliciesComponent = AddSlaPoliciesComponent;
//# sourceMappingURL=add-sla-policies.component.js.map