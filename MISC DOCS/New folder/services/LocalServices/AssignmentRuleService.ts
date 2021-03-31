import { Injectable } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';

import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";
import { FormControl, FormGroup } from "@angular/forms";

@Injectable()
export class AssignmentAutomationSettingsService {
    subscriptions: Subscription[] = [];
    socket: SocketIOClient.Socket;
    fetchingCases: BehaviorSubject<boolean> = new BehaviorSubject(true);
    RulesList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    RuleSetList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    groupsList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    requestState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public assignmentRuleForm: FormGroup;
    filterKeys: BehaviorSubject<Array<string>> = new BehaviorSubject([]);
    addingRule: BehaviorSubject<boolean> = new BehaviorSubject(false);
    agent: any
    selectedRule: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public customFields: BehaviorSubject<any> = new BehaviorSubject(undefined);


    constructor(private _socketService: SocketService, private _authService: AuthService) {
        //console.log('AssignmentAutomationSettingsService Initialized');

        this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            this.socket = socket;

        }));

        this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
            this.agent = agent;

        }));

        this.GetRules()
        this.GetRulesSets()
        this.GetGroups()
        this.GetChatWindowSettings()
    }
    public AddNewRule(data): Observable<any> {
        return new Observable((observer) => {
            this.requestState.next(true);
            this.socket.emit('addAssignmentRule', data, (response) => {
                if (response.status == 'ok') {

                    this.RulesList.getValue().unshift(response.rule);
                    this.RulesList.next(this.RulesList.getValue());
                    //console.log(response);
                    observer.next(response);
                    observer.complete()

                }
                else observer.error()
            });
        });
    }




    public AddNewRuleSet(data): Observable<any> {
        return new Observable((observer) => {
            this.requestState.next(true);
            this.socket.emit('addAssignmentRuleSet', data, (response) => {
                // console.log(response);
                if (response.status == 'ok') {
                    
                    if (response.ruleSet) {
                        this.RuleSetList.getValue().unshift(response.ruleSet)
                        this.RuleSetList.next(this.RuleSetList.getValue())
                    }
                    observer.next(response);
                    observer.complete()

                }
                else observer.error()
            });
        });
    }

    public GetChatWindowSettings() {
        if (!this.customFields.getValue()) {
            this.socket.emit('getDisplaySettings', {}, (response => {

                if (response.status == 'ok') {
                    this.customFields.next(response.settings.settings.chatwindow.registerationForm.customFields);
                }
            }));
        }
    }

    private GetGroups() {

        this.socket.emit('getGroupByNSP', {}, (response) => {
            //console.log(response.rooms);
            if (response.status == 'ok') {
                this.groupsList.next(response.group_data);
            }
        });

    }

    public UpdateRulesets(id, obj): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('updateAssignmentRuleSet', { id: id, ruleset: obj }, response => {
                // console.log(response);

                if (response.status == 'ok') {
                    this.RuleSetList.next(this.RuleSetList.getValue().map(ruleset => {
                        if (ruleset._id == response.ruleset._id) {
                            ruleset = response.ruleset;
                        }
                        return ruleset;
                    }))
                    this.selectedRule.next(undefined);
                    observer.next(response);
                    observer.complete();
                }
                else observer.error({ status: 'error' });
            });
        });
    }


    public DeleteNewRule(data): Observable<any> {
        return new Observable((observer) => {
            this.requestState.next(true);
            this.socket.emit('deleteAssignmentRule', data, (response) => {

                if (response.status == 'ok') {
                    this.RuleSetList.next(this.RuleSetList.getValue().filter(rule => {
                        return rule._id != data.id;
                    }));

                    observer.next(response);
                    observer.complete()

                }
                else observer.error()
            });
        });
    }

    GetRules() {
        this.fetchingCases.next(true);
        if (!localStorage.getItem('assignmentRules')) {
            this.socket.emit('getRules', {}, (response => {
                this.fetchingCases.next(false);
                if (response.status == 'ok') {
                    //console.log(response);

                    this.RulesList.next(response.rulesList);
                    localStorage.setItem('assignmentRules', JSON.stringify(response.rulesList));
                }
            }));
        } else {
            let rules: Array<any> = JSON.parse(localStorage.getItem('assignmentRules'));
            if (rules.length > 0) {
                this.socket.emit('getRules', { id: rules[0]._id }, (response => {
                    this.fetchingCases.next(false);
                    if (response.status == 'ok') {
                        this.RulesList.next((response.rulesList as Array<any>).concat(rules))
                        localStorage.setItem('assignmentRules', JSON.stringify(this.RulesList.getValue()));
                    }

                }));
            } else {
                this.socket.emit('getRules', {}, (response => {
                    this.fetchingCases.next(false);
                    if (response.status == 'ok') {
                        //console.log(response);
                        this.RulesList.next(response.rulesList);
                        localStorage.setItem('assignmentRules', JSON.stringify(response.rulesList));
                    }
                }));
            }
        }

    }


    GetRulesSets() {
        this.fetchingCases.next(true);

        this.socket.emit('getAssignmentRuleSets', {}, (response => {
            this.fetchingCases.next(false);
            if (response.status == 'ok') {
                // console.log(response);

                this.RuleSetList.next(response.ruleSetList);

            }
        }))
    }

    public EditRule(data: any): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('editRule', data, (response) => {
                //console.log(response);

                if (response.status == 'ok') {
                    // this.RulesList.next(this.RulesList.getValue().map(Rule => {

                    //     if (Rule._id == response.rule.value._id) {
                    //         Rule = response.rule.value;

                    //     }

                    //     return Rule;

                    // }));
                    this.RulesList.next(this.RulesList.getValue().filter(rule => {
                        return rule._id != response.rule.value._id;
                    }));
                    this.RulesList.getValue().unshift(response.rule.value);
                    this.RulesList.next(this.RulesList.getValue());
                    localStorage.setItem('chatBotCases', JSON.stringify(this.RulesList.getValue()));
                }
                observer.next(response);
                observer.complete();
            });
        });
    }

    GetFilters(filterKey): Observable<any> {
        return new Observable(observer => {
            //let filters = Object.keys(this.agent);
            this.filterKeys.next([]);
            this.socket.emit('getFiltersForAssignment', { nsp: this.agent.nsp, filterKey: filterKey }, (response) => {
                if (response.filterKeys) {
                    this.UpdateFilterKeys(response.filterKeys);

                    observer.next(true)
                    observer.complete();

                }
                else {
                    observer.next(false);
                }
            });
        })
    }


    UpdateFilterKeys(collections) {

        let result: Array<string> = [];

        Object.keys(collections).map((key, index) => {

            result = result.concat(Object.keys(collections[key]))
        })

        let unique = result.filter(function (item, pos) { return result.indexOf(item) == pos });

        this.filterKeys.next([])
        this.filterKeys.next(unique);
    }

    public ToggleActivation(id, activation): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('toggleAssignRuleSet', { id: id, activation: activation }, response => {
                if (response.status == 'ok') {
                    this.RuleSetList.next(this.RuleSetList.getValue().map(ruleset => {
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
    // Destroy() {
    //     this.subscriptions.forEach(res => {
    //         res.unsubscribe();
    //     })
    // }
}