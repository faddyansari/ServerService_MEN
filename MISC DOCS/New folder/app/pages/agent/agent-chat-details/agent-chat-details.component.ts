import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AgentService } from '../../../../services/AgentService';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';

@Component({
	selector: 'app-agent-chat-details',
	templateUrl: './agent-chat-details.component.html',
	styleUrls: ['./agent-chat-details.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AgentChatDetailsComponent implements OnInit {

	@Input() conversation: any;
	@Input() agent: any;
	optionsEnabled = false;
	subscriptions: Subscription[] = [];
	agentList: any = [];
    agentList_original: any = [];
	selectedAgents = [];
	ended = false;

	tabs = {
		'group_info': true,
		'members': false,
		'media': false
	}
	searchForm: FormGroup;
	constructor(private _agentService : AgentService, private _utilityService: UtilityService ,private formbuilder: FormBuilder) {
		if(this.conversation){
			this.optionsEnabled = this.conversation.members.some(m => m.email == this.agent.email && m.isAdmin);
		}
		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(data => {
            // console.log(data);
            if (data) {
                this.agentList = data;
                this.agentList_original = data;
            }
		}));
		
		this.searchForm = formbuilder.group({
            'searchValue': ['', []
            ]
        });
	}

	ngOnInit() {
	}

	vhListTabs(tab) {
		Object.keys(this.tabs).map(key => {
			if (key == tab) {
				this.tabs[key] = true
			} else {
				this.tabs[key] = false
			}
		})
	}

	displayActions(){
		let member = this.conversation.members.filter(m => m.email == this.agent.email)[0];
		if(member){
			return member.isAdmin
		}else{
			return false;
		}
	}

	removeMember(email){
		this._agentService.removeMember(email, this.conversation._id).subscribe(data => {
			if(data){
				this.conversation = data;
				// this.selectedAgents = [];
			}
		})
	}
	makeAdmin(email, value){
		this._agentService.toggleAdmin(email, this.conversation._id, value).subscribe(data => {
			if(data){
				this.conversation = data;
			}
		})
	}
	addMember(){
		if(this.selectedAgents){
			this._agentService.addMember(this.selectedAgents, this.conversation._id).subscribe(data => {
				if(data){
					this.conversation = data;
					this.selectedAgents = [];
				}
			})
		}
	}

	//Custom select events
	loadMore($event) {
        // console.log('Scroll');
        if (!this.ended) {
            console.log('Fetch More');
            this._agentService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(response => {
                console.log(response);
                this.agentList = this.agentList.concat(response.agents);
                this.ended = response.ended;
            });
        }
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
					this.agentList = agents;
				});
			// this.agentList = agents;
		} else {
            this.agentList = this.agentList_original;
            this.ended = false;
			// this.setScrollEvent();
		}
	}

	public CloseViewHistory() {
        this._agentService.closeDetail.next(false);
	}
	
	
	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}


}
