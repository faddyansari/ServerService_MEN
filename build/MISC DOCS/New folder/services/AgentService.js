"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
var core_1 = require("@angular/core");
//RxJS Imports
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
require("rxjs/add/observable/interval");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var confirmation_dialog_component_1 = require("../app/dialogs/confirmation-dialog/confirmation-dialog.component");
var xlsx_1 = require("xlsx");
var xlsx = { utils: xlsx_1.utils, readFile: xlsx_1.readFile, read: xlsx_1.read };
var AgentService = /** @class */ (function () {
    function AgentService(_socket, http, dialog, _authService, _notificationService, _analyticsService) {
        var _this = this;
        this._socket = _socket;
        this.http = http;
        this.dialog = dialog;
        this._authService = _authService;
        this._notificationService = _notificationService;
        this._analyticsService = _analyticsService;
        this.AvailableAgents = new BehaviorSubject_1.BehaviorSubject([]);
        this.FilteredAgents = new BehaviorSubject_1.BehaviorSubject([]);
        this.Filters = new BehaviorSubject_1.BehaviorSubject({});
        this.filterDrawer = new BehaviorSubject_1.BehaviorSubject(false);
        this.Initialized = new BehaviorSubject_1.BehaviorSubject(false);
        this.agentServiceURL = '';
        this.agent = new BehaviorSubject_1.BehaviorSubject({});
        this.subscriptions = [];
        this.selectedAgent = new BehaviorSubject_1.BehaviorSubject({});
        this.selectedAgentConversation = new BehaviorSubject_1.BehaviorSubject({});
        this.agentConversationList = new BehaviorSubject_1.BehaviorSubject([]);
        this.notification = new BehaviorSubject_1.BehaviorSubject('');
        this.selectedFilter = new BehaviorSubject_1.BehaviorSubject('all');
        this.currentConvId = new BehaviorSubject_1.BehaviorSubject('');
        this.timer = Observable_1.Observable.interval(1000 * 60);
        this.showAgentAccessInfo = new BehaviorSubject_1.BehaviorSubject(false);
        this.ShowAttachmentAreaDnd = new BehaviorSubject_1.BehaviorSubject(false);
        this.windowNotificationSettings = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.emailNotificationSettings = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.initialized = false;
        //Loading Variable
        this.loadingAgents = new BehaviorSubject_1.BehaviorSubject(true);
        this.isSelfViewingChat = new BehaviorSubject_1.BehaviorSubject({ chatId: '', value: false });
        this.loadingConversation = new BehaviorSubject_1.BehaviorSubject(false);
        this.listToView = new BehaviorSubject_1.BehaviorSubject({
            'agents': true,
            'conversations': false
        });
        this.agentsChunk = 0;
        this.loadingMoreAgents = new BehaviorSubject_1.BehaviorSubject(false);
        this.searchValue = new BehaviorSubject_1.BehaviorSubject('');
        this.agentCounts = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.closeDetail = new BehaviorSubject_1.BehaviorSubject(true);
        //console.log(this.AvailableAgents);
        // console.log('Agents Service Initialized');
        //console.log()
        this._authService.RestServiceURL.subscribe(function (url) {
            _this.agentServiceURL = url + '/agent';
        });
        this.AvailableAgents = new BehaviorSubject_1.BehaviorSubject([]);
        //Subscribing Agent Object
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent.next(data);
            // if(data && this.socket){
            //     if(data.role == 'admin') {
            //         this.getAllAgentsAsync();
            //     }else{
            //         this.getAgentsWRTGroup(data.groups)
            //     }
            // }
        }));
        //Getting URL
        this.subscriptions.push(this._authService.getServer().subscribe(function (url) {
            _this.url = url;
        }));
        //Subscribing Connected Socket
        this.subscriptions.push(_socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                if (!_this.initialized) {
                    _this.getAgentCounts();
                    _this.getAllAgentsAsync();
                    _this.getAllAgentConversations();
                    _this.GetEmailNotificationSettings();
                    _this.GetWindowNotificationSettings();
                }
                // this.Filters.debounceTime(1500).subscribe(filter => {
                //     if (!this.Initialized.getValue()) {
                //         this.getAgents(filter, false);
                //     } else {
                //         if (JSON.stringify(filter) == this.lastResponse && !this.lastResponse.reload) {
                //             this.loadingAgents.next(false);
                //             return;
                //         }
                //         else {
                //             this.lastResponse = JSON.stringify(filter);
                //             this.getAgents(filter, true);
                //         }
                //     }
                // })
                _this.socket.on('agentAvailable', function (data) {
                    // console.log('agentAvailable', data);
                    if (data) {
                        // console.log(data);
                        // console.log(this.agent.getValue());
                        if (_this.agent.getValue().email == data.email)
                            _this._authService.setAcceptingChatMode(data.session.acceptingChats);
                    }
                    if (!_this.searchValue.getValue()) {
                        if (_this.selectedFilter.getValue() == 'online' || _this.selectedFilter.getValue() == 'all') {
                            // console.log(this.selectedFilter.getValue());
                            if (_this.AvailableAgents.getValue().filter(function (a) { return a.email == data.email; }).length) {
                                _this.AvailableAgents.getValue().map(function (agent) {
                                    if (agent.email == data.email) {
                                        agent.liveSession = data.session;
                                    }
                                    // else{
                                    // }
                                    return;
                                });
                                _this.AvailableAgents.next(_this.AvailableAgents.getValue());
                            }
                            else {
                                _this.AvailableAgents.getValue().push({
                                    _id: data.session.agent_id,
                                    email: data.session.email,
                                    nickname: data.session.nickname,
                                    image: data.session.image,
                                    liveSession: data.session,
                                    details: false
                                });
                                _this.AvailableAgents.next(_this.AvailableAgents.getValue());
                            }
                        }
                        else {
                            var index = _this.AvailableAgents.getValue().findIndex(function (a) { return a.email == data.email; });
                            if (index != -1) {
                                _this.AvailableAgents.getValue().splice(index, 1);
                            }
                        }
                    }
                    if (_this.agentCounts.getValue()) {
                        if (!_this.agentCounts.getValue().agents.filter(function (a) { return a.email == data.email; }).length) {
                            _this.agentCounts.getValue().agents.push({
                                email: data.email,
                                state: (data.session && data.session.acceptingChats) ? 'active' : 'idle'
                            });
                        }
                        _this.agentCounts.next(_this.agentCounts.getValue());
                    }
                });
                _this.socket.on('agentUnavailable', function (data) {
                    // console.log('agentUnavailable');
                    if (!_this.searchValue.getValue()) {
                        if (_this.selectedFilter.getValue() == 'offline' || _this.selectedFilter.getValue() == 'all') {
                            // console.log(this.selectedFilter.getValue());
                            if (_this.AvailableAgents.getValue().filter(function (a) { return a.email == data.email; }).length) {
                                _this.AvailableAgents.getValue().map(function (agent) {
                                    if (agent.email == data.email) {
                                        delete agent.liveSession;
                                    }
                                    return;
                                });
                                _this.AvailableAgents.next(_this.AvailableAgents.getValue());
                            }
                            else {
                                _this.AvailableAgents.getValue().push({
                                    _id: data.session.agent_id,
                                    email: data.session.email,
                                    nickname: data.session.nickname,
                                    image: data.session.image,
                                    details: false
                                });
                                _this.AvailableAgents.next(_this.AvailableAgents.getValue());
                            }
                        }
                        else {
                            var index = _this.AvailableAgents.getValue().findIndex(function (a) { return a.email == data.email; });
                            if (index != -1) {
                                _this.AvailableAgents.getValue().splice(index, 1);
                            }
                        }
                    }
                    if (_this.agentCounts.getValue()) {
                        _this.agentCounts.getValue().agents.map(function (a, index) {
                            if (a.email == data.email) {
                                _this.agentCounts.getValue().agents.splice(index, 1);
                            }
                        });
                        _this.agentCounts.next(_this.agentCounts.getValue());
                    }
                });
                // this.socket.on('agentAvailable', (data) => {
                //     this.AvailableAgents.next(this.AvailableAgents.getValue().map(agent => {
                //         if (agent.email == data.email) {
                //             agent.liveSession = data.session;
                //         }
                //         return agent;
                //     }));
                //     if (this.agentCounts.getValue()) {
                //         if (!this.agentCounts.getValue().agents.filter(a => a.email == data.email).length) {
                //             this.agentCounts.getValue().agents.push({
                //                 email: data.email,
                //                 state: (data.session && data.session.acceptingChats) ? 'active' : 'idle'
                //             });
                //         }
                //         this.agentCounts.next(this.agentCounts.getValue());
                //     }
                // });
                // this.socket.on('agentUnavailable', (data) => {
                //     this.AvailableAgents.next(this.AvailableAgents.getValue().map(agent => {
                //         if (agent.email == data.email) {
                //             delete agent.liveSession;
                //         }
                //         return agent;
                //     }));
                //     if (this.agentCounts.getValue()) {
                //         this.agentCounts.getValue().agents.map((a, index) => {
                //             if (a.email == data.email) {
                //                 this.agentCounts.getValue().agents.splice(index, 1);
                //             }
                //         });
                //         this.agentCounts.next(this.agentCounts.getValue())
                //     }
                // })
                _this.socket.on('updateCallingState', function (data) {
                    if (data) {
                        var agent = _this.agent.getValue();
                        agent.callingState.state = data.state;
                        _this.agent.next(agent);
                    }
                });
                _this.socket.on('gotNewAgentConversation', function (data) {
                    // console.log(data.conversation);
                    _this.agentConversationList.getValue().push(data.conversation);
                    _this.agentConversationList.next(_this.agentConversationList.getValue());
                });
                _this.socket.on('gotNewAgentMessage', function (response) {
                    if (_this.isSelfViewingChat.getValue().chatId != response.currentConversation._id || (_this.isSelfViewingChat.getValue().chatId == response.currentConversation._id && !_this.isSelfViewingChat.getValue().value)) {
                        if (response.currentConversation.LastSeen.filter(function (data) { return data.email == _this.agent.getValue().email; })[0].messageReadCount <= 1) {
                            var notif_data = [];
                            notif_data.push({
                                'title': response.message.from + ' says:',
                                'alertContent': response.message.body,
                                'icon': "../assets/img/favicon.ico",
                                'url': "/agents"
                            });
                            _this._notificationService.generateNotification(notif_data);
                        }
                    }
                    var index = _this.agentConversationList.getValue().findIndex(function (obj) { return obj._id == response.currentConversation._id; });
                    _this.agentConversationList.getValue()[index] = response.currentConversation;
                    _this.agentConversationList.next(_this.sortBy('LastUpdated', _this.agentConversationList.getValue()));
                    if (_this.selectedAgentConversation.getValue() && _this.isSelfViewingChat.getValue().chatId == response.currentConversation._id) {
                        _this.selectedAgentConversation.getValue().messages.push(response.message);
                        _this.selectedAgentConversation.next(_this.selectedAgentConversation.getValue());
                        _this.conversationSeen(response.currentConversation._id, response.currentConversation.members.map(function (a) { return a.email; }));
                    }
                });
                _this.socket.on('gotNewAgentEventMessage', function (response) {
                    var index = _this.agentConversationList.getValue().findIndex(function (obj) { return obj._id == response.currentConversation._id; });
                    if (index != -1) {
                        if (response.removedAgent) {
                            _this.agentConversationList.getValue()[index].members = _this.agentConversationList.getValue()[index].members.filter(function (m) { return m.email != response.removedAgent; });
                            _this.agentConversationList.getValue()[index].LastSeen = _this.agentConversationList.getValue()[index].LastSeen.filter(function (m) { return m.email != response.removedAgent; });
                            _this.agentConversationList.next(_this.agentConversationList.getValue());
                        }
                        else {
                            _this.agentConversationList.getValue()[index].members = response.currentConversation.members;
                            _this.agentConversationList.getValue()[index].LastSeen = response.currentConversation.LastSeen;
                            _this.agentConversationList.next(_this.agentConversationList.getValue());
                        }
                    }
                    else {
                        _this.agentConversationList.getValue().push(response.currentConversation);
                        _this.agentConversationList.next(_this.agentConversationList.getValue());
                    }
                    if (_this.selectedAgentConversation.getValue() && _this.isSelfViewingChat.getValue().chatId == response.currentConversation._id) {
                        _this.selectedAgentConversation.getValue().messages.push(response.message);
                        if (response.removedAgent) {
                            _this.selectedAgentConversation.getValue().LastSeen = _this.selectedAgentConversation.getValue().LastSeen.filter(function (l) { return l.email != response.removedAgent; });
                            _this.selectedAgentConversation.getValue().members = _this.selectedAgentConversation.getValue().members.filter(function (l) { return l.email != response.removedAgent; });
                        }
                        else {
                            _this.selectedAgentConversation.getValue().LastSeen = response.currentConversation.LastSeen;
                            _this.selectedAgentConversation.getValue().members = response.currentConversation.members;
                        }
                        _this.selectedAgentConversation.next(_this.selectedAgentConversation.getValue());
                        // this.conversationSeen(response.currentConversation._id, response.currentConversation.members.map(a => a.email));
                    }
                    // let index = this.agentConversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                    // this.agentConversationList.getValue()[index] = response.currentConversation;
                    // this.agentConversationList.next(this.agentConversationList.getValue());
                    // if (this.selectedAgentConversation.getValue() && this.isSelfViewingChat.getValue().chatId == response.currentConversation._id) {
                    //     this.selectedAgentConversation.getValue().messages.push(response.message);
                    //     this.selectedAgentConversation.getValue().members.forEach((member,index) => {
                    //         if(member.email == response.removedAgent){
                    //             this.selectedAgentConversation.getValue().members.splice(index,1);
                    //         }
                    //     });
                    //     this.selectedAgentConversation.next(this.selectedAgentConversation.getValue());
                    //     // this.conversationSeen(response.currentConversation._id, response.currentConversation.members.map(a => a.email));
                    // }
                });
                _this.socket.on('seenAgentConversation', function (response) {
                    // console.log('SeenAgentConversation');
                    // console.log(this.selectedAgentConversation.getValue());
                    if (Object.keys(_this.selectedAgentConversation.getValue()).length) {
                        var thread = _this.selectedAgentConversation.getValue();
                        thread.LastSeen = response.LastSeen;
                        _this.selectedAgentConversation.next(thread);
                    }
                    // console.log(this.selectedAgentConversation.getValue());
                    // this.getAllAgentConversations();
                });
                _this.socket.on('newAgent', function (agent) {
                    //console.log('New Agent');
                    //Adding to Visitor Array
                    this.AvailabaleAgents.getValue().unshift(agent.session);
                    ////console.log(this.visitorList);
                    this.AvailabaleAgents.next(this.AvailabaleAgents.getValue());
                    // if(this.agentCounts.getValue()){
                    //     this.agentCounts.getValue().agents.push({
                    //         email: agent.email,
                    //         state: (agent.session && agent.session.acceptingChats) ? 'active' : 'idle'
                    //     });
                    //     this.agentCounts.next(this.agentCounts.getValue());
                    // }
                    // this.getAgentCounts();
                });
                _this.socket.on('removeAgent', function (sessionId) {
                    //console.log('Remove Agent');
                    //Removing Agent By Filter Logic.
                    this.AvailabaleAgents.next(this.AvailabaleAgents.getValue().filter(function (item) {
                        return item.id != sessionId;
                    }));
                    // this.getAgentCounts();
                });
                _this.socket.on('idleOn', function (data) {
                    _this.AvailableAgents.next(_this.AvailableAgents.getValue().map(function (agent) {
                        if (data.email == agent.email && agent.liveSession) {
                            agent.liveSession.state = 'IDLE';
                            agent.liveSession.acceptingChats = false;
                            if (agent.liveSession.idlePeriod) {
                                agent.liveSession.idlePeriod.push({ startTime: data.startTime, endTime: undefined });
                            }
                            else {
                                Object.assign(agent.liveSession, {
                                    idlePeriod: [
                                        { startTime: data.startTime, endTime: undefined }
                                    ]
                                });
                            }
                        }
                        //if (this.selectedAgent.getValue().email == agent.email) this.selectedAgent.next(agent)
                        return agent;
                    }));
                    if (_this.selectedAgent.getValue() && _this.selectedAgent.getValue().email == data.email) {
                        var agent = _this.selectedAgent.getValue();
                        agent.liveSession.state = 'IDLE';
                        agent.liveSession.acceptingChats = false;
                        if (agent.liveSession.idlePeriod) {
                            agent.liveSession.idlePeriod.push({ startTime: data.startTime, endTime: undefined });
                        }
                        else {
                            Object.assign(agent.liveSession, {
                                idlePeriod: [
                                    { startTime: data.startTime, endTime: undefined }
                                ]
                            });
                        }
                        _this.selectedAgent.next(agent);
                    }
                    if (_this.agentCounts.getValue()) {
                        _this.agentCounts.getValue().agents.map(function (a, index) {
                            if (a.email == data.email) {
                                a.state = 'idle';
                                return;
                            }
                        });
                        _this.agentCounts.next(_this.agentCounts.getValue());
                    }
                    // this.getAgentCounts();
                });
                _this.socket.on('ppChanged', function (data) {
                    //console.log(data);
                    _this.AvailableAgents.next(_this.AvailableAgents.getValue().map(function (agent) {
                        if (agent.email == data.email) {
                            agent.image = data.url;
                        }
                        return agent;
                    }));
                });
                _this.socket.on('idleOff', function (data) {
                    _this.AvailableAgents.next(_this.AvailableAgents.getValue().map(function (agent) {
                        if (data.email == agent.email) {
                            if (!agent.liveSession) {
                                var obj = {
                                    liveSession: {
                                        createdDate: new Date().toISOString(),
                                        state: 'ACTIVE',
                                        acceptingChats: true
                                    }
                                };
                                Object.assign(agent, obj);
                                // console.log(agent);
                            }
                            else {
                                agent.liveSession.state = 'ACTIVE';
                                var idlePeriod = agent.liveSession.idlePeriod.pop();
                                if (!idlePeriod)
                                    idlePeriod = {};
                                idlePeriod.endTime = data.endTime;
                                agent.liveSession.idlePeriod.push(idlePeriod);
                                agent.liveSession.acceptingChats = true;
                            }
                        }
                        //if (this.selectedAgent.getValue().email == agent.email) this.selectedAgent.next(agent)
                        return agent;
                    }));
                    if (_this.selectedAgent.getValue() && _this.selectedAgent.getValue().email == data.email) {
                        var agent = _this.selectedAgent.getValue();
                        if (!agent.liveSession) {
                            var obj = {
                                liveSession: {
                                    createdDate: new Date().toISOString(),
                                    state: 'ACTIVE',
                                    acceptingChats: true
                                }
                            };
                            Object.assign(agent, obj);
                            // console.log(agent);
                        }
                        else {
                            agent.liveSession.state = 'ACTIVE';
                            var idlePeriod = agent.liveSession.idlePeriod.pop();
                            idlePeriod.endTime = data.endTime;
                            agent.liveSession.idlePeriod.push(idlePeriod);
                            agent.liveSession.acceptingChats = true;
                        }
                        _this.selectedAgent.next(agent);
                    }
                    if (_this.agentCounts.getValue()) {
                        _this.agentCounts.getValue().agents.map(function (a, index) {
                            if (a.email == data.email) {
                                a.state = 'active';
                                return;
                            }
                        });
                        _this.agentCounts.next(_this.agentCounts.getValue());
                    }
                    // this.getAgentCounts();
                });
                _this.socket.on('contactConversationSeen', function (response) {
                    // console.log('Conversation Seen!');
                    if (_this.selectedAgentConversation.getValue()) {
                        var thread = _this.selectedAgentConversation.getValue();
                        thread.LastSeen = response.LastSeen;
                        _this.selectedAgentConversation.next(thread);
                    }
                    // this.getAllAgentConversations();
                });
                _this.socket.on('permissionsChanged', function (response) {
                    // console.log('Agent Permissions Changed!');
                    // console.log(response);
                    _this._authService.UpdateAgentPermissions(response.permissions);
                });
                _this.socket.on('authPermissionsChanged', function (response) {
                    // console.log('Agent Permissions Changed!');
                    // console.log(response);
                    _this._authService.UpdateAuthPermissions(response.permission);
                });
                _this.socket.on('notifPermissionsChanged', function (response) {
                    // console.log('Notif Permissions Changed!');
                    // console.log(response);
                    _this._authService.UpdateNotifPermissions(response.settings);
                });
            }
        }));
    }
    AgentService.prototype.getAgents = function (filters, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (!this.Initialized.getValue() || force) {
            this.http.post(this.agentServiceURL + '/agentsListFiltered', { nsp: this.agent.getValue().nsp, filters: (filters.filter && Object.keys(filters.filter).length) ? filters.filter : undefined }).subscribe(function (response) {
                console.log(response.json());
                var data = response.json();
                // if(!this.Initialized.getValue())
                _this.AvailableAgents.next(data.agents);
                _this.Initialized.next(true);
                // if (!this.initialized) this.initialized = !this.initialized;
                // if (response.json()) {
                //     let data = response.json();
                //     if (data.status == 'ok') {
                //         this.AvailableAgents.next(data.agents);
                //         this.agentsChunk = (data.ended) ? -1 : this.agentsChunk + 1;
                //     }
                //     this.setLaodingVariable(false);
                // }
            }, function (err) {
                // this.setLaodingVariable(false);
            });
        }
    };
    AgentService.prototype.SetWindowNotificationSettings = function (settings) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.agentServiceURL + '/setWindowNotificationSettings', { nsp: _this.agent.getValue().nsp, email: _this.agent.getValue().email, settings: settings }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.selectedAgent.getValue().windowNotifications = settings;
                        _this.selectedAgent.next(_this.selectedAgent.getValue());
                        _this.windowNotificationSettings.next(settings);
                        observer.next(data);
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
    AgentService.prototype.GetWindowNotificationSettings = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.agentServiceURL + '/getWindowNotificationSettings', { nsp: _this.agent.getValue().nsp, email: _this.agent.getValue().email }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        if (data.windowNotifications) {
                            _this.windowNotificationSettings.next(data.windowNotifications);
                            observer.next(data);
                            observer.complete();
                        }
                        else {
                            _this.windowNotificationSettings.next(undefined);
                            observer.next(undefined);
                            observer.complete();
                        }
                    }
                    else {
                        _this.windowNotificationSettings.next(undefined);
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
        });
    };
    AgentService.prototype.GetEmailNotificationSettings = function () {
        var _this = this;
        this.http.post(this.agentServiceURL + '/getEmailNotificationSettings', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    if (data.emailNotifications)
                        _this.emailNotificationSettings.next(data.emailNotifications);
                    else
                        _this.emailNotificationSettings.next(undefined);
                }
                else {
                    _this.emailNotificationSettings.next(undefined);
                }
            }
        });
    };
    AgentService.prototype.SetEmailNotificationSettings = function (settings) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.agentServiceURL + '/setEmailNotificationSettings', { nsp: _this.agent.getValue().nsp, email: _this.agent.getValue().email, settings: settings }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.selectedAgent.getValue().settings.emailNotifications = settings;
                        _this.selectedAgent.next(_this.selectedAgent.getValue());
                        _this.emailNotificationSettings.next(settings);
                        observer.next(data);
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
    AgentService.prototype.getLoadingVariable = function () {
        return this.loadingAgents.asObservable();
    };
    AgentService.prototype.setLaodingVariable = function (value) {
        this.loadingAgents.next(value);
    };
    AgentService.prototype.setViewingChat = function (value) {
        this.isSelfViewingChat.next(value);
    };
    AgentService.prototype.editAgent = function (properties) {
        var _this = this;
        this.socket.emit('editAgentProperties', { properties: properties, email: this.selectedAgent.getValue().email }, function (response) {
            //console.log("About to edit agent");
            if (response.status == 'ok') {
                // if(properties.first_name!=this.selectedAgent.value.first_name || properties.last_name!=this.selectedAgent.value.last_name || properties.nickname!=this.selectedAgent.value.nickname || properties.phone_no!=this.selectedAgent.value.phone_no){
                // console.log(properties);
                // console.log(this.selectedAgent.value);
                _this.AvailableAgents.next(_this.AvailableAgents.getValue().map(function (agent) {
                    if (agent.email == _this.selectedAgent.getValue().email) {
                        agent.first_name = properties.first_name;
                        agent.last_name = properties.last_name;
                        agent.nickname = properties.nickname;
                        agent.phone_no = properties.phone_no;
                        agent.username = properties.username;
                        agent.gender = properties.gender;
                        if (!agent.settings) {
                            agent.settings = {
                                simchats: 0
                            };
                        }
                        agent.settings.simchats = properties.simchats;
                        agent.role = properties.role;
                    }
                    return agent;
                }));
                if (_this.selectedAgent.getValue().email == _this.agent.getValue().email) {
                    _this._authService.UpdateSelectedAgent(properties);
                    _this.setSelectedAgent(_this.selectedAgent.getValue()._id);
                }
                _this.setNotification('Agent Edited Successfully', 'success', 'ok');
                // }
            }
            else {
                _this.setNotification('Can\'t Edit Agent', 'error', 'warning');
            }
        });
    };
    AgentService.prototype.addAgentSuccess = function (agent) {
        this.AvailableAgents.getValue().push(agent);
        this.AvailableAgents.next(this.AvailableAgents.getValue());
    };
    AgentService.prototype.getAllAgentsList = function () {
        return this.AvailableAgents.asObservable();
    };
    AgentService.prototype.setSearchValue = function (value) {
        this.searchValue.next(value);
    };
    AgentService.prototype.getAllAgentsAsync = function (type) {
        var _this = this;
        if (type === void 0) { type = 'all'; }
        this.http.post(this.agentServiceURL + '/agentsList', { nsp: this.agent.getValue().nsp, type: type }).subscribe(function (response) {
            if (!_this.initialized)
                _this.initialized = !_this.initialized;
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.AvailableAgents.next(data.agents);
                    _this.agentsChunk = (data.ended) ? -1 : _this.agentsChunk + 1;
                }
                _this.setLaodingVariable(false);
            }
        }, function (err) {
            _this.setLaodingVariable(false);
        });
    };
    AgentService.prototype.getMoreAgents = function () {
        var _this = this;
        if (this.agentsChunk != -1 && !this.loadingMoreAgents.getValue()) {
            this.loadingMoreAgents.next(true);
            this.http.post(this.agentServiceURL + '/getMoreAgents', { nsp: this.agent.getValue().nsp, chunk: this.AvailableAgents.getValue()[this.AvailableAgents.getValue().length - 1].first_name }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.AvailableAgents.next(_this.AvailableAgents.getValue().concat(data.agents));
                        _this.agentsChunk = (data.ended) ? -1 : _this.agentsChunk += 1;
                        _this.loadingMoreAgents.next(false);
                    }
                }
            }, function (err) {
                _this.loadingMoreAgents.next(false);
            });
        }
    };
    AgentService.prototype.getMoreAgentsObs = function (chunk) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.agentServiceURL + '/getAllAgentsAsync', { nsp: _this.agent.getValue().nsp, email: _this.agent.getValue().email, chunk: chunk }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        observer.next({ agents: data.agents, ended: data.ended });
                        observer.complete();
                    }
                    else {
                        observer.next({ agents: [], ended: true });
                        observer.complete();
                    }
                }
            });
        });
    };
    AgentService.prototype.getAllAgentConversations = function () {
        var _this = this;
        this.http.post(this.agentServiceURL + '/agentConversationsList', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok' && data.conversations.length) {
                    _this.agentConversationList.next(_this.sortBy('LastUpdated', data.conversations));
                    // console.log(this.agentConversationList.getValue());
                }
                else {
                    _this.agentConversationList.next([]);
                }
            }
        });
    };
    AgentService.prototype.sortBy = function (value, array) {
        array.sort(function (a, b) {
            var aDate = a[value];
            var bDate = b[value];
            return (Date.parse(aDate) - Date.parse(bDate) > 0) ? -1 : 1;
        });
        return array;
    };
    AgentService.prototype.getAllAgentsForRole = function (role) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.agentServiceURL + '/getAllAgentsForRole', { nsp: _this.agent.getValue().nsp, role: role }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.agents);
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
    AgentService.prototype.saveRoleForUsers = function (userList, selectedRole, roleToUpdate) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.agentServiceURL + '/saveRoleForAgents', { nsp: _this.agent.getValue().nsp, selectedRole: selectedRole, role: roleToUpdate, users: userList }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.getAllAgentsAsync();
                        observer.next(data.agents);
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
    AgentService.prototype.AssignNewRolesToUsers = function (userList) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.agentServiceURL + '/assignNewRolesForAgents', { nsp: _this.agent.getValue().nsp, users: userList }).subscribe(function (response) {
                if (response.json()) {
                    _this.getAllAgentsAsync();
                    observer.next(response.json().status);
                    observer.complete();
                }
            });
        });
    };
    AgentService.prototype.getAgentCounts = function () {
        var _this = this;
        this.http.post(this.agentServiceURL + '/getAgentCounts', { nsp: this.agent.getValue().nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok')
                    _this.agentCounts.next(data.agentCounts);
            }
        });
    };
    AgentService.prototype.getSelectedAgent = function () {
        return this.selectedAgent.asObservable();
    };
    AgentService.prototype.setSelectedAgent = function (id, cid) {
        var _this = this;
        if (id) {
            if (!this.searchValue.getValue()) {
                this.AvailableAgents.getValue().map(function (agent) {
                    if (agent._id == id) {
                        if (agent.details) {
                            _this.selectedAgent.next(agent);
                            if (cid) {
                                // console.log('CID: ' + cid);
                                _this.isSelfViewingChat.next({
                                    chatId: cid,
                                    value: false
                                });
                            }
                        }
                        else {
                            console.log('Getting Agent...');
                            _this.getAgentByEmail(agent.email).subscribe(function (agent) {
                                _this.selectedAgent.next(agent);
                                if (cid) {
                                    // console.log('CID: ' + cid);
                                    _this.isSelfViewingChat.next({
                                        chatId: cid,
                                        value: false
                                    });
                                }
                            });
                        }
                    }
                });
            }
            else {
                this.FilteredAgents.getValue().map(function (agent) {
                    if (agent._id == id) {
                        // if (agent.details) {
                        //     this.selectedAgent.next(agent);
                        //     if (cid) {
                        //         // console.log('CID: ' + cid);
                        //         this.isSelfViewingChat.next({
                        //             chatId: cid,
                        //             value: false
                        //         });
                        //     }
                        // }
                        // else {
                        //     console.log('Getting Agent...');
                        //     this.getAgentByEmail(agent.email).subscribe(agent => {
                        //         this.selectedAgent.next(agent);
                        //         if (cid) {
                        //             // console.log('CID: ' + cid);
                        //             this.isSelfViewingChat.next({
                        //                 chatId: cid,
                        //                 value: false
                        //             });
                        //         }
                        //     });
                        // }
                        _this.selectedAgent.next(agent);
                        if (cid) {
                            // console.log('CID: ' + cid);
                            _this.isSelfViewingChat.next({
                                chatId: cid,
                                value: false
                            });
                        }
                    }
                });
            }
        }
        else {
            this.selectedAgent.next({});
            this.selectedAgentConversation.next({});
            this.isSelfViewingChat.next({
                chatId: '',
                value: false
            });
        }
    };
    AgentService.prototype.getAgentByEmail = function (email) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.agentServiceURL + '/getAgentByEmail', { email: email }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.agent);
                        observer.complete();
                    }
                    else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
        });
    };
    AgentService.prototype.UpdateAgentGroup = function (agentEmail, groupName, add) {
        if (add === void 0) { add = true; }
        this.AvailableAgents.getValue().map(function (agent) {
            if (agent.email == agentEmail && add) {
                agent.group.push(groupName);
            }
            else if (agent.email == agentEmail && !add) {
                agent.group = agent.group.filter(function (room) {
                    return room != groupName;
                });
            }
            return agent;
        });
        this.AvailableAgents.next(this.AvailableAgents.getValue());
    };
    AgentService.prototype.setNotification = function (notification, type, icon) {
        var item = {
            msg: notification,
            type: type,
            img: icon
        };
        this.notification.next(item);
    };
    AgentService.prototype.getNotification = function () {
        return this.notification.asObservable();
    };
    AgentService.prototype.setDraft = function (cid, draft, arrToDialog) {
        this.agentConversationList.getValue().map(function (conv) {
            if (conv._id == cid) {
                conv.draft = draft;
                conv.arrToDialog = arrToDialog;
                return conv;
            }
        });
        this.agentConversationList.next(this.agentConversationList.getValue());
    };
    AgentService.prototype.Destroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AgentService.prototype.updateAgentProfileImage = function (email, url) {
        this.AvailableAgents.next(this.AvailableAgents.getValue().map(function (agent) {
            if (agent.email == email) {
                agent.image = url;
            }
            return agent;
        }));
    };
    AgentService.prototype.getOrcreateConversation = function (data) {
        var _this = this;
        this.loadingConversation.next(true);
        this.http.post(this.agentServiceURL + '/createAgentConversation', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email, conversation: data }).subscribe(function (response) {
            if (response.json()) {
                console.log(response.json());
                var data_1 = response.json();
                if (!_this.agentConversationList.getValue().filter(function (a) { return a._id == data_1.conversation._id; }).length) {
                    _this.agentConversationList.getValue().push(data_1.conversation);
                    _this.agentConversationList.next(_this.agentConversationList.getValue());
                }
                _this.selectedAgentConversation.next(data_1.conversation);
                _this.isSelfViewingChat.next({
                    chatId: data_1.conversation._id,
                    value: true
                });
                _this.loadingConversation.next(false);
                _this.listToView.getValue()['conversations'] = true;
                _this.listToView.getValue()['agents'] = false;
            }
        });
    };
    AgentService.prototype.getConversationByID = function (cid) {
        var _this = this;
        this.socket.emit('getAgentConversation', { cid: cid }, function (response) {
            // console.log(response);
            if (response.status == 'ok') {
                _this.ShowAttachmentAreaDnd.next(false);
                var conv = _this.agentConversationList.getValue().filter(function (conv) { return conv._id == cid; });
                if (conv && conv.length && conv[0].draft) {
                    response.conversation.draft = conv[0].draft;
                }
                _this.selectedAgentConversation.next(response.conversation);
                _this.isSelfViewingChat.next({
                    chatId: response.conversation._id,
                    value: true
                });
                _this.conversationSeen(response.conversation._id, response.conversation.members.map(function (a) { return a.email; }));
            }
            _this.loadingConversation.next(false);
        });
    };
    AgentService.prototype.SendMessageToAgent = function (message) {
        var _this = this;
        this.socket.emit('insertAgentMessage', { message: message }, function (response) {
            if (response.status == 'ok') {
                _this.selectedAgentConversation.getValue().messages.push(response.message);
                // console.log(this.selectedAgentConversation);
                _this.selectedAgentConversation.getValue().LastSeen = response.currentConversation.LastSeen;
                _this.selectedAgentConversation.next(_this.selectedAgentConversation.getValue());
                var index = _this.agentConversationList.getValue().findIndex(function (obj) { return obj._id == response.currentConversation._id; });
                _this.agentConversationList.getValue()[index] = response.currentConversation;
                _this.agentConversationList.next(_this.sortBy('LastUpdated', _this.agentConversationList.getValue()));
            }
        });
        // this.agentConversationList.getValue().map(conv => {
        //     if (conv._id == message.cid) {
        //         conv.draft = [];
        //         conv.arrToDialog = [];
        //         return conv;
        //     }
        // });
        // this.agentConversationList.next(this.sortBy('LastUpdated', this.agentConversationList.getValue()));
    };
    AgentService.prototype.conversationSeen = function (cid, to) {
        var _this = this;
        this.socket.emit('seenAgentConversation', { cid: cid, userId: this.agent.getValue().email, to: to }, function (response) {
            if (response.status == 'ok') {
                var index = _this.agentConversationList.getValue().findIndex(function (obj) { return obj._id == response.currentConversation._id; });
                _this.agentConversationList.getValue()[index] = response.currentConversation;
                _this.agentConversationList.next(_this.agentConversationList.getValue());
            }
        });
    };
    AgentService.prototype.toggleAgentAccessInformation = function () {
        this.showAgentAccessInfo.next(!this.showAgentAccessInfo.getValue());
    };
    AgentService.prototype.GetMoreMessages = function (cid, lastMessageId, visibleTo) {
        var _this = this;
        if (lastMessageId === void 0) { lastMessageId = '0'; }
        if (visibleTo === void 0) { visibleTo = ''; }
        // console.log(visibleTo);
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getMoreAgentMessages', { cid: cid, chunk: lastMessageId, visibleTo: visibleTo }, function (response) {
                if (response.status == 'ok' && response.messages.length) {
                    if (!_this.selectedAgentConversation.getValue().ended) {
                        response.messages.forEach(function (msg) {
                            _this.selectedAgentConversation.getValue().messages.splice(0, 0, msg);
                            _this.selectedAgentConversation.getValue().ended = response.ended;
                        });
                        _this.selectedAgentConversation.next(_this.selectedAgentConversation.getValue());
                    }
                }
                observer.next({ status: 'ok' });
                observer.complete();
            });
        });
    };
    AgentService.prototype.ValidatePassword = function (email, password) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('validatePassword', { email: email, password: password }, function (response) {
                observer.next(response.status);
                observer.complete();
            });
        })
            .map(function (response) { return response; })
            .catch(function (err) { return Observable_1.Observable.throw(err.json()); })
            .debounceTime(3000);
    };
    AgentService.prototype.changePassword = function (email, password) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('changePassword', { email: email, password: password }, function (response) {
                observer.next(response.status);
                observer.complete();
            });
        });
    };
    //Message Drafts
    AgentService.prototype.AddDraft = function (draft) {
        if (this.selectedAgentConversation.getValue()) {
            var conversation = this.selectedAgentConversation.getValue();
            conversation.draft = draft;
            this.selectedAgentConversation.next(conversation);
        }
    };
    AgentService.prototype.RemoveDraft = function () {
        if (this.selectedAgentConversation.getValue()) {
            var conversation = this.selectedAgentConversation.getValue();
            delete conversation.draft;
            this.selectedAgentConversation.next(conversation);
        }
    };
    //Typing State Events
    AgentService.prototype.StartedTyping = function (cid, to, from) {
        this.socket.emit('typingStarted', { cid: cid, to: to, from: from }, function (response) {
        });
    };
    AgentService.prototype.PausedTyping = function (cid, to, from) {
        // console.log('Emitting typing paused!');
        this.socket.emit('typingPaused', { cid: cid, to: to, from: from }, function (response) {
        });
    };
    AgentService.prototype.SelectAgent = function (value) {
        var _this = this;
        var hash = 0;
        if (this.selectedAgent) {
            this.AvailableAgents.getValue().map(function (agent, index) {
                if (agent._id == _this.selectedAgent.getValue()._id) {
                    hash = (value == 'next') ? (index + 1) : (index - 1);
                }
            });
        }
        if (hash >= 0) {
            if (this.AvailableAgents.getValue()[hash]) {
                this.setSelectedAgent(this.AvailableAgents.getValue()[hash]._id);
            }
        }
    };
    //Validate Sheet
    AgentService.prototype.ValidateSheet = function (fileElement) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var localFileReader = new FileReader();
            localFileReader.readAsArrayBuffer(fileElement);
            var validation = {
                status: 'ok',
                msgs: []
            };
            localFileReader.onload = function (event) {
                // console.log('LocalFileReader On LOAD');
                var workbook = xlsx.read(new Uint8Array(event.target.result), { type: "array" });
                var Sheets = workbook.Sheets;
                var sheetNames = Object.keys(Sheets);
                var ISODate = (new Date()).toISOString();
                sheetNames.forEach(function (sheetName) {
                    var sheet = Sheets[sheetName];
                    // parse each sheet and add to db
                    // return if sheet is empty
                    if (!sheet['!ref']) {
                        validation.status = 'error';
                        validation.msgs = ['Sheet is empty!'];
                        observer.next(validation);
                        observer.complete();
                    }
                    var sheetObj = xlsx.utils.sheet_to_json(sheet, { raw: false });
                    var required_keys = [
                        'first name',
                        'last name',
                        'nick',
                        'pass',
                        'email',
                        'role'
                    ];
                    var rowClean = _this.lowercaseObjKeys(sheetObj[0]);
                    required_keys.forEach(function (key) {
                        if (!Object.keys(rowClean).includes(key)) {
                            validation.status = 'error';
                            validation.msgs.push("Column '" + key + "' not found!");
                        }
                        // Object.keys(rowClean).map(key => {
                        //     if(!required_keys.includes(key)){
                        //     }
                        // })
                    });
                    observer.next(validation);
                    observer.complete();
                });
            };
        });
    };
    //Import Agents
    AgentService.prototype.UploadAgents = function (fileElement) {
        var _this = this;
        try {
            var localFileReader = new FileReader();
            var data_2 = [];
            // Local manipulations to uploaded files
            localFileReader.onload = function (event) {
                // console.log('LocalFileReader On LOAD');
                var workbook = xlsx.read(new Uint8Array(event.target.result), { type: "array" });
                var Sheets = workbook.Sheets;
                var sheetNames = Object.keys(Sheets);
                var ISODate = (new Date()).toISOString();
                sheetNames.forEach(function (sheetName) {
                    var sheet = Sheets[sheetName];
                    // parse each sheet and add to db
                    // return if sheet is empty
                    if (!sheet['!ref'])
                        return;
                    var sheetObj = xlsx.utils.sheet_to_json(sheet, { raw: false });
                    sheetObj.forEach(function (row) {
                        var rowClean = _this.lowercaseObjKeys(row);
                        // console.log(rowClean);
                        var agent = {
                            first_name: rowClean['first name'],
                            last_name: rowClean['last name'],
                            phone_no: (rowClean['phone_no'] ? rowClean['phone_no'] : ''),
                            nickname: rowClean['nick'],
                            username: rowClean['nick'],
                            password: (rowClean['password'] || rowClean['pass']),
                            email: _this.testRegExp(_this.emailPattern, rowClean['email']),
                            gender: (rowClean['gender'] ? rowClean['gender'] : 'male'),
                            nsp: _this.agent.getValue().nsp,
                            created_date: new Date().toISOString(),
                            created_by: 'self',
                            group: ['DF'],
                            location: 'PK',
                            editsettings: {
                                "editprofilepic": true,
                                "editname": true,
                                "editnickname": true,
                                "editpassword": true
                            },
                            communicationAccess: {
                                "chat": true,
                                "voicecall": false,
                                "videocall": false
                            },
                            settings: {
                                "simchats": 20
                            },
                            automatedMessages: [],
                            role: (rowClean['role'] ? rowClean['role'].toLowerCase() : 'agent'),
                        };
                        var groups = (rowClean['group'] ? rowClean['group'].split(',') : []);
                        var index = data_2.findIndex(function (d) { return d.agent.email == agent.email; });
                        if (index != -1) {
                            // console.log(data[index].agent.email);
                            data_2[index].groups = data_2[index].groups.concat(groups);
                        }
                        else {
                            data_2.push({ agent: agent, groups: groups });
                        }
                    });
                });
            };
            localFileReader.onloadend = function (event) {
                // console.log('on load Ended!');
                // console.log(contacts);
                // console.log(data);
                _this.InitiateImport(data_2).subscribe(function (response) {
                    if (response.duplicates) {
                        _this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                            panelClass: ['confirmation-dialog'],
                            data: { headermsg: 'Duplicate contacts found! Do you want to update them?' }
                        }).afterClosed().subscribe(function (data) {
                            if (data == 'ok') {
                                _this.ImportAgentsWithUpdate(data);
                            }
                            else {
                                _this.ImportNewAgents(data);
                            }
                        });
                    }
                    else {
                        _this.ImportNewAgents(data_2);
                    }
                });
            };
            localFileReader.readAsArrayBuffer(fileElement);
        }
        catch (err) {
            console.log("Error encountered in importing agents");
            console.log(err);
        }
    };
    AgentService.prototype.InitiateImport = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('initiateImport', { agents: data }, function (response) {
                observer.next(response);
                observer.complete();
            });
        });
    };
    AgentService.prototype.ImportNewAgents = function (data) {
        // console.log('Ready to Emit');
        // console.log(data);
        this.socket.emit('importNewAgents', { agents: data }, function (response) {
            // console.log(response);
            if (response.status == 'ok') {
                // this.contactsList.next(response.contactList);
                // this.GetContactsCountWithStatus();
            }
            else {
                // this.contactsList.next([]);
            }
        });
    };
    AgentService.prototype.ImportAgentsWithUpdate = function (data) {
        this.socket.emit('importAgentsWithUpdate', { agents: data }, function (response) {
            if (response.status == 'ok') {
                // this.contactsList.next(response.contactList);
                // this.GetContactsCountWithStatus();
            }
        });
    };
    AgentService.prototype.lowercaseObjKeys = function (obj) {
        var keys = Object.keys(obj);
        keys.forEach(function (key) {
            var keyClean = key.toLowerCase().trim();
            // do nothing if the clean key is the same as the original key
            if (keyClean === key)
                return;
            obj[keyClean] = obj[key];
            delete obj[key];
            // console.log("key: " + key);
            // console.log("keyClean: " + keyClean);
        });
        return obj;
    };
    AgentService.prototype.testRegExp = function (regexPattern, tested) {
        if (regexPattern.test(tested)) {
            return tested;
        }
        else {
            return '';
        }
    };
    //Group Chats Events
    AgentService.prototype.removeMember = function (email, cid) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('removeMemberFromConversation', { cid: cid, email: email }, function (response) {
                if (response.status == 'ok') {
                    // console.log('Removed', response);
                    _this.selectedAgentConversation.getValue().messages.push(response.message);
                    // console.log(this.selectedAgentConversation);
                    _this.selectedAgentConversation.getValue().LastSeen = _this.selectedAgentConversation.getValue().LastSeen.filter(function (l) { return l.email != response.removedAgent; });
                    _this.selectedAgentConversation.getValue().members = _this.selectedAgentConversation.getValue().members.filter(function (l) { return l.email != response.removedAgent; });
                    _this.selectedAgentConversation.next(_this.selectedAgentConversation.getValue());
                    // console.log(this.selectedAgentConversation.getValue());
                    var index = _this.agentConversationList.getValue().findIndex(function (obj) { return obj._id == _this.selectedAgentConversation.getValue()._id; });
                    _this.agentConversationList.getValue()[index] = _this.selectedAgentConversation.getValue();
                    _this.agentConversationList.next(_this.agentConversationList.getValue());
                    // response.currentConversation.members.forEach((member,index) => {
                    //     if(member.email == response.removedAgent){
                    //         response.currentConversation.members.splice(index,1);
                    //     }
                    // });
                    observer.next(_this.selectedAgentConversation.getValue());
                    observer.complete();
                }
                else {
                    observer.next(undefined);
                    observer.complete();
                }
            });
        });
    };
    AgentService.prototype.addMember = function (emails, cid) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addMemberToConversation', { cid: cid, emails: emails }, function (response) {
                if (response.status == 'ok') {
                    // console.log('Added', response);
                    _this.selectedAgentConversation.getValue().messages.push(response.message);
                    // console.log(this.selectedAgentConversation);
                    _this.selectedAgentConversation.getValue().LastSeen = response.currentConversation.LastSeen;
                    _this.selectedAgentConversation.getValue().members = response.currentConversation.members;
                    _this.selectedAgentConversation.next(_this.selectedAgentConversation.getValue());
                    var index = _this.agentConversationList.getValue().findIndex(function (obj) { return obj._id == response.currentConversation._id; });
                    _this.agentConversationList.getValue()[index] = response.currentConversation;
                    _this.agentConversationList.next(_this.agentConversationList.getValue());
                    observer.next(response.currentConversation);
                    observer.complete();
                }
                else {
                    observer.next(undefined);
                    observer.complete();
                }
            });
        });
    };
    AgentService.prototype.toggleAdmin = function (email, cid, value) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('toggleAdminInGroup', { cid: cid, email: email, value: value }, function (response) {
                if (response.status == 'ok') {
                    _this.selectedAgentConversation.getValue().messages.push(response.message);
                    // console.log(this.selectedAgentConversation);
                    _this.selectedAgentConversation.getValue().LastSeen = response.currentConversation.LastSeen;
                    _this.selectedAgentConversation.next(_this.selectedAgentConversation.getValue());
                    var index = _this.agentConversationList.getValue().findIndex(function (obj) { return obj._id == response.currentConversation._id; });
                    _this.agentConversationList.getValue()[index] = response.currentConversation;
                    _this.agentConversationList.next(_this.agentConversationList.getValue());
                    observer.next(response.currentConversation);
                    observer.complete();
                }
                else {
                    observer.next(undefined);
                    observer.complete();
                }
            });
        });
    };
    AgentService = __decorate([
        core_1.Injectable()
    ], AgentService);
    return AgentService;
}());
exports.AgentService = AgentService;
//# sourceMappingURL=AgentService.js.map