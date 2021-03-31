import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from '../../../services/ChatService';


@Component({
  selector: 'app-visitor-ban-time',
  templateUrl: './visitor-ban-time.component.html',
  styleUrls: ['./visitor-ban-time.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VisitorBanTimeComponent {
  hours: string = '';
  loading = false;
  invalidHours = false;
  shiftdown = false;
  numberRangeRegex = /^\d+$/;
  sessionid = ''
  deviceID = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data, private _chatService: ChatService, private dialogRef: MatDialogRef<VisitorBanTimeComponent>, public snackBar: MatSnackBar) {
    (data.sessionid) ? this.sessionid = data.sessionid : '';
    (data.deviceID) ? this.deviceID = data.deviceID : '';
    //console.log(data);

  }

  ngOnInit() {

  }

  BanChat() {
    if (this.numberRangeRegex.test(this.hours)) {
      this.invalidHours = false
      this.dialogRef.close({ hours: this.hours });
    }
    else this.invalidHours = true;
  }
}


