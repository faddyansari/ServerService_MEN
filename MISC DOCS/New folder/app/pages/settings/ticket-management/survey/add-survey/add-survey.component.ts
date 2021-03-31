import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SurveyService } from '../../../../../../services/LocalServices/SurveyService';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSurveyComponent implements OnInit {
  @Input() SurveyObject: any;
  public surveyForm: FormGroup;
  SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
  whiteSpace = /^[^-\s][a-zA-Z0-9_\s-]+$/;
  subscriptions: Subscription[] = [];
  selectedSurvey = undefined;
  editCase = false;
  addTrue = false;
  changebasic = false;
  changeadd = false;
  nsp = '';
  email = '';
  RadioOptionsBasic = [];
  RadioOptionsAdd = [];
  allSurveys = [];
  defaultValues = [];
  showOptions: any;
  formChanges: any;
  constructor(private formbuilder: FormBuilder, private _surveyService: SurveyService, private dialog: MatDialog, public snackBar: MatSnackBar) {

    this.nsp = this._surveyService.Agent.nsp;
    this.email = this._surveyService.Agent.email;
    this.subscriptions.push(this._surveyService.selectedSurvey.subscribe(data => {
      if (data) {
        this.selectedSurvey = data;
        this.subscriptions.push(this._surveyService.DefaultJSON.subscribe(response => {
          if (response) {
            this.defaultValues = response;
          }
        }));
        this.subscriptions.push(this._surveyService.CheckIfSurveyIsInTicket(this.selectedSurvey._id).subscribe(res => {
          if (res && res.exists) {
            this.editCase = true;
            this.snackBar.openFromComponent(ToastNotifications, {
              data: {
                img: 'warning',
                msg: 'Since this survey is already been sent in ticket,so point scale and no. of questions cannot be altered. However, you can rephrase the questions and answer choices.'
              },
              duration: 10000,
              panelClass: ['user-alert', 'warning']
            });
          }
          else {
            this.editCase = false;
          }
        }));

        if (this.selectedSurvey.AdditionalQuestions.length) {
          this.addTrue = true;
        }
        else {
          this.addTrue = false;
        }
      }
      else {
        this.selectedSurvey = undefined;
      }
    }));

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
    this.surveyForm = this.formbuilder.group({
      'surveyName': [this.SurveyObject.surveyName,
      [
        Validators.required,
        Validators.minLength(2)
      ]
      ],

      'criteria': [this.SurveyObject.criteria],

      'basicQuestion': [this.SurveyObject.basicQuestion, [Validators.required, Validators.minLength(2)]],
      'pointScaleBasic': [this.SurveyObject.pointScaleBasic, []],

      'AdditionalQuestions': this.formbuilder.array(this.TransformQuestions(this.SurveyObject.AdditionalQuestions)),
      'pointScaleAdd': [this.SurveyObject.pointScaleAdd, []],

      'commentBox': [this.SurveyObject.commentBox, []],
      'thankyouMessage': [this.SurveyObject.thankyouMessage, []
      ],
      'additionalDetails': [this.SurveyObject.additionalDetails, []
      ],
      'sendWhen': [this.SurveyObject.sendWhen, []],
      'activated': [this.SurveyObject.activated, []]

    });
    this.RadioOptionsBasic = JSON.parse(JSON.stringify(this.SurveyObject.RatingLabelBasic));
    this.RadioOptionsAdd = JSON.parse(JSON.stringify(this.SurveyObject.RatingLabelAdd));
    this.onValueChanges();
  }

  onValueChanges() {
    this.surveyForm.valueChanges.subscribe(val => {
      this.formChanges = val;
    })
  }

  GetRadioDataBasic(value) {
    if (this.selectedSurvey && this.changebasic) {
      return this.defaultValues.filter(r => r.ForRadio.includes(value));
    } else {
      return this.RadioOptionsBasic.filter(r => r.ForRadio.includes(value));
    }
  }

  changeBasic(ev) {
    if (ev.target.value) this.changebasic = true;
    else this.changebasic = false;
  }

  changeAdd(ev) {
    if (ev.target.value) this.changeadd = true;
    else this.changeadd = false;

  }

  GetRadioDataAdd(value) {
    if (this.selectedSurvey && this.changeadd) {
      return this.defaultValues.filter(r => r.ForRadio.includes(value));
    } else {
      return this.RadioOptionsAdd.filter(r => r.ForRadio.includes(value));
    }
  }

  GetControls(name: string) {
    return (this.surveyForm.get(name) as FormArray).controls;
  }

  removeAdditionalQuestion() {
    while ((this.surveyForm.get('AdditionalQuestions') as FormArray).length !== 0) {
      (this.surveyForm.get('AdditionalQuestions') as FormArray).removeAt(0)
    }
    this.addTrue = false;
  }

  TransformQuestions(questions?: Array<any>): FormGroup[] {
    let fb: FormGroup[] = [];
    questions.map(ques => {
      fb.push(this.formbuilder.group({
        question: [ques.question]
      }));
    });

    return fb;
  }

  addAdditionalQuestion() {
    this.addTrue = true;
  }

  addQuestion() {
    let val = this.formbuilder.group({
      question: ['', []]
    });

    let form = this.surveyForm.get('AdditionalQuestions') as FormArray
    form.push(val);
  }

  deleteQuestion(index) {
    let questions = this.surveyForm.get('AdditionalQuestions') as FormArray;
    questions.removeAt(index);

    if (questions.length == 0) {
      this.addTrue = false;
    }
  }

  moveUp(index: number) {
    if (index >= 1) {
      this.swap((this.surveyForm.controls.AdditionalQuestions as FormArray).controls, index, index - 1)
    }
    else {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'No question above, Not allowed!'
        },
        duration: 2000,
        panelClass: ['user-alert', 'warning']
      });
    }
  }

  moveDown(index: number) {
    if (index < (this.surveyForm.get('AdditionalQuestions') as FormArray).length - 1) {
      this.swap((this.surveyForm.controls.AdditionalQuestions as FormArray).controls, index, index + 1)
    }
    else {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'No question below, Not allowed!'
        },
        duration: 2000,
        panelClass: ['user-alert', 'warning']
      });
    }
  }

  swap(array: any[], index1: any, index2: any) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  ChangeRatings() {
    this.RadioOptionsBasic.reverse();
    this.RadioOptionsAdd.reverse();
  }

  AddSurvey() {
    if (this.allSurveys && this.allSurveys.filter(data => data.surveyName.toLowerCase().trim() == this.surveyForm.get('surveyName').value.toLowerCase().trim()).length > 0) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'Survey name already exists!'
        },
        duration: 3000,
        panelClass: ['user-alert', 'warning']
      });
      return;
    }
    else {
      let survey = {
        surveyName: this.surveyForm.get('surveyName').value,
        nsp: this.nsp,
        criteria: this.surveyForm.get('criteria').value,

        basicQuestion: this.surveyForm.get('basicQuestion').value,
        pointScaleBasic: this.surveyForm.get('pointScaleBasic').value,
        RatingLabelBasic: this.RadioOptionsBasic.filter(r => r.ForRadio.includes(this.surveyForm.get('pointScaleBasic').value)),

        AdditionalQuestions: this.ParseQuestions(this.surveyForm.get('AdditionalQuestions') as FormArray),
        pointScaleAdd: this.surveyForm.get('pointScaleAdd').value,
        RatingLabelAdd: this.RadioOptionsAdd.filter(r => r.ForRadio.includes(this.surveyForm.get('pointScaleAdd').value)),

        thankyouMessage: this.surveyForm.get('thankyouMessage').value,
        commentBox: this.surveyForm.get('commentBox').value,
        additionalDetails: this.surveyForm.get('additionalDetails').value,
        sendWhen: this.surveyForm.get('sendWhen').value,
        activated: false,
        created: { date: new Date().toISOString(), by: this.email },
      }
      // console.log(survey);

      this._surveyService.addSurvey(survey).subscribe(res => {
        if (res.status == "ok") {
        }
      });
    }
  }

  ParseQuestions(questions) {
    let ques = [];
    // console.log(questions);
    questions.controls.map(control => {
      if (control.get('question').value != '') {
        let obj = {
          question: control.get('question').value
        }
        ques.push(obj);
      }
      else {
        ques = [];
      }
    })
    return ques;
  }

  DetectChangeBasic(event) {
    if (event.target.value) {
      this.showOptions = this.GetRadioDataBasic(event.target.value);
      this.getOptions();
    }
  }

  getOptions(index?) {
    // console.log(index);

    return this.showOptions[index].name
  }

  UpdateSurvey() {
    // console.log(this.SurveyObject.activated);

    let Updatedsurvey = {
      surveyName: this.surveyForm.get('surveyName').value,
      nsp: this.nsp,
      criteria: this.surveyForm.get('criteria').value,

      basicQuestion: this.surveyForm.get('basicQuestion').value,
      pointScaleBasic: this.surveyForm.get('pointScaleBasic').value,
      RatingLabelBasic: this.RadioOptionsBasic.filter(r => r.ForRadio.includes(this.surveyForm.get('pointScaleBasic').value)),

      AdditionalQuestions: this.ParseQuestions(this.surveyForm.get('AdditionalQuestions') as FormArray),
      pointScaleAdd: this.surveyForm.get('pointScaleAdd').value,

      RatingLabelAdd: this.RadioOptionsAdd.filter(r => r.ForRadio.includes(this.surveyForm.get('pointScaleAdd').value)),

      thankyouMessage: this.surveyForm.get('thankyouMessage').value,
      commentBox: this.surveyForm.get('commentBox').value,
      additionalDetails: this.surveyForm.get('additionalDetails').value,
      sendWhen: this.surveyForm.get('sendWhen').value,
      activated: this.SurveyObject.activated,
      created: this.SurveyObject.created,
    }
    // console.log(Updatedsurvey);

    this.subscriptions.push(this._surveyService.updateSurvey(this.selectedSurvey._id, Updatedsurvey).subscribe(response => {
      if (response.status == 'ok') {
      }
    }));
  }

  CancelSurvey() {
    if(this.formChanges){
      this.dialog.open(ConfirmationDialogComponent, {
        panelClass: ['confirmation-dialog'],
        data: { headermsg: 'Are you sure want to leave?' }
      }).afterClosed().subscribe(data => {
        if (data == 'ok') {
          this._surveyService.AddSurvey.next(false);
          this._surveyService.selectedSurvey.next(undefined);
        } else {
          return;
        }
      });
    }
    else{
      this._surveyService.AddSurvey.next(false);
      this._surveyService.selectedSurvey.next(undefined);
    }
  }

  ngOnDestroy() {
    this._surveyService.AddSurvey.next(false);
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }
}
