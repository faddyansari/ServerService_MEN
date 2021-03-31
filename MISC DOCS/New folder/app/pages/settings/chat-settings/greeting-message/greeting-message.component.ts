import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatSettingService } from '../../../../../services/LocalServices/ChatSettingService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
  selector: 'app-greeting-message',
  templateUrl: './greeting-message.component.html',
  styleUrls: ['./greeting-message.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GreetingMessageComponent implements OnInit {

  public subscriptions: Subscription[] = [];
  public greetingMessageForm: FormGroup;
  public greetingMessage: string = '';

  public botGreetingMessageForm: FormGroup;
  public botGreetingMessage: string = '';

  public loading;
  public loadingBot;

  settings : any
  package:  any= {};


  constructor(public _chatSettings: ChatSettingService, private formBuilder: FormBuilder,private snackBar:MatSnackBar,
    private _appStateService: GlobalStateService, private _authService: AuthService
  ) {
    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
    this.subscriptions.push(this._chatSettings.getChattSettings().subscribe(settings => {
      // console.log('chat settings', settings);

      if (settings) {
        this.settings = settings;
        this.greetingMessage = settings.greetingMessage;
        this.greetingMessageForm = formBuilder.group({
          'greetingMessage': [
            this.greetingMessage,
            []
          ]
        });
        this.botGreetingMessage = settings.botGreetingMessage;
        this.botGreetingMessageForm = formBuilder.group({
          'botGreetingMessage': [
            this.botGreetingMessage,
            []
          ]
        });

      }

    }));

    this.subscriptions.push(this._chatSettings.getSavingStatus('greetingMessage').subscribe(status => {
      this.loading = status;
    }));

    this.subscriptions.push(this._chatSettings.getSavingStatus('botGreetingMessage').subscribe(status => {
      this.loadingBot = status;
    }));


    this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
      // console.log(data);
      if (pkg) {
        this.package = pkg;
        
      }
    }));


  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  Submit() {
    this._chatSettings.setNSPChatSettings(
      this.greetingMessageForm.get('greetingMessage').value, 'greetingMessage')
      .subscribe(response => {

        console.log(response);
        
        if (response.status == 'ok') {
          
          this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Greeting Message updated Successfully!'
						},
						duration: 3000,
						panelClass: ['user-alert', 'success']
					});
        }
      });
  }

  SubmitBot() {
    this._chatSettings.setNSPChatSettings(
      this.botGreetingMessageForm.get('botGreetingMessage').value, 'botGreetingMessage')
      .subscribe(response => {
        console.log(response);
        if (response.status == 'ok') {
          this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Bot Greeting Message updated Successfully!'
						},
						duration: 3000,
						panelClass: ['user-alert', 'success']
					});
        }
      });
  }

}
