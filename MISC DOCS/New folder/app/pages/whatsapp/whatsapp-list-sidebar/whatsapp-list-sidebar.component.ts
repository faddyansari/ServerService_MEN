import { Component, OnInit, ViewEncapsulation, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { WhatsappDialogComponent } from '../../../dialogs/whatsapp-dialog/whatsapp-dialog.component';

@Component({
	selector: 'app-whatsapp-list-sidebar',
	templateUrl: './whatsapp-list-sidebar.component.html',
	styleUrls: ['./whatsapp-list-sidebar.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsappListSidebarComponent implements OnInit {
	@Input('_contactsList') set _contactsList(value) {

		this.contactsList = value;
		this._changeDetector.detectChanges();

	}
	@Input() selectedContact = undefined;
	@Output() selectContact = new EventEmitter();
	@Output() GetMoreContacts = new EventEmitter();
	@Output() SearchValue = new EventEmitter();
	@Output() Edit = new EventEmitter();
	@Input() Loading = true;
	@Input() Initialized = false;
	@Input() Searching = false
	@Input('updatedContact') set UpdatedContact(value) {
		if (!value) return;
		// console.log('Updating IN List BAR', value)
		this.contactsList = this.contactsList.map(contact => {
			if (contact._id == value._id) {
				if (value.failed) {
					contact.customerName = this.editingStatus[value._id].contactCopy.customerName;
					contact.customerNo = this.editingStatus[value._id].contactCopy.customerNo;
				}
				else {
					contact.customerName = value.customerName;
					contact.customerNo = value.customerNo;
				}
			}
			return contact;
		})
		delete this.editingStatus[value._id];
		// console.log(this.editingStatus[value._id]);
		this._changeDetector.detectChanges();
	}
	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	contactsList = [];
	private subscriptions: Subscription[] = [];
	scrollHeight = 0;
	scrollTop = 0;
	scrollDbounce: Subject<any> = new Subject();
	editing = '';
	tempContact = undefined;
	// searching = false;



	editingStatus = {};

	public searchForm: FormGroup;

	constructor(formbuilder: FormBuilder, private dialog: MatDialog, private _changeDetector: ChangeDetectorRef) {

		this.searchForm = formbuilder.group({
			'searchValue': ['', []
			]
		});


		this.subscriptions.push(this.searchForm.get('searchValue').valueChanges.distinctUntilChanged().subscribe(value => {
			this.SearchValue.emit(value);
			// if (value && !this.Searching) this.Searching = true;
		}))

		this.subscriptions.push(this.scrollDbounce.debounceTime(1000).subscribe(data => {
			this.GetMoreContacts.emit(data);
		}));

		this.searchForm.get('searchValue').value;
	}

	SetSelectedContact(contactID, event: Event) {

		if ((!this.selectedContact) || (this.selectedContact && this.selectedContact._id != contactID)) {
			this.selectContact.emit({ contactID: contactID });
		}
	}

	ScrollChanged(event: UIEvent) {
		if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
			/**
			 * @Note Following condition is used to detect motion from top
			 * (this.scrollTop < (event.target as HTMLElement).scrollTop)
			 */
			if (this.contactsList.length && (this.scrollTop < (event.target as HTMLElement).scrollTop)) {
				this.scrollDbounce.next({ lastTouchedTime: this.contactsList[this.contactsList.length - 1].lastTouchedTime });
			}
		}
		this.scrollTop = (event.target as HTMLElement).scrollTop;
		this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
	}

	AddContact() {


		this.dialog.open(WhatsappDialogComponent, {
			panelClass: ['confirmation-dialog'],
			disableClose: true,
			data: {}
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
			}
		});
	}


	EditContact(contactID, editContact, event: Event) {
		// console.log(editContact);
		event.stopImmediatePropagation();
		event.stopPropagation();
		this.editingStatus[contactID] = {
			status: 'editing',
			contactCopy: JSON.parse(JSON.stringify(this.tempContact))
		};
		this.editing = '';
		this.tempContact = undefined;
		this.Edit.emit(JSON.parse(JSON.stringify(editContact)));

	}

	EnableEdit(contactID, contact, event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		this.ClearEdit();
		this.tempContact = JSON.parse(JSON.stringify(contact));
		this.editing = contactID;

	}

	PreventBubbling(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
	}

	ClearEdit(event?: Event) {
		// console.log('Clear Edit',this.tempContact);
		if (event) {

			event.stopImmediatePropagation();
			event.stopPropagation();
		}
		if (this.tempContact) {

			this.contactsList = this.contactsList.map(contact => {
				if (contact._id == this.tempContact._id) {
					contact.customerName = this.tempContact.customerName;
					contact.customerNo = this.tempContact.customerNo;
				}
				return contact;
			})
			this.editing = '';
			this.tempContact = undefined;
		}
	}




	ngOnInit() {
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.map(subscription => { subscription.unsubscribe(); });
	}

}
