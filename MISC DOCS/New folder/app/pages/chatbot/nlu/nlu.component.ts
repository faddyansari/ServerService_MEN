import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ChatBotService } from '../../../../services/ChatBotService';

@Component({
	selector: 'app-nlu',
	templateUrl: './nlu.component.html',
	styleUrls: ['./nlu.component.css'],
	encapsulation: ViewEncapsulation.None,
})

export class NluComponent implements OnInit {

	constructor(private _chatbotService: ChatBotService) { }

	ngOnInit() {
	}

	toggleInfo(){
		this._chatbotService.toggleInfo();
	}
}
