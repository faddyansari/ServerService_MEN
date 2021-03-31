import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatBotService } from '../../../../../../services/ChatBotService'
import { MatDialog } from '@angular/material/dialog';
import { AddActionsDialogComponent } from '../../../../../dialogs/add-actions-dialog/add-actions-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-dp-actions',
	templateUrl: './dp-actions.component.html',
	styleUrls: ['./dp-actions.component.css'],
	encapsulation: ViewEncapsulation.None,
})

export class DpActionsComponent implements OnInit {

	ActionForm: FormGroup;
	subscriptions: Subscription[] = [];
	action_list = [];
	showActionForm = false;

	constructor(public snackBar: MatSnackBar, private dialog: MatDialog,formbuilder: FormBuilder,  private BotService:ChatBotService) {
		this.ActionForm = formbuilder.group({
			'action_name': [null, Validators.required],
			'endpoint_url':[null, Validators.required],
			'template' : [null, Validators.required]
		});

		this.subscriptions.push(BotService.getActions().subscribe(data => {
			this.action_list = data;
		}));
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

	AddActions(){
		this.dialog.open(AddActionsDialogComponent, {
			disableClose: true
		}).afterClosed().subscribe(response=>{
			if(response.data){
				this.BotService.AddAction(response.data.action_name, response.data.endpoint_url, response.data.template).subscribe(resp=>{
				//console.log(resp);
				if (resp.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
					  img: 'ok',
					  msg: 'Action added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				  });
				}

				});
			}
		});
	}

	toggleActionForm() {
		this.showActionForm = !this.showActionForm;
	}

	deleteAction(actions, index){
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure to delete " + actions.action_name + " ?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this.BotService.deleteAction(actions._id, index);
			}
		});
	}

}
