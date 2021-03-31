import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { AgentService } from '../../../../services/AgentService';
import { Subscription } from 'rxjs/Subscription';
import { RolesAndPermissionsService } from '../../../../services/RolesAndPermissionsService';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewRoleDialogComponent } from '../../../dialogs/new-role-dialog/new-role-dialog.component';
import { AuthService } from '../../../../services/AuthenticationService';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ToastNotifications } from '../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';

@Component({
	selector: 'app-roles-and-permissions',
	templateUrl: './roles-and-permissions.component.html',
	styleUrls: ['./roles-and-permissions.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class RolesAndPermissionsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	sortBy = '';
	searchForm: FormGroup;
	addRoleForm: FormGroup;
	loading = false;
	ticketPermissionsForm: FormGroup;
	settingsPermissionsForm: FormGroup;
	chatPermissionsForm: FormGroup;
	agentPermissionsForm: FormGroup;
	dashboardPermissionsForm: FormGroup;
	visitorsPermissionsForm: FormGroup;
	analyticsPermissionsForm: FormGroup;
	crmPermissionsForm: FormGroup;
	chatbotPermissionsForm: FormGroup;
	installationPermissionsForm: FormGroup;
	selectedRole: any;
	roles = [];
	permissions: any;
	ticketChangesSubscribed = false;
	changes = false;
	agentList = [];
	allAgents = [];
	allAgents_original = [];
	selectedAgents = [];
	loadingAgents = false;
	actionEnabled = false;
	allAgentsSelected = false;
	newRoleForUser = '';
	showForm = false;
	selectedRoles = [];
	modificationEnabled = false;
	showAgentList = false;
	searchValue = '';

	public dropdownSettings = {
		singleSelection: false,
		enableCheckAll: false,
		itemsShowLimit: 10,
	};

	pills = {
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
	}

	userPermissions: any;
	agent: any;
	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	scrollHeight = 0;
	showAssignAgentForm: boolean = false;
	dropDown_typeahead = '';
	searchInput = new Subject();
	showNoAgents = false;
	loadingMoreAgents = false;
	ended = false;
	selectedGroups = [];
	selectedTeams = [];

	groupList = [];
	teamList = [];

	DropdownSettings = {
		singleSelection: false,
		enableCheckAll: false,
		itemsShowLimit: 3,
		allowSearchFilter: true
	};

	package : any;


	constructor(private _rolesAndPermissions: RolesAndPermissionsService,
		private snackBar: MatSnackBar,
		private formbuilder: FormBuilder,
		private _appStateService: GlobalStateService,
		private _authService: AuthService,
		private _agentService: AgentService,
		private _utilityService: UtilityService,
		public dialog: MatDialog) {

		this.subscriptions.push(this._authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg.security;
			}
		}));

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('General Settings');
		this.searchForm = formbuilder.group({
			'searchValue': ['', []
			]
		});
		this.addRoleForm = this.formbuilder.group({
			'role_name': [null, Validators.required]
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
		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			this.agent = agent;
		}));
		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			this.userPermissions = data.permissions.settings;
			// console.log(this.userPermissions);

		}));
		this.subscriptions.push(_rolesAndPermissions.permissions.subscribe(data => {
			if (data) {
				this.permissions = data;
				this.roles = this.permissions[this.agent.role]['settings'].rolesAndPermissions.canView;
				// this.roles = Object.keys(data);
				if (this.roles.length && !this.selectedRole) {
					this.roleSelected(this.roles[0]);
				}
				if (this.selectedRole) {
					if (this.permissions[this.selectedRole]) {
						
						this.selectedRoles = JSON.parse(JSON.stringify(this.permissions[this.selectedRole]['settings'].rolesAndPermissions.canView));
						this.roleSelected(this.selectedRole);
					} else {
						this.roleSelected(this.roles[this.roles.length - 1]);
					}
				}
			}
		}));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(data => {
			// console.log(data);
			if (data) {
				this.allAgents = data;
				this.allAgents_original = data;
			}
		}));
		this.subscriptions.push(this._utilityService.GetGroups().subscribe(data => {
			// console.log(data);
			this.groupList = data.map(g => g.group_name);
		}));
		this.subscriptions.push(this._utilityService.getTeams().subscribe(data => {
			// console.log(data);
			this.teamList = data.map(g => g.team_name);
		}));

		this.searchInput
			.map(event => event)
			.debounceTime(500)
			.switchMap(() => {
				return new Observable((observer) => {
					console.log('search');

					if (this.dropDown_typeahead) {
						let agents = this.allAgents_original.filter(a => a.email.includes((this.dropDown_typeahead as string).toLowerCase()));
						this._utilityService.SearchAgent(this.dropDown_typeahead).subscribe((response) => {
							//console.log(response);
							if (response && response.agentList.length) {
								response.agentList.forEach(element => {
									if (!agents.filter(a => a.email == element.email).length) {
										agents.push(element);
									}
								});
							}
							this.allAgents = agents;
						});
						// this.agentList = agents;
					} else {
						this.allAgents = this.allAgents_original;
						// this.setScrollEvent();
					}
				})
			}).subscribe();
	}

	ngOnInit() {
	}

	//Toggle Events
	setPillActive(pill) {
		Object.keys(this.pills).map(key => {
			if (key == pill) {
				this.pills[key] = true;
			} else {
				this.pills[key] = false;
			}
		});
	}

	toggleAgentList() {
		this.showAgentList = !this.showAgentList;
	}

	ShowForm() {
		this.showForm = !this.showForm;
	}

	//Updation
	savePermissions() {
		let settings = {
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
		}
		let permissions = {
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
		}
		// console.log(permissions.settings);
		if(this.selectedRole == 'superadmin'){
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'You dont have the rights!'
				},
				duration: 2000,
				panelClass: ['user-alert', 'error']
			});
		}else{
			if (this.userPermissions.rolesAndPermissions.canView.includes(this.selectedRole)) {
				// console.log(permissions);
				this._rolesAndPermissions.savePermissions(permissions, this.selectedRole);
				this.changes = false;
			} else {
				this.permissionsRevokedSnackbar();
				// if(this.userPermissions.rolesAndPermissions.canView.length){
				// 	this.roleSelected(this.userPermissions.rolesAndPermissions.canView[this.userPermissions.rolesAndPermissions.canView.length - 1]);
				// }
			}
		}
	}

	//Insertion
	insertRole() {
		if (this.userPermissions.rolesAndPermissions.canAddRole) {
			this._rolesAndPermissions.addRole(this.addRoleForm.get('role_name').value);
			this.addRoleForm.reset();
		} else {
			this.permissionsRevokedSnackbar();
		}
	}
	permissionsRevokedSnackbar() {
		this.snackBar.openFromComponent(ToastNotifications, {
			data: {
				img: 'warning',
				msg: 'Your permissions have been revoked!'
			},
			duration: 2000,
			panelClass: ['user-alert', 'error']
		});
	}
	//Deletion
	deleteRole(event, role) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want to delete this role?' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				if (this.selectedRole == role) {
					if (this.agentList.length) {
						//ask for new role for the users who had been in this group
						this.dialog.open(NewRoleDialogComponent, {
							panelClass: ['responsive-dialog'],
							data: { agents: this.agentList, deletionRole: role }
						}).afterClosed().subscribe(data => {
							if (data.status) {
								this._rolesAndPermissions.deleteRole(role);
								this.selectedRole = '';
							}
						});
					} else {
						if (this.userPermissions.rolesAndPermissions.canDeleteRole) {
							this._rolesAndPermissions.deleteRole(role);
							this.selectedRole = this.roles[this.roles.length - 1];
						} else {
							this.permissionsRevokedSnackbar();
						}
					}
				} else {
					this._agentService.getAllAgentsForRole(role).subscribe(response => {
						// console.log(response);
						if (response && response.length) {
							//ask for new role for the users who had been in this group
							this.dialog.open(NewRoleDialogComponent, {
								panelClass: ['responsive-dialog'],
								data: { agents: response, deletionRole: role }
							}).afterClosed().subscribe(data => {
								if (data.status) {
									this._rolesAndPermissions.deleteRole(role);
								}
							});
						} else {
							if (this.userPermissions.rolesAndPermissions.canDeleteRole) {
								this._rolesAndPermissions.deleteRole(role);
								this.selectedRole = this.roles[this.roles.length - 1];
							} else {
								this.permissionsRevokedSnackbar();
							}
						}
					}, err => {
						this.loadingAgents = false;
					})

				}
			}
		});
	}

	//Selection Events
	roleSelected(role, cancel = false) {
		if (this.changes && !cancel) {
			if (!confirm('You have unsaved changes do you want to discard?')) {
				return;
			}
		}
		//Ticket Tab
		this.ticketPermissionsForm = this.formbuilder.group({});
		Object.keys(this.permissions[role]['tickets']).map(key => {
			this.ticketPermissionsForm.addControl(key, new FormControl(this.permissions[role]['tickets'][key], [Validators.required]));
		});
		//Settings Tab
		this.settingsPermissionsForm = this.formbuilder.group({});
		this.selectedRoles = JSON.parse(JSON.stringify(this.permissions[role]['settings'].rolesAndPermissions.canView));
		this.selectedGroups = JSON.parse(JSON.stringify(this.permissions[role]['settings'].ticketManagement.groupManagement.groupViewList));
		this.selectedTeams = JSON.parse(JSON.stringify(this.permissions[role]['settings'].ticketManagement.teamManagement.teamViewList));
		Object.keys(this.permissions[role]['settings']).map(firstKey => {
			if (typeof this.permissions[role]['settings'][firstKey] == 'boolean') {
				// console.log(firstKey);
				this.settingsPermissionsForm.addControl(firstKey, new FormControl(this.permissions[role]['settings'][firstKey], [Validators.required]));
			}
			if (typeof this.permissions[role]['settings'][firstKey] == 'object') {
				Object.keys(this.permissions[role]['settings'][firstKey]).map(secondKey => {
					// console.log(typeof this.permissions[role]['settings'][firstKey][secondKey]);
					if (typeof this.permissions[role]['settings'][firstKey][secondKey] == 'boolean') {
						// console.log(firstKey + '_' + secondKey);
						this.settingsPermissionsForm.addControl(firstKey + '_' + secondKey, new FormControl(this.permissions[role]['settings'][firstKey][secondKey], [Validators.required]));
					}
					else if (typeof this.permissions[role]['settings'][firstKey][secondKey] == 'object' && !Array.isArray(this.permissions[role]['settings'][firstKey][secondKey])) {
						Object.keys(this.permissions[role]['settings'][firstKey][secondKey]).map(thirdKey => {
							// console.log(firstKey + '_' + secondKey + '_' + thirdKey);
							this.settingsPermissionsForm.addControl(firstKey + '_' + secondKey + '_' + thirdKey, new FormControl(this.permissions[role]['settings'][firstKey][secondKey][thirdKey], [Validators.required]));
						})
					}
				})
			}
			// console.log(typeof this.permissions[role]['settings'][key])
		})
		//Agents Tab
		this.agentPermissionsForm = this.formbuilder.group({});
		Object.keys(this.permissions[role]['agents']).map(key => {
			this.agentPermissionsForm.addControl(key, new FormControl(this.permissions[role]['agents'][key], [Validators.required]));
		});
		if (!Object.keys(this.permissions[role]['agents']).includes('autoLogout')) {
			this.agentPermissionsForm.addControl('autoLogout', new FormControl((this.permissions[role]['agents']['autoLogout']) ? this.permissions[role]['agents']['autoLogout'] : -1, [Validators.required]));
		}
		//Chats Tab
		this.chatPermissionsForm = this.formbuilder.group({});
		Object.keys(this.permissions[role]['chats']).map(key => {
			this.chatPermissionsForm.addControl(key, new FormControl(this.permissions[role]['chats'][key], [Validators.required]));
		});
		//Chats Tab
		this.dashboardPermissionsForm = this.formbuilder.group({});
		Object.keys(this.permissions[role]['dashboard']).map(key => {
			this.dashboardPermissionsForm.addControl(key, new FormControl(this.permissions[role]['dashboard'][key], [Validators.required]));
		});
		//Chats Tab
		this.visitorsPermissionsForm = this.formbuilder.group({});
		Object.keys(this.permissions[role]['visitors']).map(key => {
			this.visitorsPermissionsForm.addControl(key, new FormControl(this.permissions[role]['visitors'][key], [Validators.required]));
		});
		//Chats Tab
		this.analyticsPermissionsForm = this.formbuilder.group({});
		Object.keys(this.permissions[role]['analytics']).map(key => {
			this.analyticsPermissionsForm.addControl(key, new FormControl(this.permissions[role]['analytics'][key], [Validators.required]));
		});
		//Chats Tab
		this.crmPermissionsForm = this.formbuilder.group({});
		Object.keys(this.permissions[role]['crm']).map(key => {
			this.crmPermissionsForm.addControl(key, new FormControl(this.permissions[role]['crm'][key], [Validators.required]));
		});
		//Installation Tab
		this.installationPermissionsForm = this.formbuilder.group({});
		Object.keys(this.permissions[role]['installation']).map(key => {
			this.installationPermissionsForm.addControl(key, new FormControl(this.permissions[role]['installation'][key], [Validators.required]));
		});
		this.chatbotPermissionsForm = this.formbuilder.group({});
		Object.keys(this.permissions[role]['chatbot']).map(key => {
			this.chatbotPermissionsForm.addControl(key, new FormControl(this.permissions[role]['chatbot'][key], [Validators.required]));
		});


		// let s_role = role;
		this.selectedRole = role;
		//Apply Settings
		if (this.selectedRole == this.agent.role) {
			this.modificationEnabled = this.userPermissions.rolesAndPermissions.canModifyOwn;
		} else {
			this.modificationEnabled = this.userPermissions.rolesAndPermissions.canModifyOther;
		}

		//Apply Validation
		setTimeout(() => {
			Object.keys(this.settingsPermissionsForm.controls).map(key => {
				this.settingsPermissionsForm.controls[key][(this.modificationEnabled) ? 'enable' : 'disable']();
			})
			Object.keys(this.ticketPermissionsForm.controls).map(key => {
				this.ticketPermissionsForm.controls[key][(this.modificationEnabled) ? 'enable' : 'disable']();
			})
			Object.keys(this.chatPermissionsForm.controls).map(key => {
				this.chatPermissionsForm.controls[key][(this.modificationEnabled) ? 'enable' : 'disable']();
			})
			Object.keys(this.visitorsPermissionsForm.controls).map(key => {
				this.visitorsPermissionsForm.controls[key][(this.modificationEnabled) ? 'enable' : 'disable']();
			})
			Object.keys(this.dashboardPermissionsForm.controls).map(key => {
				this.dashboardPermissionsForm.controls[key][(this.modificationEnabled) ? 'enable' : 'disable']();
			})
			Object.keys(this.analyticsPermissionsForm.controls).map(key => {
				this.analyticsPermissionsForm.controls[key][(this.modificationEnabled) ? 'enable' : 'disable']();
			})
			Object.keys(this.crmPermissionsForm.controls).map(key => {
				this.crmPermissionsForm.controls[key][(this.modificationEnabled) ? 'enable' : 'disable']();
			})
			Object.keys(this.installationPermissionsForm.controls).map(key => {
				this.installationPermissionsForm.controls[key][(this.modificationEnabled) ? 'enable' : 'disable']();
			})
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
	}
	onItemSelect(event) {
		this.changes = true;
		// console.log(this.selectedRoles);

	}
	selectAllAgent(event) {
		this.allAgentsSelected = event.target.checked;
		this.agentList.map(a => {
			a.checked = event.target.checked;
			return a;
		});
		if (event.target.checked) {
			this.actionEnabled = true;
		} else {
			this.actionEnabled = false;
		}
	}

	checkAgent(event, email) {
		this.agentList.map(a => {
			if (a.email == email) {
				a.checked = event.target.checked;
			}
			return a;
		});

		//check if even one is selected or not
		if (this.agentList.some(a => a.checked)) this.actionEnabled = true;
		//select all manipulation
		if (this.agentList.filter(a => !a.checked).length) {
			this.allAgentsSelected = false;
		} else {
			this.allAgentsSelected = true;
		}


		if (this.agentList.every(a => !a.checked)) {
			this.allAgentsSelected = false;
			this.actionEnabled = false;
		}
	}

	checkAgentFromTable(check, email) {
		if (check == null || check == undefined) check = false;
		if (check) {
			check = false;
		} else {
			check = true;
		}

		this.agentList.map(a => {
			if (a.email == email) {
				a.checked = check
			}
			return a;
		});

		//check if even one is selected or not
		if (this.agentList.some(a => a.checked)) this.actionEnabled = true;
		//select all manipulation
		if (this.agentList.filter(a => !a.checked).length) {
			this.allAgentsSelected = false;
		} else {
			this.allAgentsSelected = true;
		}

		if (this.agentList.every(a => !a.checked)) {
			this.allAgentsSelected = false;
			this.actionEnabled = false;
		}
	}

	changeRole() {
		let agentList = this.agentList.filter(a => a.checked).map(a => a.email);
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want to change role for these users? Note: New settings will be updated for this user upon next login.' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._agentService.saveRoleForUsers(agentList, this.selectedRole, this.newRoleForUser).subscribe(response => {
					this.agentList = response;
					this.newRoleForUser = '';
				});
			}
			else {
			}
		});
	}

	//Check if form is equivalent, if yes then enable the save or cancel button.
	checkEquivalent() {
		this.changes = true;
	}

	//Reset Form back to last saved settings discarding all current changes.
	cancel() {
		this.roleSelected(this.selectedRole, true);
		this.changes = false;
	}

	//Get agents for the role selected
	GetAgentsForRole(role) {
		this.loadingAgents = true;
		this._agentService.getAllAgentsForRole(role).subscribe(response => {
			// console.log(response);
			this.agentList = response;
			this.loadingAgents = false;
		}, err => {
			this.loadingAgents = false;
		})
	}

	public ShowAssignAgentForm() {
		this.showAssignAgentForm = !this.showAssignAgentForm;
	}

	clearAgent(event, email) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.allAgents.map(a => {
			if (a.email == email) {
				a.selected = false;
				return a;
			}
		});
		this.selectedAgents.map((agent, index) => {
			if (agent == email) {
				this.selectedAgents.splice(index, 1);
			}
		});
		if (this.allAgents.filter(a => a.selected).length == this.allAgents.length) {
			// console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
	}
	clearAllAgents(event) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.selectedAgents = [];
		this.allAgents.map(a => {
			a.selected = false;
			return a;
		});
		if (this.agentList.filter(a => a.selected).length == this.allAgents.length) {
			console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
	}
	onItemSelect_dropdown(email) {
		if (!this.selectedAgents.includes(email)) this.selectedAgents.push(email);
		this.allAgents.map(a => {
			if (a.email == email) {
				a.selected = true;
				return a;
			}
		});
		if (this.allAgents.filter(a => a.selected).length == this.allAgents.length) {
			console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
	}

	onScroll($event) {
		if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
			console.log('Scroll');
			if (!this.ended && !this.loadingMoreAgents) {
				console.log('Fetch More');
				this.loadingMoreAgents = true;
				this._agentService.getMoreAgentsObs(this.allAgents[this.allAgents.length - 1].first_name).subscribe(response => {
					console.log(response);
					this.allAgents = this.allAgents.concat(response.agents);
					this.ended = response.ended;
					this.loadingMoreAgents = false;
				});
			}
		}
		this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
	}

	deleteEnabled(role) {
		switch (role) {
			case 'superadmin':
			case 'admin':
			case 'supervisor':
			case 'agent':
				return false;
			default:
				return true;
		}
	}

	AddAgent() {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want to change role for these users? Note: New settings will be updated for this user upon next login.' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._agentService.saveRoleForUsers(this.selectedAgents, this.selectedRole, this.selectedRole).subscribe(response => {
					this.agentList = response;
					this.newRoleForUser = '';
				});
				this.selectedAgents = [];
			}
			else {
			}
		});
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}


}
