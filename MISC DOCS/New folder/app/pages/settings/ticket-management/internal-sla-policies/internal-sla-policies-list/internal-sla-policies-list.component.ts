import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SLAPoliciesService } from '../../../../../../services/LocalServices/SLAPoliciesService';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';

@Component({
  selector: 'app-internal-sla-policies-list',
  templateUrl: './internal-sla-policies-list.component.html',
  styleUrls: ['./internal-sla-policies-list.component.css']
})
export class InternalSlaPoliciesListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  allIntPolicies = [];
  reOrderEnable = false;
  constructor(private dialog: MatDialog, public snackBar: MatSnackBar, private _slaPolicyService: SLAPoliciesService) {
    this.subscriptions.push(this._slaPolicyService.AllInternalSLAPolicies.subscribe(data => {
      if (data && data.length) {
        this.allIntPolicies = data;
      }
      else {
        this.allIntPolicies = [];
      }
    }));

    this.subscriptions.push(this._slaPolicyService.reOrderIntPolicy.subscribe(data => {
      this.reOrderEnable = data;
    }));
  }
  ngOnInit() {
  }

  editPolicy(policy) {
    this._slaPolicyService.selectedInternalSLAPolicy.next(policy);

  }

  ReorderSLAPolicy() {
    this.reOrderEnable = true;
  }

  DoneReorder() {
    this.reOrderEnable = false;
    this.snackBar.openFromComponent(ToastNotifications, {
      data: {
        img: 'ok',
        msg: 'Policies reordered successfully!'
      },
      duration: 2000,
      panelClass: ['user-alert', 'success']
    });
  }
  CancelReorder() {
    this.reOrderEnable = false;
  }

  moveUp(id, index, order) {
    if (index == 0) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'No policies above, Not allowed!'
        },
        duration: 2000,
        panelClass: ['user-alert', 'warning']
      });
      return;
    }
    else {
      this._slaPolicyService.changeInReorderInt.next(true);
      this._slaPolicyService.reOrderInternalSLA(id, this.allIntPolicies[index - 1].order, this.allIntPolicies[index - 1]._id, order);

    }
  }

  moveDown(id, index, order) {
    if (index === this.allIntPolicies.length - 1) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'No policy to swap down, Not allowed!!'
        },
        duration: 2000,
        panelClass: ['user-alert', 'warning']
      });
      return;
    }
    else {
      this._slaPolicyService.changeInReorderInt.next(true);
      this._slaPolicyService.reOrderInternalSLA(id, this.allIntPolicies[index + 1].order, this.allIntPolicies[index + 1]._id, order);

    }
  }


  deletePolicy(id) {
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure want to delete this SLA policy?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._slaPolicyService.deleteInternalSLAPolicy(id);

      }
    });
  }

  toggleActivation(id, flag) {
    this._slaPolicyService.toggleInternalSLAPolicyActivation(id, flag).subscribe(res => {
      if (res.status == "ok") {
      }

    });
  }

  ngOnDestroy() {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

}
