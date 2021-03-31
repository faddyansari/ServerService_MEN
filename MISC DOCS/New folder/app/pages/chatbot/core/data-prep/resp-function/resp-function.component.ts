import { Component, OnInit, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { ChatBotService } from '../../../../../../services/ChatBotService';
declare var window: Window;

@Component({
	selector: 'app-resp-function',
	templateUrl: './resp-function.component.html',
	styleUrls: ['./resp-function.component.css'],
	encapsulation: ViewEncapsulation.None,
})
export class RespFunctionComponent implements OnInit {
  
	resp_func_list = [];
	add = false;
	respID;
	ResponseForm: FormGroup;
	RespFunctionForm: FormGroup;
	subscriptions: Subscription[] = [];
	response_list=[];
	updatedResponse = '';
	updatedRespFunc = '';
	responseSelected = false;
	showResponseForm = false;
	showRespFunctionForm = false;
	selectedResponseFuncID = '';

 	constructor(formbuilder: FormBuilder, private dialog: MatDialog, private BotService:ChatBotService) { 

		this.RespFunctionForm = formbuilder.group({
			'func_name': [null, Validators.required]
		})
		this.ResponseForm = formbuilder.group({
			'response': [null, Validators.required]
		})

		this.subscriptions.push(BotService.getRespFunc().subscribe(data => {
		this.resp_func_list = data;
		}));
		
		this.subscriptions.push(BotService.getResponse().subscribe(data => {
		this.response_list = data;
		}));
	}

	ngOnInit() {
	}


	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
		subscription.unsubscribe();
		})
	}


	AddRespFunc(name) {
		this.BotService.addRespFunc(name);
		this.RespFunctionForm.reset();
	}

	editRespFunc(resp_func) {
		this.updatedRespFunc = '';
		this.resp_func_list.map(i => {
			if (i._id == resp_func._id) {
			i.editable = true;
			this.updatedRespFunc = i.func_name;
			return i;
			}
		})
	}

	cancelEdit(resp_func) {
		this.resp_func_list.map(i => {
			if (i._id == resp_func._id) {
			i.editable = false;
			return i;
			}
		})
	}

	updateRespFunc(resp_func) {
		resp_func.editable = false;
		this.BotService.updateRespFunc(resp_func._id,this.updatedRespFunc);
		this.updatedRespFunc = '';
	}

	deleteRespFunc(resp_func, index) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure to delete " + resp_func.func_name + " ?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
			this.BotService.deleteRespFunc(resp_func._id,index);  
			}
		});
	}

	toggleRespFunctionForm() {
		this.showRespFunctionForm = !this.showRespFunctionForm;
	}

	togglesResponseForm() {
		this.showResponseForm = !this.showResponseForm;
	}

	showResponses(resp_func) {
		this.selectedResponseFuncID = resp_func._id;
		this.BotService.getResponses(resp_func._id);
		this.respID = resp_func._id;
		this.resp_func_list.map(i => {
			if (i._id == resp_func._id) {
			i.responses = true;
			this.responseSelected = true;
			return i;
			}
			i.responses = false;
		});
	}

	AddResponse(response, id) {
		this.BotService.addResponse(response,id);
		this.ResponseForm.reset();
	}

	editResponse(response) {
		this.updatedResponse= '';
		this.response_list.map(i => {
			if (i.id == response.id) {
			this.updatedResponse = i.text;
			i.editable = true;
			return i;
			}
		})
	}

	cancelEditResp(response) {
		this.response_list.map(i => {
			if (i.id == response.id) {
			i.editable = false;
			return i;
			}
		})
	}

	updateResponse(response) {	
		response.editable =false;
		this.BotService.updateResponse(response, this.updatedResponse, this.respID );
		this.updatedResponse = '';
	}

	deleteResponse(response, index){
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure to delete " + response.text + " ?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this.BotService.deleteResponse(response.id, this.respID, index);
			}
		});
	}

}
