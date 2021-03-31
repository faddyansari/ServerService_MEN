import { Component, OnInit, ViewEncapsulation, Directive, ViewChild, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../../../services/SocketService';
import { AuthService } from '../../../services/AuthenticationService';
import { FormBuilder, FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChatService } from '../../../services/ChatService';
//import { ValidationService } from '../../../services/UtilityServices/ValidationService';
declare var $: any;

@Component({
  selector: 'app-convert-chat-to-ticket',
  templateUrl: './convert-chat-to-ticket.component.html',
  styleUrls: ['./convert-chat-to-ticket.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConvertChatToTicketComponent implements OnInit {
  public http: any;
  public subscriptions: Subscription[] = [];
  public groupsList = [];
  public ticket: any;
  public agent: any;
  public socket: SocketIOClient.Socket;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  whiteSpace = /^\S*$/;
  numberRegex = /^([^0-9]*)$/;
  // CharacterLimit = /^[0-9A-Za-z!@.,;:'"?-]{1,100}\z/;
  SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
  public loading = false;
  currentConversation: any
  public addTicketForm: FormGroup;

  public submitted = false;
  public imageError = false;

  conversation: Array<any> = [];
  filteredConversation: Array<any> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public _authService: AuthService, _socketService: SocketService,
    private formbuilder: FormBuilder,
    private _chatService: ChatService,
    private dialogRef: MatDialogRef<ConvertChatToTicketComponent>) {
    if (data.currentConversation) {
      this.currentConversation = data.currentConversation;
      this.conversation = data.currentConversation.messages;
      this.filteredConversation = data.currentConversation.messages;
    }
    this.addTicketForm = formbuilder.group({
      'subject': [null, [Validators.required]],
      'state': ['OPEN', Validators.required],
      'priority': ['LOW', Validators.required],
      'visitor': formbuilder.group({
        'name': [null, [Validators.required, Validators.pattern(this.numberRegex), Validators.pattern(this.SpecialChar)]],
        'email': [(this.currentConversation && this.currentConversation.visitorEmail && this.currentConversation.visitorEmail != 'Unregistered') ? this.currentConversation.visitorEmail : null,
        [
          Validators.pattern(this.emailPattern),
          Validators.required
        ]
        ],
      })

    });

    this.subscriptions.push(_socketService.getSocket().subscribe(data => this.socket = data));
    this.subscriptions.push(_authService.getAgent().subscribe(agent => {
      //console.log(agent);

      this.agent = agent;
    }));
    // this.subscriptions.push(_chatService.getCurrentConversation().subscribe(currentConversation => {
    //   //if (conversation.length > 0) {
    //   // console.log(currentConversation);
    //   this.currentConversation = currentConversation;
    //   this.conversation = currentConversation.messages;
    //   this.filteredConversation = currentConversation.messages;

    //   // }
    // }));

  }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }


  submitForm(form: Form) {
    let convo = this.filteredConversation.filter(msg => { return !msg.unselected })
    //console.log('Value Submitted');
    //this.agentRegForm.valid
    if (this.addTicketForm.valid) {
      let details = {
        conversation: JSON.stringify(convo),
        // message: {
        //   from: this.agent.email,
        //   to: this.addTicketForm.get('visitor').get('email').value,
        //   body: this.addTicketForm.get('visitor').get('message').value
        // },
        thread: {
          subject: this.addTicketForm.get('subject').value,
          state: this.addTicketForm.get('state').value,
          priority: this.addTicketForm.get('priority').value,
          visitor: {
            name: this.addTicketForm.get('visitor').get('name').value,
            email: this.addTicketForm.get('visitor').get('email').value,
          }
        }

      }
      this.dialogRef.close(details);
    }
  }

  ImageBroken() {
    this.imageError = true;
  }


  CheckAttachmentType(data) {
    return (typeof data === 'string');
  }

  EditMessage(Message: any, Delete: boolean) {

    this.filteredConversation = this.filteredConversation.map(msg => {
      if (msg._id == Message._id) msg.unselected = Delete;
      return msg
    })
  }

}