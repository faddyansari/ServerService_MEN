import { environment } from '../environments/environment'
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, QueryEncoder } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/observable/throw'

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/switchMap';

import { GlobalStateService } from './GlobalStateService';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { RolesAndPermissionsService } from './RolesAndPermissionsService';

@Injectable()
export class AuthService {

    private production = environment.production;
    private redirectURI = environment.redirectURI;
    //private redirectURI=''

    private mediaServiceURL = environment.mediaService;
    private analyticsServiceURL = environment.analyticsURI;
    private analyticsPythonServiceURL = environment.analyticsPythonURI;
    private archiveURI = environment.archiveURI;


    //For Development Local

    private server = environment.server;
    private socketServer = environment.socketServer;
    private helpWindowAddress = environment.helpWindowAddress;
    private helpFrameUrl = environment.helpFrameURL;
    private LoadscriptCallDomain = environment.LoadscriptCallDomain
    private botServiceAddress = environment.botURL;
    private restServiceURL = environment.restServer;
    private whatsAppSrviceURl = environment.wappServer;
    private FBMicroserviceURI = environment.FBMicroserviceURI;

    // For Local
    // private server = 'http://192.168.20.90:8000';
    // private socketServer = 'http://192.168.20.90:8000';

    // For Development
    // private server = 'https://dev.bizzchats.com';
    // private socketServer = 'https://dev.bizzchats.com';

    // For Production NEW
    // private server = '';
    // private socketServer = 'https://live.beelinks.solutions';
    // private helpWindowAddress = 'https://app.beelinks.solutions';
    // private helpFrameUrl = 'https://app.beelinks.solutions/cbam/html/popup-frame.html';
    // private LoadscriptCallDomain = 'beelinks.solutions'



    //For Local Live
    // private server = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000';
    // private socketServer = 'https://live.beelinks.solutions';
    // private helpWindowAddress = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000';
    // private helpFrameUrl = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000/cbam/html/popup-frame.html';
    // private LoadscriptCallDomain = 'beelinks.solutions'


    //For Local Live
    // private server = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000';
    // private socketServer = 'https://live.beelinks.solutions';
    // private helpWindowAddress = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000';
    // private helpFrameUrl = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000/cbam/html/popup-frame.html';
    // private LoadscriptCallDomain = 'beelinks.solutions'

    // For Production OLD
    // private server = '';
    // private socketServer = 'https://live.bizzchats.com';

    public Agent: BehaviorSubject<any> = new BehaviorSubject<any>({});
    private isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private groups: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    private url: BehaviorSubject<string> = new BehaviorSubject(this.server);
    // private agentServerURL: BehaviorSubject<string> = new BehaviorSubject(this.agentServer);
    private socketAddress: BehaviorSubject<string> = new BehaviorSubject(this.socketServer);
    private requesting: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private settings: BehaviorSubject<any> = new BehaviorSubject({});
    private RedirectUI: BehaviorSubject<string> = new BehaviorSubject(this.redirectURI);
    private Notification: Subject<any> = new Subject();
    private MediaServiceURL: BehaviorSubject<string> = new BehaviorSubject(this.mediaServiceURL);
    public botServiceURL: BehaviorSubject<string> = new BehaviorSubject(this.botServiceAddress);
    public RestServiceURL: BehaviorSubject<string> = new BehaviorSubject(this.restServiceURL);
    public WhatsAppAserviceURL: BehaviorSubject<string> = new BehaviorSubject(this.whatsAppSrviceURl);
    public analyticsURL: BehaviorSubject<string> = new BehaviorSubject(this.analyticsServiceURL);
    public archiveURL: BehaviorSubject<string> = new BehaviorSubject(this.archiveURI);
    public analyticsPythonURL: BehaviorSubject<string> = new BehaviorSubject(this.analyticsPythonServiceURL);
    public helpWindowURL: BehaviorSubject<string> = new BehaviorSubject(this.helpWindowAddress);
    public helpWindowFrameURL: BehaviorSubject<string> = new BehaviorSubject(this.helpFrameUrl);
    public loadscriptDomain: BehaviorSubject<string> = new BehaviorSubject(this.LoadscriptCallDomain);
    public Production: BehaviorSubject<boolean> = new BehaviorSubject(this.production);
    public permissions: BehaviorSubject<any> = new BehaviorSubject({});
    public SBT: BehaviorSubject<boolean> = new BehaviorSubject(environment.sbt);
    public showAuthCode: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public FacebookRestUrl: BehaviorSubject<string> = new BehaviorSubject(this.FBMicroserviceURI);
    public packageInfo : BehaviorSubject<any> = new BehaviorSubject(undefined);


    incorrect = false;
    tabID = undefined;
    // private AdminSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);

    constructor(
        private http: Http,
        private _router: Router,
        private _globalApplicationStateService: GlobalStateService,
        public dialog: MatDialog
    ) {
        console.log('Authentication Service Initialized');

    }

    public getServer(): Observable<string> {
        return this.url.asObservable();
    }
    // public getAgentServer(): Observable<string> {
    //     return this.agentServerURL.asObservable();
    // }

    public getSocketServer(): Observable<string> {
        return this.socketAddress.asObservable();
    }

    public GetRedirectionURI() {
        return this.RedirectUI.asObservable();
    }

    public GetMediaServiceURI() {
        return this.MediaServiceURL.asObservable();
    }

    public CheckLogin() {

        let agent = JSON.parse(localStorage.getItem('currentUser')) || {}
        // let settings = JSON.parse(localStorage.getItem('settings')) || {}

        if (Object.keys(agent).length > 0) {
            this.requesting.next(true);

            this.http.post(this.restServiceURL + '/agent/authenticate', { csid: agent.csid }, { withCredentials: true }).subscribe(data => {
                agent.callingState = data.json();
                if (data.status == 200) {
                    this.requesting.next(false);
                    this.Agent.next(agent);
                    // console.log(this.Agent.getValue());
                    this.getSettingsFromBackendObservable(agent.email, agent.nsp).subscribe(response => {
                        // if (settings.applicationSettings) {
                        //     if ((settings.applicationSettings as Object).hasOwnProperty('acceptingChatMode')) {
                        //         settings.applicationSettings.acceptingChatMode =
                        //         localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));
                        //     }
                        // }
                        // this.settings.next(settings);
                        this._globalApplicationStateService.setRouteAccess();
                        this._globalApplicationStateService.setContactRouteAccess(this.Agent.getValue().nsp);
                        this.isLogin.next(true);
                        this._globalApplicationStateService.setDisplayReady(true);
                    });

                    // this._globalApplicationStateService.setContactRouteAccess(this.Agent.getValue().nsp);
                    // this.isLogin.next(true);
                    // this._globalApplicationStateService.setDisplayReady(true);
                } else {
                    this.logout();
                    this.isLogin.next(false);
                    this.requesting.next(false);
                    this._globalApplicationStateService.setDisplayReady(true);
                }
            }, err => {
                // console.log('Logout');
                this.requesting.next(false);
                this.logout();
                this.isLogin.next(false);
                if (!this.production) this._globalApplicationStateService.setDisplayReady(true);
                else window.location.href = this.redirectURI;
            });
        } else {
            if (!this.production) this._globalApplicationStateService.setDisplayReady(true);
            else window.location.href = this.redirectURI;
        }
    }

    public login(email, password) {

        let urlSearchParams = new URLSearchParams('', new QueryEncoder());
        urlSearchParams.append('email', encodeURIComponent(email));
        urlSearchParams.append('password', encodeURIComponent(password));
        this.requesting.next(true);

        return this.http.post(this.restServiceURL + "/agent/getUser/", urlSearchParams, {
            withCredentials: true,
        }).subscribe(data => {
            //console.log('Agent Get User');
            // console.log(JSON.parse(data.text())[0]);
            if (data.status == 203) {
                this.showAuthCode.next(true);
                this.requesting.next(false);
            } else {
                this.Agent.next(JSON.parse(data.text())[0]);
                // console.log(this.Agent.getValue());

                // this.isLogin.next(true);
                localStorage.setItem('currentUser', JSON.stringify(this.Agent.getValue()));
                //console.log('Getting Settings');
                // this.getSettingsFromBackend(this.Agent.getValue().email, this.Agent.getValue().nsp);
                // this._globalApplicationStateService.setContactRouteAccess(this.Agent.getValue().nsp);

                this.getSettingsFromBackendObservable(this.Agent.getValue().email, this.Agent.getValue().nsp).subscribe(response => {
                    this._globalApplicationStateService.setRouteAccess();
                    this._globalApplicationStateService.setContactRouteAccess(this.Agent.getValue().nsp);
                    let redirection = localStorage.getItem('redirectURL');
                    this.requesting.next(false);
                    this.isLogin.next(true);
                    this._globalApplicationStateService.setDisplayReady(true);

                    if (redirection) {
                        setTimeout(() => {
                            // console.log(redirection);
                            this._globalApplicationStateService.NavigateTo(redirection);
                        }, 1000);
                        // localStorage.removeItem('redirectURL');
                    }
                });
            }

        }, err => {
            //console.log(err.json());
            this.requesting.next(false);
            if (err.json().status == 'loggedin') {
                this.setNotification('Already logged on other devices', 'error', 'warning');
                setTimeout(() => { this.CheckLogin(); /** this.dialog.closeAll(); */ }, 2000);
            } else if (err.json().status == 'incorrectcredintials') {
                this.incorrect = true;
                this.setNotification('Please Provide A Valid Email or Password', 'error', 'warning');
            } else if (err.json().status == 'unauthorized') {
                console.log('Unauthorized');

                this.setNotification('Unauthorized!', 'error', 'warning');
            }
            return Observable.throw(err.json());
        });
    }

    public SubmitAccessCode(code) {

        let urlSearchParams = new URLSearchParams('', new QueryEncoder());
        urlSearchParams.append('code', encodeURIComponent(code));
        this.requesting.next(true);
        // console.log(code)
        return this.http.post(this.restServiceURL + "/agent/validateCode/", urlSearchParams, {
            withCredentials: true,
        }).subscribe(data => {
            // console.log(data)
            //console.log('Agent Get User');
            // console.log(JSON.parse(data.text())[0]);
            if (data.status == 203) {
                this.showAuthCode.next(true);
            } else {
                this.Agent.next(JSON.parse(data.text())[0]);
                // console.log(this.Agent.getValue());

                // this.isLogin.next(true);
                localStorage.setItem('currentUser', JSON.stringify(this.Agent.getValue()));
                //console.log('Getting Settings');
                // this.getSettingsFromBackend(this.Agent.getValue().email, this.Agent.getValue().nsp);
                // this._globalApplicationStateService.setContactRouteAccess(this.Agent.getValue().nsp);

                this.getSettingsFromBackendObservable(this.Agent.getValue().email, this.Agent.getValue().nsp).subscribe(response => {
                    this._globalApplicationStateService.setRouteAccess();
                    this._globalApplicationStateService.setContactRouteAccess(this.Agent.getValue().nsp);
                    let redirection = localStorage.getItem('redirectURL');
                    this.requesting.next(false);
                    this.isLogin.next(true);
                    this._globalApplicationStateService.setDisplayReady(true);
                    this.showAuthCode.next(false);
                    if (redirection) {
                        setTimeout(() => {
                            // console.log(redirection);
                            this._globalApplicationStateService.NavigateTo(redirection);
                        }, 1000);
                        // localStorage.removeItem('redirectURL');
                    }
                });
            }

        }, err => {
            //console.log(err.json());
            this.requesting.next(false);
            if (err.json().status == 'loggedin') {
                this.setNotification('Already logged on other devices', 'error', 'warning');
                setTimeout(() => { this.CheckLogin(); /** this.dialog.closeAll(); */ }, 2000);
            } else if (err.json().status == 'invalidCode') {
                this.incorrect = true;
                this.setNotification('Please enter a valid code', 'error', 'warning');
            } else if (err.json().status == 'unauthorized') {
                console.log('Unauthorized');

                this.setNotification('Unauthorized!', 'error', 'warning');
            }
            return Observable.throw(err.json());
        });
    }

    public otpLogin(email, otp) {

    }

    public isForgotPasswordEnabled(email) : Observable<any>{
        let urlSearchParams = new URLSearchParams('', new QueryEncoder());
        urlSearchParams.append('email', encodeURIComponent(email));
        return new Observable((observer) => {
            this.http.post(this.restServiceURL + "/agent/checkForgotPassword", urlSearchParams, {
                withCredentials: true,
            }).subscribe(data => {
                if(data.status == 200){
                    observer.next(true);
                    observer.complete();
                }else{
                    observer.next(false);
                    observer.complete();
                }
            }, err => {
                observer.next(false);
                observer.complete();
            })
        });
    }

    /**
     * @Note
     * On Logout Clear Storage added even on Error (Enhancement after multiple device Logins)
     */

    public logout() {

        this.requesting.next(true);
        this.http.post(this.restServiceURL + '/agent/logout/', { csid: this.Agent.getValue().csid || JSON.parse(localStorage.getItem('currentUser')).csid }, { withCredentials: true }).subscribe(data => {

            this.requesting.next(false);
            // console.log('Logged Out');
            // console.log(data);
            this.Agent.next({});
            localStorage.removeItem('currentUser');
            localStorage.removeItem('settings');
            localStorage.removeItem('chatSettings');
            localStorage.removeItem('aEng');
            localStorage.removeItem('fileSharing');
            localStorage.removeItem('chatBotCases');
            localStorage.removeItem('chatBotMachines');
            localStorage.removeItem('chatBotWorkFlows');
            localStorage.removeItem('callSettings');
            localStorage.removeItem('widgetMarketingSettings');
            localStorage.removeItem('redirectURL');
            localStorage.removeItem('ticketFilters');
            localStorage.removeItem('analytics-agentactivity');
            localStorage.removeItem('analytics-agentscorecard');
            //localStorage.removeItem('logout');
            if (!this.production) {
                this._globalApplicationStateService.setDisplayReady(true);
                this.isLogin.next(false);

            }
            else {
                this.isLogin.next(false);
                this._globalApplicationStateService.setDisplayReady(false);
                this._globalApplicationStateService.setState('blank');
                setTimeout(() => { window.location.href = this.redirectURI; }, 2000);
            }
            window.postMessage({ type: 'login', value: false }, "*");

        }, err => {
            this.requesting.next(false);

            this.Agent.next({});
            localStorage.removeItem('currentUser');
            localStorage.removeItem('settings');
            localStorage.removeItem('chatSettings');
            localStorage.removeItem('aEng');
            localStorage.removeItem('fileSharing');
            localStorage.removeItem('chatBotCases');
            localStorage.removeItem('chatBotMachines');
            localStorage.removeItem('chatBotWorkFlows');
            localStorage.removeItem('callSettings');
            localStorage.removeItem('widgetMarketingSettings');
            //localStorage.removeItem('logout');
            if (!this.production) {
                this._globalApplicationStateService.setDisplayReady(true);
                this.isLogin.next(false);

            }
            else {
                this.isLogin.next(false);
                this._globalApplicationStateService.setDisplayReady(false);
                this._globalApplicationStateService.setState('blank');
                setTimeout(() => { window.location.href = this.redirectURI; }, 2000);
            }
            window.postMessage({ type: 'login', value: false }, "*");
        });
    }

    public getSettingsFromBackend(email: string, nsp: string) {

        this.http.post(this.restServiceURL + '/agent/getSettings', { email: email, nsp: nsp }, { withCredentials: true }).subscribe(data => {
            // console.log('Got Settings');
            // console.log(JSON.parse(data.text()));

            let savedSettings = JSON.parse(data.text());
            if (!savedSettings.applicationSettings) {
                savedSettings.applicationSettings = { acceptingChatMode: true };
            }
            this.permissions.next(savedSettings.permissions);
            let permissions = savedSettings.permissions[this.Agent.getValue().role];
            savedSettings.permissions = permissions;
            this.settings.next(savedSettings);
            localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));

            window.postMessage({ type: 'login', value: true }, "*");
        }, err => {  /** console.log('Can Not Get Settings'); */ })
    }

    public getSettingsFromBackendObservable(email: string, nsp: string): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.restServiceURL + '/agent/getSettings', { email: email, nsp: nsp }, { withCredentials: true }).subscribe(data => {
                // console.log('Got Settings');
                // console.log(JSON.parse(data.text()));

                let savedSettings = JSON.parse(data.text());
                // console.log(data.text());
                // let oldSettings = JSON.parse(localStorage.getItem('settings'));
                if (savedSettings && savedSettings.applicationSettings) {
                    savedSettings.applicationSettings = { acceptingChatMode: savedSettings.applicationSettings.acceptingChatMode };
                } else {
                    if (!savedSettings.applicationSettings) {
                        savedSettings.applicationSettings = { acceptingChatMode: true };
                    }
                }

                this.permissions.next(savedSettings.permissions);
                this.packageInfo.next(savedSettings.package);
                let permissions = savedSettings.permissions[this.Agent.getValue().role];
                if (this.Agent.getValue().role == 'superadmin') {
                    permissions.authentication = savedSettings.authentication;

                }
                delete savedSettings.authentication;
                delete savedSettings.package;
                savedSettings.permissions = permissions;
                this.settings.next(savedSettings);
                localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));
                // console.log(this.settings.getValue())
                window.postMessage({ type: 'login', value: true }, "*");
                observer.next(true);
                observer.complete();
            })
        })
    }

    public getSettings() {
        return this.settings.asObservable();
    }
    public getPackageInfo() {
        return this.packageInfo.asObservable();
    }

    public updateAutomatedMessages(hashTag, responseText) {

        this.settings.getValue().automatedMessages.push({ hashTag: hashTag, responseText: responseText });

        this.settings.next(this.settings.getValue());

        localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));
    }

    public EditupdateAutomatedMessages(hashTag, responseText) {

        this.settings.getValue().automatedMessages.map(automatedMessage => {
            if (automatedMessage.hashTag == hashTag) { automatedMessage.responseText = responseText; }
        })

        this.settings.next(this.settings.getValue());

        localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));
    }

    public DeleteAutomatedMessage(hashTag) {
        this.settings.getValue().automatedMessages = this.settings.getValue().automatedMessages.filter(automatedMessage => {
            if (automatedMessage.hashTag != hashTag) { return automatedMessage }
        });

        this.settings.next(this.settings.getValue());

        localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));
    }

    public getRequestState() {
        return this.requesting.asObservable();
    }


    public setRequestState(state: boolean) {
        return this.requesting.next(state);
    }

    public getAgent(): Observable<any> {
        return this.Agent.asObservable();
    }

    public isLoggedin() {
        return this.isLogin.asObservable();
    }

    public RenewSession(session) {
        this.Agent.getValue().loginsession = session;
        localStorage.setItem('currentUser', JSON.stringify(this.Agent.getValue()));
    }

    public getGroups() {
        return this.groups.asObservable();
    }

    public RegisterAgent(agentProfile): Observable<any> {
        // console.log('Register Agent Client');
        return this.http.post(this.restServiceURL + '/agent/registerAgent/', { agent: agentProfile })
            .delay(1500)
            .map((response) => { return response.json(); })
            .catch(err => { return Observable.throw(err.json()) });
    }

    public CreateContact(contactProfile): Observable<any> {
        // console.log('Create Contact');
        return this.http.post(this.restServiceURL + '/contact/createContact/', { contact: contactProfile })
            .delay(1500)
            .map((response) => { response.json(); })
            .catch(err => { return Observable.throw(err.json()) });
    }

    public UpdateSelectedAgent(agentProperties) {
        let agent = this.Agent.getValue();
        agent.first_name = agentProperties.first_name;
        agent.last_name = agentProperties.last_name;
        agent.nickname = agentProperties.nickname;
        agent.phone_no = agentProperties.phone_no;
        agent.role = agentProperties.role;
        this.Agent.next(agent);
        localStorage.setItem('currentUser', JSON.stringify(this.Agent.getValue()));
    }




    public ValidateEmail(email: string): Observable<any> {
        return this.http.post(this.restServiceURL + '/agent/validate/', { email: email })
            .map((response) => { response.json() })
            .catch(err => { return Observable.throw(err.json()) })
            .debounceTime(3000);

    }

    public ValidateWebsite(url: string): Observable<any> {
        return this.http.post(this.restServiceURL + '/register/validateURL/', { url: url })
            .map((response) => { this.requesting.next(false); response.json() })
            .catch(err => { this.requesting.next(false); return Observable.throw(err.json()) })
            .debounceTime(3000);

    }

    public getNotification() {
        return this.Notification.asObservable();
    }

    public setNotification(notifcationMessage: string, type: string, icon: string) {
        let notification = {
            msg: notifcationMessage,
            type: type,
            img: icon
        }
        this.Notification.next(notification);
    }

    //#region Application Settings Functions
    public setAcceptingChatMode(acceptingChatMode: boolean) {

        let settings = JSON.parse(localStorage.getItem('settings'));
        settings.applicationSettings.acceptingChatMode = acceptingChatMode;
        localStorage.setItem('settings', JSON.stringify(settings));
        this.settings.next(settings);
        // console.log(this.settings.getValue());
    }

    public UpdateAgentPermissions(permissions) {
        let settings = JSON.parse(localStorage.getItem('settings'));
        settings.permissions = permissions[this.Agent.getValue().role];
        localStorage.setItem('settings', JSON.stringify(settings));
        this.settings.next(settings);
        this.permissions.next(permissions);
        // console.log(this.settings.getValue().permissions);
    }
    public UpdateAuthPermissions(permission) {
        if (this.Agent.getValue().role == 'superadmin') {
            let settings = JSON.parse(localStorage.getItem('settings'));
            settings.permissions.authentication = permission;
            localStorage.setItem('settings', JSON.stringify(settings));
            this.settings.next(settings);
        }
        // console.log(this.settings.getValue().permissions);
    }
    public UpdateNotifPermissions(permissions) {
        let settings = JSON.parse(localStorage.getItem('settings'));
        settings.windowNotifications = permissions;
        localStorage.setItem('settings', JSON.stringify(settings));
        this.settings.next(settings);
        // console.log(this.settings.getValue().permissions);
    }


    public updateAgentProfileImage(url) {
        this.Agent.getValue().image = url;
        localStorage.setItem('currentUser', JSON.stringify(this.Agent.getValue()));
        this.Agent.next(this.Agent.getValue());
        // console.log(this.settings.getValue());
    }



    //#endregion


    //#region Admins Settings

    // public gotAdminSettings(settings: any): any {
    //   localStorage.setItem('adminSettings', JSON.stringify(settings));
    //   this.AdminSettings.next(settings);
    // }

    // public getAdminSettings() {
    //   return this.AdminSettings.asObservable();
    // }
    //#endregion

}