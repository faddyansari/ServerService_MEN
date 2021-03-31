import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AssignmentAutomationSettingsService } from '../../../../../services/LocalServices/AssignmentRuleService';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../../services/AuthenticationService';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rulesets-list',
  templateUrl: './rulesets-list.component.html',
  styleUrls: ['./rulesets-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RulesetsListComponent implements OnInit {

  subscriptions: Subscription[] = [];
  public rulesList = [];
  searchValue = '';
  rulesetPermissions: any;
  rulesMap: any = {};

  constructor(private _assignmentRuleService: AssignmentAutomationSettingsService,
    public formbuilder: FormBuilder, public dialog: MatDialog, private _authService: AuthService, public snackBar: MatSnackBar) {

    this.subscriptions.push(_assignmentRuleService.RuleSetList.subscribe(list => {
      //console.log(list);
      if (list && list.length) {
        this.rulesList = list;
        this.UpdateRulesMap(list)
      }
    }));
    this.subscriptions.push(_authService.getSettings().subscribe(data => {
      if (data && data.permissions) {
        // console.log(data);

      }

    }));

  }

  UpdateRulesMap(list: Array<any>) {
    list.map(rule => {
      if (this.rulesMap[rule._id] == undefined) {
        this.rulesMap[rule._id] = {};
      }

      if (!this.rulesMap[rule._id].selected) {
        this.rulesMap[rule._id].selected = false;
        this.rulesMap[rule._id] = JSON.parse(JSON.stringify(rule));
      }
    })

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  DeleteRule(id: string) {
    // console.log(id);

    event.preventDefault();

    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: 'Are You Sure You Want To Delete the Assignment Rule' }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._authService.setRequestState(true);

        this._assignmentRuleService.DeleteNewRule({ id: id }).subscribe(data => {

          if (data.status == 'ok') {
            this._authService.setRequestState(false);

            this.snackBar.openFromComponent(ToastNotifications, {
              data: { img: 'ok', msg: 'Assignment Rule Deleted Successfully' },
              duration: 3000,
              panelClass: ['user-alert', 'success']
            });

          }
        },
          err => {
            this.snackBar.openFromComponent(ToastNotifications, {
              data: { img: 'warning', msg: 'Cannot Delete Assignment Rule' },
              duration: 3000,
              panelClass: ['user-alert', 'error']
            });
          })

      }
    })
  }

  public ToggleActivation(id, activation) {
    // for enabling and disabling rule
    // console.log(activation);

    this._assignmentRuleService.ToggleActivation(id, activation).subscribe(response => {
      // console.log(response);

      if (response.status == 'ok') {
        this.snackBar.openFromComponent(ToastNotifications, {
          data: {
            img: 'ok', msg: 'RuleSet ' + ((activation) ? 'Enabled' : 'Disabled') + ' Successfully'
          },
          duration: 3000,
          panelClass: ['user-alert', 'success']
        });
      }
    })
  }

  public EditRule(ruleset) {
    // console.log(ruleset);

    this._assignmentRuleService.selectedRule.next(ruleset);
    this._assignmentRuleService.addingRule.next(true)
  }

}
