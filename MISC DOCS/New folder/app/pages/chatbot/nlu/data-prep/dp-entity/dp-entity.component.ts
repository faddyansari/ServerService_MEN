import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatBotService } from '../../../../../../services/ChatBotService'
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-dp-entity',
	templateUrl: './dp-entity.component.html',
	styleUrls: ['./dp-entity.component.css'],
	encapsulation: ViewEncapsulation.None
})

export class DpEntityComponent implements OnInit {

	EntityForm: FormGroup;
	subscriptions: Subscription[] = [];
	entity_list = [];
	t_phrase_list = [];
	slot_list = [];
	entityId = 0;
	updatedEntity = '';
	showEntityForm = false;

	constructor(formbuilder: FormBuilder, private dialog: MatDialog, private BotService: ChatBotService) {
		this.EntityForm = formbuilder.group({
			'entity_name': [null, Validators.required]
		});
		this.subscriptions.push(BotService.getEntity().subscribe(data => {
			this.entity_list = data;
			// this.list=data;

		}));
		this.subscriptions.push(BotService.getTPhrase().subscribe(data => {
			this.t_phrase_list = data;
		}));
	}

	ngOnInit() {
		this.slot_list.push(
			{
				id: this.slot_list.length + 1,
				value: 'text'
			},
			{
				id: this.slot_list.length + 1,
				value: 'bool'
			},
			{
				id: this.slot_list.length + 1,
				value: 'categorical'
			},
			{
				id: this.slot_list.length + 1,
				value: 'float'
			},
			{
				id: this.slot_list.length + 1,
				value: 'list'
			},
			{
				id: this.slot_list.length + 1,
				value: 'unfeaturized'
			},
			{
				id: this.slot_list.length + 1,
				value: 'Not Used'
			}
		)
	}

	ngOnDestroy() {
		// Called once, before the instance is destroyed.
		// Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	
	}
	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	AddEntity(name) {
		let color = this.getRandomColor();
		let slot_type = "";
		this.BotService.addEntity(name, slot_type, color);
		this.EntityForm.reset();
	}


	selectSlotType(entity, event) {		
	this.BotService.selSlotType(entity, event.target.value);
	}

	toggleEntityForm() {
		this.showEntityForm = !this.showEntityForm;
	}

	editEntity(entity) {
		this.updatedEntity= '';
		this.entity_list.map(i => {
			if (i._id == entity._id) {
				this.updatedEntity = i.entity_name;
				i.editable = true;
				return i;
			}
		})
	}

	updateEntity(entity) {	
		entity.editable =false;
		this.BotService.updateEntity(entity, this.updatedEntity);
		this.updatedEntity = '';
		// this.BotService.updateEntityList(this.entity_list);
		// this.BotService.updateTPhraseList(this.t_phrase_list);
	}

	cancelEdit(entity) {
		this.entity_list.map(i => {
			if (i.id == entity.id) {
				i.editable = false;
				return i;
			}
		})
	}

	deleteEntity(entity, index) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure to delete " + entity.entity_name + " ?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this.entity_list.splice(index, 1);
				this.BotService.deleteEntity(entity._id);
			}
			// this.BotService.updateEntityList(this.entity_list);
		});

	}


}
