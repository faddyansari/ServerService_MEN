import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, NgModule } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

//Services
import { AuthService } from '../../../services/AuthenticationService';
import { Visitorservice } from '../../../services/VisitorService';
import { ChatService } from '../../../services/ChatService';
import { Subscription } from 'rxjs/Subscription';
import { TicketsService } from '../../../services/TicketsService';
import { GlobalStateService } from '../../../services/GlobalStateService';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

    subscription: Subscription[] = []
    daysRemaining = 0;
    unlimited = false;
    //agent
    agent: any;
    verified = true;
    sbt = false;
    role : any;
    permissions : any;
    package: any;
    constructor(
        public _chatService: ChatService,
        public _appStateService: GlobalStateService,
        public _visitorService: Visitorservice,
        public _authService: AuthService,
        public _ticketService: TicketsService) {

            this.subscription.push(_authService.getSettings().subscribe(data => {
                // console.log(data);
                if(data && data.permissions){
                    this.permissions = data.permissions;
                    // console.log(this.permissions);			
                }
    
            }));
            this.subscription.push(_authService.getPackageInfo().subscribe(pkg => {

                if (pkg) {
                    this.package = pkg;
                }
    
            }));
    
            this.subscription.push(_authService.getAgent().subscribe(data => {

            this.agent = data;
            this.role = data.role;
            if (this.agent) {
            }
        }));

        this.subscription.push(_authService.SBT.subscribe(data => {
            this.sbt = data;
        }));

        this.subscription.push(this._authService.getSettings().subscribe(settings => {
            if (settings && Object.keys(settings).length) {
                this.verified = settings.verified;
                (settings && settings.expiry != 'unlimited') ? this.daysRemaining = Math.floor((Date.parse(new Date(settings.expiry).toISOString()) - Date.parse(new Date().toISOString())) / 1000 / 60 / 60 / 24) : this.unlimited = true;
            }
            //console.log(data);
        }));
    }

    dateChanged(event){
        console.log(event);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscription.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
