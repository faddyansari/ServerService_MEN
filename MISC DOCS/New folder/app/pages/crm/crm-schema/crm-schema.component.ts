// import { Component, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
// import { Subscription } from 'rxjs/Subscription';
// import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';



// import { AuthService } from '../../../../services/AuthenticationService';
// import { CRMService } from '../../../../services/crmService';
// import { Observable } from 'rxjs/Observable';

// @Component({
//   selector: 'app-crm-schema',
//   templateUrl: './crm-schema.component.html',
//   styleUrls: ['./crm-schema.component.css'],
//   encapsulation: ViewEncapsulation.None
// })
// export class CrmSchemaComponent{

//   // @ViewChild('chkBoxmachineNameElement') chkBoxmachineNameElement
//   // @ViewChild('rdioBtnMachineNameElement') rdioBtnMachineNameElement

//   // public showAddSchemaForm: boolean = true;

//   // private subscriptions: Subscription[] = [];


//   // public stateMachineList: Array<any> = [];
//   // public WorkFlowsList: Array<any> = [];

//   // public addSchemaForm: FormGroup;
//   // //public addSchemaField: FormGroup;
//   // public addSchemaField: FormGroup;

//   // public filteredstateMachineList: Array<any> = [];


//   // public selectedWorkflow: any = undefined;



//   // constructor(private formbuilder: FormBuilder,
//   //   private _authService: AuthService,
//   //   private _crmService: CRMService ,
//   //   private snackBar: MatSnackBar,
//   //   private dialog: MatDialog) {


//   //   //#region Add MAchine Form
//   //   this.addSchemaForm = formbuilder.group({
//   //     'schemaName': [
//   //       null,
//   //       [
//   //         Validators.required
//   //       ],
//   //       this.CheckWorkflow.bind(this)
//   //     ],
//   //     'greetingMessage': [
//   //       null,
//   //       [
//   //         Validators.required
//   //       ],
//   //     ]
//   //   });

//   //   this.addSchemaField = formbuilder.group({
//   //     'value': [
//   //       null,
//   //       [
//   //         Validators.required
//   //       ]
//   //     ],
//   //     'label': [
//   //       null,
//   //       [
//   //         Validators.required
//   //       ]
//   //     ],
//   //     'machineName': [
//   //       null,
//   //       [
//   //         Validators.required
//   //       ],
//   //       this.CheckMachineName.bind(this)
//   //     ]
//   //   });


//   //   this._crmService.GetWorkFlowsList().subscribe(WorkflowsList => {

//   //   });

//   //   //#endregion

//   // }

//   // ngOnInit() {
//   // }


//   // ngOnDestroy(): void {
//   //   this.subscriptions.map(subscription => {
//   //     subscription.unsubscribe();
//   //   });
//   // }

//   // //#ViewControl Functions
//   // public ShowAddSchemaForm() {
//   //   this.showAddSchemaForm = !this.showAddSchemaForm;
//   // }

//   // SelectWorkFlow(workflowName: string) {
//   //   this.WorkFlowsList.map(workflow => {
//   //     if (workflow.name == workflowName) {
//   //       this.selectedWorkflow = workflow;
//   //     }
//   //   });
//   // }
//   // //#endregion


//   // public CheckWorkflow(control: FormControl): Observable<any> {
//   //   let workflowName = this.addSchemaForm.get('workflowName');
//   //   if (this.WorkFlowsList.length == 0) {
//   //     return Observable.of(null);
//   //   } else {
//   //     for (let i = 0; i < this.WorkFlowsList.length; i++) {
//   //       if (this.WorkFlowsList[i].name == workflowName.value) {
//   //         return Observable.of({ 'matched': true });
//   //       } else {
//   //         return Observable.of(null);
//   //       }
//   //     }
//   //   }
//   // }

//   // public CheckMachineName(control: FormControl): Observable<any> {
//   //   if (this.stateMachineList.length == 0) {
//   //     return Observable.of({ 'notmatched': true });
//   //   } else {
//   //     for (let i = 0; i < this.stateMachineList.length; i++) {
//   //       if (this.stateMachineList[i].name == control.value) {
//   //         return Observable.of(null);
//   //       }
//   //     }
//   //     return Observable.of({ 'notmatched': true });

//   //   }
//   // }

//   // public AddWorkFlow() {
//   //   let workflowname = this.addSchemaForm.get('workflowName').value;
//   //   let greetingMessage = this.addSchemaForm.get('greetingMessage').value;
//   //   let data = {
//   //     name: workflowname,
//   //     form: [],
//   //     greetingMessage: greetingMessage,
//   //     primary : false
//   //   };
//   //   // this._chatBotSettings.AddWorkFlow(data).subscribe(response => {
//   //   //   this.showAddWorkFlowForm = false;
//   //   //   this.snackBar.openFromComponent(ToastNotifications, {
//   //   //     data: { img: 'ok', msg: 'WorkFlow Added' },
//   //   //     duration: 3000,
//   //   //     panelClass: ['user-alert', 'success']
//   //   //   });
//   //   // }, err => {
//   //   //   //TODO ERROR LOGIC HERE
//   //   // });
//   // }

//   // public SubmitSchema() {
//   //   let data = {
//   //     _id: this.selectedWorkflow._id,
//   //     form: this.selectedWorkflow.form
//   //   }
//   //   // this._chatBotSettings.SubmitSchema(data).subscribe(response => {
//   //   // }, err => {
//   //   //   //TODO ERROR LOGIC HERE
//   //   // })
//   // }

//   // public MakePrimary(id: string) {
//   //   // this._chatBotSettings.MakePrimary(id).subscribe(response => {

//   //   // }, err => {

//   //   // });
//   // }


//   // public AddCheckBox() {
//   //   let valueElem = this.addSchemaField .get('value');
//   //   let label = this.addSchemaField.get('label');
//   //   let stateMachineName = this.addSchemaField.get('machineName');
//   //   if (!valueElem || !valueElem.value || !label || !label.value || !stateMachineName || !stateMachineName.value) return;
//   //   let element = {
//   //     type: 'checkBox',
//   //     value: valueElem.value,
//   //     label: label.value,
//   //     stateMachine: this.GetMachineId(stateMachineName.value)
//   //   }

//   //   this.selectedWorkflow.form.push(element);
//   //   this.addSchemaField.reset();
//   // }

//   // // public AddRadioButton() {
//   // //   let valueElem = this.addRadioBtnForm.get('value');
//   // //   let label = this.addRadioBtnForm.get('label');
//   // //   let stateMachineName = this.addRadioBtnForm.get('machineName');
//   // //   if (!valueElem || !valueElem.value || !label || !label.value || !stateMachineName || !stateMachineName.value) return;
//   // //   let element = {
//   // //     type: 'radioBtn',
//   // //     value: valueElem.value,
//   // //     label: label.value,
//   // //     stateMachine: this.GetMachineId(stateMachineName.value)
//   // //   }

//   // //   this.selectedWorkflow.form.push(element);
//   // //   this.addRadioBtnForm.reset();
//   // // }

//   // public DeleteElement(index: number) {
//   //   let i = index as number;
//   //   (this.selectedWorkflow.form as Array<any>).splice(i, 1);
//   // }

//   // private GetMachineId(name: string) {
//   //   let machineID = '';
//   //   this.stateMachineList.map(smachine => {
//   //     if (smachine.name == name) {
//   //       machineID = smachine._id;
//   //     }
//   //   });
//   //   return machineID;
//   // }

//   // public FiterMachineNames(autocompleteString: string) {
//   //   this.filteredstateMachineList = this.stateMachineList.filter(stateMachine => {
//   //     if (stateMachine.name.toLowerCase().indexOf(autocompleteString.toLowerCase()) != -1 && autocompleteString) {
//   //       return stateMachine;
//   //     }
//   //   });
//   // }

//   // public keyuChkBox(event: KeyboardEvent) {
//   //   this.FiterMachineNames(this.chkBoxmachineNameElement.nativeElement.value);
//   // }


//   // public keyupRdioBtn(event: KeyboardEvent) {
//   //   this.FiterMachineNames(this.rdioBtnMachineNameElement.nativeElement.value);
//   // }

//   // public Blurred(event: any) {

//   // }

//   // public Focus(elemName: string) {
//   //   switch (elemName) {
//   //     case 'radio':
//   //       this.filteredstateMachineList = [];
//   //       setTimeout(() => {
//   //         this.FiterMachineNames(this.rdioBtnMachineNameElement.nativeElement.value);
//   //       }, 200);
//   //       break;
//   //     case 'chkBox':
//   //       this.filteredstateMachineList = [];
//   //       setTimeout(() => {
//   //         this.FiterMachineNames(this.chkBoxmachineNameElement.nativeElement.value);
//   //       }, 200);
//   //       break;
//   //   }
//   // }




// }
