import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDatePickerConfig, ISelectionEvent } from 'ng2-date-picker';
import { TicketsService } from '../../../../../services/TicketsService';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-ticket-actions',
	templateUrl: './ticket-actions.component.html',
	styleUrls: ['./ticket-actions.component.css'],
	encapsulation: ViewEncapsulation.None,
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketActionsComponent implements OnInit {
	@Input('permissions') permissions: any;
	private _selectedThread: any;
	tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
	@Input() set selectedThread(value) {
		this._selectedThread = value;
		this.selectedStatus = '';
		this.selectedGroup = this._selectedThread && this._selectedThread.group ? this._selectedThread.group : '';
		this.selectedAgent = this._selectedThread && this._selectedThread.assigned_to ? [this._selectedThread.assigned_to] : [];

		this.snooze_time = this._selectedThread && this._selectedThread.snoozes && this._selectedThread.snoozes.snooze_time ? this._selectedThread.snoozes.snooze_time : '';
	};
	get selectedThread(): any {
		return this._selectedThread;
	}
	// @Input('tagsFromBackend') tagsFromBackend: any;

	private _all_agents = [];
	@Input() set all_agents(value) {
		this._all_agents = value;
	}
	get all_agents() {
		return this._all_agents;
	}
	@Input('agentList_original') agentList_original = [];
	@Input('ended') ended = false;
	@Input('loadingMoreAgents') loadingMoreAgents = false;
	@Input('all_groups') all_groups = [];
	@Input('fields') fields = [];
	@Input('tagList') tagList = [];

	@Output('status') status = new EventEmitter();
	@Output('TagToAdd') TagToAdd = new EventEmitter();
	@Output('TagToDelete') TagToDelete = new EventEmitter();
	@Output('assignedAgent') assignedAgent = new EventEmitter();
	@Output('assignedGroup') assignedGroup = new EventEmitter();
	@Output('snoozeTime') snoozeTime = new EventEmitter();
	@Output('loadMoreArg') loadMoreArg = new EventEmitter();
	@Output('SearchAgents') SearchAgents = new EventEmitter();
	@Output('SaveCustomFields') SaveCustomFields = new EventEmitter();

	public tagForm: FormGroup;
	subscriptions: Subscription[] = [];
	datePickerConfig: IDatePickerConfig = {
		format: 'MM-DD-YYYY HH:mm',
		unSelectOnClick: false,
		closeOnSelect: true,
		hideInputContainer: false,
		hideOnOutsideClick: true,
		showGoToCurrent: true
	}
	selectedStatus = '';
	selectedGroup = '';
	selectedAgent = [];
	snooze_time = '';
	savingCustomFields = {

	};
	selectedThread_copy: any;
	constructor(private formbuilder: FormBuilder, private _ticketService: TicketsService, private snackBar: MatSnackBar) {
		this.tagForm = formbuilder.group({
			'hashTag':
				[
					'',
					[
						Validators.required,
						Validators.maxLength(32),
						Validators.pattern(this.tagPattern)
					],
				]
		});
	}

	ngOnInit() {
		this.selectedStatus = '';
		this.selectedGroup = this.selectedThread && this.selectedThread.group ? this.selectedThread.group : '';
		this.selectedAgent = this.selectedThread && this.selectedThread.assigned_to ? [this.selectedThread.assigned_to] : [];
		// console.log(this.selectedAgent);
		this.snooze_time = this.selectedThread && this.selectedThread.snoozes && this.selectedThread.snoozes.snooze_time ? this.selectedThread.snoozes.snooze_time : '';
	}
	private minimumsnoozeTime
	public minimumSnoozeTimeError = false;
	DateSelected(event: ISelectionEvent) {
		//Write Any Transforming Logic
		this.minimumSnoozeTimeError = false;
		this.minimumsnoozeTime = new Date(new Date(this.selectedThread && this.selectedThread.datetime).setMinutes(new Date().getMinutes() + 20)).toISOString();


		if (!!event.date.valueOf() && new Date(event.date.valueOf() as number).toISOString() < this.minimumsnoozeTime) {
			this.minimumSnoozeTimeError = true;
		}
	}

	changeStatus(state) {

		this.status.emit(state);
		this.selectedStatus = '';
	}

	selectTag(event) {
		if (event.target && event.target.value) {
			let intersection;
				let hashTag = event.target.value;
				if (!this.tagPattern.test(hashTag)) {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'warning',
							msg: 'Invalid tag!'
						},
						duration: 3000,
						panelClass: ['user-alert', 'warning']
					});
					this.tagForm.reset();
					return;
				}
				if (this.selectedThread.tags && this.selectedThread.tags.length && this.selectedThread.tags.length >= 6) {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: '/warning',
							msg: 'Maximum tags limit reached!'
						},
						duration: 3000,
						panelClass: ['user-alert', 'warning']
					});
					this.tagForm.reset();
					return;
				}
				let commaseparatedTags = this.RemoveDuplicateTags((hashTag as string).split(','));
				if(this.selectedThread && this.selectedThread.tags && this.selectedThread.tags.length) {
					intersection = commaseparatedTags.filter(element => !this.selectedThread.tags.includes(element));
			
					if (intersection && intersection.length) {
						this.TagToAdd.emit(intersection);
						this.tagForm.reset();
					}
					else {
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'warning',
								msg: 'Tag already added'
							},
							duration: 5000,
							panelClass: ['user-alert', 'warning']
						});
						this.tagForm.reset();
					}
				}
				else{
					this.TagToAdd.emit(commaseparatedTags);
					this.tagForm.reset();
				}
			
			
		}
		//if custom writing is not allowed : if (this.tagList.indexOf(event.target.value) !== -1)
	}

	RemoveDuplicateTags(array) {

		let arr = {};
		array.map(value => { if (value.trim()) arr[value] = value.trim() });
		return Object.keys(arr);

	}

	DeleteTag(tag,i) {
		this.selectedThread.tags.splice(i,1)
		this.TagToDelete.emit(tag);
	}

	AssignAgentForTicket(selectedAgent) {
		// console.log(selectedAgent);

		this.assignedAgent.emit(selectedAgent);
	}

	AssignGroupForTicket(selectedGroup) {
		this.assignedGroup.emit(selectedGroup);
	}

	Snooze(time) {
		this.snoozeTime.emit(time);
	}

	loadMore(event) {
		console.log('Load More!');
		this.loadMoreArg.emit(this.all_agents[this.all_agents.length - 1].first_name);
	}

	onSearch(value) {
		console.log('Search Agents');
		if (value) {
			// console.log(value);
			this.SearchAgents.emit(value);
		} else {
			this.all_agents = this.agentList_original;
		}
	}

	SaveCustomField(threadID, fieldName, fieldvalue) {
		console.log('Save custom fields!');

		this.savingCustomFields[fieldName] = true;
		// console.log(fieldName, fieldvalue);

		// this.selectedThread_copy.dynamicFields[fieldName] = fieldvalue;
		// console.log(this.selectedThread_copy[fieldName]);
		this.SaveCustomFields.emit({threadID: threadID, fieldName:fieldName, fieldvalue:fieldvalue});
		this.savingCustomFields[fieldName] = false;

	}

	getAgentsForSelectedGroup() {
		console.log(this.selectedGroup);

	}

}
