import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AgentService } from '../../../../services/AgentService';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/AuthenticationService';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';

@Component({
    selector: 'app-agent-list-sidebar',
    templateUrl: './agent-list-sidebar.component.html',
    styleUrls: ['./agent-list-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AgentListSidebarComponent implements OnInit {

    searchValue: string;
    @ViewChild('scrollContainer') scrollContainer: ElementRef;
    scrollHeight = 0;
    loadingMoreAgents = false;
    agentList: Array<any> = [];
    agentList_original: Array<any> = [];
    Agent: any;
    subscriptions: Subscription[] = [];
    forceSelected = '';
    selectedAgent: any;
    sortBy = '';
    activeCount = 0;
    idleCount = 0;
    offlineCount = 0;
    expandAddAgent = false;
    //To Show Requesting Status
    loading = false;
    numbersArray = Array(15).fill(0).map((x, i) => i);

    agentConversations = [];
    public selectedAgentConversation: any;
    public onSearchInput = new Subject();
    public isSelfViewingChat: any;
    verified = true;
    showAgentInfo = false;
    fetchMoreEnabled = true;

    constructor(
        private _authService: AuthService,
        private _appStateService: GlobalStateService,
        private _agentService: AgentService,
        private _utilityService: UtilityService,
        private _router: ActivatedRoute,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        formbuilder: FormBuilder
    ) {

        this.subscriptions.push(this._router.params.subscribe(params => {
            if (params.id) {
                this.forceSelected = params.id;
            }
        }));

        this.subscriptions.push(this._authService.getAgent().subscribe(data => {
            this.Agent = data;
        }));
        this.subscriptions.push(_agentService.isSelfViewingChat.subscribe(data => {
            this.isSelfViewingChat = data;
        }));

        this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
            if (settings && Object.keys(settings).length) this.verified = settings.verified;

        }));

        this.subscriptions.push(this._agentService.searchValue.debounceTime(300).subscribe(value => {
            this.searchValue = value;
            if (this.searchValue) {
                this.fetchMoreEnabled = false;
                let agents = this.agentList_original.filter(a => a.email.includes(this.searchValue.toLowerCase() || a.first_name.toLowerCase().includes(this.searchValue.toLowerCase())));
                // let agents = [];
                this._utilityService.SearchAgent(this.searchValue).subscribe((response) => {
                    // console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(element => {
                            if (!agents.filter(a => a.email == element.email).length) {
                                agents.push(element);
                            }
                        });
                    }
                    agents.sort((a, b) => {
                        return (a.first_name < b.first_name) ? -1 : 1
                    });
                    this.agentList = agents;
                });
                
                this._agentService.FilteredAgents.next((agents) ? agents : []);
                // this.agentList = agents;
            } else {
                this.fetchMoreEnabled = true;
                // this._agentService.getAllAgentsAsync(this._agentService.selectedFilter.getValue());
                this.agentList = this.agentList_original;
                this._agentService.FilteredAgents.next([]);
                // this.setScrollEvent();
            }
        }))


        this.subscriptions.push(this._agentService.getAllAgentsList().subscribe(data => {
            // console.log('Agent List Subscribed');
            // console.log(data);
            
            this.agentList = data;
            this.agentList_original = data;
            if (this.forceSelected) {
                this.setSelectedAgent(this.forceSelected);
            }
            // this.activeCount = 0;
            // this.idleCount = 0;
            // this.offlineCount = 0;
            // data.map(agent => {
            //     (!agent.liveSession) ? this.offlineCount += 1 :
            //         (agent.liveSession.state == 'ACTIVE') ? this.activeCount += 1 : this.idleCount += 1;
            // });

        }));

        this.subscriptions.push(this._agentService.getSelectedAgent().subscribe(data => {
            this.selectedAgent = data;
        }));

        this.subscriptions.push(this._agentService.agentConversationList.subscribe(data => {
            this.agentConversations = data;
            this.agentList.forEach(agent => {
                this.agentConversations.forEach(thread => {
                    if (thread.to == agent.email || thread.from == agent.email) {
                        if (thread.LastSeen && thread.LastSeen.length && (thread.to == this.Agent.email || thread.from == this.Agent.email)) {
                            let count = thread.LastSeen.find(data => data.id == this.Agent.email).messageReadCount;
                            let LastUpdated = thread.LastUpdated;
                            if (this.isSelfViewingChat.chatId == thread._id && this.isSelfViewingChat.value) {
                                Object.assign(agent, { 'messageReadCount': 0 });
                            } else {
                                Object.assign(agent, { 'messageReadCount': count });
                            }
                            Object.assign(agent, { 'LastUpdated': LastUpdated });
                        }
                    }
                });
            });
        }));

        this.subscriptions.push(_agentService.selectedAgentConversation.subscribe(data => {
            this.selectedAgentConversation = data;
        }));

        // //Agent Search
        // const onsearchinput = this.onSearchInput
        // .map(event => event)
        // .debounceTime(2000)
        // .switchMap(() => {
        // 	//console.log("Searching...");
        // 	return new Observable((observer) => {
        // 		let searchvalue = this.searchValue;
        // 		if (searchvalue) {
        // 			this.fetchMoreEnabled = false;
        // 			let agents = this.agentList_original.filter(a => a.email.includes(searchvalue.toLowerCase() || a.first_name.toLowerCase().includes(searchvalue.toLowerCase())));
        // 			this._agentService.SearchAgent(searchvalue).subscribe((response) => {
        // 				//console.log(response);
        // 				if (response && response.agentList.length) {
        // 					response.agentList.forEach(element => {
        // 						if(!agents.filter(a => a.email == element.email).length){
        // 							agents.push(element);
        // 						}
        // 					});
        // 				} 
        // 				this.agentList = agents;
        // 			});
        // 			this.agentList = agents;
        // 		} else {
        // 			this.fetchMoreEnabled = true;
        // 			this.agentList = this.agentList_original;
        // 			// this.setScrollEvent();
        // 		}
        // 	});
        // }).subscribe();

    }

    ngOnInit() {
    }

    public updateControlSideBar() {
        this._appStateService.ToggleControlSideBarState();
    }

    ngAfterViewInit() {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        // this._agentService.getAllAgents();
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
        // console.log('View Init');

    }

    ngAfterViewChecked() {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        if (this.loadingMoreAgents) {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
            // this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight + 20);
        }
    }

    ScrollChanged(event: UIEvent) {
        if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
            console.log('Fetch more agents');
            if(this.searchValue){
                let agents = this._agentService.FilteredAgents.getValue().filter(a => a.email.includes(this.searchValue.toLowerCase() || a.first_name.toLowerCase().includes(this.searchValue.toLowerCase())));
                this._utilityService.SearchAgent(this.searchValue, agents[agents.length - 1].first_name).subscribe((response) => {
                    //console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(element => {
                            if (!agents.filter(a => a.email == element.email).length) {
                                agents.push(element);
                            }
                        });
                    }
                    agents.sort((a, b) => {
                        return (a.first_name < b.first_name) ? -1 : 1
                    });
                    this.agentList = agents;
                });
                this._agentService.FilteredAgents.next((agents) ? agents : []);
            }else{
                this._agentService.getMoreAgents();
            }
            //   this._chatService.getMoreArchivesFromBackend();
        }
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    }



    public SortBy(agentList: any[]) {

        if (this.agentList.length > 0) {
            if (!this.sortBy) {
                return this.agentList;
            } else {
                return this.agentList.filter(agent => {
                    if (this.sortBy == 'ACTIVE') {
                        return (agent.liveSession && agent.liveSession.state == 'ACTIVE');
                    } else if (this.sortBy == 'IDLE') {
                        return (agent.liveSession && agent.liveSession.state == 'IDLE');
                    } else if (this.sortBy == 'OFFLINE') {
                        return (!agent.liveSession);
                    }
                });
            }
        } else {
            return [];
        }

    }

    setFilter(filter: string) {
        this.sortBy = filter;
    }

    public setSelectedAgent(agentid: string) {
        //console.log(agentid);
        // this._agentService.isStatActive.next(false);
        // if (this.searchValue) {
        //     this.agentList.map(agent => {
        //         if (agent._id == agentid) {
        //             // console.log('Setting Selected Agent')
        //            this._agentService.ResetSelected(agent)
        //             // this.ViewingChat(false,'');       
        //             // console.log(this.agentConversation.getValue())
        //         }
        //     });
        // }
        if (!(this.selectedAgent && this.selectedAgent._id == agentid)) {
            this._agentService.setSelectedAgent(agentid);
        }
    }

    trackBy(index, item){
        return item._id
    }

    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this._appStateService.showAgentModal(false);
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this._agentService.searchValue.next('');
    }
}