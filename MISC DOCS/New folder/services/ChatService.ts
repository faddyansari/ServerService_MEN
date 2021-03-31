import { Injectable } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
//End RxJs Imports


//Services
import { SocketService } from "../services/SocketService";
import { AuthService } from "./AuthenticationService";
import { Visitorservice } from "./VisitorService";
import { GlobalStateService } from "./GlobalStateService";
import { PushNotificationsService } from "./NotificationService";
import { environment } from "../environments/environment";
//End Services


@Injectable()
export class ChatService {
	private Agent;
	private windowFocused = false;
	private showNotification = false;

	private subscriptions: Subscription[] = [];
	private acceptingChatMode: BehaviorSubject<any> = new BehaviorSubject(true);
	public notification: Subject<any> = new Subject();
	private autoScroll: BehaviorSubject<boolean> = new BehaviorSubject(true);
	private activeTab: BehaviorSubject<string> = new BehaviorSubject('INBOX');
	private archivesSynced: BehaviorSubject<boolean> = new BehaviorSubject(false);
	public tagList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
	private chatServiceURL = '';
	private visitorServiceURL = '';

	private archiveChunk: number = 0;

	public socket: SocketIOClient.Socket;
	public AllConversations: BehaviorSubject<any> = new BehaviorSubject([]);
	public Archives: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
	public visitorList: BehaviorSubject<any> = new BehaviorSubject({});
	public currentConversation: BehaviorSubject<any> = new BehaviorSubject({});
	public selectedVisitor: BehaviorSubject<any> = new BehaviorSubject({});
	public ShowAttachmentAreaDnd: BehaviorSubject<boolean> = new BehaviorSubject(false);
	//Loader Variables for Live Data
	private loadingCurrentConversation: BehaviorSubject<boolean> = new BehaviorSubject(true);
	public AutoSync: Subject<boolean> = new Subject();
	private autoSync = false;

	//Loader Variables Database
	private loading: Subject<boolean> = new Subject();
	private loadingMoreArchives: BehaviorSubject<boolean> = new BehaviorSubject(false);
	private loadingMoreInbox: BehaviorSubject<boolean> = new BehaviorSubject(false);

	//Loader Variables Database
	private loadingMessages: Subject<boolean> = new Subject();
	private loadingMoreMessages: Subject<boolean> = new Subject();

	public newMesagedRecieved: Subject<boolean> = new Subject();
	public messageDrafts: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

	chatPermissions: any;

	public tempTypingState: Subject<boolean> = new Subject();

	public urlRegex: RegExp = /((http(s)?:\/\/)?([\w-]+\.)+[\w-]+[.com]+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gmi;

	//cannedForms
	public CannedForms: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

	//ChatHistoryList
	public chatHistoryList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
	public selectedChatHistory: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
	public DeviceIDHashList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
	public Filters: BehaviorSubject<any> = new BehaviorSubject({});
	public SuperVisedChatList: BehaviorSubject<Array<string>> = new BehaviorSubject([]);
	customFields: BehaviorSubject<Array<string>> = new BehaviorSubject([]);
	private inboxChunk: number = 0;
	permissions: any;
	conversationsFetched = false;
	archivesFetched = false;
	//Change to Behaviour Subject if Any Error Occured
	//private Agent : BehaviorSubject<any> = new BehaviorSubject({});
	constructor(private _socket: SocketService, private http: Http, private _authService: AuthService, private _visitorService: Visitorservice, private _appStateService: GlobalStateService, private _notificationService: PushNotificationsService) {
		//////console.log('Chat Service Initialized');

		_authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
				this.permissions = data.permissions.chats;
				if (data.schemas && data.schemas.chats) this.customFields.next(data.schemas.chats.fields)
			}
		});
		_authService.RestServiceURL.subscribe(url => {
			this.chatServiceURL = url + '/api/chats';
			this.visitorServiceURL = url + '/api/visitor'
		})

		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
				this.chatPermissions = data.permissions.chats;
			}
		}));

		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			//////console.log('Agent Subscribed');
			//////console.log(agent);
			this.Agent = agent;

		}));

		this.subscriptions.push(_appStateService.getFocusedState().subscribe(data => {
			this.windowFocused = data;
		}));

		this.subscriptions.push(_appStateService.getNotificationState().subscribe(data => {
			this.showNotification = data;
		}));

		this.subscriptions.push(_visitorService.getVisitorsMap().subscribe(visitorList => {
			////console.log('Visitor Map Updated');
			////console.log(visitorList);
			this.visitorList.next(visitorList);
			Object.keys(visitorList).map((key) => {
				if (Object.keys(this.currentConversation.getValue()).length > 0) {
					if (visitorList[this.currentConversation.getValue().sessionid] != undefined) {
						this.selectedVisitor.next(visitorList[this.currentConversation.getValue().sessionid]);
					}
				}

			})
		}));

		this.subscriptions.push(this.AutoSync.debounceTime(3000).subscribe(value => {
			if (value) {
				// this.RequesetQueAuto()
				this.RequestQueAutoRest()
			}
		}))

		_socket.getSocket().subscribe((data) => {
			if (data) {
				this.socket = data;
				if (this.permissions && this.permissions.enabled) {
					this.Filters.debounceTime(1500).subscribe(filters => {
						if (this.activeTab.getValue() == 'ARCHIVE') {
							this.getArchivesFromBackend(filters)
						} else {
							if (!this.conversationsFetched) this.GetConverSations(filters);
						}
					});
					this.socket.on('newConversation', (conversation) => {



						this.RemovePreviousChatsFromInbox(conversation._id).subscribe(result => {
							// if (result) {
								if (this.SuperVisedChatList.getValue().includes(conversation._id) && (conversation.superviserAgents.includes(this.Agent.csid))) {
									//console.log('removing trnsferred Chat from supervision list');
									this._visitorService.EndSuperVisesChatRest(conversation._id, false).subscribe(data => {
										conversation.superviserAgents = conversation.superviserAgents.filter(id => { return this.Agent.csid != id });
									});
								}
								this.SuperVisedChatList.next(this.SuperVisedChatList.getValue().filter(id => { return conversation._id != id }))

								this.InserNewConversation(conversation);
								let data: Array<any> = [];

								data.push({
									'title': 'New Conversation!',
									'alertContent': "You got a new conversation!",
									'icon': "../assets/img/favicon.ico",
									'url': "/chats/" + conversation._id
								});
								if (this.showNotification) {
									this._notificationService.generateNotification(data);
								}
							// }
							//this.RemovePreviousArchivesForChat(conversation._id).subscribe(result => { })
						});

					});

					this.socket.on('superviseChat', (data) => {
						this.RemovePreviousChatsFromInbox(data.supervisedChat._id).subscribe(result => {
							this.SuperVisedChatList.getValue().push(data.supervisedChat._id)
							this.InserNewConversation(data.supervisedChat);
							this._appStateService.NavigateForce('/chats/' + data.supervisedChat._id);
						});
					});

					this.socket.on('removeBannedVisitorChatFromList', (data) => {

						if (data.visitor) {
							this._visitorService.UpdateBannedVisitor(data.visitor).subscribe(bannedList => {

								if (bannedList) {

									if (data.session && data.session.conversationID) {
										this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
											if (conversation._id == data.session.conversationID) {
												conversation.synced = true;
												conversation.ended = true;
												conversation.state = 3;
												conversation.lastmodified = new Date().toISOString();
												if (conversation.messages && conversation.messages.length > 0) {
													conversation.lastmessage = conversation.messages[conversation.messages.length - 1];
												}
												//this.moveToArchive(conversation, conversation);
											}
											return conversation._id != data.session.conversationID;
										}));
										if (data.session.conversationID == this.currentConversation.getValue()._id) this.DiscardCurrentConversation();
									}
								}
							})
						}
					});
					this.socket.on('privateMessage', (data) => {

						let selectedConversation = false;




						let exist = (this.AllConversations.getValue() as Array<any>).findIndex(conversation => conversation.cid == data.cid);

						if (exist) {

							this.AllConversations.getValue().map((conversation, index) => {
								//////console.log(conversation);
								if (conversation._id == data.cid) {
									conversation.typingData = ''
									conversation.messages.push(data);
									//Shifting That Conversation on Top.
									(this.AllConversations.getValue() as Array<any>).splice(index, 1);
									(this.AllConversations.getValue() as Array<any>).unshift(conversation);
									this.AllConversations.next(this.AllConversations.getValue());
									if ((this.currentConversation.getValue()._id == data.cid) && this.autoScroll.getValue()) {
										//if(data.type != 'Agents') this.newMesagedRecieved.next(data);
										this.UpdateMessageSentStatusRest({
											sessionid: conversation.sessionid,
											cid: conversation._id,
											type: 'Visitors'
										});
									}
									if (data.type != 'Agents') {
										if (this.currentConversation.getValue()._id != data.cid || !this.windowFocused || !this.autoScroll.getValue()) {
											if (conversation.messageReadCount == 0) {
												let notif_data: Array<any> = [];
												notif_data.push({
													'title': 'New Message!',
													'alertContent': 'You have received a new message!',
													'icon': "../assets/img/favicon.ico",
													'url': "/chats/" + conversation._id
												});
												if (this.showNotification) {
													this._notificationService.generateNotification(notif_data);
												}
											}
											conversation.messageReadCount += 1;
										}
									}
									// else {
									// 	this.socket.emit('seenConversation', data.cid);
									// }
								}
							});
						}

						// this.AllConversations.getValue().map((conversation, index) => {
						// 	//////console.log(conversation);
						// 	if (conversation._id == data.cid) {

						// 		if (this.currentConversation.getValue()._id == data.cid) {
						// 			this.UpdateMessageSentStatus({
						// 				sessionid: conversation.sessionid,
						// 				cid: conversation._id,
						// 				type: 'Visitors'
						// 			})
						// 		}

						// 		conversation.messages.push(data);
						// 		if (data.type != 'Agents') {
						// 			if (this.currentConversation.getValue()._id == data.cid) selectedConversation = true;

						// 			if (this.currentConversation.getValue()._id != data.cid || !this.windowFocused || !this.autoScroll.getValue()) {
						// 				if (conversation.messageReadCount == 0) {
						// 					let notif_data: Array<any> = [];
						// 					notif_data.push({
						// 						'title': 'New Message!',
						// 						'alertContent': 'You have received a new message!',
						// 						'icon': "../assets/img/favicon.ico",
						// 						'url': "/chats/" + conversation._id
						// 					});
						// 					if (this.showNotification) {
						// 						this._notificationService.generateNotification(notif_data);
						// 					}
						// 				}
						// 				conversation.messageReadCount += 1;
						// 			}
						// 		} else {
						// 			this.socket.emit('seenConversation', data.cid);
						// 		}
						// 		//Shifting That Conversation on Top.
						// 		this.AllConversations.getValue().splice(index, 1);
						// 		this.AllConversations.getValue().unshift(conversation);
						// 		this.AllConversations.next(this.AllConversations.getValue());
						// 		if (selectedConversation) this.newMesagedRecieved.next(data);
						// 	}
						// });

					});
					this.socket.on('stopConversation', (data) => {


						let found = false;
						let currentConversation = JSON.parse(JSON.stringify(this.currentConversation.getValue()));
						this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
							if (data.conversation._id == conversation._id) {
								this.SendTypingEventRest({ state: false, conversation: data.conversation }).subscribe(data => {
								})
								conversation.synced = true;
								conversation.ended = true;
								conversation.state = 3;
								conversation.session = data.conversation.session;
								conversation.lastmodified = new Date().toISOString();
								if (conversation.messages && conversation.messages.length > 0) {
									conversation.lastmessage = conversation.messages[conversation.messages.length - 1];
								}
								found = true;
							}
							if (this.currentConversation.getValue()._id == data.conversation._id) {
								this.currentConversation.getValue().ended = true;

							}
							if ((data.conversation._id == conversation._id) && (this.currentConversation.getValue()._id == data.conversation._id)) {
								this.currentConversation.next(conversation);
							}
							return conversation;
						}));

						this.chatHistoryList.next(this.chatHistoryList.getValue().map(history => {
							if (history.deviceID == data.conversation.deviceID) {
								if (!history.conversations) history.conversations = [];
								history.conversations.unshift(data.conversation);
								if (history.deviceID == this.currentConversation.getValue().deviceID) {
									this.selectedChatHistory.next(history)
								}
							}
							return history
						}));

						//Added After (Inactive) Process Update
						//Since Inactive users conversation is removed from current list
						//Upon ending conversation based on timers won't exist Hence it doesn't need to be synced true.
						if (!found) {

							//conversation will remain in inbox due to state 4

							// this.Archives.getValue().unshift(data.conversation)
							// this.Archives.next(this.Archives.getValue());
						}
					});
					this.socket.on('makeConversationInactive', (data) => {


						let currentConversation = this.currentConversation.getValue();
						this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
							if (data.conversation._id == conversation._id) {
								this.SendTypingEventRest({ state: false, conversation: data.conversation }).subscribe(data => {
								})
								conversation.synced = true;
								conversation.lastmodified = new Date().toISOString();
								conversation.inactive = data.conversation.inactive;
							}
							if ((data.conversation._id == conversation._id) && (this.currentConversation.getValue()._id == data.conversation._id)) {
								this.SendTypingEventRest({ state: false, conversation: this.currentConversation.getValue() }).subscribe(data => {
								})
								this.currentConversation.getValue().messages.push(data.status)

							}
							return conversation
						}));

					});
					this.socket.on('makeConversationActive', (data) => {

						let currentConversation = this.currentConversation.getValue();
						let found = false;
						this.AllConversations.next(this.AllConversations.getValue().map(conversation => {

							if (data.conversation._id == conversation._id) {
								conversation = data.conversation;
								found = true;
							}
							return conversation
						}));
						if (!found) (this.AllConversations.getValue() as Array<any>).unshift(data.conversation);
					});
					this.socket.on('removeConversation', (data) => {

						let found = false;
						let currentConversation = this.currentConversation.getValue();
						this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
							if (data.conversation._id == conversation._id) {


								// this.RemovePreviousArchivesForChat(data.conversation._id).subscribe(data => {
								// 	if (data) {
								this.SendTypingEventRest({ state: false, conversation: data.conversation }).subscribe(data => {
								})
								conversation.synced = true;
								conversation.ended = true;
								conversation.state = 3;
								conversation.lastmodified = new Date().toISOString();
								if (conversation.messages && conversation.messages.length > 0) {
									conversation.lastmessage = conversation.messages[conversation.messages.length - 1];
								}
								//this.moveToArchive(conversation, conversation, true);
								found = true;
								// 	}
								// })
							}
							if (this.currentConversation.getValue()._id == data.conversation._id) {
								//this.clearAttachmentFiles.next(true)
								this.currentConversation.getValue().ended = true;
							}
							if ((data.conversation._id == conversation._id) && (this.currentConversation.getValue()._id == data.conversation._id)) {
								this.SendTypingEventRest({ state: false, conversation: this.currentConversation.getValue() }).subscribe(data => {
								})
								this.DiscardCurrentConversation()
							}
							//if want to hide message area
							//this.currentConversation.next(currentConversation);
							//if want to remove entire display


							return data.conversation._id != conversation._id
							//return conversation
						}));



						//Added After (Inactive) Process Update
						//Since Inactive users conversation is removed from current list
						//Upon ending conversation based on timers won't exist Hence it doesn't need to be synced true.
						if (!found) {

							//conversation will remain in inbox due to state 4

							// this.Archives.getValue().unshift(data.conversation)
							// this.Archives.next(this.Archives.getValue());
						}
					});
					//Event To Handle Visitor Typing state
					this.socket.on('typingState', (data) => {
						this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
							if (conversation.sessionid == data.sid) {

								conversation.typingState = data.state;
							}
							return conversation;
						}))
					});
					//Event To Handle Sneak Peak Data
					this.socket.on('visitorSneakPeak', (data) => {

						this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
							if (conversation.sessionid == data.sid) {

								conversation.typingData = data.msg;
							}
							return conversation;
						}))
						if (this.currentConversation.getValue().sessionid == data.sid) {
							this.currentConversation.getValue().typingData = data.msg;
							this.currentConversation.next(this.currentConversation.getValue())
						}
					});
					//delivery status from visitor
					this.socket.on("privateMessageSent", (response: any) => {


						this.AllConversations.next(this.AllConversations.getValue().map(conversation => {

							if (conversation._id == response.cid) {

								conversation.messages.map(msg => {

									if (msg.type != 'Visitors') {
										msg.sent = true
									}
									return msg
								})
							}
							return conversation;
						}))
					});
					this.socket.on('updateUserInfo', (data) => {
						this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
							if (conversation._id == data.cid) {
								conversation.visitorEmail = data.email;
								conversation.visitorName = data.username;
							}
							return conversation;
						}));
					});
					this.socket.on('updateAdditionalDataInfo', (data) => {

						// ////console.log(data);
						// this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
						//   if (conversation._id == data.cid) {
						//     conversation.visitorEmail = data.email;
						//     conversation.visitorName = data.username;
						//   }
						//   return conversation;
						// }));
					});
					this.socket.on('toggleChatMode', (data) => {

						this._authService.setAcceptingChatMode((data.state == 'on') ? true : false);
					});
					this.socket.on('gotChatTicketDetails', (data) => {
						if (data.cid && data.ticket) this.UpdateChatTicketDetails(data.ticket, data.cid);
					});
					this.socket.on('requestQueue', (data) => {
						this.autoSync = true;
					});
				}
				this.GetCannedFormsRest();
			}

		});

		//this.GetChatSettingsFromStorage()


	}

	public UpdateMessageSentStatus(data) {
		this.socket.emit('privateMessageRecieved', data, (response) => {
			if (response.status == 'ok') {
			}
		});
	}

	public UpdateMessageSentStatusRest(data) {
		try {
			this.http.post(this.chatServiceURL + '/privateMessageRecieved', data).subscribe((response) => {
				if (response.json()) {
					let data = response.json()
					if (data.status == 'ok') {
					}
				}
			}, err => {
				//console.log(err);

			});
		}
		catch (e) { }
	}

	setDraftFiles(cid, draft, arrToDialog) {


		this.AllConversations.getValue().map(conv => {
			if (conv._id == cid) {
				conv.attachments = draft;
				conv.arrToDialog = arrToDialog;
				return conv;
			}
		});
		this.AllConversations.next(this.AllConversations.getValue());

	}

	public GetCannedForms() {
		this.socket.emit('getFormsByNSP', {}, (response) => {
			if (response.status == 'ok') {
				this.CannedForms.next(response.form_data);

			}
		});
	}
	public GetCannedFormsRest() {
		try {
			this.http.post(this.chatServiceURL + '/getFormsByNSP', { sessionid: this.Agent.csid, nsp: this.Agent.nsp }).subscribe((data) => {

				if (data.json()) {
					let response = data.json()
					if (response.status == 'ok') {
						this.CannedForms.next(response.form_data);

					}
				}
			}, err => {
				this.CannedForms.next([]);

			});
		} catch (error) {
			//console.log(error);

		}
	}

	RequesetQueAuto() {
		this.socket.emit('requestQueueAuto', {}, (data) => {
			if (data.status == 'ok') {
				if (data.more) {
					this.AutoSync.next(true);

					this.notification.next({
						msg: "You've got the new Conversation",
						type: 'success',
						img: 'ok'
					});

					let notif = [];
					notif.push({
						'title': 'New Conversation!',
						'alertContent': "You got a new conversation!",
						'icon': "../assets/img/favicon.ico",
						'url': "/chats/"
					});
					if (this.showNotification) {
						this._notificationService.generateNotification(notif);
					}
				}
			}
		})
	}

	RequestQueAutoRest() {
		try {
			this.http.post(this.chatServiceURL + '/requestQueAuto', { sessionid: this.Agent.csid, nsp: this.Agent.nsp }).subscribe(response => {
				if (response.json()) {
					let data = response.json();
					if (data.more) {
						this.AutoSync.next(true);
						this.notification.next({
							msg: "You've got the new Conversation",
							type: 'success',
							img: 'ok'
						});

						let notif = [];
						notif.push({
							'title': 'New Conversation!',
							'alertContent': "You got a new conversation!",
							'icon': "../assets/img/favicon.ico",
							'url': "/chats/"
						});
						if (this.showNotification) {
							this._notificationService.generateNotification(notif);
						}
					}
				}
			}, err => {
				console.log(err);
			});
		}
		catch (e) {
			console.log(e);

		}
	}


	public InserNewConversation(conversation) {
		if (conversation.messages == undefined) {
			conversation.messages = [];
		}
		this.AllConversations.getValue().unshift(conversation);
		this.AllConversations.next(this.AllConversations.getValue());
	}
	public InsertCustomerDefaultEmail(UserDefault, cid, nsp): Observable<any> {
		//console.log(details.thread)

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/InsertEmail', { UserDefault: UserDefault, cid: cid, nsp: nsp }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//   console.log(response)
						if (response.status == 'ok') {
							this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
								if (conversation._id == cid) {
									conversation.UserEmail = response.conversation.UserEmail
									if (this.currentConversation.getValue()._id == cid) this.currentConversation.next(conversation)

								}
								return conversation
							}));

							observer.next(response)
							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}

	public InsertCustomerID(customerID, cid, nsp): Observable<any> {
		//console.log(details.thread)

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/InsertID', { customerID: customerID, cid: cid, nsp: nsp }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//   console.log(response)
						if (response.status == 'ok') {
							this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
								if (conversation._id == cid) {
									conversation.CMID = response.conversation.CMID
									if (this.currentConversation.getValue()._id == cid) this.currentConversation.next(conversation)

								}
								return conversation
							}));

							observer.next(response)
							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public IsCustomerRegistered(registered, cid, nsp): Observable<any> {
		//console.log(details.thread)

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/IsCustomer', { registered: registered, cid: cid, nsp: nsp }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//   console.log(response)
						if (response.status == 'ok') {
							this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
								if (conversation._id == cid) {
									conversation.Registered = response.conversation.Registered
									if (this.currentConversation.getValue()._id == cid) this.currentConversation.next(conversation)

								}
								return conversation
							}));

							observer.next()
							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public InsertCustomerInfo(customerInfo, cid, nsp): Observable<any> {


		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/InsertCustomerInfo', { customerInfo, cid: cid, nsp: nsp }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						console.log(response)
						if (response.status == 'ok') {
							//	console.log(response.conversation)
							this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
								if (conversation._id == cid) {

									conversation.CustomerInfo = response.conversation.CustomerInfo
									if (this.currentConversation.getValue()._id == cid) this.currentConversation.next(conversation)

								}
								return conversation
							}));

							observer.next()
							observer.complete()

						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public InsertSimilarCustomers(allCustomers, cid, nsp): Observable<any> {
		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/InsertSimilarCustomers', { allCustomers, cid: cid, nsp: nsp }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//console.log(response)
						if (response.status == 'ok') {
							console.log(response.conversation)
							this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
								if (conversation._id == cid) {

									conversation.RelatedCustomerInfo = response.conversation.RelatedCustomerInfo
									if (this.currentConversation.getValue()._id == cid) this.currentConversation.next(conversation)

								}
								return conversation
							}));

							observer.next()
							observer.complete()

						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}

	public CheckRegisterCustomerRest(custData, _id, customerID): Observable<any> {

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/CheckRegistration', { custData: custData, customerID: customerID }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//  console.log(response)
						if (response.status == 'ok') {
							// this.AllConversations.next(this.AllConversations.getValue().map(conversation => {

							// 	return conversation
							// }));
							response.response._id = _id
							observer.next(response)

							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public CustomerRegisterRest(details): Observable<any> {
		//console.log(details.thread)

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/RegisterCustomer', { details: details.thread }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//   console.log(response)
						if (response.status == 'ok') {

							observer.next(response)
							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public StockListRest(details): Observable<any> {
		//console.log(details.thread)

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/StockList', { details: details }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//   console.log(response)
						if (response.status == 'ok') {

							observer.next(response)
							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public GetSalesAgent(ID): Observable<any> {
		//console.log(details.thread)

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/SalesAgent', { ID: ID }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//  console.log(response)
						if (response.status == 'ok') {

							observer.next(response)
							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public GetMasterData(ID): Observable<any> {
		//console.log(details.thread)

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/MasterData', { ID: ID }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//  console.log(response)
						if (response.status == 'ok') {

							observer.next(response.response)
							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public GetCarNameMasterData(ID): Observable<any> {
		//console.log(details.thread)

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/CarNameMasterData', { ID: ID }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//  console.log(response)
						if (response.status == 'ok') {

							observer.next(response.response)
							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public GetCarModelMasterData(makerID, nameID): Observable<any> {
		//console.log(details.thread)

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/CarModelMasterData', { makerID: makerID, nameID: nameID }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						//  console.log(response)
						if (response.status == 'ok') {

							observer.next(response.response)
							observer.complete()
						}
						else {
							observer.next([])
							observer.complete()
						}
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}
	public TransferChatRest(AgentID: any, sid, discardCurrentChat = false): Observable<any> {

		return new Observable((observer) => {
			try {
				this.http.post(this.chatServiceURL + '/transferChat', { to: AgentID, visitor: sid, sessionid: this.Agent.csid }).subscribe((data) => {

					if (data.json()) {
						let response = data.json();
						if (response.transfer == 'ok') {

							// if (discardCurrentChat) if (this.currentConversation.getValue()._id == currentconversation._id) this.DiscardCurrentConversation();

							// this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
							// 	return conversation._id != currentconversation._id;
							// }));
							observer.next(true)
							observer.complete()

						} else {
							if (response.transfer == 'error-inactive') {

								this.notification.next({
									msg: response.msg,
									type: 'error',
									img: 'warning'
								});
								observer.next(false)
								observer.complete()
							}
						}
					}
					else {
						observer.next(false)
						observer.complete()
					}

				}, err => {
					//console.log(err)
					observer.next(false)
					observer.complete()
				});
			} catch (error) {
				observer.next(false)
				observer.complete()
			}
		});

	}

	public TransferChat(AgentID: any, currentconversation) {

		this.socket.emit('transferChat', { to: AgentID, visitor: currentconversation.sessionid }, (response) => {
			if (response.transfer == 'ok') {
				//  ////console.log('Transfer OK');
				if (this.currentConversation.getValue()._id == currentconversation._id) this.DiscardCurrentConversation();
				// this.DiscardCurrentConversation();
				this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
					return conversation._id != currentconversation._id;
				}));

			} else {
				if (response.transfer == 'error-inactive') {

					this.notification.next({
						msg: response.msg,
						type: 'error',
						img: 'warning'
					});
				}
			}

		});

	}

	private DiscardCurrentConversation() {
		this.currentConversation.next({});
		this.selectedVisitor.next({});
	}

	// GetChatSettingsFromStorage() {

	// 	let chatSettings: any = JSON.parse(localStorage.getItem('chatSettings'));

	// 	if (chatSettings && chatSettings.tagList && chatSettings.tagList.length) {
	// 		this.tagList.next(chatSettings.tagList)
	// 	}
	// }

	tagsFetched = false
	GetTagList(): Observable<any> {
		return new Observable((observer) => {
			if (!this.tagsFetched) {

				// this.socket.emit('chatTagsList', {}, (response => {
				// 	this.tagsFetched = true;
				// 	if (response.status == 'ok') {
				// 		this.tagList.next(response.tags);
				// 		observer.next(response.tags);
				// 	} else {
				// 		this.tagList.next([]);
				// 		observer.next([]);
				// 	}
				// }))
				this.http.post(this.chatServiceURL + '/chatTagsList', { nsp: this.Agent.nsp }).subscribe(response => {
					if (response.json()) {
						let data = response.json();
						if (data.status == 'ok') {
							this.tagList.next(data.tags);
							observer.next(data.tags);
						} else {
							this.tagList.next([]);
							observer.next([]);
						}
					}
				})
			} else {
				observer.next(this.tagList.getValue());
			}
		})

		// return new Observable((observer) => {
		// 	let chatSettings: any = JSON.parse(localStorage.getItem('chatSettings'));

		// 	if (chatSettings && chatSettings.tagList && chatSettings.tagList.length) {
		// 		observer.next(chatSettings.tagList);
		// 		observer.complete();
		// 	}
		// })
	}


	public GetLiveAgent(location: string): Observable<any> {
		//////console.log("I'M HERE In Chat Service");
		return new Observable(observer => {
			// this.socket.emit('getLiveAgents', {}, (data) => {
			// 	// Object.keys(data).map(agent => {
			// 	//   if (!data[agent].acceptingChats) {
			// 	//     delete data[agent];
			// 	//   }
			// 	// });
			// 	// console.log('Got Live Agents');
			// 	observer.next(data);
			// });
			this.http.post(this.chatServiceURL + '/getLiveAgents', { nsp: this.Agent.nsp, csid: [this.Agent.csid] }).subscribe(response => {
				if (response.json()) {
					let data = response.json();
					observer.next(data);
					observer.complete();
				}
			})
		});
	}

	public EndChat(conversation): Observable<any> {
		return Observable.create(observer => {
			let currentconversation = JSON.parse(JSON.stringify(conversation))
			this.socket.emit('endConversation', { sid: currentconversation.sessionid, cid: currentconversation._id }, (response) => {

				if (response.status == 'ok') {
					if (response.conversation && response.conversation.state == 4) {
						this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
							if (conversation._id == currentconversation._id) {
								this.moveToArchive(conversation, response.conversation);
							}
							return conversation._id != response.conversation._id;
						}));
						// this.chatHistoryList.next(this.chatHistoryList.getValue().map(history => {
						// 	if (history.deviceID == response.conversation.deviceID) {
						// 		history.conversations.unshift(response.conversation);
						// 	}
						// 	return history
						// }));
						if (this.currentConversation.getValue()._id == currentconversation._id) this.DiscardCurrentConversation();
						observer.next(true);
						observer.complete();
					}
					else {
						observer.next(false);
						observer.complete();
					}

				} else {
					if (response.status == 'error-inactive') {
						this.notification.next({
							msg: response.msg,
							type: 'error',
							img: 'warning'
						});
					}
					observer.next(true);
					observer.complete();
				}
			});
		});
		// this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
		// 	if (conversation._id == this.currentConversation.getValue()._id) {
		// 		//this.moveToArchive(conversation, currentconversation);
		// 		conversation.synced = true;
		// 		conversation.ended = true;
		// 		conversation.state = 3;
		// 		conversation.lastmodified = new Date().toISOString();
		// 		if (conversation.messages && conversation.messages.length > 0) {
		// 			conversation.lastmessage = conversation.messages[conversation.messages.length - 1];
		// 		}
		// 	}
		// 	return conversation
		// }));
		// this.DiscardCurrentConversation();
	}

	public EndChatRest(conversation): Observable<any> {
		return Observable.create(observer => {
			try {
				let currentconversation = JSON.parse(JSON.stringify(conversation))
				let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				this.http.post(this.chatServiceURL + '/endChat', { chatEndedByAgent: true, sid: currentconversation.sessionid, cid: currentconversation._id, timeZone: timeZone }).subscribe((data) => {
					if (data.json()) {
						let response = data.json();
						if (response.status == 'ok') {
							if (response.conversation && response.conversation.state == 4) {
								this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
									if (conversation._id == currentconversation._id) {
										this.moveToArchive(conversation, response.conversation);
									}
									return conversation._id != response.conversation._id;
								}));

								if (this.currentConversation.getValue()._id == currentconversation._id) this.DiscardCurrentConversation();
								observer.next(true);
								observer.complete();
							}
							else {
								observer.next(false);
								observer.complete();
							}

						} else {
							if (response.status == 'error-inactive') {
								this.notification.next({
									msg: response.msg,
									type: 'error',
									img: 'warning'
								});
							}
							observer.next(true);
							observer.complete();
						}
					}
					else {
						observer.next(false);
						observer.complete();
					}
				}, err => {

					observer.next(false);
					observer.complete();

				});
			} catch (error) {
				observer.next(false);
				observer.complete();
			}
		});
		// this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
		// 	if (conversation._id == this.currentConversation.getValue()._id) {
		// 		//this.moveToArchive(conversation, currentconversation);
		// 		conversation.synced = true;
		// 		conversation.ended = true;
		// 		conversation.state = 3;
		// 		conversation.lastmodified = new Date().toISOString();
		// 		if (conversation.messages && conversation.messages.length > 0) {
		// 			conversation.lastmessage = conversation.messages[conversation.messages.length - 1];
		// 		}
		// 	}
		// 	return conversation
		// }));
		// this.DiscardCurrentConversation();
	}

	RemoveDuplicateFromLinearArray(array) {

		let arr = {};
		array.map(value => { arr[value] = value });
		return Object.keys(arr);

	}


	CheckUrl(msg: any): Observable<any> {
		return new Observable(observer => {
			let match = ((msg as string).match(this.urlRegex));
			let joined = '';
			let splitted = []
			let a = []
			if (match && match.length) {
				//for line break
				msg = msg.replace(/(?:\r\n|\r|\n)/g, ' (lb) ');
				//msg = msg.replace(/(?:\r\n|\r|\n)/g, ' ');
				match = this.RemoveDuplicateFromLinearArray(match)
				if (match && match.length) {

					splitted = msg.split(' ');
					a = splitted.map((x, index) => {
						match.map(links => {

							let url = links.replace(/www./, '');
							url = ((links.indexOf("http") === -1) ? 'http://' : '') + links
							let replaced = links.replace(links, '<a href="' + url + '" target="_blank">' + links + '</a>');
							if (links == x) x = replaced

						});
						if (index != splitted.length - 1) joined += x + ' '
						else joined += x
						return x

					})
				}
				observer.next(joined.split(' (lb) ').join('\n'));
				observer.complete();
			}
			else {
				observer.next(msg);
				observer.complete();
			}
		})
	}



	ReplaceHtmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	public SendMessage(conversation, message) {

		message.body = this.ReplaceHtmlEntities(message.body)

		this.CheckUrl(message.body).subscribe(body => {
			message.body = body;
			this.currentConversation.getValue().messages.push(message);
			let messageIndex = this.currentConversation.getValue().messages.length - 1;
			this.AllConversations.getValue().map((conversation, index) => {

				if (conversation._id == message.cid) {
					this.AllConversations.getValue().splice(index, 1);
					this.AllConversations.getValue().unshift(conversation);
					this.AllConversations.next(this.AllConversations.getValue());
					this.currentConversation.next(conversation);
				}
			});
			this.socket.emit('privateMessage', {
				sessionId: conversation.sessionid,
				message: message
			}, (response) => {
				//console.log(response);
				
				if (response.status == 'ok') {
					this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
						if (conversation._id == response.cid) {
							conversation.messages[messageIndex].date = response.date
							conversation.messages[messageIndex].delivered = response.delivered
						}
						return conversation;
					}));
				} else {
					if (response.status == 'error-not-permitted') {
						this.notification.next({
							msg: response.msg,
							type: 'error',
							img: 'warning'
						})
						this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
							return message.cid != conversation._id
						}));
						this.currentConversation.next({});
						this.selectedVisitor.next({});
					}
				}
			});
		})
	}


	// public SendAttachment(sessionId, message, filename) {
	// 	//console.log(message);

	// 	this.socket.emit('privateMessage', {
	// 		sessionId: sessionId,
	// 		message: message
	// 	}, (response) => {
	// 		if (response.status == 'ok') {
	// 			this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
	// 				if (conversation._id == response.cid) {
	// 					conversation.messages[messageIndex].date = response.date
	// 				}
	// 				return conversation;
	// 			}));
	// 		}
	// 	});
	// 	this.currentConversation.getValue().messages.push(message);
	// 	let messageIndex = this.currentConversation.getValue().messages.length - 1;
	// 	this.currentConversation.getValue().attachments = [];
	// 		this.currentConversation.getValue().arrToDialog = [];
	// 	this.AllConversations.getValue().map((conversation, index) => {

	// 		if (conversation._id == message.cid) {
	// 			this.AllConversations.getValue().splice(index, 1);
	// 			this.AllConversations.getValue().unshift(conversation);
	// 			this.AllConversations.next(this.AllConversations.getValue());
	// 			this.currentConversation.next(conversation);
	// 		}
	// 	});
	// 	this.currentConversation.getValue().attachments = [];
	// }

	public SendAttachment(sessionId, message, filename?): Observable<any> {

		return new Observable(observer => {
			let messageIndex;
			this.socket.emit('privateMessage', {
				sessionId: sessionId,
				message: message
			}, (response) => {
				if (response.status == 'ok') {
					this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
						if (conversation._id == response.cid) {
							conversation.messages[messageIndex].date = response.date
						}
						if ((conversation._id == response.cid) && (this.currentConversation.getValue()._id == response.cid)) this.currentConversation.next(conversation);
						return conversation;
					}));
				}
			});

			let conversationIndex = this.AllConversations.getValue().findIndex(c => c._id == message.cid);

			let conversation = this.AllConversations.getValue()[conversationIndex];
			conversation.messages.push(message)
			messageIndex = conversation.messages.length - 1;
			this.AllConversations.getValue().splice(conversationIndex, 1);
			this.AllConversations.getValue().unshift(conversation);
			if ((conversation._id == message.cid) && (this.currentConversation.getValue()._id == message.cid)) this.currentConversation.next(conversation);

			// this.AllConversations.getValue().map((conversation, index) => {
			// 	if (conversation._id == message.cid) {
			// 		conversation.messages.push(message);
			// 		messageIndex = conversation.messages.length - 1;
			// 		this.AllConversations.getValue().splice(index, 1);
			// 		this.AllConversations.getValue().unshift(conversation);
			// 		if ((conversation._id == message.cid) && (this.currentConversation.getValue()._id == message.cid)) this.currentConversation.next(conversation);
			// 	}
			// 	return conversation;
			// });

			this.AllConversations.next(this.AllConversations.getValue())
			observer.next({ status: "ok" });
			observer.complete();
		});

	}

	public logout() {
		this.socket.emit('logout');
	}

	public getConversationsListFromBackEnd(deviceID): Observable<any> {

		return new Observable(observer => {
			// this.socket.emit('CustomerConversationsList', { deviceID: deviceID }, (response) => {
			// 	if (response.status == 'ok' && response.conversations && response.conversations.length > 0) {

			// 		observer.next(response.conversations);
			// 		observer.complete();
			// 	} else {
			// 		observer.next([]);
			// 		observer.complete();

			// 	}
			// });
			this.http.post(this.chatServiceURL + '/customerConversationsList', { deviceID: deviceID, nsp: this.Agent.nsp }).subscribe(response => {
				if (response.json()) {
					let data = response.json();
					if (data.status == 'ok' && data.conversations && data.conversations.length > 0) {
						observer.next(data.conversations);
						observer.complete();
					} else {
						observer.next([]);
						observer.complete();
					}
				}
			})
		})
	}


	public getMoreConversationsFromBackend(deviceID, id) {
		try {
			// this.socket.emit('MoreCustomerConversationsList', { deviceID: deviceID, id: id }, (response) => {
			// 	if (response.status == 'ok' && response.conversations && response.conversations.length > 0) {

			// 		this.chatHistoryList.next(this.chatHistoryList.getValue().map(history => {
			// 			if (history.deviceID == deviceID) {
			// 				history.conversations = history.conversations.concat(response.conversations);
			// 				history.noMoreChats = response.noMoreChats
			// 				this.selectedChatHistory.next(history)
			// 			}
			// 			return history
			// 		}))

			// 	}
			// });

			this.http.post(this.chatServiceURL + '/moreCustomerConversationsList', { deviceID: deviceID, id: id }).subscribe(response => {
				if (response.json()) {
					let data = response.json();
					if (data.status == 'ok' && data.conversations && data.conversations.length > 0) {
						this.chatHistoryList.next(this.chatHistoryList.getValue().map(history => {
							if (history.deviceID == deviceID) {
								history.conversations = history.conversations.concat(data.conversations);
								history.noMoreChats = data.noMoreChats
								this.selectedChatHistory.next(history)
							}
							return history
						}))
					}
				}
			})
		}
		catch (e) {
			//console.log('error in fetching more conversations')
		}


	}

	//Same Function Called From Main Component OnFocus Event and router.link == chats
	setCurrentConversation(cid) {
		let currentConversation: any = JSON.parse(JSON.stringify(this.currentConversation.getValue()));
		if (cid && currentConversation && currentConversation._id && (cid != currentConversation._id)) {

			this.SendTypingEventRest({ state: false, conversation: currentConversation }).subscribe(data => {

				this.tempTypingState.next(false)
			})
		}
		else {
			this.SendTypingEventRest({ state: false, conversation: currentConversation }).subscribe(data => {

				this.tempTypingState.next(false)
			})

		}

		this.AllConversations.getValue().map(conversation => {

			if (conversation._id == cid) {

				if (conversation.deviceID) this.GetChatHistoryForDeviceID(conversation.deviceID);
				this._appStateService.setChatBar(true);
				this.currentConversation.next(conversation);

				setTimeout(() => {
					(this.autoScroll.getValue()) ? this.currentConversation.next(this.conversationSeen()) : undefined;
				}, 10);
				if (Object.keys(this.visitorList.getValue()).length > 0) {
					if (this.visitorList.getValue()[conversation.sessionid] != undefined) {
						this.selectedVisitor.next(this.visitorList.getValue()[conversation.sessionid]);
					} else {
						this.selectedVisitor.next({});
					}
				} else this.selectedVisitor.next({});
			}
		});
	}

	public ShowSelectedChat(conversation): Observable<any> {
		return new Observable(observer => {
			// this.socket.emit('SelectedConversationDetails', { cid: conversation._id }, (response => {
			// 	if (response.status == "ok" && response.msgList) {
			// 		observer.next(response.msgList)

			// 		observer.complete();
			// 	}
			// }));
			this.http.post(this.chatServiceURL + '/selectedConversationDetails', { cid: conversation._id }).subscribe(response => {
				if (response.json()) {
					let data = response.json();
					if (data.status == "ok" && data.msgList) {
						observer.next(data.msgList);
						observer.complete();
					}
				}
			})
		})
	}

	public UpdateChatHistory(conversation: any, messages: any) {

		this.chatHistoryList.next(this.chatHistoryList.getValue().map((history) => {
			if (conversation.deviceID == history.deviceID) {

				history.conversations.map(convo => {
					if (convo._id == conversation._id) {
						convo.msgList = messages;
						convo.msgFetched = true;
					}

					return convo;
				});
				this.selectedChatHistory.next(history)
			}
			return history
		}));

	}

	ExtractSessionInfo(history) {

		if (!history.sessionInfo) history.sessionInfo = [];
		if (history.conversations) {
			history.conversations.map(convo => {

				let info: any = {};
				info._id = convo.sessionid;
				info.deviceID = convo.deviceID;
				info.agentemail = convo.agentEmail;
				info.visitorName = convo.visitorName;
				info.createdOn = convo.createdOn;

				history.sessionInfo.push(info);
			});

			this.selectedChatHistory.next(history);
			this.chatHistoryList.next(this.chatHistoryList.getValue().map((data) => {
				if (data.deviceID == history.deviceID) data = history

				return data
			}));
		}
	}


	getCurrentConversation(): BehaviorSubject<any> {
		return this.currentConversation;

	}


	public GetConverSations(filters = {}) {
		// this.socket.emit('getConversations', this.Agent.email);
		this.http.post(this.chatServiceURL + '/getConversations', { email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(response => {
			// console.log(response.json());
			if (response.json()) {
				let data = response.json();
				let conversations: Array<any> = (data && data.conversations && data.conversations.length) ? data.conversations : []
				// let conversations: Array<any> = (data) ? data : [];
				this.inboxChunk = (data.ended) ? -1 : this.inboxChunk + 1;
				conversations = conversations.sort((a, b) => {

					if (a.state == 2) return -1
					if (a.messages.length && b.messages.length) {
						let aDate: Date = new Date(a.messages[a.messages.length - 1].date);
						let bDate: Date = new Date(b.messages[b.messages.length - 1].date);
						return (aDate.getTime() - bDate.getTime() > 0) ? -1 : 1;
					} else if (a.messages.length && !b.messages.length) {
						return -1;
					} else if (!a.messages.length && b.messages.length) {
						return 1;
					} else {
						return (new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime() > 0) ? -1 : 1
					}
				});

				// ////console.log(conversations);
				//Case To Maintain SneakPeak State of Visitor After Refresh
				let temp = conversations.map(conversation => {
					if (conversation && conversation.superviserAgents && conversation.superviserAgents.length) {

						if (conversation.superviserAgents.includes(((this.Agent.csid as Object)))) this.SuperVisedChatList.getValue().push(conversation._id)
					}
					if (this.visitorList.getValue()[conversation.sessionid] != undefined) {
						conversation.typingState = this.visitorList.getValue()[conversation.sessionid].typingState;
					}
					return conversation;
				});


				//for duplication of chats during loading inbox chats and receiving new conversation in between
				temp = temp.filter(item => {
					return this.AllConversations.getValue().find(item2 => {
						return ((item._id == item2._id));
					}) == undefined;
				});
				this.AllConversations.next((this.AllConversations.getValue() as Array<any>).concat(temp));
				this.setLoading(false, 'CURRENTCONVERSATIONS')
				if (this.autoSync) {
					this.autoSync = false;
					this.AutoSync.next(true);
				}
				this.conversationsFetched = true;
			}
		})

	}

	public GetAllConversations(): Observable<any> {
		return this.AllConversations.asObservable();
	}

	public Destroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	public GetSelectedVisitor(): Observable<any> {
		return this.selectedVisitor.asObservable();
	}

	public ToogleChatMode(acceptingChat: boolean) {

		this.socket.emit('toogleChatMode', { acceptingChats: acceptingChat }, (response) => {
			if (response.status == 'ok') {
				this._authService.setAcceptingChatMode(acceptingChat);
			}
		});
	}

	public conversationSeen(conversationObj = undefined): any {
		let conversation = (!conversationObj) ? this.currentConversation.getValue() : conversationObj;
		if (this.autoScroll.getValue() && (conversation.state == 2)) {

			this.UpdateMessageSentStatusRest({
				sessionid: conversation.sessionid,
				cid: conversation._id,
				type: 'Visitors'
			})
			if (conversation.messageReadCount > 0) {
				conversation.messageReadCount = 0;
				this.AllConversations.getValue().map(conv => {
					if (conv._id == conversation._id) {
						//moved to rest in update Message status api
						//this.socket.emit('seenConversation', conversation._id);
						conv = conversation;
					}
					return conv;
				});
				this.AllConversations.next(this.AllConversations.getValue())
			}
		}
		return conversation;
	}

	public getAcceptingChatMode(): Observable<any> {
		return this.acceptingChatMode.asObservable();
	}

	public getNotification(): Observable<string> {
		return this.notification.asObservable();
	}

	public setNotification(message: string) {
		this.notification.next(message);
	}


	public getAutoScroll(): Observable<any> {
		return this.autoScroll.asObservable();
	}

	public setAutoScroll(value: boolean) {
		this.autoScroll.next(value);
	}


	public getActiveTab(): Observable<any> {
		return this.activeTab.asObservable();
	}

	public setActiveTab(value: string) {
		this.activeTab.next(value);
	}

	public getArchivesSynced(): Observable<any> {
		return this.archivesSynced.asObservable();
	}

	public getArchives(): Observable<any> {
		return this.Archives.asObservable();
	}

	public setSelectedArchive(cid) {
		this.Archives.getValue().map(archive => {
			if (archive._id == cid) {
				if (archive.deviceID) this.GetChatHistoryForDeviceID(archive.deviceID);
				this.currentConversation.next(archive);
				this.selectedVisitor.next({});
			}
		});
	}


	public getArchivesFromBackend(filters = {}, query = []) {
		this.Archives.next([]);
		this.setLoading(true, 'ARCHIVES');
		// console.log(filters);

		// this.socket.emit('getArchives', { filters: filters }, (response) => {
		// 	let time = new Date().getTime();

		// 	if (response.status == 'ok') {

		// 		this.archivesSynced.next(true);
		// 		this.Archives.next(response.archives);
		// 		this.archiveChunk = (response.ended) ? -1 : this.archiveChunk + 1;
		// 		this.setLoading(false, 'ARCHIVES');
		// 	} else {
		// 		//TODO Error Logic Here
		// 	}
		// });
		this.http.post(this.chatServiceURL + '/getArchives', { email: this.Agent.email, nsp: this.Agent.nsp, filters: filters, query: query }).subscribe(response => {
			if (response.json()) {
				let data = response.json();
				if (data.status == 'ok') {
					// console.log(data.archives.length);
					this.archivesSynced.next(true);
					this.Archives.next(data.archives);
					this.archiveChunk = (data.ended) ? -1 : this.archiveChunk + 1;
					this.setLoading(false, 'ARCHIVES');
				} else {
					//TODO Error Logic Here
				}
			}
		})
	}

	public getMoreArchivesFromBackend() {
		if (this.archiveChunk != -1 && !this.loadingMoreArchives.getValue()) {
			this.setLoading(true, 'MOREARCHIVES');
			// this.socket.emit('getMoreArchives', { chunk: this.Archives.getValue()[this.Archives.getValue().length - 1].lastmodified, filters: this.Filters.getValue() }, (response) => {

			// 	if (response.status == 'ok') {
			// 		this.Archives.next(this.Archives.getValue().concat(response.archives));
			// 		this.archiveChunk = (response.ended) ? -1 : this.archiveChunk += 1
			// 		this.setLoading(false, 'MOREARCHIVES')
			// 	}
			// });
			this.http.post(this.chatServiceURL + '/getMoreArchives', { email: this.Agent.email, nsp: this.Agent.nsp, chunk: this.Archives.getValue()[this.Archives.getValue().length - 1].lastmodified, filters: this.Filters.getValue() }).subscribe(response => {
				if (response.json()) {
					let data = response.json();
					if (data.status == 'ok') {
						this.Archives.next(this.Archives.getValue().concat(data.archives));
						this.archiveChunk = (data.ended) ? -1 : this.archiveChunk += 1
						this.setLoading(false, 'MOREARCHIVES')
					}
				}
			})
		}
	}

	public getMoreArchivesInboxChats() {
		if (this.inboxChunk != -1 && !this.loadingMoreInbox.getValue()) {
			this.setLoading(true, 'MOREINBOXCHATS');
			// this.socket.emit('getMoreinboxChats', { chunk: this.AllConversations.getValue()[this.AllConversations.getValue().length - 1]._id }, (response) => {
			// 	if (response.status == 'ok') {
			// 		this.AllConversations.next(this.AllConversations.getValue().concat(response.conversations));
			// 		this.inboxChunk = (response.ended) ? -1 : this.inboxChunk += 1
			// 		this.setLoading(false, 'MOREINBOXCHATS')
			// 	}
			// });
			this.http.post(this.chatServiceURL + '/getMoreinboxChats', { email: this.Agent.email, nsp: this.Agent.nsp, chunk: this.AllConversations.getValue()[this.AllConversations.getValue().length - 1]._id }).subscribe(response => {
				if (response.json()) {
					let data = response.json();
					if (data.status == 'ok') {
						this.AllConversations.next(this.AllConversations.getValue().concat(data.conversations));
						this.inboxChunk = (data.ended) ? -1 : this.inboxChunk += 1
						this.setLoading(false, 'MOREINBOXCHATS')
					}
				}
			})
		}
	}

	public getArchiveMessages(cid: string) {
		if (!this.currentConversation.getValue().synced) {
			this.setLoading(true, 'MESSAGES');

			this.http.post(this.chatServiceURL + '/getArchiveMessages', { cid: cid }).subscribe(response => {
				if (response.json()) {
					let data = response.json();
					if (data.status == 'ok') {
						this.Archives.getValue().map(archive => {
							if (archive._id == cid) {
								data.messages.concat(archive.messages);
								archive.messages = data.messages;
								archive.synced = true;
								archive.ended = (data.ended) ? true : false
							}
						});
						this.setLoading(false, 'MESSAGES');
						this.Archives.next(this.Archives.getValue());
					}
				}
			})
			// this.socket.emit('getArchiveMessages', { cid: cid }, (response) => {
			// 	if (response.status == 'ok') {
			// 		this.Archives.getValue().map(archive => {
			// 			if (archive._id == cid) {
			// 				response.messages.concat(archive.messages);
			// 				archive.messages = response.messages;
			// 				archive.synced = true;
			// 				archive.ended = (response.ended) ? true : false
			// 			}
			// 		});
			// 		this.setLoading(false, 'MESSAGES');
			// 		this.Archives.next(this.Archives.getValue());
			// 	}
			// });
		}
	}


	public getMoreArchiveMessages(cid: string): Observable<any> {
		return new Observable(observer => {

			if (!this.currentConversation.getValue().ended) {
				this.setLoading(true, 'MOREMESSAGES');
				this.http.post(this.chatServiceURL + '/getMoreArchiveMessages', {
					cid: cid,
					lastMessage: this.currentConversation.getValue().messages[0]._id
				}).subscribe(response => {
					if (response.json()) {
						let data = response.json();
						if (data.status == 'ok') {
							this.Archives.getValue().map(archive => {
								if (archive._id == cid) {
									let messages = data.messages.concat(archive.messages);
									archive.messages = messages;
									archive.ended = (data.ended) ? true : false
									this.currentConversation.next(archive);
								}
							});
							this.setLoading(false, 'MOREMESSAGES');
							this.Archives.next(this.Archives.getValue());
							observer.next({ scroll: true });
							observer.complete();
						} else {
							observer.next({ scroll: false });
							observer.complete();
						}
					}
				});
				// this.socket.emit('getMoreArchiveMessages',
				// 	{
				// 		cid: cid,
				// 		lastMessage: this.currentConversation.getValue().messages[0]._id
				// 	}, (response) => {
				// 		if (response.status == 'ok') {
				// 			this.Archives.getValue().map(archive => {
				// 				if (archive._id == cid) {
				// 					let messages = response.messages.concat(archive.messages);
				// 					archive.messages = messages;
				// 					archive.ended = (response.ended) ? true : false
				// 					this.currentConversation.next(archive);
				// 				}
				// 			});
				// 			this.setLoading(false, 'MOREMESSAGES');
				// 			this.Archives.next(this.Archives.getValue());
				// 			observer.next({ scroll: true });
				// 			observer.complete();
				// 		} else {
				// 			observer.next({ scroll: false });
				// 			observer.complete();
				// 		}
				// 	});
			} else {
				observer.next({ scroll: false });
				observer.complete();
			}

		})

	}
	private RemovePreviousArchivesForChat(ArchiveId): Observable<any> {
		return new Observable(observer => {
			this.Archives.next(this.Archives.getValue().filter(conversation => { return ArchiveId != conversation._id }));
			observer.next(true)
			observer.complete();
		})
	}
	private RemovePreviousChatsFromInbox(cid): Observable<any> {
		return new Observable(observer => {
			this.AllConversations.next(this.AllConversations.getValue().filter(conversation => { return cid != conversation._id }));
			observer.next(true)
			observer.complete();
		})
	}
	private moveToArchive(conversation, removingConversation, id = false) {


		removingConversation.synced = false;
		removingConversation.ended = true;
		// removingConversation.state = 3;
		// removingConversation.lastmodified = new Date().toISOString();
		if (removingConversation.messages && removingConversation.messages.length > 0) {
			removingConversation.lastmessage = removingConversation.messages[removingConversation.messages.length - 1];
		}

		removingConversation.state = 4;
		removingConversation.lastmodified = new Date().toISOString();
		this.Archives.getValue().unshift(removingConversation)
		this.Archives.next(this.Archives.getValue());

	}

	public setLoading(value: boolean, type: string) {
		switch (type) {
			case 'ARCHIVES':
				this.loading.next(value);
				break;

			case 'MOREARCHIVES':
				this.loadingMoreArchives.next(value);
				break;
			case 'MOREINBOXCHATS':
				this.loadingMoreInbox.next(value);
				break;

			case 'MESSAGES':
				this.loadingMessages.next(value);
				break;

			case 'MOREMESSAGES':
				this.loadingMoreMessages.next(value);
				break;

			case 'CURRENTCONVERSATIONS':
				this.loadingCurrentConversation.next(value);
		}
	}
	public getLoading(type: string): Observable<any> {
		if (type == 'ARCHIVES') {
			return this.loading.asObservable();
		} else if (type == 'MOREARCHIVES') {
			return this.loadingMoreArchives.asObservable();
		} else if (type == 'MOREINBOXCHATS') {
			return this.loadingMoreInbox.asObservable();
		} else if (type == 'MESSAGES') {
			return this.loadingMessages.asObservable();
		} else if (type == 'CURRENTCONVERSATIONS') {
			return this.loadingCurrentConversation.asObservable();
		} else {
			return this.loadingMoreMessages.asObservable();
		}
	}

	private UpdateChatTicketDetails(details, cid) {
		if (this.activeTab.getValue() == 'INBOX') {

			this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
				// console.log(conversation);
				if (conversation._id == cid) {

					if (!conversation.tickets) conversation.tickets = [];

					conversation.tickets.push(details);
				}
				return conversation;
			}));
		} else if (this.activeTab.getValue() == 'ARCHIVE') {
			this.Archives.next(this.Archives.getValue().map(conversation => {
				// console.log(conversation);
				if (conversation._id == cid) {

					if (!conversation.tickets) conversation.tickets = [];

					conversation.tickets.push(details);
				}
				return conversation;
			}));
		}
	}


	public ConvertChatToTicket(data: any): Observable<any> {
		return new Observable(observer => {
			// this.socket.emit('convertChatToTicket', data, (response: any) => {
			// 	// console.log(response)
			// 	if (response.status == "ok") {
			// 		this.UpdateChatTicketDetails(response.ticket, response.cid);
			// 		observer.next(true);
			// 	}
			// 	else {
			// 		observer.error({ code: "stt", text: "Error in converting Chat To Ticket" });
			// 	}
			// });
			data.sessionid = this.Agent.csid;
			data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			this.http.post(this.chatServiceURL + '/convertChatToTicket', data).subscribe(data => {
				if (data.json()) {
					let response = data.json()
					if (response.status == "ok") {
						// this.UpdateChatTicketDetails(response.ticket, response.cid);
						observer.next(true);
						observer.complete()
					}
					else {
						observer.error({ code: "stt", text: "Error in converting Chat To Ticket" });
					}
				}

			})
		});
	}

	//Ban Chat
	public BanVisitorChat(sessionId: any, deviceID, days: number): Observable<any> {
		return new Observable(observer => {
			this.socket.emit('banVisitor', { sessionid: sessionId, deviceID: deviceID, days: days }, (response: any) => {
				if (response.status == "ok") {

					observer.next(response.visitor);
				}
				else if (response.status == "alreadyBanned") observer.next(false)
				else {
					observer.error({ code: "stt", text: "Error in Banning Chat" });
				}
			});
		});
	}


	StopVisitorChat(sessionId: any, conversation): Observable<any> {
		return new Observable(observer => {
			this.socket.emit('stopVisitorChat', { sessionid: sessionId, conversation: conversation }, (response: any) => {
				if (response.status == "ok") {
					////console.log(response.conversation)
					this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
						if (conversation._id == this.currentConversation.getValue()._id) {
							this.moveToArchive(conversation, response.conversation);
						}
						return conversation._id != response.conversation._id;
					}));
					// this.chatHistoryList.next(this.chatHistoryList.getValue().map(history => {
					// 	if (history.deviceID == response.conversation.deviceID) {
					// 		history.conversations.unshift(response.conversation);
					// 	}
					// 	return history
					// }));
					if (conversation._id == this.currentConversation.getValue()._id) this.DiscardCurrentConversation();
					//this.EndChat();
					observer.next(response.conversation);
					observer.complete()
				}
				else {
					observer.error({ code: "stt", text: "Error in Stopping Chat" });
				}
			});
		});
	}
	StopVisitorChatRest(sessionId: any, conversation): Observable<any> {
		return new Observable(observer => {
			try {


				this.http.post(this.chatServiceURL + '/stopVisitorChat', { sessionid: this.Agent.csid, conversation: conversation }).subscribe((data: any) => {

					if (data.json()) {
						let response = data.json()
						if (response.status == "ok") {
							this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
								if (conversation._id == this.currentConversation.getValue()._id) {
									this.moveToArchive(conversation, response.conversation);
								}
								return conversation._id != response.conversation._id;
							}));

							if (conversation._id == this.currentConversation.getValue()._id) this.DiscardCurrentConversation();

							observer.next(response.conversation);
							observer.complete()
						}
						else {
							observer.error({ code: "stt", text: "Error in Stopping Chat" });
						}

					}
					else {
						observer.error({ code: "stt", text: "Error in Stopping Chat" });
					}
				}, err => {
					observer.error({ code: "stt", text: "Error in Stopping Chat" });
				});
			} catch (error) {
				observer.error({ code: "stt", text: "Error in Stopping Chat" });
			}
		});
	}

	//UnBan Chat
	public UnBanVisitorChat(deviceID: any): Observable<any> {
		return new Observable(observer => {
			this.socket.emit('UnbanVisitor', { deviceID: deviceID }, (response: any) => {
				if (response.status == "ok") {
					observer.next(true);
				}
				else {
					observer.error({ code: "stt", text: "Error in UnBanning Chat" });
				}
			});
		});
	}

	//typing event
	SendTypingEvent(data) {

		return new Observable(observer => {
			if (this.chatPermissions.allowTypingStatus) {
				this.socket.emit("agentTyping", data, (response: any) => {
				});
				observer.next(true)
				observer.complete()
			} else {
				observer.next(true)
				observer.complete()
			}
		})

	}
	SendTypingEventRest(data) {

		return new Observable(observer => {
			try {
				if (this.chatPermissions.allowTypingStatus && (data.conversation.state == 2)) {
					let typingData = { state: data.state, sessionid: data.conversation.sessionid, type: 'Agents' }
					this.http.post(this.chatServiceURL + "/typing", typingData).subscribe((response: any) => {
					}, err => {
						observer.next(false)
						observer.complete()
					});
					observer.next(true)
					observer.complete()
				} else {
					observer.next(false)
					observer.complete()
				}
			} catch (error) {
				observer.next(false)
				observer.complete()
			}

		});
	}

	//Email Chat TRanscript
	public EmailChatTranscript(data: any): Observable<any> {
		return new Observable(observer => {
			// this.socket.emit('emailChatTranscript', data, (response: any) => {
			// 	if (response.status == "ok") {
			// 		observer.next(true);
			// 	}
			// 	else {
			// 		observer.error();
			// 	}
			// });
			this.http.post(this.visitorServiceURL + '/emailtranscript', data).subscribe((response: any) => {

				if (response.json()) {
					if (response.json().status == "ok") {
						observer.next(true);
					}
					else {
						observer.error();
					}
				}
			});

		});
	}


	//Message Drafts
	SetDraft(draft) {

		if (!this.messageDrafts.getValue().filter(d => d.id == draft.id).length) {
			this.messageDrafts.getValue().push(draft);
			this.messageDrafts.next(this.messageDrafts.getValue());
		} else {
			this.messageDrafts.getValue().map(d => {
				if (d.id == draft.id) {
					d.message = draft.message;
				}
				return d;
			})
		}
	}

	DeleteDraft(id) {

		if (this.messageDrafts.getValue().filter(d => d.id == id).length) {
			this.messageDrafts.next(this.messageDrafts.getValue().filter(d => d.id != id))
		}
	}
	// RemoveDraft(id){
	// 	let index = this.messageDrafts.getValue().findIndex(d => d.id == id);
	// 	if(index > -1){
	// 		this.messageDrafts.getValue().splice(index, 1);
	// 		this.messageDrafts.next(this.messageDrafts.getValue());
	// 	}
	// }

	addConversationTags(_id: string, tags: Array<string>): Observable<any> {
		return new Observable(observer => {
			let conversationLog = {
				title: "Tag(s) Entered",
				status: tags,
				updated_by: this.Agent.email,
				user_type: 'Agent',
				time_stamp: new Date().toISOString()
			}
			// this.socket.emit('addConversationTags', { _id: _id, tag: tags, conversationLog: conversationLog }, (response) => {
			this.http.post(this.chatServiceURL + '/addConversationTags', { sessionid: this.Agent.csid, _id: _id, tag: tags, conversationLog: conversationLog }).subscribe(data => {

				if (data.json()) {
					let response = data.json();
					if (response.status == 'ok') {
						let msg = '';
						let found = false;
						if (this.activeTab.getValue() == 'INBOX') {

							this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
								if (conversation._id == _id) {
									if (this.currentConversation.getValue()._id == _id) this.currentConversation.next(conversation);
									found = true;
									if (!conversation.tags) conversation.tags = [];
									conversation.tags = (conversation.tags as Array<string>).concat(tags)
									msg = 'Chat #' + conversation.clientID + ' is Tagged As "' + tags + '" Successfully';

								}
								return conversation;
							}));
						} else {
							this.Archives.next(this.Archives.getValue().map(conversation => {
								if (conversation._id == _id) {
									if (this.currentConversation.getValue()._id == _id) this.currentConversation.next(conversation);
									found = true;
									if (!conversation.tags) conversation.tags = [];
									conversation.tags = (conversation.tags as Array<string>).concat(tags)
									msg = 'Chat #' + conversation.clientID + ' is Tagged As ' + tags + ' Successfully';

								}
								return conversation;
							}));
						}
						if (found) {
							this.notification.next({
								msg: msg,
								type: 'success',
								img: 'ok'
							});
							observer.next({ status: response.status, ticket_data: response.ticket_data });
							observer.complete();

						} else {
							this.notification.next({
								msg: "Can't Add Tag",
								type: 'error',
								img: 'warning'
							});
							observer.complete();
						}
					} else {
						this.notification.next({
							msg: "Can't Add Tag",
							type: 'error',
							img: 'warning'
						});
						observer.complete();
					}
				}
				else {
					this.notification.next({
						msg: "Can't Add Tag",
						type: 'error',
						img: 'warning'
					});
					observer.complete();
				}
			});
		});
	}


	deleteConversationTag(tag, index, conversationID) {


		// this.socket.emit('deleteConversationTag', { _id: conversationID, tag: tag, index: index }, (response) => {
		this.http.post(this.chatServiceURL + '/deleteConversationTag', { sessionid: this.Agent.csid, _id: conversationID, tag: tag, index: index }).subscribe(data => {
			if (data.json()) {
				let response = data.json();
				if (response.status == "ok") {

					if (this.activeTab.getValue() == 'INBOX') {

						let index = this.AllConversations.getValue().findIndex(a => a._id == conversationID);
						this.AllConversations.getValue()[index].tags = response.deletedresult;
						this.AllConversations.next(this.AllConversations.getValue());
						if (this.currentConversation.getValue()._id == conversationID) {
							this.currentConversation.getValue().tags = response.deletedresult;
							this.currentConversation.next(this.currentConversation.getValue());
						}
						this.RefreshList();

					} else {
						let index = this.Archives.getValue().findIndex(a => a._id == this.currentConversation.getValue()._id);
						this.Archives.getValue()[index].tags = response.deletedresult;
						this.Archives.next(this.Archives.getValue());
						if (this.currentConversation.getValue()._id == conversationID) {
							this.currentConversation.getValue().tags = response.deletedresult;
							this.currentConversation.next(this.currentConversation.getValue());
						}
					}
					let msg = 'Tag is deleted Successfully';
					this.notification.next({
						msg: msg,
						type: 'success',
						img: 'ok'
					});
				} else {
					this.notification.next({
						msg: "Can't delete Tag",
						type: 'error',
						img: 'warning'
					});
				}
			}
			else {
				this.notification.next({
					msg: "Can't delete Tag",
					type: 'error',
					img: 'warning'
				});
			}
		});

	}

	SelectConversation(value, tab) {
		let hash = 0;
		if (tab == 'INBOX') {
			this.AllConversations.getValue().map((conversation, index) => {

				if (conversation._id == this.currentConversation.getValue()._id) {
					hash = (value == 'next') ? (index + 1) : (index - 1)
				}
			})
			if (hash >= 0) {
				if (this.AllConversations.getValue()[hash]) {
					this.setCurrentConversation(this.AllConversations.getValue()[hash]._id)
				}
			}
		}
		else {
			this.Archives.getValue().map((conversation, index) => {

				if (conversation._id == this.currentConversation.getValue()._id) {
					hash = (value == 'next') ? (index + 1) : (index - 1)
				}
			})
			if (hash >= 0) {
				if (this.Archives.getValue()[hash]) {
					this.setSelectedArchive(this.Archives.getValue()[hash]._id)
				}
			}

		}
	}


	RefreshList() {

		this.AllConversations.getValue().sort((a, b) => {
			let aDate: string = (a.lasttouchedTime) ? a.lasttouchedTime : a.datetime;
			let bDate: string = (b.lasttouchedTime) ? b.lasttouchedTime : b.datetime;

			return (Date.parse(aDate) - Date.parse(bDate) > 0) ? -1 : 1;
		});

		this.AllConversations.next(this.AllConversations.getValue());
	}

	TypingOnReload() {
		if (this.currentConversation.getValue()) this.SendTypingEventRest({ state: false, conversation: this.currentConversation.getValue() })
	}


	GetChatHistoryForDeviceID(deviceID) {


		if (!this.DeviceIDHashList.getValue()[deviceID]) {

			this.DeviceIDHashList.getValue()[deviceID] = deviceID
			this.chatHistoryList.getValue().push({ deviceID: deviceID, conversationsFetched: false })

		}

		this.chatHistoryList.next(this.chatHistoryList.getValue().map(history => {
			if (history.deviceID && (history.deviceID == deviceID) && !history.conversationsFetched) {

				history.noMoreChats = false
				this.getConversationsListFromBackEnd(history.deviceID).subscribe(conversations => {

					if (conversations.length < 19) history.noMoreChats = true
					if (conversations) {
						if (!history.conversations) history.conversations = []
						history.conversations = conversations
						history.conversationsFetched = true;
						this.ExtractSessionInfo(history);

					}
					else {
						history.conversations = ''
						history.conversationsFetched = true;
					}
					// this.fetchingConversation = false
				}, err => {
					history.conversations = ''
					history.conversationsFetched = true;

					// this.fetchingConversation = false
				});

			}

			return history
		}));

		this.chatHistoryList.getValue().map(history => {
			if (history.deviceID == deviceID) {
				this.selectedChatHistory.next(history)
			}
		})

		// if (!this.currentConversation.conversationsFetched) this.currentConversation.conversationsFetched = false;
		// if (!this.currentConversation.conversationsFetched && !this.currentConversation.conversations && !this.fetchingConversation) {
		// 	this.fetchingConversation = true
		// 	this.currentConversation.noMoreChats = false

		// 	this._chatService.getConversationsListFromBackEnd(this.currentConversation.deviceID).subscribe(conversations => {

		// 		if (conversations.length < 19) this.currentConversation.noMoreChats = true
		// 		if (conversations) {
		// 			this.currentConversation.conversations = conversations
		// 			this.currentConversation.conversationsFetched = true;
		// 			this._chatService.ExtractSessionInfo();

		// 		}
		// 		else {
		// 			this.currentConversation.conversations = ''
		// 			this.currentConversation.conversationsFetched = true;
		// 		}
		// 		this.fetchingConversation = false
		// 	}, err => {
		// 		this.currentConversation.conversations = ''
		// 		this.currentConversation.conversationsFetched = true;
		// 		this.fetchingConversation = false
		// 	});
		// }

	}

	UpdateDynamicProperty(_id, fieldName, fieldvalue): Observable<any> {
		return new Observable((observer) => {
			//REST CALL
			this.http.post(this.chatServiceURL + '/updateChatDynamicProperty', { cid: _id, name: fieldName, value: fieldvalue, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
				if (res.json()) {
					let response = res.json();
					if (response.status == 'ok') {
						this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
							if (conversation._id == _id) {

								if (!conversation.dynamicFields) conversation.dynamicFields = {};
								conversation.dynamicFields[fieldName] = fieldvalue;


								if (this.currentConversation.getValue()._id != _id) this.currentConversation.next(conversation);

							}
							return conversation;
						}));

						observer.next({ status: "ok" });
						observer.complete();
					} else {

						observer.next({ status: "error" });
						observer.complete();
					}
				}
			}, err => {

				observer.next({ status: "error" });
				observer.complete();
			})
		})
	}
}
