import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
declare var $: any;
import { GlobalStateService } from '../../../services/GlobalStateService';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, Form, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../services/AuthenticationService';
import { ValidationService } from '../../../services/UtilityServices/ValidationService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-registeration-form-dialog',
  templateUrl: './registeration-form-dialog.component.html',
  styleUrls: ['./registeration-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterationFormDialogComponent implements OnInit, AfterViewInit {

  @ViewChild("website") _websiteElemRef: ElementRef;


  loading: boolean;
  disable: boolean = false;
  server: string;


  public regForm: FormGroup;
  public working = false;
  private subscriptions: Subscription[] = [];
  private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private NumbersOnlyPatter = /^[0-9\-]+$/;

  constructor(private http: Http,
    private _routeService: GlobalStateService,
    private _router: Router,
    private formbuilder: FormBuilder,
    private _authService: AuthService,
    public _validationService: ValidationService,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RegisterationFormDialogComponent>) {


    this.subscriptions.push(this._authService.RestServiceURL.subscribe(serverAddress => {
      this.server = serverAddress;
    }));

    this.subscriptions.push(this._authService.getRequestState().subscribe(data => {
      this.loading = data;
    }));

    this.regForm = formbuilder.group({
      'full_name': [null, Validators.required],

      'username': [null, Validators.required],

      'email': [null,
        [
          Validators.required,
          Validators.pattern(this.emailPattern)
        ],
        this._validationService.isEmailUnique.bind(this)
      ]
      ,


      'password': [null,
        [
          Validators.required,
          Validators.minLength(8)
        ],
        this.isConfirmPassword.bind(this)
      ],

      'pswd_again': [null,
        [
          Validators.required,
          Validators.minLength(8)
        ],
        this.isConfirmPasswordAgain.bind(this)
      ],

      'website': [null,
        [
          Validators.required,
          //Regex Changed For Engro
          Validators.pattern(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?|((http|https):\/\/[a-zA-Z0-9\S]*|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?$/gmi)
         // Validators.pattern(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i)
        ],
        this._validationService.isWebsiteUnique.bind(this)
      ],

      'company_size': [''],

      'company_type': [''],

      'country_name': [null, Validators.required],

      'phone_no': ['',
        [
          Validators.pattern(/^[0-9\-]+$/)
        ]
      ],
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }


  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

     //checks if password is confirmed
     isConfirmPassword(control: FormControl) {
      let confirmPassword = this.regForm.get('pswd_again');
      if (control.value != confirmPassword.value) {
       confirmPassword.setErrors({ 'noMatch': true })
          }
   if (control.value == confirmPassword.value) {
      confirmPassword.updateValueAndValidity();
   }
   return Observable.of(null);
   }

   //confirm password validation
  isConfirmPasswordAgain(control: FormControl) {
    let password = this.regForm.get('password')
    if (password.value != control.value) {
      return Observable.of({ 'noMatch': true });
    } else {
      return Observable.of(null);
    }
  }




  submitForm(form: Form) {
    if (this.regForm.valid) {
      this._authService.setRequestState(true);
      let urlFormat = this.regForm.get('website').value.replace(/(www\.)?/ig, '');
      this.subscriptions.push(this.http.post(this.server + "/register/company/", {
        companyprofile: {
          email: this.regForm.get('email').value,
          username: this.regForm.get('username').value,
          full_name: this.regForm.get('full_name').value,
          password: this.regForm.get('password').value,
          country: this.regForm.get('country_name').value,
          phone_no: this.regForm.get('phone_no').value,
          company_info: {
            company_size: this.regForm.get('company_size').value,
            company_type: this.regForm.get('company_type').value,
            company_website: urlFormat
          }
        }
      }, { withCredentials: true }).subscribe(response => {
        this._authService.setRequestState(false);
        this.dialogRef.close({ error: null, msg: "Successfull" });
      }, err => {
        if (err.status == 403) {
          this._authService.setRequestState(false);
          this.snackBar.open("Company Already Registered", null, {
            duration: 3000,
            panelClass: ['user-alert', 'error']
          });
          this._websiteElemRef.nativeElement.focus();
          this.regForm.get('website').valid == false;
        }
      }));
    }

  }

}
