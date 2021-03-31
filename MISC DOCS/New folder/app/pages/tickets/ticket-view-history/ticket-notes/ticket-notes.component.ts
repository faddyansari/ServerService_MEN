import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy, Output, EventEmitter, ViewChild } from '@angular/core';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { PopperContent } from 'ngx-popper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-ticket-notes',
	templateUrl: './ticket-notes.component.html',
	styleUrls: ['./ticket-notes.component.css'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketNotesComponent implements OnInit {
	enableAdd = false;
	@ViewChild('previewPopper') previewPopper: PopperContent
	index = '';
	ticketNote = '';
	previewNote: any;
	@Input('Ticketnotes') Ticketnotes: any = [];
	@Output('ticketnote') ticketnote = new EventEmitter();
	@Output('deleteNote') deleteNote = new EventEmitter();

	config: any = {
		placeholder: 'Add Note..',
		toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontname', ['fontname']],
			['table', ['table']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontstyle', ['backcolor']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			['insert', ['linkDialogShow', 'unlink']],
			['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]
		]
	}
	constructor(private sanitized: DomSanitizer) { }

	ngOnInit() {
	}
	AddNote() {
		this.enableAdd = true;
	}
	CancelNote() {
		this.enableAdd = false;
	}

	SaveNote() {
		// if (this.Ticketnotes && this.Ticketnotes.filter(data => data.ticketNote == this.ticketNote).length > 0) {
		// this.snackBar.openFromComponent(ToastNotifications, {
		//     data: {
		//         img: 'warning',
		//         msg: 'Note already exists!'
		//     },
		//     duration: 3000,
		//     panelClass: ['user-alert', 'error']
		// });
		// }
		this.ticketnote.emit(this.ticketNote);
		this.enableAdd = false;
		this.ticketNote = '';
	}

	isNullOrWhiteSpace() {
		return !this.ticketNote.replace(/&nbsp;|<br>|<\/br>/g, ' ').trim();
	}

	popperOnClick(data, index) {

		this.previewNote = this.sanitized.bypassSecurityTrustHtml(data);
		this.index = index;

	}
	ClosePopper() {
		this.previewPopper.hide();
	}
	DeleteNote(note) {
		this.deleteNote.emit({ id: note.id, note: note });
	}
}

