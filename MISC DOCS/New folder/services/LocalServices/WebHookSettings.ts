// Angular Imports
import { Injectable } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';

import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";



@Injectable()
export class WebHookSettingsService {

    private script: BehaviorSubject<string> = new BehaviorSubject('');
    public currentAppToken: BehaviorSubject<string> = new BehaviorSubject('');

    private socket: SocketIOClient.Socket;
    private subscriptions: Subscription[] = [];

    constructor(private _socketService: SocketService,
        private _authService: AuthService) {

        this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
            // if (agent.role == 'admin') {
            // }
            this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
                this.socket = socket;
                this.GetWebhooks();
            }));
        }));

        this.GetCurrentAppToken();
    }


    public getCustomScript(): Observable<string> {
        return this.script.asObservable();
    }

    private GetWebhooks() {

        this.socket.emit('getWebhooks', {}, (response) => {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
                //console.log(response);
                this.script.next(response.customScript);
            }
        });

    }

    public SetScript(script: string): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('setCustomScript', { script: script }, (response) => {
                if (response.status == 'ok') {
                    this.script.next(script);
                    observer.next(response);
                    observer.complete();
                } else {
                    switch (response.code) {
                        case '500':
                            observer.error('Invalid Input');
                            break;
                        case '501':
                            observer.error('Internal Server Error');
                            break;
                        case '503':
                                observer.error('Your code contains invalid keywords. ');
                            break;
                    }
                }
            });
        })
    }

    public GenerateAppToken() {
        this.socket.emit('generateAppToken', (resp) => {
            // console.log('resp');
            // console.log(resp);
            if (resp.status == "ok") {
                this.currentAppToken.next(resp.uuid);
            }
            else {
                console.log("Error occurred in generating app token")
            }
            // console.log("generated!")
            // this.currentAppToken.next("resp.appToken");
        });
    }

    public GetCurrentAppToken() {
        this.socket.emit('getCurrentAppToken', (resp) => {
            if (resp.status == "ok") {
                // console.log('resp GetCurrentAppToken')
                // console.log(resp)
                this.currentAppToken.next(resp.uuid);
            }
            else {
                console.log("Error occurred in getting the current app token")
            }
        });
    }

    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }

}