import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/AuthenticationService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CRMService } from '../../../../services/crmService';
import 'rxjs/add/operator/switchMap';

declare var $: any;

@Component({
	selector: 'app-crm-list',
	templateUrl: './crm-list.component.html',
	styleUrls: ['./crm-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CrmListComponent implements OnInit, AfterViewInit, AfterViewChecked {
	scrollHeight = 0;
	@ViewChild('scrollContainer') ScrollContainer: ElementRef;

	customerList: Array<any> = [];
	public coustomerList_original = [];
	filteredcustomerList: Array<any> = [];
	private loadingAgents: BehaviorSubject<boolean> = new BehaviorSubject(true);
	Agent: any;
	subscriptions: Subscription[] = [];
	forceSelected = '';
	selectedCustomer: any;
	sortBy = '';
	activeCount = 0;
	idleCount = 0;
	offlineCount = 0;
	expandAddAgent = false;
	searchText = '';
	numbersArray = Array(15).fill(0).map((x, i) => i);
	autoscroll = false;
	agentConversations = [];
	public selectedCustomerConversation: any;
	public searchForm: FormGroup;
	public onSearchInput = new Subject();
	public isSelfViewingChat: any;
	verified = true;
	fetchMoreEnabled = true;
	filterDrawer = false;


	loadingMoreCustomers = true;
	loadingCustomers = false;
	noMoreCustomers: boolean;

	constructor(
		private _authService: AuthService,
		private _appStateService: GlobalStateService,
		private _crmService: CRMService,
		private _router: ActivatedRoute,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		formbuilder: FormBuilder
	) {
		this.searchForm = formbuilder.group({
			'searchValue': ['', []
			]
		});

		this.subscriptions.push(this._router.params.subscribe(params => {
			if (params.id) {
				this.forceSelected = params.id;
			}
		}));

		this.subscriptions.push(this._authService.getAgent().subscribe(data => {
			this.Agent = data;
		}));

		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			//console.log(settings)
			if (settings && Object.keys(settings).length) this.verified = settings.verified;
		}));


		this.subscriptions.push(this._crmService.getAllCustomersList().subscribe(data => {
			if (data && data.length > 0) {
				this.customerList = data;
				this.coustomerList_original = data;
			}
		}));

		this.subscriptions.push(this._crmService.getSelectedCustomer().subscribe(data => {
			if (data) this.selectedCustomer = data;
		}));


		this.subscriptions.push(this._crmService.noMoreCustomersToFetch.subscribe(data => {

			this.noMoreCustomers = data;
		}));


		this.subscriptions.push(_crmService.selectedCustomerConversation.subscribe(data => {
			if (data) this.selectedCustomerConversation = data;
		}));

		this.subscriptions.push(_crmService.loadingMoreCustomers.subscribe(data => {		
			this.loadingMoreCustomers = data;
			this.fetchMoreEnabled = !data
		}));
		this.subscriptions.push(_crmService.getLoadingVariable().subscribe(data => {
			this.loadingCustomers = data;
			this.fetchMoreEnabled = !data
		}));

		this.onSearchInput
			.map(event => event)
			.debounceTime(2000)
			.switchMap(() => {
				// console.log("Searching...");
				return new Observable((observer) => {
					let searchvalue = this.searchForm.get("searchValue").value;
					if (searchvalue) {
						this.fetchMoreEnabled = false;
						
						let customers = this.coustomerList_original.filter(a => a.email.includes(searchvalue.toLowerCase() || a.username.toLowerCase().includes(searchvalue.toLowerCase())));
						this._crmService.SearchVisitor(searchvalue).subscribe((response) => {

							if (response && response.customerList.length) {
								response.customerList.forEach(element => {
									if (!this.customerList.filter(a => a.deviceID == element.deviceID).length) {


										this.customerList.push(element);
									}
								});
							}
							this.customerList = customers;
						});
						this.customerList = customers;
					} else {
						this.fetchMoreEnabled = true;
						this.customerList = this.coustomerList_original;
						// this.setScrollEvent();
					}
				});
			}).subscribe();

	}

	ngOnInit() {
	}


	ScrollChanged(event: UIEvent) {
		if (this.verified) {
			//this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
			if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.ScrollContainer.nativeElement.scrollHeight - 10)){
			// if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.ScrollContainer.nativeElement.scrollHeight)) {

				if (this.searchForm.get("searchValue").value) {

					this._crmService.SearchVisitor(this.searchForm.get("searchValue").value, (this.customerList.length) ? this.customerList[this.customerList.length - 1]._id : '').subscribe((response) => {

						if (response && response.customerList.length) {
							response.customerList.forEach(element => {
								if (!this.customerList.filter(a => a.deviceID == element.deviceID).length) {


									this.customerList.push(element);
								}
							});
						}
					});
				}
				if (this.fetchMoreEnabled && !this.loadingMoreCustomers && !this.noMoreCustomers) {
					this.loadingMoreCustomers = true
					this.fetchMoreEnabled = false
					this._crmService.getMoreCustomersFromBackend(this.customerList[this.customerList.length - 1]._id);
				}
			}
			setTimeout(() => {
			this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
			}, 0);
		}


	}

	public updateControlSideBar() {
		this._appStateService
			.ToggleControlSideBarState();
	}

	toggleFilterDrawer() {
		this.filterDrawer = !this.filterDrawer;
	}

	ngAfterViewInit() {
		this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
	}
	setScrollEvent() {
	}


	ngAfterViewChecked() {
	// 	//Called after every check of the component's view. Applies to components only.
	// 	//Add 'implements AfterViewChecked' to the class.
	// 	if (this.loadingMoreCustomers && !this.fetchMoreEnabled && !this.noMoreCustomers) {
	// 		this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight + 20
	// 	}
	}



	public SortBy(customerList: any[]) {

		if (this.customerList.length > 0) {
			if (!this.sortBy) {
				return this.customerList;
			} else {
				return this.customerList.filter(customer => {
					if (this.sortBy == 'conv') {
						return (customer.convoLength);
					}
				});
			}
		} else {
			return [];
		}

	}

	setFilter(filter: string) {
		this.sortBy = filter;
	}

	public setSelectedCustomer(deviceid: string) {
		//if (deviceid != this.selectedCustomer.deviceID) this._crmService.viewingConversation.next(false);
		if (deviceid) {
			if (deviceid != this.selectedCustomer.deviceID) {
				this._crmService.viewingConversation.next(false);
				this._crmService.setSelectedCustomer(deviceid);
				if (!this.selectedCustomer.conversationsFetched) this.selectedCustomer.conversationsFetched = false;
				if (!this.selectedCustomer.conversationsFetched && !this.selectedCustomer.conversations) {

					this._crmService.getConversationsList(deviceid).subscribe(conversations => {
						// console.log(conversations);

						if (conversations) {

							this.selectedCustomer.conversations = conversations
							this.selectedCustomer.conversationsFetched = true;
							this._crmService.ExtractSessionInfo();
							this._crmService.UpdateCustomer(this.selectedCustomer)

						}


					}, err => {

						this._crmService.setSelectedCustomer(deviceid);
						this._crmService.selectedCustomerConversation.next({});
					});
				}
				else { //console.log("already added list");
				}
			}
		}
	}


	ngOnDestroy() {
		// Called once, before the instance is destroyed.
		// Add 'implements OnDestroy' to the class.
		this._appStateService.showAgentModal(false);
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

}
