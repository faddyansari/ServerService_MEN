import { Injectable } from "@angular/core";
import { Http, QueryEncoder,URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { SocketService } from "./SocketService";
import { AuthService } from "./AuthenticationService";
import { environment } from "../environments/environment";
let { json2excel } = require('js2excel');
declare function unescape(s: string): string;
declare function escape(s: string): string;

@Injectable()
export class AnalyticsService {

    analyticsPythonService = '';
    serverAddress = '';
    loading: BehaviorSubject<any> = new BehaviorSubject(false);
    socket: SocketIOClient.Socket;
    loadingTableData: BehaviorSubject<any> = new BehaviorSubject(false);
    table_visitors: BehaviorSubject<any> = new BehaviorSubject([]);
    table_conversations: BehaviorSubject<any> = new BehaviorSubject([]);
    table_tickets: BehaviorSubject<any> = new BehaviorSubject([]);
    agent_activity: BehaviorSubject<any> = new BehaviorSubject([]);
    resetDates: BehaviorSubject<any> = new BehaviorSubject(false);
    agent_chatdetails: BehaviorSubject<any> = new BehaviorSubject(undefined);
    agent_ticketdetails: BehaviorSubject<any> = new BehaviorSubject(undefined);
    ChatType: BehaviorSubject<string> = new BehaviorSubject('attended');
    selectedAgents: BehaviorSubject<any> = new BehaviorSubject([]);
    selectedDate: BehaviorSubject<any> = new BehaviorSubject({
        to: this.customFormatter(new Date()),
        from: this.customFormatter(new Date())
    });

    agent_stats: BehaviorSubject<any> = new BehaviorSubject({
        activity: [],
        chatdetails: undefined,
        ticketdetails: undefined,
        date: 'today'
    });
    options: BehaviorSubject<any> = new BehaviorSubject({
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
            categories: [

            ]
        },
        series: [{}],
        additionalData : undefined
    });
    isServerDown: BehaviorSubject<any> = new BehaviorSubject(false);
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
	];

    constructor(private http: Http, socketService: SocketService, _authService: AuthService) {
        // console.log('Analytics Service Initialized!');

        _authService.analyticsURL.subscribe(url => {
            this.serverAddress = url;
        });

        _authService.analyticsPythonURL.subscribe(pythonurl =>{
            this.analyticsPythonService = pythonurl;
        });

        socketService.getSocket().subscribe(socket => {
            this.socket = socket;
        });
    }
    public GetTotalChats(sid,dateType, date, agent_emails): Observable<any> {
        this.loading.next(true);
        this.loadingTableData.next(true);
        // let agentEmail = (agent_email) ? agent_email : 'null';
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            this.http.post(this.serverAddress + 'totalchats', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetTicketResolutionTime(sid, dateType,date, agent_emails): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            this.http.post(this.serverAddress + 'ticketresolutiontime', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetFirstTicketResponse(sid,dateType, date, agent_emails): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            this.http.post(this.serverAddress + 'firstticketresponse', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetUniqueVisitors(sid, dateType,date): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            this.http.post(this.serverAddress + 'uniquevisitors', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetReturningVisitors(sid, dateType,date): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            this.http.post(this.serverAddress + 'returningvisitors', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetTotalVisitors(sid,dateType, date): Observable<any> {
        // console.log('Get Total Visitors');

        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            this.http.post(this.serverAddress + 'totalvisitors', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    
    public GetAverageWaitTime(sid, dateType,date, agent_emails): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            this.http.post(this.serverAddress + 'avgwaittime', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetTotalTickets(sid,dateType, date, agent_emails, groups): Observable<any> {
        // console.log(date);
        this.loading.next(true);
        // this.loadingTableData.next(true);
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        let groupsArray = (groups.join()) ? groups.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            urlSearchParams.append('groups', groupsArray);
            this.http.post(this.serverAddress+ 'totaltickets', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetChatDuration(sid,dateType, date, agent_emails): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            this.http.post(this.serverAddress +  'chatduration', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetAgentFeedback(sid,dateType, date, agent_emails): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            this.http.post(this.serverAddress +'agentfeedback', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetAgentFCR(sid,dateType, date, agent_emails): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            this.http.post(this.serverAddress + 'agentfcr', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetChatFirstResponseTime(sid,dateType, date, agent_emails): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            this.http.post(this.serverAddress + 'getAgentFirstResponse', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetAverageResponseTime(sid,dateType, date, agent_emails): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        let agentEmails = (agent_emails.join()) ? agent_emails.join() : 'null';
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('agent_email', agentEmails);
            this.http.post(this.serverAddress + 'agentAvgCRT', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
            // observer.next([]);
            // observer.complete();
        });
    }
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
    public GetTotalInvites(sid, dateType,date): Observable<any> {
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            this.http.post(this.serverAddress + 'totalInvites', urlSearchParams).subscribe((response) => {
                this.loading.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetTicketDashboardData(packet){
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {        
            this.http.post('https://app.beelinks.solutions/a/v2/totalInquiries/', packet).subscribe((response) => {
                this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }

    public GetTotalVisitorsNew(packet){
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {        
            this.http.post(this.analyticsPythonService+'getVisitorCount/', packet).subscribe((response) => {
                this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }

    public GetTotalRegViaLivechat(packet){
        this.loading.next(true);
        return new Observable((observer) => {        
            this.http.post(this.analyticsPythonService+'totalRegViaLiveChat/', packet).subscribe((response) => {
                this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }


    public GetTotalVisitorsLeftWithoutLivechat(packet){
        this.loading.next(true);
        return new Observable((observer) => {        
            this.http.post(this.analyticsPythonService+'visitorLeftWithoutLiveChat/', packet).subscribe((response) => {
                this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }

    public GetTotalVisitorsLeftFromFirstPage(packet){
        this.loading.next(true);
        return new Observable((observer) => {        
            this.http.post(this.analyticsPythonService+'visitorLeftFromFirstPage/', packet).subscribe((response) => {
                this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }

    public GetRatioOfReturnVisitor(packet){
        this.loading.next(true);
        return new Observable((observer) => {        
            this.http.post(this.analyticsPythonService+'ratioOfReturnVisitor/', packet).subscribe((response) => {
                this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }

    public GetAvailabilityHours(packet){
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {        
            this.http.post('https://app.beelinks.solutions/a/v2/availabilityHours/', packet).subscribe((response) => {
                this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetHourlyActivityData(packet){
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {        
            this.http.post(environment.restServer + '/agent/getHourlyData', packet).subscribe((response) => {
                this.loading.next(false);
                // console.log(response.json());
                // console.log(JSON.stringify(response.json()));
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetScorecardData(packet){
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {        
            this.http.post('https://app.beelinks.solutions/a/v2/responseTime/', packet).subscribe((response) => {
                this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public GetMissedChats(packet){
        this.loading.next(true);
        // this.loadingTableData.next(true);
        return new Observable((observer) => {        
            this.http.post('https://app.beelinks.solutions/a/v2/getTotalNotEntertainedChatsCount/', packet).subscribe((response) => {
                this.loading.next(false);
                observer.next(response.json());
                observer.complete();
            }, err => {
                this.loading.next(false);
                observer.error(err);
            });
        });
    }
    public promise_GetAgentActivity(sid, dateType,date, agent_email?): Promise<any> {
        let agentEmail = (agent_email) ? agent_email : 'null';
        return new Promise((resolve, reject) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('dateType', dateType);
            urlSearchParams.append('date_from', new Date(date.from).toISOString());
            urlSearchParams.append('date_to', new Date(date.to).toISOString());
            urlSearchParams.append('email', agentEmail);
            this.http.post(this.serverAddress + 'agent/activity', urlSearchParams).subscribe((response) => {
                resolve(response.json().details);
            }, err => {
                reject(err);
            });
        })
    }
    public promise_GetChatDetails(sid, agent_email?): Promise<any> {
        let agentEmail = (agent_email) ? agent_email : 'null';
        return new Promise((resolve, reject) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('email', agentEmail);
            this.http.post(this.serverAddress + 'agent/chats', urlSearchParams).subscribe((response) => {
                resolve(response.json());
            }, err => {
                reject(err);
            });
        })
    }
    public promise_GetTicketDetails(sid, agent_email?): Promise<any> {
        let agentEmail = (agent_email) ? agent_email : 'null';
        return new Promise((resolve, reject) => {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('sid', sid);
            urlSearchParams.append('timeZone', this.timeZone);
            urlSearchParams.append('email', agentEmail);
            this.http.post(this.serverAddress + 'agent/tickets', urlSearchParams).subscribe((response) => {
                resolve(response.json());
            }, err => {
                reject(err);
            });
        })
    }

    public GetAgentStats(sid, dateType,date,  agentEmail?): Observable<any> {
        this.loading.next(true);
        this.agent_stats.next({
            activity: [],
            chatdetails: undefined,
            ticketdetails: undefined,
            date: dateType
        });
        return new Observable((observer) => {
            
            Promise.all([this.promise_GetAgentActivity(sid,dateType,date, agentEmail), this.promise_GetChatDetails(sid, agentEmail), this.promise_GetTicketDetails(sid, agentEmail)]).then((result) => {
                this.isServerDown.next(false);
                // console.log(result);
                observer.next(result);
                observer.complete();
                this.loading.next(false);
            }).catch((err) => {
                // console.log(err);
                observer.next(this.agent_stats);
                observer.complete();
                this.isServerDown.next(true);
                this.loading.next(false);
            });
        })
    }

    public GetVisitorSessions(visitorIDs) {
        this.loadingTableData.next(true);
        this.table_visitors.next([]);
        this.socket.emit('analytics_getvisitors', { visitorIDs: visitorIDs }, (response) => {
            // console.log(response);
            this.table_visitors.next(response.visitors);
            this.loadingTableData.next(false);
            // this.ExportToExcel(response.visitors, 'dummy.xlsx');
        })
    }
    public GetConversations(convIDs) {
        this.loadingTableData.next(true);
        this.table_conversations.next([]);
        // console.log('Getting conversations');

        this.socket.emit('analytics_getconversations', { convIDs: convIDs }, (response) => {
            // console.log(response);
            this.table_conversations.next(response.conversations);
            this.loadingTableData.next(false);
        });
    }
    public GetTickets(ticketIDs) {
        this.loadingTableData.next(true);
        this.table_tickets.next([]);
        this.socket.emit('analytics_gettickets', { ticketIDs: ticketIDs }, (response) => {
            // console.log(response);
            this.table_tickets.next(response.tickets);
            this.loadingTableData.next(false);
        })
    }
    
    //Chart Options
    updateChart(type, dataArray: Array<any>, arrayType, seriesName, nodata = false, count = 0, additionalData = undefined) {

        if (count) {
            this.options.getValue().title.text = count;
        } else {
            this.options.getValue().title.text = '';
        }

        if (!nodata) {
            let categories = [];
            let points = [];
            let series = [];
            this.options.getValue().chart.type = type;
            this.options.getValue().chart.zoomType = 'x';
            this.options.getValue().series = [{}];
            if (arrayType == 'flat') {
                dataArray.forEach(data => {
                    categories.push(data.name);
                    points.push(data.value);
                });
                this.options.getValue().legend.enabled = false;
                this.options.getValue().xAxis.categories = categories;
                this.options.getValue().series[0].name = seriesName;
                this.options.getValue().series[0].data = points;
            } else if (arrayType == 'dimensional') {
                dataArray[0].series.forEach(element => {
                    categories.push(element.name);
                });
                dataArray.forEach(element => {
                    let values = [];
                    element.series.forEach(data => {
                        values.push(data.value);
                    });
                    series.push({
                        name: element.name,
                        data: values
                    });
                });
                this.options.getValue().legend.enabled = true;
                this.options.getValue().xAxis.categories = categories;
                this.options.getValue().series = series;
            } else if (arrayType == 'agents') {
                dataArray[0].series.forEach(element => {
                    categories.push(element.name);
                });
                // console.log(dataArray[0]);

                dataArray.forEach(element => {
                    let values = [];
                    element.series.forEach(data => {
                        values.push(data.value);
                    });
                    series.push({
                        name: element.name,
                        data: values
                    });
                });
                this.options.getValue().legend.enabled = true;
                this.options.getValue().xAxis.categories = categories;
                this.options.getValue().series = series;
            }
        } else {
            let categories = [];
            let points = [];
            this.options.getValue().chart.type = type;
            this.options.getValue().chart.zoomType = 'x';
            this.options.getValue().series = [{}];
            if (arrayType == 'flat') {
                if (dataArray) dataArray.forEach(data => {
                    categories.push(data.name);
                });
            } else if (arrayType == 'dimensional' || arrayType == 'agents') {
                dataArray[0].series.forEach(element => {
                    categories.push(element.name);
                });
            }
            categories.forEach(c => {
                points.push(0);
            });
            this.options.getValue().legend.enabled = false;
            this.options.getValue().xAxis.categories = categories;
            this.options.getValue().series[0].name = seriesName;
            this.options.getValue().series[0].data = points;
        }
        this.options.getValue().additionalData = {
            date: this.selectedDate.getValue()
        };

        this.options.getValue().additionalData = additionalData;

        this.options.next(this.options.getValue());
    }

    updateChartSimple(chartType, legendEnabled, categories, series ,count = 0) {
        if (count) {
            this.options.getValue().title.text = count;
        } else {
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
    }

    resetOptions() {
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
                categories: [

                ]
            },
            series: [{}]
        });
    }
    // public ExportToExcel(json, fileName){
    //     let sheetObj = xlsx.utils.json_to_sheet(json);
    //     fs.writeFileSync(fileName, sheetObj, 'binary');
    // }
    exportHTMLToExcel(id, filename) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40"><head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> <x:ExcelWorksheet><x:Name>{worksheet}</x:Name> <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions> </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook> </xml><![endif]--></head><body> <table>{table}</table></body></html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; })
            }
        var ctx = { worksheet: 'Multi Level Export Table Example' || 'Worksheet', table: document.getElementById(id).innerHTML }
        // window.location.href = uri + base64(format(template, ctx))
        var link = document.createElement('a');
        link.download = filename;
        link.href = uri + base64(format(template, ctx));
        link.click();
    };
    public ExportToExcel(data, filename) {
        try {
            console.log(data);
            json2excel({
                data,
                name: filename,
                formateDate: 'yyyy/mm/dd'
            });
        } catch (e) {
            console.log(e);

            console.error('export error');
        }
    }
    customFormatter(date: Date) {
		return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
	}
    dateFormatter(d) {
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
    }
    daysBetween(date1, date2) {
		//Get 1 day in milliseconds
		var one_day = 1000 * 60 * 60 * 24;

		// Convert both dates to milliseconds
		var date1_ms = date1.getTime();
		var date2_ms = date2.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = date2_ms - date1_ms;

		// Convert back to days and return
		return Math.round(difference_ms / one_day);
    }
    SubtractDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() - days);
		return result;
    }
    AddDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}
	SubtractMonths(date, months) {
		var result = new Date(date);
		result.setMonth(result.getMonth() - months);
		return result;
	}
	SubtractYears(date, years) {
		var result = new Date(date);
		result.setFullYear(result.getFullYear() - years);
		return result;
    }
    diffMonth(from, to, type = 'nonarray') {
		var arr = [];
        var fromYear =  from.getFullYear();
        var toYear =  to.getFullYear();
        var diffYear = (12 * (toYear - fromYear)) + to.getMonth();
        for (var i = from.getMonth(); i <= diffYear; i++) {
            arr.push({ name: this.monthNames[i%12], value: (type == 'nonarray') ? 0 : [] });
        }        	
		// for (var i = 0; i <= diffMonth; i++) {
		// 	arr.push({ name: this.monthNames[fromMonth], value: (type == 'nonarray') ? 0 : [] });
		// 	fromMonth++;
		// }

		return arr;
    }
    diffYear(from, to, type = 'nonarray') {
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
	}

}