import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

//Services
import { GlobalStateService } from '../../../services/GlobalStateService';
import { AuthService } from '../../../services/AuthenticationService';
import { SocketService } from '../../../services/SocketService';
import { ChatService } from '../../../services/ChatService';
import { CallingService } from '../../../services/CallingService';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-alert-bar',
	templateUrl: './alert-bar.component.html',
	styleUrls: ['./alert-bar.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AlertBarComponent implements OnInit {

	currentRoute: string;
	subscriptions: Subscription[] = [];
	verified = true;

	constructor(private routeService: GlobalStateService,
		private _socketService: SocketService,
		private _chatService: ChatService,
		private dialog: MatDialog,
		private _callingService: CallingService,
		private _authService: AuthService) {

		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings) this.verified = settings.verified;
		}));

	}

	ngOnInit() {
	}

	
}
