import { TicketsService } from './../../../services/TicketsService';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { TicketAutomationService } from '../../../services/LocalServices/TicketAutomationService';
import { ToastNotifications } from '../SnackBar-Dialog/toast-notifications.component';

@Component({
  selector: 'app-sla-export',
  templateUrl: './sla-export.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SlaExportComponent implements OnInit {
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  dates: any;
  emails = [];
  selectedLink: string = "group";
  prioritys = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  states = ['OPEN', 'PENDING', 'SOLVED'];


  sources = ['livechat', 'email', 'panel'];
  groups = [];
  subscriptions: Subscription[] = [];
  wiseName: string = 'group';
  wiseValue = [];
  public dynamicDropdownSettings = {
    singleSelection: false,
    itemsShowLimit: 3,
    textField: 'group_name',
    "allowSearchFilter": true
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _ticketAutomationSvc: TicketAutomationService,
    private _ticketService: TicketsService,
    private dialogRef: MatDialogRef<SlaExportComponent>,
    public snackBar: MatSnackBar
  ) {
    this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(data => {
      if (data) {
        this.groups = data;
        // data.map(val => {
        //   this.groups.push({ display: val.group_name, value: val.group_name })
        // })
      }

    }));

  }

  ngOnInit() {

  }

  setradio(e: string): void {

    this.selectedLink = e;

  }

  isSelected(name: string): boolean {

    if (!this.selectedLink) { // if no radio button is selected, always return false so every nothing is shown
      return false;
    }

    return (this.selectedLink === name); // if current radio button is selected, return true, else return false
  }

  Export() {
    console.log(this.wiseName);
    console.log(this.wiseValue);
    console.log(this.data);
    console.log(this.dates);

    let obj;
    let ticketIds;
    if (this.wiseName && this.wiseValue) {
      obj = {
        name: this.wiseName,
        value: this.wiseValue
      }
    }
    if (this.data && this.data.length) {
      ticketIds = this.data.map(e => e._id);
    }
    this._ticketService.exportSlaReport(this.dates != undefined ? this.dates.from : '', this.dates != undefined ? this.dates.to : '', this.emails, obj ? obj : undefined, ticketIds ? ticketIds : []).subscribe(res => {
      if (res.status == "ok") {
        this.snackBar.openFromComponent(ToastNotifications, {
          data: {
            img: 'ok',
            msg: 'Success! you will get a download link on your email in a while..'
          },
          duration: 5000,
          panelClass: ['user-alert', 'success']
        });
        this.dialogRef.close({
          status: true
        });
      }
    })

  }
  dateChanged(event) {
    if (event.status) {
      this.dates = event.dates;
    } else {
      this.dates = undefined;
    }
  }
  ngOnDestroy() {

    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }
}
