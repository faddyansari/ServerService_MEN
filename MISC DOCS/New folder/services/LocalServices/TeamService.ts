import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { SocketService } from "../SocketService";
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Http } from "@angular/http";
import { AuthService } from "../AuthenticationService";


@Injectable()
export class TeamService {

    private subscriptions: Subscription[] = [];
    socket: SocketIOClient.Socket;
    Teams: BehaviorSubject<any> = new BehaviorSubject([]);
    selectedTeam: BehaviorSubject<any> = new BehaviorSubject(undefined);
    ticketServiceURL = '';
    Agent: any;
    constructor(_authService: AuthService, _socket: SocketService, private http: Http, public snackBar: MatSnackBar) {
        _authService.RestServiceURL.subscribe(url => {
            this.ticketServiceURL = url + '/api/tickets';
        });
        _authService.getAgent().subscribe(data => {
            this.Agent = data;
        });
        this.subscriptions.push(_socket.getSocket().subscribe(socket => {
            if (socket) {
                this.socket = socket;
                this.getTeams();
            }
        }))
    }

    getTeams() {
        this.socket.emit('getTeams', {}, (response) => {
            if (response.status == 'ok') {
                this.Teams.next(response.teams);
            }
        })
    }
    insertTeam(team): Observable<any> {
        // return new Observable((observer) => {
        //     this.socket.emit('insertTeam', { team: team }, (response) => {
        //         if (response.status == 'ok') {
        //             this.Teams.getValue().push(response.team);
        //             this.Teams.next(this.Teams.getValue());
        //             this.showNotification('Team added successfully!', 'ok', 'success');
        //         } else {
        //             this.showNotification('Error!', 'warning', 'error');
        //         }
        //         observer.next({ status: response.status });
        //         observer.complete();
        //     })
        // })
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/insertTeam', { team: team, nsp: this.Agent.nsp }).subscribe(response => {
                if(response.json()){
                    let data = response.json();
                    if (data.status == 'ok') {
                        this.Teams.getValue().push(data.team);
                        this.Teams.next(this.Teams.getValue());
                        this.showNotification('Team added successfully!', 'ok', 'success');
                    } else {
                        this.showNotification(data.status, 'warning', 'error');
                    }
                    observer.next({ status: data.status });
                    observer.complete();
                }
                // console.log(response.json())
            })
        });
}
deleteTeam(id): Observable < any > {
    return new Observable((observer) => {
        this.socket.emit('deleteTeam', { id: id }, (response) => {
            // console.log(response);

            if (response.status == 'ok') {
                this.Teams.next(response.teams);
                if (this.Teams.getValue().length) this.selectedTeam.next(this.Teams.getValue()[this.Teams.getValue().length - 1]);
                else this.selectedTeam.next(undefined);
                this.showNotification('Team deleted successfully!', 'ok', 'success');
            } else {
                this.showNotification('Error!', 'warning', 'error');
            }
            observer.next({ status: response.status });
            observer.complete();
        })
    })
}
setSelectedTeam(id) {
    // console.log(id);
    if (id) {

        this.Teams.getValue().map(team => {
            if (team._id == id) {
                this.selectedTeam.next(team);
                return;
            }
        })
    } else {
        this.selectedTeam.next(undefined);
    }
}

addAgentsForTeam(id, emails): Observable < any > {
    return new Observable((observer) => {
        this.socket.emit('addAgentsforTeam', { id: id, emails: emails }, (response) => {
            // console.log(response);

            if (response.status == 'ok') {
                this.selectedTeam.getValue().agents = response.addedAgents;
                this.selectedTeam.next(this.selectedTeam.getValue());
            }
            observer.next({ status: response.status });
            observer.complete();
        })
    })
}
removeAgentsForTeam(id, email) {
    this.socket.emit('removeAgentForTeam', { id: id, email: email }, (response) => {
        // console.log(response);
        if (response.status == 'ok') {
            this.selectedTeam.getValue().agents = response.agents;
            this.selectedTeam.next(this.selectedTeam.getValue());
        }
    })
}

ToggleExclude(team_name, email, value) {
    this.socket.emit('toggleExcludeForTeam', { team_name: team_name, email: email, value: value }, (response) => {
        // console.log(response);
    })
}

editTeam(_id, team) : Observable < any > {
    return new Observable((observer) => {
        this.socket.emit('updateTeam', { _id: _id, team: team }, (response) => {
            if (response.status == 'ok') {
                this.Teams.getValue().map(t => {
                    if (t._id == _id) {
                        t.team_name = team.team_name;
                        t.desc = team.desc;
                    }
                    return t;
                });
                this.Teams.next(this.Teams.getValue());
            } else {
                console.log(response);
            }
            observer.next(response.status);
            observer.complete();
        })
    })
}

showNotification(msg, icon, type) {
    let notification = {
        msg: msg,
        type: type,
        img: icon
    }
    this.snackBar.openFromComponent(ToastNotifications, {
        data: {
            img: notification.img,
            msg: notification.msg
        },
        duration: 2000,
        panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
    }).dismiss;
}
}