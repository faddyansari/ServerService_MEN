import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { Observable } from "rxjs/Observable";
import { UtilityService } from "../UtilityServices/UtilityService";
import { Http } from "@angular/http";




@Injectable()
export class RulesetSettingsService {

	public Addrule: BehaviorSubject<boolean> = new BehaviorSubject(false);
	public EditRule: BehaviorSubject<boolean> = new BehaviorSubject(false);
	private subscriptions: Subscription[] = [];
	public groupsList: BehaviorSubject<any> = new BehaviorSubject(undefined);
	public agentsList: BehaviorSubject<any> = new BehaviorSubject(undefined);
	public RulesList: BehaviorSubject<any> = new BehaviorSubject([]);
	public SelectedRule: BehaviorSubject<any> = new BehaviorSubject(undefined);
	public Agent: any = undefined;
	private socket: SocketIOClient.Socket;
	ticketServiceURL = '';

	constructor(private _socketService: SocketService,
		private _authService: AuthService,
		private http: Http,
		private _utilityService: UtilityService) {
		_authService.RestServiceURL.subscribe(url => {
			this.ticketServiceURL = url + '/api/tickets';
		});

		this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
			if (agent) {
				this.Agent = agent;
			}

		}));

		this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
			this.socket = socket;
			this.GetGroups();
			this.GetRulesets();
		}));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agentList => {
			this.agentsList.next(agentList);
		}));




	}

	private GetGroups() {

		this.socket.emit('getGroupByNSP', {}, (response) => {
			//console.log(response.rooms);
			if (response.status == 'ok') {
				this.groupsList.next(response.group_data);
			}
		});

	}


	public AddRuleSet(obj): Observable<any> {
		return new Observable(observer => {
			this.http.post(this.ticketServiceURL + '/addRuleSet', { ruleset: obj, nsp: this.Agent.nsp }).subscribe(response => {
				if(response.json()){
					let data = response.json();
					if (data.status == 'ok') {
						this.RulesList.getValue().push(data.ruleset);
						this.RulesList.next(this.RulesList.getValue());
						this.Addrule.next(false);
					}
					observer.next(data);
					observer.complete();
				}
			});
		});
	}

	public GetRulesets() {
		this.socket.emit('getRuleset', {}, response => {
			if (response.status == 'ok') {
				this.RulesList.next(response.rulesets);
				this.Addrule.next(false);
			}
		});
	}
	public GetRuleSetScheduler(): Observable<any> {
		return new Observable((observer) => {
			this.socket.emit('getRulesetScheduler', {}, response => {
				if (response.status == 'ok') {
					observer.next(response.scheduler);
					observer.complete();
				} else {
					observer.next(undefined);
					observer.complete();
				}
			});
		})
	}
	public SetRuleSetScheduler(scheduler): Observable<any> {
		return new Observable((observer) => {
			this.socket.emit('setRulesetScheduler', { scheduler: scheduler }, response => {
				observer.next(response);
				observer.complete();
			});
		})
	}


	public UpdateRulesets(id, obj): Observable<any> {
		return new Observable(observer => {
			this.socket.emit('updateRuleSet', { id: id, ruleset: obj }, response => {
				if (response.status == 'ok') {
					this.RulesList.next(this.RulesList.getValue().map(ruleset => {
						if (ruleset._id == response.ruleset._id) {
							ruleset = response.ruleset;
						}
						return ruleset;
					}))
					this.SelectedRule.next(undefined);
					observer.next(response);
					observer.complete();
				}
				else observer.error({ status: 'error' });
			});
		});
	}


	public DeleteRulesets(id): Observable<any> {
		return new Observable(observer => {
			this.socket.emit('deleteRule', { id: id }, response => {
				if (response.status == 'ok') {
					this.RulesList.next(this.RulesList.getValue().filter(ruleset => {

						return (ruleset._id != id)

					}));
					observer.next(response);
					observer.complete();
				}
				else observer.error({ status: 'error' });
			});
		});
	}


	public ToggleActivation(id, activation): Observable<any> {
		return new Observable(observer => {
			this.socket.emit('toggleActivation', { id: id, activation: activation }, response => {
				if (response.status == 'ok') {
					this.RulesList.next(this.RulesList.getValue().map(ruleset => {
						if (ruleset._id == response.ruleset._id) {
							ruleset = response.ruleset;
						}
						return ruleset;
					}));
					observer.next(response);
					observer.complete();
				}
				else observer.error({ status: 'error' });
			});
		});
	}

	public Destroy() {
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}
}