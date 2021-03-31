import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Contactservice } from '../../../../services/ContactService';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../../../../services/AuthenticationService';
//Change to Native Scrolling;
import { Subject } from 'rxjs/Subject';
import { AdminSettingsService } from '../../../../services/adminSettingsService';
import 'rxjs/add/operator/switchMap';

@Component({
	selector: 'app-contact-list-sidebar',
	templateUrl: './contact-list-sidebar.component.html',
	styleUrls: ['./contact-list-sidebar.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ContactListSidebarComponent implements OnInit {

	// the data structure used for view
	public agent: any;
	public contactList = [];
	public contactList_original = [];
	public contactSearchForm: FormGroup;
	public onSearchInput = new Subject();
	public contactSettings: any;

	public subscriptions: Subscription[] = [];
	public selectedContact: any;
	sortBy = 'ALL';
	fetchMoreEnabled = true;

	public loading = false;
	verified = true;

	//Scrolling
	scrollHeight = 0;
	scrollTop: number = 10;

	constructor(
		private _contactService: Contactservice,
		private formbuilder: FormBuilder,
		private _authService: AuthService,
		private _settings: AdminSettingsService
	) {

		this.contactSearchForm = formbuilder.group({
			'searchValue': ['', [],]
		});
		this.subscriptions.push(_authService.getAgent().subscribe(data => {
			this.agent = data;
		}))
		this.subscriptions.push(_settings.contactSettings.subscribe(data => {
			this.contactSettings = data;
		}))

		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings && Object.keys(settings).length) this.verified = settings.verified;

		}));

		this.subscriptions.push(_contactService.contactsList.subscribe(list => {
			this.contactList = list;
			this.contactList_original = list;
			// this.lastContactId = (this.contactList.length) ? this.contactList[this.contactList.length - 1]._id : '0';
			this.contactList.map(contact => {
				if (contact.email == this.agent.email) {
					return contact.status = true;
				}
			});
			
		}))
		this.subscriptions.push(_contactService.selectedContact.subscribe(contact => {
			this.selectedContact = contact;
		}));
		this.subscriptions.push(_contactService.sortBy.subscribe(data => {
			this.sortBy = data;
		}));
		this.subscriptions.push(_contactService.loadingContacts.subscribe(data => {
			this.loading = data;
		}));



		//Contact Search
		const onsearchinput = this.onSearchInput
		.map(event => event)
		.debounceTime(2000)
		.switchMap(() => {
			//console.log("Searching...");
			return new Observable((observer) => {
				let searchvalue = this.contactSearchForm.get("searchValue").value;
				if (searchvalue) {
					this.fetchMoreEnabled = false;
					let contacts = this.contactList_original.filter(a => a.email.includes(searchvalue.toLowerCase() || a.name.toLowerCase().includes(searchvalue.toLowerCase())));
					this._contactService.SearchContact(searchvalue).subscribe((response) => {
						//console.log(response);
						if (response && response.contactList.length) {
							response.contactList.forEach(element => {
								if(!contacts.filter(a => a.email == element.email).length){
									contacts.push(element);
								}
							});
						} 
						this.contactList = contacts;
					});
					this.contactList = contacts;
				} else {
					this.fetchMoreEnabled = true;
					this.contactList = this.contactList_original;
					// this.setScrollEvent();
				}
			});
		}).subscribe();
	}

	ngOnInit() {

	}

	ngAfterViewInit() {
		this.setScrollEvent();
	}

	public SortBy(contactList: any[]) {

		if (this.contactList.length > 0) {
			if (this.sortBy == 'ALL') {
				return this.contactList;
			} else {
				return this.contactList.filter(contact => {
					if (this.sortBy == 'ONLINE') {
						return (contact.status == true);
					} else if (this.sortBy == 'OFFLINE') {
						return (contact.status == false);
					}
				});
			}
		} else {
			return [];
		}

	}
	setSelectedContact(contactid: string) {
		this._contactService.setSelectedContact(contactid);
		this._contactService.selectedThread.next(undefined);
		// this.contactSearchForm.get('searchValue').setValue("");
	}


	// Toggle all checkboxes on togglling master
	ngOnDestroy() {
		// Called once, before the instance is destroyed.
		// Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach((subscription: Subscription) => {
			subscription.unsubscribe();
		});
		// this._visitorService.Destroy()
	}

	setScrollEvent() {
		// setTimeout(() => {
			
		// }, 1000);
		// if (this.scrollRef) {
		// 	this.scrollRef.scrollState
		// 		.debounceTime(100)
		// 		.subscribe(data => {
		// 			this.scrollTop = this.scrollRef.view.scrollTop;
		// 			if (this.scrollTop + this.scrollRef.view.offsetHeight > this.scrollRef.view.scrollHeight) {
		// 				//console.log('fetch more contacts');
		// 				if(this.contactSearchForm.get("searchValue").value){
		// 					this._contactService.SearchContact(this.contactSearchForm.get("searchValue").value, this.contactList[this.contactList.length - 1].name).subscribe((response) => {
		// 						// console.log(response);
		// 						if (response && response.contactList.length) {
		// 							response.contactList.forEach(element => {
		// 								if(!this.contactList.filter(a => a.email == element.email).length){
		// 									this.contactList.push(element);
		// 								}
		// 							});
		// 						} 
		// 					});
		// 				}
		// 				if (!(this.contactList as any).ended && this.fetchMoreEnabled) {
		// 					this._contactService.RetrieveContacts(this.contactList[this.contactList.length - 1].name, this.sortBy);
		// 				}
		// 			}
		// 		});
		// }
	}
}
