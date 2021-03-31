// import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
// import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

// // Service Injection
// import { Visitorservice } from '../../../../../services/VisitorService';
// import { Subscription } from 'rxjs/Subscription';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ChatService } from '../../../../../services/ChatService';
// import { AuthService } from '../../../../../services/AuthenticationService';
// import { GlobalStateService } from '../../../../../services/GlobalStateService';
// import { AdminSettingsService } from '../../../../../services/adminSettingsService';

// @Component({
//   selector: 'app-banned-visitors',
//   templateUrl: './banned-visitors.component.html',
//   styleUrls: ['./banned-visitors.component.css'],
//   encapsulation: ViewEncapsulation.None
// })
// export class BannedVisitorsComponent implements OnInit {

//   BannedvisitorList = [];
//   subscriptions: Subscription[] = [];
//   agent: any;
//   //selectedVisitor: any;
//   loading = true;


//   constructor(private _visitorService: Visitorservice,
//     public snackBar: MatSnackBar,
//     public _chatService: ChatService,
//     public dialog: MatDialog,
//     public _authService: AuthService,
//     public _applicationStateService: GlobalStateService,
//     public _adminSettings: AdminSettingsService) {


//     this.subscriptions.push(_visitorService.getLoadingVisitors().subscribe(data => {
//       this.loading = data;
//     }));

//     this.subscriptions.push(_visitorService.getBannedVisitors().subscribe((data) => {
//       // console.log('Getting Visitor List in Component');
//       this.BannedvisitorList = data;
//       // console.log(data);
//     }));

//     this.subscriptions.push(_visitorService.timer.subscribe(tick => {
//       this.BannedvisitorList.map(visitor => {
//         // //let currentDate = Date.parse(new Date().toString()) -  (Date.parse(new Date(visitor.creationDate).toUTCString()) - new Date().getTimezoneOffset() * 60 * 1000);
//         // console.log(visitor.endingDate);

//         let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.endingDate).toISOString());
//         visitor.seconds = Math.floor((currentDate / 1000) % 60);
//         visitor.minutes = Math.floor((currentDate / 1000 / 60) % 60);
//         visitor.hours = Math.floor((currentDate / 1000) / 60 / 60);
//         // // console.log(_visitorService.timer);
//       });
//     }));

//     this.subscriptions.push(_authService.getAgent().subscribe(data => {
//       this.agent = data;
//     }));

//   }

//   ngOnInit() { }

//   ngAfterViewInit() { }


//   SelectVisitor(visitorId: string, ) {

//     //this._visitorService.setSelectedBannedVisitor(visitorId, true);
//   }

//   ngOnDestroy() {
//     // Called once, before the instance is destroyed.
//     // Add 'implements OnDestroy' to the class.
//     this.subscriptions.forEach((subscription: Subscription) => {
//       subscription.unsubscribe();
//     });
//     // this._visitorService.Destroy()
//   }

// }
