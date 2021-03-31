import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts';
// import * as Highmaps from 'highcharts/highmaps';
window['Highcharts'] = Highcharts;
// require('highcharts/modules/exporting')(Highmaps);
require('highcharts/modules/exporting')(Highcharts);
// require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/drilldown')(Highcharts);
//After implementing Agent Service Uncomment Following Line
//Services
import { AuthService } from '../../../services/AuthenticationService';
import { Visitorservice } from '../../../services/VisitorService';
import { ChatService } from '../../../services/ChatService';
import { Subscription } from 'rxjs/Subscription';
import { TicketsService } from '../../../services/TicketsService';
import { AgentService } from '../../../services/AgentService';
import { AnalyticsService } from '../../../services/AnalyticsService';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalStateService } from '../../../services/GlobalStateService';


//import { AgentSerivce } from '../../../services/AgentService'


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		AnalyticsService
	]
})
export class DashboardComponent implements OnInit {

	//HighMaps
	highcharts = Highcharts;
	// highmaps = Highmaps;

	subscription: Subscription[] = []
	totalVisitors = 0;
	totalVisitors_original = 0;
	chattingVisitors = 0;
	queuedVisitors = 0;
	browsingVisitors = 0;
	invitedVisitors = 0;
	inactiveVisitors = 0;
	leftVisitors = 0;
	newVisitors = 0;
	returningVisitors = 0;
	newVisitorsArray = [
		{ y: 23, color: '#029D9F' },
		{ y: 56, color: '#99D8D8' },
		{ y: 44, color: '#029D9F' },
		{ y: 46, color: '#99D8D8' },
		{ y: 32, color: '#029D9F' },
		{ y: 60, color: '#99D8D8' },
		{ y: 39, color: '#029D9F' },
		{ y: 30, color: '#99D8D8' },
		{ y: 48, color: '#029D9F' },
		{ y: 52, color: '#99D8D8' },
	];
	returningVisitorsArray = [
		{ y: 23, color: '#666666' },
		{ y: 56, color: '#afb6c4' },
		{ y: 44, color: '#666666' },
		{ y: 46, color: '#afb6c4' },
		{ y: 32, color: '#666666' },
		{ y: 60, color: '#afb6c4' },
		{ y: 39, color: '#666666' },
		{ y: 30, color: '#afb6c4' },
		{ y: 48, color: '#666666' },
		{ y: 52, color: '#afb6c4' },
	];

	rendered = false;
	role = '';
	daysRemaining = 0;
	unlimited = false;
	// invitedVisitors = 0;
	// inactiveVisitors = 0;
	// leftVisitors = 0;

	solvedTicketsCount = 0;
	openTicketsCount = 0;
	pendingTicketsCount = 0;
	closedTicketsCount = 0;
	totalTicketsCount = 0;

	totalAgents = 0;
	onlineAgents = 0;
	offlineAgents = 0;
	idleAgents = 0;
	activeAgents = 0;

	//Loading Variables
	loadingVisitors = true;
	loadingTickets = true;
	loadingAgents = true;
	loadingCount = true;

	visitorList = [];
	visitorList_original = [];

	referrers: any;
	//agent
	agent: any;

	//graph data
	loader_topLinks = true;
	loader_visitorCount = true;
	loader_visitorByCountry = true;
	graph_totalVisitedLinks = 0;
	graph_averageSessionTime = 0;
	graph_totalVisitorCount = 0
	visitorByCountry_data = [];
	visitorByCountryLegend_data = [];
	totalVisitorLinks_data = [];
	averageSessionTime_data = [];
	deviceInfoGraph_data = [];
	deviceInfoFilter = [];
	colorScheme = [];
	dateDropDown = [];
	graph_Referers = [];
	graph_totalReferers = 0;
	verified = false;
	sbt = false;

	//Highcharts variables
	interval_country: any;
	isDrilledDown = false;
	browserDevicesTogle = 'browser';
	highchatsLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);


	//options for os details / drilldown
	options_browser: any = {
		chart: {
			type: 'column',
			events: {
				load: (e) => {
					e.target.showLoading();
				},
				drilldown: (e) => {
					this.isDrilledDown = true;
					if (!e.seriesOptions) {
						var chart = e.target;
						chart.addSeriesAsDrilldown(e.point, this.os_details_drilldown.filter(v => v.name == e.point.name)[0])
					}
				},
				drillup: () => {
					this.isDrilledDown = false;
				}
			}
		},
		plotOptions: {
			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					style: {
						fontWeight: 'medium'
					}
				}
			}
		},
		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> <br/>'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			type: 'category'
		},
		yAxis: {
			title: {
				text: ''
			}
		},
		legend: {
			enabled: false
		},
		title: {
			text: 'Browser Details'
		},
		subtitle: {
			text: 'Click the columns to view versions.'
		},
		series: [{
			name: 'Browsers',
			colorByPoint: true,
			data: []
		}],
		drilldown: {
			activeAxisLabelStyle: {
				color: '#003399',
				cursor: 'pointer',
				fontWeight: 'medium',
				textDecoration: 'none'
			},
			activeDataLabelStyle: {
				color: '#003399',
				cursor: 'pointer',
				fontWeight: 'medium',
				textDecoration: 'none'
			}
		}
	};
	// //options for visitor graph
	options_visitor: any = {
		chart: {
			type: 'pie',
			events: {
				load: (e) => {
					e.target.showLoading();
				}
			}
		},
		colors: [
			"#AD296B",
			"#DB2A6A",
			"#EB4F73",
			"#EF8563",
			"#EF8600",
		],
		exporting: {
			enabled: false
		},
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		xAxis: {
			categories: ['Browsing', 'Queued', 'Chatting', 'Invited', 'Inactive']
		},
		yAxis: {
			title: {
				text: ''
			}
		},
		series: [{
			name: 'Count',
			data: [['Browsing', 0], ['Queued', 0], ['Chatting', 0], ['Invited', 0], ['Inactive', 0]],
			dataLabels: {
				enabled: false
			},
			innerSize: '80%'
		}]
	};
	options_newvisitors: any = {
		chart: {
			type: 'column',
			// backgroundColor: '#f5f6f8'
		},
		exporting: {
			enabled: false
		},
		plotOptions: {
			column: {
				pointPadding: -0.25
			}
		},
		title: {
			text: ''
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			categories: [
				'new'
			],
			visible: false
		},
		colors: [
			"#029D9F",
			"#99D8D8",
		],
		yAxis: {
			title: {
				text: ''
			},
			visible: false
		},
		legend: {
			enabled: false
		},
		credits: {
			enabled: false
		},
		tooltip: {
			enabled: false
		},
		series: [{
			data: [
				{ y: 23, color: '#029D9F' },
				{ y: 56, color: '#99D8D8' },
				{ y: 44, color: '#029D9F' },
				{ y: 46, color: '#99D8D8' },
				{ y: 32, color: '#029D9F' },
				{ y: 60, color: '#99D8D8' },
				{ y: 39, color: '#029D9F' },
				{ y: 30, color: '#99D8D8' },
				{ y: 48, color: '#029D9F' },
				{ y: 52, color: '#99D8D8' },
			]
		}]
	};
	options_returningvisitors: any = {
		chart: {
			type: 'column',
			// backgroundColor: '#f5f6f8'
		},
		exporting: {
			enabled: false
		},
		plotOptions: {
			column: {
				pointPadding: -0.25
			}
		},
		title: {
			text: ''
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			categories: [
				'returning'
			],
			visible: false
		},
		colors: [
			"#afb6c4",
			"#666666",
		],
		yAxis: {
			title: {
				text: ''
			},
			visible: false
		},
		legend: {
			enabled: false
		},
		credits: {
			enabled: false
		},
		tooltip: {
			enabled: false
		},
		series: [{
			data: [
				{ y: 23, color: '#666666' },
				{ y: 56, color: '#afb6c4' },
				{ y: 44, color: '#666666' },
				{ y: 46, color: '#afb6c4' },
				{ y: 32, color: '#666666' },
				{ y: 60, color: '#afb6c4' },
				{ y: 39, color: '#666666' },
				{ y: 30, color: '#afb6c4' },
				{ y: 48, color: '#666666' },
				{ y: 52, color: '#afb6c4' },
			]
		}]
	};
	//options for ticket graph
	options_tickets: any = {
		chart: {
			type: 'pie',
			events: {
				load: (e) => {
					e.target.showLoading();
				}
			}
		},
		exporting: {
			enabled: false
		},
		colors: [
			"#006EAD",
			"#2491cc",
			"#00bfac",
			"#51d691"
		],
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		xAxis: {
			categories: ['Open', 'Pending', 'Solved', 'Closed']
		},
		yAxis: {
			title: {
				text: ''
			}
		},
		series: [{
			name: 'Count',
			data: [['Open', 0], ['Pending', 0], ['Solved', 0], ['Closed', 0]],
			dataLabels: {
				enabled: false
			},
			innerSize: '80%'
		}]
	};
	//options for agents graph
	options_agents: any = {
		chart: {
			type: 'pie',
			events: {
				load: (e) => {
					e.target.showLoading();
				}
			}
		},
		exporting: {
			enabled: false
		},
		colors: [
			"#F38D1C",
			"#F2A920",
			"#ECC71B",
			"#E8DC15"
		],
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		xAxis: {
			categories: ['Offline', 'Online', 'Idle', 'Active']
		},
		yAxis: {
			title: {
				text: ''
			}
		},
		series: [{
			name: 'Count',
			data: [['Offline', 0], ['Online', 0], ['Idle', 0], ['Active', 0]],
			dataLabels: {
				enabled: false
			},
			innerSize: '80%'
		}]
	};

	//Highcharts
	chart_browser: Highcharts.Chart;
	chart_visitors: Highcharts.Chart;
	chart_agents: Highcharts.Chart;
	chart_tickets: Highcharts.Chart;
	chart_newvisitors: Highcharts.Chart;
	chart_returningvisitors: Highcharts.Chart;

	//Highmaps Data
	os_details_data = [];
	os_details_drilldown = [];

	//browsers
	browsers = [
		{ name: 'chrome', key: 'chrome-colored' },
		{ name: 'uc', key: 'uc-colored' },
		{ name: 'firefox', key: 'firefox-colored' },
		{ name: 'maxthon', key: 'maxthon-colored' },
		{ name: 'explorer', key: 'explorer-colored' },
		{ name: 'opera', key: 'opera-colored' },
		{ name: 'safari', key: 'safari-colored' },
		{ name: 'edge', key: 'edge-colored' },
		{ name: 'other', key: 'browser-colored' }
	];
	browser_data = [];
	//Devices
	devices = [
		{ name: 'windows', key: 'windows-colored' },
		{ name: 'apple', key: 'apple-colored' },
		{ name: 'android', key: 'android-colored' }
	];
	device_data = [];
	//Inactive states
	inactive_states = {
		'browsing': {
			'active': 0,
			'inactive': 0
		},
		'queued': {
			'active': 0,
			'inactive': 0
		},
		'chatting': {
			'active': 0,
			'inactive': 0
		},
		'invited': {
			'active': 0,
			'inactive': 0
		},
		'inactive': {
			'active': 0,
			'inactive': 0
		},
		'left': {
			'active': 0,
			'inactive': 0
		}
	}

	//Filters
	filterType = 'all';

	package = undefined;

	constructor(
		public _chatService: ChatService,
		public _visitorService: Visitorservice,
		public _authService: AuthService,
		public _ticketService: TicketsService,
		public _agentService: AgentService,
		public _reportingService: AnalyticsService,
		private _appStateService : GlobalStateService,
		private _sanitizer: DomSanitizer) {
		this.totalVisitorLinks_data = []

		this.subscription.push(this._authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg.dashboard;
				if(!this.package.realtime){
					this._appStateService.NavigateTo('/noaccess');
				}
			}
		}));

		this.subscription.push(_authService.getAgent().subscribe(data => {
			this.agent = data;
			this.role = data.role;
		}));

		this.subscription.push(_authService.SBT.subscribe(data => {
			this.sbt = data;
		}));

		this.subscription.push(this._authService.getSettings().subscribe(settings => {
			if (settings && Object.keys(settings).length) {
				this.verified = settings.verified;
				(settings.expiry && settings.expiry != 'unlimited') ? this.daysRemaining = Math.floor((Date.parse(new Date(settings.expiry).toISOString()) - Date.parse(new Date().toISOString())) / 1000 / 60 / 60 / 24) : this.unlimited = true;
			}
			//console.log(data);
		}));

		this.subscription.push(_ticketService.getTicketsCount().subscribe(ticketsList => {
			// console.log('Gettings Tickets');
			console.log(ticketsList);

			this.solvedTicketsCount = 0;
			this.openTicketsCount = 0;
			this.pendingTicketsCount = 0;
			this.closedTicketsCount = 0;
			ticketsList.map(ticket => {
				if (ticket.state == "OPEN") this.openTicketsCount = ticket.count;
				else if (ticket.state == "PENDING") this.pendingTicketsCount = ticket.count
				else if (ticket.state == "SOLVED") this.solvedTicketsCount = ticket.count;
				else if (ticket.state == "CLOSED") this.closedTicketsCount = ticket.count;
			});
			this.totalTicketsCount = this.solvedTicketsCount + this.openTicketsCount + this.pendingTicketsCount + this.closedTicketsCount;
			if (this.totalTicketsCount && this.verified && this.highchatsLoaded.getValue()) {
				this.updateTicketsGraphData();
			}

		}));

		this.subscription.push(this.highchatsLoaded.subscribe(value => {
			if (value) this.InitializeGraphData();
		}));

		this.subscription.push(_visitorService.GetVisitorsList().debounceTime(500).subscribe(visitors => {
			// console.log('Getting Visitors');
			this.visitorList_original = visitors;
			this.totalVisitors_original = visitors.length;

			// if(this.visitorList_original.length && this.verified){
			// 	this.updateVisitorByCountryData(this.visitorList_original);
			// }

			if (this.filterType == 'all') {
				this.visitorList = visitors;
				this.totalVisitors = visitors.length;
			} else {
				this.visitorList = visitors.filter(v => v.fullCountryName == this.filterType);
				this.totalVisitors = this.visitorList.length;
			}
			// console.log(this.totalVisitors);
			this.browsingVisitors = 0;
			this.queuedVisitors = 0;
			this.chattingVisitors = 0;
			this.invitedVisitors = 0;
			this.inactiveVisitors = 0;
			this.newVisitors = 0;
			this.returningVisitors = 0;
			this.inactive_states = {
				'browsing': {
					'active': 0,
					'inactive': 0
				},
				'queued': {
					'active': 0,
					'inactive': 0
				},
				'chatting': {
					'active': 0,
					'inactive': 0
				},
				'invited': {
					'active': 0,
					'inactive': 0
				},
				'inactive': {
					'active': 0,
					'inactive': 0
				},
				'left': {
					'active': 0,
					'inactive': 0
				}
			}
			this.visitorList.map(visitor => {
				if (visitor.inactive) this.inactiveVisitors += 1;

				if (visitor.state == 1 && !visitor.inactive) {
					this.browsingVisitors += 1;
					// if(visitor.inactive) this.inactive_states['browsing'].inactive += 1;
					// this.inactive_states['browsing'].active = this.browsingVisitors - this.inactive_states['browsing'].inactive;
				} else if (visitor.state == 2 && !visitor.inactive) {
					this.queuedVisitors += 1;
					// if(visitor.inactive) this.inactive_states['queued'].inactive += 1;
					// this.inactive_states['queued'].active = this.queuedVisitors - this.inactive_states['queued'].inactive;
				} else if (visitor.state == 3 && !visitor.inactive) {
					this.chattingVisitors += 1;
					// if(visitor.inactive) this.inactive_states['chatting'].inactive += 1;
					// this.inactive_states['chatting'].active = this.chattingVisitors - this.inactive_states['chatting'].inactive;
				} else if ((visitor.state == 4 || visitor.state == 5) && !visitor.inactive) {
					this.invitedVisitors += 1;
					// if(visitor.inactive) this.inactive_states['invited'].inactive += 1;
					// this.inactive_states['invited'].active = this.invitedVisitors - this.inactive_states['invited'].inactive;
				}

				if (visitor.newUser) {
					this.newVisitors += 1;
				} else {
					this.returningVisitors += 1;
				}
			});
			if (this.visitorList.length && this.verified) {
				if (this.highchatsLoaded.getValue()) {
					this.updateNewAndReturningVisitors();
					this.updateVisitorsGraphData();
					// console.log(this.inactive_states);

				}
				this.updateDeviceInfoGraphByBrowser(this.visitorList);
				this.updateDeviceInfoGraphByOS(this.visitorList);
				this.updateTopVisitedLinksData(this.visitorList);
				this.updateTopReferers(this.visitorList.filter(v => v.referrer));
			}
		}));

		this.subscription.push(_agentService.agentCounts.subscribe(agentCounts => {
			// console.log('Getting Agents');
			if (agentCounts) {
				// console.log(agentCounts);
				this.totalAgents = agentCounts.total;
				this.onlineAgents = agentCounts.agents.length;
				this.offlineAgents = (agentCounts.total - agentCounts.agents.length);
				this.idleAgents = agentCounts.agents.filter(a => a.state == 'idle').length;
				this.activeAgents = agentCounts.agents.filter(a => a.state == 'active').length;
				if (this.totalAgents && this.verified && this.role != 'agent' && this.highchatsLoaded.getValue()) {
					this.updateAgentsGraphData();
				}
			}
		}));

		//Loading Variables Coresponding to their Services
		//All the Initial Dashboard Content is HOT LOADED
		this.subscription.push(_visitorService.getLoadingVisitors().subscribe(data => {
			this.loadingVisitors = data;
			// console.log('Loading visitors: '+data);
		}));

		this.subscription.push(_ticketService.GetLoadingCount().subscribe(data => {
			this.loadingTickets = data;
		}));

		this.subscription.push(_agentService.getLoadingVariable().subscribe(data => {
			this.loadingAgents = data;
		}));

		// this.subscription.push(_ticketService.getloadingTickets("TICKETS").subscribe(data => {
		//     this.loadingTickets = data;
		// }));

	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		if (this.verified) {
			// this.chart_browser = new Highcharts.Chart("browser_details", this.options_browser);
			this.chart_visitors = new Highcharts.Chart("visitor_details", this.options_visitor);
			if (this.role != 'agent') {
				this.chart_agents = new Highcharts.Chart("agent_details", this.options_agents);
			}
			this.chart_tickets = new Highcharts.Chart("ticket_details", this.options_tickets);
			this.chart_newvisitors = new Highcharts.Chart("newvisitors", this.options_newvisitors);
			this.chart_returningvisitors = new Highcharts.Chart("returningvisitors", this.options_returningvisitors);
			this.highchatsLoaded.next(true);
		}
	}

	ngOnDestroy() {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		clearInterval(this.interval_country);
		this.subscription.forEach(subscription => {
			subscription.unsubscribe();
		});
		if (this.verified && this.highchatsLoaded.getValue()) {
			// this.chart_country.destroy();
			// this.chart_browser.destroy();
			this.chart_visitors.destroy();
			(this.role != 'agent' && this.chart_agents.destroy());
			this.chart_tickets.destroy();
			this.chart_newvisitors.destroy();
			this.chart_returningvisitors.destroy();
		}
	}

	InitializeGraphData() {
		if (this.visitorList.length) {
			this.updateNewAndReturningVisitors();
			this.updateVisitorsGraphData();
		}
		if (this.totalAgents && this.role != 'agent') {
			this.updateAgentsGraphData();
		}
		if (this.totalTicketsCount) {
			this.updateTicketsGraphData();
		}
	}
	//REALTIME TRANSFORMATION OF DATA
	updateTicketsGraphData() {
		if (this.totalTicketsCount) {
			if (this.chart_tickets) {
				this.chart_tickets.hideLoading();
				this.chart_tickets.series[0].setData([['Open', this.openTicketsCount], ['Pending', this.pendingTicketsCount], ['Solved', this.solvedTicketsCount], ['Closed', this.closedTicketsCount]]);
			} else {
				setTimeout(() => {
					this.chart_tickets.hideLoading();
					this.chart_tickets.series[0].setData([['Open', this.openTicketsCount], ['Pending', this.pendingTicketsCount], ['Solved', this.solvedTicketsCount], ['Closed', this.closedTicketsCount]]);
				}, 0);
			}
		}
	}
	updateAgentsGraphData() {
		if (this.totalAgents) {
			if (this.chart_agents) {
				this.chart_agents.hideLoading();
				this.chart_agents.series[0].setData([['Offline', this.offlineAgents], ['Online', this.onlineAgents], ['Idle', this.idleAgents], ['Active', this.activeAgents]]);
			} else {
				setTimeout(() => {
					this.chart_agents.hideLoading();
					this.chart_agents.series[0].setData([['Offline', this.offlineAgents], ['Online', this.onlineAgents], ['Idle', this.idleAgents], ['Active', this.activeAgents]]);
				}, 0);
			}
		}
	}
	updateVisitorsGraphData() {
		if (this.totalVisitors) {
			if (this.chart_visitors) {
				this.chart_visitors.hideLoading();
				this.chart_visitors.series[0].setData([["Browsing", this.browsingVisitors], ["Queued", this.queuedVisitors], ["Chatting", this.chattingVisitors], ["Invited", this.invitedVisitors], ["Inactive", this.inactiveVisitors]]);
			} else {
				setTimeout(() => {
					this.chart_visitors.hideLoading();
					this.chart_visitors.series[0].setData([["Browsing", this.browsingVisitors], ["Queued", this.queuedVisitors], ["Chatting", this.chattingVisitors], ["Invited", this.invitedVisitors], ["Inactive", this.inactiveVisitors]]);
				}, 0);
			}
		}
	}
	updateNewAndReturningVisitors() {
		if (this.newVisitorsArray.length == 10) {
			this.newVisitorsArray.shift();
		}
		this.newVisitorsArray.push({
			y: this.newVisitors,
			color: (this.newVisitorsArray[this.newVisitorsArray.length - 1].color == '#029D9F') ? '#99D8D8' : '#029D9F'
		});

		if (this.returningVisitorsArray.length == 10) {
			this.returningVisitorsArray.shift();
		}
		this.returningVisitorsArray.push(
			{
				y: this.returningVisitors,
				color: (this.returningVisitorsArray[this.returningVisitorsArray.length - 1].color == '#666666') ? '#afb6c4' : '#666666'
			}
		);

		if (this.chart_newvisitors) {
			this.chart_newvisitors.hideLoading();
			this.chart_newvisitors.series[0].setData(this.newVisitorsArray);
		} else {
			setTimeout(() => {
				this.chart_newvisitors.hideLoading();
				this.chart_newvisitors.series[0].setData(this.newVisitorsArray);
			}, 0);
		}
		if (this.chart_returningvisitors) {
			this.chart_returningvisitors.hideLoading();
			this.chart_returningvisitors.series[0].setData(this.returningVisitorsArray);
		} else {
			setTimeout(() => {
				this.chart_returningvisitors.hideLoading();
				this.chart_returningvisitors.series[0].setData(this.returningVisitorsArray);
			}, 0);
		}

		// console.log(this.newVisitorsArray);
		// console.log(this.returningVisitorsArray);

	}
	BrowserDevicesToggle(value: string) {
		this.browserDevicesTogle = value;
	}
	updateTopVisitedLinksData(visitorList) {
		let urls = [];
		let topVisitedURLS = [];
		this.graph_totalVisitedLinks = 0;
		visitorList.forEach(element => {
			// pageViews += element.url.length;
			urls.push({
				"url": element.url[0]
			});
		});
		// console.log(urls);
		this.groupBy(urls, k => k.url).forEach((element, key) => {
			// this.graph_totalVisitedLinks += element.length
			topVisitedURLS.push({
				"name": key,
				"value": element.length
			});
		});
		topVisitedURLS = topVisitedURLS.sort((a, b) => {
			return (a.value > b.value) ? -1 : 1
		}).slice(0, 10);
		topVisitedURLS.forEach(url => {
			// url.countries = [];
			// let filtered = visitorList.filter(v => v.url.includes(url.name));
			// this.groupBy(filtered, v => v.country).forEach((element, key) => {
			// 	url.countries.push(key)
			// });
			this.graph_totalVisitedLinks += url.value
		})
		this.totalVisitorLinks_data = topVisitedURLS;

		// console.log(this.graph_totalVisitedLinks);

	}
	updateTopReferers(visitorList) {
		let urls = [];
		let referers = [];
		this.graph_totalReferers = 0;
		visitorList.forEach(element => {
			// pageViews += element.url.length;
			urls.push({
				"url": element.referrer
			});
		});
		// console.log(urls);
		this.groupBy(urls, k => k.url).forEach((element, key) => {
			// this.graph_totalVisitedLinks += element.length
			referers.push({
				"name": key,
				"value": element.length
			});
		});
		referers = referers.sort((a, b) => {
			return (a.value > b.value) ? -1 : 1
		}).slice(0, 10);
		referers.forEach(url => {
			// url.countries = [];
			// visitorList.forEach(element => {
			// 	if(element.referrer == url.name){
			// 		if(!url.countries.filter(c => c == element.country).length){
			// 			url.countries.push(element.country)
			// 		}
			// 	}
			// });
			// this.groupBy(filtered, v => v.country).forEach((element, key) => {
			// 	url.countries.push(key)
			// });
			this.graph_totalReferers += url.value
		});
		// console.log(referers);

		this.graph_Referers = referers;
	}

	sanitizedURL(value) {
		return this._sanitizer.bypassSecurityTrustUrl(value)
	}

	updateDeviceInfoGraphByBrowser(visitorList) {
		this.browser_data = [];
		// console.log(visitorList);
		let browser_data = [];
		// let byOS = [];
		let fitered = visitorList.filter(v => v.deviceInfo && v.deviceInfo.os && v.deviceInfo.os != 'undefined' && v.deviceInfo.os != 'null');
		let other = visitorList.filter(v => !v.deviceInfo || !v.deviceInfo.os || v.deviceInfo.os == 'undefined' || v.deviceInfo.os == 'null');
		if (other.length) {
			// byOS.push({
			// 	"name": "Other",
			// 	"y": other.length,
			// 	"drilldown": null
			// });
			browser_data.push({
				'key': 'browser-colored',
				'name': 'other',
				'count': other.length
			});
		}
		this.groupBy(fitered, v => v.deviceInfo.os).forEach((element, key) => {
			if (browser_data.filter(b => key.toLowerCase().includes(b.key.toLowerCase()) || b.key.toLowerCase().includes(key.toLowerCase())).length && browser_data.length) {
				browser_data.filter(b => key.toLowerCase().includes(b.key.toLowerCase()) || b.key.toLowerCase().includes(key.toLowerCase()))[0].count += element.length;
			} else {
				if (this.browsers.filter(b => key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase())).length) {
					browser_data.push({
						'key': this.browsers.filter(b => key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()))[0].key,
						'name': this.browsers.filter(b => key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()))[0].name,
						'count': element.length
					});
				} else {
					if (browser_data.filter(b => b.name == 'other').length) {
						browser_data.filter(b => b.name == 'other')[0].count += element.length;
					} else {
						browser_data.push({
							'key': 'browser-colored',
							'name': 'other',
							'count': element.length
						});
					}
				}
			}

		});
		browser_data.sort((a, b) => {
			return (a.count < b.count) ? 1 : -1
		});
		this.browser_data = browser_data;
	}
	updateDeviceInfoGraphByOS(visitorList) {
		this.device_data = [];
		let device_data = [];
		let fitered = visitorList.filter(v => v.deviceInfo.name && v.deviceInfo.name != 'undefined');
		let other = visitorList.filter(v => !v.deviceInfo.name || v.deviceInfo.name == 'undefined');
		if (other.length) {
			device_data.push({
				'key': 'browser-colored',
				'name': 'other',
				'count': other.length
			});
		}
		this.groupBy(fitered, v => v.deviceInfo.name).forEach((element, key) => {
			if (device_data.filter(b => key.toLowerCase().includes(b.key.toLowerCase()) || b.key.toLowerCase().includes(key.toLowerCase())).length && device_data.length) {
				device_data.filter(b => key.toLowerCase().includes(b.key.toLowerCase()) || b.key.toLowerCase().includes(key.toLowerCase()))[0].count += element.length;
				// browser_data.filter(b => b.key.toLowerCase().includes(key.toLowerCase()))[0].count += element.length;
			} else {
				if (this.devices.filter(b => key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase())).length) {
					device_data.push({
						'key': this.devices.filter(b => key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()))[0].key,
						'name': this.devices.filter(b => key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()))[0].name,
						'count': element.length
					});
				} else {
					if (device_data.filter(b => b.name == 'other').length) {
						device_data.filter(b => b.name == 'other')[0].count += element.length;
					} else {
						device_data.push({
							'key': 'browser-colored',
							'name': 'other',
							'count': element.length
						});
					}
				}
			}
		});
		device_data.sort((a, b) => {
			return (a.count < b.count) ? 1 : -1
		});
		this.device_data = device_data;
		// console.log(this.device_data);

	}
	applyCountryFilter(filter_type) {
		this.filterType = filter_type;
		switch (filter_type) {
			case 'all':
				this.visitorList = this.visitorList_original;
				break;
			default:
				this.visitorList = this.visitorList.filter(v => v.fullCountryName == filter_type);
				break;
		}
		console.log(this.visitorList);
		this.browsingVisitors = 0;
		this.queuedVisitors = 0;
		this.chattingVisitors = 0;
		this.invitedVisitors = 0;
		this.inactiveVisitors = 0;
		this.newVisitors = 0;
		this.returningVisitors = 0;
		this.inactive_states = {
			'browsing': {
				'active': 0,
				'inactive': 0
			},
			'queued': {
				'active': 0,
				'inactive': 0
			},
			'chatting': {
				'active': 0,
				'inactive': 0
			},
			'invited': {
				'active': 0,
				'inactive': 0
			},
			'inactive': {
				'active': 0,
				'inactive': 0
			},
			'left': {
				'active': 0,
				'inactive': 0
			}
		}
		this.visitorList.map(visitor => {
			if (visitor.inactive) this.inactiveVisitors += 1;

			if (visitor.state == 1 && !visitor.inactive) {
				this.browsingVisitors += 1;
				// if(visitor.inactive) this.inactive_states['browsing'].inactive += 1;
				// this.inactive_states['browsing'].active = this.browsingVisitors - this.inactive_states['browsing'].inactive;
			} else if (visitor.state == 2 && !visitor.inactive) {
				this.queuedVisitors += 1;
				// if(visitor.inactive) this.inactive_states['queued'].inactive += 1;
				// this.inactive_states['queued'].active = this.queuedVisitors - this.inactive_states['queued'].inactive;
			} else if (visitor.state == 3 && !visitor.inactive) {
				this.chattingVisitors += 1;
				// if(visitor.inactive) this.inactive_states['chatting'].inactive += 1;
				// this.inactive_states['chatting'].active = this.chattingVisitors - this.inactive_states['chatting'].inactive;
			} else if (visitor.state == 4 && !visitor.inactive) {
				this.invitedVisitors += 1;
				// if(visitor.inactive) this.inactive_states['invited'].inactive += 1;
				// this.inactive_states['invited'].active = this.invitedVisitors - this.inactive_states['invited'].inactive;
			}

			if (visitor.newUser) {
				this.newVisitors += 1;
			} else {
				this.returningVisitors += 1;
			}
		});
		if (this.highchatsLoaded.getValue()) {
			this.updateNewAndReturningVisitors();
			this.updateVisitorsGraphData();
			// console.log(this.inactive_states);

		}
		this.updateDeviceInfoGraphByBrowser(this.visitorList);
		this.updateDeviceInfoGraphByOS(this.visitorList);
		// this.updateVisitorByCountryData(this.visitorList);
		this.updateTopVisitedLinksData(this.visitorList);
		this.updateTopReferers(this.visitorList.filter(v => v.referrer));
	}
	//GRAPH EVENT HANDLERS

	//HELPERS
	groupBy(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [item]);
			} else {
				collection.push(item);
			}
		});
		return map;
	}
	extractHostname(url) {
		var urlParts = url.toString().replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/);
		var domain = '';
		if (urlParts[0].split('.').length) {
			domain = urlParts[0].split('.')[0];
		} else {
			domain = urlParts[0];
		}
		return domain.charAt(0).toUpperCase() + domain.slice(1);;
	}
	//HELPERS

	FormatURL(url){
		try {
			// console.log(url);
			return (new URL(url).protocol  + '//' + new URL(url).hostname)

		} catch (e) {
			return url
		}
	}
}
