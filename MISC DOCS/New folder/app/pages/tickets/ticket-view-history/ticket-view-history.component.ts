import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ticket-view-history',
  templateUrl: './ticket-view-history.component.html',
  styleUrls: ['./ticket-view-history.component.css'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketViewHistoryComponent implements OnInit {
  @Input('selectedThread') selectedThread: any;
  @Input('allActivatedPolicies') allActivatedPolicies = [];
  @Input('permissions') permissions: any;
  @Input('all_agents') all_agents = [];
  @Input('agentList_original') agentList_original = [];
  
  @Input('all_groups') all_groups = [];
  @Input('visitor_ticket_history') visitor_ticket_history: any;
  @Input('ended') ended = false;
  @Input('loadingMoreAgents') loadingMoreAgents = false;
  @Input('fields') fields = [];
  @Input('tagList') tagList = [];
  @Input('currAgent') currAgent = undefined;
  @Input('loadingReg') loadingReg = false;
  
  //OPEN/CLOSE DETAILS
  @Input('showFlyoutModel') showFlyoutModel;
  @Output('showFlyoutModelChange') showFlyoutModelChange = new EventEmitter<boolean>();
  
  //TICKET ACTION
  @Output('ticketStatus') ticketStatus = new EventEmitter();
  @Output('assignedAgent') assignedAgent = new EventEmitter();
  @Output('AssignedGroup') AssignedGroup = new EventEmitter();
  @Output('TagToAdd') TagToAdd = new EventEmitter();
  @Output('TagToDelete') TagToDelete = new EventEmitter();
  @Output('snoozeTime') snoozeTime = new EventEmitter();
  @Output('loadMore') loadMore = new EventEmitter();
  @Output('SearchAgents') SearchAgents = new EventEmitter();
  
  //NOTES
  @Output('ticketnote') ticketnote = new EventEmitter();
  @Output('deleteNote') deleteNote = new EventEmitter();
  
  //ICON REGISTRATION  
  @Input('loadingIconSearch') loadingIconSearch = false;
  @Input('searchedData') searchedData = [];
  @Input('countryName') countryName = '';

  
  @Output('iconRegistration') iconRegistration = new EventEmitter();
  @Output('iconSearchData') iconSearchData = new EventEmitter();
  @Input('agentName') agentName = '';


  //TASKS
  @Output('tasks') tasks = new EventEmitter();
  @Output('checkedTask') checkedTask = new EventEmitter();
  @Output('removeId') removeId = new EventEmitter();
  @Output('updateTask') updateTask = new EventEmitter();
  @Output('demergeInfo') demergeInfo = new EventEmitter();

  //HISTORY
  @Output('threadId') threadId = new EventEmitter();
  @Output('SaveCustomFields') SaveCustomFields = new EventEmitter();

  
  tabs = {
    "ticketDetail": true,
    "taskList": false,
    "editNote": false,
    "activityLog": false,
    "ticketHistory": false,
    "browsingHistory": false,
    "mergedTickets": false,
    "activatedPolicies": false,
    "iconRegistration":false,
    "searchIconCustomer":false
  }

  constructor(private cdRef: ChangeDetectorRef) {
  }
  ngOnInit() {
  }

  onEnter(task) {
    this.tasks.emit(task);
  }

  TaskDone(checkedTask) {
    this.checkedTask.emit(checkedTask);
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

  deleteTask(removeId) {
    this.removeId.emit(removeId)
  }

  editedTask(updatedTodo) {
    this.updateTask.emit(updatedTodo)
  }

  public CloseViewHistory() {
    this.showFlyoutModelChange.emit(!this.showFlyoutModel);
  }

  SaveNote(note) {
    this.ticketnote.emit(note);
  }
  DeleteNote(noteId) {
    this.deleteNote.emit(noteId);
  }

  SearchData(data){
    this.iconSearchData.emit(data)
  }

  vhListTabs(tabName) {

    Object.keys(this.tabs).map(k => {
      if (k == tabName) {
        this.tabs[k] = true
      } else {
        this.tabs[k] = false
      }
    });
  }

  AssignAgentForTicket(agent) {
    this.assignedAgent.emit(agent);
  }

  AssignGroup(group) {
    this.AssignedGroup.emit(group);
  }

  SetSelectedThread(id) {
    this.threadId.emit(id);
  }

  addTags(tags) {
    this.TagToAdd.emit(tags)
  }

  deleteTags(tag) {
    this.TagToDelete.emit(tag)
  }

  changeState(status) {
    this.ticketStatus.emit(status);
  }
  Snooze(time) {
    this.snoozeTime.emit(time);
  }

  Demerge(obj) {
    this.demergeInfo.emit(obj);
  }

  loadMoreAgent(agent) {
    this.loadMore.emit(agent);
  }

  SaveCustomField(event) {
		this.SaveCustomFields.emit(event);
	}

  OnSearchAgent(agent) {
    this.SearchAgents.emit(agent);
  }
  RegisterCustomer(data){
    this.iconRegistration.emit(data);
  }

}
