import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IntegrationsService } from '../../../../../../services/LocalServices/IntegrationsService';
import { Subscription } from 'rxjs';
import { TicketAutomationService } from '../../../../../../services/LocalServices/TicketAutomationService';

@Component({
  selector: 'app-facebook-rules',
  templateUrl: './facebook-rules.component.html',
  styleUrls: ['./facebook-rules.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FacebookRulesComponent implements OnInit {
  ruleForm: FormGroup;
  @ViewChild('status') status: ElementRef;

  @Output('editCase') editCase = new EventEmitter();
  public subscriptions: Subscription[] = [];
  all_groups=[];
  constructor(private formbuilder: FormBuilder,
    private _ticketAutomationService: TicketAutomationService,
    public _integrationsService: IntegrationsService) {
      this.subscriptions.push(this._integrationsService.getFbRule().subscribe(data => {
        if (data) {
          this.ruleForm.setValue(data);
        }
      }));
  
      this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(groups => {
        this.all_groups = groups;
      }));
     }

  ngOnInit() {
    this.ruleForm = this.formbuilder.group({
			'postToTicketsAllow': [true, []],
			'visitorsToTickets': [false, []],
			'pagesToTickets': [true, []],
			'ticketChoice': ['newTicket', []],
			'SpecificKeywords': [true, []],
			'keywords': [['support', 'sbt', 'beelinks'], []],
			'assignToGroup': ['', Validators.required]
		});
  }
	UpdateRule() {
		console.log(this.ruleForm.value);
		let obj = this.ParseObj(this.ruleForm.value);
		console.log(obj)
		this._integrationsService.setRuleset(obj).subscribe(response => {
      this.editCase.emit(false);
		})

  }
  
  ChangeTicketChoice(event){
    if(event.target.value == 'singleTicket'){
      this.status.nativeElement.checked= true;
      this.status.nativeElement.disabled = true;
    }
    else{
      this.status.nativeElement.checked= false;
      this.status.nativeElement.disabled = false;

    }
  }
	ParseObj(values) {
		// if (!values.postToTicketsAllow) {
		// 	values.postToTicketsAllow = false,
		// 		values.visitorsToTicket = false,
		// 		values.pagesToTickets = false,
		// 		values.ticketChoice = '',
		// 		values.SpecificKeywords = false,
		// 		values.keywords = [],
		// 		values.assignToGroup = ''
		// }
		// else {
			if (values.ticketChoice == "singleTicket") {
				values.visitorsToTickets = true;
				values.SpecificKeywords = false
				values.keywords = [];
			}
		// }

		return values;
  }
  
  CancelRule() {
    this.editCase.emit(false);
	}
}
