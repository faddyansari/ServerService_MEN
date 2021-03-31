import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { RulesetSettingsService } from '../../../../../services/LocalServices/RulesetsService';

@Component({
	selector: 'app-ruleset-scheduler',
	templateUrl: './ruleset-scheduler.component.html',
	styleUrls: ['./ruleset-scheduler.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers:[
		RulesetSettingsService
	]
})
export class RulesetSchedulerComponent implements OnInit {

	schedulerForm: FormGroup;
	formData : any;
	changes = false;
	constructor(public _appStateService : GlobalStateService, public formbuilder: FormBuilder, private _ruleSetService: RulesetSettingsService) { 
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management');
		this._ruleSetService.GetRuleSetScheduler().subscribe(response => {
			if(response){
				this.formData = response;
				this.schedulerForm = this.formbuilder.group({
					enabled: [response.enabled, Validators.required],
					type: [response.type, Validators.required],
					days: [response.days],
					time: [response.time, Validators.required],
					scheduled_at: [ new Date(response.scheduled_at)]
				});
			}
		});

		this.schedulerForm = this.formbuilder.group({
			enabled: [false, Validators.required],
			type: ['everyday', Validators.required],
			days: [1],
			time: ['00:00', Validators.required],
			scheduled_at: ['']
		});
		
	}

	valueChanges(){
		// console.log('form changes');
		this.changes = true;
		let obj = this.schedulerForm.value;
		let curr_datetime = new Date();	
		switch(obj.type){
			case 'everyday':
				let tocheck_datetime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), obj.time.split(':')[0], obj.time.split(':')[1]);
				// console.log(curr_datetime);
				// console.log(tocheck_datetime);
				if(curr_datetime <= tocheck_datetime){
					// console.log('Ruleset Execution!');
					this.schedulerForm.get('scheduled_at').setValue(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), obj.time.split(':')[0], obj.time.split(':')[1]));

				}else{
					this.schedulerForm.get('scheduled_at').setValue(new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDate()) + 1, obj.time.split(':')[0], obj.time.split(':')[1]));
				}
				break;
			case 'after':
				let after_date = this.AddDays(new Date(), obj.days);
				this.schedulerForm.get('scheduled_at').setValue(new Date(after_date.getFullYear(), after_date.getMonth(), after_date.getDate(), obj.time.split(':')[0], obj.time.split(':')[1]));
				break;
		}
	}

	reset(){
		if(this.formData){
			this.schedulerForm = this.formbuilder.group({
				enabled: [this.formData.enabled, Validators.required],
				type: [this.formData.type, Validators.required],
				days: [this.formData.days],
				time: [this.formData.time, Validators.required],
				scheduled_at: [ new Date(this.formData.scheduled_at)]
			});
		}else{
			this.schedulerForm = this.formbuilder.group({
				enabled: [false, Validators.required],
				type: ['everyday', Validators.required],
				days: [1],
				time: ['00:00', Validators.required],
				scheduled_at: ['']
			});
		}
		this.changes = false;
	}

	AddDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	ngOnInit() {
	}

	save(){
		console.log(this.schedulerForm.value);
		
		this._ruleSetService.SetRuleSetScheduler(this.schedulerForm.value).subscribe(response => {
			if(response.status == 'ok'){
				alert('Settings saved!');
				this.changes = false;
			}else{
				alert('Error!');
			}
		});
	}

}
