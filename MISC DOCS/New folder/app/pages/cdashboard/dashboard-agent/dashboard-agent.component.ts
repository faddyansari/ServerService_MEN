import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-dashboard-agent',
	templateUrl: './dashboard-agent.component.html',
	styleUrls: ['./dashboard-agent.component.scss']
})
export class DashboardAgentComponent implements OnInit {

	constructor() { }

	ngOnInit() {
		var date = new Date(), 
		y = date.getFullYear(), 
		m = date.getMonth();
		var firstDay = new Date(y, m, 1);
		var lastDay = new Date(y, m + 1, 0);
	}

	dateFormatter(d) {
		return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
	}

}
