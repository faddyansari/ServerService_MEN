"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportDataComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../SnackBar-Dialog/toast-notifications.component");
var TeamService_1 = require("../../../services/LocalServices/TeamService");
var ExportDataComponent = /** @class */ (function () {
    function ExportDataComponent(_authService, _ticketService, data, formBuilder, teamService, dialogRef, snackBar) {
        // if(data.length){
        // 	let keys = [];
        // 	data.map(d => {
        // 		Object.keys(d).map(key => {
        // 			if(typeof d[key] == 'object' && !Array.isArray(d[key])){
        // 				Object.keys(d[key]).map(nested => {
        // 					if(!keys.includes(key + '.' + nested)){
        // 						keys.push(key + '.' + nested);
        // 					}
        // 				})
        // 			}else{
        // 				if(!keys.includes(key)){
        // 					keys.push(key);
        // 				}
        // 			}
        // 		})
        // 	});
        // 	// console.log(keys);
        var _this = this;
        this._authService = _authService;
        this._ticketService = _ticketService;
        this.data = data;
        this.formBuilder = formBuilder;
        this.teamService = teamService;
        this.dialogRef = dialogRef;
        this.snackBar = snackBar;
        this.subscriptions = [];
        this.loading = false;
        this.submitError = true;
        this.daysdata = [];
        this.actualKeys = [];
        this.teams = [];
        this.emails = [];
        this.flag = false;
        this.toggle = false;
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.orders = [
            { actual: 'clientID', genre: 'Ticket ID' },
            { actual: 'datetime', genre: 'Created Date' },
            { actual: 'lasttouchedTime', genre: 'Last Updated' },
            { actual: 'from', genre: 'From' },
            { actual: 'source', genre: 'Source' },
            { actual: 'subject', genre: 'Subject' },
            { actual: 'group', genre: 'Group' },
            { actual: 'assigned_to', genre: 'Assigned Agent' },
            { actual: 'state', genre: 'State' },
            { actual: 'mergedTicketIds', genre: 'Merged IDs' },
            { actual: 'references', genre: 'References' },
            { actual: 'tags', genre: 'Tags' },
            { actual: 'ticketlog', genre: 'Logs' },
            { actual: 'teams', genre: 'Teams' },
        ];
        // }
        // this.exportForm = formBuilder.group({
        //   'format': ['EXCEL', Validators.required],
        //   'properties': [true, Validators.required]
        // });
        var formControls = this.orders.map(function (control) { return new forms_1.FormControl(false); });
        var selectAllControl = new forms_1.FormControl(false);
        this.exportForm = this.formBuilder.group({
            'orders': new forms_1.FormArray(formControls),
            'format': ['EXCEL', forms_1.Validators.required],
            selectAll: selectAllControl
        });
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings) {
                _this.dynamicFields = settings.schemas.ticket.fields;
                if (_this.dynamicFields.length) {
                    _this.dynamicFields = _this.dynamicFields.filter(function (d) { return !d.default; });
                    // console.log(this.dynamicFields);
                    _this.dynamicFields.forEach(function (element) {
                        _this.orders.push({
                            actual: 'dynamicFields.' + element.name,
                            genre: element.label
                        });
                        // console.log(this.exportForm.get('orders'));
                        var expForm = _this.exportForm.get('orders');
                        expForm.push(new forms_1.FormControl(false));
                    });
                    // console.log(this.orders);
                }
            }
        }));
        this.subscriptions.push(this.teamService.Teams.subscribe(function (value) {
            _this.teams = value;
        }));
    }
    ExportDataComponent.prototype.ngOnInit = function () {
    };
    ExportDataComponent.prototype.dateChanged = function (event) {
        if (event.status) {
            this.dates = event.dates;
        }
        else {
            this.dates = undefined;
        }
    };
    ExportDataComponent.prototype.onChanges = function (name) {
        var _this = this;
        switch (name) {
            case 'selectAll':
                this.exportForm
                    .get('orders')
                    .patchValue(Array(this.orders.length).fill(this.exportForm.get('selectAll').value));
                break;
            case 'custom':
                this.exportForm.get('orders').valueChanges.subscribe(function (val) {
                    _this.exportForm.get('selectAll').setValue(val.every(function (bool) { return bool; }));
                });
                break;
        }
    };
    ExportDataComponent.prototype.submit = function () {
        var _this = this;
        //console.log(exportDays);
        if (!this.data.length) {
            var attributes_1 = this.exportForm.value.orders.map(function (checked, index) { return checked ? _this.orders[index].genre : null; }).filter(function (value) { return value !== null; });
            this.orders.map(function (a) {
                attributes_1.filter(function (b) {
                    if (a.genre == b) {
                        _this.actualKeys.push({
                            label: a.genre,
                            actual: a.actual
                        });
                    }
                });
            });
            if (this.actualKeys.length && attributes_1 && this.emails.length) {
                this._ticketService.exportDays(this.dates.from, this.dates.to, this.actualKeys, this.emails).subscribe(function (res) {
                    // console.log(res);
                    if (res.status == "ok") {
                        //console.log(res.det);
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Success! you will get a download link on your email in a while..'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                        _this.dialogRef.close({
                            status: true
                        });
                    }
                });
            }
            else {
                this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Please make sure all fields are filled!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        }
        else {
            var formatSelected = this.exportForm.get('format').value;
            var selectedAttributes_1 = this.exportForm.value.orders
                .map(function (checked, index) { return checked ? _this.orders[index].genre : null; })
                .filter(function (value) { return value !== null; });
            this.orders.map(function (a) {
                selectedAttributes_1.filter(function (b) {
                    if (a.genre == b) {
                        _this.actualKeys.push({
                            label: a.genre,
                            actual: a.actual
                        });
                    }
                });
            });
            var transformedArray_1 = [];
            this.data.map(function (element) {
                var obj = {};
                // //console.log(element);
                _this.actualKeys.map(function (key) {
                    var _a, _b, _c;
                    var check = key.actual.split('.');
                    if (check[0] == 'dynamicFields') {
                        Object.assign(obj, (_a = {}, _a[key.label] = (element[check[0]] && element[check[0]][check[1]]) ? ((Array.isArray(element[check[0]][check[1]])) ? JSON.stringify(element[check[0]][check[1]]) : element[check[0]][check[1]]) : 'N/A', _a));
                    }
                    else {
                        if (key.actual == 'datetime' || key.actual == 'lasttouchedTime') {
                            Object.assign(obj, (_b = {}, _b[key.label] = new Date(element[key.actual]).toLocaleString(), _b));
                        }
                        else if (key.actual == 'teams') {
                            // console.log('Teams');
                            if (element.assigned_to) {
                                // let teams : any = [];
                                // console.log(this.teams);
                                // console.log(element.assigned_to);
                                var agentTeams = _this.teams.filter(function (t) { return t.agents.findIndex(function (a) { return a.email == element.assigned_to; }) != -1; });
                                // console.log(agentTeams);							
                                Object.assign(obj, { teams: agentTeams.map(function (a) { return a.team_name; }).join() });
                                // this.teamService.getTeamsAgainsAgent(element.assigned_to).subscribe(response => {
                                // 	Object.assign(obj, { teams: response.join() });
                                // });
                            }
                            else {
                                Object.assign(obj, { teams: '' });
                            }
                        }
                        else {
                            // console.log(key.actual);
                            // console.log(element[key.actual]);
                            Object.assign(obj, (_c = {}, _c[key.label] = (element[key.actual]) ? ((Array.isArray(element[key.actual])) ? JSON.stringify(element[key.actual]) : element[key.actual]) : 'N/A', _c));
                        }
                    }
                });
                if (Object.keys(obj).length) {
                    transformedArray_1.push(obj);
                }
            });
            //console.log(transformedArray);
            if (!transformedArray_1.length && formatSelected == 'EXCEL') {
                alert("No option selected!");
            }
            else {
                // this._ticketService.ExportToExcel(transformedArray, 'Ticket_Data');
                this.flag = true;
                this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Data exported successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            if (this.flag) {
                this.dialogRef.close({
                    status: true
                });
            }
        }
    };
    ExportDataComponent = __decorate([
        core_1.Component({
            selector: 'app-export-data',
            templateUrl: './export-data.component.html',
            styleUrls: ['./export-data.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                TeamService_1.TeamService
            ]
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ExportDataComponent);
    return ExportDataComponent;
}());
exports.ExportDataComponent = ExportDataComponent;
//# sourceMappingURL=export-data.component.js.map