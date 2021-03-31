import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../services/AuthenticationService';
import { ChatService } from '../../../../services/ChatService';

import { GlobalStateService } from '../../../../services/GlobalStateService'
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
// import { ChatSidebarTooltipComponent  } from '../../Tooltips/chat-list-sidebar-tooltip/chat-sidebar-tooltip/chat-sidebar-tooltip.component';

declare var $: any;

@Component({
	selector: 'app-chat-list-sidebar',
	templateUrl: './chat-list-sidebar.component.html',
	styleUrls: ['./chat-list-sidebar.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ChatListSidebarComponent implements OnInit, OnDestroy {

	subscriptions: Subscription[] = [];
	chatList = [];
	archiveList = [];
	archivesSynced = false;
	selectedConversation: any;
	onSearchInput = new Subject();
	activeTab: string = 'INBOX';
	loading = false;
	loadingCurrentConversations = true;
	src: string;
	public searchForm: FormGroup;
	numbersArray = Array(15).fill(0).map((x, i) => i);
	verified = true;
	forceSelected = '';
	filterDrawer = false;
	public filters: any = {};

	constructor(public _chatService: ChatService, private _authService: AuthService, formbuilder: FormBuilder, private _router: ActivatedRoute) {

		//console.log('Chat Side Bar Initialized');
		//  this._chatService.GetConverSations();
		this.subscriptions.push(this._router.params.subscribe(params => {
			if (params.id) {
				this.forceSelected = params.id;
			}
		}));

		this.searchForm = formbuilder.group({
			'searchValue': ['', []
			]
		});

		this.searchForm.get('searchValue').value;

		this.subscriptions.push(_chatService.GetAllConversations().subscribe(data => {

			// console.log("AllConversations",data);
			this.chatList = data;
			//console.log(this.forceSelected);
			if (this.forceSelected) {
				this._chatService.setCurrentConversation(this.forceSelected);
			}
		}));

		this.subscriptions.push(_chatService.getArchives().subscribe(archives => {
			this.archiveList = archives;
			// this._chatService.setActiveTab('INBOX')
			// console.log("archive length",this.archiveList.length);
		}));
		this.subscriptions.push(_chatService.Filters.subscribe(filters => {
			this.filters = filters;
			//  console.log(filters);
			// this._chatService.setActiveTab('INBOX')
			// console.log("archive length",this.archiveList.length);
		}));

		this.subscriptions.push(_chatService.getArchivesSynced().subscribe(synced => {
			this.archivesSynced = synced;
		}));

		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings && Object.keys(settings).length) this.verified = settings.verified;

		}));

		this.subscriptions.push(_chatService.getActiveTab().subscribe(value => {

			if (this.activeTab != value) this._chatService.currentConversation.next({})
			this.activeTab = value;
			if (!this.archivesSynced && this.activeTab == 'ARCHIVE') {

				_chatService.getArchivesFromBackend();
			}
		}));

		this.subscriptions.push(_chatService.getLoading('ARCHIVES').subscribe(data => {
			this.loading = data;
		}));

		this.subscriptions.push(_chatService.getLoading('CURRENTCONVERSATIONS').subscribe(data => {
			this.loadingCurrentConversations = data;
		}));

	}


	ngOnInit() {

	}

	FetchFilterd() {
		// this._chatService.Filters.next(this.ApplyFilter());

	}

	// ApplyFilter() {
	// 	let filters = {
	// 		tag: [],
	// 		agent: [],
	// 		daterange: {},
	// 	}
	// 	let matchObject: any = {};
	// 	Object.keys(filters).map(key => {
	// 		//console.log(key + ' ' + JSON.stringify(filters[key]));
	// 		if (filters[key]) {
	// 			if (Array.isArray(filters[key]) && filters[key].length) {
	// 				Object.assign(matchObject, { [key]: filters[key] });
	// 			} else if (!Array.isArray(filters[key]) && Object.keys(filters[key]).length) {
	// 				Object.assign(matchObject, { [key]: filters[key] });
	// 			}
	// 		}
	// 	});
	// 	//console.log(JSON.parse(JSON.stringify(matchObject)));
	// 	return { filter: matchObject}
	// }

	fetchCalled(data) {
		console.log(data);
		let matchObject: any = {};
		Object.keys(data.filters).map(key => {
			//console.log(key + ' ' + JSON.stringify(filters[key]));
			if (data.filters[key]) {
				if (Array.isArray(data.filters[key]) && data.filters[key].length) {
					Object.assign(matchObject, { [key]: data.filters[key] });
				} else if (!Array.isArray(data.filters[key]) && Object.keys(data.filters[key]).length) {
					Object.assign(matchObject, { [key]: data.filters[key] });
				}
			}
		});
		// console.log(matchObject);

		this._chatService.Filters.next({ filter: matchObject, userType: data.userType, sortBy: data.sortBy });

	}

	toggleFilterDrawer() {
		setTimeout(() => {
			this.filterDrawer = !this.filterDrawer;
			if (this.filterDrawer) {
				//console.log(this.filters);
			}
		}, 0);
	}


	ngOnDestroy() {
		//  console.log('Destroyed');
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	CloseFilter() {
		this.filterDrawer = false;
	}

}
