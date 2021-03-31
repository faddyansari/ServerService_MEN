"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var environment_1 = require("../environments/environment");
var json2excel = require('js2excel').json2excel;
var AnalyticsService = /** @class */ (function () {
    function AnalyticsService(http, socketService, _authService) {
        // console.log('Analytics Service Initialized!');
        var _this = this;
        this.http = http;
        this.analyticsPythonService = '';
        this.serverAddress = '';
        this.loading = new BehaviorSubject_1.BehaviorSubject(false);
        this.loadingTableData = new BehaviorSubject_1.BehaviorSubject(false);
        this.table_visitors = new BehaviorSubject_1.BehaviorSubject([]);
        this.table_conversations = new BehaviorSubject_1.BehaviorSubject([]);
        this.table_tickets = new BehaviorSubject_1.BehaviorSubject([]);
        this.agent_activity = new BehaviorSubject_1.BehaviorSubject([]);
        this.resetDates = new BehaviorSubject_1.BehaviorSubject(false);
        this.agent_chatdetails = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.agent_ticketdetails = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.ChatType = new BehaviorSubject_1.BehaviorSubject('attended');
        this.selectedAgents = new BehaviorSubject_1.BehaviorSubject([]);
        this.selectedDate = new BehaviorSubject_1.BehaviorSubject({
            to: this.customFormatter(new Date()),
            from: this.customFormatter(new Date())
        });
        this.agent_stats = new BehaviorSubject_1.BehaviorSubject({
            activity: [],
            chatdetails: undefined,
            ticketdetails: undefined,
            date: 'today'
        });
        this.options = new BehaviorSubject_1.BehaviorSubject({
            chart: {
                type: '',
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: []
            },
            series: [{}],
            additionalData: undefined
        });
        this.isServerDown = new BehaviorSubject_1.BehaviorSubject(false);
        this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        this.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
        ];
        _authService.analyticsURL.subscribe(function (url) {
            _this.serverAddress = url;
        });
        _authService.analyticsPythonURL.subscribe(function (pythonurl) {
            _this.analyticsPythonService = pythonurl;
        });
        socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        });
    }
    AnalyticsService.prototype.GetTotalChats = function (sid, dateType, date, agent_emails) {
        var _this = this;
        this.loading.next(true);
        this.loadingTableData.next(true);
        // let agentEmail = (agent_email) ? agent_email : 'null';
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            _this.http.post(_this.serverAddress + 'totalchats', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetTicketResolutionTime = function (sid, dateType, date, agent_emails) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            _this.http.post(_this.serverAddress + 'ticketresolutiontime', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetFirstTicketResponse = function (sid, dateType, date, agent_emails) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            _this.http.post(_this.serverAddress + 'firstticketresponse', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetUniqueVisitors = function (sid, dateType, date) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            _this.http.post(_this.serverAddress + 'uniquevisitors', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetReturningVisitors = function (sid, dateType, date) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            _this.http.post(_this.serverAddress + 'returningvisitors', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetTotalVisitors = function (sid, dateType, date) {
        // console.log('Get Total Visitors');
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            _this.http.post(_this.serverAddress + 'totalvisitors', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetAverageWaitTime = function (sid, dateType, date, agent_emails) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            _this.http.post(_this.serverAddress + 'avgwaittime', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetTotalTickets = function (sid, dateType, date, agent_emails, groups) {
        var _this = this;
        // console.log(date);
        this.loading.next(true);
        // this.loadingTableData.next(true);
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        var groupsArray = (groups.join()) ? groups.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            urlSearchParams.append('groups', groupsArray);
            _this.http.post(_this.serverAddress + 'totaltickets', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetChatDuration = function (sid, dateType, date, agent_emails) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            _this.http.post(_this.serverAddress + 'chatduration', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetAgentFeedback = function (sid, dateType, date, agent_emails) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            _this.http.post(_this.serverAddress + 'agentfeedback', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetAgentFCR = function (sid, dateType, date, agent_emails) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            _this.http.post(_this.serverAddress + 'agentfcr', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetChatFirstResponseTime = function (sid, dateType, date, agent_emails) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            _this.http.post(_this.serverAddress + 'getAgentFirstResponse', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetAverageResponseTime = function (sid, dateType, date, agent_emails) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        var agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            _this.http.post(_this.serverAddress + 'agentAvgCRT', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
            // observer.next([]);
            // observer.complete();
        });
    };
    // public GetTotalMissedChats(sid, dateType,date, agent_emails?): Observable<any> {
    //     this.loading.next(true);
    //     let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
    //     return new Observable((observer) => {
    //         let urlSearchParams = new URLSearchParams('', new QueryEncoder());
    //         urlSearchParams.append('sid', sid);
    //         urlSearchParams.append('timeZone', this.timeZone);
    //         urlSearchParams.append('dateType', dateType);
    //         urlSearchParams.append('date_from', new Date(date.from).toISOString());
    //         urlSearchParams.append('date_to', new Date(date.to).toISOString());
    //         urlSearchParams.append('agent_email', agentEmails);
    //         this.http.post(this.serverAddress + 'totalMissedChats', urlSearchParams).subscribe((response) => {
    //             this.loading.next(false);
    //             observer.next(response);
    //             observer.complete();
    //         }, err => {
    //             this.loading.next(false);
    //             observer.error(err);
    //         });
    //     });
    // }
    AnalyticsService.prototype.GetTotalInvites = function (sid, dateType, date) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            _this.http.post(_this.serverAddress + 'totalInvites', urlSearchParams).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetTicketDashboardData = function (packet) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post('https://app.beelinks.solutions/a/v2/totalInquiries/', packet).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetTotalVisitorsNew = function (packet) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.analyticsPythonService + 'getVisitorCount/', packet).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetTotalRegViaLivechat = function (packet) {
        var _this = this;
        this.loading.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.analyticsPythonService + 'totalRegViaLiveChat/', packet).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetTotalVisitorsLeftWithoutLivechat = function (packet) {
        var _this = this;
        this.loading.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.analyticsPythonService + 'visitorLeftWithoutLiveChat/', packet).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetTotalVisitorsLeftFromFirstPage = function (packet) {
        var _this = this;
        this.loading.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.analyticsPythonService + 'visitorLeftFromFirstPage/', packet).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetRatioOfReturnVisitor = function (packet) {
        var _this = this;
        this.loading.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.analyticsPythonService + 'ratioOfReturnVisitor/', packet).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetAvailabilityHours = function (packet) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post('https://app.beelinks.solutions/a/v2/availabilityHours/', packet).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetHourlyActivityData = function (packet) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post(environment_1.environment.restServer + '/agent/getHourlyData', packet).subscribe(function (response) {
                _this.loading.next(false);
                // console.log(response.json());
                // console.log(JSON.stringify(response.json()));
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetScorecardData = function (packet) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post('https://app.beelinks.solutions/a/v2/responseTime/', packet).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.GetMissedChats = function (packet) {
        var _this = this;
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.post('https://app.beelinks.solutions/a/v2/getTotalNotEntertainedChatsCount/', packet).subscribe(function (response) {
                _this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, function (err) {
                _this.loading.next(false);
                observer.error(err);
            });
        });
    };
    AnalyticsService.prototype.promise_GetAgentActivity = function (sid, dateType, date, agent_email) {
        var _this = this;
        var agentEmail = (agent_email) ? agent_email : 'null';
        return new Promise(function (resolve, reject) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('email', agentEmail);
            _this.http.post(_this.serverAddress + 'agent/activity', urlSearchParams).subscribe(function (response) {
                resolve(response.json().details);
            }, function (err) {
                reject(err);
            });
        });
    };
    AnalyticsService.prototype.promise_GetChatDetails = function (sid, agent_email) {
        var _this = this;
        var agentEmail = (agent_email) ? agent_email : 'null';
        return new Promise(function (resolve, reject) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('email', agentEmail);
            _this.http.post(_this.serverAddress + 'agent/chats', urlSearchParams).subscribe(function (response) {
                resolve(response.json());
            }, function (err) {
                reject(err);
            });
        });
    };
    AnalyticsService.prototype.promise_GetTicketDetails = function (sid, agent_email) {
        var _this = this;
        var agentEmail = (agent_email) ? agent_email : 'null';
        return new Promise(function (resolve, reject) {
            var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', _this.timeZone);
            urlSearchParams.append('email', agentEmail);
            _this.http.post(_this.serverAddress + 'agent/tickets', urlSearchParams).subscribe(function (response) {
                resolve(response.json());
            }, function (err) {
                reject(err);
            });
        });
    };
    AnalyticsService.prototype.GetAgentStats = function (sid, dateType, date, agentEmail) {
        var _this = this;
        this.loading.next(true);
        this.agent_stats.next({
            activity: [],
            chatdetails: undefined,
            ticketdetails: undefined,
            date: dateType
        });
        return new Observable_1.Observable(function (observer) {
            Promise.all([_this.promise_GetAgentActivity(sid, dateType, date, agentEmail), _this.promise_GetChatDetails(sid, agentEmail), _this.promise_GetTicketDetails(sid, agentEmail)]).then(function (result) {
                _this.isServerDown.next(false);
                // console.log(result);
                observer.next(result);
                observer.complete();
                _this.loading.next(false);
            }).catch(function (err) {
                // console.log(err);
                observer.next(_this.agent_stats);
                observer.complete();
                _this.isServerDown.next(true);
                _this.loading.next(false);
            });
        });
    };
    AnalyticsService.prototype.GetVisitorSessions = function (visitorIDs) {
        var _this = this;
        this.loadingTableData.next(true);
        this.table_visitors.next([]);
        this.socket.emit('analytics_getvisitors', { visitorIDs: visitorIDs }, function (response) {
            // console.log(response);
            _this.table_visitors.next(response.visitors);
            _this.loadingTableData.next(false);
            // this.ExportToExcel(response.visitors, 'dummy.xlsx');
        });
    };
    AnalyticsService.prototype.GetConversations = function (convIDs) {
        var _this = this;
        this.loadingTableData.next(true);
        this.table_conversations.next([]);
        // console.log('Getting conversations');
        this.socket.emit('analytics_getconversations', { convIDs: convIDs }, function (response) {
            // console.log(response);
            _this.table_conversations.next(response.conversations);
            _this.loadingTableData.next(false);
        });
    };
    AnalyticsService.prototype.GetTickets = function (ticketIDs) {
        var _this = this;
        this.loadingTableData.next(true);
        this.table_tickets.next([]);
        this.socket.emit('analytics_gettickets', { ticketIDs: ticketIDs }, function (response) {
            // console.log(response);
            _this.table_tickets.next(response.tickets);
            _this.loadingTableData.next(false);
        });
    };
    //Chart Options
    AnalyticsService.prototype.updateChart = function (type, dataArray, arrayType, seriesName, nodata, count, additionalData) {
        if (nodata === void 0) { nodata = false; }
        if (count === void 0) { count = 0; }
        if (additionalData === void 0) { additionalData = undefined; }
        if (count) {
            this.options.getValue().title.text = count;
        }
        else {
            this.options.getValue().title.text = '';
        }
        if (!nodata) {
            var categories_1 = [];
            var points_1 = [];
            var series_1 = [];
            this.options.getValue().chart.type = type;
            this.options.getValue().chart.zoomType = 'x';
            this.options.getValue().series = [{}];
            if (arrayType == 'flat') {
                dataArray.forEach(function (data) {
                    categories_1.push(data.name);
                    points_1.push(data.value);
                });
                this.options.getValue().legend.enabled = false;
                this.options.getValue().xAxis.categories = categories_1;
                this.options.getValue().series[0].name = seriesName;
                this.options.getValue().series[0].data = points_1;
            }
            else if (arrayType == 'dimensional') {
                dataArray[0].series.forEach(function (element) {
                    categories_1.push(element.name);
                });
                dataArray.forEach(function (element) {
                    var values = [];
                    element.series.forEach(function (data) {
                        values.push(data.value);
                    });
                    series_1.push({
                        name: element.name,
                        data: values
                    });
                });
                this.options.getValue().legend.enabled = true;
                this.options.getValue().xAxis.categories = categories_1;
                this.options.getValue().series = series_1;
            }
            else if (arrayType == 'agents') {
                dataArray[0].series.forEach(function (element) {
                    categories_1.push(element.name);
                });
                // console.log(dataArray[0]);
                dataArray.forEach(function (element) {
                    var values = [];
                    element.series.forEach(function (data) {
                        values.push(data.value);
                    });
                    series_1.push({
                        name: element.name,
                        data: values
                    });
                });
                this.options.getValue().legend.enabled = true;
                this.options.getValue().xAxis.categories = categories_1;
                this.options.getValue().series = series_1;
            }
        }
        else {
            var categories_2 = [];
            var points_2 = [];
            this.options.getValue().chart.type = type;
            this.options.getValue().chart.zoomType = 'x';
            this.options.getValue().series = [{}];
            if (arrayType == 'flat') {
                if (dataArray)
                    dataArray.forEach(function (data) {
                        categories_2.push(data.name);
                    });
            }
            else if (arrayType == 'dimensional' || arrayType == 'agents') {
                dataArray[0].series.forEach(function (element) {
                    categories_2.push(element.name);
                });
            }
            categories_2.forEach(function (c) {
                points_2.push(0);
            });
            this.options.getValue().legend.enabled = false;
            this.options.getValue().xAxis.categories = categories_2;
            this.options.getValue().series[0].name = seriesName;
            this.options.getValue().series[0].data = points_2;
        }
        this.options.getValue().additionalData = {
            date: this.selectedDate.getValue()
        };
        this.options.getValue().additionalData = additionalData;
        this.options.next(this.options.getValue());
    };
    AnalyticsService.prototype.updateChartSimple = function (chartType, legendEnabled, categories, series, count) {
        if (count === void 0) { count = 0; }
        if (count) {
            this.options.getValue().title.text = count;
        }
        else {
            this.options.getValue().title.text = '';
        }
        this.options.getValue().chart.type = chartType;
        this.options.getValue().legend.enabled = legendEnabled;
        this.options.getValue().xAxis.categories = categories;
        this.options.getValue().series = series;
        this.options.getValue().additionalData = {
            date: this.selectedDate.getValue()
        };
        this.options.next(this.options.getValue());
    };
    AnalyticsService.prototype.resetOptions = function () {
        this.options.next({
            chart: {
                type: '',
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: []
            },
            series: [{}]
        });
    };
    // public ExportToExcel(json, fileName){
    //     let sheetObj = xlsx.utils.json_to_sheet(json);
    //     fs.writeFileSync(fileName, sheetObj, 'binary');
    // }
    AnalyticsService.prototype.exportHTMLToExcel = function (id, filename) {
        var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40"><head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> <x:ExcelWorksheet><x:Name>{worksheet}</x:Name> <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions> </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook> </xml><![endif]--></head><body> <table>{table}</table></body></html>', base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        }, format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; });
        };
        var ctx = { worksheet: 'Multi Level Export Table Example' || 'Worksheet', table: document.getElementById(id).innerHTML };
        // window.location.href = uri + base64(format(template, ctx))
        var link = document.createElement('a');
        link.download = filename;
        link.href = uri + base64(format(template, ctx));
        link.click();
    };
    ;
    AnalyticsService.prototype.ExportToExcel = function (data, filename) {
        try {
            console.log(data);
            json2excel({
                data: data,
                name: filename,
                formateDate: 'yyyy/mm/dd'
            });
        }
        catch (e) {
            console.log(e);
            console.error('export error');
        }
    };
    AnalyticsService.prototype.customFormatter = function (date) {
        return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
    };
    AnalyticsService.prototype.dateFormatter = function (d) {
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
    };
    AnalyticsService.prototype.daysBetween = function (date1, date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    };
    AnalyticsService.prototype.SubtractDays = function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    };
    AnalyticsService.prototype.AddDays = function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    AnalyticsService.prototype.SubtractMonths = function (date, months) {
        var result = new Date(date);
        result.setMonth(result.getMonth() - months);
        return result;
    };
    AnalyticsService.prototype.SubtractYears = function (date, years) {
        var result = new Date(date);
        result.setFullYear(result.getFullYear() - years);
        return result;
    };
    AnalyticsService.prototype.diffMonth = function (from, to, type) {
        if (type === void 0) { type = 'nonarray'; }
        var arr = [];
        var fromYear = from.getFullYear();
        var toYear = to.getFullYear();
        var diffYear = (12 * (toYear - fromYear)) + to.getMonth();
        for (var i = from.getMonth(); i <= diffYear; i++) {
            arr.push({ name: this.monthNames[i % 12], value: (type == 'nonarray') ? 0 : [] });
        }
        // for (var i = 0; i <= diffMonth; i++) {
        // 	arr.push({ name: this.monthNames[fromMonth], value: (type == 'nonarray') ? 0 : [] });
        // 	fromMonth++;
        // }
        return arr;
    };
    AnalyticsService.prototype.diffYear = function (from, to, type) {
        if (type === void 0) { type = 'nonarray'; }
        var arr = [];
        var datFrom = from;
        var datTo = to;
        var fromYear = datFrom.getFullYear();
        var toYear = datTo.getFullYear();
        var diffYear = toYear - fromYear;
        for (var i = 0; i <= diffYear; i++) {
            arr.push({ name: fromYear.toString(), value: (type == 'nonarray') ? 0 : [] });
            fromYear++;
        }
        return arr;
    };
    AnalyticsService = __decorate([
        core_1.Injectable()
    ], AnalyticsService);
    return AnalyticsService;
}());
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=AnalyticsService.js.map