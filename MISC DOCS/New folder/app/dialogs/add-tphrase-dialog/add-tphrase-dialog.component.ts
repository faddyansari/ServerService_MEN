import {  Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WidgetMarketingService } from '../../../services/LocalServices/WidgetMarketing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../SnackBar-Dialog/toast-notifications.component';
import { AdminSettingsService } from '../../../services/adminSettingsService';
import { ChatBotService } from '../../../services/ChatBotService';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-add-tphrase-dialog',
  templateUrl: './add-tphrase-dialog.component.html',
  styleUrls: ['./add-tphrase-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    WidgetMarketingService,
    AdminSettingsService
  ]
})
export class AddTphraseDialogComponent implements OnInit {

  tPhrase = '';
  intents = '';
  loading = false;
  intent_list = []
  subscriptions: Subscription[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private BotService : ChatBotService, private dialogRef: MatDialogRef < AddTphraseDialogComponent >, public snackBar : MatSnackBar) {
    (data.tPhrase) ? this.tPhrase = data.tPhrase : '';

    this.subscriptions.push(BotService.getIntent().subscribe(data => {
      this.intent_list = data;
    }));


  }

  ngOnInit() {
  }


  addTPhrase(){
    this.loading = true;
    this.BotService.AddMessageAsTPhrase({tPhrase:this.tPhrase, intents: this.intents}).subscribe((response) => {
      this.loading = false;
      if(response == 'ok'){
        this.dialogRef.close();
        this.snackBar.openFromComponent(ToastNotifications, {
          data: {
            img: 'ok',
            msg: 'Training Phrase added successfully!'
          },
          duration: 2000,
          panelClass: ['user-alert', 'success']
        });
      }else if(response == 'already-exists'){
        this.snackBar.openFromComponent(ToastNotifications, {
          data: {
            img: 'warning',
            msg: 'Training Phrase already exists!'
          },
          duration: 2000,
          panelClass: ['user-alert', 'error']
        });
      }
      else if(response == 'error'){
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




  selectIntent(event){
    if(event.target.value){
    this.intents = event.target.value;
    }
  }

}
