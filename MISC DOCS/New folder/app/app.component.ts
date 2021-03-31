//Angular Import
import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

//Services Import
import { GlobalStateService } from '../services/GlobalStateService';
import { AuthService } from '../services/AuthenticationService';
import { Title } from '@angular/platform-browser';
import * as Highcharts from 'highcharts/highcharts';
import * as Highmaps from 'highcharts/highmaps';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {

    Highcharts = Highcharts;
    tabID: string = undefined;
    navbarSidebar_state: boolean = true;

    //#region Global Events
    @HostListener('document:keydown', ['$event'])
    onKeydownHandler(event: KeyboardEvent) {
        if (event.ctrlKey == true) {
            // 107 Num Key  +
            // 109 Num Key  -
            // 173 Min Key  hyphen/underscor Hey
            // 61 Plus key  +/=
            switch (event.keyCode.toString()) {
                case '61':
                case '107':
                case '173':
                case '109':
                case '187':
                case '189':
                    event.preventDefault();
                    break;
            }
        }
        
    }

    @HostListener('window:mousewheel', ['$event'])
    @HostListener('window:DOMMouseScroll', ['$event'])
    PreventZooming(event: MouseWheelEvent) {
        if (event.ctrlKey == true) {
            event.preventDefault();
        }
    }
    //#endregion


    title = 'app';

    //Derived From Auth Service
    login = false;

    //Derived From Global State Service
    //Maintaining Application State
    state = 'login';
    agentModal = false;

    currentRoute = '/home';
    display;

    //SideBar State
    sidebarstate = true;
    controlsidebarstate = true;
    loadingRouteConfig = false;
    loadingNestedRouteConfig = false;
    showChatBar = false;
    chatBarEnabled = false;
    permissions: any;


    constructor(
        private _applicationStateService: GlobalStateService,
        private _authService: AuthService,
        private _titleService: Title
    ) {

        _authService.getSettings().subscribe(data => {

            if (data && data.permissions) {
                this.permissions = data.permissions.chats;

            }

        });

        _applicationStateService.title.subscribe(data => {
            this._titleService.setTitle(data);
        });

        _applicationStateService.getDisplayReady().subscribe(data => {
            this.display = data;
        });

        this._applicationStateService.loadingRouteConfig.subscribe(data => {
            if (!data) {
                setTimeout(() => {
                    this.loadingRouteConfig = data;
                }, 2000);
            } else {
                this.loadingRouteConfig = data;
            }
        });
        this._applicationStateService.loadingNestedRouteConfig.subscribe(data => {
            if (!data) {
                setTimeout(() => {
                    this.loadingNestedRouteConfig = data;
                }, 2000);
            } else {
                this.loadingNestedRouteConfig = data;
            }
        });


        _authService.CheckLogin();

        _authService.isLoggedin().subscribe((data) => {
            this.login = data;
        });

        this._applicationStateService.state.subscribe((data) => {
            this.state = data;
        });


        this._applicationStateService.currentRoute.subscribe(data => {
            this.currentRoute = data;
        });

        this._applicationStateService.navbarSidebar_state.subscribe(state => {
            this.navbarSidebar_state = state;
        });


        _applicationStateService.currentRoute.subscribe(data => {
            this.currentRoute = data;
        });

        _applicationStateService.sidebarState.subscribe(data => {
            this.sidebarstate = data;
        });

        _applicationStateService.controlSidebarState.subscribe(data => {
            this.controlsidebarstate = data;
        });

        _applicationStateService.chatBarEnabled.subscribe(data => {
            setTimeout(() => {
                this.chatBarEnabled = data;
            }, 0);
        });
        _applicationStateService.showChatBar.subscribe(data => {
            this.showChatBar = data;
        });

    }

    ngOnInit() {

    }

    ngAfterViewChecked() {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
    }

    ngAfterViewInit() {


        this._applicationStateService.agentModal.throttleTime(200).subscribe((data) => {
            this.agentModal = data;
        });

        setTimeout(() => {
            let loader = document.getElementById('loader');
            if (loader) {
                loader.classList.remove('fadeIn');
                loader.classList.add('fadeOut');
            }
        }, 0);


    }

    // velocity({ translateY: 125 }, 1150, [ 6 ]);

    subcribeModal() {
        this._applicationStateService.agentModal.subscribe((data) => {
            this.agentModal = data;
        });
    }



    ngOnDestroy() { }
}