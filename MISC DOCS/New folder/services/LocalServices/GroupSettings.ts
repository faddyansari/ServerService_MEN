// Angular Imports
import { Injectable } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';

import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";
import { AgentService } from "../AgentService";



@Injectable()
export class GroupSettingsService {

    private groupsList: BehaviorSubject<any> = new BehaviorSubject(undefined);
    private socket: SocketIOClient.Socket;
    private subscriptions: Subscription[] = [];



    constructor(private _socketService: SocketService,
        private _authService: AuthService,
        private _agentService: AgentService) {

        this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
            // if (agent.role == 'admin') {

            //     this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            //         this.socket = socket;
            //         this.GetGroups();
            //     }));
            // }
            this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
                this.socket = socket;
                this.GetGroups();
            }));
        }));
    }


    public GetGroupsList(): Observable<any> {
        return this.groupsList.asObservable();
    }

    private GetGroups() {

        this.socket.emit('getGroups', {}, (response) => {
            //console.log(response.rooms);
            if (response.status == 'ok') {
                this.groupsList.next(response.groups[0].rooms);
            }
        });

    }

    public AddGroup(groupName: string): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('addGroup', { groupName: groupName }, (response) => {
                if (response.status == 'ok') {
                    this.groupsList.getValue()[groupName] = { isActive: false, Agents: [] };
                    this.groupsList.next(this.groupsList.getValue());
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error(response);
                }
            })
        })
    }

    public AddAgent(data: any): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('addAgentToGroup', data, (response) => {
                //console.log(response);
                if (response.status == 'ok') {
                    this.groupsList.getValue()[data.groupName].Agents.push(data.agentEmail);
                    this.groupsList.next(this.groupsList.getValue());
                    this._agentService.UpdateAgentGroup(data.agentEmail, data.groupName, true);
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error(response);
                }
            });
        })
    }

    public RemoveAgent(data: any): Observable<any> {
        //console.log('Removing Agent');
        return new Observable(observer => {
            this.socket.emit('removeAgentFromGroup', data, (response) => {
                //console.log(response);
                if (response.status == 'ok') {
                    this.groupsList.getValue()[data.groupName].Agents = this.groupsList.getValue()[data.groupName].Agents.filter(agentEmail => {
                        return agentEmail != data.agentEmail
                    });
                    this.groupsList.next(this.groupsList.getValue());

                    this._agentService.UpdateAgentGroup(data.agentEmail, data.groupName, false);
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error(response);
                }
            });
        })
    }

    public ToggleGroup(data: any, isACtive: boolean): Observable<any> {
        return new Observable(observer => {
            this.socket.emit((isACtive) ? 'deactivateGroup' : 'activateGroup', data, (response) => {
                if (response.status == 'ok') {
                    this.groupsList.getValue()[data.groupName].isActive = !isACtive;
                    this.groupsList.next(this.groupsList.getValue());
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error(response);
                }
            });
        })
    }

    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }

}