// Angular Imports
import { Injectable } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';

import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";
import { AdminSettingsService } from "../adminSettingsService";
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material";
import { Http } from '@angular/http';





@Injectable()
export class IntegrationsService {

    private subscriptions: Subscription[] = [];
    private agent: any;
    private socket: any;
    FBUrl = '';
    // lets facebook login know where to come back
    public FB_redirect_uri = location.protocol + "//" + location.host + location.pathname;
    public FB_subwindow_location: BehaviorSubject<string> = new BehaviorSubject("");
    // public fb_appid: BehaviorSubject<string> = new BehaviorSubject("");
    // private chatSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);
    // private settingsChanged: BehaviorSubject<boolean> = new BehaviorSubject(false);

    // private savingAssignmentSetting: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // private savingFileSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // private savingTranscriptSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // private savingchatTimeoutsSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // private savingGreetingMessage: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private _authService: AuthService,
        private _socketService: SocketService,
        private http: Http,
        private snackBar: MatSnackBar) {

        this.subscriptions.push(_authService.getAgent().subscribe(agent => {
            this.agent = agent;
        }));

        this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            this.socket = socket;
        }));
        this.subscriptions.push(this._authService.FacebookRestUrl.subscribe(url => {
            this.FBUrl = url;
        }));

    }

    public loginFBUser() {
        // let loginPageUrl = "https://www.facebook.com/v3.2/dialog/oauth?client_id={app-id}&redirect_uri={redirect-uri}&state={state-param}
        let loginPageUrl = "https://www.facebook.com/v5.0/dialog/oauth";
        window.open(loginPageUrl);
    }

    public getFacebookAppId(): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.FBUrl + '/getFacebookAppId', {nsp:this.agent.nsp}).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        observer.next(response);
                        observer.complete();
                    }
                    else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            // this.socket.emit('getFacebookAppId', {}, (response) => {
            //     if (response.status == 'ok') {
            //         observer.next(response);
            //         observer.complete();
            //     } else {
            //         observer.next(undefined);
            //         observer.complete();
            //     }
            // })
        })
    }
    public getFbRule(): Observable<any> {
        return new Observable((observer) => {

            this.http.post(this.FBUrl + '/getFbRule', {nsp:this.agent.nsp}).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        console.log(response)
                        observer.next(response.rules);
                        observer.complete();
                    }
                    else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            // this.socket.emit('getFbRule', {}, (response) => {
            //     if (response.status == 'ok') {
            //         console.log(response)
            //         observer.next(response.rules);
            //         observer.complete();
            //     } else {
            //         observer.next(undefined);
            //         observer.complete();
            //     }
            // })
        })
    }
    public setFacebookAppId(value): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.FBUrl + '/updateFacebookAppId', { nsp:this.agent.nsp, app_id: value }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        observer.next(response.app_id);
                        observer.complete();
                    } else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            // this.socket.emit('updateFacebookAppId', { app_id: value }, (response) => {
            //     if (response.status == 'ok') {
            //         observer.next(response.app_id);
            //         observer.complete();
            //     } else {
            //         observer.next(undefined);
            //         observer.complete();
            //     }
            // })
        });
    }

    public setRuleset(obj): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.FBUrl + '/setRuleset', { obj: obj, nsp: this.agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        this.snackBar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Rule updated sucessfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                        observer.next(response.obj);
                        observer.complete();
                    } else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            //     this.socket.emit('setRuleset', {obj : obj}, (response) => {
            //         if(response.status == 'ok'){
            //             this.snackBar.openFromComponent(ToastNotifications, {
            //                 data: {
            //                   img: 'ok',
            //                   msg: 'Rule updated sucessfully!'
            //                 },
            //                 duration: 2000,
            //                 panelClass: ['user-alert', 'success']
            //               });
            //             observer.next(response.obj);
            //             observer.complete();
            //         }else{
            //             observer.next(undefined);
            //             observer.complete();
            //         }
            //     })
        });
    }


    //#endregion

    public Destroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}