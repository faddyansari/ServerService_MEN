import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ChatBotService } from '../../../../services/ChatBotService';

@Component({
	selector: 'app-core',
	templateUrl: './core.component.html',
	styleUrls: ['./core.component.css'],
	encapsulation: ViewEncapsulation.None,
})

export class CoreComponent implements OnInit {

    constructor(private _chatbotService : ChatBotService) { }

    ngOnInit() {
    }

   
	toggleInfo(){
		this._chatbotService.toggleInfo();
	}
}
