import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-email-chat-transcript',
  templateUrl: './email-chat-transcript.component.html',
  styleUrls: ['./email-chat-transcript.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmailChatTranscriptComponent implements OnInit {
  loading = false;
  email: string = '';
  invalidEmail = false;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(@Inject(MAT_DIALOG_DATA) public data, private dialogRef: MatDialogRef<EmailChatTranscriptComponent>) {
    (data.email) ? this.email = data.email : ''

  }

  ngOnInit() {
  }

  SendTranscript() {
    if (new RegExp(this.emailPattern).test(this.email)) {
      this.invalidEmail = false
      this.dialogRef.close({ email: this.email })

    }
    else this.invalidEmail = true;

  }

}
