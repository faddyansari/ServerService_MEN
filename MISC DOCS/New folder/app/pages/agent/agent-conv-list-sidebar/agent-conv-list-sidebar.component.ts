import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../services/AuthenticationService';
import { AgentService } from '../../../../services/AgentService';

@Component({
	selector: 'app-agent-conv-list-sidebar',
	templateUrl: './agent-conv-list-sidebar.component.html',
	styleUrls: ['./agent-conv-list-sidebar.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AgentConvListSidebarComponent implements OnInit {

	// the data structure used for view
	public searchValue: string;
	public agent: any;
	public subscriptions: Subscription[] = [];
	public loading = false;
	verified = true;
	selectedThread: any;
	conversationList = [];
	conversationList_original = [];
	isSelfViewingAgentChat : any;

	constructor(
		private _agentService: AgentService,
		private formbuilder: FormBuilder,
		private _authService: AuthService
	) { 
		this.subscriptions.push(_agentService.agentConversationList.subscribe(data => {
			this.conversationList = data;
			this.conversationList_original = data;
			// console.log(this.conversationList);
		}));
		
		this.subscriptions.push(_authService.getAgent().subscribe(data => {
			this.agent = data;
		}));
		this.subscriptions.push(_agentService.selectedAgentConversation.subscribe(data => {
			this.selectedThread = data;
		}));
		this.subscriptions.push(_agentService.searchValue.debounceTime(300).subscribe(data => {
			this.searchValue = data;
			
			if(this.searchValue){
				// console.log(this.searchValue);
				let list = [];
				this.conversationList_original.forEach(conv => {
					if(conv.members.filter(a => a.email.includes(this.searchValue.trim())).length){
						list.push(conv);
					}
				});
				this.conversationList = list;
			}else{	
				this.conversationList = this.conversationList_original;
			}
		}));
		this.subscriptions.push(_agentService.loadingConversation.subscribe(data => {
			this.loading = data;
		}));
		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings && Object.keys(settings).length) this.verified = settings.verified;

		}));
		this.subscriptions.push(_agentService.isSelfViewingChat.subscribe(data => {
			this.isSelfViewingAgentChat = data;
		}));
	}

	ngOnInit() {
	}

	setSelectedConversation(cid) {
		// console.log(conversation);
		// this._agentService.GetContactByEmail((conversation.to == this.agent.email) ? conversation.from : conversation.to);
		this._agentService.getConversationByID(cid);
	}

	displayLastSeen(conversation){
		if(conversation.members.filter(m => m.email == this.agent.email).length){
			return true;
		}else{
			return false;
		}
	}

	returnLastSeen(LastSeen){
		return LastSeen.filter(item => item.email == this.agent.email)[0];
	}

	ngOnDestroy(){
		this._agentService.searchValue.next('');
	}


}
