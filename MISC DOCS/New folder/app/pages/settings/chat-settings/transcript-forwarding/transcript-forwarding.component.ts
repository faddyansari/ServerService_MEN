import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatSettingService } from '../../../../../services/LocalServices/ChatSettingService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/Observable';
import { UploadingService } from '../../../../../services/UtilityServices/UploadingService';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
  selector: 'app-transcript-forwarding',
  templateUrl: './transcript-forwarding.component.html',
  styleUrls: ['./transcript-forwarding.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class TranscriptForwardingComponent implements OnInit {

  public subscriptions: Subscription[] = [];
  public transcriptForwarindSettings: any;
  public transcriptForwarindSettingsForm: FormGroup;
  public transcriptLogoSettingsForm: FormGroup;
  public loading;
  public loadingLogo;
  private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  transcriptLogoSettings: any;
  image: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  fileInvalid: boolean;
  package: any = {};
  constructor(public _chatSettings: ChatSettingService, private formBuilder: FormBuilder, private _authService: AuthService,
    private _appStateService: GlobalStateService, private snackBar: MatSnackBar, private _uploadingService: UploadingService
  ) {
    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
    this.subscriptions.push(_chatSettings.getChattSettings().subscribe(settings => {
      //console.log('chat settings', settings);

      if (settings) {
        this.transcriptForwarindSettings = settings.transcriptForwarding;
        this.transcriptForwarindSettingsForm = formBuilder.group({
          'emails': [
            this.GetEmails(this.transcriptForwarindSettings.emails),
            [
              Validators.pattern(this.emailPattern),
              Validators.required
            ],
          ],

        });

        this.transcriptLogoSettings = (settings.transcriptLogo) ? settings.transcriptLogo : '';
        this.transcriptLogoSettingsForm = formBuilder.group({
          'logo': [
            null
          ]
        });


      }

    }));

    this.subscriptions.push(_chatSettings.getSavingStatus('transcriptForwarding').subscribe(status => {
      this.loading = status;
    }));
    this.subscriptions.push(_chatSettings.getSavingStatus('transcriptLogo').subscribe(status => {
      this.loadingLogo = status;
    }));

    this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
      // console.log(data);
      if (pkg) {
        this.package = pkg;
        if (!this.package.chats.transcriptForwarding.allowed) {
          this._appStateService.NavigateTo('/noaccess');
        }
      }
    }));

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public GetEmails(emails: Array<string>) {
    if (!emails.length) return '';
    let temp = '';
    emails.map((email, index) => {
      if (index == 0) temp += email;
      else temp += (',' + email);
    });
    return temp;
  }

  Submit(value: any) {
    this._chatSettings.setNSPChatSettings({
      emails: [value.emails]
    }, 'transcriptForwarding')
      .subscribe(response => {
        console.log('error');
        if (response.status == 'error') {
          if (response.code == '403') {
            response.reason.map(reason => {
              if (reason == 'invalidEmail')
                this.transcriptForwarindSettingsForm.get('emails').setErrors({ pattern: true });
            });
            this.transcriptForwarindSettingsForm.setErrors({ invalid: true });
          }
        }
        else {
          this.snackBar.openFromComponent(ToastNotifications, {
            data: {
              img: 'ok',
              msg: 'Forward Chat Transcripts settings updated Successfully!'
            },
            duration: 3000,
            panelClass: ['user-alert', 'success']
          });
        }
      });
  }

  SubmitLogo() {
    this.UploadImage().subscribe(link => {

      this._chatSettings.setNSPChatSettings(
        (link) ? link : ''

        , 'transcriptLogo')
        .subscribe(response => {
          if (response.status == 'error') {
            if (response.code == '403') {
              response.reason.map(reason => {
                if (reason == 'invalidFile')
                  this.transcriptLogoSettingsForm.setErrors({ invalid: true });
              });
              this.transcriptLogoSettingsForm.setErrors({ invalid: true });
            }
          }
          else {
            this.snackBar.openFromComponent(ToastNotifications, {
              data: {
                img: 'ok',
                msg: 'Transcript logo settings updated Successfully!'
              },
              duration: 3000,
              panelClass: ['user-alert', 'success']
            });
            this.transcriptLogoSettings = link;
          }
        });
    })

  }

  UploadImage(): Observable<any> {
    return new Observable((observer) => {
      if (this.image) {
        this._uploadingService.SignRequest(this.image, 'SendAttachMent').subscribe(response => {
          let params = JSON.parse(response.text());
          params.file = this.image;
          this._uploadingService.uploadAttachment(params).subscribe(s3response => {
            if (s3response.status == '201') {
              this._uploadingService.parseXML(s3response.text()).subscribe(json => {
                observer.next(json.response.PostResponse.Location[0])
                observer.complete();
              }, err => {
                observer.error(err);
              });
            }
          }, err => {
            observer.error(err);
          });
        }, err => {
          observer.error(err);
        });
      } else {
        observer.next('');
        observer.complete();
      }
    });
  }


  imgSelected(files) {
    if (files && files.length > 0) {
      this.readURL(files).subscribe(response => {
        if (response) this.image = files[0];
        else {
          this.image = undefined;
          this.fileInput.nativeElement.value = '';
        }
      });
    } else {
      this.image = undefined;
      this.fileInput.nativeElement.value = '';
    }

  }

  readURL(files): Observable<any> {
    return new Observable((observer) => {
      this._uploadingService.readURL(files).subscribe(data => {
        if (this.CheckImage(files[0].name.split('.')[1])) {
          this.transcriptLogoSettings = data[0].url
          observer.next(true)
          observer.complete()
        }
        else {
          this.fileInvalid = true
          observer.next(false)
          observer.complete()

          setTimeout(() => {
            this.fileInvalid = false
          }, 3000);
        }
      })
    });
  }

  CheckImage(type: string) {
    switch (type.toLowerCase()) {
      case 'png':
      case 'jpeg':
      case 'jpg':
      case 'bmp':
      case 'svg':
        return true

      default:
        return false

    }
  }
  Clear() {
    this.image = undefined;
    this.fileInput.nativeElement.value = '';
    this.transcriptLogoSettings = ''
    this.transcriptLogoSettingsForm.get('logo').setValue(null);
  }

}
