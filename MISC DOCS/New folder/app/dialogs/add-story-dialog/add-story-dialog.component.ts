import { Component, OnInit, ViewEncapsulation, Directive } from '@angular/core';
import { AfterViewInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../../../services/SocketService';
import { AuthService } from '../../../services/AuthenticationService';
import { FormBuilder, FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MatDialogRef } from '@angular/material/dialog';
//import { ValidationService } from '../../../services/UtilityServices/ValidationService';
declare var $: any;


@Component({
  selector: 'app-add-story-dialog',
  templateUrl: './add-story-dialog.component.html',
  styleUrls: ['./add-story-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddStoryDialogComponent implements OnInit, AfterViewInit {
  public http: any;
  public subscriptions: Subscription[] = [];

  public socket: SocketIOClient.Socket;


  public addStoryForm: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    //private _validationService: ValidationService,
    private dialogRef: MatDialogRef<AddStoryDialogComponent>) {

    this.addStoryForm = formbuilder.group({
      'story_name': [null, Validators.required]//this._validationService.RequiredValidator

    });

  }

  ngOnInit() {
  }
  ngAfterViewInit() { }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }


  submitForm(form: Form) {
    if (this.addStoryForm.valid) {
      this.dialogRef.close({ data: this.addStoryForm.get('story_name').value });
    }
  }
}






