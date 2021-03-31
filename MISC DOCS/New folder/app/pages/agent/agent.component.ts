import { Component, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AgentService } from '../../../services/AgentService';
import { MatDialog } from '@angular/material/dialog';
import { GlobalStateService } from '../../../services/GlobalStateService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/AuthenticationService';
import { Validators, FormGroup, FormBuilder, FormControl, } from '@angular/forms';
import { UploadingService } from '../../../services/UtilityServices/UploadingService';
import { CallDialogComponent } from '../../dialogs/call-dialog/call-dialog.component';
import { CallingService } from '../../../services/CallingService';
import { AdminSettingsService } from '../../../services/adminSettingsService';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { NewConversationDialogComponent } from '../../dialogs/new-conversation-dialog/new-conversation-dialog.component';
import { ChangePasswordDialogComponent } from '../../dialogs/change-password-dialog/change-password-dialog.component';
import { PopperContent } from 'ngx-popper';
import { UtilityService } from '../../../services/UtilityServices/UtilityService';

@Component({
    selector: 'app-agent',
    templateUrl: './agent.component.html',
    styleUrls: ['./agent.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AgentComponent {

    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('filterPopper') filterPopper: PopperContent;
    agent: any;
    role = '';
    roles = [];
    edit = false;
    subscription: Subscription[] = [];
    // private loadingAgents: BehaviorSubject<boolean> = new BehaviorSubject(true);
    selectedAgent: any = {};
    agentConversation: any;
    file: File;
    selectedType = 'single';

    //To Show Requesting Status
    loading = false;

    //Editing Value
    // first_name;
    // last_name;
    // nickname;
    // phone_no;
    company: string;

    first_name_control;
    last_name_control;
    nickname_control;
    phone_no_control;
    email_control;
    uploading: boolean;
    initiateChat = true;
    showChat: any;
    showAgentAccessInfo: any;
    isSelfViewingChat: any;
    selectedAgentConversation: any;
    callSettings: any;
    verified = true;
    loadingConversation = false;
    production = false;
    sbt = false;
    public searchForm: FormGroup;
    public agentEditForm: FormGroup;
    editRoleEnabled = true;
    editRole = false;
    agentRole: any;
    permissions: any;
    totalAgents = 0;
    totalConversations = 0;
    agentGroups = [];
    listToView = {
        'agents': true,
        'conversations': false
    }
    pills = {
        'profile': true,
        'notifications': false,
        'stats': false
    }
    changes = {
        email: false,
        window: false
    }
    windowNotificationSettings: any;
    emailNotificationSettings: any;
    emailNotificationForm: FormGroup;
    windowNotificationsForm: FormGroup;
    rand = ['#9BB4DD', '#6B9ED4', '#F58758', '#FACE63', '#55C4CC', '#F7C138', '#8580BC', '#7BB446', '#E24050', '#EC59AA', '#F2AEBB', '#01DD9F', '#7AEDDE', '#01D2E9', '#06A1E4', '#A7A9E2', '#A190D7', '#FF99CB', '#FF2D36', '#F19645', '#99CDFF', '#FB896E', '#33BFBE', '#1982C4', '#838DB0', '#50BF94', '#963FC1'];
    showViewHistory = true;
    selectedFilter = 'all';
    public agentCounts = {
        total: 0,
        agents: []
    };
    filterDrawer = false;

    package = undefined;

    constructor(
        private _appStateService: GlobalStateService,
        private _agentService: AgentService,
        private _utilityService: UtilityService,
        private _authService: AuthService,
        private _uploadingService: UploadingService,
        private _router: ActivatedRoute,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        public _callingService: CallingService,
        public _settingService: AdminSettingsService,
        private formbuilder: FormBuilder
    ) {

        this.subscription.push(_authService.getPackageInfo().subscribe(pkg => {
            // console.log(data);
            if (pkg) {
                this.package = pkg.agents;
            }
        }));

        this.subscription.push(_authService.getSettings().subscribe(data => {
            // console.log(data);
            if (data && data.permissions) {
                this.permissions = data.permissions;
                this.roles = data.permissions.settings.rolesAndPermissions.canView;
                // console.log(this.permissions);
            }
        }));

        this.searchForm = this.formbuilder.group({
            'searchValue': ['', []
            ]
        });
        this.agentEditForm = this.formbuilder.group({
            'first_name': ['', Validators.required],
            'last_name': [''],
            'phone_no': [''],
            'nickname': ['', Validators.required],
            'username': [{ value: '', disabled: true }],
            'gender': [''],
            'simchats': ['', [Validators.required, Validators.min(1), Validators.max(this.package.maxConcurrentChats)]]
        });
      
        this.subscription.push(_authService.Production.subscribe(data => {
            this.production = data;
        }));
        this.subscription.push(_authService.SBT.subscribe(data => {
            this.sbt = data;
        }));
        this.subscription.push(_agentService.listToView.subscribe(data => {
            this.listToView = data;
        }));
        this.subscription.push(_agentService.filterDrawer.subscribe(data => {
            this.filterDrawer = data;
        }));

        this.subscription.push(_authService.getAgent().subscribe(agent => {
            this.agent = agent;
            // this.role = agent.role;
            // console.log(agent);
        }));
        this.subscription.push(_agentService.agentCounts.subscribe(data => {
            if (data) {
                this.agentCounts = data;
                // console.log(data);
                // console.log(this._agentService.selectedFilter.getValue());

                switch (this._agentService.selectedFilter.getValue()) {
                    case 'online':
                        this.totalAgents = data.agents.length
                        break;
                    case 'offline':
                        this.totalAgents = data.total - data.agents.length
                        break;
                    case 'all':
                        this.totalAgents = data.total;
                        break;
                }

            }
            // console.log(agent);
        }));
        this.subscription.push(_agentService.selectedFilter.subscribe(data => {
            this.selectedFilter = data;
            // console.log(agent);
        }));
        this.subscription.push(_agentService.agentConversationList.subscribe(conv => {
            this.totalConversations = conv.length;
            // console.log(agent);
        }));

        this.subscription.push(_agentService.isSelfViewingChat.subscribe(data => {

            if (data) {
                this.isSelfViewingChat = data;
                // console.log((this.isSelfViewingChat && this.isSelfViewingChat.value) && (this.selectedAgent.email != this.agent.email));
            }
        }));
        this.subscription.push(_agentService.loadingConversation.subscribe(data => {
            this.loadingConversation = data;
        }));
        this.subscription.push(_agentService.searchValue.subscribe(data => {
            this.searchForm.get('searchValue').setValue(data);
        }));
        this.subscription.push(_agentService.selectedAgentConversation.subscribe(data => {
            this.agentConversation = data;
            // console.log('Agent Conversation');
            // console.log(this.agentConversation);
        }));



        this.subscription.push(_agentService.selectedAgent.subscribe(agent => {

            // console.log('agent');
            // console.log(agent);

            if (agent) {
                this.getGroups(agent.email)
            }
            this.selectedAgent = agent;
            this.pills['notifications'] = false;
            this.pills['profile'] = true;
            this.editRoleEnabled = true;
            this.agentRole = this.selectedAgent.role;
            this.company = (Object.keys(this.selectedAgent).length) ? this.selectedAgent.nsp.split('/')[1] : '';
            if (Object.keys(this.selectedAgent).length) {
                // this._agentService.GetEmailNotificationSettings();
                // this._agentService.GetWindowNotificationSettings();
                this.subscription.push(_agentService.windowNotificationSettings.subscribe(settings => {
                    if (settings) {
                        this.windowNotificationSettings = settings;
                        this.updateWindowNotifSettings(this.windowNotificationSettings);
                        
                    }
                }));
                this.subscription.push(_agentService.emailNotificationSettings.subscribe(settings => {
                    if (settings) {
                        this.emailNotificationSettings = settings;
                        this.selectedAgent.settings.emailNotifications = this.emailNotificationSettings;
                        this.updateEmailSettings(this.emailNotificationSettings);
                    }
                }));
                // this.first_name = this.selectedAgent.first_name;
                // this.last_name = this.selectedAgent.last_name;
                // this.nickname = this.selectedAgent.nickname;
                // this.nickname = this.selectedAgent.nickname;
                // this.phone_no = this.selectedAgent.phone_no;
                this.agentEditForm.get('first_name').setValue(this.selectedAgent.first_name);
                this.agentEditForm.get('last_name').setValue(this.selectedAgent.last_name);
                this.agentEditForm.get('phone_no').setValue(this.selectedAgent.phone_no);
                this.agentEditForm.get('nickname').setValue(this.selectedAgent.nickname);
                this.agentEditForm.get('username').setValue(this.selectedAgent.username);
                this.agentEditForm.get('gender').setValue(this.selectedAgent.gender);
                this.agentEditForm.get('simchats').setValue(this.selectedAgent.settings.simchats);
                this.role = this.selectedAgent.role;
                // this.first_name_control = new FormControl(this.selectedAgent.first_name, [Validators.required]);
                // this.last_name_control = new FormControl(this.selectedAgent.last_name, [Validators.required]);
                // this.nickname_control = new FormControl(this.selectedAgent.nickname, [Validators.required]);
                // this.phone_no_control = new FormControl(this.selectedAgent.phone_no, [Validators.pattern(/^[0-9\-]+$/)]);
                // this.email_control = new FormControl(this.selectedAgent.email, [Validators.required]);
                if (this.selectedAgent._id == this.agent._id) {
                    this.editRoleEnabled = false;
                    this.editRole = false;
                }
            }
            if (this.edit)
                this.Cancel();
                
        }));

        this.subscription.push(_agentService.getNotification().subscribe(notification => {
            this.loading = false;

            if (notification) {
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: notification.img,
                        msg: notification.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
                }).dismiss;
            }
        }));
        this.subscription.push(_agentService.showAgentAccessInfo.subscribe(data => {
            this.showAgentAccessInfo = data;
        }))

        this.subscription.push(_agentService.selectedAgentConversation.subscribe(data => {
            this.selectedAgentConversation = data;
        }));
        this.subscription.push(_settingService.callSettings.subscribe(data => {
            this.callSettings = data;
        }));

        this.subscription.push(this._authService.getSettings().subscribe(settings => {
            if (settings && Object.keys(settings).length) this.verified = settings.verified;
        }));

        this.subscription.push(this._appStateService.shortcutEvents.subscribe(data => {

            this._agentService.SelectAgent(data);
        }));
        this.subscription.push(this._appStateService.resizeEvent.subscribe(data => {

            this.showViewHistory = data;
        }));

        this.subscription.push(_agentService.closeDetail.subscribe(data => {



            this.showViewHistory = data;
        }));


    }

    toggleFilterDrawer() {
        this._agentService.filterDrawer.next(!this.filterDrawer);
    }

    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscription.forEach(subscription => {
            subscription.unsubscribe();
        });
        this._agentService.setSelectedAgent();
        // this._agentService.selectedFilter.next('all');
        // this._agentService.getAllAgentsAsync();

        this._appStateService.CloseControlSideBar();
    }

    Edit() {
        this.edit = true;
    }

    changeList(name) {
        switch (name) {
            case 'agents':
                this.listToView['agents'] = true;
                this.listToView['conversations'] = false;
                this._agentService.isSelfViewingChat.next({
                    chatId: '',
                    value: false
                });
                // this._agentService.selectedAgentConversation.next({});
                break;
            case 'conversations':
                this.listToView['agents'] = false;
                this.listToView['conversations'] = true;
                this.filterPopper.hide();
                if (Object.keys(this.selectedAgentConversation).length) {
                    // this._agentService.isSelfViewingChat.next({
                    //     chatId: this.selectedAgentConversation._id,
                    //     value: true
                    // });
                    this._agentService.conversationSeen(this.selectedAgentConversation._id, this.selectedAgentConversation.members.map(a => a.email));
                }
                break;
        }
        // Object.keys(this.listToView).map(key => {
        //     if(key == name){
        //         this.listToView[key] = true;
        //     }else{
        //         this.listToView[key] = false;
        //     }
        // });
    }

    getGroups(email) {
        this._utilityService.getGroupsAgainstAgent(email).subscribe(groups => {
            this.agentGroups = groups;
        });
    }

    Save() {
        this.loading = true;
        // console.log(this.agentEditForm.value);

        let properties = this.agentEditForm.value;
        properties.role = this.role;
        // console.log(properties);
        this._agentService.editAgent(properties);

    }

    setPillActive(pill) {
        Object.keys(this.pills).map(key => {
            if (key == pill) {
                this.pills[key] = true;
            } else {
                this.pills[key] = false;
            }
        })
    }

    setSearchValue() {
        this._agentService.setSearchValue(this.searchForm.get('searchValue').value);
    }


    Cancel() {
        this.edit = false;
        // this.first_name = this.selectedAgent.first_name;
        // this.last_name = this.selectedAgent.last_name;
        // this.nickname = this.selectedAgent.nickname;
        // this.phone_no = this.selectedAgent.phone_no;
        // this.first_name_control = new FormControl(this.selectedAgent.first_name, [Validators.required]);
        // this.last_name_control = new FormControl(this.selectedAgent.last_name, [Validators.required]);
        // this.nickname_control = new FormControl(this.selectedAgent.nickname, [Validators.required]);
        // this.phone_no_control = new FormControl(this.selectedAgent.phone_no, [Validators.pattern(/^[0-9]+$/)]);
        // this.email_control = new FormControl(this.selectedAgent.email, [Validators.required]);
        this.agentEditForm.get('first_name').setValue(this.selectedAgent.first_name);
        this.agentEditForm.get('last_name').setValue(this.selectedAgent.last_name);
        this.agentEditForm.get('phone_no').setValue(this.selectedAgent.phone_no);
        this.agentEditForm.get('nickname').setValue(this.selectedAgent.nickname);
        this.agentEditForm.get('username').setValue(this.selectedAgent.username);
        this.agentEditForm.get('gender').setValue(this.selectedAgent.gender);
        this.agentEditForm.get('simchats').setValue(this.selectedAgent.settings.simchats);
    }

    // openConvDialog(type){
    //     this.newConversationDialog(type);
    // }

    newConversationDialog(type) {
        this.dialog.open(NewConversationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { email: this.agent.email, type: type }
        }).afterClosed().subscribe(data => {
            if (data) {
                // console.log(data);
                let obj = {
                    type: data.type,
                    group_name: data.groupName,
                    members: data.selectedAgents,
                    createdBy: this.agent.email,
                    createdOn: new Date().toISOString(),
                    LastUpdated: new Date().toISOString(),
                    nsp: this.agent.nsp,
                    messages: [],
                    LastSeen: []
                };
                obj.members.forEach(member => {
                    obj.LastSeen.push({
                        email: member.email,
                        messageReadCount: 0,
                        DateTime: new Date().toISOString()
                    });
                });
                // console.log(obj);
                this._agentService.getOrcreateConversation(obj)
            }
        });
    }

    toggleEditRole() {
        this.editRole = !this.editRole;
    }

    cancelEdit() {
        this.editRole = false;
        this.agentRole = this.selectedAgent.role;
    }
    saveRoleForAgent() {
        // console.log(this.agentLev
        this.dialog.open(ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want to change role for this user? Note: New settings will be updated for this user upon next login.' }
        }).afterClosed().subscribe(data => {
            if (data == 'ok') {
                this._agentService.editAgent({
                    first_name: this.selectedAgent.first_name,
                    last_name: this.selectedAgent.last_name,
                    nickname: this.selectedAgent.nickname,
                    phone_no: this.selectedAgent.phone_no,
                    gender: this.selectedAgent.gender,
                    simchats: this.selectedAgent.settings.simchats,
                    role: this.agentRole
                });
                this.editRole = false;
            } else {
                this.cancelEdit();
            }
        });

    }

    public NumbersOnly(event: any) {
        const pattern = /[0-9\-]+/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    public UploadImage(event: Event) {
        // console.log(event)
        if ((<HTMLInputElement>event.target).files.length > 0) {
            this.file = (<HTMLInputElement>event.target).files[0];
            return;
        }
        this.file = undefined;
        return;
    }

    fetchFilteredAgents(type) {
        this._agentService.selectedFilter.next(type);
        this._agentService.getAllAgentsAsync(type);
        if (this.agentCounts) {
            switch (this._agentService.selectedFilter.getValue()) {
                case 'online':
                    this.totalAgents = this.agentCounts.agents.length
                    break;
                case 'offline':
                    this.totalAgents = this.agentCounts.total - this.agentCounts.agents.length
                    break;
                case 'all':
                    this.totalAgents = this.agentCounts.total;
                    break;
            }
        }
        this.filterPopper.hide();
    }

    public ClearFile() {
        this.file = undefined;
        this.fileInput.nativeElement.value = '';
    }

    public SendFile() {
        this.uploading = true;
        this._uploadingService.SignRequest(this.file, 'UploadProfilePicture').subscribe(response => {
            let params = JSON.parse(response.text());
            params.file = this.file
            this._uploadingService.uploadAttachment(params).subscribe(s3response => {
                //console.log(s3response);
                if (s3response.status == '201') {
                    this._uploadingService.parseXML(s3response.text()).subscribe(json => {
                        //console.log(json.response.PostResponse.Location[0])
                        this._uploadingService.ChangeProfileImage(this.agent.email, json.response.PostResponse.Location[0]);
                        this.file = undefined;
                        this.fileInput.nativeElement.value = '';
                        this.uploading = false;
                        this._authService.updateAgentProfileImage(json.response.PostResponse.Location[0]);
                        this._agentService.updateAgentProfileImage(this.agent.email, json.response.PostResponse.Location[0])
                    }, err => {
                        // console.log(err);
                        this.uploading = false;
                    });
                }
            }, err => {
                // console.log(err);
                this.uploading = false;
            });
        }, err => {
            this.snackBar.openFromComponent(ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Error in uploading, Please try again!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'error']
            });
            console.log('error in Sigining');
            // console.log(err);
            this.uploading = false;
        });
    }

    public TryCall(selectedAgent: any) {
        event.preventDefault();
        this.dialog.open(CallDialogComponent, {
            panelClass: ['calling-dialog'],
            data: selectedAgent,
            disableClose: true,
            autoFocus: true
        }).afterClosed().subscribe(response => {
            // console.log(response);
            this._callingService.EndCall();
        });
    }

    ToggleChat() {
        let obj = {
            type: 'single',
            group_name: '',
            members: [
                {
                    email: this.agent.email,
                    viewColor: this.rand[Math.floor(Math.random() * this.rand.length)],
                    isAdmin: true,
                },
                {
                    email: this.selectedAgent.email,
                    viewColor: this.rand[Math.floor(Math.random() * this.rand.length)],
                    isAdmin: false,
                }
            ],
            createdBy: this.agent.email,
            createdOn: new Date().toISOString(),
            LastUpdated: new Date().toISOString(),
            nsp: this.agent.nsp,
            messages: [],
            LastSeen: [
                {
                    email: this.agent.email,
                    messageReadCount: 0,
                    DateTime: new Date().toISOString()
                },
                {
                    email: this.selectedAgent.email,
                    messageReadCount: 0,
                    DateTime: new Date().toISOString()
                }
            ]
        }
        this._agentService.getOrcreateConversation(obj);
    }

    displayChangePassword() {
        if (this.agent.role == 'superadmin') {
            if (this.selectedAgent._id == this.agent._id) {
                return this.permissions.agents.canChangeOwnPassword;
            } else {
                return this.permissions.agents.canChangeOthersPassword;
            }
        } else {
            if (this.selectedAgent.role != 'superadmin') {
                if (this.selectedAgent._id == this.agent._id) {
                    return this.permissions.agents.canChangeOwnPassword;
                } else {
                    return this.permissions.agents.canChangeOthersPassword;
                }
            } else {
                return false;
            }
        }
    }

    updateWindowNotifSettings(settings) {
        this.windowNotificationsForm = this.formbuilder.group({});
        Object.keys(settings).map(key => {
            this.windowNotificationsForm.addControl(key, new FormControl(settings[key], [Validators.required]));
            this.selectedAgent.windowNotifications = this.windowNotificationsForm.value;
        });
    }
    updateEmailSettings(settings) {
        this.emailNotificationForm = this.formbuilder.group({});
        Object.keys(settings).map(key => {
            this.emailNotificationForm.addControl(key, new FormControl(settings[key], [Validators.required]));
            this.selectedAgent.emailNotifications = this.emailNotificationForm.value;
        });
        
    }

    settingsChanged(type) {
        this.changes[type] = true;
    }
    submitWindowSettings() {
        this.loading = true;
        this._agentService.SetWindowNotificationSettings(this.windowNotificationsForm.value).subscribe(response => {

            this.loading = false;
            if (response.status == 'ok') {
                this.changes['window'] = false;
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Settings saved successfully!'
                    },
                    duration: 5000,
                    panelClass: ['user-alert', 'success']
                });
            } else if (response.status == 'error') {
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error!'
                    },
                    duration: 5000,
                    panelClass: ['user-alert', 'error']
                });
            }
        }, err => {
            this.loading = false;
        });

    }

    submitEmailSettings() {
        this.loading = true;
        this._agentService.SetEmailNotificationSettings(this.emailNotificationForm.value)
            .subscribe(response => {
                this.loading = false;
                if (response.status == 'ok') {
                    this.changes['email'] = false;
                    this.snackBar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Settings saved successfully!'
                        },
                        duration: 5000,
                        panelClass: ['user-alert', 'success']
                    });
                } else if (response.status == 'error') {
                    this.snackBar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error!'
                        },
                        duration: 5000,
                        panelClass: ['user-alert', 'error']
                    });
                }
            }, err => {
                this.loading = false;
            });
    }

    ChangePassword() {
        let fieldCount = 3;
        if (this.agent.role == 'superadmin') {
            // console.log('Show 2 fields');
            fieldCount = 2;
        } else {
            if (this.agent._id != this.selectedAgent._id) {
                // console.log('Show 2 Fields');
                fieldCount = 2;
            } else {
                // console.log('Show 3 Fields');
                fieldCount = 3;
            }
        }
        this.dialog.open(ChangePasswordDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { fieldCount: fieldCount, email: this.selectedAgent.email },
            disableClose: true,
        }).afterClosed().subscribe(data => {
            // console.log(data.status);

            if (data.status == 'success') {
                this._agentService.setNotification('Password changed successfully!', 'success', 'ok');
            } else if (data.status == 'error') {
                this._agentService.setNotification('Error!', 'error', 'warning');
            }
        });

    }

    toggleAgentAccessInfo() {
        this._agentService.toggleAgentAccessInformation();
    }


}

