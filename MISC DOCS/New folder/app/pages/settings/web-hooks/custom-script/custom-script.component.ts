import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { WebHookSettingsService } from '../../../../../services/LocalServices/WebHookSettings';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { AuthService } from '../../../../../services/AuthenticationService';


@Component({
  selector: 'app-custom-script',
  templateUrl: './custom-script.component.html',
  styleUrls: ['./custom-script.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomScriptComponent implements OnInit {

  public loading = false;
  public customScriptForm: FormGroup;
  public script: string = '';
  public error = '';

  subscriptions: Subscription[] = [];
	package = undefined;


  constructor(public formbuilder: FormBuilder,
    private _webhookSettings: WebHookSettingsService, private _appStateService: GlobalStateService,private _authService : AuthService) {

    this.subscriptions.push(this._authService.getPackageInfo().subscribe(pkg => {
      // console.log(data);
      if (pkg) {
        this.package = pkg.integratons;
        if (!this.package.allowed || !this.package.customScript) {
          this._appStateService.NavigateTo('/noaccess');
        }
      }
    }));
    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Webhooks');

    this.customScriptForm = this.formbuilder.group({
      'script': [
        (this.script) ? this.script : null,
        []
      ]
    });


  }

  public AddScript() {
    if (this.customScriptForm.valid && (this.script != this.customScriptForm.get('script').value)) {
      this.error = '';
      this.loading = true;
      this._webhookSettings.SetScript(this.customScriptForm.get('script').value).subscribe(response => {
        //Todo resposne post actions here
        this.loading = false;
        if (response.status == 'ok') {
          //Success Case
        }
      }, err => {
        //Todo Error Logic Here
        this.loading = false;
        this.error = err;

      });
    }
  }

  ngOnInit() {
    this.subscriptions.push(this._webhookSettings.getCustomScript().subscribe(script => {
      this.script = script;
      this.customScriptForm.get('script').setValue(script);
    }));
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
    // this._webhookSettings.Destroy();
  }

}
