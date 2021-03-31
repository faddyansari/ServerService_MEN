import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { TicketsService } from '../../../services/TicketsService';
import { Subscription } from 'rxjs/Subscription';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-note',
	templateUrl: './quick-note.component.html',
	styleUrls: ['./quick-note.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class QuickNoteComponent {

	loading = false;
	ticketNote = '';
	buttonIsDisabled = true;
	editNote = false;
	shiftdown = false;
	public subscriptions: Subscription[] = [];
	public temp: any;

	config: any = {
		placeholder: 'Add Note..',
		toolbar: [
			['style', ['bold', 'italic', 'underline']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['fontName', ['fontName']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			['insert', ['linkDialogShow', 'unlink']],
			['view', ['fullscreen', 'codeview', 'undo', 'redo']]
		]
	};
	constructor(private _ticketService: TicketsService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<QuickNoteComponent>,
	) {
	}

	isNullOrWhiteSpace() {
		return !this.ticketNote.replace(/&nbsp;|<br>|<\/br>/g, ' ').trim();
	}


	keydownX(event: KeyboardEvent) {
		switch (event.key.toLowerCase()) {

			case 'shift':
				{
					this.shiftdown = true;
					break;
				}
		}
	}
	keyupX(event: KeyboardEvent) {

		switch (event.key.toLowerCase()) {
			case 'enter':
				{
					if (!this.shiftdown) {
						this.Save();
					}
					break;
				}
			case 'shift':
				{
					setTimeout(() => {
						this.shiftdown = false;
					}, 100);
					break;
				}
		}

	}

	Save() {
		// console.log(this.previousNote);
		// console.log(this.ticketNote);
		this.editNote = true;
		this._ticketService.editNote({ ticketNote: this.ticketNote }, this.data.details.map(e => e._id))
			.subscribe((response) => {

				if (response.status == 'ok') {
					// console.log(response);
					this.editNote = false;
					this.dialogRef.close({
						status: true,
						ticketids: this.data.details.map(e => e._id),
						updatedNote: response
					});
				}
			});
		// this.ticketNote= (this.previousNote) ? this.previousNote + this.ticketNote : this.ticketNote
		// console.log("after res" ,this.ticketNote);

		

	}
}

