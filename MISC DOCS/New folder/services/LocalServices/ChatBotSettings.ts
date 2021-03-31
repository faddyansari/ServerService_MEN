// Angular Imports
import { Injectable } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';

import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";



@Injectable()
export class ChatBotSettingsService {



    CasesList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    StateMachineList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    WorkFlowsList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

    socket: SocketIOClient.Socket;
    subscriptions: Subscription[] = [];
    requestState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private fetchingCases: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private fetchingMachines: BehaviorSubject<boolean> = new BehaviorSubject(true);

    constructor(private _socketService: SocketService) {

        this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            this.socket = socket;
            this.GetCases()
            this.GetMachines();
            this.GetWorkFlows();
        }));

    }


    public GetCasesList(): Observable<any> {
        return this.CasesList.asObservable();
    }
    public GetStateMachineList(): Observable<any> {
        return this.StateMachineList.asObservable();
    }

    public GetWorkFlowsList(): Observable<any> {
        return this.WorkFlowsList.asObservable();
    }

    public FetchingCases(): Observable<boolean> {
        return this.fetchingCases.asObservable();
    }
    public FetchingMachines(): Observable<boolean> {
        return this.fetchingCases.asObservable();
    }

    public GetRequestState(): Observable<boolean> {
        return this.requestState.asObservable();
    }

    public UpdateCasesList(data: any) {
        this.CasesList.getValue().map(Case => {
            if (Case._id == data._id) {
                Case = data;
            }
        });
    }

    public AddNewCase(data): Observable<any> {
        return new Observable((observer) => {
            this.requestState.next(true);
            this.socket.emit('addCase', data, (response) => {
                this.requestState.next(false);
                if (response.status == 'ok') {
                    data._id = response.id;
                    this.CasesList.getValue().unshift(data);
                    this.CasesList.next(this.CasesList.getValue());
                    observer.next(response);
                    observer.complete();
                } else if (response.status == 'exists') {
                    this.CasesList.getValue().unshift(response.case);
                    this.CasesList.next(this.CasesList.getValue());
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error("Can't Add Case");
                }
            });
        });
    }

    public GetCases() {
        this.fetchingCases.next(true);
        if (!localStorage.getItem('chatBotCases')) {
            this.socket.emit('getCases', {}, (response => {
                this.fetchingCases.next(false);
                if (response.status == 'ok') {
                    this.CasesList.next(response.cases);
                    localStorage.setItem('chatBotCases', JSON.stringify(response.cases));
                }
            }));
        } else {
            let cases: Array<any> = JSON.parse(localStorage.getItem('chatBotCases'));
            if (cases.length > 0) {
                this.socket.emit('getCases', { id: cases[0]._id }, (response => {
                    this.fetchingCases.next(false);
                    if (response.status == 'ok') {
                        this.CasesList.next((response.cases as Array<any>).concat(cases))
                        localStorage.setItem('chatBotCases', JSON.stringify(this.CasesList.getValue()));
                    }

                }));
            } else {
                this.socket.emit('getCases', {}, (response => {
                    this.fetchingCases.next(false);
                    if (response.status == 'ok') {
                        this.CasesList.next(response.cases);
                        localStorage.setItem('chatBotCases', JSON.stringify(response.cases));
                    }
                }));
            }
        }
    }

    public DeleteCase(data): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('deleteCase', { id: data }, (response) => {
                if (response.status == 'ok') {
                    this.CasesList.next(this.CasesList.getValue().filter(Case => {
                        return Case._id != data;
                    }));
                    localStorage.setItem('chatBotCases', JSON.stringify(this.CasesList.getValue()));
                    observer.next(response);
                    observer.complete();
                } else if (response.status == 'assigned') {
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error('Error In Deleting Case');
                }
            });
        });

    }

    public FilterCases(data) {

    }

    public EditCase(data: any): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('editCase', data, (response) => {
                if (response.status == 'ok') {
                    this.CasesList.next(this.CasesList.getValue().map(Case => {
                        if (response.case) {
                            if (Case._id == response.case._id) {
                                Case = response.case;
                            }
                        }
                        return Case;
                    }));
                    localStorage.setItem('chatBotCases', JSON.stringify(this.CasesList.getValue()));
                }
                observer.next(response);
                observer.complete();
            });
        });
    }


    //#region StateMAchine Operations



    public AddNewMachine(data): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('addMachine', data, (response => {
                if (response.status == 'ok') {
                    data._id = response.id;
                    this.StateMachineList.getValue().unshift(data);
                    this.StateMachineList.next(this.StateMachineList.getValue());
                    observer.next(response);
                    observer.complete();
                } else if (response.status == 'exists') {
                    this.StateMachineList.getValue().unshift(response.machine);
                    this.StateMachineList.next(this.StateMachineList.getValue());
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error("Can't Add State Machine");
                }
            }));
        });
    }


    public GetMachines() {
        this.fetchingMachines.next(true);
        if (!localStorage.getItem('chatBotMachines')) {
            this.socket.emit('getMachines', {}, (response => {
                // console.log(response);
                this.fetchingMachines.next(false);
                if (response.status == 'ok') {
                    this.StateMachineList.next(response.machines);
                    localStorage.setItem('chatBotMachines', JSON.stringify(response.machines));
                }
            }));
        } else {
            let machines: Array<any> = JSON.parse(localStorage.getItem('chatBotMachines'));
            if (machines.length > 0) {
                this.socket.emit('getMachines', { id: machines[0]._id }, (response => {
                    this.fetchingMachines.next(false);
                    if (response.status == 'ok') {
                        this.StateMachineList.next((response.machines as Array<any>).concat(machines))
                        localStorage.setItem('chatBotMachines', JSON.stringify(this.StateMachineList.getValue()));
                    }

                }));
            } else {
                this.socket.emit('getMachines', {}, (response => {
                    this.fetchingMachines.next(false);
                    if (response.status == 'ok') {
                        this.StateMachineList.next(response.machines);
                        localStorage.setItem('chatBotMachines', JSON.stringify(response.machines));
                    }
                }));
            }
        }
    }

    public DeleteMachine(id): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('deleteMachine', { _id: id }, (response => {
                if (response.status == 'ok') {
                    this.StateMachineList.next(this.StateMachineList.getValue().filter(machine => {
                        return machine._id != id;
                    }));

                    observer.next(response);
                    observer.complete();
                } else if (response.status == 'assigned') {
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error("Can't Delete Machine");
                }
            }));
        });
    }

    public EditMachine(id): Observable<any> {
        return new Observable(observer => {

        });
    }
    //#endregion


    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });

        //Clear Data on Component Change
        localStorage.removeItem('chatBotMachines');
        localStorage.removeItem('chatBotCases');
        localStorage.removeItem('chatBotWorkFlows');
    }


    //#region States

    //@DATA
    // name : string
    // machineID : string
    AddState(data): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('addState', data, (response) => {
                if (response.status == 'ok') {
                    this.StateMachineList.next(this.StateMachineList.getValue().map(stateMachine => {
                        if (stateMachine._id == data.machineId) {
                            stateMachine.states.push(data.state);
                        }
                        return stateMachine;
                    }));
                    localStorage.setItem('chatBotMachines', JSON.stringify(this.StateMachineList.getValue()));
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error(response);
                }
            });
        });
    }

    //@Data
    // stateName : string
    // stateIndex : number
    // machineId : string
    DeleteState(data): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('deleteState', data, (response => {
                if (response.status == 'ok') {
                    this.StateMachineList.next(this.StateMachineList.getValue().map(stateMachine => {
                        if (stateMachine._id == data.machineId) {
                            stateMachine.states.splice(parseInt(data.stateIndex), 1);
                        }
                        return stateMachine;
                    }));
                    localStorage.setItem('chatBotMachines', JSON.stringify(this.StateMachineList.getValue()));
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error(response);
                }
            }));
        });
    }


    // //@Data
    // // stateObject
    // // machine Id
    // EditState(data): Observable<any> {
    //     return new Observable(observer => {
    //         this.socket.emit('editState', data, (response => {
    //             if (response.status == 'ok') {
    //                 observer.next(response);
    //                 observer.complete();
    //             } else {
    //                 observer.error(response);
    //             }
    //         }));
    //     });
    // }

    //#endregion

    //#region StateMachine Handler Actions
    public AddHandler(data): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('addHandler', data, (response => {
                if (response.status == 'ok') {
                    this.StateMachineList.next(this.StateMachineList.getValue().map(StateMachine => {
                        if (StateMachine._id == data.machineId) {
                            StateMachine.states.map(state => {
                                if (state.name == data.stateName) {
                                    state.handlers.push(data.handler);
                                }
                                return state;
                            });
                        }
                        return StateMachine;
                    }));
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                }
            }));
        });
    }

    public DeleteHandler(data): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('deleteHandler', data, (response => {
                if (response.status == 'ok') {
                    this.StateMachineList.next(this.StateMachineList.getValue().map(stateMachine => {
                        if (stateMachine._id == data.machineId) {
                            stateMachine.states.map(state => {
                                state.handlers.splice(data.index, 1);
                                return state;
                            });
                        }
                        return stateMachine;
                    }));

                    this.CasesList.next(this.CasesList.getValue().map(Case => {
                        if (Case._id == data.caseId) {

                            Case.assignedTo = Case.assignedTo.filter(assigned => {
                                if (assigned.mid == data.machineId) {
                                    if (assigned.referenceCount > 1) {
                                        assigned.referenceCount -= 1;
                                        return assigned;
                                    }
                                } else {
                                    return assigned.mid != data.machineId;
                                }
                            });
                        }
                        return Case;
                    }));

                    localStorage.setItem('chatBotMachines', JSON.stringify(this.StateMachineList.getValue()));
                    localStorage.setItem('chatBotCases', JSON.stringify(this.CasesList.getValue()));
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error("Unable To Remove Handler");
                }
            }));
        });
    }

    public StartMachine(machineId) {
        this.socket.emit('StartMachine', { machineId: machineId }, (response => {
            if (response.status == 'ok') {
                // console.log(response.stateMachine);
            }
        }));
    }
    //#endregion


    //#region WorkFlows

    public AddWorkFlow(data: any): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('addWorkflow', data, (response => {
                if (response.status == 'ok') {
                    if (response.status == 'ok') {
                        data._id = response.id;
                        this.WorkFlowsList.getValue().unshift(data);
                        this.WorkFlowsList.next(this.WorkFlowsList.getValue());
                        observer.next(response);
                        observer.complete();
                    } else if (response.status == 'exists') {
                        this.WorkFlowsList.getValue().unshift(response.machine);
                        this.WorkFlowsList.next(this.WorkFlowsList.getValue());
                        observer.next(response);
                        observer.complete();
                    } else {
                        observer.error("Can't Add State Machine");
                    }
                }
            }));
        })
    }


    public GetWorkFlows() {
        //this.fetchingMachines.next(true);
        if (!localStorage.getItem('chatBotWorkFlows')) {
            this.socket.emit('getWorkFlows', {}, (response => {
                //console.log(response);
                //this.fetchingMachines.next(false);
                if (response.status == 'ok') {
                    this.WorkFlowsList.next(response.workFlows);
                    localStorage.setItem('chatBotWorkFlows', JSON.stringify(response.workFlows));
                }
            }));
        } else {
            let workFlows: Array<any> = JSON.parse(localStorage.getItem('chatBotWorkFlows'));
            if (workFlows.length > 0) {
                this.socket.emit('getWorkFlows', { id: workFlows[0]._id }, (response => {
                    //this.fetchingMachines.next(false);
                    if (response.status == 'ok') {
                        this.WorkFlowsList.next((response.workFlows as Array<any>).concat(workFlows))
                        localStorage.setItem('chatBotWorkFlows', JSON.stringify(this.WorkFlowsList.getValue()));
                    }

                }));
            } else {
                this.socket.emit('getWorkFlows', {}, (response => {
                    //this.fetchingMachines.next(false);
                    if (response.status == 'ok') {
                        this.WorkFlowsList.next(response.workFlows);
                        localStorage.setItem('chatBotWorkFlows', JSON.stringify(response.workFlows));
                    }
                }));
            }
        }
    }

    public SubmitWorkFlow(data): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('submitWorkFlow', data, response => {
                if (response.status == 'ok') {
                    this.WorkFlowsList.next(this.WorkFlowsList.getValue().map(workflow => {
                        if (workflow._id == data._id) {
                            workflow.form = data.form;
                        }
                        return workflow;
                    }));
                    localStorage.setItem('chatBotWorkFlows', JSON.stringify(this.WorkFlowsList.getValue()));
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error("Can't Submit Form");
                }
            });
        });
    }

    public MakePrimary(id): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('makePrimary', { _id: id }, response => {
                if (response.status == 'ok') {
                    this.WorkFlowsList.next(this.WorkFlowsList.getValue().map(workflow => {
                        if (workflow._id == id) {
                            workflow.primary = true;
                        } else {
                            workflow.primary = false;
                        }
                        return;
                    }));
                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error();
                }
            });
        });
    }
    //#endregion

}