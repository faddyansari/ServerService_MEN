import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SocketService } from "./SocketService";
import { AuthService } from "./AuthenticationService";
import { Subject } from "rxjs/Subject";






@Injectable()
export class AdminSettingsService {

    public socket: SocketIOClient.Socket;

    private aEng: BehaviorSubject<any> = new BehaviorSubject({});
    private settingsChanged: Subject<boolean> = new Subject();
    private fileSharingSettings: BehaviorSubject<any> = new BehaviorSubject({});
    public callSettings: BehaviorSubject<any> = new BehaviorSubject({});
    public contactSettings: BehaviorSubject<any> = new BehaviorSubject({});
    public widgetMarketingSettings: BehaviorSubject<any> = new BehaviorSubject({});
    public emailNotificationSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public windowNotificationSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public ticketSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);


    private agent: any;

    constructor(
        private _socketService: SocketService,
        private _authService: AuthService
    ) {
        //console.log('Admin Settings Service Initialized');
        _authService.getAgent().subscribe(agent => {
            this.agent = agent;
        });

        _socketService.getSocket().subscribe((data) => {
            if (data) {
                this.socket = data;
                this.getAdminSettingsFromBackend();

                this.socket.on('updateChatSettings', (data) => {
                    if (data.settingsName == 'assignments') {
                        this.setEngagementSettings(data.aEng);
                    } else if ('allowFileSharing') {
                        this.setFileSharingSettings(data.fileSharing)
                    }
                });
                this.socket.on('updateCallSettings', (data) => {
                    this.setCallingSettings(data.settings);
                });
                this.socket.on('updateContactSettings', (data) => {
                    this.setContactSettings(data.settings);
                });
                this.socket.on('updateWidgetMarketingSettings', (data) => {
                    this.setWidgetMarketingSettings(data.settings);
                });

                // if (this.agent.role == 'admin') {
                //     this.socket.on('settingsChanged', (data) => {
                //         console.log(data);
                //         this.settingsUpdated(data);
                //         this.settingsChanged.next(true);
                //     });
                // }
                this.socket.on('settingsChanged', (data) => {
                  //  console.log(data);
                    this.settingsUpdated(data);
                    this.settingsChanged.next(true);
                });
            }
        });
    }

    private getAdminSettingsFromBackend() {
        if (!localStorage.getItem('aEng') || !localStorage.getItem('fileSharing') || !localStorage.getItem('callSettings') || !localStorage.getItem('widgetMarketingSettings')) {
            this.socket.emit('getAdminSettings', {}, (data) => {
                // console.log(data);
                if (data.status == 'ok') {
                    localStorage.setItem('aEng', JSON.stringify(data.aEng));
                    localStorage.setItem('fileSharing', JSON.stringify(data.fileSharing));
                    localStorage.setItem('callSettings', JSON.stringify(data.callSettings));
                    localStorage.setItem('contactSettings', JSON.stringify(data.contactSettings));
                    localStorage.setItem('widgetMarketingSettings', JSON.stringify(data.widgetMarketingSettings));

                    this.aEng.next(data.aEng);
                    this.fileSharingSettings.next(data.fileSharing);
                    this.callSettings.next(data.callSettings);
                    this.contactSettings.next(data.contactSettings);
                    this.widgetMarketingSettings.next(data.widgetMarketingSettings);
                }
            });
        }
        else {
            this.aEng.next(JSON.parse(localStorage.getItem('aEng')));
            this.fileSharingSettings.next(JSON.parse(localStorage.getItem('fileSharing')));
            this.callSettings.next(JSON.parse(localStorage.getItem('callSettings')));
            this.contactSettings.next(JSON.parse(localStorage.getItem('contactSettings')));
            this.widgetMarketingSettings.next(JSON.parse(localStorage.getItem('widgetMarketingSettings')));
            this.emailNotificationSettings.next(JSON.parse(localStorage.getItem('emailNotifications')));
            this.windowNotificationSettings.next(JSON.parse(localStorage.getItem('windowNotifications')));
        }
    }

    public GetTicketSettings() {

        this.socket.emit('getTicketSettings', {}, (response) => {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
                //console.log(response);
                if (response.ticketSettings) this.ticketSettings.next(response.ticketSettings);
                else this.ticketSettings.next({ allowedAgentAvailable: true })
                // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
            }
        });

    }
    public GetEmailNotificationSettings() {

        this.socket.emit('getEmailNotificationSettings', {}, (response) => {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
               // console.log(response);
                if (response.emailNotifications) this.emailNotificationSettings.next(response.emailNotifications);
                // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
            }
        });

    }
    public GetWindowNotificationSettings() {

        this.socket.emit('getWindowNotificationSettings', {}, (response) => {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
              //  console.log(response);
                if (response.windowNotifications) this.windowNotificationSettings.next(response.windowNotifications);
                // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
            }
        });

    }



    public SetTicketSettings(data): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('setTicketSettings', data, (response) => {
                //console.log(response.groups[0].rooms);
                if (response.status == 'ok') {
                    this.ticketSettings.next(data);
                    observer.next(response);
                    observer.complete();
                    // console.log(response);
                    // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
                } else {
                    observer.error();
                }
            })
        })


    }


    public SetEmailNotificationSettings(settingsName, settings): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('setEmailNotificationSettings', {settingsName:settingsName,settings:settings}, (response) => {
                //console.log(response.groups[0].rooms);
                if (response.status == 'ok') {
                    this.emailNotificationSettings.getValue()[settingsName] = settings;
                    this.emailNotificationSettings.next(this.emailNotificationSettings.getValue());
                    observer.next(response);
                    observer.complete();
                    // console.log(response);
                    // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
                } else {
                    observer.error();
                }
            })
        })


    }
    public SetWindowNotificationSettings(settings): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('setWindowNotificationSettings', {settings:settings}, (response) => {
                //console.log(response.groups[0].rooms);
                if (response.status == 'ok') {
                    this.windowNotificationSettings.next(settings);
                    observer.next(response);
                    observer.complete();
                    // console.log(response);
                    // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
                } else {
                    observer.error();
                }
            })
        })


    }



    public getEngagementSettings(): Observable<any> {
        return this.aEng.asObservable();
    }

    public setEngagementSettings(value) {
        localStorage.setItem('aEng', value);
        this.aEng.next(value);
    }

    public getFileSharingSettings(): Observable<any> {
        return this.fileSharingSettings.asObservable();
    }

    public setFileSharingSettings(value) {
        localStorage.setItem('fileSharing', value);
        this.fileSharingSettings.next(value);
    }
    public setCallingSettings(value) {
        localStorage.setItem('callSettings', JSON.stringify(value));
        this.callSettings.next(value);
    }
    public setContactSettings(value) {
        localStorage.setItem('contactSettings', JSON.stringify(value));
        this.contactSettings.next(value);
    }
    public setWidgetMarketingSettings(value) {
        localStorage.setItem('widgetMarketingSettings', JSON.stringify(value));
        this.widgetMarketingSettings.next(value);
    }



    public settingsUpdated(value) {
        switch (value.settingsName) {
            case 'chatSettings':
                if (localStorage.getItem('chatSettings')) {
                    let settings = JSON.parse(localStorage.getItem('chatSettings'));
                    settings[value.settingsName] = value.settings;
                    localStorage.setItem('chatSettings', JSON.stringify(settings));
                    this.settingsChanged.next(true);
                }
                break;
            case 'callSettings':
                if (localStorage.getItem('callSettings')) {
                    let settings = JSON.parse(localStorage.getItem('callSettings'));
                    settings = value.settings;
                    localStorage.setItem('callSettings', JSON.stringify(settings));
                    this.settingsChanged.next(true);
                    this.callSettings.next(value.settings);
                }
                break;
            case 'contactSettings':
                if (localStorage.getItem('contactSettings')) {
                    let settings = JSON.parse(localStorage.getItem('contactSettings'));
                    settings = value.settings;
                    localStorage.setItem('contactSettings', JSON.stringify(settings));
                    this.settingsChanged.next(true);
                    this.contactSettings.next(value.settings);
                }
                break;
            case 'widgetMarketingSettings':
                if (localStorage.getItem('widgetMarketingSettings')) {
                    let settings = JSON.parse(localStorage.getItem('widgetMarketingSettings'));
                    settings = value.settings;
                    localStorage.setItem('widgetMarketingSettings', JSON.stringify(settings));
                    this.settingsChanged.next(true);
                    this.widgetMarketingSettings.next(value.settings);
                }
                break
        }
    }

    public setNSPCallSettings(settings: any): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('updateNSPCallSettings', { settings: settings }, (response) => {
                if (response.status == 'ok') {

                    this.callSettings.next(settings);
                    localStorage.setItem('callSettings', JSON.stringify(this.callSettings.getValue()))
                }
                observer.next(response);
                observer.complete();
            });
        });
    }
    public setNSPContactSettings(type, settings: any): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('updateNSPContactSettings', { type: type, settings: settings }, (response) => {
                if (response.status == 'ok') {
                    this.contactSettings.next(response.settings);
                    localStorage.setItem('contactSettings', JSON.stringify(this.contactSettings.getValue()))
                }
                observer.next(response);
                observer.complete();
            });
        });
    }
    public setNSPWMSettings(settings: any): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('updateNSPWMSettings', { settings: settings }, (response) => {
                if (response.status == 'ok') {

                    this.widgetMarketingSettings.next(settings);
                    localStorage.setItem('widgetMarketingSettings', JSON.stringify(this.widgetMarketingSettings.getValue()))
                }
                observer.next(response);
                observer.complete();
            });
        });
    }


    public getSettingsStatus(): Observable<boolean> {
        return this.settingsChanged.asObservable();
    }

}