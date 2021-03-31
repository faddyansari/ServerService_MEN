import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-nlu-data-prep',
	templateUrl: './data-prep.component.html',
	styleUrls: ['./data-prep.component.css'],
	encapsulation: ViewEncapsulation.None,
})
export class NluDataPrepComponent implements OnInit {

	intent = true;
	entity = false;
	synonyms = false;
	regex = false;

	constructor(private router: Router) { }

	ngOnInit() {
	}

	setPillActive(pill) {
		switch (pill) {
			case 'intent':
				this.intent = true;
				this.entity = false;
				this.synonyms = false;
				this.regex = false;
				break;
			case 'entity':
				this.intent = false;
				this.entity = true;
				this.synonyms = false;
				this.regex = false;
				break;
			case 'synonyms':
				this.intent = false;
				this.entity = false;
				this.synonyms = true;
				this.regex = false;
				break;
			case 'regex':
				this.intent = false;
				this.entity = false;
				this.synonyms = false;
				this.regex = true;
				break;
		}
	}

	back() {
		this.router.navigateByUrl('/chatbot/nlu');
	}

}
