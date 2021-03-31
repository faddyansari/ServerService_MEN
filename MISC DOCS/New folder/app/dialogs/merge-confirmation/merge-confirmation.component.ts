import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/AuthenticationService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketsService } from '../../../services/TicketsService';

@Component({
	selector: 'app-merge-confirmation',
	templateUrl: './merge-confirmation.component.html',
	styleUrls: ['./merge-confirmation.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MergeConfirmationComponent {
	arr = [];
	checkedList_original: any = [];
	mergeTicketIds: any = [];
	checkedList: any = [];
	public loading = false;
	public mergeRegForm: FormGroup;
	submitError = true;

	constructor(public _authService: AuthService,

		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<MergeConfirmationComponent>,
		private _ticketService: TicketsService,
	) {

		this.checkedList_original = data;
		this.mergeTicketIds = this.checkedList_original.map(e => e._id);

		// console.log(this.mergeTicketIds);

		this.checkedList = data.map(d => {
			return {
				details: d,
				_id: d._id,
				subject: d.subject,
				checked: false
			}
		});


	}


	setPrimaryTicket(id, event) {
		this.checkedList.map(element => {
			if (element._id == id) {
				return element.checked = event.target.checked;
			} else {
				return element.checked = false;
			}
		});
		if (!this.checkedList.filter(d => d.checked).length) {
			this.submitError = true;
		} else {
			this.submitError = false;
		}
		// console.log(this.submitError);
	}
	// console.log(id);
	// console.log(event);

	// if (event.target.checked) {

	// 	this.checkedList.push(id);
	// 	console.log(this.checkedList);
	// }
	// else if(!event.target.checked){
	// 	this.checkedList.splice(index1, 1);
	// 	console.log(this.checkedList);

	// }


	submitForm() {
		let secondaryTicketDetails = [];
		let secondaryTicketReference = [];
		let mergedTicketsDetails = [];
		let primaryReference = '';
		this.checkedList.map(d => {
			// mergedTicketsDetails = mergedTicketsDetails.concat(d.details);
			// console.log(mergedTicketsDetails);
			if (!d.checked) {
				secondaryTicketReference.push(d._id);
				secondaryTicketDetails.push({
					_id: d.details._id,
					viewColor: d.details.viewColor,
					subject: d.details.subject,
					assigned_to: (d.details.assigned) ? d.details.assigned : '',
					visitor: d.details.visitor
				})
			} else {
				primaryReference = d._id
			}
			mergedTicketsDetails = mergedTicketsDetails.concat(d.details);

		});
		//console.log(this.checkedList);

		// let primaryReference = this.checkedList.filter(d => { return (d.checked) })[0]._id;;

		this.loading = false;

		this._ticketService.TicketMerge({ merged: true, mergedTicketIds: this.mergeTicketIds }, primaryReference, secondaryTicketDetails, mergedTicketsDetails, secondaryTicketReference).subscribe(res => {
			this.loading = false;
			if (res.status == 'ok') {
				this.dialogRef.close({
					status: 'ok',
					primayTicket: res.primayTicket,
					secondaryTicket: res.secondaryTicket
				});
			} else if (res.status == 'error') {
				this.dialogRef.close({
					status: 'error',
					ticket: '',
				});
			}

		})

	}


}

