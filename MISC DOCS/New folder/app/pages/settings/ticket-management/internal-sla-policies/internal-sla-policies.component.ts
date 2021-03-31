import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { SLAPoliciesService } from '../../../../../services/LocalServices/SLAPoliciesService';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';

@Component({
  selector: 'app-internal-sla-policies',
  templateUrl: './internal-sla-policies.component.html',
  styleUrls: ['./internal-sla-policies.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InternalSlaPoliciesComponent implements OnInit {
  email = '';
  nsp = '';
  selectedInternalPolicy = undefined;
  InternalpolicyObject = undefined;
  allInternalSLAPolicies = [];
  subscriptions: Subscription[] = [];
  addInternalPolicy = false;
  reOrderEnable = false;
  changeInReorder = false;
  constructor(private _appStateService: GlobalStateService, private _slaPolicyService: SLAPoliciesService, public snackBar: MatSnackBar) {
    this.nsp = this._slaPolicyService.Agent.nsp;
    this.email = this._slaPolicyService.Agent.email;
    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Ticket Management');

    this.subscriptions.push(this._slaPolicyService.AddInternalSLAPolicy.subscribe(data => {
      this.addInternalPolicy = data;
    }));

    this.subscriptions.push(this._slaPolicyService.changeInReorderInt.subscribe(data => {
      if (data) {
        this.changeInReorder = data;
      }
    }));

    this.subscriptions.push(this._slaPolicyService.selectedInternalSLAPolicy.subscribe(data => {
      this.selectedInternalPolicy = data;

    }));
    this.subscriptions.push(this._slaPolicyService.reOrderIntPolicy.subscribe(data => {
      this.reOrderEnable = data;

    }));
    this.subscriptions.push(this._slaPolicyService.AllInternalSLAPolicies.subscribe(data => {
      if (data && data.length) {
        this.allInternalSLAPolicies = data;
      }
      else {
        this.allInternalSLAPolicies = [];
      }
    }));

    this.InternalpolicyObject = {
      nsp: '',
      policyName: '',
      policyDesc: '',
      operator: "or",
      operations: [{ operationName: '', operationValue: [], regex: '' }],
      policyTarget: [
        {
          priority: 'Urgent',
          // operator:'OR',
          // operation:[],
          TimeKey: '15',
          TimeVal: 'mins',
          emailActivationEscalation: true,
          emailActivationReminder: true
        },
        {
          priority: 'High',
          // operator:'OR',
          // operation:[],
          TimeKey: '15',
          TimeVal: 'mins',
          emailActivationEscalation: true,
          emailActivationReminder: true
        },
        {
          priority: 'Medium',
          // operator:'OR',
          // operation:[],
          TimeKey: '15',
          TimeVal: 'mins',
          emailActivationEscalation: true,
          emailActivationReminder: true
        },
        {
          priority: 'Low',
          TimeKey: '15',
          TimeVal: 'mins',
          emailActivationEscalation: true,
          emailActivationReminder: true
        }],
      policyApplyTo: [{ name: '', value: [] }],
      reminder: [{ timeKey: '15', timeVal: 'mins', emails: [], notifyTo: ['Assigned Agent'] }],
      escalation: [{ duration: '', emails: [], notifyTo: ['Assigned Agent'] }],
      activated: false,
      created: { date: new Date().toISOString(), by: this.email },
      lastModified: { date: '', by: '' },
    };
  }

  ngOnInit() {
  }

  AddInternalSLAPolicy() {
    this._slaPolicyService.reOrderIntPolicy.next(false);
    this._slaPolicyService.AddInternalSLAPolicy.next(true);
  }


  SaveReorder() {
    this.snackBar.openFromComponent(ToastNotifications, {
      data: {
        img: 'ok',
        msg: 'Policies reordered successfully!'
      },
      duration: 2000,
      panelClass: ['user-alert', 'success']
    });
    this._slaPolicyService.reOrderIntPolicy.next(false);
  }
  CancelReorder() {
    this._slaPolicyService.reOrderIntPolicy.next(false);
  }
  ReorderSLAPolicy() {
    this._slaPolicyService.reOrderIntPolicy.next(true);
  }
  ngOnDestroy() {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }
}
