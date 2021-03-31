import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { EmailTemplateService } from '../../../../../services/LocalServices/EmailTemplateService';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
  selector: 'app-email-template-list',
  templateUrl: './email-template-list.component.html',
  styleUrls: ['./email-template-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmailTemplateListComponent implements OnInit {
  all_templates = [];
  Object = Object;
  currentRoute: string;
  subscriptions: Subscription[] = [];
  buttons: any;
  params: any;
  constructor(private _globalStateService: GlobalStateService, private _emailTemplateService: EmailTemplateService, private dialog: MatDialog) {

    this.subscriptions.push(this._emailTemplateService.AllTemplates.subscribe(data => {
      if (data && data.length) {
        this.all_templates = data;
      }
    }));

    this._globalStateService.currentRoute.subscribe(route => {
      this.currentRoute = route;
    });

  }

  ngOnInit() {
  }
  isEmpty() {
    for (var key in this) {
      if (this.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  DeleteTemplate(id) {
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure want to delete this template?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._emailTemplateService.DeleteTemplate(id);
      }
    });
  }
  EditTemplate(template) {
    console.log(template.sourceType);
    
    this._emailTemplateService.selectedTemplate.next(template);
    // if (template.sourceType.toString() != 'htmlEditor' || template.sourceType.toString() != 'importTemplate'){
    //   console.log("here", this.currentRoute + '/template-options/builder/' +template.sourceType);
      
    //   this._globalStateService.NavigateTo(this.currentRoute + '/template-options/builder/' +template.sourceType);
    //   return;
    // }
    // else {
      switch (template.sourceType) {
        case 'htmlEditor':
          this._globalStateService.NavigateTo(this.currentRoute + '/template-options/htmlEditor');
          break;
        case 'importTemplate':
          this._globalStateService.NavigateTo(this.currentRoute + '/template-options/importTemplate');
          break;
        default:
        this._globalStateService.NavigateTo(this.currentRoute + '/template-options/builder/' +template.sourceType);
      // }
    }
  }
}
