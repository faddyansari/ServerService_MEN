import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
//Auth Service
import { AuthService } from '../../../services/AuthenticationService';
import { ChatService } from '../../../services/ChatService';
import { GlobalStateService } from '../../../services/GlobalStateService'
import { SocketService } from '../../../services/SocketService';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { TicketsService } from '../../../services/TicketsService';
import { OverlayDialogComponent } from '../../dialogs/overlay-dialog/overlay-dialog.component';
import { AgentService } from '../../../services/AgentService';
import { LocalStorageService } from '../../../services/LocalStorageService';
import { Contactservice } from '../../../services/ContactService';
import { HelpWindowService } from '../../../services/help-window.service';
import { PostmessageService } from '../../../services/post-message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PopperContent } from 'ngx-popper';
import { Subject } from 'rxjs/Subject';
import { Visitorservice } from '../../../services/VisitorService';
import { WhatsAppService } from '../../../services/WhatsAppService';


@Component({
	selector: 'app-main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.scss'],
	providers: [
		HelpWindowService,
		PostmessageService
	],
	encapsulation: ViewEncapsulation.None
})
export class MainHeaderComponent implements OnInit, AfterViewInit {

	@ViewChild(OverlayDialogComponent) overlayRef: OverlayDialogComponent;
	@ViewChild('helpFrame') helpWindowFrame: ElementRef;
	@ViewChild('searchContainer') searchContainer: ElementRef;
	@ViewChild('searchBox') searchBox: ElementRef;
	@ViewChild('popperToolboxContent') popperToolboxContent: PopperContent
	// @ViewChild('searchPopper') searchPopper: PopperContent;
	// currentRoute = '/home';
	subscriptions: Subscription[] = [];
	currentRoute;

	//Side Bar Customized
	showSubMenu = false;
	status = '';
	agent: any;
	role = '';
	nsp = '';
	routeAllowed = true;

	allconversations: any = [];
	messageReadCount = 0;

	pendingTicketsCount = 0;
	openTicketsCount = 0;
	agentMessageReadCount = 0;
	contactMessageReadCount = 0;

	settings;
	acceptingChatMode = false;

	agentId = '';

	dialogOpenedTrue: boolean;
	dialogRef: MatDialogRef<OverlayDialogComponent, any>;
	reconnectionStatus = false;

	agentConversations: Array<any> = [];
	showChat: any;
	// agentList: Array<any> = [];

	contactThreadList: Array<any> = [];
	isSelfViewingContactChat: any;
	isSelfViewingAgentChat: any;
	verified = true;
	production = false;
	sbt = false;
	showSettingsMenu = false;
	settingsSelectedRoute = '';
	filters: any;

	//Help Window Functionality

	helpWindow: boolean = false
	helpFrameAddress: string = '';
	sv: string;
	msgNotification: boolean = false
	msgNotificationCount: number = undefined;

	navbarSidebar_state: any;
	public searchActive = false;

	permissions: any;
	rendered = false;

	//Search Tickets
	searchValue = '';
	searchInput = new Subject();
	searchedTickets = [];
	showPopper = false;

	popperClick = false;

	showCallmenu = false;

	chattingVisitorsCount: number = 0
	queuedVisitorsCount: number = 0;

	WapUnreadCount: number = 0;

	getQueuedVisitorOnAccepting: Subject<any> = new Subject();
	fetchQueue: boolean;

	package = undefined;

	constructor(private routeService: GlobalStateService,
		private _authService: AuthService,
		private _globalStateService: GlobalStateService,
		private _chatService: ChatService,
		private _agentService: AgentService,
		private _contactService: Contactservice,
		private _socketService: SocketService,
		private _ticketService: TicketsService,
		private _localStorageService: LocalStorageService,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private _helpService: HelpWindowService,
		public sanitizer: DomSanitizer,
		private _postMessageService: PostmessageService,
		private _whatsAppService: WhatsAppService,
		private _visitorService: Visitorservice
	) {

		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			// //console.logdata);
			if (data && data.permissions) {
				this.permissions = data.permissions;
				// //console.logthis.permissions);
			}

		}));

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg;
			}
		}));





		this.subscriptions.push(_globalStateService.getRoute().subscribe(data => {
			this.currentRoute = data;
		}));
		this.subscriptions.push(_globalStateService.showSettingsMenu.subscribe(data => {
			this.showSettingsMenu = data;
		}));
		this.subscriptions.push(_globalStateService.settingsSelectedRoute.subscribe(data => {
			this.settingsSelectedRoute = data;
		}));

		this.subscriptions.push(_authService.SBT.subscribe(data => {
			this.sbt = data;
		}));

		this.subscriptions.push(_socketService.GetStatus().subscribe(status => {
			//Open Dialog here
			if (status == 'Connected' && this.status == 'Disconnected') {
				setTimeout(() => {
					this.dialogRef.componentInstance.Connected('Connected');
					setTimeout(() => {
						this.dialog.closeAll();
						this.dialogOpenedTrue = false;
					}, 1000);
				}, 1000);
			}
			if (status == 'Disconnected') {

				//Hack To Open Dialog In Constructor
				// Remove Angular Expression Changed after View Checked Exception
				this.dialogRef = this.dialog.open(OverlayDialogComponent, {
					panelClass: ['searching-server-dialog'],
					disableClose: true,
					backdropClass: 'opacity1'
				});
				this.dialogOpenedTrue = true;
			}
			this.status = status;
		}));

		this.subscriptions.push(_authService.getAgent().subscribe(data => {
			this.agent = data;
			this.agentId = data._id;
			this.role = data.role;
			this.nsp = data.nsp;
			if (this.role == 'admin' || this.role == 'superadmin') {
				this.routeAllowed = true;
			}
		}));

		this.subscriptions.push(_chatService.AllConversations.subscribe(data => {
			this.allconversations = data;
			this.messageReadCount = 0;
			this.allconversations.map(conversation => {
				if (conversation.messageReadCount && conversation.state == 2) this.messageReadCount += conversation.messageReadCount;
				if (conversation.messages.length) {
					conversation.lastmessageTime = Math.floor((new Date().getTime() -
						new Date(conversation.messages[conversation.messages.length - 1].date).getTime())
						/ 1000 / 60 % 60);
				}
			});
			this._globalStateService.SetTitle(this.messageReadCount);
		}));

		this.subscriptions.push(_ticketService.getTicketsCount().subscribe(countsWRTState => {
			this.pendingTicketsCount = 0;
			this.openTicketsCount = 0;
			countsWRTState.map(group => {
				if (group.state == "PENDING") this.pendingTicketsCount += group.count;
				else if (group.state == "OPEN") this.openTicketsCount += group.count;
			});
		}));
		this.subscriptions.push(_ticketService.Filters.subscribe(filters => {
			if (filters) {
				this.filters = filters;
				this.searchValue = filters.query;
				if (!this.searchValue) {
					this.searchedTickets = [];
				}
			}
		}));
		this.subscriptions.push(_ticketService.headerSearch.subscribe(searchvalue => {
			this.searchValue = searchvalue;
		}));

		// this.subscriptions.push(this._agentService.getAllAgentsList().subscribe(data => {
		// 	////console.log'Agent List Subscribed');
		// 	this.agentList = data;

		// }));

		this.subscriptions.push(this._globalStateService.navbarSidebar_state.subscribe(state => {
			// //console.log'Main Side Bar COmponent Initialized');
			this.navbarSidebar_state = state;
			//  //console.logthis.currentRoute);
		}));

		this.subscriptions.push(_contactService.isSelfViewingChat.subscribe(data => {
			this.isSelfViewingContactChat = data;
		}));
		this.subscriptions.push(_agentService.isSelfViewingChat.subscribe(data => {
			this.isSelfViewingAgentChat = data;
		}));

		this.subscriptions.push(this._agentService.agentConversationList.subscribe(data => {
			this.agentConversations = data;
			let unreadCount = 0;
			this.agentConversations.map(conversation => {
				if (!(this.isSelfViewingAgentChat.chatId == conversation._id && this.isSelfViewingAgentChat.value)) {
					if (conversation.members.filter(m => m.email == this.agent.email).length) {
						let temp = conversation.LastSeen.filter(user => user.email == this.agent.email);
						(temp && temp.length) ? unreadCount += temp[0].messageReadCount : undefined;
					}
				}
			});
			this.agentMessageReadCount = unreadCount;

		}));

		this.subscriptions.push(this._contactService.conversationList.subscribe(data => {
			this.contactThreadList = data;
			let unreadCount = 0;
			this.contactThreadList.map(conversation => {
				if (!(this.isSelfViewingContactChat.chatId == conversation._id && this.isSelfViewingContactChat.value)) {
					if (conversation.to == this.agent.email || conversation.from == this.agent.email) {
						unreadCount += conversation.LastSeen.filter(user => user.id == this.agent.email)[0].messageReadCount;
					}
				}
			});
			this.contactMessageReadCount = unreadCount;

		}));

		this.subscriptions.push(_authService.getSettings().subscribe(settings => {
			if (Object.keys(settings).length) {
				this.settings = settings;
				this.acceptingChatMode = this.settings.applicationSettings.acceptingChatMode
			}
		}));

		this.subscriptions.push(this._authService.helpWindowFrameURL.subscribe(url => {

			this.helpFrameAddress = url;
		}));

		this.subscriptions.push(this._postMessageService.msgNotification.subscribe(data => {
			// //console.logdata);
			if (data == 0) {
				this.msgNotification = false;
			}
			else {
				this.msgNotification = true;
				this.msgNotificationCount = data;
			}
		}));
		// this.subscriptions.push(_visitorService.ChattingVisitorsCount().subscribe((data) => {

		//     //console.log(data);
		// 	this.chattingVisitorsCount = data;
		// }));


		this.subscriptions.push(_visitorService.GetVisitorsList().debounceTime(500).subscribe((data) => {
			this.chattingVisitorsCount = 0
			//console.logthis.agent);
			if (data && data.length) {
				data.map(visitor => {
					if ((visitor.state == 3 || visitor.state == 4) && (visitor.agent && visitor.agent.id && visitor.agent.id == this.agent.csid && !visitor.inactive)) {
						this.chattingVisitorsCount += 1;
					}
				})
			}
		}));

		this.subscriptions.push(_visitorService.QueuedVisitorsCount().subscribe((data) => {
			this.queuedVisitorsCount = data;
		}));

		this.subscriptions.push(this.getQueuedVisitorOnAccepting.debounceTime(2000).subscribe(data => {
			if (this.fetchQueue) this._chatService.AutoSync.next(true)
		}));

		this.subscriptions.push(this._whatsAppService.MessageUnreadCount.subscribe(count => {
			this.WapUnreadCount = count;
		}))

		this.searchInput
			.debounceTime(300)
			.subscribe(() => {
				// this._ticketService.Filters.next(this.ApplyFilter());
				let value = this.searchValue.trim();
				if (value) {
					if (value.length > 1) {
						this._ticketService.getTicketsByQuery(value, 5).subscribe(tickets => {
							//console.logthis.searchValue);
							//console.logtickets);
							this.searchedTickets = tickets;
							this.showPopper = true;

						})
					}
				} else {
					// this.searchAllTickets();
					this._ticketService.headerSearch.next(value);
					// this._ticketService.Filters.next(this.ApplyFilter());
					this.showPopper = false;
					this.searchedTickets = [];
				}
			});


	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.rendered = true;
		}, 0);
	}

	KeyUp(event: KeyboardEvent) {
		if (event.which == 13) {
			this.searchAllTickets();
		}
	}

	closeDrawerAndNavBar() {
		this.routeService.drawerActive.next(false);
		this._globalStateService.navbarState.next(false);
	}

	displaySource(source) {
		switch (source) {
			case 'email':
				return { name: 'Email', img: 'email-colored' }
			case 'livechat':
				return { name: 'Live Chat', img: 'visitors-colored' }
			case 'panel':
				return { name: 'Beelinks Portal', img: 'agents-colored' }
			default:
				return { name: 'N/A', img: 'agents' }
		}
	}

	toggleDrawer() {
		this._globalStateService.ToggleDrawer();
	}

	sideBarDropDownState(event: Event) {
		event.preventDefault();
		this.showSubMenu = !(this.showSubMenu);
	}
	toggleSettingsMenu() {
		this._globalStateService.toggleSettingsMenu()
	}
	hideSettingsMenu() {
		this._globalStateService.setSettingsMenu(false);
	}


	// public setCurrentConversation(event: any) {
	// 	event.preventDefault();
	// 	setTimeout(() => {
	// 		let currentConversation = event.srcElement.attributes.getNamedItem('cid').value;
	// 		this._chatService.setCurrentConversation(currentConversation);
	// 	}, 300);

	// }

	public Logout(e: Event) {
		e.preventDefault();
		// //console.loge);
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want to logout?' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._authService.logout();
				this._localStorageService.setValue('logout', true);
			}
		});
	}

	selectSettings(name) {
		this._globalStateService.setSettingsSelectedRoute(name);
		// this.settingsSelectedRoute = name;
	}



	ngOnDestroy() {
		// Called once, before the instance is destroyed.
		// Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}





	ngOnInit() {
		this.subscriptions.push(this._globalStateService.currentRoute.subscribe(route => {
			// //console.log'Main Side Bar COmponent Initialized');
			this.currentRoute = route;

		}));
	}

	ToogleAcceptingChatMode() {
		if (!this.acceptingChatMode) {
			this.fetchQueue = true
			this.getQueuedVisitorOnAccepting.next(true)
		}
		else this.fetchQueue = false
		this._chatService.ToogleChatMode(!this.acceptingChatMode);
	}

	public updateNavBar() {
		this._globalStateService.ToggleNavBarState();
	}

	toggleNavBar() {
		this._globalStateService.ToggleNavBarState();
	}

	public toggleSearch() {
		this.searchActive = !this.searchActive;
	}


	public HidePopper(event: Event) {
		event.preventDefault();
		event.stopImmediatePropagation();
		event.stopPropagation();
		this.popperToolboxContent.hide()
	}

	seeCMID(ticket) {
		let res = ticket.subject.split('/');
		if (res && res.length) {
			if (res[4] && res[4].trim() == 'Beelinks' && ticket.CustomerInfo && ticket.CustomerInfo.customerId) {
				
				if (res[2] && res[2].toString().trim() == ticket.CustomerInfo.customerId.toString().trim()) {
					return false
				}
				else return true
			}
		}
		else return false
	}
	toggleNavbarSidebar() {
		this._globalStateService.navbarSidebar_state.next(!this.navbarSidebar_state);
	}


	GetHelp() {
		this.msgNotification = false
		this._helpService.OpenHelpWindow(this.helpWindowFrame);
	}

	searchAllTickets() {
		// if (this.searchValue) {
		// this.searchPopper.hide();
		// this._ticketService.Filters.next(this.ApplyFilter());
		this._ticketService.headerSearch.next(this.searchValue.trim());
		this._globalStateService.NavigateForce('/tickets/list');
		this.showPopper = false;
		(this.searchContainer.nativeElement as any).focus();
		(this.searchContainer.nativeElement as any).blur();
		// }
	}

	Blurred(val: string) {
		//console.logval);
	}

	// ApplyFilter() {
	// 	if(this.filters && this.filters.query != undefined){
	// 		this.filters.query = this.searchValue;
	// 	}else{
	// 		Object.assign(this.filters, { query: this.searchValue });
	// 	}
	// 	// let filters = {
	// 	// 	priority: [],
	// 	// 	state: [],
	// 	// 	assigned_to: [],
	// 	// 	// tags: this.selectedTags,
	// 	// 	contactNames: [],
	// 	// 	source: [],
	// 	// 	createdDate: [],
	// 	// 	group: []
	// 	// }
	// 	// let matchObject = {};
	// 	// Object.keys(filters).map(key => {
	// 	// 	// //console.logkey + ' ' + filters[key]);
	// 	// 	if (filters[key].length) {
	// 	// 		Object.assign(matchObject, { [key]: filters[key] });
	// 	// 	}
	// 	// });
	// 	// let query = this.searchValue
	// 	return this.filters;
	// }

	selectTicket(id) {
		this._globalStateService.NavigateForce('/tickets/ticket-view/' + id);
		(this.searchContainer.nativeElement as any).focus();
		(this.searchContainer.nativeElement as any).blur();
	}
	// hidePopper(){
	// 	//console.log'Hide Popper');

	// 	setTimeout(() => {
	// 		this.searchPopper.hide()
	// 	}, 100);
	// }
	inputBlur() {
		//if popper not clicked then blur div
		setTimeout(() => {
			if (!this.popperClick) {
				(this.searchContainer.nativeElement as any).focus();
				(this.searchContainer.nativeElement as any).blur();
			}
		}, 200);
	}
	clicked() {
		// console.log('div clicked');
		// (this.searchContainer.nativeElement as any).focus();
	}
	focus() {
		// console.log('div focused');

	}
	blur() {
		// console.log('div blurred');
		this.showPopper = false;
		this.popperClick = false;
	}

	popperClicked(event) {
		event.stopPropagation();
		event.stopImmediatePropagation();

		// console.log('popper clicked');
		this.popperClick = true;

	}

	// blur(){

	// 	// setTimeout(() => {
	// 	// 	this.searchPopper.hide();
	// 	// }, 300);
	// }
	closePopper() {

		this.showPopper = false;
		// this.searchPopper.hide();
	}
	ShowPopper() {
		if (this.searchedTickets.length) {
			this.showPopper = true;
		}
		// this.searchPopper.show();
	}
	// hidePopper(){

	// }

	Disconnect() {
		this._socketService.TestingDisconnect();
	}

	Reconnect() {
		this._socketService.TestingReconnect();
	}

}
