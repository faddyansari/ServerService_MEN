import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketsService } from '../../../services/TicketsService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../services/AuthenticationService';

@Component({
	selector: 'app-quick-reply',
	templateUrl: './quick-reply.component.html',
	styleUrls: ['./quick-reply.component.scss']
})
export class QuickReplyComponent {
	shiftdown = false;
	msgBody = '';
	agent: any = {};
	subscriptions: Subscription[] = [];
	ticketViewState: any;
	loading: false;
	idsArray = [];
	// ThreadList:any;

	config: any = {
		placeholder: 'Reply to this ticket..',
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
		private dialogRef: MatDialogRef<QuickReplyComponent>,
		private _authService: AuthService,
	) {
		//console.log(data);

		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			this.agent = agent;
		}));

		

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
						this.SendTicketMessage();
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

	SendTicketMessage() {
		this.data.details.map(id => {
			this.idsArray.push(id._id);
		})
		//console.log(this.idsArray);

		if (this.msgBody.trim()) {
			// for (let i = 0; i < this.idsArray.length; i++) {
				// this._ticketService.ReplyTicketFromList({
				// 	senderType: 'Agent',
				// 	message: this.msgBody,
				// 	from: this.agent.email,
				// 	// to: this.data.details[i].visitor.email,
				// 	to:this.data.details[0].visitor.email,
				// 	// tid: [this.idsArray[i]],
				// 	tid: this.data.details[0]._id,
				// 	// subject: this.data.details[i].subject,
				// 	subject: this.data.details[0].subject,
				// 	attachment:[]
				// });
				this.msgBody = '';
			}
		// }
		this.dialogRef.close({
			status: true
		});

	}
}
