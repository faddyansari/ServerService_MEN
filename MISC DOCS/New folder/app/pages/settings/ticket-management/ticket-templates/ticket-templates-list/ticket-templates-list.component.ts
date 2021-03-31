import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TicketTemplateSevice } from '../../../../../../services/LocalServices/TicketTemplateService';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ticket-templates-list',
  templateUrl: './ticket-templates-list.component.html',
  styleUrls: ['./ticket-templates-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TicketTemplatesListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  allTemplates = [];
  constructor( private _ticketTemplateService: TicketTemplateSevice,private dialog: MatDialog) {
    this.subscriptions.push(this._ticketTemplateService.AllTemplates.subscribe(data => {
      if (data && data.length) {
        this.allTemplates = data;

      }
      else {
        this.allTemplates = [];
      }
    }));

  }

  editTemplate(template){
    this._ticketTemplateService.selectedTemplate.next(template);
  }

  deleteTemplate(id){
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure want to delete this ticket template?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._ticketTemplateService.DeleteTicketTemplate(id);
      }
    });
  }

  cloneTemplate(template){
    this._ticketTemplateService.cloneTemplate.next(true);
    let clonedTemplate = JSON.parse(JSON.stringify(template))
    clonedTemplate.templateName = "Copy of" + ' ' + clonedTemplate.templateName;
    template.message = '';
    this._ticketTemplateService.selectedTemplate.next(clonedTemplate);
  }

  ngOnInit() {
  }

}
