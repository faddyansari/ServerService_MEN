import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../services/GlobalStateService';

@Component({
	selector: 'app-noaccess',
	templateUrl: './noaccess.component.html',
	styleUrls: ['./noaccess.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NoaccessComponent implements OnInit {

	count = 5;
	interval : any;
	constructor(private _globalStateService: GlobalStateService) { }

	ngOnInit() {
		this.interval = setInterval(() => {
			this.count--;
			if (this.count == 0) {
				this._globalStateService.canAccessPageNotFound.next(false);
				this._globalStateService.NavigateTo('/home');
			}
		}, 1000);
	}

	ngOnDestroy(){
		clearInterval(this.interval);
	}

}
