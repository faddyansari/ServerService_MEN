import { Component, OnInit, HostListener, ViewEncapsulation, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

//Services
import { GlobalStateService } from '../../services/GlobalStateService';
import { AuthService } from '../../services/AuthenticationService';
import { SocketService } from '../../services/SocketService';
import { ChatService } from '../../services/ChatService';
import { Contactservice } from '../../services/ContactService';
import { TagsAutomationSettings } from '../../services/LocalServices/TagsAutomationSettings';
import { CallingService } from '../../services/CallingService';
import { MatDialog } from '@angular/material/dialog';
import { RecieverCallDialogComponent } from '../dialogs/reciever-call-dialog/reciever-call-dialog.component';
import { CRMService } from '../../services/crmService';
import { LocalStorageService } from '../../services/LocalStorageService';


@Component({
	selector: 'main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss'],
	providers: [
		Contactservice,
		TagsAutomationSettings,
		Contactservice,
		CRMService
	],
	encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
	// @Input() keyBoardEvent: Subject<any>;
	currentRoute: string;
	subscriptions: Subscription[] = [];
	reciever_data: any;
	timer: any = undefined;
	verified = true;
	drawerActive: boolean = false;
	drawerActive_exit: boolean = false;
	exit: boolean = false;
	navbarState = false;
	navbarState_exit = false;
	navbarSidebar_state = false;
	loadingRouteConfig = false;
	loadingNestedRouteConfig = false;
	fetching = true;
	sbt = false;
	logoutTimer: NodeJS.Timer;
	autoLogout = -1;

	constructor(private routeService: GlobalStateService,
		private _globalStateService: GlobalStateService,
		private _socketService: SocketService,
		private _chatService: ChatService,
		private dialog: MatDialog,
		private _callingService: CallingService,
		private _localStorageService: LocalStorageService,
		private _authService: AuthService) {

		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings) this.verified = settings.verified;
			this.fetching = false;
		}));

		this.subscriptions.push(this._authService.SBT.subscribe(data => {
			this.sbt = data;
		}));

		this.subscriptions.push(_callingService.CallRecieved().subscribe(data => {
			if (data) {
				this.RecieveCall();
			}
		}));

		this.subscriptions.push(this._authService.getSettings().subscribe(data => {
			// //console.log(data);
			if (data && data.permissions && data.permissions.agents.autoLogout) {
				this.autoLogout = data.permissions.agents.autoLogout;
			}
		}));

		// this.subscriptions.push(_callingService.callEnd.subscribe(data => {
		// 	if (data) {
		// 		this.EndCall();
		// 	}
		// }));

		this.subscriptions.push(_globalStateService.drawerActive.subscribe(data => {
			this.drawerActive = data;
		}));



		this.subscriptions.push(_globalStateService.drawerActive_exit.subscribe(data => {
			this.drawerActive_exit = data;
		}));

		this.subscriptions.push(this._globalStateService.navbarState.subscribe(state => {
			this.navbarState = state;
		}));
		this.subscriptions.push(this._globalStateService.loadingRouteConfig.subscribe(data => {
			this.loadingRouteConfig = data;
		}));
		this.subscriptions.push(this._globalStateService.loadingNestedRouteConfig.subscribe(data => {
			this.loadingNestedRouteConfig = data;
		}));
		this.subscriptions.push(this._globalStateService.navbarState_exit.subscribe(state => {
			this.navbarState_exit = state;
		}));

		// this.subscriptions.push(this.keyBoardEvent.subscribe(data => {
		// 	//console.log"keyBoardEvent");
		// 	//console.logdata);

		// }));

	}

	ngOnInit() {

		// //console.log'Main component Initialized');
		this.subscriptions.push(this.routeService.getRoute().subscribe((observer) => {
			this.currentRoute = observer;
		}));



	}

	public updateSideBar() {
		this._globalStateService.ToggleSideBarState();
	}

	@HostListener('document:visibilitychange', ['$event'])
	visibilitychange() {
		//   console.log(document.visibilityState);
		event.preventDefault();
		if (!document.visibilityState) return;
		if (document.visibilityState == 'hidden' && this.autoLogout && this.autoLogout > 0) {
			this.logoutTimer = setTimeout(() => {
				this._authService.logout();
				this._localStorageService.setValue('logout', true);
			}, 1000 * 60 * this.autoLogout);

		} else if (document.visibilityState == 'visible') {
			if (this.logoutTimer) clearTimeout(this.logoutTimer);
		}
	}

	@HostListener('window:focus', ['$event'])
	onfocus(event: any): void {
		// Do something
		this.routeService.setFocusedState(true);
		this.routeService.setNotificationState(false);
		// if (this.currentRoute == '/chats') {
		// 	let currentConversation = this._chatService.getCurrentConversation().getValue();
		// 	if (currentConversation._id != undefined) {
		// 		this._chatService.setCurrentConversation(currentConversation._id);
		// 	}
		// }


	}

	@HostListener('window:blur', ['$event'])
	onBlur(event: any): void {
		// Do something
		this.routeService.setFocusedState(false);
		this.routeService.setNotificationState(true);
	}

	@HostListener('window:beforeunload', ['$event'])
	unloadNotification(event: Event): void {
		// Do something
		event.preventDefault()
		this._chatService.TypingOnReload();

	}






	@HostListener('window:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {

		if (event.keyCode == 74 && event.altKey && event.ctrlKey) {

			this.routeService.RequestQue();

		}
		else if (event.keyCode == 68 && event.shiftKey && event.altKey) {

			this.routeService.setSelectedThread('next');
		}
		else if (event.keyCode == 65 && event.shiftKey && event.altKey) {

			this.routeService.setSelectedThread('previous');
		}


	}

	@HostListener('window:resize', ['$event'])
	onResize(event: Event) {
		event.preventDefault();
		this._globalStateService.ResizeEvent(event);

	}


	// FocusIn(event: Event) {
	//   //console.log'Focus In');
	// }

	// FocusOut(event: Event) {
	//   //console.log'Focus Out');
	// }

	ngOnDestroy() {

		// Called once, before the instance is destroyed.
		// Add 'implements OnDestroy' to the class.
		//console.log'Main Destroyed');
		this._socketService.Disconnect();
		this.subscriptions.forEach((subscription) => {
			subscription.unsubscribe();
		});

	}
	closeDrawerAndNavBar() {
		this.routeService.drawerActive.next(false);
		this._globalStateService.navbarState.next(false);
	}

	public RecieveCall() {
		this.subscriptions.push(this.dialog.open(RecieverCallDialogComponent, {
			panelClass: ['calling-dialog'],
			disableClose: true,
			autoFocus: true
		}).afterClosed().subscribe(data => {
			this._callingService.EndCall();
		}));
	}

	// public EndCall() {
	// 	this.dialog.closeAll();

	// }


}
