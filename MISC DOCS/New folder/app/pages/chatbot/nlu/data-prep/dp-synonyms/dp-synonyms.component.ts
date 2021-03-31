import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatBotService } from '../../../../../../services/ChatBotService'
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-dp-synonyms',
	templateUrl: './dp-synonyms.component.html',
	styleUrls: ['./dp-synonyms.component.css'],
	encapsulation: ViewEncapsulation.None
})

export class DpSynonymsComponent implements OnInit {
	
	SynonymForm: FormGroup;
	subscriptions: Subscription[] = [];
	phrase_values = [];
	synonym_list = [];
	selectedValue = '';
	@ViewChild('box') AddSyn: ElementRef;
	showSynonymForm = false;
		
	constructor(formbuilder: FormBuilder, private dialog: MatDialog, private BotService:ChatBotService) {
		this.SynonymForm = formbuilder.group({
		'entity_value': ['', Validators.required]
		});

		this.subscriptions.push(BotService.getTPhrase().subscribe(data => {
		if(data.length){
			this.phrase_values = [];
			data.forEach(phrase => {
				phrase.entities.forEach(entity => {
					if(!this.phrase_values.filter(p => p.value == entity.value ).length){  
					this.phrase_values.push({value: entity.value, id: entity.id});
					}
				});
			});
		}
		}));

		this.subscriptions.push(BotService.getSynonym().subscribe(data => {
		this.synonym_list = data;
		
			}));
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		// Called once, before the instance is destroyed.
		// Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}
	selectSynonymValue(event){
	this.selectedValue = event.target.value;
	
	}

	toggleSynonymForm() {
		this.showSynonymForm = !this.showSynonymForm;
	}

	addSynonymValue(value){
		this.SynonymForm.get('entity_value').setValue('');
		this.selectedValue = '';
		this.BotService.addSynonymValues(value);
		}


		deleteSynonymValue(synValue, index){
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure to delete this Value??? It will also delete all synonyms of this value!" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
			this.synonym_list.splice(index, 1);
			this.BotService.deleteSynonymValues(synValue);
			}
		});
		}

    // onAddTag(tag, syn_list){
    //   this.BotService.addSynonym(tag.value, syn_list);
    // }
onEnter(tag, syn_list){
this.synonym_list.map(p=>{
  if(p._id == syn_list._id){
    //if(p.synonyms.filter(data => data == tag).length > 0){
    //  console.log('synonym already exist');
    //}else{
    //p.synonyms.push(tag);
    this.BotService.addSynonym(tag, syn_list);
  //}
  }
});
console.log(event.target);

(event.target as HTMLInputElement).value = '';
console.log((event.target as HTMLInputElement).value);

}

    onRemoveTag(tagIndex, syn_list){
     
      this.BotService.removeSynonym(tagIndex, syn_list);
    //   this.synonym_list.map(p=>{
    //     if(p._id == syn_list._id){
    //       p.synonyms.splice(tagIndex,1);
    //     }
    //   })
    }
}
