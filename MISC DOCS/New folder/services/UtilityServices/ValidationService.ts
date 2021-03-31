// Angular Imports
import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

//RxJs Imports
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { AuthService } from "../AuthenticationService";
import { TicketsService } from "../TicketsService";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/switchMap';

@Injectable()

export class ValidationService {

  //Declarations

  public automatedResForm: FormGroup;
  public tagForm: FormGroup
  subscriptions: Subscription[] = [];

  automatedMessagesList = [];
  formList = [];
  constructor(private http: Http, private _authService: AuthService, private _ticketService: TicketsService) {
 
  }

  //checks if particular email already exists
  public isEmailUnique(control: FormControl) {
    console.log('Checking Email Unique');
    return Observable.timer(2000).switchMap(() => {
      return this._authService.ValidateEmail(control.value)
        .mapTo(null)
        .catch(err => Observable.of({
          isEmailUnique: true
        }));
    });
  }

  //checks if particular entered number already exists
  public NumbersOnly(event: any) {
    const pattern = /[0-9\-]+/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {

      // invalid character, prevent input
      event.preventDefault();
    }
  }
  //checks if particular website already exists
  isWebsiteUnique(control: FormControl) {
    console.log('Checking Website Unique');
    this._authService.setRequestState(true);
    return Observable.timer(1000).switchMap(() => {
      return this._authService.ValidateWebsite(control.value.replace(/(www\.)?/ig, ''))
        .mapTo(null)
        .catch(err => Observable.of({ isWebsiteUnique: true }));
    });
  }


  //checks if tag is present or not?
  CheckTag(control: FormControl): Observable<any> {
    let hashTag = this.automatedResForm.get('hashTag');
    if (this.automatedMessagesList.length == 0) {
      return Observable.of(null);
    } else {
      for (let i = 0; i < this.automatedMessagesList.length; i++) {
        if (this.automatedMessagesList[i].hashTag == hashTag.value) {
          return Observable.of({ 'matched': true })
        } else {
          return Observable.of(null);
        }
      }
    }

  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this._ticketService.setSelectedThread(undefined);
    // this.subscriptions.forEach(subscription => {
    //   subscription.unsubscribe();
    // })
  }
  //end of service
}










