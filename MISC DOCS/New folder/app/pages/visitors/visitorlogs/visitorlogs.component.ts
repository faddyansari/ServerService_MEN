// import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
// import { Visitorservice } from '../../../../services/VisitorService';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Subscription } from 'rxjs/Subscription';
// import { SocketService } from '../../../../services/SocketService';

// @Component({
// 	selector: 'app-visitorlogs',
// 	templateUrl: './visitorlogs.component.html',
// 	styleUrls: ['./visitorlogs.component.scss'],
// 	encapsulation: ViewEncapsulation.None
// })
// export class VisitorlogsComponent implements OnInit {
// 	// @Input() visitor: any
// 	// @Input() agent: any
// 	public visitorLogs: Array<any> = [];
// 	private SelectedvisitorLogs: any;
// 	public Logs: any;
// 	subscriptions: Subscription[] = [];

// 	constructor(private _visitorService: Visitorservice, private _socketService: SocketService) {

// 		this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
// 			if (socket) {
// 				this.subscriptions.push(this._visitorService.getSelectedVisitor().subscribe(selectedvisitor => {
// 					this.SelectedvisitorLogs = selectedvisitor;
// 					if (this.SelectedvisitorLogs) {
// 						if (!this.SelectedvisitorLogs.logsFetched) this.SelectedvisitorLogs.logsFetched = false;
// 						if (!this.SelectedvisitorLogs.logsFetched && !this.SelectedvisitorLogs.logs) {
// 							// this.getLogs();
// 							this._visitorService.GetVisitorLogs(this.SelectedvisitorLogs._id).subscribe(data => {

// 								if (data && this.SelectedvisitorLogs) {
// 									this.SelectedvisitorLogs.logs = data.slice();
// 									this.SelectedvisitorLogs.logsFetched = true;
// 									this._visitorService.UpdateVisitor(this.SelectedvisitorLogs).subscribe(data => {
// 										if (data) {
// 											let transformedLogs = this.transformVisitorsLog(this.SelectedvisitorLogs.logs);
// 											this.Logs = transformedLogs;

// 										}
// 										else { }

// 									});

// 								}
// 							})
// 						}
// 						else {
// 							//console.log(this.SelectedvisitorLogs.logs)
// 							if (this.SelectedvisitorLogs && this.SelectedvisitorLogs.length) {
// 								this._visitorService.GetVisitorLogs(this.SelectedvisitorLogs._id, this.SelectedvisitorLogs.logs[this.SelectedvisitorLogs.logs.length - 1]._id).subscribe(data => {
// 									let logs = data.slice();
// 									if (logs && logs.length) this.SelectedvisitorLogs.logs = this.SelectedvisitorLogs.logs.concat(logs)
// 									let transformedLogs = this.transformVisitorsLog(this.SelectedvisitorLogs.logs);
// 									this.Logs = transformedLogs;
// 								})
// 							}
// 						}
// 					}
// 				}));
// 			}
// 		}));



// 		// this.subscriptions.push(this._visitorService.GetVisitorsLogUpdated.subscribe(updatedlogs => {
// 		//     console.log(updatedlogs)
// 		//     // this.SelectedvisitorLogs.logs.push(updatedlogs);
// 		//     // let transformedLogs = this.transformVisitorsLog(this.SelectedvisitorLogs.logs);
// 		//     // this.Logs = transformedLogs;

// 		// }));

// 	}

// 	ngOnInit() {

// 	}


// 	getLogs() {
// 		this._visitorService.GetVisitorLogs(this.SelectedvisitorLogs._id).subscribe(data => {

// 			if (data) {
// 				this.SelectedvisitorLogs.logs = data.slice();
// 				this.SelectedvisitorLogs.logsFetched = true;
// 			}
// 		})

// 	}

// 	transformVisitorsLog(log: Array<any>): Array<any> {
// 		let Visitorlogarr = [];
// 		let Visitorlogsingular: any;
// 		Visitorlogarr = log;
// 		if (Visitorlogarr.length > 0) {
// 			Visitorlogarr = Visitorlogarr.reduce((previous, current) => {
// 				if (!previous[new Date(current.time_stamp).toDateString()]) {
// 					previous[new Date(current.time_stamp).toDateString()] = [current];
// 				} else {
// 					previous[new Date(current.time_stamp).toDateString()].push(current);
// 				}

// 				return previous;
// 			}, {});
// 		}

// 		Visitorlogsingular = Object.keys(Visitorlogarr).map(key => {
// 			return { date: key, groupedvisitorlogList: Visitorlogarr[key] }
// 		}).sort((a, b) => {

// 			if (new Date(a.date) > new Date(b.date)) return -1;
// 			else if (new Date(a.date) < new Date(b.date)) return 1;
// 			else 0;

// 		});

// 		Visitorlogsingular.forEach(element => {
// 			element.groupedvisitorlogList.sort((a, b) => {
// 				if (new Date(a.time_stamp) > new Date(b.time_stamp)) return -1;
// 				else if (new Date(a.time_stamp) < new Date(b.time_stamp)) return 1;
// 				else 0;
// 			})
// 		});
// 		return Visitorlogsingular;
// 	}

// 	ngOnDestroy() {
// 		//Called once, before the instance is destroyed.
// 		//Add 'implements OnDestroy' to the class.
// 		this.subscriptions.forEach(subscription => {
// 			subscription.unsubscribe();
// 		});
// 	}

// }
