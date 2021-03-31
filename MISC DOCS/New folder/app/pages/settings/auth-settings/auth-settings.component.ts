import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/AuthenticationService';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { RolesAndPermissionsService } from '../../../../services/RolesAndPermissionsService';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';

@Component({
	selector: 'app-auth-settings',
	templateUrl: './auth-settings.component.html',
	styleUrls: ['./auth-settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AuthSettingsComponent implements OnInit {

	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	scrollHeight = 0;
	authSettings: any;
	// Agent : any;
	showIPAddForm = false;
	ipInput = '';
	subscriptions: Subscription[] = [];
	showError = '';
	IPRegex = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
	roles = [];
	public agentList = [];
	public agentList_original = [];
	public selectedAgents = [];
	dropDown_typeahead = '';
	searchInput = new Subject();
	ended = false;
	loadingMoreAgents = false;
	showNoAgents = false;
	allowedIpsForm = false;
	suppressionForm = false;
	roleSearchValue = '';
	IPSearchValue = '';
	suppressValue = '';

	package : any;

	constructor(private _authService: AuthService, private _utilityService: UtilityService, private _permissionService: RolesAndPermissionsService, private _appStateService: GlobalStateService) {
		_appStateService.breadCrumbTitle.next('Authentication Settings');
		// this.subscriptions.push(_authService.getAgent().subscribe(agent => {
		// 	if(agent){
		// 		this.Agent = agent;
		// 	}
		// }))

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg.security;
				if (!this.package.authsettings.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}
		}));
		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
			if (agents) {
				this.agentList = agents;
				this.agentList_original = agents;
			}
			// console.log(this.agentList);

		}));
		this.subscriptions.push(_authService.getSettings().subscribe(settings => {
			if (settings && settings.permissions.authentication) {
				this.authSettings = settings.permissions.authentication;
				this.roles = settings.permissions.settings.rolesAndPermissions.canView;
				this.roles.forEach(role => {
					// console.log(this.authSettings[role]);
				});
				// console.log(this.authSettings);
				// console.log(this.roles);
			}
			// console.log(settings);


		}));
		this.searchInput
			.map(event => event)
			.debounceTime(500)
			.switchMap(() => {
				return new Observable((observer) => {
					// console.log('search');
					if (this.dropDown_typeahead) {
						let agents = this.agentList_original.filter(a => a.email.includes((this.dropDown_typeahead as string).toLowerCase()));
						this._utilityService.SearchAgent(this.dropDown_typeahead).subscribe((response) => {
							//console.log(response);
							if (response && response.agentList.length) {
								response.agentList.forEach(element => {
									if (!agents.filter(a => a.email == element.email).length) {
										agents.push(element);
									}
								});
							}
							this.agentList = agents;
						});
						// this.agentList = agents;
					} else {
						this.agentList = this.agentList_original;
						// this.setScrollEvent();
					}
				})
			}).subscribe();
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
	}


	roleSelected(role) {
		// console.log(role);
	}

	clearAgent(event, email) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.agentList.map(a => {
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
		if (this.agentList.filter(a => a.selected).length == this.agentList.length) {
			// console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
		// this._permissionService.removeAgentFromSuppresionList(email);
	}
	clearAllAgents(event) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.selectedAgents = [];
		this.agentList.map(a => {
			a.selected = false;
			return a;
		});
		if (this.agentList.filter(a => a.selected).length == this.agentList.length) {
			// console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
	}

	onItemSelect_dropdown(email) {
		if (!this.selectedAgents.includes(email)) this.selectedAgents.push(email);
		this.agentList.map(a => {
			if (a.email == email) {
				a.selected = true;
				return a;
			}
		});
		if (this.agentList.filter(a => a.selected).length == this.agentList.length) {
			// console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
	}


	ToggleAllowedIpsForm() {
		this.allowedIpsForm = !this.allowedIpsForm;
	}

	ToggleSuppressionForm() {
		this.suppressionForm = !this.suppressionForm;
	}

	//Scroll events
	onScroll($event) {
		if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
			console.log('Scroll');
			if (!this.ended && !this.loadingMoreAgents) {
				console.log('Fetch More');
				this.loadingMoreAgents = true;
				this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(response => {
					console.log(response);
					this.agentList = this.agentList.concat(response.agents);
					this.ended = response.ended;
					this.loadingMoreAgents = false;
				});
			}
		}
		this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
	}

	addIP() {
		if (this.IPRegex.test(this.ipInput)) {
			if (!this.authSettings.allowedIPs.filter(ip => ip == this.ipInput).length) {
				this._permissionService.addIP(this.ipInput).subscribe(status => {
					if (status == 'ok') {
						this.ipInput = '';
					}
				});
			} else {
				this.showError = 'IP address already exists';
				setTimeout(() => {
					this.showError = '';
				}, 2000);
			}
		} else {
			this.showError = 'Invalid IP Address';
			setTimeout(() => {
				this.showError = '';
			}, 2000);
		}
	}
	setSuppressionList() {
		let agents = this.authSettings.suppressionList.concat(this.selectedAgents);
		this._permissionService.setSuppressionList(agents.filter((item, i, ar) => ar.indexOf(item) === i)).subscribe(status => {
			if (status == 'ok') {
				this.selectedAgents = [];
				this.suppressionForm = false;
			}
		});
	}
	removeAgent(email) {
		this.agentList.map(a => {
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
		if (this.agentList.filter(a => a.selected).length == this.agentList.length) {
			// console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
		this._permissionService.removeAgentFromSuppresionList(email);
	}
	enterPressed(event) {
		if (event.keyCode == 13) {
			this.addIP()
		}
	}
	removeIP(ip) {
		this._permissionService.removeIP(ip);
	}

	// toggle(value) {
	// 	this._permissionService.ToggleAuthPermission(value);
	// }
	toggleSSO(role, value) {
		this._permissionService.ToggleAuthPermission(role, value);
		// console.log(this.authSettings);	
	}
	toggleForgotPassword(value) {
		this._permissionService.ToggleForgotPassPermission(value);
		// console.log(this.authSettings);	
	}

	toggle2FA(role, value) {
		this._permissionService.Toggle2FAPermission(role, value);
		// console.log(this.authSettings);	
	}

	ShowIpAddForm() {
		this.showIPAddForm = !this.showIPAddForm;
	}

	// preventInvalid(e) {
	// 	e.preventDefault();
	// 	return this.validateIP(e.target.value + String.fromCharCode(e.which));
	// }

	// validateIP(ip) {
	// 	var splitted = ip.split(".");
	// 	var nb = splitted.length;

	// 	if (nb > 4) return false;
	// 	if (splitted[nb - 2] == "") return false;
	// 	if (splitted[nb - 1] == "") return true;


	// 	if (nb < 4) {
	// 	  return this.first3BytesRg.test(splitted[nb - 1]);
	// 	}

	// 	return this.fourthByteRg.test(splitted[nb - 1]);
	//   }

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}
