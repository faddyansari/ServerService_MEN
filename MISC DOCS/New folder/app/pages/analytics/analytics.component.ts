import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../services/AuthenticationService';
import { Subscription } from 'rxjs/Subscription';
import { GlobalStateService } from '../../../services/GlobalStateService';

@Component({
	selector: 'app-analytics',
	templateUrl: './analytics.component.html',
	styleUrls: ['./analytics.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	agent: any;
	redirectURI = '';
	currentRoute: any;
	loadingNestedRouteConfig = false;
	role = '';
	viewContentInfo = false;
	permissions: any;

	package = undefined;

	constructor(_authService: AuthService, public _globalStateService: GlobalStateService) {


		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg.analytics;
				if (!this.package.allowed) {
					this._globalStateService.NavigateTo('/noaccess');
				}
			}
		}));

		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			this.agent = agent;
			this.role = agent.role;
		}));

		this.subscriptions.push(_authService.getSettings().subscribe(data => {

			if (data && data.permissions) {
				this.permissions = data.permissions.analytics;
			}

		}));

		this._globalStateService.currentRoute.subscribe(route => {
			this.currentRoute = route;
			// console.log(this.currentRoute);
		});
		this._globalStateService.loadingNestedRouteConfig.subscribe(data => {
			this.loadingNestedRouteConfig = data;
			// console.log('LoadingNestedRoute: '+ data);
			// console.log(this.currentRoute);
		});

		this.subscriptions.push(_authService.GetRedirectionURI().subscribe(data => {
			this.redirectURI = data;
		}))

	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

	displayTab() {
		if (this.currentRoute && this.currentRoute.includes('/analytics')) {
			return true;
		} else {
			return false;
		}
	}

	toggleInfoArea() {
		this.viewContentInfo = !this.viewContentInfo;
	}

	public STOPPROPAGATION(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
	}

}
