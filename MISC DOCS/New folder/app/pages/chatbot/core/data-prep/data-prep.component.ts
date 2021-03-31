import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-core-data-prep',
	templateUrl: './data-prep.component.html',
	styleUrls: ['./data-prep.component.css'],
	encapsulation: ViewEncapsulation.None,
})

export class CoreDataPrepComponent implements OnInit {
	
	response = true;
	stories = false;
	actions = false;

	constructor(private router : Router) { }

	ngOnInit() {
	}

	back() {
		this.router.navigateByUrl('/chatbot/core');
  	}

  	setPillActive(pill) {
		switch(pill) {
			case 'response':
				this.response = true;
				this.stories = false;
				this.actions = false;
				break;
			case 'stories':
				this.response = false;
				this.stories = true;
				this.actions = false;
				break;
			case 'actions':
				this.response = false;
				this.stories = false;
				this.actions = true;
				break;
		}
	}

}
