import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../services/AuthenticationService';
import { Subscription } from 'rxjs/Subscription';
import { GlobalStateService } from '../../../services/GlobalStateService';
import { Location } from '@angular/common';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	agent: any;
	redirectURI = '';
	currentRoute: any;
	role = '';
	loadingNestedRouteConfig = false;
	production = false;
	nsp: string = '';
	sbt = false;
	routeLevel = 0;
	contentInfo : any;
	breadCrumbLinks: any;
	breadCrumbTitle: any;
	permissions : any;
	viewContentInfo = false;

	constructor(_authService: AuthService, public _globalStateService: GlobalStateService, private _location: Location) {

		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			// console.log(data);
			if(data && data.permissions){
				this.permissions = data.permissions.settings;
				// console.log(this.permissions);			
			}
			// //console.log(this.currAgent.level);

		}));

		this.subscriptions.push(_authService.Production.subscribe(production => {
			this.production = production;
		}));

		this.subscriptions.push(_authService.SBT.subscribe(data => {
			this.sbt = data;
		}));
		this.subscriptions.push(_globalStateService.contentInfo.subscribe(data => {
			this.contentInfo = data;
		}));
		// this.subscriptions.push(_globalStateService.currentRoute.subscribe(data => {
		// 	console.log(data);
		// 	console.log(data.split('/'));
			
		// 	// this.breadCrumbLink = data;
		// }));
		this.subscriptions.push(_globalStateService.breadCrumbTitle.subscribe(data => {
			this.breadCrumbTitle = data;
		}));

		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			this.agent = agent;
			this.nsp = agent.nsp;
			this.role = agent.role;
		}));

		this._globalStateService.currentRoute.subscribe(route => {
			this.currentRoute = route;
			setTimeout(() => {
				this.routeLevel = this.currentRoute.match(/\//g).length;
			}, 0);
			// console.log(route.split('/').filter(Boolean));
			
			this.breadCrumbLinks = route.split('/').filter(Boolean);
			// console.log(this.routeLevel);
		});
		this._globalStateService.loadingNestedRouteConfig.subscribe(data => {
			this.loadingNestedRouteConfig = data;
			// console.log('LoadingNestedRoute: '+ data);
			// console.log(this.currentRoute);
		});

		this.subscriptions.push(_authService.GetRedirectionURI().subscribe(data => {
			this.redirectURI = data;
		}));

	}

	ngOnInit() { }

	public STOPPROPAGATION(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
	}

	toggleInfoArea(){
		this.viewContentInfo = !this.viewContentInfo;
	}

	showSettingsMenu(link){
		if(link){
			this._globalStateService.setSettingsSelectedRoute(link);
		}else{
			this._globalStateService.setSettingsSelectedRoute('general');
		}
		this._globalStateService.setSettingsMenu(true);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}