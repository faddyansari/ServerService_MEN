import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { GlobalStateService } from './GlobalStateService';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './AuthenticationService';

@Injectable()
export class MainAuthGuard implements CanActivate {

	accessRoute = '';
	accessSet = false;
	permissions: any;
	accessWhatsApp: boolean = false;
	constructor(private _globalApplicationState: GlobalStateService, _authService: AuthService) {
		_authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
				this.permissions = data.permissions;
			}
		});
		this._globalApplicationState.accessRoute.subscribe(route => {
			this.accessRoute = route;
		});
		this._globalApplicationState.canAccessWhatsApp.subscribe(permission => {
			this.accessWhatsApp = permission;
		})

		this._globalApplicationState.accessSet.subscribe(value => {
			this.accessSet = value;
		})
	}

	canActivate(): Observable<boolean> {
		return new Observable(observer => {
			this._globalApplicationState.accessSet.subscribe(value => {
				if (value) {
					if (this.accessRoute.match(/\//g).length > 1) {
						let routes = this.accessRoute.split('/').filter(Boolean);
						this.accessRoute = '/' + routes[0]
					}
					let result = false;
					switch (this.accessRoute) {
						case '':
						case '/':
						case '/home':
							result = true;
							break;
						case '/dashboard':
							result = this.permissions.dashboard.enabled;
							break;
						case '/chats':
							result = this.permissions.chats.enabled;
							break;
						case '/tickets':
							// result = this._globalApplicationState.canAccessTickets.getValue();;
							result = this.permissions.tickets.enabled;
							break;
						case '/visitors':
							result = this.permissions.visitors.enabled;
							break;
						case '/settings':
							result = this.permissions.settings.enabled;
							break;
						case '/agents':
							result = this.permissions.agents.enabled;
							break;
						case '/contacts':
							result = false;
							break;
						case '/installation':
							result = this._globalApplicationState.canAccessInstallation.getValue();
							break;
						case '/crm':
							result = this.permissions.crm.enabled;
							break;
						case '/analytics':
							result = this.permissions.analytics.enabled;
							break;
						case '/noaccess':
							result = this._globalApplicationState.canAccessPageNotFound.getValue();
							break;
						case '/whatsapp':
							result = this._globalApplicationState.canAccessWhatsApp.getValue();
							break;
						default:
							result = true;
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
					// if (this._globalApplicationState.getRouteAccess(this.accessRoute)) {
					// 	observer.next(true);
					// 	observer.complete();
					// } else if (this.accessRoute != '/noaccess') {
					// 	// console.log('No Access!');
					// 	this._globalApplicationState.canAccessPageNotFound.next(true);
					// 	this._globalApplicationState.NavigateTo('/noaccess');
					// 	observer.next(false);
					// 	observer.complete();
					// } else {
					// 	this._globalApplicationState.NavigateTo('/home');
					// 	observer.next(true);
					// 	observer.complete();
					// }
				}
			});
		})


	}
}