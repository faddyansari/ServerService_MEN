import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilityService } from '../../../services/UtilityServices/UtilityService';

@Component({
	selector: 'app-new-conversation-dialog',
	templateUrl: './new-conversation-dialog.component.html',
	styleUrls: ['./new-conversation-dialog.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NewConversationDialogComponent implements OnInit {

	agentList = [];
	agentList_original = [];
	subscriptions: Subscription[] = [];
	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	scrollHeight = 0;
	ended = false;
	loadingMoreAgents = false;
	searchForm: FormGroup;
	searchInput = new Subject();
	selectionCount = 0;
	groupEnabled = false;
	groupName = '';
	type = 'single';
	currentAgent: any;
	groupSubmitted = false;
	rand = ['#9BB4DD', '#6B9ED4', '#F58758', '#FACE63', '#55C4CC', '#F7C138', '#8580BC', '#7BB446', '#E24050', '#EC59AA', '#F2AEBB', '#01DD9F', '#7AEDDE', '#01D2E9', '#06A1E4', '#A7A9E2', '#A190D7', '#FF99CB', '#FF2D36', '#F19645', '#99CDFF', '#FB896E', '#33BFBE', '#1982C4', '#838DB0', '#50BF94', '#963FC1'];
	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _utilityService: UtilityService, formbuilder: FormBuilder) {
		this.currentAgent = data.email;
		this.type = data.type;
		this.subscriptions.push(_utilityService.getAllAgentsListObs().subscribe(agents => {
			this.agentList = agents;
			this.agentList_original = agents;
		}));
		this.searchForm = formbuilder.group({
			'searchValue': ['', []
			]
		});
		this.searchInput
			.map(event => event)
			.debounceTime(500)
			.switchMap(() => {
				return new Observable((observer) => {
					console.log('search');

					if (this.searchForm.get('searchValue').value) {
						let agents = this.agentList_original.filter(a => a.email.includes((this.searchForm.get('searchValue').value as string).toLowerCase()));
						this._utilityService.SearchAgent(this.searchForm.get('searchValue').value).subscribe((response) => {
							//console.log(response);
							if (response && response.agentList.length) {
								response.agentList.forEach(element => {
									if (!agents.filter(a => a.email == element.email).length) {
										agents.push(element);
									}
								});
							}
							this.agentList = agents;
						});
						// this.agentList = agents;
					} else {
						this.agentList = this.agentList_original;
						// this.setScrollEvent();
					}
				})
			}).subscribe();

	}

	ngOnInit() {
	}
	ngAfterViewInit() {
		// Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		if (this.scrollContainer) {
			this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
		}
	}

	// markSelected(email){
	// 	this.agentList.map(a => {
	// 		if(a.email == email){
	// 			a.selected = true;
	// 		}
	// 		return a;
	// 	});
	// }

	toggleSelected(agent) {
		if (!this.agentList.filter(a => a.email == agent.email).length) {
			this.agentList.unshift(agent);
		}
		switch (this.type) {

			case 'single':
				this.agentList.map(a => {
					if (a.email == agent.email) {
						a.selected = true
					} else {
						a.selected = false;
					}
					return a;
				});
				break;
			case 'group':
				this.agentList.map(a => {
					if (a.email == agent.email) {
						if (a.selected) {
							a.selected = false
						} else {
							a.selected = true;
						}
					}
					return a;
				});
				break;
			default:
				break;
		}

		// this.selectionCount = this.agentList.filter(a => a.selected).length;
		// if (this.selectionCount > 1) {
		// 	this.groupEnabled = true;
		// } else {
		// 	this.groupEnabled = false;
		// }
	}

	showList() {
		switch (this.type) {
			case 'single':
				return true;
			case 'group':
				return this.groupSubmitted;
		}
	}

	startChat() {
		let selectedAgents = [];
		this.agentList.filter(a => a.selected).forEach(agent => {
			let randomColor = this.rand[Math.floor(Math.random() * this.rand.length)];
			selectedAgents.push({
				email: agent.email,
				viewColor: randomColor,
				isAdmin: false
			})
		});
		selectedAgents.push({
			email: this.currentAgent,
			viewColor: this.rand[Math.floor(Math.random() * this.rand.length)],
			isAdmin: true
		});

		return {
			selectedAgents: selectedAgents,
			type: this.type,
			groupName: this.groupName
		}
	}

	ScrollChanged(event: UIEvent) {
		if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
			console.log('Fetch more agents');
			if (!this.ended && !this.loadingMoreAgents) {
				console.log('Fetch More');
				this.loadingMoreAgents = true;
				this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(response => {
					console.log(response);
					this.agentList = this.agentList.concat(response.agents);
					this.ended = response.ended;
					this.loadingMoreAgents = false;
				});
			}
			//   this._chatService.getMoreArchivesFromBackend();
		}
		this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
	}
	next() {
		this.groupSubmitted = true;
	}
	previous() {
		this.groupSubmitted = false;
	}

	showSubmit() {
		if (this.type == 'group') {
			return this.groupSubmitted;
		} else {
			return true;
		}
	}

	checkDisabled(): boolean {
		let selectedAgents = this.agentList.filter(a => a.selected);
		if (selectedAgents.length) {
			if (this.type == 'group') {
				if (!(selectedAgents.length > 0) || !this.groupName) {
					return true
				} else {
					return false;
				}
			} else {
				if (selectedAgents.length) {
					return false;
				} else {
					return true;
				}
			}
		} else {
			return true;
		}
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this._utilityService.Destroy();
	}

}
