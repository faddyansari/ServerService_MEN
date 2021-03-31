import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WidgetMarketingService } from '../../../services/LocalServices/WidgetMarketing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../SnackBar-Dialog/toast-notifications.component';

@Component({
  selector: 'app-add-faq-dialog',
  templateUrl: './add-faq-dialog.component.html',
  styleUrls: ['./add-faq-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    WidgetMarketingService
  ]
})
export class AddFaqDialogComponent implements OnInit {

  question = '';
  answer = '';
  loading = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _WMService: WidgetMarketingService, private dialogRef: MatDialogRef<AddFaqDialogComponent>, public snackBar: MatSnackBar) {
    (data.question) ? this.question = data.question : ''
  }

  ngOnInit() {

  }

  addFaq() {
    this.loading = true;
    this._WMService.AddMessageAsFaq({ question: this.question, answer: this.answer }).subscribe((response) => {
      this.loading = false;
      if (response == 'ok') {
        this.dialogRef.close();
        this.snackBar.openFromComponent(ToastNotifications, {
          data: {
            img: 'ok',
            msg: 'FAQ added successfully!'
          },
          duration: 2000,
          panelClass: ['user-alert', 'success']
        });
      } else if (response == 'already-exists') {
        this.snackBar.openFromComponent(ToastNotifications, {
          data: {
            img: 'warning',
            msg: 'FAQ already exists!'
          },
          duration: 2000,
          panelClass: ['user-alert', 'error']
        });
      }
      else if (response == 'error') {
        this.snackBar.openFromComponent(ToastNotifications, {
          data: {
            img: 'warning',
            msg: 'Error!'
          },
          duration: 2000,
          panelClass: ['user-alert', 'error']
        });
      }
    });
  }

}
