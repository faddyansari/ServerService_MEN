import { Injectable, ɵConsole } from "@angular/core";

//RxJS Imports
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/interval';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
//End RxJs Imports

import * as io from 'socket.io-client';

//Services Imports
import { SocketService } from "./SocketService";
import { AuthService } from "./AuthenticationService";
import { PushNotificationsService } from "./NotificationService";
import { AnalyticsService } from "./AnalyticsService";
import { Http } from "@angular/http";
import { ConfirmationDialogComponent } from "../app/dialogs/confirmation-dialog/confirmation-dialog.component";
import { utils, readFile, WorkBook, read } from 'xlsx';
import { MatDialog } from "@angular/material/dialog";

let xlsx = { utils: utils, readFile: readFile, read: read };


@Injectable()
export class AgentService {

    public AvailableAgents: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public FilteredAgents: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public Filters: BehaviorSubject<any> = new BehaviorSubject({});
    public filterDrawer : BehaviorSubject<boolean> = new BehaviorSubject(false);
    public Initialized: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private lastResponse: any;
    agentServiceURL = '';
    agent: BehaviorSubject<any> = new BehaviorSubject({});
    subscriptions: Subscription[] = [];
    socket: SocketIOClient.Socket;
    selectedAgent: BehaviorSubject<any> = new BehaviorSubject({});
    selectedAgentConversation: BehaviorSubject<any> = new BehaviorSubject({});
    agentConversationList: BehaviorSubject<any> = new BehaviorSubject([]);
    notification: BehaviorSubject<any> = new BehaviorSubject('');
    selectedFilter: BehaviorSubject<any> = new BehaviorSubject('all');
    public currentConvId: BehaviorSubject<any> = new BehaviorSubject('');
    public timer = Observable.interval(1000 * 60);
    showAgentAccessInfo: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public ShowAttachmentAreaDnd: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public windowNotificationSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public emailNotificationSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);

    public initialized = false;

    //Loading Variable
    private loadingAgents: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public isSelfViewingChat: BehaviorSubject<any> = new BehaviorSubject({ chatId: '', value: false });

    public loadingConversation: BehaviorSubject<any> = new BehaviorSubject(false);
    public listToView: BehaviorSubject<any> = new BehaviorSubject({
        'agents': true,
        'conversations': false
    });
    private agentsChunk: number = 0;
    public loadingMoreAgents: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public searchValue: BehaviorSubject<any> = new BehaviorSubject('');
    private url: any;
    agentCounts: BehaviorSubject<any> = new BehaviorSubject(undefined);
    private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    closeDetail: BehaviorSubject<boolean> = new BehaviorSubject(true);

    constructor(private _socket: SocketService, private http: Http, private dialog: MatDialog, private _authService: AuthService, private _notificationService: PushNotificationsService, public _analyticsService: AnalyticsService) {
        //console.log(this.AvailableAgents);
        // console.log('Agents Service Initialized');
        //console.log()
        this._authService.RestServiceURL.subscribe(url => {
            this.agentServiceURL = url + '/agent';
        });
        this.AvailableAgents = new BehaviorSubject([]);

        //Subscribing Agent Object
        this.subscriptions.push(_authService.getAgent().subscribe(data => {
            this.agent.next(data);
            // if(data && this.socket){
            //     if(data.role == 'admin') {
            //         this.getAllAgentsAsync();
            //     }else{
            //         this.getAgentsWRTGroup(data.groups)
            //     }
            // }
        }));
        //Getting URL
        this.subscriptions.push(this._authService.getServer().subscribe(url => {
            this.url = url;
        }));
        //Subscribing Connected Socket
        this.subscriptions.push(_socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                if (!this.initialized) {
                    this.getAgentCounts();
                    this.getAllAgentsAsync();
                    this.getAllAgentConversations();
                    this.GetEmailNotificationSettings();
                    this.GetWindowNotificationSettings();

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

                this.socket.on('agentAvailable', (data) => {
                    // console.log('agentAvailable', data);
                    if (data) {
                        // console.log(data);
                        // console.log(this.agent.getValue());
                        if (this.agent.getValue().email == data.email) this._authService.setAcceptingChatMode(data.session.acceptingChats);
                    }
                    if (!this.searchValue.getValue()) {
                        if (this.selectedFilter.getValue() == 'online' || this.selectedFilter.getValue() == 'all') {
                            // console.log(this.selectedFilter.getValue());
                            if (this.AvailableAgents.getValue().filter(a => a.email == data.email).length) {
                                this.AvailableAgents.getValue().map(agent => {
                                    if (agent.email == data.email) {
                                        agent.liveSession = data.session;
                                    }
                                    // else{

                                    // }
                                    return;
                                });
                                this.AvailableAgents.next(this.AvailableAgents.getValue());
                            } else {
                                this.AvailableAgents.getValue().push({
                                    _id: data.session.agent_id,
                                    email: data.session.email,
                                    nickname: data.session.nickname,
                                    image: data.session.image,
                                    liveSession: data.session,
                                    details: false
                                });
                                this.AvailableAgents.next(this.AvailableAgents.getValue());
                            }

                        } else {
                            let index = this.AvailableAgents.getValue().findIndex(a => a.email == data.email);
                            if (index != -1) {
                                this.AvailableAgents.getValue().splice(index, 1);
                            }
                        }
                    }
                    if (this.agentCounts.getValue()) {
                        if (!this.agentCounts.getValue().agents.filter(a => a.email == data.email).length) {
                            this.agentCounts.getValue().agents.push({
                                email: data.email,
                                state: (data.session && data.session.acceptingChats) ? 'active' : 'idle'
                            });
                        }
                        this.agentCounts.next(this.agentCounts.getValue());
                    }
                });
                this.socket.on('agentUnavailable', (data) => {
                    // console.log('agentUnavailable');
                    if (!this.searchValue.getValue()) {

                        if (this.selectedFilter.getValue() == 'offline' || this.selectedFilter.getValue() == 'all') {
                            // console.log(this.selectedFilter.getValue());
                            if (this.AvailableAgents.getValue().filter(a => a.email == data.email).length) {
                                this.AvailableAgents.getValue().map(agent => {
                                    if (agent.email == data.email) {
                                        delete agent.liveSession;
                                    }
                                    return;
                                });
                                this.AvailableAgents.next(this.AvailableAgents.getValue());
                            } else {
                                this.AvailableAgents.getValue().push({
                                    _id: data.session.agent_id,
                                    email: data.session.email,
                                    nickname: data.session.nickname,
                                    image: data.session.image,
                                    details: false
                                });
                                this.AvailableAgents.next(this.AvailableAgents.getValue());
                            }
                        } else {
                            let index = this.AvailableAgents.getValue().findIndex(a => a.email == data.email);
                            if (index != -1) {
                                this.AvailableAgents.getValue().splice(index, 1);
                            }
                        }
                    }
                    if (this.agentCounts.getValue()) {
                        this.agentCounts.getValue().agents.map((a, index) => {
                            if (a.email == data.email) {
                                this.agentCounts.getValue().agents.splice(index, 1);
                            }
                        });
                        this.agentCounts.next(this.agentCounts.getValue())
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
                this.socket.on('updateCallingState', (data) => {
                    if (data) {
                        let agent = this.agent.getValue();
                        agent.callingState.state = data.state;
                        this.agent.next(agent);
                    }
                });
                this.socket.on('gotNewAgentConversation', (data) => {
                    // console.log(data.conversation);
                    this.agentConversationList.getValue().push(data.conversation);
                    this.agentConversationList.next(this.agentConversationList.getValue());
                });
                this.socket.on('gotNewAgentMessage', (response) => {

                    if (this.isSelfViewingChat.getValue().chatId != response.currentConversation._id || (this.isSelfViewingChat.getValue().chatId == response.currentConversation._id && !this.isSelfViewingChat.getValue().value)) {
                        if (response.currentConversation.LastSeen.filter(data => data.email == this.agent.getValue().email)[0].messageReadCount <= 1) {
                            let notif_data: Array<any> = [];
                            notif_data.push({
                                'title': response.message.from + ' says:',
                                'alertContent': response.message.body,
                                'icon': "../assets/img/favicon.ico",
                                'url': "/agents"
                            });
                            this._notificationService.generateNotification(notif_data);
                        }
                    }
                    let index = this.agentConversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                    this.agentConversationList.getValue()[index] = response.currentConversation;
                    this.agentConversationList.next(this.sortBy('LastUpdated', this.agentConversationList.getValue()));
                    if (this.selectedAgentConversation.getValue() && this.isSelfViewingChat.getValue().chatId == response.currentConversation._id) {
                        this.selectedAgentConversation.getValue().messages.push(response.message)
                        this.selectedAgentConversation.next(this.selectedAgentConversation.getValue());
                        this.conversationSeen(response.currentConversation._id, response.currentConversation.members.map(a => a.email));
                    }
                });
                this.socket.on('gotNewAgentEventMessage', (response) => {
                    let index = this.agentConversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                    if (index != -1) {
                        if (response.removedAgent) {
                            this.agentConversationList.getValue()[index].members = this.agentConversationList.getValue()[index].members.filter(m => m.email != response.removedAgent);
                            this.agentConversationList.getValue()[index].LastSeen = this.agentConversationList.getValue()[index].LastSeen.filter(m => m.email != response.removedAgent);
                            this.agentConversationList.next(this.agentConversationList.getValue());
                        } else {
                            this.agentConversationList.getValue()[index].members = response.currentConversation.members;
                            this.agentConversationList.getValue()[index].LastSeen = response.currentConversation.LastSeen;
                            this.agentConversationList.next(this.agentConversationList.getValue());
                        }
                    } else {
                        this.agentConversationList.getValue().push(response.currentConversation);
                        this.agentConversationList.next(this.agentConversationList.getValue());
                    }

                    if (this.selectedAgentConversation.getValue() && this.isSelfViewingChat.getValue().chatId == response.currentConversation._id) {
                        this.selectedAgentConversation.getValue().messages.push(response.message);
                        if (response.removedAgent) {
                            this.selectedAgentConversation.getValue().LastSeen = this.selectedAgentConversation.getValue().LastSeen.filter(l => l.email != response.removedAgent);
                            this.selectedAgentConversation.getValue().members = this.selectedAgentConversation.getValue().members.filter(l => l.email != response.removedAgent);
                        } else {
                            this.selectedAgentConversation.getValue().LastSeen = response.currentConversation.LastSeen;
                            this.selectedAgentConversation.getValue().members = response.currentConversation.members;
                        }

                        this.selectedAgentConversation.next(this.selectedAgentConversation.getValue());
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
                this.socket.on('seenAgentConversation', (response: any) => {
                    // console.log('SeenAgentConversation');
                    // console.log(this.selectedAgentConversation.getValue());

                    if (Object.keys(this.selectedAgentConversation.getValue()).length) {
                        let thread = this.selectedAgentConversation.getValue();
                        thread.LastSeen = response.LastSeen;
                        this.selectedAgentConversation.next(thread);
                    }
                    // console.log(this.selectedAgentConversation.getValue());
                    // this.getAllAgentConversations();
                });
                this.socket.on('newAgent', function (agent) {
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
                this.socket.on('removeAgent', function (sessionId) {
                    //console.log('Remove Agent');

                    //Removing Agent By Filter Logic.
                    this.AvailabaleAgents.next(this.AvailabaleAgents.getValue().filter((item) => {
                        return item.id != sessionId;
                    }));
                    // this.getAgentCounts();
                });
                this.socket.on('idleOn', (data) => {
                    this.AvailableAgents.next(this.AvailableAgents.getValue().map(agent => {
                        if (data.email == agent.email && agent.liveSession) {
                            agent.liveSession.state = 'IDLE';
                            agent.liveSession.acceptingChats = false;
                            if (agent.liveSession.idlePeriod) {
                                agent.liveSession.idlePeriod.push({ startTime: data.startTime, endTime: undefined });
                            } else {
                                Object.assign(agent.liveSession, {
                                    idlePeriod: [
                                        { startTime: data.startTime, endTime: undefined }
                                    ]
                                })
                            }
                        }
                        //if (this.selectedAgent.getValue().email == agent.email) this.selectedAgent.next(agent)
                        return agent;
                    }));
                    if (this.selectedAgent.getValue() && this.selectedAgent.getValue().email == data.email) {
                        let agent = this.selectedAgent.getValue();
                        agent.liveSession.state = 'IDLE';
                        agent.liveSession.acceptingChats = false;
                        if (agent.liveSession.idlePeriod) {
                            agent.liveSession.idlePeriod.push({ startTime: data.startTime, endTime: undefined });
                        } else {
                            Object.assign(agent.liveSession, {
                                idlePeriod: [
                                    { startTime: data.startTime, endTime: undefined }
                                ]
                            })
                        }
                        this.selectedAgent.next(agent);
                    }
                    if (this.agentCounts.getValue()) {
                        this.agentCounts.getValue().agents.map((a, index) => {
                            if (a.email == data.email) {
                                a.state = 'idle';
                                return;
                            }
                        });
                        this.agentCounts.next(this.agentCounts.getValue())
                    }
                    // this.getAgentCounts();
                });
                this.socket.on('ppChanged', (data) => {
                    //console.log(data);
                    this.AvailableAgents.next(this.AvailableAgents.getValue().map(agent => {
                        if (agent.email == data.email) {
                            agent.image = data.url;
                        }
                        return agent;
                    }));

                });
                this.socket.on('idleOff', (data) => {
                    this.AvailableAgents.next(this.AvailableAgents.getValue().map(agent => {
                        if (data.email == agent.email) {
                            if (!agent.liveSession) {
                                let obj = {
                                    liveSession: {
                                        createdDate: new Date().toISOString(),
                                        state: 'ACTIVE',
                                        acceptingChats: true
                                    }
                                };
                                Object.assign(agent, obj);
                                // console.log(agent);

                            } else {
                                agent.liveSession.state = 'ACTIVE';
                                let idlePeriod = agent.liveSession.idlePeriod.pop();
                                if (!idlePeriod) idlePeriod = ({} as any)
                                idlePeriod.endTime = data.endTime;
                                agent.liveSession.idlePeriod.push(idlePeriod);
                                agent.liveSession.acceptingChats = true;
                            }
                        }
                        //if (this.selectedAgent.getValue().email == agent.email) this.selectedAgent.next(agent)
                        return agent;
                    }));

                    if (this.selectedAgent.getValue() && this.selectedAgent.getValue().email == data.email) {
                        let agent = this.selectedAgent.getValue();
                        if (!agent.liveSession) {
                            let obj = {
                                liveSession: {
                                    createdDate: new Date().toISOString(),
                                    state: 'ACTIVE',
                                    acceptingChats: true
                                }
                            };
                            Object.assign(agent, obj);
                            // console.log(agent);

                        } else {
                            agent.liveSession.state = 'ACTIVE';
                            let idlePeriod = agent.liveSession.idlePeriod.pop();
                            idlePeriod.endTime = data.endTime;
                            agent.liveSession.idlePeriod.push(idlePeriod);
                            agent.liveSession.acceptingChats = true;
                        }
                        this.selectedAgent.next(agent);
                    }
                    if (this.agentCounts.getValue()) {
                        this.agentCounts.getValue().agents.map((a, index) => {
                            if (a.email == data.email) {
                                a.state = 'active';
                                return;
                            }
                        });
                        this.agentCounts.next(this.agentCounts.getValue())
                    }
                    // this.getAgentCounts();
                });
                this.socket.on('contactConversationSeen', (response) => {
                    // console.log('Conversation Seen!');
                    if (this.selectedAgentConversation.getValue()) {
                        let thread = this.selectedAgentConversation.getValue();
                        thread.LastSeen = response.LastSeen;
                        this.selectedAgentConversation.next(thread);
                    }
                    // this.getAllAgentConversations();
                });
                this.socket.on('permissionsChanged', (response) => {
                    // console.log('Agent Permissions Changed!');
                    // console.log(response);
                    this._authService.UpdateAgentPermissions(response.permissions);
                });
                this.socket.on('authPermissionsChanged', (response) => {
                    // console.log('Agent Permissions Changed!');
                    // console.log(response);
                    this._authService.UpdateAuthPermissions(response.permission);
                });
                this.socket.on('notifPermissionsChanged', (response) => {
                    // console.log('Notif Permissions Changed!');
                    // console.log(response);
                    this._authService.UpdateNotifPermissions(response.settings);
                });
            }
        }));
    }

    getAgents(filters, force = false){
        if (!this.Initialized.getValue() || force) {
            this.http.post(this.agentServiceURL + '/agentsListFiltered', { nsp: this.agent.getValue().nsp, filters: (filters.filter && Object.keys(filters.filter).length) ? filters.filter : undefined}).subscribe(response => {
                console.log(response.json());
                let data = response.json();
                // if(!this.Initialized.getValue())
                this.AvailableAgents.next(data.agents);
                this.Initialized.next(true);
                // if (!this.initialized) this.initialized = !this.initialized;
                // if (response.json()) {
                //     let data = response.json();
                //     if (data.status == 'ok') {
                //         this.AvailableAgents.next(data.agents);
                //         this.agentsChunk = (data.ended) ? -1 : this.agentsChunk + 1;
                //     }
                //     this.setLaodingVariable(false);
                // }
            }, err => {
                // this.setLaodingVariable(false);

            })
        }
    }
    SetWindowNotificationSettings(settings): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.agentServiceURL + '/setWindowNotificationSettings', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email, settings: settings }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        this.selectedAgent.getValue().windowNotifications = settings;
                        this.selectedAgent.next(this.selectedAgent.getValue());
                        this.windowNotificationSettings.next(settings);
                        observer.next(data);
                        observer.complete();
                    } else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            });
        });
    }
    GetWindowNotificationSettings(): Observable<any>{
        return new Observable((observer) => {
        this.http.post(this.agentServiceURL + '/getWindowNotificationSettings', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email}).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    if (data.windowNotifications){
                        this.windowNotificationSettings.next(data.windowNotifications);
                        observer.next(data);
                        observer.complete();
                    }
                    else {
                        this.windowNotificationSettings.next(undefined)
                        observer.next(undefined);
                        observer.complete();
                    }

                } else {
                    this.windowNotificationSettings.next(undefined);
                    observer.next(undefined);
                    observer.complete();
                }
            }
        });

    });
    }

    GetEmailNotificationSettings(){
        this.http.post(this.agentServiceURL + '/getEmailNotificationSettings', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email}).subscribe(response => {
            if (response.json()) {
                let data = response.json();

                if (data.status == 'ok') {

                    if (data.emailNotifications) this.emailNotificationSettings.next(data.emailNotifications);
                    else this.emailNotificationSettings.next(undefined)
                } else {
                    this.emailNotificationSettings.next(undefined)
                }
            }
        });
    }
    SetEmailNotificationSettings(settings): Observable<any> {
            return new Observable((observer) => {
                this.http.post(this.agentServiceURL + '/setEmailNotificationSettings', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email,settings: settings }).subscribe(response => {
                    if (response.json()) {
                        let data = response.json();
                        if (data.status == 'ok') {
                            this.selectedAgent.getValue().settings.emailNotifications = settings;
                            this.selectedAgent.next(this.selectedAgent.getValue());
                            this.emailNotificationSettings.next(settings);
                            observer.next(data);
                            observer.complete();
                        } else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                });
        });


    }
    public getLoadingVariable(): Observable<any> {
        return this.loadingAgents.asObservable();
    }
    public setLaodingVariable(value: boolean) {
        this.loadingAgents.next(value);
    }
    setViewingChat(value) {
        this.isSelfViewingChat.next(value);
    }
    editAgent(properties: any): any {
        this.socket.emit('editAgentProperties', { properties: properties, email: this.selectedAgent.getValue().email }, (response) => {
            //console.log("About to edit agent");
            if (response.status == 'ok') {
                // if(properties.first_name!=this.selectedAgent.value.first_name || properties.last_name!=this.selectedAgent.value.last_name || properties.nickname!=this.selectedAgent.value.nickname || properties.phone_no!=this.selectedAgent.value.phone_no){
                // console.log(properties);
                // console.log(this.selectedAgent.value);
                this.AvailableAgents.next(this.AvailableAgents.getValue().map(agent => {
                    if (agent.email == this.selectedAgent.getValue().email) {
                        agent.first_name = properties.first_name;
                        agent.last_name = properties.last_name;
                        agent.nickname = properties.nickname;
                        agent.phone_no = properties.phone_no;
                        agent.username = properties.username;
                        agent.gender = properties.gender;
                        if (!agent.settings) {
                            agent.settings = {
                                simchats: 0
                            }
                        }
                        agent.settings.simchats = properties.simchats;
                        agent.role = properties.role;
                    }
                    return agent;
                }));
                if (this.selectedAgent.getValue().email == this.agent.getValue().email) {
                    this._authService.UpdateSelectedAgent(properties);
                    this.setSelectedAgent(this.selectedAgent.getValue()._id);
                }


                this.setNotification('Agent Edited Successfully', 'success', 'ok');
                // }
            } else {
                this.setNotification('Can\'t Edit Agent', 'error', 'warning');
            }
        })
    }
    public addAgentSuccess(agent: any) {
        this.AvailableAgents.getValue().push(agent);
        this.AvailableAgents.next(this.AvailableAgents.getValue());

    }
    public getAllAgentsList(): Observable<any> {
        return this.AvailableAgents.asObservable();
    }
    setSearchValue(value) {
        this.searchValue.next(value);
    }
    public getAllAgentsAsync(type = 'all') {
        this.http.post(this.agentServiceURL + '/agentsList', { nsp: this.agent.getValue().nsp, type: type }).subscribe(response => {
            if (!this.initialized) this.initialized = !this.initialized;
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.AvailableAgents.next(data.agents);
                    this.agentsChunk = (data.ended) ? -1 : this.agentsChunk + 1;
                }
                this.setLaodingVariable(false);
            }
        }, err => {
            this.setLaodingVariable(false);
        })
    }
    public getMoreAgents() {
        if (this.agentsChunk != -1 && !this.loadingMoreAgents.getValue()) {
            this.loadingMoreAgents.next(true);
            this.http.post(this.agentServiceURL + '/getMoreAgents', { nsp: this.agent.getValue().nsp, chunk: this.AvailableAgents.getValue()[this.AvailableAgents.getValue().length - 1].first_name }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        this.AvailableAgents.next(this.AvailableAgents.getValue().concat(data.agents));
                        this.agentsChunk = (data.ended) ? -1 : this.agentsChunk += 1
                        this.loadingMoreAgents.next(false);
                    }
                }
            }, err => {
                this.loadingMoreAgents.next(false);
            })
        }
    }

    public getMoreAgentsObs(chunk): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.agentServiceURL + '/getAllAgentsAsync', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email, chunk: chunk }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next({ agents: data.agents, ended: data.ended });
                        observer.complete();
                    } else {
                        observer.next({ agents: [], ended: true });
                        observer.complete();
                    }
                }
            })
        })
    }
    public getAllAgentConversations() {
        this.http.post(this.agentServiceURL + '/agentConversationsList', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok' && data.conversations.length) {

                    this.agentConversationList.next(this.sortBy('LastUpdated', data.conversations));
                    // console.log(this.agentConversationList.getValue());
                } else {
                    this.agentConversationList.next([]);
                }
            }
        })
    }

    sortBy(value, array) {
        array.sort((a, b) => {
            let aDate: string = a[value];
            let bDate: string = b[value];
            return (Date.parse(aDate) - Date.parse(bDate) > 0) ? -1 : 1;
        });
        return array;
    }

    getAllAgentsForRole(role): Observable<Array<any>> {
        return new Observable((observer) => {
            this.http.post(this.agentServiceURL + '/getAllAgentsForRole', { nsp: this.agent.getValue().nsp, role: role }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.agents);
                        observer.complete();
                    } else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            })
        })
    }
    saveRoleForUsers(userList, selectedRole, roleToUpdate): Observable<Array<any>> {
        return new Observable((observer) => {
            this.http.post(this.agentServiceURL + '/saveRoleForAgents', { nsp: this.agent.getValue().nsp, selectedRole: selectedRole, role: roleToUpdate, users: userList }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        this.getAllAgentsAsync();
                        observer.next(data.agents);
                        observer.complete();
                    } else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            })
        })
    }

    AssignNewRolesToUsers(userList): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.agentServiceURL + '/assignNewRolesForAgents', { nsp: this.agent.getValue().nsp, users: userList }).subscribe(response => {
                if (response.json()) {
                    this.getAllAgentsAsync();
                    observer.next(response.json().status);
                    observer.complete();
                }
            })
        })
    }

    getAgentCounts() {
        this.http.post(this.agentServiceURL + '/getAgentCounts', { nsp: this.agent.getValue().nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') this.agentCounts.next(data.agentCounts)
            }
        })
    }
    public getSelectedAgent(): Observable<any> {
        return this.selectedAgent.asObservable();
    }
    public setSelectedAgent(id?, cid?) {
        if (id) {
            if (!this.searchValue.getValue()) {
                this.AvailableAgents.getValue().map(agent => {
                    if (agent._id == id) {
                        if (agent.details) {
                            this.selectedAgent.next(agent);
                            if (cid) {
                                // console.log('CID: ' + cid);
                                this.isSelfViewingChat.next({
                                    chatId: cid,
                                    value: false
                                });

                            }
                        }
                        else {
                            console.log('Getting Agent...');
                            this.getAgentByEmail(agent.email).subscribe(agent => {
                                this.selectedAgent.next(agent);
                                if (cid) {
                                    // console.log('CID: ' + cid);
                                    this.isSelfViewingChat.next({
                                        chatId: cid,
                                        value: false
                                    });

                                }
                            });
                        }
                    }
                });
            } else {
                this.FilteredAgents.getValue().map(agent => {
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

                        this.selectedAgent.next(agent);
                            if (cid) {
                                // console.log('CID: ' + cid);
                                this.isSelfViewingChat.next({
                                    chatId: cid,
                                    value: false
                                });
    
                            }
                    }
                })

            }

        } else {
            this.selectedAgent.next({});
            this.selectedAgentConversation.next({});
            this.isSelfViewingChat.next({
                chatId: '',
                value: false
            });
        }

    }

    getAgentByEmail(email): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.agentServiceURL + '/getAgentByEmail', { email: email }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.agent);
                        observer.complete();
                    } else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            })
        })
    }


    public UpdateAgentGroup(agentEmail: string, groupName: string, add = true) {
        this.AvailableAgents.getValue().map(agent => {
            if (agent.email == agentEmail && add) {
                agent.group.push(groupName);
            } else if (agent.email == agentEmail && !add) {
                agent.group = agent.group.filter(room => {
                    return room != groupName
                });
            }
            return agent;
        });
        this.AvailableAgents.next(this.AvailableAgents.getValue());
    }

    setNotification(notification: string, type: string, icon: string) {

        let item = {
            msg: notification,
            type: type,
            img: icon
        }
        this.notification.next(item);
    }
    getNotification() {

        return this.notification.asObservable();

    }

    setDraft(cid, draft, arrToDialog) {
        this.agentConversationList.getValue().map(conv => {
            if (conv._id == cid) {
                conv.draft = draft;
                conv.arrToDialog = arrToDialog;
                return conv;
            }
        });
        this.agentConversationList.next(this.agentConversationList.getValue());

    }

    Destroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    updateAgentProfileImage(email: string, url: string): any {
        this.AvailableAgents.next(this.AvailableAgents.getValue().map(agent => {
            if (agent.email == email) {
                agent.image = url;
            }
            return agent;
        }));
    }

    getOrcreateConversation(data) {
        this.loadingConversation.next(true);
        this.http.post(this.agentServiceURL + '/createAgentConversation', { nsp: this.agent.getValue().nsp, email: this.agent.getValue().email, conversation: data }).subscribe(response => {
            if (response.json()) {
                console.log(response.json());
                let data = response.json();
                if (!this.agentConversationList.getValue().filter(a => a._id == data.conversation._id).length) {
                    this.agentConversationList.getValue().push(data.conversation);
                    this.agentConversationList.next(this.agentConversationList.getValue());
                }
                this.selectedAgentConversation.next(data.conversation);
                this.isSelfViewingChat.next({
                    chatId: data.conversation._id,
                    value: true
                });
                this.loadingConversation.next(false);
                this.listToView.getValue()['conversations'] = true;
                this.listToView.getValue()['agents'] = false;
            }
        })
    }

    getConversationByID(cid) {
        this.socket.emit('getAgentConversation', { cid: cid }, (response) => {
            // console.log(response);
            if (response.status == 'ok') {
                this.ShowAttachmentAreaDnd.next(false);
                let conv = this.agentConversationList.getValue().filter(conv => conv._id == cid);
                if (conv && conv.length && conv[0].draft) {
                    response.conversation.draft = conv[0].draft;
                }
                this.selectedAgentConversation.next(response.conversation);
                this.isSelfViewingChat.next({
                    chatId: response.conversation._id,
                    value: true
                });
                this.conversationSeen(response.conversation._id, response.conversation.members.map(a => a.email));
            }
            this.loadingConversation.next(false);
        });
    }

    SendMessageToAgent(message) {
        this.socket.emit('insertAgentMessage', { message: message }, (response) => {
            if (response.status == 'ok') {
                this.selectedAgentConversation.getValue().messages.push(response.message)
                // console.log(this.selectedAgentConversation);
                this.selectedAgentConversation.getValue().LastSeen = response.currentConversation.LastSeen;
                this.selectedAgentConversation.next(this.selectedAgentConversation.getValue());
                let index = this.agentConversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                this.agentConversationList.getValue()[index] = response.currentConversation;
                this.agentConversationList.next(this.sortBy('LastUpdated', this.agentConversationList.getValue()));
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

    }

    conversationSeen(cid: string, to) {
        this.socket.emit('seenAgentConversation', { cid: cid, userId: this.agent.getValue().email, to: to }, (response) => {
            if (response.status == 'ok') {
                let index = this.agentConversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                this.agentConversationList.getValue()[index] = response.currentConversation;
                this.agentConversationList.next(this.agentConversationList.getValue());
            }
        });
    }

    toggleAgentAccessInformation() {
        this.showAgentAccessInfo.next(!this.showAgentAccessInfo.getValue());
    }

    GetMoreMessages(cid, lastMessageId = '0', visibleTo = ''): Observable<any> {
        // console.log(visibleTo);
        return new Observable(observer => {
            this.socket.emit('getMoreAgentMessages', { cid: cid, chunk: lastMessageId, visibleTo: visibleTo }, (response) => {
                if (response.status == 'ok' && response.messages.length) {
                    if (!this.selectedAgentConversation.getValue().ended) {
                        response.messages.forEach(msg => {
                            this.selectedAgentConversation.getValue().messages.splice(0, 0, msg);
                            this.selectedAgentConversation.getValue().ended = response.ended;
                        });
                        this.selectedAgentConversation.next(this.selectedAgentConversation.getValue());
                    }
                }
                observer.next({ status: 'ok' });
                observer.complete();
            });
        })

    }

    ValidatePassword(email, password): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('validatePassword', { email: email, password: password }, (response) => {
                observer.next(response.status);
                observer.complete();
            })
        })
            .map(response => response)
            .catch(err => { return Observable.throw(err.json()) })
            .debounceTime(3000);
    }

    changePassword(email, password): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('changePassword', { email: email, password: password }, (response) => {
                observer.next(response.status);
                observer.complete();
            })
        })
    }

    //Message Drafts
    AddDraft(draft) {
        if (this.selectedAgentConversation.getValue()) {
            let conversation = this.selectedAgentConversation.getValue();
            conversation.draft = draft;
            this.selectedAgentConversation.next(conversation);
        }
    }
    RemoveDraft() {
        if (this.selectedAgentConversation.getValue()) {
            let conversation = this.selectedAgentConversation.getValue();
            delete conversation.draft;
            this.selectedAgentConversation.next(conversation);
        }
    }
    //Typing State Events

    public StartedTyping(cid, to, from) {
        this.socket.emit('typingStarted', { cid: cid, to: to, from: from }, (response) => {

        })
    }
    public PausedTyping(cid, to, from) {
        // console.log('Emitting typing paused!');

        this.socket.emit('typingPaused', { cid: cid, to: to, from: from }, (response) => {

        })
    }

    SelectAgent(value) {
        let hash = 0;

        if (this.selectedAgent) {
            this.AvailableAgents.getValue().map((agent, index) => {

                if (agent._id == this.selectedAgent.getValue()._id) {
                    hash = (value == 'next') ? (index + 1) : (index - 1)
                }
            })
        }

        if (hash >= 0) {
            if (this.AvailableAgents.getValue()[hash]) {
                this.setSelectedAgent(this.AvailableAgents.getValue()[hash]._id)
            }
        }
    }
    //Validate Sheet
    public ValidateSheet(fileElement): Observable<any> {
        return new Observable((observer) => {
            let localFileReader: any = new FileReader();
            localFileReader.readAsArrayBuffer(fileElement);
            let validation = {
                status: 'ok',
                msgs: []
            };
            localFileReader.onload = (event) => {
                // console.log('LocalFileReader On LOAD');
                let workbook: WorkBook = xlsx.read(new Uint8Array(event.target.result), { type: "array" });
                let Sheets = workbook.Sheets;
                let sheetNames = Object.keys(Sheets);

                let ISODate: string = (new Date()).toISOString();
                sheetNames.forEach((sheetName) => {
                    let sheet = Sheets[sheetName];

                    // parse each sheet and add to db
                    // return if sheet is empty
                    if (!sheet['!ref']) {
                        validation.status = 'error';
                        validation.msgs = ['Sheet is empty!'];
                        observer.next(validation);
                        observer.complete();
                    }

                    let sheetObj = xlsx.utils.sheet_to_json(sheet, { raw: false });
                    let required_keys = [
                        'first name',
                        'last name',
                        'nick',
                        'pass',
                        'email',
                        'role'
                    ]
                    let rowClean = this.lowercaseObjKeys(sheetObj[0]);
                    required_keys.forEach(key => {
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
            }
        })

    }
    //Import Agents
    public UploadAgents(fileElement) {
        try {
            let localFileReader: any = new FileReader();
            let data = [];
            // Local manipulations to uploaded files
            localFileReader.onload = (event) => {
                // console.log('LocalFileReader On LOAD');
                let workbook: WorkBook = xlsx.read(new Uint8Array(event.target.result), { type: "array" });
                let Sheets = workbook.Sheets;
                let sheetNames = Object.keys(Sheets);

                let ISODate: string = (new Date()).toISOString();
                sheetNames.forEach((sheetName) => {
                    let sheet = Sheets[sheetName];

                    // parse each sheet and add to db
                    // return if sheet is empty
                    if (!sheet['!ref'])
                        return;

                    let sheetObj = xlsx.utils.sheet_to_json(sheet, { raw: false });

                    sheetObj.forEach((row) => {
                        let rowClean = this.lowercaseObjKeys(row);
                        // console.log(rowClean);

                        let agent = {
                            first_name: rowClean['first name'],
                            last_name: rowClean['last name'],
                            phone_no: (rowClean['phone_no'] ? rowClean['phone_no'] : ''),
                            nickname: rowClean['nick'],
                            username: rowClean['nick'],
                            password: (rowClean['password'] || rowClean['pass']),
                            email: this.testRegExp(this.emailPattern, rowClean['email']),
                            gender: (rowClean['gender'] ? rowClean['gender'] : 'male'),
                            nsp: this.agent.getValue().nsp,
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

                        let groups = (rowClean['group'] ? rowClean['group'].split(',') : []);
                        let index = data.findIndex(d => d.agent.email == agent.email);

                        if (index != -1) {
                            // console.log(data[index].agent.email);
                            data[index].groups = data[index].groups.concat(groups);
                        } else {
                            data.push({ agent: agent, groups: groups });
                        }

                    });
                });
            }

            localFileReader.onloadend = (event) => {
                // console.log('on load Ended!');
                // console.log(contacts);
                // console.log(data);
                this.InitiateImport(data).subscribe(response => {
                    if (response.duplicates) {
                        this.dialog.open(ConfirmationDialogComponent, {
                            panelClass: ['confirmation-dialog'],
                            data: { headermsg: 'Duplicate contacts found! Do you want to update them?' }
                        }).afterClosed().subscribe(data => {
                            if (data == 'ok') {
                                this.ImportAgentsWithUpdate(data);
                            } else {
                                this.ImportNewAgents(data);
                            }
                        });
                    } else {
                        this.ImportNewAgents(data);
                    }
                });
            }
            localFileReader.readAsArrayBuffer(fileElement);
        }
        catch (err) {
            console.log("Error encountered in importing agents");
            console.log(err);
        }

    }

    InitiateImport(data): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('initiateImport', { agents: data }, (response) => {
                observer.next(response);
                observer.complete();
            })
        })
    }

    ImportNewAgents(data) {
        // console.log('Ready to Emit');
        // console.log(data);
        this.socket.emit('importNewAgents', { agents: data }, (response) => {
            // console.log(response);

            if (response.status == 'ok') {
                // this.contactsList.next(response.contactList);
                // this.GetContactsCountWithStatus();
            } else {
                // this.contactsList.next([]);
            }
        });
    }

    ImportAgentsWithUpdate(data) {
        this.socket.emit('importAgentsWithUpdate', { agents: data }, (response) => {
            if (response.status == 'ok') {
                // this.contactsList.next(response.contactList);
                // this.GetContactsCountWithStatus();
            }
        });
    }

    private lowercaseObjKeys(obj: Object) {
        let keys = Object.keys(obj);
        keys.forEach((key) => {
            let keyClean = key.toLowerCase().trim();

            // do nothing if the clean key is the same as the original key
            if (keyClean === key)
                return;
            obj[keyClean] = obj[key];
            delete obj[key];
            // console.log("key: " + key);
            // console.log("keyClean: " + keyClean);
        })

        return obj;
    }

    private testRegExp(regexPattern: RegExp, tested: string) {
        if (regexPattern.test(tested)) {
            return tested;
        }
        else {
            return '';
        }
    }

    //Group Chats Events
    removeMember(email, cid): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('removeMemberFromConversation', { cid: cid, email: email }, (response) => {
                if (response.status == 'ok') {
                    // console.log('Removed', response);
                    this.selectedAgentConversation.getValue().messages.push(response.message)
                    // console.log(this.selectedAgentConversation);

                    this.selectedAgentConversation.getValue().LastSeen = this.selectedAgentConversation.getValue().LastSeen.filter(l => l.email != response.removedAgent);
                    this.selectedAgentConversation.getValue().members = this.selectedAgentConversation.getValue().members.filter(l => l.email != response.removedAgent);
                    this.selectedAgentConversation.next(this.selectedAgentConversation.getValue());
                    // console.log(this.selectedAgentConversation.getValue());

                    let index = this.agentConversationList.getValue().findIndex(obj => obj._id == this.selectedAgentConversation.getValue()._id);
                    this.agentConversationList.getValue()[index] = this.selectedAgentConversation.getValue();
                    this.agentConversationList.next(this.agentConversationList.getValue());
                    // response.currentConversation.members.forEach((member,index) => {
                    //     if(member.email == response.removedAgent){
                    //         response.currentConversation.members.splice(index,1);
                    //     }
                    // });
                    observer.next(this.selectedAgentConversation.getValue());
                    observer.complete();
                } else {
                    observer.next(undefined);
                    observer.complete();
                }
            })
        })
    }
    addMember(emails, cid): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('addMemberToConversation', { cid: cid, emails: emails }, (response) => {
                if (response.status == 'ok') {
                    // console.log('Added', response);

                    this.selectedAgentConversation.getValue().messages.push(response.message);
                    // console.log(this.selectedAgentConversation);
                    this.selectedAgentConversation.getValue().LastSeen = response.currentConversation.LastSeen;
                    this.selectedAgentConversation.getValue().members = response.currentConversation.members;
                    this.selectedAgentConversation.next(this.selectedAgentConversation.getValue());
                    let index = this.agentConversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                    this.agentConversationList.getValue()[index] = response.currentConversation;
                    this.agentConversationList.next(this.agentConversationList.getValue());
                    observer.next(response.currentConversation);
                    observer.complete();
                } else {
                    observer.next(undefined);
                    observer.complete();
                }
            })
        })
    }
    toggleAdmin(email, cid, value): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('toggleAdminInGroup', { cid: cid, email: email, value: value }, (response) => {
                if (response.status == 'ok') {
                    this.selectedAgentConversation.getValue().messages.push(response.message);
                    // console.log(this.selectedAgentConversation);
                    this.selectedAgentConversation.getValue().LastSeen = response.currentConversation.LastSeen;
                    this.selectedAgentConversation.next(this.selectedAgentConversation.getValue());
                    let index = this.agentConversationList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                    this.agentConversationList.getValue()[index] = response.currentConversation;
                    this.agentConversationList.next(this.agentConversationList.getValue());
                    observer.next(response.currentConversation);
                    observer.complete();
                } else {
                    observer.next(undefined);
                    observer.complete();
                }
            })
        })
    }

}