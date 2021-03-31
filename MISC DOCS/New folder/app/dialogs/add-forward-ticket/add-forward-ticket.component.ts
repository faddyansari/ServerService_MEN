import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketsService } from '../../../services/TicketsService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../SnackBar-Dialog/toast-notifications.component';


@Component({
  selector: 'app-add-forward-ticket',
  templateUrl: './add-forward-ticket.component.html',
  styleUrls: ['./add-forward-ticket.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddForwardTicketComponent {
  email = '';
  selectedMmessage: any;
  ticket: any
  loading = false;
  invalidEmail = false;
  shiftdown = false;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  config: any = {
    placeholder: 'Add Note..',
    toolbar: [
      ['style', ['bold', 'italic', 'underline']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['fontName', ['fontName']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['400']],
      ['insert', ['linkDialogShow', 'unlink']],
      ['view', ['fullscreen', 'codeview', 'undo', 'redo']]
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data, private _ticketService: TicketsService, private dialogRef: MatDialogRef<AddForwardTicketComponent>, public snackBar: MatSnackBar) {
    (data.message) ? this.selectedMmessage = data.message.message : '';
    (data.ticket) ? this.ticket = data.ticket : '';
    //console.log(data);

  }

  ngOnInit() {

  }

  Forward() {
    if (new RegExp(this.emailPattern).test(this.email)) {
      this.invalidEmail = false
      this.loading = true;
      this._ticketService.ForwardMessageAsTicket(this.email, this.selectedMmessage, this.ticket).subscribe((response) => {
        this.loading = false;
        if (response.status == 'ok') {

          this.snackBar.openFromComponent(ToastNotifications, {
            data: {
              img: 'ok',
              msg: 'Message Forwarded successfully!'
            },
            duration: 2000,
            panelClass: ['user-alert', 'success']
          });
        } else {
          this.snackBar.openFromComponent(ToastNotifications, {
            data: {
              img: 'warning',
              msg: 'Message Sending failed!'
            },
            duration: 2000,
            panelClass: ['user-alert', 'error']
          });
        }
        this.dialogRef.close();
      });
    }
    else this.invalidEmail = true;

  }





  keydownX(event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {

      case 'shift':
        {
          this.shiftdown = true;
          break;
        }
    }
  }
  keyupX(event: KeyboardEvent) {

    switch (event.key.toLowerCase()) {
      case 'enter':
        {
          if (!this.shiftdown) {
            this.data.message.message = this.data.message.message.trim();
          }
          break;
        }
      case 'shift':
        {
          setTimeout(() => {
            this.shiftdown = false;
          }, 100);
          break;
        }
    }

  }

}

