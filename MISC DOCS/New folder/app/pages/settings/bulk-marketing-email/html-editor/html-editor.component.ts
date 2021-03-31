import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EmailTemplateService } from '../../../../../services/LocalServices/EmailTemplateService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
// import { CanComponentDeactivate } from '../../../../../services/ConfirmationGuard';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HtmlEditorComponent implements OnInit {
  shiftdown = false;
  template_name = '';
  currentRoute: string;
  nsp: string = '';
  email: string = '';
  all_templates = [];
  subscriptions: Subscription[] = [];
  selectedtemplate = undefined;
  buttons = undefined;
  accessRoute: any

  codeMirrorOptions: any = {
		theme: 'base16-light',
		mode: { name: 'javascript' },
		lineNumbers: true,
		lineWrapping: true,
		foldGutter: true,
		gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
		autoCloseBrackets: true,
		matchBrackets: true,
		lint: true
    };
    
    previewCode='';
 
  constructor(private _globalStateService: GlobalStateService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private _emailTemplateService: EmailTemplateService) {
    this.nsp = this._emailTemplateService.Agent.nsp;
    this.email = this._emailTemplateService.Agent.email;
    this.subscriptions.push(this._emailTemplateService.AllTemplates.subscribe(data => {
      if (data && data.length) {
        this.all_templates = data;
      }
    }));
    this.subscriptions.push(this._emailTemplateService.ButtonPressed.subscribe(data => {

      console.log(data);
      
      this.buttons = data;
      switch (this.buttons.buttonType) {
        case 'save':
          this.SaveTemplate();
          break;
        case 'saveAsNew':
          this.SaveTemplate();
          break;
        case 'cancel':
          this.Cancel();
          break;
        case 'update':
          this.UpdateTemplate();
          break;

      }
    }));

    this.subscriptions.push(this._emailTemplateService.selectedTemplate.subscribe(data => {
      if (data) {
        console.log(data);
        
        this.selectedtemplate = data;
        this.template_name = this.selectedtemplate.templateName;
        this.previewCode = this.selectedtemplate.code;
      }
      else {
        this.selectedtemplate = undefined;
      }
    }));
  }

  ngOnInit() {
    this.Validation();
    // this.confirm();
  }

  AllValidations() {
    return !(this.previewCode.replace(/&nbsp;|<br>|<\/br>/g, ' ').trim() && this.template_name && this.previewCode.replace(/<\/?((?!(b|i|u|br|img|iframe)\b)\w*)\/?>/g, ' ').trim());
  }

  // ChangeRoute() {
  // this.confirm();
  // }

  Validation() {
    if (!this.template_name) {
      setTimeout(() => {
        this._emailTemplateService.validation.next({
          buttonType: 'save',
          disabled: true
        })
      }, 0)
    }
    else {
      setTimeout(() => {
        this._emailTemplateService.validation.next({
          buttonType: 'save',
          disabled: false
        })
      }, 0)
    }
  }

  SaveTemplate() {
    var span = document.createElement('span');
    span.innerHTML = this.previewCode;
    
    if (this.all_templates && this.all_templates.filter(data => data.templateName == this.template_name.toLowerCase()).length > 0) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'Same Template Name already exists! Kindly change it'
        },
        duration: 3000,
        panelClass: ['user-alert', 'error']
      });
      return;
    }
    else {
      let obj = {
        sourceType: 'htmlEditor',
        templateName: this.template_name,
        nsp: this.nsp,
        html: span.innerText,
        lastModified: {},
        code:this.previewCode,
        createdDate: new Date().toISOString(),
        createdBy: this.email
      }
      
      this._emailTemplateService.insertEmailTemplate(obj).subscribe(res => {
        if (res.status == "ok") {
          this.previewCode = '';
          this.template_name = '';
          this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
        }
      });
    }
  }

  // confirm() {
  //   return !this.htmlString;
  // }

  UpdateTemplate() {
    var span = document.createElement('span');
    span.innerHTML = this.previewCode;
    let obj = {
      sourceType: 'htmlEditor',
      templateName: this.template_name,
      nsp: this.nsp,
      html: span.innerText,
      code:this.previewCode,
      lastModified: {},
      createdDate:this.selectedtemplate.createdDate,
      createdBy: this.selectedtemplate.createdBy
    }

    this._emailTemplateService.UpdateTemplate(this.selectedtemplate._id, obj).subscribe(response => {
      if (response.status == "ok") {
        this.template_name = '';
        this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
      }
    });
  }


  Cancel() {
      if (this.template_name || this.previewCode) {
        this.dialog.open(ConfirmationDialogComponent, {
          panelClass: ['confirmation-dialog'],
          data: { headermsg: 'Are you sure want to exit?' }
        }).afterClosed().subscribe(data => {
          if (data == 'ok') {
              this._emailTemplateService.selectedTemplate.next(undefined);
              this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
          } else {
            return;
          }
  
        });
      }
      else {
        console.log('html eidtor else');
        this._emailTemplateService.selectedTemplate.next(undefined);
        this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
      }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
    this._emailTemplateService.selectedTemplate.next(undefined);

  }
}
