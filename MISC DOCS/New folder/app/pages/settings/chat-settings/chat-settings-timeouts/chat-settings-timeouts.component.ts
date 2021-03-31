import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ChatSettingService } from '../../../../../services/LocalServices/ChatSettingService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat-settings-timeouts',
  templateUrl: './chat-settings-timeouts.component.html',
  styleUrls: ['./chat-settings-timeouts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatSettingsTimeoutsComponent implements OnInit {

  public subscriptions: Subscription[] = [];
  public chatTimeoutSettings: any;
  public chatTimeoutSettingsForm: FormGroup;
  public changed: boolean = false;
  public loadingSettings = false;
  public loading;
  public invalideTimeoutSetting = false;

  constructor(public _chatSettings: ChatSettingService, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
    private _appStateService: GlobalStateService
  ) {
    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
    this.subscriptions.push(_chatSettings.getChattSettings().subscribe(settings => {
      //console.log('chat settings', settings);

      if (settings) {
        this.chatTimeoutSettings = settings.inactivityTimeouts;
        this.chatTimeoutSettingsForm = formBuilder.group({
          'transferIn': [
            (this.chatTimeoutSettings) ? this.chatTimeoutSettings.transferIn : '',
            [
              Validators.pattern(/^[0-9\-]+$/),
              this.inputValidator
            ]
          ],
          'inactiveTimeout': [
            (this.chatTimeoutSettings) ? this.chatTimeoutSettings.inactiveTimeout : '',
            [
              Validators.pattern(/^[0-9\-]+$/),
              this.inputValidator
            ]
          ],
          'endSessionTimeout': [
            (this.chatTimeoutSettings) ? this.chatTimeoutSettings.endSessionTimeout || this.chatTimeoutSettings.endchatTimeout : '',
            [
              Validators.pattern(/^[0-9\-]+$/),
              this.inputValidator
            ]
          ]
        });
        this.loadingSettings = true;
      }
    }));

    this.subscriptions.push(_chatSettings.getSavingStatus('inactivityTimeouts').subscribe(status => {
      this.loading = status;
    }));



  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }


  Submit(value) {
    this.invalideTimeoutSetting = false
    if (value.transferIn >= value.inactiveTimeout) {
      this.invalideTimeoutSetting = true
      return
    }
    if (this.chatTimeoutSettingsForm.invalid) {
      return;
    }
    this._chatSettings.setNSPChatSettings({
      transferIn: value.transferIn,
      inactiveTimeout: value.inactiveTimeout,
      endSessionTimeout: value.endSessionTimeout
    }, 'inactivityTimeouts').subscribe(response => {
      if (response.status == 'error') {
        if (response.code == '403') {
          response.reason.map(reason => {
            if (reason == 'invalidTransferInTime')
              this.chatTimeoutSettingsForm.get('transferIn').setErrors({ invalidInput: true });
            if (reason == 'invalidInactiveTimeoutTime')
              this.chatTimeoutSettingsForm.get('inactiveTimeout').setErrors({ invalidInput: true });
            if (reason == 'invalidEndSessionTimeout')
              this.chatTimeoutSettingsForm.get('endSessionTimeout').setErrors({ invalidInput: true });
          });
          this.chatTimeoutSettingsForm.setErrors({ invalid: true });
        }
      }
      else {
        this.snackBar.openFromComponent(ToastNotifications, {
          data: {
            img: 'ok',
            msg: 'Timeout Settings updated Successfully!'
          },
          duration: 3000,
          panelClass: ['user-alert', 'success']
        });
      }
    });
  }

  inputValidator(control: FormControl) {
    // if (control.value < 1 && control.value != -1) return { invalidInput: true }
    if (control.value <= 0 || control.value > 60) return { invalidInput: true }
    else return null;
  }

}
