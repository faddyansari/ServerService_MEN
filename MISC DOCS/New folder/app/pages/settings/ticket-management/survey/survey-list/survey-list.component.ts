import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SurveyService } from '../../../../../../services/LocalServices/SurveyService';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SurveyListComponent implements OnInit {
  allSurveys = [];
  subscriptions: Subscription[] = [];
  constructor(private _surveyService: SurveyService, private dialog: MatDialog) {
    this.subscriptions.push(this._surveyService.AllSurveys.subscribe(data => {
      if (data && data.length) {
        this.allSurveys = data;
      }
      else {
        this.allSurveys = [];
      }
    }));
  }

  ngOnInit() {
  }

  editSurvey(survey) {
    this._surveyService.selectedSurvey.next(survey);
  }

  deleteSurvey(id) {
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure want to delete this survey?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        this._surveyService.deleteSurvey(id);
      }
    });
  }

  toggleActivation(id, flag) {
    this.allSurveys.forEach(val => {
      if (val.activated && val._id != id) {
        val.activated = false;
        return;
      }
      else {
        this._surveyService.toggleActivation(id, flag).subscribe(res => {

        });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }
}
