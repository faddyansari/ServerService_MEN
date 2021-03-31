import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

// Service Injection
import { Visitorservice } from '../../../../services/VisitorService';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from '../../../../services/ChatService';
import { AuthService } from '../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { AdminSettingsService } from '../../../../services/adminSettingsService';
import { ToastNotifications } from '../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-banned',
  templateUrl: './banned.component.html',
  styleUrls: ['./banned.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BannedComponent implements OnInit {

  BannedvisitorList = [];
  subscriptions: Subscription[] = [];
  agent: any;
  //selectedVisitor: any;
  loading = true;


  constructor(private _visitorService: Visitorservice,
    public snackBar: MatSnackBar,
    public _chatService: ChatService,
    public _authService: AuthService,
    public _applicationStateService: GlobalStateService,
    private dialog: MatDialog) {


    this.subscriptions.push(_visitorService.getLoadingVisitors().subscribe(data => {
      this.loading = data;
    }));

    this.subscriptions.push(_visitorService.getBannedVisitors().subscribe((data) => {
      // console.log(data);


      this.BannedvisitorList = data;
      this.BannedvisitorList.map(visitor => {
        let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.bannedOn).toISOString());
        visitor.seconds = Math.floor((currentDate / 1000) % 60);
        visitor.minutes = Math.floor((currentDate / 1000 / 60) % 60);
        visitor.hours = Math.floor((currentDate / 1000) / 60 / 60);
      });

    }));

    this.subscriptions.push(_authService.getAgent().subscribe(data => {
      this.agent = data;
    }));

  }

  ngOnInit() { }

  ngAfterViewInit() { }


  SelectVisitor(visitorId: string, ) {

    //this._visitorService.setSelectedBannedVisitor(visitorId, true);
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    // this._visitorService.Destroy()
  }


  UnbanVisitor(deviceID) {

    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: 'Are you sure you want to unban this user?' }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._chatService.UnBanVisitorChat(deviceID).subscribe(data => {
          if (data) {


            //this._visitorService.RemoveBannedVisitorFormList(deviceID);
            this.snackBar.openFromComponent(ToastNotifications, {
              data: {
                img: 'ok',
                msg: 'Visitor Unbanned successfully!'
              },
              duration: 2000,
              panelClass: ['user-alert', 'success']
            });
          }
          else {
            this.snackBar.openFromComponent(ToastNotifications, {
              data: {
                img: 'ok',
                msg: 'Cannot Unban Visitor!'
              },
              duration: 2000,
              panelClass: ['user-alert', 'error']
            });
          }
        });
      } else {
        return
      }
    });



  }

}

