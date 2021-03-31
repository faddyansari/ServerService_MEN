import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadingService } from '../../../../../services/UtilityServices/UploadingService';
import { KnowledgeBaseService } from '../../../../../services/LocalServices/KnowledgeBase';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    KnowledgeBaseService
  ]
})
export class FaqsComponent implements OnInit {

  faqForm: FormGroup;
  docSearchForm: FormGroup;

  file: File;
  loading = false;
  knowledgeBaseList = [];
  fetching = true;
  subscription : Subscription[] = []
  package = undefined;

  constructor(private formBuilder: FormBuilder,
    private _uploadingService: UploadingService,
    private _knowledgeBaseService: KnowledgeBaseService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _appStateService: GlobalStateService,
    private _authService: AuthService,
  ) {

    this.subscription.push(this._authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg.knowledgebase;
				if (!this.package.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}
    }));
    

    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Knowledge Base');
    _knowledgeBaseService.GetKnowledgeBase('faq');
    _knowledgeBaseService.knowledgeBaseList.subscribe(data => {
      if (data) {
        this.knowledgeBaseList = data;
      }
    });
    _knowledgeBaseService.fetching.subscribe(data => {
      this.fetching = data;
    });

    this.faqForm = formBuilder.group({
      'file': [
        null,
        [
          Validators.required
        ]
      ]
    });
    this.docSearchForm = formBuilder.group({
      'searchValue': ['', [],]
    });

  }

  ngOnInit() {
  }

  Change(event) {
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
    }
  }


  Submit() {
    this.loading = true;
    if (!this.file) return;
    this._uploadingService.SignRequest(this.file, 'knowledgebase', { params: { "folderName": 'faqs' } }).subscribe(response => {

      let params = JSON.parse(response.text());
      params.file = this.file

      this._uploadingService.uploadAttachment(params).subscribe(s3response => {
        // console.log(s3response.status);

        if (s3response.status == '201') {
          this._uploadingService.parseXML(s3response.text()).subscribe(json => {
            //console.log(json.response.PostResponse.Location[0])
            this._knowledgeBaseService.AddKnowledgeBase({
              group: '',
              subGroup: '',
              url: json.response.PostResponse.Location[0],
              fileName: this.file.name,
              month: new Date().getMonth(),
              year: new Date().getFullYear(),
              type: 'faq',
              description: '',
              active: true
            }).subscribe(response => {
              this.loading = false;

              if (response.status == 'ok') {
                this.faqForm.reset();
                this.showSuccess();
              }
            }, err => {
              this.showError(err);
              this.loading = false;

            })
          }, err => {
            this.showError(err);
            this.loading = false;

          });
        }

      }, err => {
        this.loading = false;
        this.showError(err);
      });
    }, err => {

      this.loading = false;
      this.showError(err);

      Object.keys(err.errorList).map(key => {
        switch (key) {
          case 'typeError':
            if (err.errorList[key]) this.faqForm.get('file').setErrors({ 'typeError': true });
            break;
          case 'nameError':
            if (err.errorList[key]) this.faqForm.get('file').setErrors({ 'nameError': true })
            break;
          case 'requestError':
            if (err.errorList[key]) this.faqForm.get('file').setErrors({ 'requestError': true })
            break;
          case 'folderError':
            if (err.errorList[key]) this.faqForm.get('file').setErrors({ 'folderError': true })
            break;
        }
      })
    });
  }

  Remove(filename) {
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: 'Are you sure you want To delete this file?' }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._knowledgeBaseService.RemoveKnowledgeBase('faq', filename);
      }
    });
  }

  ToggleActivate(filename, active) {
    console.log(filename);
    this._knowledgeBaseService.ToggleActivate('faq', filename, active);
  }

  showError(err) {
    this.snackBar.openFromComponent(ToastNotifications, {
      data: {
        img: 'warning',
        msg: err
      },
      duration: 3000,
      panelClass: ['user-alert', 'error']
    });
  }
  showSuccess() {
    this.snackBar.openFromComponent(ToastNotifications, {
      data: {
        img: 'ok',
        msg: 'File uploaded successfully!'
      },
      duration: 3000,
      panelClass: ['user-alert', 'success']
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._knowledgeBaseService.Destroy();
  }
}
