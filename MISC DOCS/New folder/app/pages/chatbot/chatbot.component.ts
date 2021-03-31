import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatBotService } from '../../../services/ChatBotService';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { GlobalStateService } from '../../../services/GlobalStateService';
@Component({
	selector: 'app-chatbot',
	templateUrl: './chatbot.component.html',
	styleUrls: ['./chatbot.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		ChatBotService
	]

})
export class ChatbotComponent implements OnInit {
	subscriptions : Subscription[] = [];
	viewContentInfo = false;
	loadingNestedRouteConfig = false;
	story_list =[]
	intent_list = []
	resp_func_list=[]
	action_list = []
	entities_list = []
	slot_list =[]
	stories_data = '';
	domain_data = '';
	rasaJSON :any;
	t_phrase_list = [];
	synonym_list = [];
	regex_list = [];
	loader = false;
	error_logs=[];
	
	
	
	constructor(private BotService: ChatBotService, _stateService: GlobalStateService, 	private router : Router) {
		this.subscriptions.push(this.BotService.viewContentInfo.subscribe(data => {
			this.viewContentInfo = data;
		}));

		this.subscriptions.push(_stateService.loadingNestedRouteConfig.subscribe(data => {
			this.loadingNestedRouteConfig = data;
		}));

		this.subscriptions.push(BotService.getIntent().subscribe(data => {
			this.intent_list = data;
			}));
	  
		  this.subscriptions.push(BotService.getTPhrase().subscribe(data => {
			this.t_phrase_list = data;
		  }));
		
		  this.subscriptions.push(BotService.getEntity().subscribe(data => {
			this.entities_list = data;
	  
		  }));
		 
		  this.subscriptions.push(BotService.getSynonym().subscribe(data => {
			this.synonym_list = data;
	  
		  }));
	  
	  
		  this.subscriptions.push(BotService.getRegex().subscribe(data => {
			this.regex_list = data;
	  
		  }));
	  
		  this.subscriptions.push(BotService.rasa_JSON.subscribe(data => {
			this.rasaJSON = data;
		  }));
		 
		
	
	this.subscriptions.push(BotService.getIntent().subscribe(data => {
		this.intent_list = data;
	}));

	this.subscriptions.push(BotService.getRespFunc().subscribe(data => {
		this.resp_func_list = data;
	}));

	this.subscriptions.push(BotService.getStories().subscribe(data => {
		this.story_list = data;
	}));

	this.subscriptions.push(BotService.getEntity().subscribe(data => {
		this.entities_list = data;
	}));

	this.subscriptions.push(BotService.rasa_JSON.subscribe(data => {
		this.rasaJSON = data;
	}));

	this.subscriptions.push(BotService.action_list.subscribe(data =>{
		this.action_list = data;
	}));
		
	}

	ngOnInit() {
	}


	ngAfterViewInit(){
		// setTimeout(()=>{
		// 	this.createCustomJSON();
		// 	console.log('NLU data loaded successfully...!');
		// 	this.load_domain();
		// 	console.log('Domain data loaded successfully...!');
		// 	this.load_stories();
		// 	console.log('Stories data loaded successfully...!');
			
		// },1000);
	}
	ngOnDestroy() {
		// Called once, before the instance is destroyed.
		// Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	  
	  }
	
	toggleInfoArea(){
		this.viewContentInfo = !this.viewContentInfo;
	}

	public STOPPROPAGATION(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
	}

	getIntentName(intent_id): string{ 
		if(intent_id && this.intent_list.filter(i => i._id == intent_id).length){
			return this.intent_list.filter(i => i._id == intent_id)[0].name;
		} else {
			return intent_id;
		}
	}


	getResponseName(resp_id): string {
		if(resp_id && this.resp_func_list.filter(i => i._id == resp_id).length){
			return this.resp_func_list.filter(i => i._id == resp_id)[0].func_name;
		} else {
			return resp_id;
		}
	}

	getActionName(act_id): string {
		if(act_id && this.action_list.filter(i => i._id == act_id).length){
			return this.action_list.filter(i => i._id == act_id)[0].action_name;
		} else {
			return act_id;
		}
	}


	createCustomJSON(){

		let commonexamples = [];
		let entity_synonyms = [];
	
		let regex_features = [];
		// console.log(this.entities_list)
		let phrase_list = JSON.parse(JSON.stringify(this.t_phrase_list));
		let entities_list = JSON.parse(JSON.stringify(this.entities_list));
		let synonym_list = JSON.parse(JSON.stringify(this.synonym_list));
		let regex_list = JSON.parse(JSON.stringify(this.regex_list));
		this.intent_list.forEach(i => {
		  let phrases = phrase_list.filter(t => t.intent_id == i._id);
		//  console.log(phrase);
		  if(phrases.length){
			phrases.forEach(phrase => {
			  phrase.entities.forEach((element, index) => {
				
				if(entities_list.filter(e => e._id == element.entity).length){
				  element.entity = entities_list.filter(e => e._id == element.entity)[0].entity_name;
				}else{
				  phrase.entities.splice(index,1);
				}
			  });
			  phrase.entities.filter(e => {
				delete e['id'];
				delete e['entity_del'];
			  });
			  commonexamples.push({
				intent: i.name,
				entities: phrase.entities,
				text : phrase.text.toLowerCase()
			  });
			});
		  }      
		});
	
	
	  this.synonym_list.forEach(p=>{
		if(p.synonyms.length){
		  entity_synonyms.push({
			value: p.entity_value,
			synonyms: p.synonyms
		  });
		}
	  });
	
	  this.regex_list.forEach(p=>{
		if(p.regex.length){
		  regex_features.push({
			name: p.regex_value,
			pattern: JSON.parse(JSON.stringify(p.regex[0]))
		  });
		}
	  });
	  
		this.rasaJSON.rasa_nlu_data.common_examples = commonexamples;
		this.rasaJSON.rasa_nlu_data.entity_synonyms = entity_synonyms;
		this.rasaJSON.rasa_nlu_data.regex_features =  regex_features;
		
		this.BotService.setRasaJSON(this.rasaJSON);
		//console.log(this.rasaJSON);
		
		//this.downloadObjectAsJson(this.rasaJSON,'data');
	   // console.log(this.t_phrase_list);
	  
	  }




	  load_stories(){
		let data = '';
		this.story_list.forEach(story => {
			data += '## ' + story.story_name + '\n';
			story.intents.forEach(intent => {
				data += '* ' + this.getIntentName(intent.intent_id) + '\n';
				intent.respFuncs.forEach(resp => {
				data += '    - '+ this.getResponseName(resp) + '\n';
				});
				intent.actions.forEach(act => {
				data += '    - '+ this.getActionName(act) + '\n';
				});
			});
			data += '\n';
		});
		//console.log(data);
		this.stories_data = data;
		// console.log(data);
	}


	load_domain(){
		let data = 'entities:\n';
		
		this.entities_list.forEach(entity => {
			if(!entity.del){
			data += '  - '+entity.entity_name + '\n';
		}
		});
		
		data += '\nintents:\n';
		
		this.intent_list.forEach(intent => {
			if(!intent.del){
			data += '  - ' + intent.name + '\n';
			}
		});
		
		//data += '\nslots:\n';
		data += '\ntemplates:\n';
		
		this.resp_func_list.forEach(resp_func => {
			if(!resp_func.del){
			data += '  '+resp_func.func_name+':\n';
			resp_func.response.forEach(resp => {
				if(!resp.resp_del){
				data += '    - text: "'+resp.text+'"\n';
			}
			});
		}
		});
		
		data += '\nactions:\n';
		
		this.resp_func_list.forEach(resp_func => {
			if(!resp_func.del){
			data += '  - '+resp_func.func_name + '\n';
			}
		});

		this.action_list.forEach(action => {
			if(!action.del){
			data += '  - '+action.action_name+ '\n';
		}
		});
		
		this.domain_data = data;
	}

	back() {
		this.router.navigateByUrl('/chatbot/core');
  	}



	Execute(){
		this.error_logs = [];
		this.createCustomJSON();
		if(!this.rasaJSON.rasa_nlu_data.common_examples.length){
			this.error_logs.push('NLU error')
		}
		else{
		console.log('NLU data loaded successfully...!');
		}
		
		this.load_domain();
		if(!this.domain_data){
			this.error_logs.push('domain error')	
		}
		else{
		console.log('Domain data loaded successfully...!');
		}

		this.load_stories();
		if(!this.stories_data){
			this.error_logs.push('Stories error')	
		}
		else{
		console.log('Stories data loaded successfully...!');
		}

		if(!this.error_logs.length){
		this.loader =true;
		this.BotService.Execute(this.domain_data, this.stories_data, this.rasaJSON).subscribe((res) =>{
			// if(res.status == "ok"){
			this.loader =false;
		});
		}
		else{
			console.log(this.error_logs);
			
		}
	}





}
