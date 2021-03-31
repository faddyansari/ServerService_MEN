// Angular Imports
import { Injectable, ɵConsole } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';

import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";
import { GlobalStateService } from "../GlobalStateService";



@Injectable()
export class ChatWindowCustomizations {

    private subscriptions: Subscription[] = [];
    private agent: any;
    private socket: SocketIOClient.Socket;

    private displaySettings: BehaviorSubject<any> = new BehaviorSubject(undefined);

    constructor(private _authService: AuthService,
        private _socketService: SocketService,
        private _appStateService: GlobalStateService) {
        // console.log('Chat window Customizations');
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
        this.subscriptions.push(_authService.getAgent().subscribe(agent => {
            this.agent = agent;
        }));

        this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            this.socket = socket;
            this.GetChatWindowSettings();
        }));
    }


    public GetChatWindowSettings() {
        if (!this.displaySettings.getValue()) {
            this.socket.emit('getDisplaySettings', {}, (response => {

                if (response.status == 'ok') {
                    this.displaySettings.next(response.settings);
                }
            }));
        }
    }


    public UpdateChaWindowSettings(settingsType: string, displaySettings: any): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('updateDisplaySettings', {
                settingsName: settingsType,
                settings: (settingsType == 'chatbubble') ? displaySettings.settings.chatbubble : displaySettings.settings.chatbar,
                barEnabled: (settingsType == 'chatbubble') ? false : true,
                avatarColor: displaySettings.avatarColor,
                barEnabledForDesktop: displaySettings.barEnabledForDesktop,
                barEnabledForMobile: displaySettings.barEnabledForMobile
            }, (response => {
                if (response.status == 'ok') {
                    observer.next(response);
                    observer.complete();
                } else {
                    //TODO. Send Proper Error After Recieving Errors From Server.
                    observer.error({ error: 'error' })
                }
            }));
        })
    }

    public UpdateChatWindowContentSettings(name: string, settings: any): Observable<any> {
        //console.log(settings);
        return new Observable(observer => {
            
            this.socket.emit('updateChatWindowForm', {
                settingsName: name,
                settings: settings,
            }, (response => {

                if (response.status == 'ok') {
                    this.displaySettings.getValue().settings.chatwindow[name] = settings;
                    this.displaySettings.next(this.displaySettings.getValue());
                    observer.next(response);
                    observer.complete();
                } else {
                    //TODO. Send Proper Error After Recieving Errors From Server.
                    observer.error({ error: 'error' })
                }
            }));
        })
    }

    public UpdateBackgroundImage(link: string, name: string): any {

        return new Observable(observer => {
            this.socket.emit('updateBackgroundImage', {
                links: link,
                name: name
            }, (response => {
                if (response.status == 'ok') {
                    this.displaySettings.getValue().settings.chatwindow['themeSettings'].bgImage = { links: link, name: name };
                    this.displaySettings.next(this.displaySettings.getValue());
                    observer.next(response);
                    observer.complete();
                } else {
                    //TODO. Send Proper Error After Recieving Errors From Server.
                    observer.error({ error: 'error' })
                }
            }));
        })
    }

    public RemoveBackGroundImage(): any {
        return new Observable(observer => {
            this.socket.emit('removeBackgroundImage', {}, (response => {
                if (response.status == 'ok') {
                    this.displaySettings.getValue().settings.chatwindow['themeSettings'].bgImage = {};
                    this.displaySettings.next(this.displaySettings.getValue());
                    observer.next(response);
                    observer.complete();
                } else {
                    //TODO. Send Proper Error After Recieving Errors From Server.
                    observer.error({ error: 'error' })
                }
            }));
        })
    }



    public GetDisplaySettings(): Observable<any> {
        return this.displaySettings.asObservable();
    }

    public RGBAToHexAString(rgba) {
        if (new RegExp(/^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/).test(rgba)) return rgba;
        let sep = rgba.indexOf(",") > -1 ? "," : " ";
        rgba = rgba.substr(5).split(")")[0].split(sep);

        // Strip the slash if using space-separated syntax
        if (rgba.indexOf("/") > -1)
            rgba.splice(3, 1);

        for (let R in rgba) {
            let r = rgba[R];
            if (r.indexOf("%") > -1) {
                let p = r.substr(0, r.length - 1) / 100;

                if (parseInt(R) < 3) {
                    rgba[R] = Math.round(p * 255);
                } else {
                    rgba[R] = p;
                }
            }
        }
        console.log(this.RGBAToHexA(rgba));
        return this.RGBAToHexA(rgba);
    }

    private RGBAToHexA(rgba) {
        //console.log(rgba);
        let r = (+rgba[0]).toString(16),
            g = (+rgba[1]).toString(16),
            b = (+rgba[2]).toString(16),
            a = Math.round(+rgba[3] * 255).toString(16);
        if (!a) a = 'F';
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        if (a.length == 1)
            a = "0" + a;
        //console.log(a);

        return "#" + r + g + b + a;
    }


    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }

}