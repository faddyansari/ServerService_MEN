import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { Visitorservice } from '../../../../../services/VisitorService';

@Component({
	selector: 'app-session-logs',
	templateUrl: './session-logs.component.html',
	styleUrls: ['./session-logs.component.css'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionLogsComponent implements OnInit {

	@Input() Logs: any = [];
	constructor() {

	}

	ngOnInit() {

	}
}
