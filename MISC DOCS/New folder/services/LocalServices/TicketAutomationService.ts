import { Injectable } from "@angular/core";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { PushNotificationsService } from '../NotificationService';
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs/Subscription";
import { Http } from "@angular/http";



@Injectable()

export class TicketAutomationService {
    socket: SocketIOClient.Socket;
    Tag: BehaviorSubject<any> = new BehaviorSubject({});
    Groups: BehaviorSubject<any> = new BehaviorSubject([]);
    selectedGroup: BehaviorSubject<any> = new BehaviorSubject(undefined);
    Agent: any;
    Ruleset: BehaviorSubject<any> = new BehaviorSubject([]);
    components: BehaviorSubject<any> = new BehaviorSubject([]);
    private notification: BehaviorSubject<any> = new BehaviorSubject('');
    condition = [];
    private subscriptions: Subscription[] = [];
    conditions: BehaviorSubject<any> = new BehaviorSubject([
        {
            id: 1,
            key: "",
            operatorOption: "",
            value: [],
        }
    ]);
    defaultCondition: BehaviorSubject<any> = new BehaviorSubject([
        {
            id: 1,
            key: "",
            operatorOption: "",
            value: [],
        }
    ]);
    finalRuleset = [];
    ticketServiceURL = '';
    constructor(_socket: SocketService, _authService: AuthService, private http: Http, private _notificationService: PushNotificationsService, private snackbar: MatSnackBar) {
        // console.log("Ticket Automation Service");
        _authService.RestServiceURL.subscribe(url => {
            this.ticketServiceURL = url + '/api/tickets';
        });
        _authService.getAgent().subscribe(data => {
            this.Agent = data;
        });

        // Subscribing Agent Object
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        this.subscriptions.push(_socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getGroups();
                this.getRuleset();

                this.socket.on('groupChanges', (response) => {
                    // console.log(response);
                    if (response && response.status == 'ok') {
                        this.getGroups();
                        // this.Groups.getValue().push(response.group);
                        // this.Groups.next(this.Groups.getValue());
                    }
                    // this.Groups.next(data.group_data);

                })
                this.socket.on('groupDeleted', (response) => {
                    // console.log(response);
                    if (response && response.status == 'ok') {
                        this.Groups.getValue().map((g, index) => {
                            if (g.group_name == response.group_name) {
                                this.Groups.getValue().splice(index, 1);
                            }
                        });
                        if (this.selectedGroup.getValue()) {
                            if (this.selectedGroup.getValue().group_name == response.group_name) {
                                this.selectedGroup.next(undefined);
                            }
                        }
                        this.Groups.next(this.Groups.getValue());
                    }
                    // this.Groups.next(data.group_data);

                })
            }
        }));




    }

    // getGroups() {
    //     this.socket.emit('getGroupByNSP', {}, (data) => {
    //         if (data.status == 'ok') {
    //             // console.log(data);

    //             this.Groups.next(data.group_data);
    //             // console.log(this.Group.getValue());

    //         } else {
    //             this.Groups.next({});
    //         }
    //     });
    // }

    // ToggleActivation(flag,rulename){
    //     this.socket.emit('toggleActivation', { activation: flag, rulename:rulename }, (data) => {
    //         if (data.status == 'ok') {
    //             console.log(data.activation.activated);

    //             this.Ruleset.getValue()[0].activated = data.activation.activated;
    //             this.Ruleset.next(this.Ruleset.getValue())
    //             console.log(this.Ruleset.getValue());

    //             this.snackbar.openFromComponent(ToastNotifications, {
    //                 data: {
    //                     img: 'ok',
    //                     msg: 'Ruleset activated successfully!',
    //                 },
    //                 duration: 2000,
    //                 panelClass: ['user-alert', 'success']
    //             });
    //         } else {

    //         }
    //     });
    // }

    getGroups() {
        if (!this.Agent || !Object.keys(this.Agent).length) return
        this.http.post(this.ticketServiceURL + '/getGroupByNSP', { email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    // console.log(data);
                    this.Groups.next(data.group_data);
                    if (this.selectedGroup.getValue()) {
                        if (!this.Groups.getValue().filter(g => g.group_name == this.selectedGroup.getValue().group_name).length) {
                            this.selectedGroup.next(undefined);
                        } else {
                            data.group_data.map(g => {

                                if (g.group_name == this.selectedGroup.getValue().group_name) {
                                    this.selectedGroup.next(g);
                                    return;
                                }
                            });
                        }
                        // console.log(this.Group.getValue());
                    }
                } else {
                    this.Groups.next({});
                }
            }
        })
        // this.socket.emit('getGroupByNSP', {}, (data) => {
        //     // console.log(data);
        //     if (data.status == 'ok') {
        //         // console.log(data);
        //         this.Groups.next(data.group_data);
        //         if (this.selectedGroup.getValue()) {
        //             if(!this.Groups.getValue().filter(g => g.group_name == this.selectedGroup.getValue().group_name).length){
        //                 this.selectedGroup.next(undefined);
        //             }else{
        //                 data.group_data.map(g => {

        //                     if (g.group_name == this.selectedGroup.getValue().group_name) {
        //                         this.selectedGroup.next(g);
        //                         return;
        //                     }
        //                 });
        //             }
        //             // console.log(this.Group.getValue());
        //         }
        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    }
    setSelectedGroup(group_name?) {
        if (group_name) {
            this.Groups.getValue().map(g => {
                if (g.group_name == group_name) {
                    this.selectedGroup.next(g);
                    return;
                }
            });
        } else {
            this.selectedGroup.next(undefined);
        }
    }

    setAutoAssign(group_name, auto_assign) {

        this.http.post(this.ticketServiceURL + '/setGroupAutoAssign', { group_name: group_name, auto_assign: auto_assign, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();
                if (response.status == 'ok') {
                    this.Groups.getValue().map(group => {
                        if (group.group_name == response.group.group_name) {
                            group.auto_assign = auto_assign;
                            return;
                        }
                    });
                    if (this.selectedGroup.getValue() && this.selectedGroup.getValue().group_name == response.group.group_name) {
                        this.selectedGroup.getValue().auto_assign = auto_assign;
                        this.selectedGroup.next(this.selectedGroup.getValue());
                    }
                    this.Groups.next(this.Groups.getValue())
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Settings updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            }
        });
        // this.socket.emit('setGroupAutoAssign', { group_name: group_name, auto_assign: auto_assign }, (response) => {
        //     if (response.status == 'ok') {
        //         this.Groups.getValue().map(group => {
        //             if (group.group_name == response.group.group_name) {
        //                 group.auto_assign = auto_assign;
        //                 return;
        //             }
        //         });
        //         if (this.selectedGroup.getValue() && this.selectedGroup.getValue().group_name == response.group.group_name) {
        //             this.selectedGroup.getValue().auto_assign = auto_assign;
        //             this.selectedGroup.next(this.selectedGroup.getValue());
        //         }
        //         this.Groups.next(this.Groups.getValue())
        //         this.snackbar.openFromComponent(ToastNotifications, {
        //             data: {
        //                 img: 'ok',
        //                 msg: 'Settings updated Successfully!'
        //             },
        //             duration: 2000,
        //             panelClass: ['user-alert', 'success']
        //         });
        //     }
        // })
    }

    UpdateAgentCount(group_name, agent_email) {
        this.Groups.getValue().map(element => {
            if (element.group_name == group_name) {
                element.agent_list.filter(a => a.email == agent_email)[0].count += 1;
                return element;
            }
        });
        // if(this.selectedGroup.getValue() && this.selectedGroup.getValue().group_name == group_name){

        //     this.selectedGroup.getValue().agent_list.filter(a => a.email == agent_email)[0].count += 1;
        //     this.selectedGroup.next(this.selectedGroup.getValue());
        // }
        this.Groups.next(this.Groups.getValue());
    }


    UpdateRuleSet(rulename, group, operator, conditions): Observable<any> {
        return new Observable((observer) => {
            // console.log(rulename, group, operator, conditions);

            // this.finalRuleset.push(name, this.condition, assignment, operator)
            // this.Ruleset.next(this.finalRuleset);
            this.socket.emit('updateRuleSet', { rulename: rulename, condition: conditions, condtionOperator: operator, assigned_to: group }, (response) => {
                if (response.status == 'ok') {
                    // console.log("rule", this.Ruleset.getValue());

                    // console.log("Ruleset updated ", response.updatedruleSet);
                    this.Ruleset.next(response.updatedruleSet);

                    // console.log(this.Ruleset.getValue());

                    this.conditions.next(response.updatedruleSet.ruleset[0].conditions);

                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ruleset updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    observer.next({ status: 'ok', updatedruleset: response.updatedruleSet })
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }

    assignAgent(agent_email: string, group_name: string, snackbar = true) {

        this.http.post(this.ticketServiceURL + '/assignAgent', { agent_email: agent_email, group_name: group_name, nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.getGroups();
                    if (snackbar) {
                        this.snackbar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Agent assigned successfully!',
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                } else {
                    this.Groups.next({});
                }
            }
        });


        // this.socket.emit('assignAgent', { agent_email: agent_email, group_name: group_name }, (data) => {
        //     if (data.status == 'ok') {
        //         this.getGroups();
        //         if (snackbar) {
        //             this.snackbar.openFromComponent(ToastNotifications, {
        //                 data: {
        //                     img: 'ok',
        //                     msg: 'Agent assigned successfully!',
        //                 },
        //                 duration: 2000,
        //                 panelClass: ['user-alert', 'success']
        //             });
        //         }
        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    }

    saveAdmins(group_name, adminList, snackbar = true) {
        this.socket.emit('saveAdmins', { adminList: adminList, group_name: group_name }, (data) => {
            if (data.status == 'ok') {
                this.getGroups();
                if (snackbar) {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: ((adminList.length < 2) ? 'Admin' : 'Admins') + ' added successfully!',
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            } else {
                this.Groups.next({});
            }
        });
    }
    pushAdmin(email, group_name, ) {
        this.socket.emit('pushAdmin', { email: email, group_name: group_name }, (data) => {
            console.log(data);
            if (data.status == 'ok') {
                this.getGroups();
            } else {
                this.Groups.next({});
            }
        });
    }
    removeAdmin(group_name, email, snackbar = true) {
        this.socket.emit('removeAdmin', { group_name: group_name, email: email }, (data) => {
            if (data.status == 'ok') {
                this.getGroups();
                if (snackbar) {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Admin removed successfully!',
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            } else {
                this.Groups.next({});
            }
        });
    }

    ToggleAdmin(group_name, email, value) {
        this.http.post(this.ticketServiceURL + '/toggleAdmin', { group_name: group_name, email: email, value: value, nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();

            }
        });
        // this.socket.emit('toggleAdmin', { group_name: group_name, email: email, value: value }, (response) => {
        // })
    }
    ToggleExclude(group_name, email, value) {
        this.http.post(this.ticketServiceURL + '/toggleExclude', { group_name: group_name, email: email, value: value, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();
                this.Groups.getValue().map(g => {
                    if (g._id == response.group._id) {
                        g.agent_list = response.group.agent_list;
                        return g;
                    }
                });
                this.Groups.next(this.Groups.getValue());
            }
        });
        // this.socket.emit('toggleExclude', { group_name: group_name, email: email, value: value }, (response) => {
        // })
    }

    unAssignAgent(agent_email: string, group_name: string) {

        this.http.post(this.ticketServiceURL + '/unAssignAgent', { agent_email: agent_email, group_name: group_name, nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.getGroups();
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Agent unassigned successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                } else {
                    this.Groups.next({});
                }
            }
        });

        // this.socket.emit('unAssignAgent', { agent_email: agent_email, group_name: group_name }, (data) => {
        //     if (data.status == 'ok') {
        //         // console.log("unassigned", data);
        //         this.getGroups();
        //         // this.Groups.next(data.group_data);
        //         // this.Groups.getValue().groups.some(g => {
        //         //     if(this.selectedGroup.getValue() && this.selectedGroup.getValue().group_name == g.group_name){
        //         //         this.selectedGroup.next(g);
        //         //         return true;
        //         //     }
        //         // })
        //         this.snackbar.openFromComponent(ToastNotifications, {
        //             data: {
        //                 img: 'ok',
        //                 msg: 'Agent unassigned successfully!'
        //             },
        //             duration: 2000,
        //             panelClass: ['user-alert', 'success']
        //         });
        //         // console.log(this.Group.getValue());

        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    }

    insertGroup(group: any): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/insertGroup', { group: group, nsp: this.Agent.nsp }).subscribe(response => {
                // console.log(response.json())
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        this.getGroups();
                    }
                    observer.next(data.status);
                    observer.complete();
                }
            });
        })
        // this.socket.emit('insertGroup', { group: group }, (data) => {
        //     if (data.status == 'ok') {
        //         // console.log(data);
        //         this.getGroups();
        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    }


    deleteGroup(group_name: string) {
        if (this.selectedGroup.getValue()) {
            if (this.selectedGroup.getValue().group_name == group_name) {
                this.selectedGroup.next(undefined);
            }
        }

        this.http.post(this.ticketServiceURL + '/deleteGroup', { group_name: group_name, nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.Groups.next(data.group_data);
                } else {
                    this.Groups.next({});
                }
            }
        })


        // this.socket.emit('deleteGroup', { group_name: group_name }, (data) => {
        //     if (data.status == 'ok') {
        //         this.Groups.next(data.group_data);
        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    }
    // deleteCondition(ruleset): Observable<any> {
    //     return new Observable((observer) => {
    //         this.socket.emit('deleteRule', { rule: rule }, (response) => {
    //             if (response.status == 'ok') {
    //                 console.log(response);
    //                 // this.Ruleset.next(response.ruleset);
    //                 this.notification.next({
    //                     msg: "Ruleset's condition deleted Successfully!",
    //                     type: 'success',
    //                     img: 'ok',
    //                 });
    //                 observer.next({ status: 'ok'})
    //                 observer.complete();
    //             }
    //             else{
    //                 observer.next({ status: 'error' });
    //                 observer.complete();
    //             }
    //         });
    //     });
    // }


    editRuleset() {
        this.conditions.next(this.conditions.getValue());
        this.Ruleset.next(this.Ruleset.getValue());

    }
    DeleteRuleSet(): Observable<any> {
        return new Observable((observer) => {
            // console.log("in svc");

            this.socket.emit('deleteRuleset', {}, (response) => {
                if (response.status == 'ok') {
                    // console.log(response);
                    // this.getRuleset();
                    // console.log(response.ruleset);
                    this.Ruleset.next([]);
                    this.conditions.next([
                        {
                            id: 1,
                            key: "",
                            operatorOption: "",
                            value: [],
                        }
                    ])

                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ruleset deleted Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    observer.next({ status: 'ok' })
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }

    getNotification() {
        return this.notification.asObservable();
    }

    setNotification(notification: string, type: string, icon: string) {
        let item = {
            msg: notification,
            type: type,
            img: icon
        }
        this.notification.next(notification);
    }

    Conditions(condition) {
        this.conditions.getValue().map((c) => {
            if (c.id == condition.id) {
                c = condition;
            }
        });
        // console.log(condition);
        // this.conditions.getValue().push(condition);
        // this.finalRuleset.push(condition);
        // this.Ruleset.next(this.finalRuleset);
        this.conditions.next(this.conditions.getValue());
        // console.log(this.conditions.getValue());
    }

    AddComponents() {
        // this.conditions.getValue().forEach(element => {
        //     if (element.value && element.value.length > 0) {
        this.conditions.getValue().push({
            id: this.conditions.getValue()[this.conditions.getValue().length - 1].id + 1,
            key: "",
            operatorOption: "",
            value: [],
        });
        this.snackbar.openFromComponent(ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'More condition added successfully!'
            },
            duration: 2000,
            panelClass: ['user-alert', 'success']
        });
    }

    RemoveComponents(ref, index) {
        if (Object.keys(ref.conditions).length > 1) {
            this.snackbar.openFromComponent(ToastNotifications, {
                data: {
                    img: 'ok',
                    msg: 'Condition deleted successfully!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'ok']
            });

            this.conditions.getValue().splice(index, 1);
            this.conditions.next(this.conditions.getValue());
            // console.log(this.conditions.getValue());
        }
        else {
            this.snackbar.openFromComponent(ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Rule cannot be deleted! Add more condtions first'
                },
                duration: 2000,
                panelClass: ['user-alert', 'error']
            });
        }
    }

    cancel() {
        this.Ruleset.next(this.Ruleset.getValue())
        this.conditions.next(this.conditions.getValue());
        this.getRuleset();
    }

    DoneRuleSet(name, assignment, operator): Observable<any> {
        return new Observable((observer) => {
            // console.log("in svc", name, assignment, operator);
            // console.log(this.conditions.getValue());
            this.socket.emit('addRuleSet', { rulename: name, condition: this.conditions.getValue(), condtionOperator: operator, assigned_to: assignment }, (response) => {
                if (response.status == 'ok') {
                    // console.log(response);
                    // console.log(response.ruleset[0].ruleset[0].conditions);
                    this.Ruleset.next(response.ruleset);
                    this.conditions.next(response.ruleset[0].ruleset[0].conditions);

                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ruleset added Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });


                    observer.next({ status: 'ok', conditions: response.ruleset[0].ruleset[0].conditions, rule: response.ruleset[0] })
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }

    public getRuleset() {
        this.socket.emit('getRuleset', {}, (data) => {
            if (data.status == 'ok' && data.rule_data && data.rule_data.length) {
                // console.log(data);

                // if(data.rule_data[0].ruleset[0].conditions) console.log(data.rule_data[0].ruleset[0].conditions);

                // .ruleset[0].conditions
                // console.log(data.rule_data[0].ruleset[0].conditions);

                // this.conditions.next(data.rule_data[0].ruleset[0].conditions);
                // console.log(this.conditions.getValue());
                // if (data.rule_data)
                this.Ruleset.next(data.rule_data);
                // console.log(this.Ruleset.getValue());
                this.conditions.next(data.rule_data[0].ruleset[0].conditions);
                // console.log(this.conditions.getValue());
            } else {
                this.Ruleset.next({});
                this.conditions.next([
                    {
                        id: 1,
                        key: "",
                        operatorOption: "",
                        value: [],
                    }
                ]);
            }
        });
        // console.log(this.conditions.getValue());
    }


    ToggleActivation(flag, rulename) {
        this.socket.emit('toggleActivation', { activation: flag, rulename: rulename }, (data) => {
            if (data.status == 'ok') {
                // console.log(data.activation.activated);

                this.Ruleset.getValue()[0].activated = data.activation.activated;
                this.Ruleset.next(this.Ruleset.getValue())
                // console.log(this.Ruleset.getValue());

                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Ruleset activated successfully!',
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            } else {

            }
        });
    }
    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }
}