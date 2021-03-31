import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';

@Component({
	selector: 'app-whatsapp-history',
	templateUrl: './whatsapp-history.component.html',
	styleUrls: ['./whatsapp-history.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class WhatsappHistoryComponent implements OnInit {

	contact = undefined;

	@Output() GetAttachments = new EventEmitter();
	@Output() GetMoreAttachments = new EventEmitter()
	@Input('_contact') set _contact(value) {

		this.contact = value;
		if (value) {

			if (!value.attachments) { value.attachments = {}; this.contact = value; }

			if (this.tabs['whatsapp_media'] && !this.contact.attachments.media) { this.GetAttachments.emit({ _id: value._id, type: '1' }) }

			if (this.tabs['whatsapp_files'] && !this.contact.attachments.files) { this.GetAttachments.emit({ _id: value._id, type: '4' }) }

			if (this.tabs['whatsapp_status']) { }

			if (this.tabs['whatsapp_stories']) { }
		}
		// console.log('Contact Attachments : ', value);

	}

	tabs = {
		'whatsapp_media': true,
		'whatsapp_status': false,
		'whatsapp_stories': false
	}
	constructor(public _utilityService: UtilityService) { }

	ngOnInit() {
	}

	GetAttachmentsForView() {
		if (this.tabs['whatsapp_media']) {
			// console.log('Media :', this.contact.attachments.media);
			if (this.contact.attachments.media) return this.contact.attachments.media;
			else return [];
		}

		if (this.tabs['whatsapp_files']) {
			// console.log('Files : ', this.contact.attachments.files);
			if (this.contact.attachments.files) return this.contact.attachments.files;
			else return [];
		}
	}

	vhListTabs(tab) {
		Object.keys(this.tabs).map(key => {
			if (key == tab) {
				this.tabs[key] = true
				switch (tab) {
					case 'whatsapp_media':

						if (!this.contact.attachments.media) {
							// console.log('Get Emitting Media');
							this.GetAttachments.emit({ _id: this.contact._id, type: '1' })
						}
						break;
					default:
						if (!this.contact.attachments.files) {
							// console.log('Get Emitting FIles');
							this.GetAttachments.emit({ _id: this.contact._id, type: '4' })
						}
						break;
				}
			}
			else {
				this.tabs[key] = false
			}
		})
	}

}
