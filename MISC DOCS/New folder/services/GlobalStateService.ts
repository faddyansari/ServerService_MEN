import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


//RxJs Imports
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationStart } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
//End RxJs Imports

@Injectable()

export class GlobalStateService {

    sbt = true;
    titleString = (this.sbt) ? 'SBT | Live Chat Platform' : 'Beelinks | Innovative Live Chat Platform';
    currentRoute: BehaviorSubject<string> = new BehaviorSubject('');
    agentModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
    state: BehaviorSubject<string> = new BehaviorSubject('login');
    sidebarState: BehaviorSubject<boolean> = new BehaviorSubject(true);
    navbarState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    navbarState_exit: BehaviorSubject<boolean> = new BehaviorSubject(false);
    controlSidebarState: BehaviorSubject<boolean> = new BehaviorSubject(true);
    title: BehaviorSubject<string> = new BehaviorSubject((this.sbt) ? 'SBT | Live Chat Platform' : 'Beelinks | Innovative Live Chat Platform');
    windowFocused: BehaviorSubject<boolean> = new BehaviorSubject(false);
    showNotification: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessTicketView: BehaviorSubject<boolean> = new BehaviorSubject(false);
    displayReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    ismobile: BehaviorSubject<boolean> = new BehaviorSubject(false);
    copyrightYear: BehaviorSubject<string> = new BehaviorSubject((new Date).getFullYear().toString());
    drawerActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
    drawerActive_exit: BehaviorSubject<boolean> = new BehaviorSubject(false);
    navbarSidebar_state: BehaviorSubject<boolean> = new BehaviorSubject(false);
    accessRoute: BehaviorSubject<string> = new BehaviorSubject('');
    accessSet: BehaviorSubject<boolean> = new BehaviorSubject(false);
    showChatBar: BehaviorSubject<boolean> = new BehaviorSubject(false);
    chatBarEnabled: BehaviorSubject<boolean> = new BehaviorSubject(true);

    loadingRouteConfig: BehaviorSubject<boolean> = new BehaviorSubject(false);
    loadingNestedRouteConfig: BehaviorSubject<boolean> = new BehaviorSubject(false);
    loadingRouteConfigEnabled = true;
    loadingNestedRouteConfigEnabled = true;

    //KeyBoard Shortcuts
    shortcutEvents: Subject<any> = new Subject();

    //Main Guards
    canAccessDashboard: BehaviorSubject<boolean> = new BehaviorSubject(true);
    canAccessChats: BehaviorSubject<boolean> = new BehaviorSubject(true);
    canAccessTickets: BehaviorSubject<boolean> = new BehaviorSubject(true);
    canAccessVisitors: BehaviorSubject<boolean> = new BehaviorSubject(true);
    canAccessSettings: BehaviorSubject<boolean> = new BehaviorSubject(true);
    canAccessAgents: BehaviorSubject<boolean> = new BehaviorSubject(true);
    canAccessAnalytics: BehaviorSubject<boolean> = new BehaviorSubject(true);
    canAccessContacts: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessInstallation: BehaviorSubject<boolean> = new BehaviorSubject(true);
    canAccessCRM: BehaviorSubject<boolean> = new BehaviorSubject(true);
    canAccessPageNotFound: BehaviorSubject<boolean> = new BehaviorSubject(false);

    //Settings Guards
    canAccessAllSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessAutomatedResponses: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessFormDesigner: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessTicketManagementSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessTemplateDesignSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessChatAndTimeoutSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessContactSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessCallSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessChatWindowSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessChatAssistantSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessWebhookSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessKnowledgeBaseSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessWidgetMarketingSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessIntegerationsSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessGroupManagementSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessKeyboardShortcutsSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessProfileSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    canAccessWhatsApp: BehaviorSubject<boolean> = new BehaviorSubject(true);
    // canAccessBulkMarketingEmail: BehaviorSubject<boolean> = new BehaviorSubject(false);
    contentInfo: BehaviorSubject<string> = new BehaviorSubject('');
    breadCrumbTitle: BehaviorSubject<string> = new BehaviorSubject('');
    showSettingsMenu: BehaviorSubject<boolean> = new BehaviorSubject(false);
    showPopper: BehaviorSubject<boolean> = new BehaviorSubject(false);
    settingsSelectedRoute: BehaviorSubject<string> = new BehaviorSubject('general');
    redirectURL: BehaviorSubject<string> = new BehaviorSubject('');

    requestQue: Subject<boolean> = new Subject();


    //resize Event
    resizeEvent: Subject<boolean> = new Subject();

    //ThreadSelection
    selectingThread: Subject<boolean> = new Subject();

    // breadCrumbLink: BehaviorSubject<string> = new BehaviorSubject('');
    // Subscribing Observable of Router event of NavigationStart
    // Upon New Subscription assigning New value to Current Route Behaviour
    // This BheaviourSubject will be Subscribed to any component via shared Observable Service to take action upon
    constructor(private http: Http, private _router: Router, private _titleService: Title) {

        _router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => {
                this.currentRoute.next(event.url);
            });
        _router.events
            .filter(event => event instanceof NavigationStart)
            .subscribe((event: NavigationStart) => {
                // console.log(event.url);
                if (event.url != '/') {
                    localStorage.setItem('redirectURL', event.url);
                }
                this.accessRoute.next(event.url);
                // this.currentRoute.next(event.url);
                // console.log(event.url.match(/\//g).length > 1);
                if (event.url && event.url.match(/\//g).length > 1) {
                    this.loadingNestedRouteConfigEnabled = true;
                    this.loadingRouteConfigEnabled = false;
                } else if (event.url && event.url.match(/\//g).length == 1) {
                    this.loadingRouteConfigEnabled = true;
                    this.loadingNestedRouteConfigEnabled = false;
                }
                //   console.log(event.url);
            });
        _router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                // console.log('Route Config Start');

                // console.log(this.currentRoute.getValue());
                // console.log(this.currentRoute.getValue().match(/\//g).length);
                if (this.loadingNestedRouteConfigEnabled) {
                    this.loadingNestedRouteConfig.next(true);
                    this.loadingRouteConfig.next(false);
                }
                if (this.loadingRouteConfigEnabled) {
                    this.loadingRouteConfig.next(true);
                }
                // console.log(this.loadingNestedRouteConfig.getValue());


            } else if (event instanceof RouteConfigLoadEnd) {
                this.loadingRouteConfig.next(false);
                this.loadingNestedRouteConfig.next(false);
                // this.showSettingsMenu.next(false);
            }
        });


        this.ismobile.next((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1));

    }

    public getIsMobile(): Observable<any> {
        return this.ismobile.asObservable();
    }
    public getCopyrightYear(): Observable<string> {
        return this.copyrightYear.asObservable();
    }

    public isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };

    public getDisplayReady(): Observable<boolean> {
        return this.displayReady.asObservable();
    }

    public setDisplayReady(state: boolean) {
        this.displayReady.next(state);
    }

    public getRoute(): Observable<string> {
        return this.currentRoute.asObservable();
    }
    public showAgentModal(data) {
        this.agentModal.next(data);
    }

    public setState(data) {
        this.state.next(data);
    }

    public Successfull(route) {
        this.currentRoute.next(route);
    }

    public ToggleSideBarState() {
        this.sidebarState.next(!(this.sidebarState.getValue()));
    }
    public ToggleNavBarState() {
        this.navbarState.next(!(this.navbarState.getValue()));
        this.navbarState_exit.next(true);
    }

    public ToggleControlSideBarState() {
        this.controlSidebarState.next(!(this.controlSidebarState.getValue()));
    }
    public ToggleDrawer() {
        this.drawerActive.next(!(this.drawerActive.getValue()));
        this.drawerActive_exit.next(true);
    }

    public CloseControlSideBar() {
        this.controlSidebarState.next(true)
    }
    public OpenControlSideBar() {
        this.controlSidebarState.next(false);
    }

    public SetTitle(notificationCount: number) {
        if (notificationCount > 0) {
            this.title.next('(' + notificationCount + ') ' + this.titleString);
        } else {
            this.title.next(this.titleString);
        }

    }


    public getTitle() {
        return this.title.asObservable();
    }

    public getFocusedState() {
        return this.windowFocused.asObservable();
    }
    public setFocusedState(state: boolean) {
        this.windowFocused.next(state);
    }

    public getNotificationState() {
        return this.showNotification.asObservable();
    }
    public setNotificationState(state: boolean) {
        this.showNotification.next(state);
    }


    public setTicketViewAccess(permission: boolean) {
        this.canAccessTicketView.next(permission);
    }
    public getTicketViewAccess(): boolean {
        return this.canAccessTicketView.getValue();
    }

    public NavigateTo(route: string) {
        this._router.navigate([route]);
    }

    public NavigateForce(route: string) {
        this._router.navigateByUrl(route);
    }


    setPopper(value) {
        this.showPopper.next(value);
    }

    //Guards

    //Setters
    public setRouteAccess() {

        this.canAccessDashboard.next(true);
        this.canAccessChats.next(true);
        this.canAccessTickets.next(true);
        this.canAccessVisitors.next(true);
        this.canAccessSettings.next(true);
        this.canAccessAllSettings.next(true);
        this.canAccessAgents.next(true);
        this.canAccessInstallation.next(true);
        this.canAccessCRM.next(true);
        this.canAccessAnalytics.next(true);
        this.accessSet.next(true)
    }

    toggleSettingsMenu() {
        this.showSettingsMenu.next(!this.showSettingsMenu.getValue());
    }

    setSettingsMenu(value) {
        this.showSettingsMenu.next(value);
    }
    setSettingsSelectedRoute(value) {
        this.settingsSelectedRoute.next(value);
    }

    public setContactRouteAccess(nsp) {
        if (nsp == '/sps-uat' || nsp == '/hrm.sbtjapan.com' || nsp == '/localhost.com') {
            this.canAccessContacts.next(true);
        } else {
            this.canAccessContacts.next(false);
        }
    }

 
    toggleChatBar() {
        this.showChatBar.next(!this.showChatBar.getValue());
    }
    setChatBar(value) {
        this.showChatBar.next(value);
    }
    displayChatBar(value) {
        this.chatBarEnabled.next(value);
    }


    setSelectedThread(value) {
        this.shortcutEvents.next(value)
    }

    ResizeEvent(event) {
        if (event.target) {

            if ((event.target as Window).innerWidth <= 1024) {

                this.resizeEvent.next(false)

            }
            else if ((event.target as Window).innerWidth > 1024) {

                this.resizeEvent.next(true)
            }
            else this.resizeEvent.next(true)
        }
    }

    

    RequestQue() {
        this.requestQue.next(true)
    }

}
