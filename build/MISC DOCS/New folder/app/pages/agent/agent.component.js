"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../dialogs/SnackBar-Dialog/toast-notifications.component");
var forms_1 = require("@angular/forms");
var call_dialog_component_1 = require("../../dialogs/call-dialog/call-dialog.component");
var confirmation_dialog_component_1 = require("../../dialogs/confirmation-dialog/confirmation-dialog.component");
var new_conversation_dialog_component_1 = require("../../dialogs/new-conversation-dialog/new-conversation-dialog.component");
var change_password_dialog_component_1 = require("../../dialogs/change-password-dialog/change-password-dialog.component");
var AgentComponent = /** @class */ (function () {
    function AgentComponent(_appStateService, _agentService, _utilityService, _authService, _uploadingService, _router, dialog, snackBar, _callingService, _settingService, formbuilder) {
        var _this = this;
        this._appStateService = _appStateService;
        this._agentService = _agentService;
        this._utilityService = _utilityService;
        this._authService = _authService;
        this._uploadingService = _uploadingService;
        this._router = _router;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this._callingService = _callingService;
        this._settingService = _settingService;
        this.formbuilder = formbuilder;
        this.role = '';
        this.roles = [];
        this.edit = false;
        this.subscription = [];
        // private loadingAgents: BehaviorSubject<boolean> = new BehaviorSubject(true);
        this.selectedAgent = {};
        this.selectedType = 'single';
        //To Show Requesting Status
        this.loading = false;
        this.initiateChat = true;
        this.verified = true;
        this.loadingConversation = false;
        this.production = false;
        this.sbt = false;
        this.editRoleEnabled = true;
        this.editRole = false;
        this.totalAgents = 0;
        this.totalConversations = 0;
        this.agentGroups = [];
        this.listToView = {
            'agents': true,
            'conversations': false
        };
        this.pills = {
            'profile': true,
            'notifications': false,
            'stats': false
        };
        this.changes = {
            email: false,
            window: false
        };
        this.rand = ['#9BB4DD', '#6B9ED4', '#F58758', '#FACE63', '#55C4CC', '#F7C138', '#8580BC', '#7BB446', '#E24050', '#EC59AA', '#F2AEBB', '#01DD9F', '#7AEDDE', '#01D2E9', '#06A1E4', '#A7A9E2', '#A190D7', '#FF99CB', '#FF2D36', '#F19645', '#99CDFF', '#FB896E', '#33BFBE', '#1982C4', '#838DB0', '#50BF94', '#963FC1'];
        this.showViewHistory = true;
        this.selectedFilter = 'all';
        this.agentCounts = {
            total: 0,
            agents: []
        };
        this.filterDrawer = false;
        this.package = undefined;
        this.subscription.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.agents;
            }
        }));
        this.subscription.push(_authService.getSettings().subscribe(function (data) {
            // console.log(data);
            if (data && data.permissions) {
                _this.permissions = data.permissions;
                _this.roles = data.permissions.settings.rolesAndPermissions.canView;
                // console.log(this.permissions);
            }
        }));
        this.searchForm = this.formbuilder.group({
            'searchValue': ['', []
            ]
        });
        this.agentEditForm = this.formbuilder.group({
            'first_name': ['', forms_1.Validators.required],
            'last_name': [''],
            'phone_no': [''],
            'nickname': ['', forms_1.Validators.required],
            'username': [{ value: '', disabled: true }],
            'gender': [''],
            'simchats': ['', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.max(this.package.maxConcurrentChats)]]
        });
        this.subscription.push(_authService.Production.subscribe(function (data) {
            _this.production = data;
        }));
        this.subscription.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscription.push(_agentService.listToView.subscribe(function (data) {
            _this.listToView = data;
        }));
        this.subscription.push(_agentService.filterDrawer.subscribe(function (data) {
            _this.filterDrawer = data;
        }));
        this.subscription.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
            // this.role = agent.role;
            // console.log(agent);
        }));
        this.subscription.push(_agentService.agentCounts.subscribe(function (data) {
            if (data) {
                _this.agentCounts = data;
                // console.log(data);
                // console.log(this._agentService.selectedFilter.getValue());
                switch (_this._agentService.selectedFilter.getValue()) {
                    case 'online':
                        _this.totalAgents = data.agents.length;
                        break;
                    case 'offline':
                        _this.totalAgents = data.total - data.agents.length;
                        break;
                    case 'all':
                        _this.totalAgents = data.total;
                        break;
                }
            }
            // console.log(agent);
        }));
        this.subscription.push(_agentService.selectedFilter.subscribe(function (data) {
            _this.selectedFilter = data;
            // console.log(agent);
        }));
        this.subscription.push(_agentService.agentConversationList.subscribe(function (conv) {
            _this.totalConversations = conv.length;
            // console.log(agent);
        }));
        this.subscription.push(_agentService.isSelfViewingChat.subscribe(function (data) {
            if (data) {
                _this.isSelfViewingChat = data;
                // console.log((this.isSelfViewingChat && this.isSelfViewingChat.value) && (this.selectedAgent.email != this.agent.email));
            }
        }));
        this.subscription.push(_agentService.loadingConversation.subscribe(function (data) {
            _this.loadingConversation = data;
        }));
        this.subscription.push(_agentService.searchValue.subscribe(function (data) {
            _this.searchForm.get('searchValue').setValue(data);
        }));
        this.subscription.push(_agentService.selectedAgentConversation.subscribe(function (data) {
            _this.agentConversation = data;
            // console.log('Agent Conversation');
            // console.log(this.agentConversation);
        }));
        this.subscription.push(_agentService.selectedAgent.subscribe(function (agent) {
            // console.log('agent');
            // console.log(agent);
            if (agent) {
                _this.getGroups(agent.email);
            }
            _this.selectedAgent = agent;
            _this.pills['notifications'] = false;
            _this.pills['profile'] = true;
            _this.editRoleEnabled = true;
            _this.agentRole = _this.selectedAgent.role;
            _this.company = (Object.keys(_this.selectedAgent).length) ? _this.selectedAgent.nsp.split('/')[1] : '';
            if (Object.keys(_this.selectedAgent).length) {
                // this._agentService.GetEmailNotificationSettings();
                // this._agentService.GetWindowNotificationSettings();
                _this.subscription.push(_agentService.windowNotificationSettings.subscribe(function (settings) {
                    if (settings) {
                        _this.windowNotificationSettings = settings;
                        _this.updateWindowNotifSettings(_this.windowNotificationSettings);
                    }
                }));
                _this.subscription.push(_agentService.emailNotificationSettings.subscribe(function (settings) {
                    if (settings) {
                        _this.emailNotificationSettings = settings;
                        _this.selectedAgent.settings.emailNotifications = _this.emailNotificationSettings;
                        _this.updateEmailSettings(_this.emailNotificationSettings);
                    }
                }));
                // this.first_name = this.selectedAgent.first_name;
                // this.last_name = this.selectedAgent.last_name;
                // this.nickname = this.selectedAgent.nickname;
                // this.nickname = this.selectedAgent.nickname;
                // this.phone_no = this.selectedAgent.phone_no;
                _this.agentEditForm.get('first_name').setValue(_this.selectedAgent.first_name);
                _this.agentEditForm.get('last_name').setValue(_this.selectedAgent.last_name);
                _this.agentEditForm.get('phone_no').setValue(_this.selectedAgent.phone_no);
                _this.agentEditForm.get('nickname').setValue(_this.selectedAgent.nickname);
                _this.agentEditForm.get('username').setValue(_this.selectedAgent.username);
                _this.agentEditForm.get('gender').setValue(_this.selectedAgent.gender);
                _this.agentEditForm.get('simchats').setValue(_this.selectedAgent.settings.simchats);
                _this.role = _this.selectedAgent.role;
                // this.first_name_control = new FormControl(this.selectedAgent.first_name, [Validators.required]);
                // this.last_name_control = new FormControl(this.selectedAgent.last_name, [Validators.required]);
                // this.nickname_control = new FormControl(this.selectedAgent.nickname, [Validators.required]);
                // this.phone_no_control = new FormControl(this.selectedAgent.phone_no, [Validators.pattern(/^[0-9\-]+$/)]);
                // this.email_control = new FormControl(this.selectedAgent.email, [Validators.required]);
                if (_this.selectedAgent._id == _this.agent._id) {
                    _this.editRoleEnabled = false;
                    _this.editRole = false;
                }
            }
            if (_this.edit)
                _this.Cancel();
        }));
        this.subscription.push(_agentService.getNotification().subscribe(function (notification) {
            _this.loading = false;
            if (notification) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: notification.img,
                        msg: notification.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
                }).dismiss;
            }
        }));
        this.subscription.push(_agentService.showAgentAccessInfo.subscribe(function (data) {
            _this.showAgentAccessInfo = data;
        }));
        this.subscription.push(_agentService.selectedAgentConversation.subscribe(function (data) {
            _this.selectedAgentConversation = data;
        }));
        this.subscription.push(_settingService.callSettings.subscribe(function (data) {
            _this.callSettings = data;
        }));
        this.subscription.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
        this.subscription.push(this._appStateService.shortcutEvents.subscribe(function (data) {
            _this._agentService.SelectAgent(data);
        }));
        this.subscription.push(this._appStateService.resizeEvent.subscribe(function (data) {
            _this.showViewHistory = data;
        }));
        this.subscription.push(_agentService.closeDetail.subscribe(function (data) {
            _this.showViewHistory = data;
        }));
    }
    AgentComponent.prototype.toggleFilterDrawer = function () {
        this._agentService.filterDrawer.next(!this.filterDrawer);
    };
    AgentComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscription.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._agentService.setSelectedAgent();
        // this._agentService.selectedFilter.next('all');
        // this._agentService.getAllAgentsAsync();
        this._appStateService.CloseControlSideBar();
    };
    AgentComponent.prototype.Edit = function () {
        this.edit = true;
    };
    AgentComponent.prototype.changeList = function (name) {
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
                    this._agentService.conversationSeen(this.selectedAgentConversation._id, this.selectedAgentConversation.members.map(function (a) { return a.email; }));
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
    };
    AgentComponent.prototype.getGroups = function (email) {
        var _this = this;
        this._utilityService.getGroupsAgainstAgent(email).subscribe(function (groups) {
            _this.agentGroups = groups;
        });
    };
    AgentComponent.prototype.Save = function () {
        this.loading = true;
        // console.log(this.agentEditForm.value);
        var properties = this.agentEditForm.value;
        properties.role = this.role;
        // console.log(properties);
        this._agentService.editAgent(properties);
    };
    AgentComponent.prototype.setPillActive = function (pill) {
        var _this = this;
        Object.keys(this.pills).map(function (key) {
            if (key == pill) {
                _this.pills[key] = true;
            }
            else {
                _this.pills[key] = false;
            }
        });
    };
    AgentComponent.prototype.setSearchValue = function () {
        this._agentService.setSearchValue(this.searchForm.get('searchValue').value);
    };
    AgentComponent.prototype.Cancel = function () {
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
    };
    // openConvDialog(type){
    //     this.newConversationDialog(type);
    // }
    AgentComponent.prototype.newConversationDialog = function (type) {
        var _this = this;
        this.dialog.open(new_conversation_dialog_component_1.NewConversationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { email: this.agent.email, type: type }
        }).afterClosed().subscribe(function (data) {
            if (data) {
                // console.log(data);
                var obj_1 = {
                    type: data.type,
                    group_name: data.groupName,
                    members: data.selectedAgents,
                    createdBy: _this.agent.email,
                    createdOn: new Date().toISOString(),
                    LastUpdated: new Date().toISOString(),
                    nsp: _this.agent.nsp,
                    messages: [],
                    LastSeen: []
                };
                obj_1.members.forEach(function (member) {
                    obj_1.LastSeen.push({
                        email: member.email,
                        messageReadCount: 0,
                        DateTime: new Date().toISOString()
                    });
                });
                // console.log(obj);
                _this._agentService.getOrcreateConversation(obj_1);
            }
        });
    };
    AgentComponent.prototype.toggleEditRole = function () {
        this.editRole = !this.editRole;
    };
    AgentComponent.prototype.cancelEdit = function () {
        this.editRole = false;
        this.agentRole = this.selectedAgent.role;
    };
    AgentComponent.prototype.saveRoleForAgent = function () {
        var _this = this;
        // console.log(this.agentLev
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want to change role for this user? Note: New settings will be updated for this user upon next login.' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._agentService.editAgent({
                    first_name: _this.selectedAgent.first_name,
                    last_name: _this.selectedAgent.last_name,
                    nickname: _this.selectedAgent.nickname,
                    phone_no: _this.selectedAgent.phone_no,
                    gender: _this.selectedAgent.gender,
                    simchats: _this.selectedAgent.settings.simchats,
                    role: _this.agentRole
                });
                _this.editRole = false;
            }
            else {
                _this.cancelEdit();
            }
        });
    };
    AgentComponent.prototype.NumbersOnly = function (event) {
        var pattern = /[0-9\-]+/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    AgentComponent.prototype.UploadImage = function (event) {
        // console.log(event)
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];
            return;
        }
        this.file = undefined;
        return;
    };
    AgentComponent.prototype.fetchFilteredAgents = function (type) {
        this._agentService.selectedFilter.next(type);
        this._agentService.getAllAgentsAsync(type);
        if (this.agentCounts) {
            switch (this._agentService.selectedFilter.getValue()) {
                case 'online':
                    this.totalAgents = this.agentCounts.agents.length;
                    break;
                case 'offline':
                    this.totalAgents = this.agentCounts.total - this.agentCounts.agents.length;
                    break;
                case 'all':
                    this.totalAgents = this.agentCounts.total;
                    break;
            }
        }
        this.filterPopper.hide();
    };
    AgentComponent.prototype.ClearFile = function () {
        this.file = undefined;
        this.fileInput.nativeElement.value = '';
    };
    AgentComponent.prototype.SendFile = function () {
        var _this = this;
        this.uploading = true;
        this._uploadingService.SignRequest(this.file, 'UploadProfilePicture').subscribe(function (response) {
            var params = JSON.parse(response.text());
            params.file = _this.file;
            _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                //console.log(s3response);
                if (s3response.status == '201') {
                    _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                        //console.log(json.response.PostResponse.Location[0])
                        _this._uploadingService.ChangeProfileImage(_this.agent.email, json.response.PostResponse.Location[0]);
                        _this.file = undefined;
                        _this.fileInput.nativeElement.value = '';
                        _this.uploading = false;
                        _this._authService.updateAgentProfileImage(json.response.PostResponse.Location[0]);
                        _this._agentService.updateAgentProfileImage(_this.agent.email, json.response.PostResponse.Location[0]);
                    }, function (err) {
                        // console.log(err);
                        _this.uploading = false;
                    });
                }
            }, function (err) {
                // console.log(err);
                _this.uploading = false;
            });
        }, function (err) {
            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Error in uploading, Please try again!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'error']
            });
            console.log('error in Sigining');
            // console.log(err);
            _this.uploading = false;
        });
    };
    AgentComponent.prototype.TryCall = function (selectedAgent) {
        var _this = this;
        event.preventDefault();
        this.dialog.open(call_dialog_component_1.CallDialogComponent, {
            panelClass: ['calling-dialog'],
            data: selectedAgent,
            disableClose: true,
            autoFocus: true
        }).afterClosed().subscribe(function (response) {
            // console.log(response);
            _this._callingService.EndCall();
        });
    };
    AgentComponent.prototype.ToggleChat = function () {
        var obj = {
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
        };
        this._agentService.getOrcreateConversation(obj);
    };
    AgentComponent.prototype.displayChangePassword = function () {
        if (this.agent.role == 'superadmin') {
            if (this.selectedAgent._id == this.agent._id) {
                return this.permissions.agents.canChangeOwnPassword;
            }
            else {
                return this.permissions.agents.canChangeOthersPassword;
            }
        }
        else {
            if (this.selectedAgent.role != 'superadmin') {
                if (this.selectedAgent._id == this.agent._id) {
                    return this.permissions.agents.canChangeOwnPassword;
                }
                else {
                    return this.permissions.agents.canChangeOthersPassword;
                }
            }
            else {
                return false;
            }
        }
    };
    AgentComponent.prototype.updateWindowNotifSettings = function (settings) {
        var _this = this;
        this.windowNotificationsForm = this.formbuilder.group({});
        Object.keys(settings).map(function (key) {
            _this.windowNotificationsForm.addControl(key, new forms_1.FormControl(settings[key], [forms_1.Validators.required]));
            _this.selectedAgent.windowNotifications = _this.windowNotificationsForm.value;
        });
    };
    AgentComponent.prototype.updateEmailSettings = function (settings) {
        var _this = this;
        this.emailNotificationForm = this.formbuilder.group({});
        Object.keys(settings).map(function (key) {
            _this.emailNotificationForm.addControl(key, new forms_1.FormControl(settings[key], [forms_1.Validators.required]));
            _this.selectedAgent.emailNotifications = _this.emailNotificationForm.value;
        });
    };
    AgentComponent.prototype.settingsChanged = function (type) {
        this.changes[type] = true;
    };
    AgentComponent.prototype.submitWindowSettings = function () {
        var _this = this;
        this.loading = true;
        this._agentService.SetWindowNotificationSettings(this.windowNotificationsForm.value).subscribe(function (response) {
            _this.loading = false;
            if (response.status == 'ok') {
                _this.changes['window'] = false;
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Settings saved successfully!'
                    },
                    duration: 5000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else if (response.status == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error!'
                    },
                    duration: 5000,
                    panelClass: ['user-alert', 'error']
                });
            }
        }, function (err) {
            _this.loading = false;
        });
    };
    AgentComponent.prototype.submitEmailSettings = function () {
        var _this = this;
        this.loading = true;
        this._agentService.SetEmailNotificationSettings(this.emailNotificationForm.value)
            .subscribe(function (response) {
            _this.loading = false;
            if (response.status == 'ok') {
                _this.changes['email'] = false;
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Settings saved successfully!'
                    },
                    duration: 5000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else if (response.status == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error!'
                    },
                    duration: 5000,
                    panelClass: ['user-alert', 'error']
                });
            }
        }, function (err) {
            _this.loading = false;
        });
    };
    AgentComponent.prototype.ChangePassword = function () {
        var _this = this;
        var fieldCount = 3;
        if (this.agent.role == 'superadmin') {
            // console.log('Show 2 fields');
            fieldCount = 2;
        }
        else {
            if (this.agent._id != this.selectedAgent._id) {
                // console.log('Show 2 Fields');
                fieldCount = 2;
            }
            else {
                // console.log('Show 3 Fields');
                fieldCount = 3;
            }
        }
        this.dialog.open(change_password_dialog_component_1.ChangePasswordDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { fieldCount: fieldCount, email: this.selectedAgent.email },
            disableClose: true,
        }).afterClosed().subscribe(function (data) {
            // console.log(data.status);
            if (data.status == 'success') {
                _this._agentService.setNotification('Password changed successfully!', 'success', 'ok');
            }
            else if (data.status == 'error') {
                _this._agentService.setNotification('Error!', 'error', 'warning');
            }
        });
    };
    AgentComponent.prototype.toggleAgentAccessInfo = function () {
        this._agentService.toggleAgentAccessInformation();
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], AgentComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.ViewChild('filterPopper')
    ], AgentComponent.prototype, "filterPopper", void 0);
    AgentComponent = __decorate([
        core_1.Component({
            selector: 'app-agent',
            templateUrl: './agent.component.html',
            styleUrls: ['./agent.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AgentComponent);
    return AgentComponent;
}());
exports.AgentComponent = AgentComponent;
//# sourceMappingURL=agent.component.js.map