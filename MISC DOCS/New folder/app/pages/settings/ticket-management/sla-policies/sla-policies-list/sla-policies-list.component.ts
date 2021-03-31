import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { SLAPoliciesService } from '../../../../../../services/LocalServices/SLAPoliciesService';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sla-policies-list',
  templateUrl: './sla-policies-list.component.html',
  styleUrls: ['./sla-policies-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SlaPoliciesListComponent implements OnInit {
  isDragged = false;
  random = Math.random();
  subscriptions: Subscription[] = [];
  allSLAPolicies = [];
  reOrderEnable = false;
  constructor(private dialog: MatDialog, public snackBar: MatSnackBar, private _slaPolicyService: SLAPoliciesService) {
    this.subscriptions.push(this._slaPolicyService.AllSLAPolicies.subscribe(data => {
      if (data && data.length) {
        this.allSLAPolicies = data;
      }
      else {
        this.allSLAPolicies = [];
      }
    }));

    this.subscriptions.push(this._slaPolicyService.reOrderPolicy.subscribe(data => {
      this.reOrderEnable = data;
    }));
  }

  ngOnInit() {

  }


  editPolicy(policy) {
    this._slaPolicyService.selectedSLAPolicy.next(policy);

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
      this._slaPolicyService.changeInReorder.next(true);
      this._slaPolicyService.reOrder(id, this.allSLAPolicies[index - 1].order, this.allSLAPolicies[index - 1]._id, order);

    }
  }

  moveDown(id, index, order) {
    if (index === this.allSLAPolicies.length - 1) {
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
      this._slaPolicyService.changeInReorder.next(true);
      this._slaPolicyService.reOrder(id, this.allSLAPolicies[index + 1].order, this.allSLAPolicies[index + 1]._id, order);

    }
  }


  deletePolicy(id) {
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure want to delete this SLA policy?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._slaPolicyService.deleteSLAPolicy(id);

      }
    });
  }

  toggleActivation(id, flag) {
    this._slaPolicyService.toggleSLAPolicyActivation(id, flag).subscribe(res => {
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
