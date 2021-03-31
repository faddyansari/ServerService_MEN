import { Component, ViewEncapsulation, ElementRef, ViewChild, AfterViewInit, Pipe } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { GlobalStateService } from '../../../services/GlobalStateService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/AuthenticationService';
import { UploadingService } from '../../../services/UtilityServices/UploadingService';
import { CallingService } from '../../../services/CallingService';
import { AdminSettingsService } from '../../../services/adminSettingsService';
import { CRMService } from '../../../services/crmService';

@Component({
    selector: 'app-crm',
    templateUrl: './crm.component.html',
    styleUrls: ['./crm.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CrmComponent {
    @ViewChild('fileInput') fileInput: ElementRef;

    agent: any;
    edit = false;
    subscription: Subscription[] = [];
    // private loadingAgents: BehaviorSubject<boolean> = new BehaviorSubject(true);
    selectedCustomer: any = {};
    customerConversation: any;
    SessionInformation: any
    file: File;

    //To Show Requesting Status
    loading = false;

    //Editing Value

    uploading: boolean;
    initiateChat = true;
    showChat: any;
    // showCustomerInfo: any;
    showCustomerInfo: boolean = false;
    isSelfViewingChat: any;
    selectedCustomerConversation: any;
    callSettings: any;
    sessionLog = false;
    isStatActive = false;
    verified = true;
    viewingConversation: boolean
    sbt = false;
    selectedSession: any = undefined;
    pills = {
        'profile': true,
        'stats': false,
        'conversations': false,
        'activity': false
    }
    package = undefined;

    // flags = [true, false, false, false];
    //hideConversation: boolean = true

    constructor(
        private _appStateService: GlobalStateService,
        private _crmService: CRMService,
        private _authService: AuthService,
        private _uploadingService: UploadingService,
        private _router: ActivatedRoute,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        public _callingService: CallingService,
        public _settingService: AdminSettingsService,
    ) {

        this.subscription.push(_authService.getPackageInfo().subscribe(pkg => {
            // console.log(data);
            if (pkg) {
                this.package = pkg.contacts;
                if(!this.package.allowed){
					this._appStateService.NavigateTo('/noaccess');
				}
            }
        }));


        this.subscription.push(_authService.getAgent().subscribe(agent => {
            this.agent = agent;
            // //console.log(agent);
        }));

        this.subscription.push(_authService.SBT.subscribe(data => {
            this.sbt = data;
        }));

        this.subscription.push(_crmService.viewingConversation.subscribe(view => {
            this.viewingConversation = view;
            // //console.log(agent);
        }));
        this.subscription.push(_crmService.isStatActive.subscribe(view => {
            this.isStatActive = view;
            // //console.log(agent);
        }));

        this.subscription.push(_crmService.showCustomerInfo.subscribe(data => {
            this.showCustomerInfo = data;
        }));

        this.subscription.push(_crmService.selectedCustomer.subscribe(data => {
            ////console.log(data)
            if (data) this.selectedCustomer = data;
            if (data.sessionInfo) this.selectedCustomer.sessionInfo = data.sessionInfo;
            // //console.log(this.selectedCustomer.sessionInfo);
        }));

        this.subscription.push(_crmService.selectedCustomerConversation.subscribe(data => {
            ////console.log(data);
            if (data) this.selectedCustomerConversation = data;
        }));

        this.subscription.push(this._authService.getSettings().subscribe(settings => {
            if (settings && Object.keys(settings).length) this.verified = settings.verified;

        }));

        this.subscription.push(_crmService.isStatActive.subscribe(data => {
            this.isStatActive = data;
        }));

        this.subscription.push(_crmService.getSelectedSessionDetails().subscribe(session => {
            ////console.log(session);        
            this.selectedSession = session;
        }));

        this.subscription.push(this._appStateService.shortcutEvents.subscribe(data => {

            this._crmService.SelectCustomer(data);


        }));


    }

    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscription.forEach(subscription => {
            subscription.unsubscribe();
        });
        this._crmService.setSelectedCustomer();

        this._appStateService.CloseControlSideBar();
    }

    public NumbersOnly(event: any) {
        const pattern = /[0-9\-]+/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    toggleActivityLog() {
        if (this.sessionLog) {
            this.sessionLog = false;
        } else {
            this.sessionLog = true;
        }
    }

    ToggleStats() {
        this._crmService.ToggleStats();
    }
    setStatsStatus(value) {
        this._crmService.setStatsStatus(value);
    }

    // ToggleOptions(value) {
    //     // this.isStatActive = !this.isStatActive;
    //     // if (!Object.keys(this.selectedCustomerConversation).length) {
    //     //     this._crmService.showOrHideConversation();
    //     // } else {
    //     //     if (this.selectedCustomerConversation && this.selectedCustomerConversation._id) {
    //     //         this._crmService.ToggleSelfViewingChat(this.selectedCustomerConversation._id);
    //     //     }
    //     // }
    //     // //console.log(value)


    //     this.flags.forEach((option, index) => {
    //         if (index == value) this.flags[value] = true;
    //         else this.flags[index] = false

    //     });
    //     ////console.log(this.flags)

    // }

    toggleCustomerAccessInfo() {
        this._crmService.toggleCustomerAccessInformation(!this.showCustomerInfo);
        // this._crmService.toggleCustomerAccessInformation();
    }


    getKeys(obj) {
        return Object.keys(obj);
    }

    setPillActive(pill) {
        Object.keys(this.pills).map(key => {
            if (key == pill) {
                this.pills[key] = true;
            } else {
                this.pills[key] = false;
            }
        })
    }

    GetSessionDetais(session) {
        if (session && !session.sessionDetails) {
            ////console.log("Fetching session details from server");

            this._crmService.GetSessionDetails(session).subscribe(data => {
                this._crmService.selectedCustomer.getValue().sessionInfo.map((sess) => {
                    if (sess._id == session._id) {
                        sess.sessionDetails = data[0];
                        this._crmService.setSelectedSessionDetails(data[0]);
                    }
                    return sess;
                });
                this._crmService.selectedCustomer.next(this._crmService.selectedCustomer.getValue());
            })

        }
        else {
            // //console.log("Loading session details from client");
            this._crmService.setSelectedSessionDetails(session.sessionDetails);
        }
    }

}
