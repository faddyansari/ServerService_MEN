import { Component, OnInit, ViewEncapsulation, AfterContentChecked } from '@angular/core';
import { LocalStorageService } from '../../../services/LocalStorageService';

@Component({
	selector: 'app-overlay-dialog',
	templateUrl: './overlay-dialog.component.html',
	styleUrls: ['./overlay-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class OverlayDialogComponent implements OnInit, AfterContentChecked {

	status = '';
	changed = '';
	logout = false;
	constructor(_localStorageStorage: LocalStorageService) {
		_localStorageStorage.getStatus().subscribe(status => {
			//console.log(status);
			this.logout = status;
		});
	}

	ngOnInit() {
	}


	public Connected(status: string) {
		this.changed = status;
	}

	ngAfterContentChecked() {
		//Called after every check of the component's view. Applies to components only.
		//Add 'implements AfterViewChecked' to the class.
		if (this.status != this.changed) {
			this.status = this.changed;
		}
	}

}
