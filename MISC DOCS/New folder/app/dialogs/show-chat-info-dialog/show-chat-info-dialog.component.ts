import { Component, OnInit, ViewEncapsulation, Directive, ViewChild, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../../../services/SocketService';
import { AuthService } from '../../../services/AuthenticationService';
import { FormBuilder, FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChatService } from '../../../services/ChatService';

@Component({
  selector: 'app-show-chat-info-dialog',
  templateUrl: './show-chat-info-dialog.component.html',
  styleUrls: ['./show-chat-info-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShowChatInfoDialogComponent implements OnInit {
  public subscriptions: Subscription[] = [];
  public agent: any;
  public socket: SocketIOClient.Socket;
  public loading = false;
  conversation: any
  imageError: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public _authService: AuthService, _socketService: SocketService,private dialogRef: MatDialogRef<ShowChatInfoDialogComponent>) {
    if (data.conversation) {

      
      this.conversation = data.conversation;
    }
    this.subscriptions.push(_socketService.getSocket().subscribe(data => this.socket = data));
    this.subscriptions.push(_authService.getAgent().subscribe(agent => {
      this.agent = agent;
    }));

  }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  CheckAttachmentType(data) {
    return (typeof data === 'string');
  }
  ImageBroken() {
    this.imageError = true;
  }


}