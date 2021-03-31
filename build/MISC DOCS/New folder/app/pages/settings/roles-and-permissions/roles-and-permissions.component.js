"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesAndPermissionsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var new_role_dialog_component_1 = require("../../../dialogs/new-role-dialog/new-role-dialog.component");
var Subject_1 = require("rxjs/Subject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var RolesAndPermissionsComponent = /** @class */ (function () {
    function RolesAndPermissionsComponent(_rolesAndPermissions, snackBar, formbuilder, _appStateService, _authService, _agentService, _utilityService, dialog) {
        var _this = this;
        this._rolesAndPermissions = _rolesAndPermissions;
        this.snackBar = snackBar;
        this.formbuilder = formbuilder;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this._agentService = _agentService;
        this._utilityService = _utilityService;
        this.dialog = dialog;
        this.subscriptions = [];
        this.sortBy = '';
        this.loading = false;
        this.roles = [];
        this.ticketChangesSubscribed = false;
        this.changes = false;
        this.agentList = [];
        this.allAgents = [];
        this.allAgents_original = [];
        this.selectedAgents = [];
        this.loadingAgents = false;
        this.actionEnabled = false;
        this.allAgentsSelected = false;
        this.newRoleForUser = '';
        this.showForm = false;
        this.selectedRoles = [];
        this.modificationEnabled = false;
        this.showAgentList = false;
        this.searchValue = '';
        this.dropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            itemsShowLimit: 10,
        };
        this.pills = {
            'dashboard': true,
            'visitors': false,
            'crm': false,
            'chatbot': false,
            'tickets': false,
            'chats': false,
            'agents': false,
            'analytics': false,
            'settings': false,
            'installation': false
        };
        this.scrollHeight = 0;
        this.showAssignAgentForm = false;
        this.dropDown_typeahead = '';
        this.searchInput = new Subject_1.Subject();
        this.showNoAgents = false;
        this.loadingMoreAgents = false;
        this.ended = false;
        this.selectedGroups = [];
        this.selectedTeams = [];
        this.groupList = [];
        this.teamList = [];
        this.DropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
        this.subscriptions.push(this._authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.security;
            }
        }));
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('General Settings');
        this.searchForm = formbuilder.group({
            'searchValue': ['', []
            ]
        });
        this.addRoleForm = this.formbuilder.group({
            'role_name': [null, forms_1.Validators.required]
        });
        this.ticketPermissionsForm = formbuilder.group({});
        this.settingsPermissionsForm = formbuilder.group({});
        this.chatPermissionsForm = formbuilder.group({});
        this.agentPermissionsForm = formbuilder.group({});
        this.dashboardPermissionsForm = formbuilder.group({});
        this.visitorsPermissionsForm = formbuilder.group({});
        this.analyticsPermissionsForm = formbuilder.group({});
        this.crmPermissionsForm = formbuilder.group({});
        this.chatbotPermissionsForm = formbuilder.group({});
        this.installationPermissionsForm = formbuilder.group({});
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            _this.userPermissions = data.permissions.settings;
            // console.log(this.userPermissions);
        }));
        this.subscriptions.push(_rolesAndPermissions.permissions.subscribe(function (data) {
            if (data) {
                _this.permissions = data;
                _this.roles = _this.permissions[_this.agent.role]['settings'].rolesAndPermissions.canView;
                // this.roles = Object.keys(data);
                if (_this.roles.length && !_this.selectedRole) {
                    _this.roleSelected(_this.roles[0]);
                }
                if (_this.selectedRole) {
                    if (_this.permissions[_this.selectedRole]) {
                        _this.selectedRoles = JSON.parse(JSON.stringify(_this.permissions[_this.selectedRole]['settings'].rolesAndPermissions.canView));
                        _this.roleSelected(_this.selectedRole);
                    }
                    else {
                        _this.roleSelected(_this.roles[_this.roles.length - 1]);
                    }
                }
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (data) {
            // console.log(data);
            if (data) {
                _this.allAgents = data;
                _this.allAgents_original = data;
            }
        }));
        this.subscriptions.push(this._utilityService.GetGroups().subscribe(function (data) {
            // console.log(data);
            _this.groupList = data.map(function (g) { return g.group_name; });
        }));
        this.subscriptions.push(this._utilityService.getTeams().subscribe(function (data) {
            // console.log(data);
            _this.teamList = data.map(function (g) { return g.team_name; });
        }));
        this.searchInput
            .map(function (event) { return event; })
            .debounceTime(500)
            .switchMap(function () {
            return new Observable_1.Observable(function (observer) {
                console.log('search');
                if (_this.dropDown_typeahead) {
                    var agents_1 = _this.allAgents_original.filter(function (a) { return a.email.includes(_this.dropDown_typeahead.toLowerCase()); });
                    _this._utilityService.SearchAgent(_this.dropDown_typeahead).subscribe(function (response) {
                        //console.log(response);
                        if (response && response.agentList.length) {
                            response.agentList.forEach(function (element) {
                                if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                                    agents_1.push(element);
                                }
                            });
                        }
                        _this.allAgents = agents_1;
                    });
                    // this.agentList = agents;
                }
                else {
                    _this.allAgents = _this.allAgents_original;
                    // this.setScrollEvent();
                }
            });
        }).subscribe();
    }
    RolesAndPermissionsComponent.prototype.ngOnInit = function () {
    };
    //Toggle Events
    RolesAndPermissionsComponent.prototype.setPillActive = function (pill) {
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
    RolesAndPermissionsComponent.prototype.toggleAgentList = function () {
        this.showAgentList = !this.showAgentList;
    };
    RolesAndPermissionsComponent.prototype.ShowForm = function () {
        this.showForm = !this.showForm;
    };
    //Updation
    RolesAndPermissionsComponent.prototype.savePermissions = function () {
        var settings = {
            enabled: this.settingsPermissionsForm.get('enabled').value,
            automatedResponses: {
                enabled: this.settingsPermissionsForm.get('automatedResponses_enabled').value
            },
            rolesAndPermissions: {
                enabled: this.settingsPermissionsForm.get('rolesAndPermissions_enabled').value,
                canView: this.selectedRoles,
                canAddRole: this.settingsPermissionsForm.get('rolesAndPermissions_canAddRole').value,
                canModifyOwn: this.settingsPermissionsForm.get('rolesAndPermissions_canModifyOwn').value,
                canModifyOther: this.settingsPermissionsForm.get('rolesAndPermissions_canModifyOther').value,
                canDeleteRole: this.settingsPermissionsForm.get('rolesAndPermissions_canDeleteRole').value
            },
            formDesigner: {
                enabled: this.settingsPermissionsForm.get('formDesigner_enabled').value
            },
            ticketManagement: {
                enabled: this.settingsPermissionsForm.get('ticketManagement_enabled').value,
                groupManagement: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_groupManagement_enabled').value,
                    canCreate: this.settingsPermissionsForm.get('ticketManagement_groupManagement_canCreate').value,
                    canDelete: this.settingsPermissionsForm.get('ticketManagement_groupManagement_canDelete').value,
                    canAddAgents: this.settingsPermissionsForm.get('ticketManagement_groupManagement_canAddAgents').value,
                    canRemoveAgents: this.settingsPermissionsForm.get('ticketManagement_groupManagement_canRemoveAgents').value,
                    canView: this.settingsPermissionsForm.get('ticketManagement_groupManagement_canView').value,
                    groupViewList: this.selectedGroups,
                },
                teamManagement: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_teamManagement_enabled').value,
                    canCreate: this.settingsPermissionsForm.get('ticketManagement_teamManagement_canCreate').value,
                    canDelete: this.settingsPermissionsForm.get('ticketManagement_teamManagement_canDelete').value,
                    canAddAgents: this.settingsPermissionsForm.get('ticketManagement_teamManagement_canAddAgents').value,
                    canRemoveAgents: this.settingsPermissionsForm.get('ticketManagement_teamManagement_canAddAgents').value,
                    canView: this.settingsPermissionsForm.get('ticketManagement_teamManagement_canView').value,
                    teamViewList: this.selectedTeams
                },
                rulesetSettings: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_rulesetSettings_enabled').value,
                    canCreate: this.settingsPermissionsForm.get('ticketManagement_rulesetSettings_canCreate').value,
                    canModify: this.settingsPermissionsForm.get('ticketManagement_rulesetSettings_canModify').value,
                    canToggle: this.settingsPermissionsForm.get('ticketManagement_rulesetSettings_canToggle').value,
                    canDelete: this.settingsPermissionsForm.get('ticketManagement_rulesetSettings_canDelete').value
                },
                rulesetScheduler: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_rulesetScheduler_enabled').value,
                },
                generalNotifications: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_generalNotifications_enabled').value,
                },
                ticketTemplateDesigner: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_ticketTemplateDesigner_enabled').value,
                },
                permissionSettings: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_permissionSettings_enabled').value,
                },
                formDesigner: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_formDesigner_enabled').value,
                },
                emailTemplateDesigner: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_emailTemplateDesigner_enabled').value,
                },
                incomingEmails: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_incomingEmails_enabled').value,
                },
                SLAPolicies: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_SLAPolicies_enabled').value,
                },
                ticketScenarioAutomation: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_ticketScenarioAutomation_enabled').value,
                },
                customFields: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_customFields_enabled').value,
                    canCreate: this.settingsPermissionsForm.get('ticketManagement_customFields_canCreate').value,
                    canModify: this.settingsPermissionsForm.get('ticketManagement_customFields_canModify').value,
                    canDelete: this.settingsPermissionsForm.get('ticketManagement_customFields_canDelete').value,
                },
                customSatisfactionSurvey: {
                    enabled: this.settingsPermissionsForm.get('ticketManagement_customSatisfactionSurvey_enabled').value,
                }
            },
            chatTimeouts: {
                enabled: this.settingsPermissionsForm.get('chatTimeouts_enabled').value
            },
            callSettings: {
                enabled: this.settingsPermissionsForm.get('callSettings_enabled').value
            },
            contactSettings: {
                enabled: this.settingsPermissionsForm.get('contactSettings_enabled').value
            },
            chatWindowSettings: {
                enabled: this.settingsPermissionsForm.get('chatWindowSettings_enabled').value
            },
            chatAssistant: {
                enabled: this.settingsPermissionsForm.get('chatAssistant_enabled').value
            },
            webhooks: {
                enabled: this.settingsPermissionsForm.get('webhooks_enabled').value
            },
            integerations: {
                enabled: this.settingsPermissionsForm.get('integerations_enabled').value
            },
            knowledgeBase: {
                enabled: this.settingsPermissionsForm.get('knowledgeBase_enabled').value
            },
            widgetMarketing: {
                enabled: this.settingsPermissionsForm.get('widgetMarketing_enabled').value
            }
        };
        var permissions = {
            tickets: this.ticketPermissionsForm.value,
            chats: this.chatPermissionsForm.value,
            agents: this.agentPermissionsForm.value,
            settings: settings,
            dashboard: this.dashboardPermissionsForm.value,
            visitors: this.visitorsPermissionsForm.value,
            analytics: this.analyticsPermissionsForm.value,
            crm: this.crmPermissionsForm.value,
            chatbot: this.chatbotPermissionsForm.value,
            installation: this.installationPermissionsForm.value
        };
        // console.log(permissions.settings);
        if (this.selectedRole == 'superadmin') {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'You dont have the rights!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'error']
            });
        }
        else {
            if (this.userPermissions.rolesAndPermissions.canView.includes(this.selectedRole)) {
                // console.log(permissions);
                this._rolesAndPermissions.savePermissions(permissions, this.selectedRole);
                this.changes = false;
            }
            else {
                this.permissionsRevokedSnackbar();
                // if(this.userPermissions.rolesAndPermissions.canView.length){
                // 	this.roleSelected(this.userPermissions.rolesAndPermissions.canView[this.userPermissions.rolesAndPermissions.canView.length - 1]);
                // }
            }
        }
    };
    //Insertion
    RolesAndPermissionsComponent.prototype.insertRole = function () {
        if (this.userPermissions.rolesAndPermissions.canAddRole) {
            this._rolesAndPermissions.addRole(this.addRoleForm.get('role_name').value);
            this.addRoleForm.reset();
        }
        else {
            this.permissionsRevokedSnackbar();
        }
    };
    RolesAndPermissionsComponent.prototype.permissionsRevokedSnackbar = function () {
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'warning',
                msg: 'Your permissions have been revoked!'
            },
            duration: 2000,
            panelClass: ['user-alert', 'error']
        });
    };
    //Deletion
    RolesAndPermissionsComponent.prototype.deleteRole = function (event, role) {
        var _this = this;
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want to delete this role?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                if (_this.selectedRole == role) {
                    if (_this.agentList.length) {
                        //ask for new role for the users who had been in this group
                        _this.dialog.open(new_role_dialog_component_1.NewRoleDialogComponent, {
                            panelClass: ['responsive-dialog'],
                            data: { agents: _this.agentList, deletionRole: role }
                        }).afterClosed().subscribe(function (data) {
                            if (data.status) {
                                _this._rolesAndPermissions.deleteRole(role);
                                _this.selectedRole = '';
                            }
                        });
                    }
                    else {
                        if (_this.userPermissions.rolesAndPermissions.canDeleteRole) {
                            _this._rolesAndPermissions.deleteRole(role);
                            _this.selectedRole = _this.roles[_this.roles.length - 1];
                        }
                        else {
                            _this.permissionsRevokedSnackbar();
                        }
                    }
                }
                else {
                    _this._agentService.getAllAgentsForRole(role).subscribe(function (response) {
                        // console.log(response);
                        if (response && response.length) {
                            //ask for new role for the users who had been in this group
                            _this.dialog.open(new_role_dialog_component_1.NewRoleDialogComponent, {
                                panelClass: ['responsive-dialog'],
                                data: { agents: response, deletionRole: role }
                            }).afterClosed().subscribe(function (data) {
                                if (data.status) {
                                    _this._rolesAndPermissions.deleteRole(role);
                                }
                            });
                        }
                        else {
                            if (_this.userPermissions.rolesAndPermissions.canDeleteRole) {
                                _this._rolesAndPermissions.deleteRole(role);
                                _this.selectedRole = _this.roles[_this.roles.length - 1];
                            }
                            else {
                                _this.permissionsRevokedSnackbar();
                            }
                        }
                    }, function (err) {
                        _this.loadingAgents = false;
                    });
                }
            }
        });
    };
    //Selection Events
    RolesAndPermissionsComponent.prototype.roleSelected = function (role, cancel) {
        var _this = this;
        if (cancel === void 0) { cancel = false; }
        if (this.changes && !cancel) {
            if (!confirm('You have unsaved changes do you want to discard?')) {
                return;
            }
        }
        //Ticket Tab
        this.ticketPermissionsForm = this.formbuilder.group({});
        Object.keys(this.permissions[role]['tickets']).map(function (key) {
            _this.ticketPermissionsForm.addControl(key, new forms_1.FormControl(_this.permissions[role]['tickets'][key], [forms_1.Validators.required]));
        });
        //Settings Tab
        this.settingsPermissionsForm = this.formbuilder.group({});
        this.selectedRoles = JSON.parse(JSON.stringify(this.permissions[role]['settings'].rolesAndPermissions.canView));
        this.selectedGroups = JSON.parse(JSON.stringify(this.permissions[role]['settings'].ticketManagement.groupManagement.groupViewList));
        this.selectedTeams = JSON.parse(JSON.stringify(this.permissions[role]['settings'].ticketManagement.teamManagement.teamViewList));
        Object.keys(this.permissions[role]['settings']).map(function (firstKey) {
            if (typeof _this.permissions[role]['settings'][firstKey] == 'boolean') {
                // console.log(firstKey);
                _this.settingsPermissionsForm.addControl(firstKey, new forms_1.FormControl(_this.permissions[role]['settings'][firstKey], [forms_1.Validators.required]));
            }
            if (typeof _this.permissions[role]['settings'][firstKey] == 'object') {
                Object.keys(_this.permissions[role]['settings'][firstKey]).map(function (secondKey) {
                    // console.log(typeof this.permissions[role]['settings'][firstKey][secondKey]);
                    if (typeof _this.permissions[role]['settings'][firstKey][secondKey] == 'boolean') {
                        // console.log(firstKey + '_' + secondKey);
                        _this.settingsPermissionsForm.addControl(firstKey + '_' + secondKey, new forms_1.FormControl(_this.permissions[role]['settings'][firstKey][secondKey], [forms_1.Validators.required]));
                    }
                    else if (typeof _this.permissions[role]['settings'][firstKey][secondKey] == 'object' && !Array.isArray(_this.permissions[role]['settings'][firstKey][secondKey])) {
                        Object.keys(_this.permissions[role]['settings'][firstKey][secondKey]).map(function (thirdKey) {
                            // console.log(firstKey + '_' + secondKey + '_' + thirdKey);
                            _this.settingsPermissionsForm.addControl(firstKey + '_' + secondKey + '_' + thirdKey, new forms_1.FormControl(_this.permissions[role]['settings'][firstKey][secondKey][thirdKey], [forms_1.Validators.required]));
                        });
                    }
                });
            }
            // console.log(typeof this.permissions[role]['settings'][key])
        });
        //Agents Tab
        this.agentPermissionsForm = this.formbuilder.group({});
        Object.keys(this.permissions[role]['agents']).map(function (key) {
            _this.agentPermissionsForm.addControl(key, new forms_1.FormControl(_this.permissions[role]['agents'][key], [forms_1.Validators.required]));
        });
        if (!Object.keys(this.permissions[role]['agents']).includes('autoLogout')) {
            this.agentPermissionsForm.addControl('autoLogout', new forms_1.FormControl((this.permissions[role]['agents']['autoLogout']) ? this.permissions[role]['agents']['autoLogout'] : -1, [forms_1.Validators.required]));
        }
        //Chats Tab
        this.chatPermissionsForm = this.formbuilder.group({});
        Object.keys(this.permissions[role]['chats']).map(function (key) {
            _this.chatPermissionsForm.addControl(key, new forms_1.FormControl(_this.permissions[role]['chats'][key], [forms_1.Validators.required]));
        });
        //Chats Tab
        this.dashboardPermissionsForm = this.formbuilder.group({});
        Object.keys(this.permissions[role]['dashboard']).map(function (key) {
            _this.dashboardPermissionsForm.addControl(key, new forms_1.FormControl(_this.permissions[role]['dashboard'][key], [forms_1.Validators.required]));
        });
        //Chats Tab
        this.visitorsPermissionsForm = this.formbuilder.group({});
        Object.keys(this.permissions[role]['visitors']).map(function (key) {
            _this.visitorsPermissionsForm.addControl(key, new forms_1.FormControl(_this.permissions[role]['visitors'][key], [forms_1.Validators.required]));
        });
        //Chats Tab
        this.analyticsPermissionsForm = this.formbuilder.group({});
        Object.keys(this.permissions[role]['analytics']).map(function (key) {
            _this.analyticsPermissionsForm.addControl(key, new forms_1.FormControl(_this.permissions[role]['analytics'][key], [forms_1.Validators.required]));
        });
        //Chats Tab
        this.crmPermissionsForm = this.formbuilder.group({});
        Object.keys(this.permissions[role]['crm']).map(function (key) {
            _this.crmPermissionsForm.addControl(key, new forms_1.FormControl(_this.permissions[role]['crm'][key], [forms_1.Validators.required]));
        });
        //Installation Tab
        this.installationPermissionsForm = this.formbuilder.group({});
        Object.keys(this.permissions[role]['installation']).map(function (key) {
            _this.installationPermissionsForm.addControl(key, new forms_1.FormControl(_this.permissions[role]['installation'][key], [forms_1.Validators.required]));
        });
        this.chatbotPermissionsForm = this.formbuilder.group({});
        Object.keys(this.permissions[role]['chatbot']).map(function (key) {
            _this.chatbotPermissionsForm.addControl(key, new forms_1.FormControl(_this.permissions[role]['chatbot'][key], [forms_1.Validators.required]));
        });
        // let s_role = role;
        this.selectedRole = role;
        //Apply Settings
        if (this.selectedRole == this.agent.role) {
            this.modificationEnabled = this.userPermissions.rolesAndPermissions.canModifyOwn;
        }
        else {
            this.modificationEnabled = this.userPermissions.rolesAndPermissions.canModifyOther;
        }
        //Apply Validation
        setTimeout(function () {
            Object.keys(_this.settingsPermissionsForm.controls).map(function (key) {
                _this.settingsPermissionsForm.controls[key][(_this.modificationEnabled) ? 'enable' : 'disable']();
            });
            Object.keys(_this.ticketPermissionsForm.controls).map(function (key) {
                _this.ticketPermissionsForm.controls[key][(_this.modificationEnabled) ? 'enable' : 'disable']();
            });
            Object.keys(_this.chatPermissionsForm.controls).map(function (key) {
                _this.chatPermissionsForm.controls[key][(_this.modificationEnabled) ? 'enable' : 'disable']();
            });
            Object.keys(_this.visitorsPermissionsForm.controls).map(function (key) {
                _this.visitorsPermissionsForm.controls[key][(_this.modificationEnabled) ? 'enable' : 'disable']();
            });
            Object.keys(_this.dashboardPermissionsForm.controls).map(function (key) {
                _this.dashboardPermissionsForm.controls[key][(_this.modificationEnabled) ? 'enable' : 'disable']();
            });
            Object.keys(_this.analyticsPermissionsForm.controls).map(function (key) {
                _this.analyticsPermissionsForm.controls[key][(_this.modificationEnabled) ? 'enable' : 'disable']();
            });
            Object.keys(_this.crmPermissionsForm.controls).map(function (key) {
                _this.crmPermissionsForm.controls[key][(_this.modificationEnabled) ? 'enable' : 'disable']();
            });
            Object.keys(_this.installationPermissionsForm.controls).map(function (key) {
                _this.installationPermissionsForm.controls[key][(_this.modificationEnabled) ? 'enable' : 'disable']();
            });
        }, 0);
        // if(!this.modificationEnabled){
        // 	Object.keys(this.settingsPermissionsForm.controls).map(key => {
        // 		this.settingsPermissionsForm.controls[key][(this.modificationEnabled) ? 'enable' : 'disbale']();
        // 	})
        // 	this.settingsPermissionsForm.disable();
        // 	this.ticketPermissionsForm.disable();
        // 	this.agentPermissionsForm.disable();
        // 	this.chatPermissionsForm.disable();
        // 	console.log(this.ticketPermissionsForm.status);
        // }else{
        // 	console.log('Enabled!');
        // 	this.settingsPermissionsForm.enable();
        // 	this.ticketPermissionsForm.enable();
        // 	this.agentPermissionsForm.enable();
        // 	this.chatPermissionsForm.enable();
        // 	console.log(this.ticketPermissionsForm.status);
        // }
        this.GetAgentsForRole(role);
        // console.log(this.ticketPermissionsForm.controls);
        this.changes = false;
        this.allAgentsSelected = false;
        this.actionEnabled = false;
    };
    RolesAndPermissionsComponent.prototype.onItemSelect = function (event) {
        this.changes = true;
        // console.log(this.selectedRoles);
    };
    RolesAndPermissionsComponent.prototype.selectAllAgent = function (event) {
        this.allAgentsSelected = event.target.checked;
        this.agentList.map(function (a) {
            a.checked = event.target.checked;
            return a;
        });
        if (event.target.checked) {
            this.actionEnabled = true;
        }
        else {
            this.actionEnabled = false;
        }
    };
    RolesAndPermissionsComponent.prototype.checkAgent = function (event, email) {
        this.agentList.map(function (a) {
            if (a.email == email) {
                a.checked = event.target.checked;
            }
            return a;
        });
        //check if even one is selected or not
        if (this.agentList.some(function (a) { return a.checked; }))
            this.actionEnabled = true;
        //select all manipulation
        if (this.agentList.filter(function (a) { return !a.checked; }).length) {
            this.allAgentsSelected = false;
        }
        else {
            this.allAgentsSelected = true;
        }
        if (this.agentList.every(function (a) { return !a.checked; })) {
            this.allAgentsSelected = false;
            this.actionEnabled = false;
        }
    };
    RolesAndPermissionsComponent.prototype.checkAgentFromTable = function (check, email) {
        if (check == null || check == undefined)
            check = false;
        if (check) {
            check = false;
        }
        else {
            check = true;
        }
        this.agentList.map(function (a) {
            if (a.email == email) {
                a.checked = check;
            }
            return a;
        });
        //check if even one is selected or not
        if (this.agentList.some(function (a) { return a.checked; }))
            this.actionEnabled = true;
        //select all manipulation
        if (this.agentList.filter(function (a) { return !a.checked; }).length) {
            this.allAgentsSelected = false;
        }
        else {
            this.allAgentsSelected = true;
        }
        if (this.agentList.every(function (a) { return !a.checked; })) {
            this.allAgentsSelected = false;
            this.actionEnabled = false;
        }
    };
    RolesAndPermissionsComponent.prototype.changeRole = function () {
        var _this = this;
        var agentList = this.agentList.filter(function (a) { return a.checked; }).map(function (a) { return a.email; });
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want to change role for these users? Note: New settings will be updated for this user upon next login.' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._agentService.saveRoleForUsers(agentList, _this.selectedRole, _this.newRoleForUser).subscribe(function (response) {
                    _this.agentList = response;
                    _this.newRoleForUser = '';
                });
            }
            else {
            }
        });
    };
    //Check if form is equivalent, if yes then enable the save or cancel button.
    RolesAndPermissionsComponent.prototype.checkEquivalent = function () {
        this.changes = true;
    };
    //Reset Form back to last saved settings discarding all current changes.
    RolesAndPermissionsComponent.prototype.cancel = function () {
        this.roleSelected(this.selectedRole, true);
        this.changes = false;
    };
    //Get agents for the role selected
    RolesAndPermissionsComponent.prototype.GetAgentsForRole = function (role) {
        var _this = this;
        this.loadingAgents = true;
        this._agentService.getAllAgentsForRole(role).subscribe(function (response) {
            // console.log(response);
            _this.agentList = response;
            _this.loadingAgents = false;
        }, function (err) {
            _this.loadingAgents = false;
        });
    };
    RolesAndPermissionsComponent.prototype.ShowAssignAgentForm = function () {
        this.showAssignAgentForm = !this.showAssignAgentForm;
    };
    RolesAndPermissionsComponent.prototype.clearAgent = function (event, email) {
        var _this = this;
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.allAgents.map(function (a) {
            if (a.email == email) {
                a.selected = false;
                return a;
            }
        });
        this.selectedAgents.map(function (agent, index) {
            if (agent == email) {
                _this.selectedAgents.splice(index, 1);
            }
        });
        if (this.allAgents.filter(function (a) { return a.selected; }).length == this.allAgents.length) {
            // console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
    };
    RolesAndPermissionsComponent.prototype.clearAllAgents = function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.selectedAgents = [];
        this.allAgents.map(function (a) {
            a.selected = false;
            return a;
        });
        if (this.agentList.filter(function (a) { return a.selected; }).length == this.allAgents.length) {
            console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
    };
    RolesAndPermissionsComponent.prototype.onItemSelect_dropdown = function (email) {
        if (!this.selectedAgents.includes(email))
            this.selectedAgents.push(email);
        this.allAgents.map(function (a) {
            if (a.email == email) {
                a.selected = true;
                return a;
            }
        });
        if (this.allAgents.filter(function (a) { return a.selected; }).length == this.allAgents.length) {
            console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
    };
    RolesAndPermissionsComponent.prototype.onScroll = function ($event) {
        var _this = this;
        if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
            console.log('Scroll');
            if (!this.ended && !this.loadingMoreAgents) {
                console.log('Fetch More');
                this.loadingMoreAgents = true;
                this._agentService.getMoreAgentsObs(this.allAgents[this.allAgents.length - 1].first_name).subscribe(function (response) {
                    console.log(response);
                    _this.allAgents = _this.allAgents.concat(response.agents);
                    _this.ended = response.ended;
                    _this.loadingMoreAgents = false;
                });
            }
        }
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    RolesAndPermissionsComponent.prototype.deleteEnabled = function (role) {
        switch (role) {
            case 'superadmin':
            case 'admin':
            case 'supervisor':
            case 'agent':
                return false;
            default:
                return true;
        }
    };
    RolesAndPermissionsComponent.prototype.AddAgent = function () {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want to change role for these users? Note: New settings will be updated for this user upon next login.' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._agentService.saveRoleForUsers(_this.selectedAgents, _this.selectedRole, _this.selectedRole).subscribe(function (response) {
                    _this.agentList = response;
                    _this.newRoleForUser = '';
                });
                _this.selectedAgents = [];
            }
            else {
            }
        });
    };
    RolesAndPermissionsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], RolesAndPermissionsComponent.prototype, "scrollContainer", void 0);
    RolesAndPermissionsComponent = __decorate([
        core_1.Component({
            selector: 'app-roles-and-permissions',
            templateUrl: './roles-and-permissions.component.html',
            styleUrls: ['./roles-and-permissions.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], RolesAndPermissionsComponent);
    return RolesAndPermissionsComponent;
}());
exports.RolesAndPermissionsComponent = RolesAndPermissionsComponent;
//# sourceMappingURL=roles-and-permissions.component.js.map