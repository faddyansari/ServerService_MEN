import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ChatBotService } from '../../../../../../services/ChatBotService'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
	selector: 'app-dp-regex',
	templateUrl: './dp-regex.component.html',
	styleUrls: ['./dp-regex.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class DpRegexComponent implements OnInit {
    //inputUser = "";
    RegexForm: FormGroup;
    subscriptions: Subscription[] = [];
    entity_list = [];
    intent_list =[];
    regex_list = [];
    regex_value = '';
    selectedValue = '';
	inputUser = '';
	showRegexForm = false;

 @ViewChild('box') AddReg: ElementRef;

  constructor(private BotService:ChatBotService, formbuilder: FormBuilder, private dialog: MatDialog) { 
    this.RegexForm = formbuilder.group({
      'regex_value': ['', Validators.required]
    });

    this.subscriptions.push(BotService.getEntity().subscribe(data => {
      this.entity_list = data;
    }));
    

    this.subscriptions.push(BotService.getIntent().subscribe(data => {
      this.intent_list = data;
		}));



    this.subscriptions.push(BotService.getRegex().subscribe(data => {
      this.regex_list = data;
      
		}));
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
    })
}

getUserInput(){
    this.BotService.userInput(this.inputUser).subscribe(response =>{
      console.log(response);
      
    });
  }

  selectEntity(event){
    this.selectedValue = event.target.value;
    }
    
selectIntent(event){
    this.selectedValue = event.target.value;
  }
  


  addRegexValue(value){
    this.RegexForm.get('regex_value').setValue('');
    this.selectedValue = '';
    this.BotService.addRegexValue(value);
    }

    deleteRegexValue(regValue, index){
      this.dialog.open(ConfirmationDialogComponent, {
        panelClass: ['confirmation-dialog'],
        data: { headermsg: "Are you sure to delete this Value??? It will also delete regex of this value!" }
      }).afterClosed().subscribe(data => {
        if (data == 'ok') {
          this.regex_list.splice(index, 1);
          this.BotService.deleteRegexValues(regValue);
        }
      });
    }


    // onAddTag(tag, reg_list){
    //   this.BotService.addRegex(tag.value, reg_list);
    // }

    onEnter(tag, reg_list){
      this.regex_list.map(p=>{
        if(p._id == reg_list._id){
          // if(p.regex.length > 0){
          //   console.log('Can not enter multiple regex for single value.');
          // }else{
          // p.regex.push(tag);
          this.BotService.addRegex(tag, reg_list);
        // }
        }
      });
      this.AddReg.nativeElement.value = '';
      }
      
    
    // onRemoveTag(tag, reg_list){
    //   this.BotService.removeRegex(tag, reg_list);
	// }

	toggleRegexForm() {
		this.showRegexForm = !this.showRegexForm;
	}

    onRemoveTag(tagIndex, reg_list){
     
      this.BotService.removeRegex(tagIndex, reg_list);
      // this.regex_list.map(p=>{
      //   if(p._id == reg_list._id){
      //     p.regex.splice(tagIndex,1);
      //   }
      // })
    }

}
