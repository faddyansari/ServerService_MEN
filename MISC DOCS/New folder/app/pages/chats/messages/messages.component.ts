import { Component, OnInit, ViewEncapsulation, AfterViewChecked, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../../services/AuthenticationService';
import { Subscription } from 'rxjs/Subscription';
import { ChatService } from '../../../../services/ChatService';
import 'rxjs/add/observable/of';
import { MatDialog } from '@angular/material/dialog';
import { AddFaqDialogComponent } from '../../../dialogs/add-faq-dialog/add-faq-dialog.component';
import { AddTphraseDialogComponent } from '../../../dialogs/add-tphrase-dialog/add-tphrase-dialog.component';
import { Subject } from 'rxjs/Subject';


@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss'],
	encapsulation: ViewEncapsulation.None,
	preserveWhitespaces: false
})
export class MessagesComponent implements OnInit, AfterViewChecked, AfterViewInit {

	@ViewChild('scrollContainer') ScrollContainer: ElementRef;

	subscriptions: Subscription[] = [];
	CheckViewChange: Subject<any> = new Subject();
	agent: any;
	currentConversation;
	initialized = false;
	autoscroll = true;
	scrollHeight = 0;
	activeTab: any;
	fetchedNewMessages = false;
	scrollTop: number;
	showMenu = false;
	isDragged = false;
	permissions: any;

	constructor(private _authService: AuthService, private _chatService: ChatService, public dialog: MatDialog) {
		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
				this.permissions = data.permissions.chats;
			}
		}));
		this.subscriptions.push(_chatService.getCurrentConversation().subscribe(converstaion => {
			if (!this.currentConversation) {
				this.currentConversation = converstaion
				
			} else {
				if (this.currentConversation && (converstaion._id == this.currentConversation._id) && (converstaion.messages && (converstaion.messages.length != this.currentConversation.messages.length))) {

					this.currentConversation = converstaion;
					// if (this.activeTab == 'INBOX') {
					// 	_chatService.setAutoScroll(true);
					// 	_chatService.conversationSeen();
					// } else {
					// 	this.scrollTop = 10;
					// 	_chatService.setAutoScroll(true);
					// }
				}
				if (converstaion._id != this.currentConversation._id) {
					this.currentConversation = converstaion;


					if (this.activeTab == 'INBOX') {
						_chatService.setAutoScroll(true);
						_chatService.conversationSeen();
					} else {
						this.scrollTop = 10;
						_chatService.setAutoScroll(true);
					}
				}
				this.CheckViewChange.next(true);
			}

		}));

		this.subscriptions.push(_chatService.getAutoScroll().subscribe(data => {
			this.autoscroll = data;
		}))

		this.subscriptions.push(this._authService.Agent.subscribe(data => {
			this.agent = data;
		}));

		this.subscriptions.push(_chatService.getActiveTab().subscribe(activeTab => {
			this.activeTab = activeTab;
		}));

		// this.subscriptions.push(_chatService.newMesagedRecieved.debounceTime(100).subscribe(data => {
		// 	if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
		// 		this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
		// 		if (this.autoscroll) {
		// 			console.log('newMesagedRecieved');
		// 			this.scrollToBottom();
		// 		}
		// 	}
		// }))

		this.subscriptions.push(this.CheckViewChange.debounceTime(100).subscribe(data => {
			if (this.activeTab == 'INBOX') {

				if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
					this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
					if (this.autoscroll) {
						this.scrollToBottom();
					}
				}
			} 
			else {
				if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
					if (this.fetchedNewMessages && !this.autoscroll) {
						this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight - this.scrollHeight;
						this.fetchedNewMessages = false;
						this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
					} else {
						this.autoscroll = false;
						this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
						this.ScrollContainer.nativeElement.scrollTop = this.scrollHeight;
					}
				}
			}
		}));


	}

	ngOnInit() {
	}



	private scrollToBottom(): void {
		if (this.autoscroll != true) {
			return
		}
		try {
			setTimeout(() => {
				this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
			}, 300);
		} catch (err) { }
	}

	ngAfterViewInit() {
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.

		this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
		this.initialized = true;
		this.scrollToBottom();

		// if (this.activeTab == 'INBOX') {
		// }
		// else {
		//   this.scrollRef.scrollState
		//     .debounceTime(100)
		//     .subscribe(data => {
		//       this.scrollTop = this.scrollRef.view.scrollTop;
		//       if (this.scrollTop <= 0 && this.scrollRef.thumbY.scrollHeight > 0) {
		//         this.fetchedNewMessages = true;
		//         this._chatService.getMoreArchiveMessages(this.currentConversation._id);
		//       }
		//     })
		//   this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
		// }


	}

	CheckAttachmentType(data) {

		return (typeof data === 'string');
	}

	ScrollChanged(event: UIEvent) {
		if (!this.ScrollContainer || !this.ScrollContainer.nativeElement) return;
		this.scrollTop = this.ScrollContainer.nativeElement.scrollTop;
		if (Math.round((event.target as HTMLElement).scrollTop  + (event.target as HTMLElement).clientHeight) >= this.ScrollContainer.nativeElement.scrollHeight - 10) {	
			if (this.autoscroll != true) {
				this._chatService.setAutoScroll(true);
				this._chatService.conversationSeen()
			}
		} else if (this.activeTab != 'INBOX' && this.scrollTop <= 0 && this.ScrollContainer.nativeElement.scrollHeight > 0) {
			this.fetchedNewMessages = true;

			this._chatService.getMoreArchiveMessages(this.currentConversation._id).subscribe(res => {

				// if (res && res.scroll) {
				//   this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight - this.scrollHeight;
				//   this.fetchedNewMessages = false;
				//   this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
				// }
			}, err => {

			});

		} else {
			if (this.autoscroll != false) {
				this._chatService.setAutoScroll(false);
			}
		}
		this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;

	}

	ngAfterViewChecked() {
		//Called after every check of the component's view. Applies to components only.
		//Add 'implements AfterViewChecked' to the class.

		//this.CheckViewChange.next(true);
		if (this.activeTab == 'INBOX') {
			if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
				this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
				if (this.autoscroll) {
					this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
				}
			}
		} 
		else {
			if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
				if (this.fetchedNewMessages && !this.autoscroll) {
					this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight - this.scrollHeight;
					this.fetchedNewMessages = false;
					this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
				} else {
					this.autoscroll = false;
					this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
					this.ScrollContainer.nativeElement.scrollTop = this.scrollHeight;
				}
			}
		}
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	public setAutoScroll() {
		this.autoscroll = true;
	}


	activateMenu() {
		this.showMenu = !this.showMenu;
	}
	deActivateMenu() {
		this.showMenu = false;
	}
	AddAsFaq(message) {
		this.showMenu = false;
		this.subscriptions.push(this.dialog.open(AddFaqDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: {
				question: message
			}
		}).afterClosed().subscribe(data => {
		}));
	}


	AddAsTPhrase(message) {
		message = message.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
		message.trim();
		this.showMenu = false;
		this.subscriptions.push(this.dialog.open(AddTphraseDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: {
				tPhrase: message
			}
		}).afterClosed().subscribe(data => {
		}));
	}

	Audioclicked() {
		// //console.log('Audio Clicked');
	}


}
