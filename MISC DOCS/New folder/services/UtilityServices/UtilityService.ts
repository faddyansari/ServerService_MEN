// Angular Imports
import { Injectable } from "@angular/core";
//RxJs Imports
import { Observable } from 'rxjs/Observable';
import { SocketService } from "../SocketService";
import { Http } from "@angular/http";
import { Subscription } from "rxjs/Subscription";
import { AuthService } from "../AuthenticationService";



@Injectable()
export class UtilityService {

    subscriptions: Subscription[] = [];
    private socket: SocketIOClient.Socket;
    private agent: any;
    private url: any;
    ticketServiceURL: any;

    constructor(private _socketService: SocketService,
        private http: Http,
        private _authService: AuthService) {
        console.log('Utility Service!');

        this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            this.socket = socket;
        }));

        // this.subscriptions.push(this._authService.getAgentServer().subscribe(url => {
        //     this.url = url;
        // }));
        this.subscriptions.push(this._authService.getServer().subscribe(url => {
            this.url = url;
        }));
        this.subscriptions.push(this._authService.RestServiceURL.subscribe(url => {
            this.ticketServiceURL = url + '/api/tickets';
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
            this.agent = agent;
        }));
    }

    public getAllAgentsListObs(): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('getAllAgentsAsync', {}, (response) => {
                // console.log(response);

                if (response.status == 'ok') {
                    observer.next(response.agents);
                    observer.complete();
                } else {
                    observer.next([]);
                    observer.complete();
                }
            })
        })
    }
    public getAgentsByUsername(nsp, username): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/getAgentsByUsername', { nsp: nsp, username: username }).subscribe(response => {
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
            });
        });
    }
    public getMoreAgentsObs(chunk): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('getAllAgentsAsync', { chunk: chunk }, (response) => {
                // console.log(response);
                if (response.status == 'ok') {
                    observer.next({ agents: response.agents, ended: response.ended });
                    observer.complete();
                    // this.AvailableAgents.next(this.AvailableAgents.getValue().concat(response.agents));
                    // this.agentsChunk = (response.ended) ? -1 : this.agentsChunk += 1
                    // this.loadingMoreAgents.next(false);
                } else {
                    observer.next({ agents: [], ended: true });
                    observer.complete();
                }
            });
        })
    }

    GetGroups(): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/getGroupByNSP', { email: this.agent.email, nsp: this.agent.nsp }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.group_data);
                        observer.complete();
                        // this.groupsList.next(data.group_data);
                    } else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            });

        });
    }

    getTeams(): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/getTeamsByNSP', { email: this.agent.email, nsp: this.agent.nsp }).subscribe(response => {
                // console.log(response.json());
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.teams);
                        observer.complete();
                        // this.groupsList.next(data.group_data);
                    } else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            });
        });
    }

    getGroupsAgainstAgent(email): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('getGroupsAgainstAgent', { email: email }, (response) => {
                if (response.status == 'ok') {
                    observer.next(response.groups);
                    observer.complete();
                } else {
                    observer.next([]);
                    observer.complete();
                }
            })
        })
    }

    getAgentsAgainstGroup(groups: Array<string>): Observable<any> {
        return new Observable((observer) => {
            if (!Array.isArray(groups)) groups = [groups];
            if (groups.length) {
                this.http.post(this.ticketServiceURL + '/getAgentsAgainstGroup', { nsp: this.agent.nsp, groupList: groups }).subscribe(response => {
                    if (response.json()) {
                        let data = response.json();
                        if (data.status == 'ok') {
                            let agents = [];
                            data.agents.forEach(agent => {
                                if (!agents.filter(a => a.email == agent.email).length) {
                                    agents.push(agent);
                                }
                            });
                            // console.log(agents);

                            observer.next(agents);
                            observer.complete();
                        } else {
                            observer.next([]);
                            observer.complete();
                        };
                    }
                })
            } else {
                this.http.post(this.ticketServiceURL + '/getAgentsAgainstUser', { nsp: this.agent.nsp, email: this.agent.email }).subscribe(response => {
                    if (response.json()) {
                        let data = response.json();
                        if (data.status == 'ok') {
                            let agents = [];
                            data.agents.forEach(agent => {
                                if (!agents.filter(a => a.email == agent.email).length) {
                                    agents.push(agent);
                                }
                            });
                            // console.log(agents);

                            observer.next(agents);
                            observer.complete();
                        } else {
                            observer.next([]);
                            observer.complete();
                        };
                    }
                })
                // observer.next([]);
                // observer.complete();
            }
        })
    }

    public SearchAgent(keyword, chunk = '0'): Observable<any> {
        console.log('Searching agent on server...');
        return this.http.post(this.url + '/agent/searchAgents/', {
            keyword: keyword,
            nsp: this.agent.nsp,
            chunk: chunk
        })
            .map((response) => {
                return response.json()
            })
            .catch(err => {
                return Observable.throw(err);
            })
    }

    GetMediaType(filename: string): any {
        // console.log(value);
        // console.log(value.filename);
        // console.group(value.path)
        if (filename) {
            let extension = filename.split('.')[1];

            switch (extension.toLowerCase()) {
                case 'png':
                case 'jpeg':
                case 'jpg':
                case 'bmp':
                case 'svg':
                case 'gif':
                    return '1';
                case 'mp3':
                case 'webm':
                    return '2';
                case 'mp4':
                case 'm4a':
                case 'm4v':
                case 'f4v':
                case 'm4b':
                case 'f4b':
                case 'mov':
                    return '3';
                case 'pdf':
                case 'xlsx':
                case 'docx':
                case 'doc':
                case 'txt':
                case 'csv':
                    return '4';
                default:
                    return '4';
            }
        } else return '4'
    }

    Destroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }
}