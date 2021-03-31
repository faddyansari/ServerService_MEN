"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAgentDialogComponent = void 0;
var core_1 = require("@angular/core");
var AgentService_1 = require("../../../services/AgentService");
var forms_1 = require("@angular/forms");
var Observable_1 = require("rxjs/Observable");
var AddAgentDialogComponent = /** @class */ (function () {
    function AddAgentDialogComponent(_authService, formbuilder, dialog, _stateService, _agentService, _validationService, dialogRef, _ticketGroupService) {
        var _this = this;
        this._authService = _authService;
        this.formbuilder = formbuilder;
        this.dialog = dialog;
        this._stateService = _stateService;
        this._agentService = _agentService;
        this._validationService = _validationService;
        this.dialogRef = dialogRef;
        this._ticketGroupService = _ticketGroupService;
        this.subscriptions = [];
        this.groupsList = [];
        this.roles = [];
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.loading = false;
        this.successfull = false;
        this.agentRegForm = formbuilder.group({
            'first_name': [null, forms_1.Validators.required],
            'last_name': [null, forms_1.Validators.required],
            'nickname': [null, forms_1.Validators.required],
            'agentphone_no': ['',
                [
                    forms_1.Validators.pattern(/^[0-9\-]+$/)
                ]
            ],
            'agentemail': ['',
                [
                    forms_1.Validators.pattern(this.emailPattern),
                    forms_1.Validators.required
                ],
                this._validationService.isEmailUnique.bind(this)
            ],
            'agentpassword': [null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(8)
                ]
            ],
            'gender': ['Male', forms_1.Validators.required],
            'role': ['', forms_1.Validators.required],
            'ticketgroups': [''],
            'simchats': [20, [forms_1.Validators.required, forms_1.Validators.min(1)]],
            'enablechat': [true, forms_1.Validators.required],
            'voicecall': [true, forms_1.Validators.required],
            'videocall': [true, forms_1.Validators.required],
            'editprofilepic': [true, forms_1.Validators.required],
            'editname': [true, forms_1.Validators.required],
            'editnickname': [true, forms_1.Validators.required],
            'editpassword': [true, forms_1.Validators.required]
        });
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
            // _authService.getGroupsFromBackend();
        }));
        this.subscriptions.push(_authService.permissions.subscribe(function (permissions) {
            if (_this.agent) {
                _this.roles = permissions[_this.agent.role].settings.rolesAndPermissions.canView;
            }
            // _authService.getGroupsFromBackend();
        }));
        // this.subscriptions.push(_authService.getGroups().subscribe(groups => {
        //     this.groupsList = groups;
        // }));
        this.subscriptions.push(_ticketGroupService.Groups.subscribe(function (data) {
            if (data && data.length) {
                _this.groupsList = data.map(function (g) { return g.group_name; });
            }
            console.log('Got Groups List Agent Dialog', data);
            console.log('Got Groups List Agent Dialog', _this.groupsList);
        }));
    }
    // applyValidator() {
    //     console.log('Apply Validator');
    //     if (this.agentRegForm.get('role').value == 'admin' || this.agentRegForm.get('role').value == 'superadmin') {
    //         // console.log('IF');
    //         this.agentRegForm.get('ticketgroups').setValue('ticketAdmin');
    //     } else {
    //         this.agentRegForm.get('ticketgroups').setValue('');
    //     }
    //     this.agentRegForm.updateValueAndValidity();
    //     // console.log(this.agentRegForm);
    // }
    AddAgentDialogComponent.prototype.ngOnInit = function () {
        // this.applyValidator();
    };
    AddAgentDialogComponent.prototype.ngAfterViewInit = function () { };
    AddAgentDialogComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._agentService.Destroy();
    };
    AddAgentDialogComponent.prototype.navigateToGroups = function () {
        this.dialogRef.close({
            status: false
        });
        this._stateService.NavigateTo('/settings/ticket-management/groups');
    };
    AddAgentDialogComponent.prototype.submitForm = function (form) {
        var _this = this;
        //console.log('Value Submitted');
        //this.agentRegForm.valid
        if (this.agentRegForm.valid) {
            var agent = {
                first_name: this.agentRegForm.get('first_name').value,
                last_name: this.agentRegForm.get('last_name').value,
                phone_no: this.agentRegForm.get('agentphone_no').value,
                nickname: this.agentRegForm.get('nickname').value,
                username: this.agentRegForm.get('nickname').value,
                password: this.agentRegForm.get('agentpassword').value,
                group: ['DF'],
                email: (this.agentRegForm.get('agentemail').value).toString().toLowerCase(),
                role: this.agentRegForm.get('role').value,
                gender: this.agentRegForm.get('gender').value,
                nsp: this.agent.nsp,
                created_date: new Date(),
                created_by: this.agent.email,
                editsettings: {
                    editprofilepic: this.agentRegForm.get('editprofilepic').value,
                    editname: this.agentRegForm.get('editname').value,
                    editnickname: this.agentRegForm.get('editnickname').value,
                    editpassword: this.agentRegForm.get('editpassword').value,
                },
                communicationAccess: {
                    enablechat: this.agentRegForm.get('enablechat').value,
                    voicecall: this.agentRegForm.get('voicecall').value,
                    videocall: this.agentRegForm.get('videocall').value,
                },
                settings: {
                    simchats: this.agentRegForm.get('simchats').value,
                    emailNotifications: { newTickCreate: true, assignToAgent: true, unattendTickGroup: true, repliesToTicket: true, noteAddTick: true, agentInviteEmail: true },
                    windowNotifications: { newTicket: true, ticketMessage: true, ticketAssigned: true, ticketUpdated: true, agentConversation: true }
                }
            };
            // console.log('Registering Agent');
            this.loading = true;
            this._authService.RegisterAgent(agent)
                .subscribe(function (response) {
                _this.successfull = true;
                _this.loading = false;
                // switch (agent.role) {
                //     case 'admin':
                //         break;
                //     case 'supervisor':
                //         //Make this user admin of selected group
                //         this._ticketGroupService.pushAdmin(agent.email, this.agentRegForm.get('ticketgroups').value);
                //         break;
                //     default:
                //         //add this user to agent_list to selected group
                //         this._ticketGroupService.assignAgent(agent.email, this.agentRegForm.get('ticketgroups').value, false);
                //         break;
                // }
                _this.dialogRef.close({
                    status: true,
                    agent: response
                });
            }, (function (err) {
                _this.loading = false;
                return Observable_1.Observable.throw(err.json());
            }));
        }
    };
    AddAgentDialogComponent.prototype.ShowImportExportDialog = function () {
        // this.subscriptions.push(this.dialog.open(ImportExportContactsDialogComponent, {
        //     panelClass: ['confirmation-dialog'],
        //     disableClose: true,
        //     autoFocus: true,
        // }).afterClosed().subscribe(actionObj => {
        //     if (actionObj.fileUploadHandle) {
        //         // console.log(actionObj.fileUploadHandle);
        //         this._agentService.UploadAgents(actionObj.fileUploadHandle);
        //     }
        //     // Directly export from frontend
        //     if (actionObj.exportContacts) {
        //     }
        // }));
    };
    AddAgentDialogComponent.prototype.Close = function (event) {
        this.dialogRef.close();
    };
    AddAgentDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-add-agent-dialog',
            templateUrl: './add-agent-dialog.component.html',
            styleUrls: ['./add-agent-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                AgentService_1.AgentService
            ]
        })
    ], AddAgentDialogComponent);
    return AddAgentDialogComponent;
}());
exports.AddAgentDialogComponent = AddAgentDialogComponent;
//# sourceMappingURL=add-agent-dialog.component.js.map