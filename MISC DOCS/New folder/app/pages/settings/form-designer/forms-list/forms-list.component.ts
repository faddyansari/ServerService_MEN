import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormDesignerService } from '../../../../../services/LocalServices/FormDesignerService';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormsListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  Forms = [];
  constructor(private _formDesignerService: FormDesignerService, private dialog: MatDialog) {
    this.subscriptions.push(this._formDesignerService.WholeForm.subscribe(data => {
      if (data && data.length) {
        this.Forms = data;
        // console.log(this.Forms);
      }
    }));

  }

  ngOnInit() {

  }

  public EditForm(form) {
    this._formDesignerService.selectedForm.next(form);
  }

  public DeleteForm(id) {
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure want to delete this form?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._formDesignerService.DeleteForm(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    // this._formDesignerService.Destroy();

  }
}
