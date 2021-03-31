import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { WebHookSettingsService } from '../../../../../services/LocalServices/WebHookSettings';
import { AuthService } from '../../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
  selector: 'app-third-party-sync',
  templateUrl: './third-party-sync.component.html',
  styleUrls: ['./third-party-sync.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ThirdPartySyncComponent implements OnInit {

  public loading = false;
  public currentAppTokenObj: any;
  public generateAppTokenForm: FormGroup;
  public script: string = '';
  subscriptions: Subscription[] = [];
  sbt = false;

  constructor(public formbuilder: FormBuilder,
    private _authService: AuthService,
    private _webhookSettings: WebHookSettingsService,private _appStateService : GlobalStateService) {
      this._appStateService.contentInfo.next('');
      this._appStateService.breadCrumbTitle.next('Webhooks');
    // no message will be shown when userGetValidated == 'unknown'
    this.currentAppTokenObj = {
      key: '', userGetValidated: 'unknown'
    }

    this.generateAppTokenForm = this.formbuilder.group({
      'generatedAppToken': [
        this.currentAppTokenObj['key'],
        []
      ]
    });

    this.subscriptions.push(this._webhookSettings.currentAppToken.subscribe((appToken) => {
      // console.log("appToken recieved");
      // console.log(appToken)
      this.generateAppTokenForm.controls['generatedAppToken'].setValue(appToken['key']);
      this.currentAppTokenObj['userGetValidated'] = appToken['userGetValidated']
    }));

    this.subscriptions.push(this._authService.SBT.subscribe(data => {
      this.sbt = data;
    }));



  }

  // public AddScript() {
  //   if (this.customScriptForm.valid && (this.script != this.customScriptForm.get('script').value)) {
  //     this.loading = true;
  //     this._webhookSettings.SetScript(this.customScriptForm.get('script').value).subscribe(response => {
  //       //Todo resposne post actions here
  //       this.loading = false;
  //       if (response.status == 'ok') {
  //         //Success Case
  //       }
  //     }, err => {
  //       //Todo Error Logic Here
  //       this.loading = false;
  //     });
  //   }
  // }

  ngOnInit() {
    // this.subscriptions.push(this._webhookSettings.getCustomScript().subscribe(script => {
    //   this.script = script;
    //   this.customScriptForm.get('script').setValue(script);
    // }));
  }

  GenerateAppToken() {
    // console.log("generate!")
    this._webhookSettings.GenerateAppToken()
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
    this._webhookSettings.Destroy();
  }

}
