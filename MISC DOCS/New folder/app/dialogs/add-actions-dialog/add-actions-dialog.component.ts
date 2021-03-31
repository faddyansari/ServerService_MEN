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
  selector: 'app-add-actions-dialog',
  templateUrl: './add-actions-dialog.component.html',
  styleUrls: ['./add-actions-dialog.component.css']
})

export class AddActionsDialogComponent implements OnInit, AfterViewInit {

  public http: any;
  public subscriptions: Subscription[] = [];

  public socket : SocketIOClient.Socket;
  public addActionForm: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    //private _validationService: ValidationService,
    private dialogRef: MatDialogRef < AddActionsDialogComponent >) { 
      
      this.addActionForm = formbuilder.group({
        'action_name': [null, Validators.required],
        'endpoint_url': [null, Validators.required],
        'template' : [null, Validators.required]
    });

    }

  ngOnInit() {
  }
  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
    });
}


submitForm(form: Form) {
  if (this.addActionForm.valid) {
        this.dialogRef.close({ data: {action_name: this.addActionForm.get('action_name').value, endpoint_url:this.addActionForm.get('endpoint_url').value, template:this.addActionForm.get('template').value} });    
      }     
  }
}
