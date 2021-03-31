import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { TicketsService } from './TicketsService';
import { GlobalStateService } from './GlobalStateService';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './AuthenticationService';

@Injectable()
export class InternalSettingsGuard implements CanActivateChild {

	accessRoute = '';
	accessSet = false;
	permissions: any;
	lastRoute : any;
	constructor(private _globalApplicationState: GlobalStateService, _authService: AuthService) {
		_authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
				this.permissions = data.permissions.settings;
			}
		});
		this._globalApplicationState.accessRoute.subscribe(route => {
			this.accessRoute = route;
		});
		this._globalApplicationState.accessSet.subscribe(value => {
			this.accessSet = value;
		})
	}

	canActivateChild(): Observable<boolean> {
		return new Observable(observer => {
			this._globalApplicationState.accessSet.subscribe(value => {
				if (value) {
					if (this.accessRoute.match(/\//g).length > 2) {
						let routes = this.accessRoute.split('/').filter(Boolean);
						this.lastRoute = routes[routes.length - 1];
						this.accessRoute = '/' + routes[0] + '/' + routes[1];
					}
					let result = false;
					switch (this.accessRoute) {
						case '/settings':
							result = true;
							break;
						case '/settings/general':
							switch (this.lastRoute) {
								case 'automated-responses':
										result = this.permissions.automatedResponses.enabled;
									break;
								case 'roles-and-permissions':
										result = this.permissions.rolesAndPermissions.enabled;
									break;
								case 'auth-settings':
										result = true;
									break;
								case 'keyboard-shortcuts':
									result = true;
								break;	
								case 'response':
									result = true;
								break;	
								default:
										result = false;
									break;
							}							
							break;
						case '/settings/form-designer':
							result = this.permissions.formDesigner.enabled;;
							break;
						case '/settings/assignment-rules':
							result = this.permissions.assignmentRules.enabled;
							break;
						case '/settings/ticket-management':
							result = this.permissions.ticketManagement.enabled;
							break;
						case '/settings/chat-settings':
							result = this.permissions.chatTimeouts.enabled;
							break;
						case '/settings/call-settings':
							result = this.permissions.callSettings.enabled;
							break;
						case '/settings/contact-settings':
							result = this.permissions.callSettings.enabled;
							break;
						case '/settings/chat-window':
							result = this.permissions.chatWindowSettings.enabled;
							break;
						case '/settings/webhooks':
							result = this.permissions.webhooks.enabled;
							break;
						case '/settings/integerations':
							result = this.permissions.integerations.enabled;
							break;
						case '/settings/knowledge-base':
							result = this.permissions.knowledgeBase.enabled;
							break;
						case '/settings/widget-marketing':
							result = this.permissions.widgetMarketing.enabled;
							break;
						case '/settings/group-management':
							result = false;
							break;
						case '/settings/keyboard-shortcuts':
							result = false;
							break;
						case '/settings/profile':
							result = false;
							break;
						// case '/settings/bulk-marketing-email':
						// 	result = false;
						// 	break;
						default:
							result = false;
							break;
					}
					if (result) {
						observer.next(result);
						observer.complete();
					} else {
						// console.log('No Access!');
						this._globalApplicationState.canAccessPageNotFound.next(true);
						this._globalApplicationState.NavigateTo('/noaccess');
						observer.next(false);
						observer.complete();
					}
					// if (this._globalApplicationState.getSettingsRouteAccess(this.accessRoute)) {
					// 	observer.next(true);
					// 	observer.complete();
					// } else {
					// 	// console.log('No Access!');
					// 	this._globalApplicationState.canAccessPageNotFound.next(true);
					// 	this._globalApplicationState.NavigateTo('/noaccess');
					// 	observer.next(false);
					// 	observer.complete();
					// }
				}
			});
		})
	}
}