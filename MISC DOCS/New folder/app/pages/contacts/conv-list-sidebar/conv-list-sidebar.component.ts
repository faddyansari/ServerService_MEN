import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Contactservice } from '../../../../services/ContactService';
import { AuthService } from '../../../../services/AuthenticationService';

@Component({
	selector: 'app-conv-list-sidebar',
	templateUrl: './conv-list-sidebar.component.html',
	styleUrls: ['./conv-list-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConvListSidebarComponent implements OnInit {

	// the data structure used for view
	public agent: any;
	public contactList = [];
	public contactList_original = [];
	public conversationSearchForm: FormGroup;
	public subscriptions: Subscription[] = [];
	public loading = false;
	verified = true;
	selectedThread : any;
	conversationList = [];

	constructor(
		private _contactService: Contactservice,
		private formbuilder: FormBuilder,
		private _authService: AuthService
	) {
		this.subscriptions.push(_contactService.conversationList.subscribe(data => {
			this.conversationList = data;
		}));
		this.conversationSearchForm = formbuilder.group({
			'searchValue': ['', [],]
		});
		this.subscriptions.push(_authService.getAgent().subscribe(data => {
			this.agent = data;
		}))
		this.subscriptions.push(_contactService.selectedThread.subscribe(data => {
			this.selectedThread = data;
		}));
		this.subscriptions.push(_contactService.loadingContacts.subscribe(data => {
			this.loading = data;
		}));
		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings && Object.keys(settings).length) this.verified = settings.verified;

		}));
	}

	ngOnInit() {
	}

	setSelectedConversation(conversation) {
		// console.log(conversation);
		this._contactService.GetContactByEmail((conversation.to == this.agent.email) ? conversation.from : conversation.to);
		this._contactService.GetThreadByCid(conversation);
	}


}
