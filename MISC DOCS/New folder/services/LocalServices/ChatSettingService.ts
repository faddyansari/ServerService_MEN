// Angular Imports
import { Injectable } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';

import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";
import { AdminSettingsService } from "../adminSettingsService";
import { UploadingService } from "../UtilityServices/UploadingService";




@Injectable()
export class ChatSettingService {

    private subscriptions: Subscription[] = [];
    private agent: any;
    private socket: any;
    public chatSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);
    private settingsChanged: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private savingAssignmentSetting: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private savingpermissions: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private savingTranscriptSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private savingTranscriptLogoSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private savingchatTimeoutsSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private savingGreetingMessage: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private savingbotGreetingMessage: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public savingConversationTagList: BehaviorSubject<boolean> = new BehaviorSubject(false);
    //public allowedTagList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

    constructor(private _authService: AuthService,
        private _socketService: SocketService,
        private _adminSettingsService: AdminSettingsService) {
        // console.log('ChatSettings Service!');

        this.subscriptions.push(_authService.getAgent().subscribe(agent => {
            this.agent = agent;
        }));

        this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            if (socket) {
                this.socket = socket;
                this.getChattSettingsFromBackend();
            }
        }));


        this.subscriptions.push(_adminSettingsService.getSettingsStatus().subscribe(status => {
            this.settingsChanged.next(status);
        }));

        this.chatSettings.next(JSON.parse(localStorage.getItem('chatSettings')));


    }

    public getChattSettingsFromBackend() {
        // if (this.agent.role == 'admin' || this.agent.role == 'superadmin') {
        //     this.socket.emit('getChatSettings', {}, (response) => {
        //         localStorage.setItem('chatSettings', JSON.stringify(response.data));
        //         this.chatSettings.next(response.data);
        //     });
        // }
       // console.log('Get chat settings');

        this.socket.emit('getChatSettings', {}, (response) => {
            localStorage.setItem('chatSettings', JSON.stringify(response.data));
            this.chatSettings.next(response.data);
        });
    }

    public getChattSettings(): Observable<any> {
        return this.chatSettings.asObservable();
    }
    public getSettingsChangedStatus(): Observable<any> {
        return this.settingsChanged.asObservable();
    }


    public setNSPChatSettings(settings: any, settingsName: string): Observable<any> {
        this.SavingSettings(settingsName)
        return new Observable((observer) => {
            this.socket.emit('updateNSPChatSettings', { settings, settingsName }, (response) => {
                this.SavedSettings(settingsName);
                //console.log(response);
                if (response.status == 'ok') {

                    this.chatSettings.getValue()[settingsName] = settings;
                    this.chatSettings.next(this.chatSettings.getValue());
                    localStorage.setItem('chatSettings', JSON.stringify(this.chatSettings.getValue()))
                }
                observer.next(response);
                observer.complete();
            });
        });
    }


    //#region Saving Settings Helpers

    public getSavingStatus(type: string): Observable<any> {
        switch (type) {
            case 'assignments':
                return this.savingAssignmentSetting.asObservable();
            case 'permissions':
                return this.savingpermissions.asObservable();
            case 'inactivityTimeouts':
                return this.savingchatTimeoutsSettings.asObservable();
            case 'transcriptForwarding':
                return this.savingTranscriptSettings.asObservable();
            case 'transcriptLogo':
                return this.savingTranscriptLogoSettings.asObservable();
            case 'greetingMessage':
                return this.savingGreetingMessage.asObservable();
            case 'botGreetingMessage':
                return this.savingbotGreetingMessage.asObservable();
            case 'tagList':
                return this.savingConversationTagList.asObservable();
        }
    }

    SavingSettings(settingsName: string) {
        switch (settingsName) {
            case 'assignments':
                this.savingAssignmentSetting.next(true);
                break;
            case 'permissions':
                this.savingpermissions.next(true);
                break;
            case 'inactivityTimeouts':
                this.savingchatTimeoutsSettings.next(true);
                break;
            case 'transcriptForwarding':
                this.savingTranscriptSettings.next(true);
                break;
            case 'transcriptLogo':
                this.savingTranscriptLogoSettings.next(true);
                break;
            case 'greetingMessage':
                this.savingGreetingMessage.next(true);
                break;
            case 'botGreetingMessage':
                this.savingbotGreetingMessage.next(true);
                break;
            case 'tagList':
                this.savingConversationTagList.next(true);
                break;
        }
    }

    SavedSettings(settingsName: string) {
        switch (settingsName) {
            case 'assignments':
                this.savingAssignmentSetting.next(false);
                break;
            case 'permissions':
                this.savingpermissions.next(false);
                break;
            case 'inactivityTimeouts':
                this.savingchatTimeoutsSettings.next(false);
                break;
            case 'transcriptForwarding':
                this.savingTranscriptSettings.next(false);
                break;
            case 'transcriptLogo':
                this.savingTranscriptLogoSettings.next(false);
                break;
            case 'greetingMessage':
                this.savingGreetingMessage.next(false);
                break;
            case 'botGreetingMessage':
                this.savingbotGreetingMessage.next(false);
                break;
        }
    }

    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }
    //#endregion

    // public Destroy() {
    //     this.subscriptions.forEach(subscription => {
    //         subscription.unsubscribe();
    //     });
    // }
}