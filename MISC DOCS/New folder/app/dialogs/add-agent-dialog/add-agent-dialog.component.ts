import { Component, OnInit, ViewEncapsulation, Directive } from '@angular/core';
import { AfterViewInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { AgentService } from '../../../services/AgentService';
import { AuthService } from '../../../services/AuthenticationService';
import { ValidationService } from '../../../services/UtilityServices/ValidationService';
import { FormBuilder, FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TicketAutomationService } from '../../../services/LocalServices/TicketAutomationService';
import { GlobalStateService } from '../../../services/GlobalStateService';
import { ImportExportContactsDialogComponent } from '../import-export-contacts-dialog/import-export-contacts-dialog.component';

declare var $: any;

@Component({
    selector: 'app-add-agent-dialog',
    templateUrl: './add-agent-dialog.component.html',
    styleUrls: ['./add-agent-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers:[
        AgentService
    ]
})
export class AddAgentDialogComponent implements OnInit, AfterViewInit {

    public http: any;
    public subscriptions: Subscription[] = [];
    public groupsList = [];
    public roles = [];
    public agent: any;

    private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public loading = false;
    private successfull = false;

    public agentRegForm: FormGroup;



    constructor(public _authService: AuthService,
        private formbuilder: FormBuilder,
        public dialog: MatDialog,
        public _stateService: GlobalStateService,
        public _agentService: AgentService,
        public _validationService: ValidationService,
        private dialogRef: MatDialogRef<AddAgentDialogComponent>,
        private _ticketGroupService: TicketAutomationService) {



        this.agentRegForm = formbuilder.group({
            'first_name': [null, Validators.required],
            'last_name': [null, Validators.required],
            'nickname': [null, Validators.required],
            'agentphone_no': ['',
                [
                    Validators.pattern(/^[0-9\-]+$/)
                ]
            ],
            'agentemail': ['',
                [
                    Validators.pattern(this.emailPattern),
                    Validators.required
                ],
                this._validationService.isEmailUnique.bind(this)
            ],
            'agentpassword': [null,
                [
                    Validators.required,
                    Validators.minLength(8)
                ]
            ],
            'gender': ['Male', Validators.required],
            'role': ['', Validators.required],
            'ticketgroups': [''],
            'simchats': [20, [Validators.required, Validators.min(1)]],
            'enablechat': [true, Validators.required],
            'voicecall': [true, Validators.required],
            'videocall': [true, Validators.required],
            'editprofilepic': [true, Validators.required],
            'editname': [true, Validators.required],
            'editnickname': [true, Validators.required],
            'editpassword': [true, Validators.required]
        });

        this.subscriptions.push(_authService.getAgent().subscribe(agent => {
            this.agent = agent;
            // _authService.getGroupsFromBackend();
        }));
        this.subscriptions.push(_authService.permissions.subscribe(permissions => {
            if (this.agent) {
                this.roles = permissions[this.agent.role].settings.rolesAndPermissions.canView;
            }
            // _authService.getGroupsFromBackend();
        }));
        // this.subscriptions.push(_authService.getGroups().subscribe(groups => {
        //     this.groupsList = groups;
        // }));

        this.subscriptions.push(_ticketGroupService.Groups.subscribe(data => {
            if (data && data.length) {
                this.groupsList = data.map(g => g.group_name);
            }
            console.log('Got Groups List Agent Dialog', data);
            console.log('Got Groups List Agent Dialog', this.groupsList);
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

    ngOnInit() {
        // this.applyValidator();
    }

    ngAfterViewInit() { }

    ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this._agentService.Destroy();
    }

    navigateToGroups() {
        this.dialogRef.close({
            status: false
        });
        this._stateService.NavigateTo('/settings/ticket-management/groups');
    }

    submitForm(form: Form) {
        //console.log('Value Submitted');
        //this.agentRegForm.valid
        if (this.agentRegForm.valid) {
            let agent = {
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
                    emailNotifications : { newTickCreate: true, assignToAgent: true, unattendTickGroup: true, repliesToTicket: true, noteAddTick: true, agentInviteEmail: true },
                    windowNotifications : { newTicket: true, ticketMessage: true, ticketAssigned: true, ticketUpdated: true, agentConversation: true }

                }
            }

            // console.log('Registering Agent');
            this.loading = true;
            this._authService.RegisterAgent(agent)
                .subscribe((response) => {
                    this.successfull = true;
                    this.loading = false;
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
                    this.dialogRef.close({
                        status: true,
                        agent: response
                    });
                }, (err => {
                    this.loading = false;
                    return Observable.throw(err.json());
                }));
        }
    }

    ShowImportExportDialog() {
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
    }

    Close(event: Event) {
        this.dialogRef.close();
    }


}