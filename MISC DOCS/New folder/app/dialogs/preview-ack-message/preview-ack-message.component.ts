import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-ack-message',
  templateUrl: './preview-ack-message.component.html',
  styleUrls: ['./preview-ack-message.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PreviewAckMessageComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private sanitized: DomSanitizer) { }

  ngOnInit() {
  }

  TransformMessage(data){
    let temp = data.replace(/{{ticket.id}}/gi,"1234").replace(/{{ticket.priority}}/gi,"HIGH").replace(/{{ticket.state}}/gi,"OPEN").replace(/{{ticket.source}}/gi,"email").replace(/{{ticket.assignedTo}}/gi,"Mr. Donald").replace(/{{visitor.email}}/gi,"harry_potter@sbtjapan.com").replace(/{{visitor.name}}/gi,"Harry Potter");
    temp = this.sanitized.bypassSecurityTrustHtml(temp);
    return temp;
  }
}
