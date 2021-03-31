import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChatSettingService } from '../../../../../services/LocalServices/ChatSettingService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-sharing',
  templateUrl: './file-sharing.component.html',
  styleUrls: ['./file-sharing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FileSharingComponent implements OnInit {

  public subscriptions: Subscription[] = [];
  public permissions: any;
  public fileSharingSettingsForm: FormGroup;

  public loading;

  constructor(
    public _chatSettings: ChatSettingService,
    private formbuilder: FormBuilder,
    private _appStateService: GlobalStateService,
    private snackBar: MatSnackBar
  ) {
    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');

    this.fileSharingSettingsForm = formbuilder.group({});

    this.subscriptions.push(_chatSettings.getChattSettings().subscribe(settings => {

      if (settings) {
        //console.log('chat settings',settings);
        this.permissions = settings.permissions;
      }
    }));

    this.subscriptions.push(_chatSettings.getSavingStatus('permissions').subscribe(status => {
      this.loading = status;
    }));



  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }


  public SetPermission(value: string) {
    switch (value) {
      case 'forVisitors':
        this.permissions.forVisitors = !this.permissions.forVisitors;
        break;
      case 'forAgents':
        this.permissions.forAgents = !this.permissions.forAgents;
        break;
      case 'showRecentChats':
        this.permissions.showRecentChats = !this.permissions.showRecentChats;
        break;
      case 'chatAsGuest':
        this.permissions.chatAsGuest = !this.permissions.chatAsGuest;
        break;
      case 'invitationChatInitiations':
        this.permissions.invitationChatInitiations = !this.permissions.invitationChatInitiations;
        break;
    }
  }

  public Submit() {
    this._chatSettings
      .setNSPChatSettings(this.permissions, 'permissions')
      .subscribe(response => {
        if (response.status == "ok") {
          this.snackBar.openFromComponent(ToastNotifications, {
            data: {
              img: 'ok',
              msg: 'Permissions updated Successfully!'
            },
            duration: 3000,
            panelClass: ['user-alert', 'success']
          });
        }
        //Do Some Error Logic If Any
        //Check Server Responses For this Event
      });
  }

}
