"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
//End Services
var ChatService = /** @class */ (function () {
    //Change to Behaviour Subject if Any Error Occured
    //private Agent : BehaviorSubject<any> = new BehaviorSubject({});
    function ChatService(_socket, http, _authService, _visitorService, _appStateService, _notificationService) {
        //////console.log('Chat Service Initialized');
        var _this = this;
        this._socket = _socket;
        this.http = http;
        this._authService = _authService;
        this._visitorService = _visitorService;
        this._appStateService = _appStateService;
        this._notificationService = _notificationService;
        this.windowFocused = false;
        this.showNotification = false;
        this.subscriptions = [];
        this.acceptingChatMode = new BehaviorSubject_1.BehaviorSubject(true);
        this.notification = new Subject_1.Subject();
        this.autoScroll = new BehaviorSubject_1.BehaviorSubject(true);
        this.activeTab = new BehaviorSubject_1.BehaviorSubject('INBOX');
        this.archivesSynced = new BehaviorSubject_1.BehaviorSubject(false);
        this.tagList = new BehaviorSubject_1.BehaviorSubject([]);
        this.chatServiceURL = '';
        this.visitorServiceURL = '';
        this.archiveChunk = 0;
        this.AllConversations = new BehaviorSubject_1.BehaviorSubject([]);
        this.Archives = new BehaviorSubject_1.BehaviorSubject([]);
        this.visitorList = new BehaviorSubject_1.BehaviorSubject({});
        this.currentConversation = new BehaviorSubject_1.BehaviorSubject({});
        this.selectedVisitor = new BehaviorSubject_1.BehaviorSubject({});
        this.ShowAttachmentAreaDnd = new BehaviorSubject_1.BehaviorSubject(false);
        //Loader Variables for Live Data
        this.loadingCurrentConversation = new BehaviorSubject_1.BehaviorSubject(true);
        this.AutoSync = new Subject_1.Subject();
        this.autoSync = false;
        //Loader Variables Database
        this.loading = new Subject_1.Subject();
        this.loadingMoreArchives = new BehaviorSubject_1.BehaviorSubject(false);
        this.loadingMoreInbox = new BehaviorSubject_1.BehaviorSubject(false);
        //Loader Variables Database
        this.loadingMessages = new Subject_1.Subject();
        this.loadingMoreMessages = new Subject_1.Subject();
        this.newMesagedRecieved = new Subject_1.Subject();
        this.messageDrafts = new BehaviorSubject_1.BehaviorSubject([]);
        this.tempTypingState = new Subject_1.Subject();
        this.urlRegex = /((http(s)?:\/\/)?([\w-]+\.)+[\w-]+[.com]+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gmi;
        //cannedForms
        this.CannedForms = new BehaviorSubject_1.BehaviorSubject([]);
        //ChatHistoryList
        this.chatHistoryList = new BehaviorSubject_1.BehaviorSubject([]);
        this.selectedChatHistory = new BehaviorSubject_1.BehaviorSubject([]);
        this.DeviceIDHashList = new BehaviorSubject_1.BehaviorSubject([]);
        this.Filters = new BehaviorSubject_1.BehaviorSubject({});
        this.SuperVisedChatList = new BehaviorSubject_1.BehaviorSubject([]);
        this.customFields = new BehaviorSubject_1.BehaviorSubject([]);
        this.inboxChunk = 0;
        this.conversationsFetched = false;
        this.archivesFetched = false;
        // GetChatSettingsFromStorage() {
        // 	let chatSettings: any = JSON.parse(localStorage.getItem('chatSettings'));
        // 	if (chatSettings && chatSettings.tagList && chatSettings.tagList.length) {
        // 		this.tagList.next(chatSettings.tagList)
        // 	}
        // }
        this.tagsFetched = false;
        _authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.chats;
                if (data.schemas && data.schemas.chats)
                    _this.customFields.next(data.schemas.chats.fields);
            }
        });
        _authService.RestServiceURL.subscribe(function (url) {
            _this.chatServiceURL = url + '/api/chats';
            _this.visitorServiceURL = url + '/api/visitor';
        });
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.chatPermissions = data.permissions.chats;
            }
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            //////console.log('Agent Subscribed');
            //////console.log(agent);
            _this.Agent = agent;
        }));
        this.subscriptions.push(_appStateService.getFocusedState().subscribe(function (data) {
            _this.windowFocused = data;
        }));
        this.subscriptions.push(_appStateService.getNotificationState().subscribe(function (data) {
            _this.showNotification = data;
        }));
        this.subscriptions.push(_visitorService.getVisitorsMap().subscribe(function (visitorList) {
            ////console.log('Visitor Map Updated');
            ////console.log(visitorList);
            _this.visitorList.next(visitorList);
            Object.keys(visitorList).map(function (key) {
                if (Object.keys(_this.currentConversation.getValue()).length > 0) {
                    if (visitorList[_this.currentConversation.getValue().sessionid] != undefined) {
                        _this.selectedVisitor.next(visitorList[_this.currentConversation.getValue().sessionid]);
                    }
                }
            });
        }));
        this.subscriptions.push(this.AutoSync.debounceTime(3000).subscribe(function (value) {
            if (value) {
                // this.RequesetQueAuto()
                _this.RequestQueAutoRest();
            }
        }));
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                if (_this.permissions && _this.permissions.enabled) {
                    _this.Filters.debounceTime(1500).subscribe(function (filters) {
                        if (_this.activeTab.getValue() == 'ARCHIVE') {
                            _this.getArchivesFromBackend(filters);
                        }
                        else {
                            if (!_this.conversationsFetched)
                                _this.GetConverSations(filters);
                        }
                    });
                    _this.socket.on('newConversation', function (conversation) {
                        _this.RemovePreviousChatsFromInbox(conversation._id).subscribe(function (result) {
                            // if (result) {
                            if (_this.SuperVisedChatList.getValue().includes(conversation._id) && (conversation.superviserAgents.includes(_this.Agent.csid))) {
                                //console.log('removing trnsferred Chat from supervision list');
                                _this._visitorService.EndSuperVisesChatRest(conversation._id, false).subscribe(function (data) {
                                    conversation.superviserAgents = conversation.superviserAgents.filter(function (id) { return _this.Agent.csid != id; });
                                });
                            }
                            _this.SuperVisedChatList.next(_this.SuperVisedChatList.getValue().filter(function (id) { return conversation._id != id; }));
                            _this.InserNewConversation(conversation);
                            var data = [];
                            data.push({
                                'title': 'New Conversation!',
                                'alertContent': "You got a new conversation!",
                                'icon': "../assets/img/favicon.ico",
                                'url': "/chats/" + conversation._id
                            });
                            if (_this.showNotification) {
                                _this._notificationService.generateNotification(data);
                            }
                            // }
                            //this.RemovePreviousArchivesForChat(conversation._id).subscribe(result => { })
                        });
                    });
                    _this.socket.on('superviseChat', function (data) {
                        _this.RemovePreviousChatsFromInbox(data.supervisedChat._id).subscribe(function (result) {
                            _this.SuperVisedChatList.getValue().push(data.supervisedChat._id);
                            _this.InserNewConversation(data.supervisedChat);
                            _this._appStateService.NavigateForce('/chats/' + data.supervisedChat._id);
                        });
                    });
                    _this.socket.on('removeBannedVisitorChatFromList', function (data) {
                        if (data.visitor) {
                            _this._visitorService.UpdateBannedVisitor(data.visitor).subscribe(function (bannedList) {
                                if (bannedList) {
                                    if (data.session && data.session.conversationID) {
                                        _this.AllConversations.next(_this.AllConversations.getValue().filter(function (conversation) {
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
                                        if (data.session.conversationID == _this.currentConversation.getValue()._id)
                                            _this.DiscardCurrentConversation();
                                    }
                                }
                            });
                        }
                    });
                    _this.socket.on('privateMessage', function (data) {
                        var selectedConversation = false;
                        var exist = _this.AllConversations.getValue().findIndex(function (conversation) { return conversation.cid == data.cid; });
                        if (exist) {
                            _this.AllConversations.getValue().map(function (conversation, index) {
                                //////console.log(conversation);
                                if (conversation._id == data.cid) {
                                    conversation.typingData = '';
                                    conversation.messages.push(data);
                                    //Shifting That Conversation on Top.
                                    _this.AllConversations.getValue().splice(index, 1);
                                    _this.AllConversations.getValue().unshift(conversation);
                                    _this.AllConversations.next(_this.AllConversations.getValue());
                                    if ((_this.currentConversation.getValue()._id == data.cid) && _this.autoScroll.getValue()) {
                                        //if(data.type != 'Agents') this.newMesagedRecieved.next(data);
                                        _this.UpdateMessageSentStatusRest({
                                            sessionid: conversation.sessionid,
                                            cid: conversation._id,
                                            type: 'Visitors'
                                        });
                                    }
                                    if (data.type != 'Agents') {
                                        if (_this.currentConversation.getValue()._id != data.cid || !_this.windowFocused || !_this.autoScroll.getValue()) {
                                            if (conversation.messageReadCount == 0) {
                                                var notif_data = [];
                                                notif_data.push({
                                                    'title': 'New Message!',
                                                    'alertContent': 'You have received a new message!',
                                                    'icon': "../assets/img/favicon.ico",
                                                    'url': "/chats/" + conversation._id
                                                });
                                                if (_this.showNotification) {
                                                    _this._notificationService.generateNotification(notif_data);
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
                    _this.socket.on('stopConversation', function (data) {
                        var found = false;
                        var currentConversation = JSON.parse(JSON.stringify(_this.currentConversation.getValue()));
                        _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                            if (data.conversation._id == conversation._id) {
                                _this.SendTypingEventRest({ state: false, conversation: data.conversation }).subscribe(function (data) {
                                });
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
                            if (_this.currentConversation.getValue()._id == data.conversation._id) {
                                _this.currentConversation.getValue().ended = true;
                            }
                            if ((data.conversation._id == conversation._id) && (_this.currentConversation.getValue()._id == data.conversation._id)) {
                                _this.currentConversation.next(conversation);
                            }
                            return conversation;
                        }));
                        _this.chatHistoryList.next(_this.chatHistoryList.getValue().map(function (history) {
                            if (history.deviceID == data.conversation.deviceID) {
                                if (!history.conversations)
                                    history.conversations = [];
                                history.conversations.unshift(data.conversation);
                                if (history.deviceID == _this.currentConversation.getValue().deviceID) {
                                    _this.selectedChatHistory.next(history);
                                }
                            }
                            return history;
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
                    _this.socket.on('makeConversationInactive', function (data) {
                        var currentConversation = _this.currentConversation.getValue();
                        _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                            if (data.conversation._id == conversation._id) {
                                _this.SendTypingEventRest({ state: false, conversation: data.conversation }).subscribe(function (data) {
                                });
                                conversation.synced = true;
                                conversation.lastmodified = new Date().toISOString();
                                conversation.inactive = data.conversation.inactive;
                            }
                            if ((data.conversation._id == conversation._id) && (_this.currentConversation.getValue()._id == data.conversation._id)) {
                                _this.SendTypingEventRest({ state: false, conversation: _this.currentConversation.getValue() }).subscribe(function (data) {
                                });
                                _this.currentConversation.getValue().messages.push(data.status);
                            }
                            return conversation;
                        }));
                    });
                    _this.socket.on('makeConversationActive', function (data) {
                        var currentConversation = _this.currentConversation.getValue();
                        var found = false;
                        _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                            if (data.conversation._id == conversation._id) {
                                conversation = data.conversation;
                                found = true;
                            }
                            return conversation;
                        }));
                        if (!found)
                            _this.AllConversations.getValue().unshift(data.conversation);
                    });
                    _this.socket.on('removeConversation', function (data) {
                        var found = false;
                        var currentConversation = _this.currentConversation.getValue();
                        _this.AllConversations.next(_this.AllConversations.getValue().filter(function (conversation) {
                            if (data.conversation._id == conversation._id) {
                                // this.RemovePreviousArchivesForChat(data.conversation._id).subscribe(data => {
                                // 	if (data) {
                                _this.SendTypingEventRest({ state: false, conversation: data.conversation }).subscribe(function (data) {
                                });
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
                            if (_this.currentConversation.getValue()._id == data.conversation._id) {
                                //this.clearAttachmentFiles.next(true)
                                _this.currentConversation.getValue().ended = true;
                            }
                            if ((data.conversation._id == conversation._id) && (_this.currentConversation.getValue()._id == data.conversation._id)) {
                                _this.SendTypingEventRest({ state: false, conversation: _this.currentConversation.getValue() }).subscribe(function (data) {
                                });
                                _this.DiscardCurrentConversation();
                            }
                            //if want to hide message area
                            //this.currentConversation.next(currentConversation);
                            //if want to remove entire display
                            return data.conversation._id != conversation._id;
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
                    _this.socket.on('typingState', function (data) {
                        _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                            if (conversation.sessionid == data.sid) {
                                conversation.typingState = data.state;
                            }
                            return conversation;
                        }));
                    });
                    //Event To Handle Sneak Peak Data
                    _this.socket.on('visitorSneakPeak', function (data) {
                        _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                            if (conversation.sessionid == data.sid) {
                                conversation.typingData = data.msg;
                            }
                            return conversation;
                        }));
                        if (_this.currentConversation.getValue().sessionid == data.sid) {
                            _this.currentConversation.getValue().typingData = data.msg;
                            _this.currentConversation.next(_this.currentConversation.getValue());
                        }
                    });
                    //delivery status from visitor
                    _this.socket.on("privateMessageSent", function (response) {
                        _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                            if (conversation._id == response.cid) {
                                conversation.messages.map(function (msg) {
                                    if (msg.type != 'Visitors') {
                                        msg.sent = true;
                                    }
                                    return msg;
                                });
                            }
                            return conversation;
                        }));
                    });
                    _this.socket.on('updateUserInfo', function (data) {
                        _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                            if (conversation._id == data.cid) {
                                conversation.visitorEmail = data.email;
                                conversation.visitorName = data.username;
                            }
                            return conversation;
                        }));
                    });
                    _this.socket.on('updateAdditionalDataInfo', function (data) {
                        // ////console.log(data);
                        // this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
                        //   if (conversation._id == data.cid) {
                        //     conversation.visitorEmail = data.email;
                        //     conversation.visitorName = data.username;
                        //   }
                        //   return conversation;
                        // }));
                    });
                    _this.socket.on('toggleChatMode', function (data) {
                        _this._authService.setAcceptingChatMode((data.state == 'on') ? true : false);
                    });
                    _this.socket.on('gotChatTicketDetails', function (data) {
                        if (data.cid && data.ticket)
                            _this.UpdateChatTicketDetails(data.ticket, data.cid);
                    });
                    _this.socket.on('requestQueue', function (data) {
                        _this.autoSync = true;
                    });
                }
                _this.GetCannedFormsRest();
            }
        });
        //this.GetChatSettingsFromStorage()
    }
    ChatService.prototype.UpdateMessageSentStatus = function (data) {
        this.socket.emit('privateMessageRecieved', data, function (response) {
            if (response.status == 'ok') {
            }
        });
    };
    ChatService.prototype.UpdateMessageSentStatusRest = function (data) {
        try {
            this.http.post(this.chatServiceURL + '/privateMessageRecieved', data).subscribe(function (response) {
                if (response.json()) {
                    var data_1 = response.json();
                    if (data_1.status == 'ok') {
                    }
                }
            }, function (err) {
                //console.log(err);
            });
        }
        catch (e) { }
    };
    ChatService.prototype.setDraftFiles = function (cid, draft, arrToDialog) {
        this.AllConversations.getValue().map(function (conv) {
            if (conv._id == cid) {
                conv.attachments = draft;
                conv.arrToDialog = arrToDialog;
                return conv;
            }
        });
        this.AllConversations.next(this.AllConversations.getValue());
    };
    ChatService.prototype.GetCannedForms = function () {
        var _this = this;
        this.socket.emit('getFormsByNSP', {}, function (response) {
            if (response.status == 'ok') {
                _this.CannedForms.next(response.form_data);
            }
        });
    };
    ChatService.prototype.GetCannedFormsRest = function () {
        var _this = this;
        try {
            this.http.post(this.chatServiceURL + '/getFormsByNSP', { sessionid: this.Agent.csid, nsp: this.Agent.nsp }).subscribe(function (data) {
                if (data.json()) {
                    var response = data.json();
                    if (response.status == 'ok') {
                        _this.CannedForms.next(response.form_data);
                    }
                }
            }, function (err) {
                _this.CannedForms.next([]);
            });
        }
        catch (error) {
            //console.log(error);
        }
    };
    ChatService.prototype.RequesetQueAuto = function () {
        var _this = this;
        this.socket.emit('requestQueueAuto', {}, function (data) {
            if (data.status == 'ok') {
                if (data.more) {
                    _this.AutoSync.next(true);
                    _this.notification.next({
                        msg: "You've got the new Conversation",
                        type: 'success',
                        img: 'ok'
                    });
                    var notif = [];
                    notif.push({
                        'title': 'New Conversation!',
                        'alertContent': "You got a new conversation!",
                        'icon': "../assets/img/favicon.ico",
                        'url': "/chats/"
                    });
                    if (_this.showNotification) {
                        _this._notificationService.generateNotification(notif);
                    }
                }
            }
        });
    };
    ChatService.prototype.RequestQueAutoRest = function () {
        var _this = this;
        try {
            this.http.post(this.chatServiceURL + '/requestQueAuto', { sessionid: this.Agent.csid, nsp: this.Agent.nsp }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.more) {
                        _this.AutoSync.next(true);
                        _this.notification.next({
                            msg: "You've got the new Conversation",
                            type: 'success',
                            img: 'ok'
                        });
                        var notif = [];
                        notif.push({
                            'title': 'New Conversation!',
                            'alertContent': "You got a new conversation!",
                            'icon': "../assets/img/favicon.ico",
                            'url': "/chats/"
                        });
                        if (_this.showNotification) {
                            _this._notificationService.generateNotification(notif);
                        }
                    }
                }
            }, function (err) {
                console.log(err);
            });
        }
        catch (e) {
            console.log(e);
        }
    };
    ChatService.prototype.InserNewConversation = function (conversation) {
        if (conversation.messages == undefined) {
            conversation.messages = [];
        }
        this.AllConversations.getValue().unshift(conversation);
        this.AllConversations.next(this.AllConversations.getValue());
    };
    ChatService.prototype.InsertCustomerDefaultEmail = function (UserDefault, cid, nsp) {
        //console.log(details.thread)
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/InsertEmail', { UserDefault: UserDefault, cid: cid, nsp: nsp }).subscribe(function (data) {
                    if (data.json()) {
                        var response_1 = data.json();
                        //   console.log(response)
                        if (response_1.status == 'ok') {
                            _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                                if (conversation._id == cid) {
                                    conversation.UserEmail = response_1.conversation.UserEmail;
                                    if (_this.currentConversation.getValue()._id == cid)
                                        _this.currentConversation.next(conversation);
                                }
                                return conversation;
                            }));
                            observer.next(response_1);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    console.log(err);
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.InsertCustomerID = function (customerID, cid, nsp) {
        //console.log(details.thread)
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/InsertID', { customerID: customerID, cid: cid, nsp: nsp }).subscribe(function (data) {
                    if (data.json()) {
                        var response_2 = data.json();
                        //   console.log(response)
                        if (response_2.status == 'ok') {
                            _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                                if (conversation._id == cid) {
                                    conversation.CMID = response_2.conversation.CMID;
                                    if (_this.currentConversation.getValue()._id == cid)
                                        _this.currentConversation.next(conversation);
                                }
                                return conversation;
                            }));
                            observer.next(response_2);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.IsCustomerRegistered = function (registered, cid, nsp) {
        //console.log(details.thread)
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/IsCustomer', { registered: registered, cid: cid, nsp: nsp }).subscribe(function (data) {
                    if (data.json()) {
                        var response_3 = data.json();
                        //   console.log(response)
                        if (response_3.status == 'ok') {
                            _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                                if (conversation._id == cid) {
                                    conversation.Registered = response_3.conversation.Registered;
                                    if (_this.currentConversation.getValue()._id == cid)
                                        _this.currentConversation.next(conversation);
                                }
                                return conversation;
                            }));
                            observer.next();
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.InsertCustomerInfo = function (customerInfo, cid, nsp) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/InsertCustomerInfo', { customerInfo: customerInfo, cid: cid, nsp: nsp }).subscribe(function (data) {
                    if (data.json()) {
                        var response_4 = data.json();
                        console.log(response_4);
                        if (response_4.status == 'ok') {
                            //	console.log(response.conversation)
                            _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                                if (conversation._id == cid) {
                                    conversation.CustomerInfo = response_4.conversation.CustomerInfo;
                                    if (_this.currentConversation.getValue()._id == cid)
                                        _this.currentConversation.next(conversation);
                                }
                                return conversation;
                            }));
                            observer.next();
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    console.log(err);
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.InsertSimilarCustomers = function (allCustomers, cid, nsp) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/InsertSimilarCustomers', { allCustomers: allCustomers, cid: cid, nsp: nsp }).subscribe(function (data) {
                    if (data.json()) {
                        var response_5 = data.json();
                        //console.log(response)
                        if (response_5.status == 'ok') {
                            console.log(response_5.conversation);
                            _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                                if (conversation._id == cid) {
                                    conversation.RelatedCustomerInfo = response_5.conversation.RelatedCustomerInfo;
                                    if (_this.currentConversation.getValue()._id == cid)
                                        _this.currentConversation.next(conversation);
                                }
                                return conversation;
                            }));
                            observer.next();
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.CheckRegisterCustomerRest = function (custData, _id, customerID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/CheckRegistration', { custData: custData, customerID: customerID }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        //  console.log(response)
                        if (response.status == 'ok') {
                            // this.AllConversations.next(this.AllConversations.getValue().map(conversation => {
                            // 	return conversation
                            // }));
                            response.response._id = _id;
                            observer.next(response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.CustomerRegisterRest = function (details) {
        //console.log(details.thread)
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/RegisterCustomer', { details: details.thread }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        //   console.log(response)
                        if (response.status == 'ok') {
                            observer.next(response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.StockListRest = function (details) {
        //console.log(details.thread)
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/StockList', { details: details }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        //   console.log(response)
                        if (response.status == 'ok') {
                            observer.next(response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.GetSalesAgent = function (ID) {
        //console.log(details.thread)
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/SalesAgent', { ID: ID }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        //  console.log(response)
                        if (response.status == 'ok') {
                            observer.next(response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.GetMasterData = function (ID) {
        //console.log(details.thread)
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/MasterData', { ID: ID }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        //  console.log(response)
                        if (response.status == 'ok') {
                            observer.next(response.response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.GetCarNameMasterData = function (ID) {
        //console.log(details.thread)
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/CarNameMasterData', { ID: ID }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        //  console.log(response)
                        if (response.status == 'ok') {
                            observer.next(response.response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.GetCarModelMasterData = function (makerID, nameID) {
        //console.log(details.thread)
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/CarModelMasterData', { makerID: makerID, nameID: nameID }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        //  console.log(response)
                        if (response.status == 'ok') {
                            observer.next(response.response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.TransferChatRest = function (AgentID, sid, discardCurrentChat) {
        var _this = this;
        if (discardCurrentChat === void 0) { discardCurrentChat = false; }
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/transferChat', { to: AgentID, visitor: sid, sessionid: _this.Agent.csid }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        if (response.transfer == 'ok') {
                            // if (discardCurrentChat) if (this.currentConversation.getValue()._id == currentconversation._id) this.DiscardCurrentConversation();
                            // this.AllConversations.next(this.AllConversations.getValue().filter(conversation => {
                            // 	return conversation._id != currentconversation._id;
                            // }));
                            observer.next(true);
                            observer.complete();
                        }
                        else {
                            if (response.transfer == 'error-inactive') {
                                _this.notification.next({
                                    msg: response.msg,
                                    type: 'error',
                                    img: 'warning'
                                });
                                observer.next(false);
                                observer.complete();
                            }
                        }
                    }
                    else {
                        observer.next(false);
                        observer.complete();
                    }
                }, function (err) {
                    //console.log(err)
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    ChatService.prototype.TransferChat = function (AgentID, currentconversation) {
        var _this = this;
        this.socket.emit('transferChat', { to: AgentID, visitor: currentconversation.sessionid }, function (response) {
            if (response.transfer == 'ok') {
                //  ////console.log('Transfer OK');
                if (_this.currentConversation.getValue()._id == currentconversation._id)
                    _this.DiscardCurrentConversation();
                // this.DiscardCurrentConversation();
                _this.AllConversations.next(_this.AllConversations.getValue().filter(function (conversation) {
                    return conversation._id != currentconversation._id;
                }));
            }
            else {
                if (response.transfer == 'error-inactive') {
                    _this.notification.next({
                        msg: response.msg,
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        });
    };
    ChatService.prototype.DiscardCurrentConversation = function () {
        this.currentConversation.next({});
        this.selectedVisitor.next({});
    };
    ChatService.prototype.GetTagList = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (!_this.tagsFetched) {
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
                _this.http.post(_this.chatServiceURL + '/chatTagsList', { nsp: _this.Agent.nsp }).subscribe(function (response) {
                    if (response.json()) {
                        var data = response.json();
                        if (data.status == 'ok') {
                            _this.tagList.next(data.tags);
                            observer.next(data.tags);
                        }
                        else {
                            _this.tagList.next([]);
                            observer.next([]);
                        }
                    }
                });
            }
            else {
                observer.next(_this.tagList.getValue());
            }
        });
        // return new Observable((observer) => {
        // 	let chatSettings: any = JSON.parse(localStorage.getItem('chatSettings'));
        // 	if (chatSettings && chatSettings.tagList && chatSettings.tagList.length) {
        // 		observer.next(chatSettings.tagList);
        // 		observer.complete();
        // 	}
        // })
    };
    ChatService.prototype.GetLiveAgent = function (location) {
        var _this = this;
        //////console.log("I'M HERE In Chat Service");
        return new Observable_1.Observable(function (observer) {
            // this.socket.emit('getLiveAgents', {}, (data) => {
            // 	// Object.keys(data).map(agent => {
            // 	//   if (!data[agent].acceptingChats) {
            // 	//     delete data[agent];
            // 	//   }
            // 	// });
            // 	// console.log('Got Live Agents');
            // 	observer.next(data);
            // });
            _this.http.post(_this.chatServiceURL + '/getLiveAgents', { nsp: _this.Agent.nsp, csid: [_this.Agent.csid] }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    observer.next(data);
                    observer.complete();
                }
            });
        });
    };
    ChatService.prototype.EndChat = function (conversation) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            var currentconversation = JSON.parse(JSON.stringify(conversation));
            _this.socket.emit('endConversation', { sid: currentconversation.sessionid, cid: currentconversation._id }, function (response) {
                if (response.status == 'ok') {
                    if (response.conversation && response.conversation.state == 4) {
                        _this.AllConversations.next(_this.AllConversations.getValue().filter(function (conversation) {
                            if (conversation._id == currentconversation._id) {
                                _this.moveToArchive(conversation, response.conversation);
                            }
                            return conversation._id != response.conversation._id;
                        }));
                        // this.chatHistoryList.next(this.chatHistoryList.getValue().map(history => {
                        // 	if (history.deviceID == response.conversation.deviceID) {
                        // 		history.conversations.unshift(response.conversation);
                        // 	}
                        // 	return history
                        // }));
                        if (_this.currentConversation.getValue()._id == currentconversation._id)
                            _this.DiscardCurrentConversation();
                        observer.next(true);
                        observer.complete();
                    }
                    else {
                        observer.next(false);
                        observer.complete();
                    }
                }
                else {
                    if (response.status == 'error-inactive') {
                        _this.notification.next({
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
    };
    ChatService.prototype.EndChatRest = function (conversation) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            try {
                var currentconversation_1 = JSON.parse(JSON.stringify(conversation));
                var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                _this.http.post(_this.chatServiceURL + '/endChat', { chatEndedByAgent: true, sid: currentconversation_1.sessionid, cid: currentconversation_1._id, timeZone: timeZone }).subscribe(function (data) {
                    if (data.json()) {
                        var response_6 = data.json();
                        if (response_6.status == 'ok') {
                            if (response_6.conversation && response_6.conversation.state == 4) {
                                _this.AllConversations.next(_this.AllConversations.getValue().filter(function (conversation) {
                                    if (conversation._id == currentconversation_1._id) {
                                        _this.moveToArchive(conversation, response_6.conversation);
                                    }
                                    return conversation._id != response_6.conversation._id;
                                }));
                                if (_this.currentConversation.getValue()._id == currentconversation_1._id)
                                    _this.DiscardCurrentConversation();
                                observer.next(true);
                                observer.complete();
                            }
                            else {
                                observer.next(false);
                                observer.complete();
                            }
                        }
                        else {
                            if (response_6.status == 'error-inactive') {
                                _this.notification.next({
                                    msg: response_6.msg,
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
                }, function (err) {
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
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
    };
    ChatService.prototype.RemoveDuplicateFromLinearArray = function (array) {
        var arr = {};
        array.map(function (value) { arr[value] = value; });
        return Object.keys(arr);
    };
    ChatService.prototype.CheckUrl = function (msg) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var match = (msg.match(_this.urlRegex));
            var joined = '';
            var splitted = [];
            var a = [];
            if (match && match.length) {
                //for line break
                msg = msg.replace(/(?:\r\n|\r|\n)/g, ' (lb) ');
                //msg = msg.replace(/(?:\r\n|\r|\n)/g, ' ');
                match = _this.RemoveDuplicateFromLinearArray(match);
                if (match && match.length) {
                    splitted = msg.split(' ');
                    a = splitted.map(function (x, index) {
                        match.map(function (links) {
                            var url = links.replace(/www./, '');
                            url = ((links.indexOf("http") === -1) ? 'http://' : '') + links;
                            var replaced = links.replace(links, '<a href="' + url + '" target="_blank">' + links + '</a>');
                            if (links == x)
                                x = replaced;
                        });
                        if (index != splitted.length - 1)
                            joined += x + ' ';
                        else
                            joined += x;
                        return x;
                    });
                }
                observer.next(joined.split(' (lb) ').join('\n'));
                observer.complete();
            }
            else {
                observer.next(msg);
                observer.complete();
            }
        });
    };
    ChatService.prototype.ReplaceHtmlEntities = function (str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    ChatService.prototype.SendMessage = function (conversation, message) {
        var _this = this;
        message.body = this.ReplaceHtmlEntities(message.body);
        this.CheckUrl(message.body).subscribe(function (body) {
            message.body = body;
            _this.currentConversation.getValue().messages.push(message);
            var messageIndex = _this.currentConversation.getValue().messages.length - 1;
            _this.AllConversations.getValue().map(function (conversation, index) {
                if (conversation._id == message.cid) {
                    _this.AllConversations.getValue().splice(index, 1);
                    _this.AllConversations.getValue().unshift(conversation);
                    _this.AllConversations.next(_this.AllConversations.getValue());
                    _this.currentConversation.next(conversation);
                }
            });
            _this.socket.emit('privateMessage', {
                sessionId: conversation.sessionid,
                message: message
            }, function (response) {
                //console.log(response);
                if (response.status == 'ok') {
                    _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                        if (conversation._id == response.cid) {
                            conversation.messages[messageIndex].date = response.date;
                            conversation.messages[messageIndex].delivered = response.delivered;
                        }
                        return conversation;
                    }));
                }
                else {
                    if (response.status == 'error-not-permitted') {
                        _this.notification.next({
                            msg: response.msg,
                            type: 'error',
                            img: 'warning'
                        });
                        _this.AllConversations.next(_this.AllConversations.getValue().filter(function (conversation) {
                            return message.cid != conversation._id;
                        }));
                        _this.currentConversation.next({});
                        _this.selectedVisitor.next({});
                    }
                }
            });
        });
    };
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
    ChatService.prototype.SendAttachment = function (sessionId, message, filename) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var messageIndex;
            _this.socket.emit('privateMessage', {
                sessionId: sessionId,
                message: message
            }, function (response) {
                if (response.status == 'ok') {
                    _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                        if (conversation._id == response.cid) {
                            conversation.messages[messageIndex].date = response.date;
                        }
                        if ((conversation._id == response.cid) && (_this.currentConversation.getValue()._id == response.cid))
                            _this.currentConversation.next(conversation);
                        return conversation;
                    }));
                }
            });
            var conversationIndex = _this.AllConversations.getValue().findIndex(function (c) { return c._id == message.cid; });
            var conversation = _this.AllConversations.getValue()[conversationIndex];
            conversation.messages.push(message);
            messageIndex = conversation.messages.length - 1;
            _this.AllConversations.getValue().splice(conversationIndex, 1);
            _this.AllConversations.getValue().unshift(conversation);
            if ((conversation._id == message.cid) && (_this.currentConversation.getValue()._id == message.cid))
                _this.currentConversation.next(conversation);
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
            _this.AllConversations.next(_this.AllConversations.getValue());
            observer.next({ status: "ok" });
            observer.complete();
        });
    };
    ChatService.prototype.logout = function () {
        this.socket.emit('logout');
    };
    ChatService.prototype.getConversationsListFromBackEnd = function (deviceID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            // this.socket.emit('CustomerConversationsList', { deviceID: deviceID }, (response) => {
            // 	if (response.status == 'ok' && response.conversations && response.conversations.length > 0) {
            // 		observer.next(response.conversations);
            // 		observer.complete();
            // 	} else {
            // 		observer.next([]);
            // 		observer.complete();
            // 	}
            // });
            _this.http.post(_this.chatServiceURL + '/customerConversationsList', { deviceID: deviceID, nsp: _this.Agent.nsp }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok' && data.conversations && data.conversations.length > 0) {
                        observer.next(data.conversations);
                        observer.complete();
                    }
                    else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            });
        });
    };
    ChatService.prototype.getMoreConversationsFromBackend = function (deviceID, id) {
        var _this = this;
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
            this.http.post(this.chatServiceURL + '/moreCustomerConversationsList', { deviceID: deviceID, id: id }).subscribe(function (response) {
                if (response.json()) {
                    var data_2 = response.json();
                    if (data_2.status == 'ok' && data_2.conversations && data_2.conversations.length > 0) {
                        _this.chatHistoryList.next(_this.chatHistoryList.getValue().map(function (history) {
                            if (history.deviceID == deviceID) {
                                history.conversations = history.conversations.concat(data_2.conversations);
                                history.noMoreChats = data_2.noMoreChats;
                                _this.selectedChatHistory.next(history);
                            }
                            return history;
                        }));
                    }
                }
            });
        }
        catch (e) {
            //console.log('error in fetching more conversations')
        }
    };
    //Same Function Called From Main Component OnFocus Event and router.link == chats
    ChatService.prototype.setCurrentConversation = function (cid) {
        var _this = this;
        var currentConversation = JSON.parse(JSON.stringify(this.currentConversation.getValue()));
        if (cid && currentConversation && currentConversation._id && (cid != currentConversation._id)) {
            this.SendTypingEventRest({ state: false, conversation: currentConversation }).subscribe(function (data) {
                _this.tempTypingState.next(false);
            });
        }
        else {
            this.SendTypingEventRest({ state: false, conversation: currentConversation }).subscribe(function (data) {
                _this.tempTypingState.next(false);
            });
        }
        this.AllConversations.getValue().map(function (conversation) {
            if (conversation._id == cid) {
                if (conversation.deviceID)
                    _this.GetChatHistoryForDeviceID(conversation.deviceID);
                _this._appStateService.setChatBar(true);
                _this.currentConversation.next(conversation);
                setTimeout(function () {
                    (_this.autoScroll.getValue()) ? _this.currentConversation.next(_this.conversationSeen()) : undefined;
                }, 10);
                if (Object.keys(_this.visitorList.getValue()).length > 0) {
                    if (_this.visitorList.getValue()[conversation.sessionid] != undefined) {
                        _this.selectedVisitor.next(_this.visitorList.getValue()[conversation.sessionid]);
                    }
                    else {
                        _this.selectedVisitor.next({});
                    }
                }
                else
                    _this.selectedVisitor.next({});
            }
        });
    };
    ChatService.prototype.ShowSelectedChat = function (conversation) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            // this.socket.emit('SelectedConversationDetails', { cid: conversation._id }, (response => {
            // 	if (response.status == "ok" && response.msgList) {
            // 		observer.next(response.msgList)
            // 		observer.complete();
            // 	}
            // }));
            _this.http.post(_this.chatServiceURL + '/selectedConversationDetails', { cid: conversation._id }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == "ok" && data.msgList) {
                        observer.next(data.msgList);
                        observer.complete();
                    }
                }
            });
        });
    };
    ChatService.prototype.UpdateChatHistory = function (conversation, messages) {
        var _this = this;
        this.chatHistoryList.next(this.chatHistoryList.getValue().map(function (history) {
            if (conversation.deviceID == history.deviceID) {
                history.conversations.map(function (convo) {
                    if (convo._id == conversation._id) {
                        convo.msgList = messages;
                        convo.msgFetched = true;
                    }
                    return convo;
                });
                _this.selectedChatHistory.next(history);
            }
            return history;
        }));
    };
    ChatService.prototype.ExtractSessionInfo = function (history) {
        if (!history.sessionInfo)
            history.sessionInfo = [];
        if (history.conversations) {
            history.conversations.map(function (convo) {
                var info = {};
                info._id = convo.sessionid;
                info.deviceID = convo.deviceID;
                info.agentemail = convo.agentEmail;
                info.visitorName = convo.visitorName;
                info.createdOn = convo.createdOn;
                history.sessionInfo.push(info);
            });
            this.selectedChatHistory.next(history);
            this.chatHistoryList.next(this.chatHistoryList.getValue().map(function (data) {
                if (data.deviceID == history.deviceID)
                    data = history;
                return data;
            }));
        }
    };
    ChatService.prototype.getCurrentConversation = function () {
        return this.currentConversation;
    };
    ChatService.prototype.GetConverSations = function (filters) {
        var _this = this;
        if (filters === void 0) { filters = {}; }
        // this.socket.emit('getConversations', this.Agent.email);
        this.http.post(this.chatServiceURL + '/getConversations', { email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (response) {
            // console.log(response.json());
            if (response.json()) {
                var data = response.json();
                var conversations = (data && data.conversations && data.conversations.length) ? data.conversations : [];
                // let conversations: Array<any> = (data) ? data : [];
                _this.inboxChunk = (data.ended) ? -1 : _this.inboxChunk + 1;
                conversations = conversations.sort(function (a, b) {
                    if (a.state == 2)
                        return -1;
                    if (a.messages.length && b.messages.length) {
                        var aDate = new Date(a.messages[a.messages.length - 1].date);
                        var bDate = new Date(b.messages[b.messages.length - 1].date);
                        return (aDate.getTime() - bDate.getTime() > 0) ? -1 : 1;
                    }
                    else if (a.messages.length && !b.messages.length) {
                        return -1;
                    }
                    else if (!a.messages.length && b.messages.length) {
                        return 1;
                    }
                    else {
                        return (new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime() > 0) ? -1 : 1;
                    }
                });
                // ////console.log(conversations);
                //Case To Maintain SneakPeak State of Visitor After Refresh
                var temp_1 = conversations.map(function (conversation) {
                    if (conversation && conversation.superviserAgents && conversation.superviserAgents.length) {
                        if (conversation.superviserAgents.includes(_this.Agent.csid))
                            _this.SuperVisedChatList.getValue().push(conversation._id);
                    }
                    if (_this.visitorList.getValue()[conversation.sessionid] != undefined) {
                        conversation.typingState = _this.visitorList.getValue()[conversation.sessionid].typingState;
                    }
                    return conversation;
                });
                //for duplication of chats during loading inbox chats and receiving new conversation in between
                temp_1 = temp_1.filter(function (item) {
                    return _this.AllConversations.getValue().find(function (item2) {
                        return ((item._id == item2._id));
                    }) == undefined;
                });
                _this.AllConversations.next(_this.AllConversations.getValue().concat(temp_1));
                _this.setLoading(false, 'CURRENTCONVERSATIONS');
                if (_this.autoSync) {
                    _this.autoSync = false;
                    _this.AutoSync.next(true);
                }
                _this.conversationsFetched = true;
            }
        });
    };
    ChatService.prototype.GetAllConversations = function () {
        return this.AllConversations.asObservable();
    };
    ChatService.prototype.Destroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatService.prototype.GetSelectedVisitor = function () {
        return this.selectedVisitor.asObservable();
    };
    ChatService.prototype.ToogleChatMode = function (acceptingChat) {
        var _this = this;
        this.socket.emit('toogleChatMode', { acceptingChats: acceptingChat }, function (response) {
            if (response.status == 'ok') {
                _this._authService.setAcceptingChatMode(acceptingChat);
            }
        });
    };
    ChatService.prototype.conversationSeen = function (conversationObj) {
        if (conversationObj === void 0) { conversationObj = undefined; }
        var conversation = (!conversationObj) ? this.currentConversation.getValue() : conversationObj;
        if (this.autoScroll.getValue() && (conversation.state == 2)) {
            this.UpdateMessageSentStatusRest({
                sessionid: conversation.sessionid,
                cid: conversation._id,
                type: 'Visitors'
            });
            if (conversation.messageReadCount > 0) {
                conversation.messageReadCount = 0;
                this.AllConversations.getValue().map(function (conv) {
                    if (conv._id == conversation._id) {
                        //moved to rest in update Message status api
                        //this.socket.emit('seenConversation', conversation._id);
                        conv = conversation;
                    }
                    return conv;
                });
                this.AllConversations.next(this.AllConversations.getValue());
            }
        }
        return conversation;
    };
    ChatService.prototype.getAcceptingChatMode = function () {
        return this.acceptingChatMode.asObservable();
    };
    ChatService.prototype.getNotification = function () {
        return this.notification.asObservable();
    };
    ChatService.prototype.setNotification = function (message) {
        this.notification.next(message);
    };
    ChatService.prototype.getAutoScroll = function () {
        return this.autoScroll.asObservable();
    };
    ChatService.prototype.setAutoScroll = function (value) {
        this.autoScroll.next(value);
    };
    ChatService.prototype.getActiveTab = function () {
        return this.activeTab.asObservable();
    };
    ChatService.prototype.setActiveTab = function (value) {
        this.activeTab.next(value);
    };
    ChatService.prototype.getArchivesSynced = function () {
        return this.archivesSynced.asObservable();
    };
    ChatService.prototype.getArchives = function () {
        return this.Archives.asObservable();
    };
    ChatService.prototype.setSelectedArchive = function (cid) {
        var _this = this;
        this.Archives.getValue().map(function (archive) {
            if (archive._id == cid) {
                if (archive.deviceID)
                    _this.GetChatHistoryForDeviceID(archive.deviceID);
                _this.currentConversation.next(archive);
                _this.selectedVisitor.next({});
            }
        });
    };
    ChatService.prototype.getArchivesFromBackend = function (filters, query) {
        var _this = this;
        if (filters === void 0) { filters = {}; }
        if (query === void 0) { query = []; }
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
        this.http.post(this.chatServiceURL + '/getArchives', { email: this.Agent.email, nsp: this.Agent.nsp, filters: filters, query: query }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    // console.log(data.archives.length);
                    _this.archivesSynced.next(true);
                    _this.Archives.next(data.archives);
                    _this.archiveChunk = (data.ended) ? -1 : _this.archiveChunk + 1;
                    _this.setLoading(false, 'ARCHIVES');
                }
                else {
                    //TODO Error Logic Here
                }
            }
        });
    };
    ChatService.prototype.getMoreArchivesFromBackend = function () {
        var _this = this;
        if (this.archiveChunk != -1 && !this.loadingMoreArchives.getValue()) {
            this.setLoading(true, 'MOREARCHIVES');
            // this.socket.emit('getMoreArchives', { chunk: this.Archives.getValue()[this.Archives.getValue().length - 1].lastmodified, filters: this.Filters.getValue() }, (response) => {
            // 	if (response.status == 'ok') {
            // 		this.Archives.next(this.Archives.getValue().concat(response.archives));
            // 		this.archiveChunk = (response.ended) ? -1 : this.archiveChunk += 1
            // 		this.setLoading(false, 'MOREARCHIVES')
            // 	}
            // });
            this.http.post(this.chatServiceURL + '/getMoreArchives', { email: this.Agent.email, nsp: this.Agent.nsp, chunk: this.Archives.getValue()[this.Archives.getValue().length - 1].lastmodified, filters: this.Filters.getValue() }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.Archives.next(_this.Archives.getValue().concat(data.archives));
                        _this.archiveChunk = (data.ended) ? -1 : _this.archiveChunk += 1;
                        _this.setLoading(false, 'MOREARCHIVES');
                    }
                }
            });
        }
    };
    ChatService.prototype.getMoreArchivesInboxChats = function () {
        var _this = this;
        if (this.inboxChunk != -1 && !this.loadingMoreInbox.getValue()) {
            this.setLoading(true, 'MOREINBOXCHATS');
            // this.socket.emit('getMoreinboxChats', { chunk: this.AllConversations.getValue()[this.AllConversations.getValue().length - 1]._id }, (response) => {
            // 	if (response.status == 'ok') {
            // 		this.AllConversations.next(this.AllConversations.getValue().concat(response.conversations));
            // 		this.inboxChunk = (response.ended) ? -1 : this.inboxChunk += 1
            // 		this.setLoading(false, 'MOREINBOXCHATS')
            // 	}
            // });
            this.http.post(this.chatServiceURL + '/getMoreinboxChats', { email: this.Agent.email, nsp: this.Agent.nsp, chunk: this.AllConversations.getValue()[this.AllConversations.getValue().length - 1]._id }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.AllConversations.next(_this.AllConversations.getValue().concat(data.conversations));
                        _this.inboxChunk = (data.ended) ? -1 : _this.inboxChunk += 1;
                        _this.setLoading(false, 'MOREINBOXCHATS');
                    }
                }
            });
        }
    };
    ChatService.prototype.getArchiveMessages = function (cid) {
        var _this = this;
        if (!this.currentConversation.getValue().synced) {
            this.setLoading(true, 'MESSAGES');
            this.http.post(this.chatServiceURL + '/getArchiveMessages', { cid: cid }).subscribe(function (response) {
                if (response.json()) {
                    var data_3 = response.json();
                    if (data_3.status == 'ok') {
                        _this.Archives.getValue().map(function (archive) {
                            if (archive._id == cid) {
                                data_3.messages.concat(archive.messages);
                                archive.messages = data_3.messages;
                                archive.synced = true;
                                archive.ended = (data_3.ended) ? true : false;
                            }
                        });
                        _this.setLoading(false, 'MESSAGES');
                        _this.Archives.next(_this.Archives.getValue());
                    }
                }
            });
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
    };
    ChatService.prototype.getMoreArchiveMessages = function (cid) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (!_this.currentConversation.getValue().ended) {
                _this.setLoading(true, 'MOREMESSAGES');
                _this.http.post(_this.chatServiceURL + '/getMoreArchiveMessages', {
                    cid: cid,
                    lastMessage: _this.currentConversation.getValue().messages[0]._id
                }).subscribe(function (response) {
                    if (response.json()) {
                        var data_4 = response.json();
                        if (data_4.status == 'ok') {
                            _this.Archives.getValue().map(function (archive) {
                                if (archive._id == cid) {
                                    var messages = data_4.messages.concat(archive.messages);
                                    archive.messages = messages;
                                    archive.ended = (data_4.ended) ? true : false;
                                    _this.currentConversation.next(archive);
                                }
                            });
                            _this.setLoading(false, 'MOREMESSAGES');
                            _this.Archives.next(_this.Archives.getValue());
                            observer.next({ scroll: true });
                            observer.complete();
                        }
                        else {
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
            }
            else {
                observer.next({ scroll: false });
                observer.complete();
            }
        });
    };
    ChatService.prototype.RemovePreviousArchivesForChat = function (ArchiveId) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.Archives.next(_this.Archives.getValue().filter(function (conversation) { return ArchiveId != conversation._id; }));
            observer.next(true);
            observer.complete();
        });
    };
    ChatService.prototype.RemovePreviousChatsFromInbox = function (cid) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.AllConversations.next(_this.AllConversations.getValue().filter(function (conversation) { return cid != conversation._id; }));
            observer.next(true);
            observer.complete();
        });
    };
    ChatService.prototype.moveToArchive = function (conversation, removingConversation, id) {
        if (id === void 0) { id = false; }
        removingConversation.synced = false;
        removingConversation.ended = true;
        // removingConversation.state = 3;
        // removingConversation.lastmodified = new Date().toISOString();
        if (removingConversation.messages && removingConversation.messages.length > 0) {
            removingConversation.lastmessage = removingConversation.messages[removingConversation.messages.length - 1];
        }
        removingConversation.state = 4;
        removingConversation.lastmodified = new Date().toISOString();
        this.Archives.getValue().unshift(removingConversation);
        this.Archives.next(this.Archives.getValue());
    };
    ChatService.prototype.setLoading = function (value, type) {
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
    };
    ChatService.prototype.getLoading = function (type) {
        if (type == 'ARCHIVES') {
            return this.loading.asObservable();
        }
        else if (type == 'MOREARCHIVES') {
            return this.loadingMoreArchives.asObservable();
        }
        else if (type == 'MOREINBOXCHATS') {
            return this.loadingMoreInbox.asObservable();
        }
        else if (type == 'MESSAGES') {
            return this.loadingMessages.asObservable();
        }
        else if (type == 'CURRENTCONVERSATIONS') {
            return this.loadingCurrentConversation.asObservable();
        }
        else {
            return this.loadingMoreMessages.asObservable();
        }
    };
    ChatService.prototype.UpdateChatTicketDetails = function (details, cid) {
        if (this.activeTab.getValue() == 'INBOX') {
            this.AllConversations.next(this.AllConversations.getValue().map(function (conversation) {
                // console.log(conversation);
                if (conversation._id == cid) {
                    if (!conversation.tickets)
                        conversation.tickets = [];
                    conversation.tickets.push(details);
                }
                return conversation;
            }));
        }
        else if (this.activeTab.getValue() == 'ARCHIVE') {
            this.Archives.next(this.Archives.getValue().map(function (conversation) {
                // console.log(conversation);
                if (conversation._id == cid) {
                    if (!conversation.tickets)
                        conversation.tickets = [];
                    conversation.tickets.push(details);
                }
                return conversation;
            }));
        }
    };
    ChatService.prototype.ConvertChatToTicket = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
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
            data.sessionid = _this.Agent.csid;
            data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            _this.http.post(_this.chatServiceURL + '/convertChatToTicket', data).subscribe(function (data) {
                if (data.json()) {
                    var response = data.json();
                    if (response.status == "ok") {
                        // this.UpdateChatTicketDetails(response.ticket, response.cid);
                        observer.next(true);
                        observer.complete();
                    }
                    else {
                        observer.error({ code: "stt", text: "Error in converting Chat To Ticket" });
                    }
                }
            });
        });
    };
    //Ban Chat
    ChatService.prototype.BanVisitorChat = function (sessionId, deviceID, days) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('banVisitor', { sessionid: sessionId, deviceID: deviceID, days: days }, function (response) {
                if (response.status == "ok") {
                    observer.next(response.visitor);
                }
                else if (response.status == "alreadyBanned")
                    observer.next(false);
                else {
                    observer.error({ code: "stt", text: "Error in Banning Chat" });
                }
            });
        });
    };
    ChatService.prototype.StopVisitorChat = function (sessionId, conversation) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('stopVisitorChat', { sessionid: sessionId, conversation: conversation }, function (response) {
                if (response.status == "ok") {
                    ////console.log(response.conversation)
                    _this.AllConversations.next(_this.AllConversations.getValue().filter(function (conversation) {
                        if (conversation._id == _this.currentConversation.getValue()._id) {
                            _this.moveToArchive(conversation, response.conversation);
                        }
                        return conversation._id != response.conversation._id;
                    }));
                    // this.chatHistoryList.next(this.chatHistoryList.getValue().map(history => {
                    // 	if (history.deviceID == response.conversation.deviceID) {
                    // 		history.conversations.unshift(response.conversation);
                    // 	}
                    // 	return history
                    // }));
                    if (conversation._id == _this.currentConversation.getValue()._id)
                        _this.DiscardCurrentConversation();
                    //this.EndChat();
                    observer.next(response.conversation);
                    observer.complete();
                }
                else {
                    observer.error({ code: "stt", text: "Error in Stopping Chat" });
                }
            });
        });
    };
    ChatService.prototype.StopVisitorChatRest = function (sessionId, conversation) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.chatServiceURL + '/stopVisitorChat', { sessionid: _this.Agent.csid, conversation: conversation }).subscribe(function (data) {
                    if (data.json()) {
                        var response_7 = data.json();
                        if (response_7.status == "ok") {
                            _this.AllConversations.next(_this.AllConversations.getValue().filter(function (conversation) {
                                if (conversation._id == _this.currentConversation.getValue()._id) {
                                    _this.moveToArchive(conversation, response_7.conversation);
                                }
                                return conversation._id != response_7.conversation._id;
                            }));
                            if (conversation._id == _this.currentConversation.getValue()._id)
                                _this.DiscardCurrentConversation();
                            observer.next(response_7.conversation);
                            observer.complete();
                        }
                        else {
                            observer.error({ code: "stt", text: "Error in Stopping Chat" });
                        }
                    }
                    else {
                        observer.error({ code: "stt", text: "Error in Stopping Chat" });
                    }
                }, function (err) {
                    observer.error({ code: "stt", text: "Error in Stopping Chat" });
                });
            }
            catch (error) {
                observer.error({ code: "stt", text: "Error in Stopping Chat" });
            }
        });
    };
    //UnBan Chat
    ChatService.prototype.UnBanVisitorChat = function (deviceID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('UnbanVisitor', { deviceID: deviceID }, function (response) {
                if (response.status == "ok") {
                    observer.next(true);
                }
                else {
                    observer.error({ code: "stt", text: "Error in UnBanning Chat" });
                }
            });
        });
    };
    //typing event
    ChatService.prototype.SendTypingEvent = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (_this.chatPermissions.allowTypingStatus) {
                _this.socket.emit("agentTyping", data, function (response) {
                });
                observer.next(true);
                observer.complete();
            }
            else {
                observer.next(true);
                observer.complete();
            }
        });
    };
    ChatService.prototype.SendTypingEventRest = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                if (_this.chatPermissions.allowTypingStatus && (data.conversation.state == 2)) {
                    var typingData = { state: data.state, sessionid: data.conversation.sessionid, type: 'Agents' };
                    _this.http.post(_this.chatServiceURL + "/typing", typingData).subscribe(function (response) {
                    }, function (err) {
                        observer.next(false);
                        observer.complete();
                    });
                    observer.next(true);
                    observer.complete();
                }
                else {
                    observer.next(false);
                    observer.complete();
                }
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    //Email Chat TRanscript
    ChatService.prototype.EmailChatTranscript = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            // this.socket.emit('emailChatTranscript', data, (response: any) => {
            // 	if (response.status == "ok") {
            // 		observer.next(true);
            // 	}
            // 	else {
            // 		observer.error();
            // 	}
            // });
            _this.http.post(_this.visitorServiceURL + '/emailtranscript', data).subscribe(function (response) {
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
    };
    //Message Drafts
    ChatService.prototype.SetDraft = function (draft) {
        if (!this.messageDrafts.getValue().filter(function (d) { return d.id == draft.id; }).length) {
            this.messageDrafts.getValue().push(draft);
            this.messageDrafts.next(this.messageDrafts.getValue());
        }
        else {
            this.messageDrafts.getValue().map(function (d) {
                if (d.id == draft.id) {
                    d.message = draft.message;
                }
                return d;
            });
        }
    };
    ChatService.prototype.DeleteDraft = function (id) {
        if (this.messageDrafts.getValue().filter(function (d) { return d.id == id; }).length) {
            this.messageDrafts.next(this.messageDrafts.getValue().filter(function (d) { return d.id != id; }));
        }
    };
    // RemoveDraft(id){
    // 	let index = this.messageDrafts.getValue().findIndex(d => d.id == id);
    // 	if(index > -1){
    // 		this.messageDrafts.getValue().splice(index, 1);
    // 		this.messageDrafts.next(this.messageDrafts.getValue());
    // 	}
    // }
    ChatService.prototype.addConversationTags = function (_id, tags) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var conversationLog = {
                title: "Tag(s) Entered",
                status: tags,
                updated_by: _this.Agent.email,
                user_type: 'Agent',
                time_stamp: new Date().toISOString()
            };
            // this.socket.emit('addConversationTags', { _id: _id, tag: tags, conversationLog: conversationLog }, (response) => {
            _this.http.post(_this.chatServiceURL + '/addConversationTags', { sessionid: _this.Agent.csid, _id: _id, tag: tags, conversationLog: conversationLog }).subscribe(function (data) {
                if (data.json()) {
                    var response = data.json();
                    if (response.status == 'ok') {
                        var msg_1 = '';
                        var found_1 = false;
                        if (_this.activeTab.getValue() == 'INBOX') {
                            _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                                if (conversation._id == _id) {
                                    if (_this.currentConversation.getValue()._id == _id)
                                        _this.currentConversation.next(conversation);
                                    found_1 = true;
                                    if (!conversation.tags)
                                        conversation.tags = [];
                                    conversation.tags = conversation.tags.concat(tags);
                                    msg_1 = 'Chat #' + conversation.clientID + ' is Tagged As "' + tags + '" Successfully';
                                }
                                return conversation;
                            }));
                        }
                        else {
                            _this.Archives.next(_this.Archives.getValue().map(function (conversation) {
                                if (conversation._id == _id) {
                                    if (_this.currentConversation.getValue()._id == _id)
                                        _this.currentConversation.next(conversation);
                                    found_1 = true;
                                    if (!conversation.tags)
                                        conversation.tags = [];
                                    conversation.tags = conversation.tags.concat(tags);
                                    msg_1 = 'Chat #' + conversation.clientID + ' is Tagged As ' + tags + ' Successfully';
                                }
                                return conversation;
                            }));
                        }
                        if (found_1) {
                            _this.notification.next({
                                msg: msg_1,
                                type: 'success',
                                img: 'ok'
                            });
                            observer.next({ status: response.status, ticket_data: response.ticket_data });
                            observer.complete();
                        }
                        else {
                            _this.notification.next({
                                msg: "Can't Add Tag",
                                type: 'error',
                                img: 'warning'
                            });
                            observer.complete();
                        }
                    }
                    else {
                        _this.notification.next({
                            msg: "Can't Add Tag",
                            type: 'error',
                            img: 'warning'
                        });
                        observer.complete();
                    }
                }
                else {
                    _this.notification.next({
                        msg: "Can't Add Tag",
                        type: 'error',
                        img: 'warning'
                    });
                    observer.complete();
                }
            });
        });
    };
    ChatService.prototype.deleteConversationTag = function (tag, index, conversationID) {
        var _this = this;
        // this.socket.emit('deleteConversationTag', { _id: conversationID, tag: tag, index: index }, (response) => {
        this.http.post(this.chatServiceURL + '/deleteConversationTag', { sessionid: this.Agent.csid, _id: conversationID, tag: tag, index: index }).subscribe(function (data) {
            if (data.json()) {
                var response = data.json();
                if (response.status == "ok") {
                    if (_this.activeTab.getValue() == 'INBOX') {
                        var index_1 = _this.AllConversations.getValue().findIndex(function (a) { return a._id == conversationID; });
                        _this.AllConversations.getValue()[index_1].tags = response.deletedresult;
                        _this.AllConversations.next(_this.AllConversations.getValue());
                        if (_this.currentConversation.getValue()._id == conversationID) {
                            _this.currentConversation.getValue().tags = response.deletedresult;
                            _this.currentConversation.next(_this.currentConversation.getValue());
                        }
                        _this.RefreshList();
                    }
                    else {
                        var index_2 = _this.Archives.getValue().findIndex(function (a) { return a._id == _this.currentConversation.getValue()._id; });
                        _this.Archives.getValue()[index_2].tags = response.deletedresult;
                        _this.Archives.next(_this.Archives.getValue());
                        if (_this.currentConversation.getValue()._id == conversationID) {
                            _this.currentConversation.getValue().tags = response.deletedresult;
                            _this.currentConversation.next(_this.currentConversation.getValue());
                        }
                    }
                    var msg = 'Tag is deleted Successfully';
                    _this.notification.next({
                        msg: msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
                else {
                    _this.notification.next({
                        msg: "Can't delete Tag",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
            else {
                _this.notification.next({
                    msg: "Can't delete Tag",
                    type: 'error',
                    img: 'warning'
                });
            }
        });
    };
    ChatService.prototype.SelectConversation = function (value, tab) {
        var _this = this;
        var hash = 0;
        if (tab == 'INBOX') {
            this.AllConversations.getValue().map(function (conversation, index) {
                if (conversation._id == _this.currentConversation.getValue()._id) {
                    hash = (value == 'next') ? (index + 1) : (index - 1);
                }
            });
            if (hash >= 0) {
                if (this.AllConversations.getValue()[hash]) {
                    this.setCurrentConversation(this.AllConversations.getValue()[hash]._id);
                }
            }
        }
        else {
            this.Archives.getValue().map(function (conversation, index) {
                if (conversation._id == _this.currentConversation.getValue()._id) {
                    hash = (value == 'next') ? (index + 1) : (index - 1);
                }
            });
            if (hash >= 0) {
                if (this.Archives.getValue()[hash]) {
                    this.setSelectedArchive(this.Archives.getValue()[hash]._id);
                }
            }
        }
    };
    ChatService.prototype.RefreshList = function () {
        this.AllConversations.getValue().sort(function (a, b) {
            var aDate = (a.lasttouchedTime) ? a.lasttouchedTime : a.datetime;
            var bDate = (b.lasttouchedTime) ? b.lasttouchedTime : b.datetime;
            return (Date.parse(aDate) - Date.parse(bDate) > 0) ? -1 : 1;
        });
        this.AllConversations.next(this.AllConversations.getValue());
    };
    ChatService.prototype.TypingOnReload = function () {
        if (this.currentConversation.getValue())
            this.SendTypingEventRest({ state: false, conversation: this.currentConversation.getValue() });
    };
    ChatService.prototype.GetChatHistoryForDeviceID = function (deviceID) {
        var _this = this;
        if (!this.DeviceIDHashList.getValue()[deviceID]) {
            this.DeviceIDHashList.getValue()[deviceID] = deviceID;
            this.chatHistoryList.getValue().push({ deviceID: deviceID, conversationsFetched: false });
        }
        this.chatHistoryList.next(this.chatHistoryList.getValue().map(function (history) {
            if (history.deviceID && (history.deviceID == deviceID) && !history.conversationsFetched) {
                history.noMoreChats = false;
                _this.getConversationsListFromBackEnd(history.deviceID).subscribe(function (conversations) {
                    if (conversations.length < 19)
                        history.noMoreChats = true;
                    if (conversations) {
                        if (!history.conversations)
                            history.conversations = [];
                        history.conversations = conversations;
                        history.conversationsFetched = true;
                        _this.ExtractSessionInfo(history);
                    }
                    else {
                        history.conversations = '';
                        history.conversationsFetched = true;
                    }
                    // this.fetchingConversation = false
                }, function (err) {
                    history.conversations = '';
                    history.conversationsFetched = true;
                    // this.fetchingConversation = false
                });
            }
            return history;
        }));
        this.chatHistoryList.getValue().map(function (history) {
            if (history.deviceID == deviceID) {
                _this.selectedChatHistory.next(history);
            }
        });
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
    };
    ChatService.prototype.UpdateDynamicProperty = function (_id, fieldName, fieldvalue) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.chatServiceURL + '/updateChatDynamicProperty', { cid: _id, name: fieldName, value: fieldvalue, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        _this.AllConversations.next(_this.AllConversations.getValue().map(function (conversation) {
                            if (conversation._id == _id) {
                                if (!conversation.dynamicFields)
                                    conversation.dynamicFields = {};
                                conversation.dynamicFields[fieldName] = fieldvalue;
                                if (_this.currentConversation.getValue()._id != _id)
                                    _this.currentConversation.next(conversation);
                            }
                            return conversation;
                        }));
                        observer.next({ status: "ok" });
                        observer.complete();
                    }
                    else {
                        observer.next({ status: "error" });
                        observer.complete();
                    }
                }
            }, function (err) {
                observer.next({ status: "error" });
                observer.complete();
            });
        });
    };
    ChatService = __decorate([
        core_1.Injectable()
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
//# sourceMappingURL=ChatService.js.map