import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { Observable } from "rxjs/Observable";




@Injectable()
export class TagsAutomationSettings {
    public auto_assign: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public groupsAutomationSettings: BehaviorSubject<Object> = new BehaviorSubject({});
    private socket: SocketIOClient.Socket;
    private subscriptions: Subscription[] = [];

    constructor(private _socketService: SocketService,
        private _authService: AuthService) {
        this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
            // if (agent.role == 'admin') {
            // }
            this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
                this.socket = socket;
                this.getGroupsAutomationSettings();
            }));
        }));
    }

    public getAutoAssign(): Observable<Boolean> {
        return this.auto_assign.asObservable();
    }

    private getGroupsAutomationSettings() {

        this.socket.emit('getGroupsAutomationSettings', {}, (response) => {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
                // console.log("resposne tagauto",response);
                this.groupsAutomationSettings.next(response.groupsAutomationSettings);
                // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
            }
        });

    }

    public getTagSettings(): Observable<Object> {
        return this.groupsAutomationSettings.asObservable();
    }

    public SetAutoAssign(auto_assign: boolean) {
        // console.log("here",auto_assign);
        this.socket.emit('setAutoAssign', { auto_assign: auto_assign }, (response) => {
            if (response.status == 'ok') {
                // console.log(response);
                
                this.groupsAutomationSettings.next(response.groupsAutomationSettings);
                // console.log(this.groupsAutomationSettings);
                
            } else {
                console.log('error');
            }
        });
    }

    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }
}