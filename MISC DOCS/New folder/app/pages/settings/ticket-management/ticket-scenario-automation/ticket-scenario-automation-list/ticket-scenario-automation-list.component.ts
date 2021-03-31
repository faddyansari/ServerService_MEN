import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TicketSecnarioAutomationService } from '../../../../../../services/LocalServices/TicketSecnarioAutomationService';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ticket-scenario-automation-list',
  templateUrl: './ticket-scenario-automation-list.component.html',
  styleUrls: ['./ticket-scenario-automation-list.component.css']
})
export class TicketScenarioAutomationListComponent implements OnInit {
  allScenarios = [];
  subscriptions: Subscription[] = [];
  constructor(private _ticketScenarioService: TicketSecnarioAutomationService, private dialog: MatDialog) {
    this.subscriptions.push(this._ticketScenarioService.AllScenarios.subscribe(data => {
      if (data && data.length) {
        this.allScenarios = data;

      }
      else {
        this.allScenarios = [];
      }
    }));
  }

  ngOnInit() {
  }

  cloneScenario(scenario) {
    // console.log(scenario);
    this._ticketScenarioService.cloneScenario.next(true);
    let clonedScenario = JSON.parse(JSON.stringify(scenario))
    clonedScenario.scenarioTitle = "Copy of" + ' ' + clonedScenario.scenarioTitle;
    // console.log(clonedScenario);
    
    this._ticketScenarioService.selectedScenario.next(clonedScenario);
  }
  editScenario(scenario) {
    this._ticketScenarioService.selectedScenario.next(scenario);
  }
  deleteScenario(id) {
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure want to delete this scenario?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._ticketScenarioService.deleteScenario(id);
      }
    });
  }
}
