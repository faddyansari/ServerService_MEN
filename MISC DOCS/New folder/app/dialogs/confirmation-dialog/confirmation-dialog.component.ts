import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationDialogComponent implements OnInit {

  msg: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public headerData: any) {
    (headerData.headermsg) ? this.msg = headerData.headermsg : 'Confirmation';
  }

  ngOnInit() {
  }

}
