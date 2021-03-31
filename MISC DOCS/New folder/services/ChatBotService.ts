import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SocketService } from './SocketService';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../app/dialogs/SnackBar-Dialog/toast-notifications.component';
import { Http } from "@angular/http";
import { AuthService } from './AuthenticationService';
import { Subscription } from 'rxjs/Subscription';
@Injectable()

export class ChatBotService {
	public socket: SocketIOClient.Socket;
	public entities_list: BehaviorSubject<any> = new BehaviorSubject([]);
	public intent_list: BehaviorSubject<any> = new BehaviorSubject([]);
	public t_phrase_list: BehaviorSubject<any> = new BehaviorSubject([]);
	public synonym_list: BehaviorSubject<any> = new BehaviorSubject([]);
	public resp_func_list: BehaviorSubject<any> = new BehaviorSubject([]);
	public response_list: BehaviorSubject<any> = new BehaviorSubject([]);
	public story_list: BehaviorSubject<any> = new BehaviorSubject([]);
	public action_list: BehaviorSubject<any> = new BehaviorSubject([]);
	public regex_list: BehaviorSubject<any> = new BehaviorSubject([]);
	subscriptions : Subscription[] = [];
	public viewContentInfo: BehaviorSubject<boolean> = new BehaviorSubject(false);
	private Agent: any = undefined;
	private botAddress = '';

	public rasa_JSON: BehaviorSubject<any> = new BehaviorSubject({
		"rasa_nlu_data": {
			"common_examples": [],
			"entity_synonyms": [],
			"regex_features": []
		}

	});

	constructor(public snackBar: MatSnackBar,
		private http: Http,
		public _socketService: SocketService,
		private _authService: AuthService,
		private dialog: MatDialog) {
		//console.log('Chat bot service initialized');

		this.subscriptions.push(_socketService.getSocket().subscribe((socket) => {
			if (socket) {
				this._authService.getAgent().subscribe(agent => { this.Agent = agent; });
				this.socket = socket;
				this.getIntentList();
				this.getTPhraseList();
				this.getEntityList();
				this.getSynonymList();
				this.getRespFuncList();
				this.getStoryList();
				this.getActionsList();
				this.getRegexList();
			}
		}));

		this.subscriptions.push(_authService.botServiceURL.subscribe(address => {
			this.botAddress = address;
		}));
	}
	//	public selectedStory : BehaviorSubject<any> = new BehaviorSubject(undefined);

	getIntentList() {
		this.socket.emit('getIntents', {}, (response) => {
			if (response.status == 'ok') {
				this.intent_list.next(response.intentList);
			}
		});
	}

	addIntent(name: any) {
		// console.log('Emitting Intent');
		// console.log(this.socket);
		this.socket.emit('addIntent', { intent_name: name }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Intent added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.intent_list.getValue().push(response.intent);
				this.intent_list.next(this.intent_list.getValue());
			} else if (response.status == 'error') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'warning',
						msg: 'Intent already exists!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'error']
				});
			}
		});
		// this.intent_list.getValue().push(intent);
		// this.intent_list.next(this.intent_list.getValue());
	}

	// updateIntentList(intent_list) {
	// 	this.intent_list.next(intent_list);
	// }

	toggleInfo() {
		this.viewContentInfo.next(!this.viewContentInfo.getValue());
	}

	setShowInfo(value) {
		this.viewContentInfo.next(value);
	}

	updateIntent(id, intent_name) {
		this.socket.emit('updateIntent', { _id: id, name: intent_name }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Intent updated successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.intent_list.getValue().map(i => {
					if (i._id == response.intent._id) {
						i.name = response.intent.name;
					}
					return;
				});
				this.intent_list.next(this.intent_list.getValue());
			} else {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'warning',
						msg: 'Intent already exists!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'error']
				});
			}
		});
	}

	deleteIntent(id, index) {
		this.socket.emit('deleteIntent', { _id: id }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Intent deleted successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.intent_list.getValue().splice(index, 1);
				this.intent_list.next(this.intent_list.getValue());
			}
		});
	}


	public getIntent(): Observable<any> {
		return this.intent_list.asObservable();
	}

	addEntity(entity: string, slot_type: string, color: string) {
		this.socket.emit('addEntity', { name: entity, slot: slot_type, color: color }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Entity added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.entities_list.getValue().push(response.entity);
				this.entities_list.next(this.entities_list.getValue());
			}
		})
	}

	selSlotType(entity, slotValue) {
		this.socket.emit('selSlotType', { entity: entity, slotValue: slotValue }, (response) => {

			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Slot set successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.entities_list.getValue().map(p => {
					if (p._id == response.slotType._id) {
						p.slot_type = slotValue;
					}
				})
				this.entities_list.next(this.entities_list.getValue());
			}
		})
	}

	getEntityList() {
		this.socket.emit('getEntity', {}, (response) => {
			if (response.status == 'ok') {
				this.entities_list.next(response.entityList);
			}
		});
	}

	updateEntity(entity, updatedEnt) {
		this.socket.emit('updateEnt', { entity: entity, updatedEnt: updatedEnt }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Entity updated successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.entities_list.getValue().map(p => {
					if (p._id == entity._id) {
						p.entity_name = updatedEnt;
					}
					return;
				})
				this.entities_list.next(this.entities_list.getValue());
			}
		});
	}


	deleteEntity(id) {
		this.socket.emit('deleteEntity', { _id: id }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Entity deleted successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.entities_list.next(this.entities_list.getValue());
				//this.t_phrase_list.next(this.t_phrase_list.getValue());
			}
		});
	}

	public getEntity(): Observable<any> {
		return this.entities_list.asObservable();
	}


	addTPhrase(t_phrase, id) {
		this.socket.emit('addTPhrase', { tPhrase: t_phrase, intent_id: id }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Training phrase added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.t_phrase_list.getValue().push(response.tPhrase);
				this.t_phrase_list.next(this.t_phrase_list.getValue());
			}
		});
	}

	getTPhraseList() {
		this.socket.emit('getTPhrase', {}, (response) => {
			if (response.status == 'ok') {
				this.t_phrase_list.next(response.tPhraseList);
			}
		});
	}


	public getTPhrase(): Observable<any> {
		return this.t_phrase_list.asObservable();
	}


	deleteTPhrase(id, intent_id, index) {
		this.socket.emit('deleteTPhrase', { _id: id, intent_id: intent_id }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Training Phrase deleted successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.t_phrase_list.getValue().splice(index, 1);
				this.t_phrase_list.next(this.t_phrase_list.getValue());
			}
		});
	}



	markPhrase(_id, start, end, text): Observable<any> {
		return new Observable((observer) => {
			this.socket.emit('markPhrase', { _id: _id, start: start, end: end, text: text }, (response) => {
				if (response.status == 'ok') {
					this.t_phrase_list.getValue().map(p => {
						if (p._id == response.tpEntity._id) {
							p.entities = response.tpEntity.entities;
						}
						return;
					});
					this.t_phrase_list.next(this.t_phrase_list.getValue());
					observer.next(response.status);
					observer.complete();
				} else {
					observer.next(response.status);
					observer.complete();
				}
			});
		});

	}

	selEntity(tPhrase, entity_id, entVal) {
		this.socket.emit('selectEntity', { tPhrase: tPhrase, entArray: entity_id, entVal: entVal }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Entity assigned successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.t_phrase_list.getValue().map(p => {
					if (p._id == response.tPhrase._id) {
						p.entities.map(e => {
							if (e.id == entity_id) {
								// console.log('Matched!');
								e.entity = entVal;
								return;
							}
							return;
						});
					}
				});
				//this.t_phrase_list.getValue().push(response.tPhrase)
				this.t_phrase_list.next(this.t_phrase_list.getValue());
			}
		});
	}


	delMarkEnt(tPhraseId, entId, index) {

		this.socket.emit('delMarkEnt', { _id: tPhraseId, entId: entId }, (response) => {
			if (response.status == 'ok') {
				// console.log(this.t_phrase_list.getValue());
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Selected word deleted successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.t_phrase_list.getValue().map(p => {
					p.entities.splice(index, 1);
				})

				this.t_phrase_list.next(JSON.parse(JSON.stringify(this.t_phrase_list.getValue())));

			}
		});
	}




	getSynonymList() {
		this.socket.emit('getSynonym', {}, (response) => {
			if (response.status == 'ok') {
				this.synonym_list.next(response.synList);
			}
		});
	}


	addSynonymValues(synValue) {
		this.socket.emit('addSynVal', { synValue: synValue }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Selected word added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.synonym_list.getValue().push(response.synVal);
				this.synonym_list.next(this.synonym_list.getValue());
			}
		})
	}


	addSynonym(value, syn_list) {
		this.socket.emit('addSyn', { value: value, syn_list: syn_list }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Synonym added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
			}
		});
	}


	public getSynonym(): Observable<any> {
		return this.synonym_list.asObservable();
	}


	removeSynonym(index, syn_list) {
		this.socket.emit('delSyn', { value: index, syn_list: syn_list }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Synonym removed successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
			}
		})
	}


	deleteSynonymValues(syn_list) {
		this.socket.emit('delSynVal', { syn_list: syn_list }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Selected value deleted successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
			}
		});
	}




	// public ExecuteNlu(rasaJSON: any): Observable<any> {

	// 	return this.http.post('http://localhost:5000/executeNlu', rasaJSON)
	// 		.map((response) => {
	// 			return response
	// 		}).catch(err => {
	// 			return Observable.throw(err);
	// 		})

	// }

	// this.http.get('http://localhost:8005/execute').subscribe((response) => {
	// 	observer.next(response);
	//     observer.complete();
	// }, err => {
	//     observer.error(err);
	// });
	// })


	public userInput(inputText): Observable<any> {
		return new Observable((observer) => {
			this.http.post('http://localhost:5000/input', inputText).subscribe(response => {
				observer.next(response);
				observer.complete();
			}, err => {
				observer.error(err);
			})
		});
	}








	//core works
	addResponse(resp, id) {
		//console.log(resp + ' - ' + id);

		this.socket.emit('addResponse', { resp: resp, resp_func_id: id }, (response) => {
			//console.log(response);

			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Response added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});

				//console.log(response.resp["response"]);
				this.response_list.getValue().push({
					text: resp
				});
				this.response_list.next(this.response_list.getValue())
				this.resp_func_list.getValue().map(r => {
					if (r._id == id) {
						r.response.push({
							text: resp
						})
					}
				})
				this.resp_func_list.next(this.resp_func_list.getValue());
			}
		});
	}



	getResponses(id) {
		//console.log(id);
		this.socket.emit('getResponse', { id: id }, (response) => {
			console.log(response);

			if (response.status == 'ok') {
				this.response_list.next(response.RespList);
			}
			else {
				this.response_list.next([]);
				console.log(response);

			}
		});
	}


	public getResponse(): Observable<any> {
		return this.response_list.asObservable();
	}

	updateResponse(responses, updatedResp, intent_id) {

		this.socket.emit('updateResp', { response: responses, updatedResp: updatedResp, intent_id: intent_id }, (response) => {

			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Response updated successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.response_list.getValue().map(p => {
					if (p.id == responses.id) {
						responses.text = updatedResp;
					}
				});
				this.response_list.next(this.response_list.getValue());
			}
		});
	}




	deleteResponse(resp_id, intent_id, index) {

		this.socket.emit('delResp', { resp_id: resp_id, intent_id: intent_id }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Response deleted successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.response_list.getValue().splice(index, 1);
				this.response_list.next(this.response_list.getValue());
				//this.t_phrase_list.next(this.t_phrase_list.getValue());
			}
		});
	}







	getRespFuncList() {
		this.socket.emit('getRespFunc', {}, (response) => {
			if (response.status == 'ok') {
				this.resp_func_list.next(response.respFuncList);
				//console.log(response.respFuncList);

			}
		});
	}
	public getRespFunc(): Observable<any> {
		return this.resp_func_list.asObservable();
	}

	addRespFunc(name: any) {
		this.socket.emit('addRespFunc', { resp_func_name: name }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Response function added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.resp_func_list.getValue().push(response.respFunc);
				this.resp_func_list.next(this.resp_func_list.getValue());
			}
		});
	}

	updateRespFunc(resp_func_id, resp_func_name) {
		this.socket.emit('updateRespFunc', { _id: resp_func_id, func_name: resp_func_name }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Response function updated successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});

				this.resp_func_list.getValue().map(i => {
					if (i._id == response.respFunc._id) {
						i.func_name = response.respFunc.func_name;
					}
					return;
				});
				this.resp_func_list.next(this.resp_func_list.getValue());
			} else {

			}
		});
	}


	deleteRespFunc(id, index) {
		this.socket.emit('deleteRespFunc', { _id: id }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Response function deleted successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.resp_func_list.getValue().splice(index, 1);
				this.resp_func_list.next(this.resp_func_list.getValue());
			}
		});
	}

	//#region Stories

	AddStory(story_name) {
		this.socket.emit('addStory', { story_name: story_name }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Story added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.story_list.getValue().push(response.storyName);
				this.story_list.next(this.story_list.getValue());
			}
		})
	}


	getStoryList() {
		this.socket.emit('getStories', {}, (response) => {
			if (response.status == 'ok') {
				this.story_list.next(response.stories);
			}
		})
	}


	public getStories(): Observable<any> {
		return this.story_list.asObservable();
	}


	deleteStory(id, index) {
		this.socket.emit('deleteStory', { _id: id }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Story deleted successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.story_list.getValue().splice(index, 1);
				this.story_list.next(this.story_list.getValue());
				//this.t_phrase_list.next(this.t_phrase_list.getValue());
			}
		});
	}


	AddIntentToStory(intent_id, story_id): Observable<any> {
		return new Observable((observer) => {
			this.socket.emit('addIntentToStory', { intent_id: intent_id, story_id: story_id }, (response) => {
				if (response.status == 'ok') {
					this.story_list.next(this.story_list.getValue().map(story => {
						if (story._id == story_id) {
							story.intents.push({
								intent_id: intent_id,
								respFuncs: [],
								actions: []
							});
							//this.selectedStory.next(story);
						}
						return story;
					}));
					observer.next({ status: 'ok' });
					observer.complete();
				} else {
					observer.next({ status: 'error' });
					observer.complete();
				}
			});
		})

	}



	AddRespFuncToIntent(intent_id, story_id, respFuncId): Observable<any> {
		return new Observable((observer) => {
			this.socket.emit('addRespFuncToIntent', { intent_id: intent_id, story_id: story_id, respFuncId: respFuncId }, (response) => {
				if (response.status == 'ok') {
					//	console.log(response);
					this.story_list.next(this.story_list.getValue().map(story => {
						if (story._id == story_id) {
							story.intents = response.stories.intents;
						}
						return story;
					}));
					observer.next({ status: 'ok' });
					observer.complete();
				} else {
					observer.next({ status: 'error' });
					observer.complete();
				}
			});
		});
	}



	AddActionToIntent(intent_id, story_id, actId): Observable<any> {
		return new Observable((observer) => {
			this.socket.emit('addActionToIntent', { intent_id: intent_id, story_id: story_id, actId: actId }, (response) => {
				if (response.status == 'ok') {
					this.story_list.next(this.story_list.getValue().map(story => {
						if (story._id == story_id) {
							story.intents = response.stories.intents;
						}
						return story;
					}));
					observer.next({ status: 'ok' });
					observer.complete();
				} else {
					observer.next({ status: 'error' });
					observer.complete();
				}
			});
		});
	}

	//Setters
	setRasaJSON(value) {
		this.rasa_JSON.next(value);
	}


	AddAction(action_name, endpoint_url, template): Observable<any> {
		this.socket.emit('addAction', { action_name: action_name, endpoint_url: endpoint_url, template: template }, (response) => {
			if (response.status == 'ok') {
				this.action_list.getValue().push(response.action);
				this.action_list.next(this.action_list.getValue());
			}
		})
		return new Observable((observer) => {
			this.http.post(this.botAddress + '/action', { action_name: action_name, endpoint_url: endpoint_url, template: template, csid: this.Agent.csid }).subscribe(response => {
				observer.next(response);
				observer.complete();
			}, err => {
				observer.error(err);
			});
		});
	}


	deleteAction(id, index) {
		this.socket.emit('deleteAction', { _id: id }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Action deleted successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.action_list.getValue().splice(index, 1);
				this.action_list.next(this.action_list.getValue());
				//this.t_phrase_list.next(this.t_phrase_list.getValue());
			}
		});
	}


	getActionsList() {
		this.socket.emit('getActions', {}, (response) => {
			if (response.status == 'ok') {
				this.action_list.next(response.actions);
			}
		})
	}


	public getActions(): Observable<any> {
		return this.action_list.asObservable();
	}

	public Execute(domain: any, stories: any, nluJson: any): Observable<any> {


		return this.http.post(this.botAddress + '/execute', { domain: domain, stories: stories, nluJson: nluJson, agentEmail: this.Agent.email,agentNsp : this.Agent.nsp })
			.map((response) => {
				return response
			}).catch(err => {
				return Observable.throw(err);
			})

	}


	AddMessageAsTPhrase(tPhrase: tPhrase): Observable<any> {
		return new Observable((observer) => {
			this.socket.emit('addTPhrase', { intent_id: tPhrase.intents, tPhrase: tPhrase.tPhrase }, (response) => {
				if (response.status == 'ok') {
					this.t_phrase_list.getValue().splice(0, 0, response.tPhrase)
					this.t_phrase_list.next(this.t_phrase_list.getValue());
				}
				observer.next(response.status);
				observer.complete();
			});
		})
	}



	addRegexValue(regValue) {
		this.socket.emit('addRegexVal', { regValue: regValue }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Value for regex added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
				this.regex_list.getValue().push(response.regVal);
				this.regex_list.next(this.regex_list.getValue());
			}
		});
	}

	getRegexList() {
		this.socket.emit('getRegex', {}, (response) => {
			if (response.status == 'ok') {
				this.regex_list.next(response.regList);
			}
		});
	}


	public getRegex(): Observable<any> {
		return this.regex_list.asObservable();
	}

	addRegex(value, reg_list) {
		this.socket.emit('addReg', { value: value, reg_list: reg_list }, (response) => {
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Regex added successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
			}
		});
	}



	removeRegex(index, reg_list) {
		this.socket.emit('delReg', { value: index, reg_list: reg_list }, (response) => {
			if (response.status == 'ok') {
				//console.log('Regex deleted!');
				if (response.status == 'ok') {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Regex removed successfully!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'success']
					});
				}
			}
		})
	}


	deleteRegexValues(reg_list) {
		this.socket.emit('delRegVal', { reg_list: reg_list }, (response) => {
			if (response.status == 'ok') {
				if (response.status == 'ok') {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Regex Value deleted successfully!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'success']
					});
				}
			}
		});
	}

	public Destroy() {
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}

}



interface tPhrase {
	tPhrase: string;
	intents: string;
}