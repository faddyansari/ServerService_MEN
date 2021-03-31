import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailTemplateService } from '../../../../../services/LocalServices/EmailTemplateService';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
// import { CanComponentDeactivate } from '../../../../../services/ConfirmationGuard';
@Component({
  selector: 'app-import-template',
  templateUrl: './import-template.component.html',
  styleUrls: ['./import-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImportTemplateComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  isDragged = false;
  ShowAttachmentAreaDnd = false;
  files = [];
  LinksArray = [];
  file: any = undefined;
  fileValid = true;
  nsp: string = '';
  template_name = '';
  email: string = '';
  textTarget: any;
  buttons: any;

  subscriptions: Subscription[] = [];
  all_templates = [];
  selectedTemplate = undefined;

  constructor(private _globalStateService: GlobalStateService, private snackBar: MatSnackBar, private dialog: MatDialog, private _emailTemplateService: EmailTemplateService) {
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
      this.buttons = data;
      switch (this.buttons.buttonType) {
        case 'save':
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
        this.selectedTemplate = data;
      }
      else {
        this.selectedTemplate = undefined;
      }
      if (this.selectedTemplate) {
        this.template_name = this.selectedTemplate.templateName;
        this.file = this.selectedTemplate.file;
      }
    }));
  }

  ngOnInit() {
    this.Validation();
    // this.confirm();
  }

  // confirm() {
  //   return !this.file;
  // }

  onFileSelected() {
    this.fileValid = true;
    if (this.fileInput.nativeElement.files.length > 0) {
      this.file = this.fileInput.nativeElement.files;
    }
    this.readURL(this.file);
  }

  readURL(file) {
    if (file) {

      let picReader = new FileReader();
      picReader.addEventListener("load", (event: any) => {
        this.textTarget = event.target.result;
      });
      picReader.readAsText(file[0]);
    }
  }

  RemoveFile() {
    this.file = undefined;
    this.fileInput.nativeElement.value = '';
    this.ShowAttachmentAreaDnd = false;
  }

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
      // Read file and give html to obj
      let html = this.textTarget

      let obj = {
        sourceType: 'importTemplate',
        templateName: this.template_name,
        html: html,
        createdDate: new Date().toISOString(),
        createdBy: this.email,
        nsp: this.nsp,
        lastModified: {},
        file: this.file
      }

      this._emailTemplateService.insertEmailTemplate(obj).subscribe(res => {
        if (res.status == "ok") {
          this.ShowAttachmentAreaDnd = false;
          this.fileInput.nativeElement.value = '';
          this.file = undefined;
          this.template_name = '';
          this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
        }
      });
    }
  }

  UpdateTemplate() {

    // Read file and give html to obj
    let html = this.textTarget

    let obj = {
      sourceType: 'importTemplate',
      templateName: this.template_name,
      html: html,
      createdDate: '',
      createdBy: '',
      nsp: this.nsp,
      lastModified: {},
      file: this.file
    }

    this._emailTemplateService.UpdateTemplate(this.selectedTemplate._id, obj).subscribe(res => {
      if (res.status == "ok") {
        this.ShowAttachmentAreaDnd = false;
        this.fileInput.nativeElement.value = '';
        this.file = undefined;
        this.template_name = '';
        this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
      }
    });

  }

  Cancel() {
    if (this.template_name || this.file) {
      this.dialog.open(ConfirmationDialogComponent, {
        panelClass: ['confirmation-dialog'],
        data: { headermsg: 'Are you sure want to exit?' }
      }).afterClosed().subscribe(data => {
        if (data == 'ok') {
          this._emailTemplateService.selectedTemplate.next(undefined);
          this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
        }
      });
    }
    else {
      console.log('impor else');
      
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
