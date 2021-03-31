import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../services/AuthenticationService';
import { Subscription } from 'rxjs/Subscription';
import { CRMService } from '../../../../services/crmService';
import * as Highcharts from 'highcharts/highcharts';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);

@Component({
	selector: 'app-crm-stats',
	templateUrl: './crm-stats.component.html',
	styleUrls: ['./crm-stats.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CrmStatsComponent implements OnInit {

	agent: any;
	subscriptions: Subscription[] = [];
	selectedCustomer: any;
	loadingStats = false;
	customerStats: any;
	render = false;
	//Browsers
	browsers = [
		{ key: 'chrome-colored' },
		{ key: 'uc-colored' },
		{ key: 'firefox-colored' },
		{ key: 'maxthon-colored' },
		{ key: 'explorer-colored' },
		{ key: 'opera-colored' },
		{ key: 'safari-colored' },
		{ key: 'edge-colored' },
		{ key: 'browser-colored' }
	];
	browser_data = [];
	//Devices
	devices = [
		{ key: 'windows-colored' },
		{ key: 'apple-colored' },
		{ key: 'android-colored' }
	];
	device_data = [];

	constructor(_authService: AuthService, public _crmService: CRMService) {
		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			this.agent = agent;
		}));
		this.subscriptions.push(_crmService.loadingStats.subscribe(data => {
			this.loadingStats = data;
		}));
		this.subscriptions.push(_crmService.customerStats.subscribe(data => {
			this.customerStats = data;
			if (Object.keys(this.customerStats).length) {
				this.browser_data = [];
				this.device_data = [];
				this.customerStats.browsers.forEach(element => {
					if (this.browser_data.filter(b => b.key.toLowerCase().includes(element.name.toLowerCase()) || element.name.toLowerCase().includes(b.key.toLowerCase())).length && this.browser_data.length) {
						this.browser_data.filter(b => b.key.toLowerCase().includes(element.name.toLowerCase()) || element.name.toLowerCase().includes(b.key.toLowerCase()))[0].count += element.count;
					} else {
						this.browser_data.push({
							'key': (this.browsers.filter(b => b.key.toLowerCase().includes(element.name.toLowerCase())).length) ? this.browsers.filter(b => b.key.toLowerCase().includes(element.name.toLowerCase()))[0].key : 'other',
							'count': element.count
						});
					}
				});
				this.customerStats.os.forEach(element => {
					if (this.device_data.filter(b => b.key.toLowerCase().includes(element.name.toLowerCase()) || element.name.toLowerCase().includes(b.key.toLowerCase())).length && this.browser_data.length) {
						this.device_data.filter(b => b.key.toLowerCase().includes(element.name.toLowerCase()) || element.name.toLowerCase().includes(b.key.toLowerCase()))[0].count += element.count;
					} else {
						this.device_data.push({
							'key': (this.devices.filter(b => b.key.toLowerCase().includes(element.name.toLowerCase())).length) ? this.devices.filter(b => b.key.toLowerCase().includes(element.name.toLowerCase()))[0].key : 'other',
							'count': element.count
						});
					}
				});

			}
		}));
		this.subscriptions.push(_crmService.selectedCustomer.subscribe(data => {
			if (data) this.selectedCustomer = data;
		}));
	}

	ngOnInit() {
		// this._crmService.GetCustomerStatistics(this.agent.csid, this.selectedCustomer.deviceID).subscribe(response => {
		// 	if(response.status == 200){
		// 		this.customerStats = response.json();
		// 		console.log(this.customerStats);
		// 	}
		// });
	}

	//helpers
	time_convert(num) {
		num = Math.round(num);
		var hours = Math.floor(num / 60);
		var minutes = num % 60;
		let str = (hours) ? hours + " hrs " : '';
		(minutes) ? str += minutes + ' mins' : '';


		return (str) ? str : 'No sessions';
	}

	FormatURL(url) {
		try {
			// console.log(url);
			return (new URL(url).protocol + '//' + new URL(url).hostname)

		} catch (e) {
			return url
		}
	}


}
