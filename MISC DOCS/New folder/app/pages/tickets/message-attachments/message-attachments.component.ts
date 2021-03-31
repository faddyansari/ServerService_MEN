import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-message-attachments',
  templateUrl: './message-attachments.component.html',
  styleUrls: ['./message-attachments.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageAttachmentsComponent implements OnInit {
  @Input('message') message: any;

  constructor() { }

  ngOnInit() {
    
  }
  
}
