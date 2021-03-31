// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormControl, FormBuilder, FormGroup } from '@angular/forms';
// import { Subscription } from 'rxjs/Subscription';
// import { TicketsService } from '../../../../../services/TicketsService';

// @Component({
//   selector: 'app-compaign-mgt',
//   templateUrl: './compaign-mgt.component.html',
//   styleUrls: ['./compaign-mgt.component.scss']
// })
// export class CompaignMgtComponent implements OnInit {
//   contacts='';
//   shiftdown=false;
//   emailData=[];
//   file:any=undefined;
//   public subscriptions: Subscription[] = [];
//   form: FormGroup;
//   selectedOrderCountries=[];
//   finalEmailArray=[];

//   orders = [
//     { id: 1, country: 'Pakistan' },
//     { id: 2, country: 'United States' },
//   ];
//   csvContent: string;

//   constructor(private formBuilder: FormBuilder, private _ticketService:TicketsService) {
//     this.form = this.formBuilder.group({
//       orders: new FormArray([])
//     });

//     this.addCheckboxes();
//   }
//   //constructor(private _ticketService:TicketsService) { 

//     addCheckboxes(){
//       this.orders.map((o, i) => {
//         const control = new FormControl(i === 0); // if first item set to true, else false
//         (this.form.controls.orders as FormArray).push(control);
//       });
//     }
  
//     submit() {
//       this.selectedOrderCountries = this.form.value.orders
//         .map((v, i) => v ? this.orders[i].country : null)
//         .filter(v => v !== null);
//       console.log(this.selectedOrderCountries);

//       this._ticketService.GetEmailData(this.selectedOrderCountries);
//       this.selectedOrderCountries=[];

//         }
//     // this.subscriptions.push(this._ticketService.getEmailData().subscribe(data => {
//     //   console.log(data);
// 		// 	this.emailData = data;
//     // }));
    
// //  }

//   Upload(){

//   }

//   ngOnInit() {
//   }
 
//   SendBulkEmails(contacts, nameSender,subject,emailSender) {
//    if(this.selectedOrderCountries){
//       this.finalEmailArray.concat(this.selectedOrderCountries);
//    }
//    else if(contacts){
//     this.finalEmailArray.push(contacts);
//    }
//    else if(this.selectedOrderCountries && contacts){// || this.file)){
//      this.finalEmailArray.push(contacts);
//      this.finalEmailArray.concat(this.selectedOrderCountries);
//     }
//     this._ticketService.SendBulkEmails(this.finalEmailArray, nameSender, subject, emailSender)
    
//     //  else if(this.file){
//     //   this.finalEmailArray.push()
//     //  }
//   }
  
//   OptionSelect(event){
//     this._ticketService.GetEmailData(event.target.value)
//   }
//   onFileLoad(fileLoadedEvent) {
//     const textFromFileLoaded = fileLoadedEvent.target.result;              
//     this.csvContent = textFromFileLoaded;     
//     // alert(this.csvContent);
// }

// onFileSelect(input: HTMLInputElement) {

//   const files = input.files;
//   console.log(files);
  
//   var content = this.csvContent;    
//   if (files && files.length) {
//      /*
//       console.log("Filename: " + files[0].name);
//       console.log("Type: " + files[0].type);
//       console.log("Size: " + files[0].size + " bytes");
//       */

//       const fileToRead = files[0];

//       const fileReader = new FileReader();
//       fileReader.onload = this.onFileLoad;

//       fileReader.readAsText(fileToRead, "UTF-8");
//   }

// }
// }
