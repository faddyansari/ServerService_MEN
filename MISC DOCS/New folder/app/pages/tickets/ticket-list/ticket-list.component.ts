import { SLAPoliciesService } from './../../../../services/LocalServices/SLAPoliciesService';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { TicketsService } from '../../../../services/TicketsService';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { TagService } from '../../../../services/TagService';
import { AuthService } from '../../../../services/AuthenticationService';
import { MergeConfirmationComponent } from '../../../dialogs/merge-confirmation/merge-confirmation.component';
import { QuickNoteComponent } from '../../../dialogs/quick-note/quick-note.component';
import { ExportDataComponent } from '../../../dialogs/export-data/export-data.component';
import { TicketAutomationService } from '../../../../services/LocalServices/TicketAutomationService';
import { Observable } from 'rxjs/Observable';
import { PopperContent } from 'ngx-popper';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { ActivatedRoute } from '@angular/router';
import { TicketSecnarioAutomationService } from '../../../../services/LocalServices/TicketSecnarioAutomationService';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';
import { SlaExportComponent } from '../../../dialogs/sla-export/sla-export.component';


@Component({
	selector: 'app-ticket-list',
	templateUrl: './ticket-list.component.html',
	styleUrls: ['./ticket-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TicketListComponent implements OnInit {

	@ViewChild('priorityPopper') priorityPopper: PopperContent
	@ViewChild('statePopper') statePopper: PopperContent
	@ViewChild('tagAddPopper') tagAddPopper: PopperContent
	@ViewChild('groupPopper') groupPopper: PopperContent
	@ViewChild('agentPopper') agentPopper: PopperContent
	@ViewChild('viewStatePopper') viewStatePopper: PopperContent
	@ViewChild('scenarioPopper') scenarioPopper: PopperContent
	@ViewChild('watcherAddPopper') watcherAddPopper: PopperContent
	@ViewChild('checkboxes') checkboxes: ElementRef;
	@ViewChild('selectAllCheckboxes') selectAllCheckboxes: ElementRef;

	@ViewChild('myAgent') myAgent: ElementRef;
	@ViewChild('myTag') myTag: ElementRef;
	toggle = true;
	control = true;
	controlS = true;
	loadingMoreAgents = false;
	currAgent;
	public agent: any;
	UnreadIds = [];
	selectedAgent: any;
	selectedGroup: any;
	selectedWatcher = [];
	watcherFocused: any;
	exists = false;
	public selectedThread: any;
	public Tag: any
	tagInput = false;
	readTickets = false;
	showHideCheckbox = false;
	public server: string;
	agentList_original = [];

	public filterform: FormGroup;
	public priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
	public states = ['OPEN', 'PENDING', 'SOLVED', 'CLOSED'];
	MarkAsOptions = ['READ', 'UNREAD'];

	filteredOptions = [];
	filteredNotes = [];
	filteredWatchers = [];
	focusedTicket: any = undefined;
	all_agents = [];
	iDs = [];
	stateIds = [];
	scenarios = [];

	public subscriptions: Subscription[] = [];
	public ticketsList = [];

	public loadingMoreTickets = false;
	public filteredTicketList = [];
	Groups: any;
	checkedList: any = [];
	groups = [];
	watch_agents = [];
	public loadingTickets = true;
	public searchForm: FormGroup;
	public verified = true;
	drawerActive: boolean = false;
	drawerActive_exit: boolean = false;
	dropDownActive = false;
	selectedAll: any;
	public pageIndex = 0;
	public paginationLimit = 50;
	public ticketCount = 0;

	ended = false;
	endedAgents = false;
	searchInput = new Subject();
	fetchedCount: number;
	filterArea = true;
	endedWatchers = false;
	loadingMoreAgentsWatchers = false;
	goNext = false
	page2Tickets: any;
	permissions: any;
	forceSelected = '';
	allActivatedPolicies = [];
	policiesTicket: any;
	// newTickets = [];
	constructor(
		private _ticketService: TicketsService,
		private _authService: AuthService,
		private _utilityService: UtilityService,
		private _tagService: TagService,
		private snackBar: MatSnackBar,
		private _router: ActivatedRoute,
		public dialog: MatDialog,
		private _ticketAutoSvc: TicketAutomationService,
		formbuilder: FormBuilder,
		private _ticketScenarios: TicketSecnarioAutomationService,
		private _ticketAutomationService: TicketAutomationService,
		private _globalStateService: GlobalStateService,
		private _slaPolicySvc: SLAPoliciesService
	) {
		// ////console.log('Ticket List Component');
		this.subscriptions.push(this._router.params.subscribe(params => {
			if (params.id) {
				this.forceSelected = params.id;

			}

		}));
		this.subscriptions.push(this._ticketService.showFilterArea.subscribe(value => {
			//console.log('Loading', loading);

			this.filterArea = value;
		}))
		this.subscriptions.push(this._authService.getServer().subscribe(serverAddress => {
			this.server = serverAddress;
		}));
		this.subscriptions.push(this._ticketAutoSvc.Groups.subscribe(data => {
			this.groups = data;
		}));

		this.subscriptions.push(this._slaPolicySvc.AllInternalSLAPolicies.subscribe(data => {
			if (data && data.length) {

				data.map(policy => {
					if (policy.activated) {
						this.allActivatedPolicies.push(policy);
					}
				});
			}

		}));
		this.subscriptions.push(this._ticketService.getloadingTickets('MORETICKETS').debounceTime(300).subscribe(loading => {
			// console.log('Loading More Tickets ', loading);

			this.loadingMoreTickets = loading;
		}))
		this.subscriptions.push(this._ticketService.getloadingTickets('TICKETS').debounceTime(300).subscribe(loading => {
			// console.log('Loading Tickets ', loading);
			this.loadingTickets = loading;
		}));
		// this.subscriptions.push(this._ticketService.newTickets.subscribe(value => {
		// 	this.newTickets = value;
		// }));

		this.subscriptions.push(_authService.getAgent().subscribe(data => {
			this.currAgent = data;
		}));

		this.subscriptions.push(this._ticketScenarios.AllScenarios.subscribe(data => {
			if (data && data.length) {
				let agents = [];
				data.map(res => {
					if (res.availableFor == "allagents") {
						this.scenarios.push(res)
					}
					else if (res.availableFor == this.currAgent.email) {
						this.scenarios.push(res);
					}
					else {
						//see for agent in group from groups defined in groupNames..
						let filteredagent = this.groups.filter(g => res.groupName.includes(g.group_name)).map(g => g.agent_list);

						filteredagent.map(g => {
							g.map(agent => {
								if (agent.email == this.currAgent.email) {
									agents.push(agent.email);
								}
							});
						});
						if (agents && agents.length) {
							this.scenarios.push(res);
						}
					}

				})
			}

		}));

		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			// //console.log(data);
			if (data && data.permissions) {
				this.permissions = data.permissions.tickets;
				// if (this.permissions.canView == 'all') {
				// 	this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
				// 		// this.agentList = agents;
				// 		if (agents && agents.length) {
				// 			this.all_agents = agents;
				// 			this.watch_agents = agents;
				// 		}

				// 		this.agentList_original = agents;
				// 	}));
				// } else if (this.permissions.canView == 'group') {
				// 	if (this.currAgent) {
				// 		this.subscriptions.push(this._utilityService.getAgentsAgainstGroup(this.currAgent.groups).subscribe(agents => {
				// 			// console.log(agents);
				// 			if (agents) {
				// 				this.all_agents = agents;
				// 			}
				// 			this.agentList_original = agents;
				// 		}));
				// 	}
				// } else if (this.permissions.canView == 'team') {
				// 	if (this.currAgent) {
				// 		// console.log(this.currAgent.teams);

				// 		this.subscriptions.push(this._ticketService.getAgentsAgainstTeams((this.currAgent.teams) ? this.currAgent.teams : []).subscribe(agents => {
				// 			// console.log('Getting agents agains teams');
				// 			// console.log(agents);

				// 			if (agents) {
				// 				this.all_agents = (agents as Array<any>).filter(a => !a.excluded);
				// 			}
				// 			this.agentList_original = (agents as Array<any>).filter(a => !a.excluded);
				// 		}));
				// 	}
				// }
			}
		}));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
			// this.agentList = agents;
			if (agents && agents.length) {
				this.all_agents = agents;
				this.watch_agents = agents;
			}

			this.agentList_original = agents;
		}));



		this.filterform = formbuilder.group({
			'assigned_to': [null],
			'priority': [null],
			'tags': [null]
		});

		this.searchForm = formbuilder.group({
			'searchValue': ['', []
			]
		});

		//#region Subscriptions

		this.subscriptions.push(this._ticketService.getPagination().subscribe(pagination => {
			this.pageIndex = pagination;
			//console.log(pagination);

		}));

		this.subscriptions.push(this._ticketService.getTickets().debounceTime(300).subscribe(ticketList => {
			this.ticketsList = ticketList;
			if (this.filteredTicketList.length && this.selectedThread) {
				let itemIndex = this.filteredTicketList.findIndex(ticket => ticket._id == this.selectedThread._id);
				this.filteredTicketList[itemIndex] = this.selectedThread;
			}
			// setTimeout(() => {
			// 	this.loading = false;
			// }, 0);
		}));

		// this.subscriptions.push(this._ticketService.getloadingTickets('TICKETS').subscribe(loading => {
		// 	this.loadingTickets = loading;

		// 	console.log("this.loadingTickets", loading);

		// }));


		this.subscriptions.push(_ticketService.getTicketsCount().subscribe(count => {
			this.ticketCount = 0;
			count.map(countWRTState => {
				this.ticketCount += countWRTState.count
			});
		}));

		this.subscriptions.push(_globalStateService.drawerActive.subscribe(data => {
			this.drawerActive = data;
		}));

		this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(res => {
			this.Groups = res;
		}));


		this.subscriptions.push(_globalStateService.drawerActive_exit.subscribe(data => {
			this.drawerActive_exit = data;

		}));


		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings) this.verified = settings.verified;
		}));


		this.subscriptions.push(this._ticketService.getNotification().subscribe(notification => {
			if (notification) {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: notification.img,
						msg: notification.msg
					},
					duration: 3000,
					panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
				}).afterDismissed().subscribe(() => {
					_ticketService.clearNotification();
				});
			}
		}));
		this.subscriptions.push(_tagService.Tag.subscribe(data => {
			this.Tag = data;
		}));


		this.subscriptions.push(this._authService.getAgent().subscribe(data => {
			this.agent = data;
		}));

		this.subscriptions.push(this._ticketService.ActualTicketFetchedCount.subscribe(data => {
			this.fetchedCount = data;
			//console.log(this.fetchedCount);

		}));

		this.searchInput.debounceTime(500)
			.distinctUntilChanged()
			.switchMap((term) => {
				return new Observable((observer) => {
					if (term) {
						let agents = this.agentList_original.filter(a => a.email.includes((term as string).toLowerCase() || a.first_name.toLowerCase().includes((term as string).toLowerCase())));
						this._utilityService.SearchAgent(term).subscribe((response) => {
							////console.log(response);
							if (response && response.agentList.length) {
								response.agentList.forEach(element => {
									if (!agents.filter(a => a.email == element.email).length) {
										agents.push(element);
									}
								});
							}
							this.all_agents = agents;
							this.watch_agents = agents;
						});
						// this.agentList = agents;
					} else {
						this.all_agents = this.agentList_original;
						this.watch_agents = this.agentList_original;
						// this.setScrollEvent();
					}
				})
			}).subscribe();
		//#endregion

	}

	//#region Page LifeCycle Hooks
	ngOnInit() {
		if (this.forceSelected) {
			//console.log(this.forceSelected)
			// this._globalStateService.NavigateTo('/tickets/ticket-view/'+this.forceSelected);
		}
	}

	//#region Abstract Actions
	popperOnHidden(event: Event) {

		this.focusedTicket = undefined;
		this.filteredOptions = [];
		//console.log('HIdden');

	}
	//#endregion

	//#region Priority Menu Actions

	UpdatePriority(value) {
		if (this.permissions.canSetPriority) {
			this.iDs = !((this.focusedTicket) && (this.focusedTicket.id || this.focusedTicket._id)) ? this.checkedList.map(e => e._id) : [this.focusedTicket.id || this.focusedTicket._id];

			this._ticketService.updatePriority(this.iDs, value);
		} else {
			this._ticketService.setNotification('Permissions revoked!', 'error', 'warning');
		}
		this.priorityPopper.hide();
	}

	TestTicket() {
		let ticket = {
			type: 'email',
			subject: 'HELLO SUBJECT',
			nsp: '/localhost.com',
			priority: 'LOW',
			state: 'OPEN',
			datetime: new Date().toISOString(),
			from: 'hello@gmail.com',
			visitor: {
				name: 'Bill Gates',
				email: 'xyz@yahoo.com'
			},
			lasttouchedTime: new Date().toISOString(),
			viewState: 'UNREAD',
			createdBy: 'Agent',
			agentName: 'left@hotmail.com',
			ticketlog: [],
			mergedTicketIds: [],
			viewColor: 'blue',
			group: "Test Group",
			source: 'panel',
			slaPolicyEnabled: true
		};
		// console.log(ticket);

		this._ticketService.InsertNewTicket(ticket).subscribe(data => {
			// console.log("data", data);

		});
	}

	onShownPriority(event: Event, ticket: any) {
		// console.log('On Shown', ticket);
		setTimeout(() => {
			this.focusedTicket = ticket;
			this.filteredOptions = this.priorityOptions.filter(priority => { return !(ticket.priority == priority) });
		}, 0);

	}
	popperOnUpdatePriority(event: Event) {
		//Todo Logic
	}


	onSearch(value) {
		// console.log('Search');
		// console.log(value);
		if (value) {
			let agents = this.agentList_original.filter(a => a.email.includes((value as string).toLowerCase()));
			this._utilityService.SearchAgent(value).subscribe((response) => {
				//console.log(response);
				if (response && response.agentList.length) {
					response.agentList.forEach(element => {
						if (!agents.filter(a => a.email == element.email).length) {
							agents.push(element);
						}
					});
				}
				this.all_agents = agents;
			});

			// this.agentList = agents;
		} else {
			this.all_agents = this.agentList_original;
			this.endedAgents = true;
			// this.setScrollEvent();
		}
	}

	toggleFilters() {
		this._ticketService.toggleFilterArea();
		// this.filterArea = !this.filterArea;
	}
	//#endregion


	//#region State Menu Action

	UpdateState(option) {
		if (this.permissions.canChangeState) {

			this.stateIds = !((this.focusedTicket) && (this.focusedTicket.id || this.focusedTicket._id)) ? this.checkedList.map(e => e._id) : [this.focusedTicket.id || this.focusedTicket._id];
			// console.log(this.stateIds);
			// console.log(this.stateIds);

			this._ticketService.SetState(this.stateIds, option).subscribe(response => {
				this.checkedList = [];
				let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
				selectall[0].checked = false;
				let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
				elements.forEach(element => {
					if (element.checked) {
						element.checked = false
					}
				});
				this._ticketService.RefreshList();

			}, err => {
				this.checkedList = [];
				let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
				elements.forEach(element => {
					if (element.checked) {
						element.checked = false
					}
				});
			});
		} else {
			this._ticketService.setNotification('Permissions revoked!', 'error', 'warning');
		}

		this.statePopper.hide();

	}

	popperStateShow(event: Event, ticket?: any) {
		// console.log('Ticket State Show', ticket);
		if (ticket) {
			setTimeout(() => {
				this.focusedTicket = ticket;
				this.filteredOptions = this.states.filter(state => { return !(ticket.state == state) });
			}, 0);
		} else {
			this.filteredOptions = this.states;
		}

	}

	popperStateUpdate(event: Event) {
		//console.log('Update State Popper', event);
	}


	//#endregion


	//#region Group Menu Actions
	UpdateGroup(option: string, single = false) {
		if (this.permissions.canAssignGroup) {
			this.iDs = (single) ? [this.focusedTicket._id] : this.checkedList.map(e => e._id);
			// console.log(this.iDs);

			this._ticketService.updateGroup(this.iDs, option, (single) ? this.focusedTicket.group : '').subscribe(res => {

				this.selectedGroup = '';
				this.checkedList = [];
				let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
				let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
				selectall[0].checked = false;
				elements.forEach(element => {
					if (element.checked) {
						element.checked = false
					}
				});
			});

		} else {
			this._ticketService.setNotification('Permissions revoked!', 'error', 'warning');
		}
		this.groupPopper.hide();
	}
	ClosePopper() {
		this.watcherAddPopper.hide();
	}
	AddWatchers(ev) {
		this.selectedWatcher = ev;

		let ids = this.checkedList.map(e => e._id);

		this._ticketService.AddWatchersToTicket(this.selectedWatcher, ids).subscribe(res => {
			if (res.status == "ok") {
				this.checkedList = [];
				this.selectedWatcher = [];
				let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
				let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
				selectall[0].checked = false;
				elements.forEach(element => {
					if (element.checked) {
						element.checked = false
					}
				});
			}

		});
	}

	//ticket list > watchers work:
	loadMoreWatchers(event) {
		if (!this.endedWatchers && !this.endedWatchers && this.selectedWatcher && !this.selectedWatcher.length) {
			//console.log('Fetch More');
			this.loadingMoreAgentsWatchers = true;
			this._utilityService.getMoreAgentsObs(this.watch_agents[this.watch_agents.length - 1].first_name).subscribe(response => {
				//console.log(response);
				this.watch_agents = this.watch_agents.concat(response.agents);
				this.endedWatchers = response.ended;
				this.loadingMoreAgentsWatchers = false;
			});
		}
	}
	onSearchWatchers(value) {
		// console.log('Search');
		if (value) {
			if (this.selectedWatcher && !this.selectedWatcher.length) {
				let agents = this.watch_agents.filter(a => a.email.includes((value as string).toLowerCase()));
				this._utilityService.SearchAgent(value).subscribe((response) => {
					//console.log(response);
					if (response && response.agentList.length) {
						response.agentList.forEach(element => {
							if (!agents.filter(a => a.email == element.email).length) {
								agents.push(element);
							}
						});
					}
					this.watch_agents = agents;
				});
			} else {
				let agents = this.watch_agents.filter(a => a.email.includes((value as string).toLowerCase()));
				this.watch_agents = agents;
			}
			// this.agentList = agents;
		} else {
			console.log(this.agentList_original);

			this.watch_agents = this.agentList_original;
			this.ended = false;
			// this.setScrollEvent();
		}
	}

	// refreshList(){
	// 	this._ticketService.InitializeTicketList(this._ticketService.Filters.getValue(), true);
	// }

	UpdateViewState(viewState) {
		let ids = this.checkedList.map(e => e._id);
		if (this.checkedList.every(a => a.viewState.toUpperCase() == viewState.toUpperCase())) {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Ticket(s) are already ' + viewState
				},
				duration: 2000,
				panelClass: ['user-alert', 'warning']
			});
		}
		else {
			this._ticketService.updateViewState(viewState, ids).subscribe(response => {
				if (response) {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Ticket(s) Marked As ' + viewState + ' Successfully!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'success']
					});
				}
			});
		}

		this.checkedList = [];
		let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
		let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
		selectall[0].checked = false;
		elements.forEach(element => {
			if (element.checked) {
				element.checked = false
			}
		});
		this.viewStatePopper.hide()
	}

	ExecuteScenario(scenario) {
		let iDs = this.checkedList.map(e => e._id);
		this._ticketService.ExecuteScenario(scenario, iDs, this.checkedList).subscribe(res => {
			if (res) {
				//Clear checklist
				this.checkedList = [];
				let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
				selectall[0].checked = false;
				let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
				elements.forEach(element => {
					if (element.checked) {
						element.checked = false
					}
				});
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Scenario executed successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
			}
			else {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'warning',
						msg: 'Error in executing scenario'
					},
					duration: 2000,
					panelClass: ['user-alert', 'warning']
				});
			}
			this.scenarioPopper.hide();
		})
	}

	FilterGroup(ticket) {
		if (!ticket.group) {
			this.filteredOptions = this.Groups.map(element => {
				return element.group_name
			});
		}
		else {
			let notMatched = this.Groups.filter(data => data.group_name != ticket.group);
			////console.log(notMatched);
			this.filteredOptions = notMatched.map(elements => {
				return elements.group_name;
			});
		}

	}

	FilterAgent(ticket) {
		let agentList = [];
		if (ticket.group) {
			// console.log(this.Groups);
			let groups = this.Groups.filter(g => g.group_name == ticket.group);
			if (groups && groups.length) {
				// //console.log(groups[0].agent_list.map(a => a.email));
				if (groups[0].agent_list.filter(a => a.email == this.currAgent.email && a.isAdmin).length) {
					agentList = groups[0].agent_list.map(a => a.email);
				} else {
					agentList = groups[0].agent_list.filter(a => !a.excluded).map(a => a.email);
				}
			}
		}
		return agentList;
	}

	popperGroupShow(event: Event, ticket: any) {
		setTimeout(() => {
			this.focusedTicket = ticket;
			this.ticketsList.forEach(element => {
				if (element._id == ticket._id) {
					this.FilterGroup(element);
					if (ticket.group) {
						this.FilterAgent(ticket);
					}
				}
			});

		}, 0);

	}

	popperGroupUpdate(event: Event) {

	}



	//#endregion

	//#region Popper Agent

	public UpdateAgent(assigningAgent: string, single = false) {
		if (this.permissions.canAssignAgent) {
			this.iDs = (single) ? [this.focusedTicket._id] : this.checkedList.map(e => e._id);
			this._ticketService.assignAgentForTicket(this.iDs, assigningAgent, (single) ? this.focusedTicket.assigned_to : '').subscribe(response => {

				this.checkedList = [];
				this.selectedAgent = undefined;
				this.selectedAgent = '';
				assigningAgent = '';
				let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
				let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
				selectall[0].checked = false;
				elements.forEach(element => {
					if (element.checked) {
						element.checked = false
					}
				});
			})
			// this._ticketService.RefreshList();
		} else {
			this._ticketService.setNotification('Permissions revoked!', 'error', 'warning');
		}
		this.agentPopper.hide();
	}

	//select-single
	onCheckboxChange(checkedDetails, event) {
		let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");


		//for splicing
		let index = this.checkedList.findIndex(x => x._id == checkedDetails._id);
		// if (this.ticketsList.length - 50 == this.checkedList.length) {
		// 	selectall[0].checked = true;
		// }
		//if checked
		if (event.target.checked) {
			checkedDetails.selected = true;
			this.checkedList.push(checkedDetails);
			if (this.ticketsList.length == ((this.pageIndex + 1) * this.checkedList.length)) {
				selectall[0].checked = true;
			}
		}
		//if unchecked
		else if (!event.target.checked) {
			checkedDetails.selected = false;
			selectall[0].checked = false;
			this.checkedList.splice(index, 1);
		}
	}

	//select-All
	selectAll(event) {
		this.checkedList = [];
		let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");

		// console.log("select all");
		if (event.target.checked) {
			// this.ticketsList.forEach(ticket => {
			// 	ticket.selected = true;
			// })
			if (this.goNext) {
				this.checkedList = this.page2Tickets;
			}
			else {
				let copyOfTickets = Array.from(this.ticketsList);
				this.checkedList = copyOfTickets;
			}

			let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
			elements.forEach(element => {
				element.checked = true;
			});
		}
		else if (!event.target.checked) {
			this.ticketsList.forEach(ticket => {
				ticket.selected = false;
			})
			let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
			elements.forEach(element => {
				element.checked = false;
			});
		}
	}

	popperAgentShow(event: Event, ticket: any) {
		setTimeout(() => {
			this.focusedTicket = ticket;
			this.ticketsList.forEach(element => {
				if (element._id == ticket._id) {
					if (this.permissions.canView != 'team') {
						if (ticket.group) {
							// console.log(ticket.group);
							this.filteredOptions = this.FilterAgent(ticket);
						} else {
							this._utilityService.getAllAgentsListObs().subscribe(agents => {
								agents.map(agent => this.filteredOptions.push(agent.email));
							});
						}
					} else {
						this.filteredOptions = this.agentList_original.map(a => a.email);
					}
				}
			});

		}, 0);

	}
	popperNoteShow(event: Event, ticket: any) {
		setTimeout(() => {
			let notes = [];
			if (ticket.ticketNotes && ticket.ticketNotes.length) {
				notes = ticket.ticketNotes;
			}
			this.filteredNotes = notes;
		}, 0);
	}
	popperAgentUpdate(event: Event) {

	}

	onDeSelect(event) {
		this.selectedWatcher = event;
	}

	//#endregion



	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	//#endregion


	//#region Support Functions

	/**
	 * @NOTE : OLD CODE REMOVE
	 */
	public FilterTicketToView(ticketsList: Array<any>) {

		/**
		 * CONDTIONS:
		 * OPEN,PENDING,SOLVED: not merged ticket ids length and state not closed.
		 * MERGED: merged ticket ids length and state not closed.
		 * CLOSED: state closed.
		 */
		if (ticketsList && ticketsList.length) {
			return ticketsList.filter((tick, index) => (index >= (this.pageIndex * this.paginationLimit)) && (index < (this.pageIndex * this.paginationLimit) + this.paginationLimit));

		}
	}

	ToggleAgent() {
		this.control = !this.control;
	}

	ToggleState() {
		this.controlS = !this.controlS;
	}

	onScroll($event) {
		//console.log('Scroll');
		if (!this.ended) {
			//console.log('Fetch More');
			this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(response => {
				//console.log(response);
				this.all_agents = this.all_agents.concat(response.agents);
				this.ended = response.ended;
			});
		}
	}

	ShowHideCheckbox() {
		this.showHideCheckbox = !this.showHideCheckbox;
		this.checkedList = [];
		let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");

		elements.forEach(element => {
			if (element.checked) {
				element.checked = false
			}
		});
	}

	MarkRead() {
		let ReadIds = this.checkedList.map(e => e._id);
		if (this.checkedList.every(a => a.viewState == 'READ')) {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Ticket(s) are already Read!'
				},
				duration: 2000,
				panelClass: ['user-alert', 'warning']
			});
		}
		else {
			this._ticketService.updateViewState('READ', ReadIds).subscribe(response => {
				if (response) {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Ticket(s) Marked As Read Successfully!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'success']
					});
				}
			});
		}

		this.checkedList = [];
		ReadIds = [];
		let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
		let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
		selectall[0].checked = false;
		elements.forEach(element => {
			if (element.checked) {
				element.checked = false
			}
		});
	}

	//Go To TicketView
	public setSelectedThread(id: string) {
		// this._ticketService.setSelectedThread(id);
		this._globalStateService.NavigateForce('/tickets/ticket-view/' + id);
	}

	public getNext() {
		this.checkedList = [];
		this.goNext = true;
		this.ticketsList.forEach(ticket => {
			ticket.selected = false;
		})
		let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
		selectall[0].checked = false;

		let loadMore = false;
		if (this.loadingMoreTickets) return;

		if ((this.pageIndex + 1) <= this.ticketCount / this.paginationLimit) {
			if (this.fetchedCount <= ((this.pageIndex + 1) * this.paginationLimit)) loadMore = true; //(50 <= ((1) * 50))
			if (loadMore) this.loadingMoreTickets = true;
			let diff = (this._ticketService.ThreadList.getValue().length - this.fetchedCount) // (50 - 50) diff = 0
			let a = (diff / this.paginationLimit); // a = (0 / 50)
			if (a >= 1) loadMore = false;
			if (!loadMore) this._ticketService.setPagination(this.pageIndex + 1);
		}
		if (loadMore) {
			this.subscriptions.push(this._ticketService.getMoreTicketFromBackend().subscribe(response => {
				if (response.status == 'ok') {
					this.page2Tickets = response.tick;
					this._ticketService.setPagination(this.pageIndex + 1);
				}
			}, err => { }));
		}

	}

	public getPrevious() {
		this.checkedList = [];
		let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
		selectall[0].checked = false;

		this.ticketsList.forEach(ticket => {
			ticket.selected = false;
		})
		if (this.pageIndex > 0) this.pageIndex -= 1;
	}

	StopPropagation(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
	}

	//loadMore custom-select
	loadMoreAgents(event) {

		if (!this.endedAgents && !this.loadingMoreAgents && this.selectedAgent && !this.selectedAgent.length) {
			this.loadingMoreAgents = true;
			this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(response => {
				this.all_agents = this.all_agents.concat(response.agents);
				this.endedAgents = response.ended;
				this.loadingMoreAgents = false;
			});
		}
	}

	ShowMergeDialogBox() {

		this._globalStateService.drawerActive.next(false);
		this.dialog.open(MergeConfirmationComponent, {
			panelClass: ['responsive-dialog'],
			disableClose: true,
			autoFocus: true,
			data: this.checkedList
		}).afterClosed().subscribe(data => {
			if (data.status == "ok") {
				this.checkedList = [];
				let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
				selectall[0].checked = false;
				let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");

				elements.forEach(element => {
					if (element.checked) {
						element.checked = false;
					}
				});
			}
			else {
				return;
			}
		});

	}
	gotoScenario() {
		this._globalStateService.NavigateForce('/settings/ticket-management/scenario-automation');
	}
	ShowExportTicketDialog() {
		this._globalStateService.drawerActive.next(false);
		this.dialog.open(ExportDataComponent, {
			panelClass: ['responsive-dialog'],
			disableClose: true,
			autoFocus: true,
			data: this.checkedList
		}).afterClosed().subscribe(data => {
			this.checkedList = [];
			let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
			selectall[0].checked = false;
			let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");

			elements.forEach(element => {
				if (element.checked) {
					element.checked = false
				}
			});
		});
	}

	ShowQuickNoteDialogBox() {
		this._globalStateService.drawerActive.next(false);
		this.dialog.open(QuickNoteComponent, {
			panelClass: ['quick-note'],
			disableClose: false,
			autoFocus: true,
			data: {
				details: this.checkedList,
			}
		}).afterClosed().subscribe(data => {
			this.checkedList = [];
			let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
			selectall[0].checked = false;
			let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
			elements.forEach(element => {
				if (element.checked) {
					element.checked = false
				}
			});
		});
	}

	displaySource(source) {
		switch (source) {
			case 'email':
				return { name: 'Email', img: 'email-colored' }
			case 'livechat':
				return { name: 'Live Chat', img: 'visitors-colored' }
			case 'panel':
				return { name: 'Beelinks Portal', img: 'agents-colored' }
			default:
				return { name: 'N/A', img: 'agents' }
		}
	}

	ngAfterViewInit() {
		if (this.forceSelected) {
			this.setSelectedThread(this.forceSelected);
		}
	}

	ngAfterViewChecked() {

		//Called after every check of the component's view. Applies to components only.
		//Add 'implements AfterViewChecked' to the class.

	}
	//#endregion


	//#region Watchers
	popperWatcherShow(event: Event, ticket: any) {

		setTimeout(() => {
			this.watcherFocused = ticket;
			let watch = [];
			if (ticket.watchers && ticket.watchers.length) {
				watch = ticket.watchers;
			}
			this.filteredWatchers = watch;
		}, 0);
	}

	deleteWatcher(watcher) {
		this._ticketService.DeleteWatcherAgent(watcher, this.watcherFocused._id);
	}
	//#endregion

	//#region Policies
	ShowTime() {
		let time = '';
		this.allActivatedPolicies.map(single => {
			single.policyTarget.map(res => {
				if (this.policiesTicket && res.priority == this.policiesTicket.priority) {
					time = res.TimeKey + ' ' + res.TimeVal;
				}
			})
		})
		return time;
	}

	popperPoliciesShow(event: Event, ticket: any) {
		setTimeout(() => {
			this.policiesTicket = ticket;
		}, 0);
	}

	//#endregion

	ShowSLAExportTicketDialog() {
		this._globalStateService.drawerActive.next(false);
		this.dialog.open(SlaExportComponent, {
			panelClass: ['responsive-dialog'],
			disableClose: true,
			autoFocus: true,
			data: this.checkedList
		}).afterClosed().subscribe(data => {
			this.checkedList = [];
			let selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
			selectall[0].checked = false;
			let elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");

			elements.forEach(element => {
				if (element.checked) {
					element.checked = false
				}
			});
		});
	}

	seeCMID(ticket) {
		let res = ticket.subject.split('/');
		if (res && res.length) {
			if (res[4] && res[4].trim() == 'Beelinks' && ticket.CustomerInfo && ticket.CustomerInfo.customerId) {
				
				if (res[2] && res[2].toString().trim() == ticket.CustomerInfo.customerId.toString().trim()) {
					return false
				}
				else return true
			}
		}
		else return false
	}

	SendABC() {
		this._ticketService.sendemailtousers();
	}
	SendCC() {
		this._ticketService.sendemailtoCC();

	}
	SendGHI() {
		this._ticketService.sendemailtoagentss();
	}

	Response() {
		this._ticketService.sendreponse();
	}
}
