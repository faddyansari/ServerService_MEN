"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketViewComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/switchMap");
//line 245->mergedticketids changed to primary ref.
var TicketViewComponent = /** @class */ (function () {
    // savingCustomFields = {
    // };
    // selectedThread_copy: any;
    function TicketViewComponent(_ticketService, _authService, _globalStateService, _utilityService, _router, snackBar, dialog, _tagService, _ticketScenarios, _uploadingService, _ticketAutomationService, _formDesignerService, _ticketTemplateService, _slaPolicySvc, _surveyService, _iconIntSvc) {
        var _this = this;
        this._ticketService = _ticketService;
        this._authService = _authService;
        this._globalStateService = _globalStateService;
        this._utilityService = _utilityService;
        this._router = _router;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._tagService = _tagService;
        this._ticketScenarios = _ticketScenarios;
        this._uploadingService = _uploadingService;
        this._ticketAutomationService = _ticketAutomationService;
        this._formDesignerService = _formDesignerService;
        this._ticketTemplateService = _ticketTemplateService;
        this._slaPolicySvc = _slaPolicySvc;
        this._surveyService = _surveyService;
        this._iconIntSvc = _iconIntSvc;
        this.shiftdown = false;
        this.confirm = false;
        this.formtoggle = false;
        this.showError = false;
        this.loadingReg = false;
        this.loadingIconSearch = false;
        this.agentAssigned = false;
        this.clearSerchForm = false;
        this.selectedThreadArray = [];
        this.sbtAgents = [];
        this.scenarios = [];
        this.scrollTop = 10;
        this.loading = false;
        this.selectedThread = undefined;
        this.matchedData = undefined;
        this.subscriptions = [];
        this.searchedData = [];
        this.selectedGroup = '';
        this.indexCheckPrevious = false;
        this.indexCheckNext = false;
        this.selectedForm = [];
        this.scrollHeight = 0;
        this.showVisitorHistorySwitch = false;
        this.verified = true;
        this.checkedList = [];
        this.files = [];
        this.filenames = [];
        this.ShowAttachmentAreaDnd = false;
        this.executed = false;
        this.loadingMoreAgents = false;
        this.file = undefined;
        this.actSurvey = [];
        this.fileValid = true;
        this.uploading = false;
        this.mergedTicket_details = [];
        this.value = '';
        this.all_agents = [];
        this.watch_agents = [];
        this.selectedwatchAgents = [];
        this.agentList_original = [];
        this.all_groups = [];
        this.tagList = [];
        this.currentRoute = '';
        this.SalesEmpList = [];
        this.agentName = '';
        this.paginationLimit = 50;
        this.ended = false;
        this.endedWatchers = false;
        this.loadingMoreAgentsWatchers = false;
        this.searchInput = new Subject_1.Subject();
        this.automatedResponses = [];
        this.allActivatedPolicies = [];
        this.msg = {
            body: '',
            to: '',
            tid: [],
            subject: '',
            attachment: [],
            type: '',
            from: '',
            cc: [],
            bcc: []
        };
        this.forceSelected = '';
        this.messageDetails = {
            to: '',
            from: '',
            cc: '',
            bcc: ''
        };
        this.showViewHistory = true;
        this.subscriptions.push(this._globalStateService.resizeEvent.subscribe(function (data) {
            _this.showViewHistory = data;
        }));
        this.subscriptions.push(this._surveyService.getActivatedSurvey().subscribe(function (data) {
            _this.survey = data.survey;
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
            _this._iconIntSvc.GetMasterData(19).subscribe(function (res) {
                if (res) {
                    _this.SalesEmpList = res.MasterData;
                    _this.SalesEmpList.map(function (val) {
                        if (val.EmailAddress == _this.agent.email) {
                            _this.agentName = val.EmployeeName;
                        }
                    });
                }
            });
        }));
        this.subscriptions.push(this._ticketScenarios.AllScenarios.subscribe(function (data) {
            if (data && data.length) {
                var agents_1 = [];
                data.map(function (res) {
                    if (res.availableFor == "allagents") {
                        _this.scenarios.push(res);
                    }
                    else if (res.availableFor == _this.agent.email) {
                        _this.scenarios.push(res);
                    }
                    else {
                        //see for agent in group from groups defined in groupNames..
                        var filteredagent = _this.all_groups.filter(function (g) { return res.groupName.includes(g.group_name); }).map(function (g) { return g.agent_list; });
                        filteredagent.map(function (g) {
                            g.map(function (agent) {
                                if (agent.email == _this.agent.email) {
                                    agents_1.push(agent.email);
                                }
                            });
                        });
                        if (agents_1 && agents_1.length) {
                            _this.scenarios.push(res);
                        }
                    }
                });
            }
        }));
        this.subscriptions.push(this._router.params.subscribe(function (params) {
            if (params.id) {
                _this.forceSelected = params.id;
                if (_this.forceSelected) {
                    // console.log('Force Selected: ' + this.forceSelected);
                    _this.setSelectedThread(_this.forceSelected);
                }
            }
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.tickets;
            }
            if (data) {
                _this.fields = data.schemas.ticket.fields.filter(function (field) { field.value = ''; return !field.default; });
            }
        }));
        this.subscriptions.push(this._tagService.Tags.subscribe(function (data) {
            if (data && data.length)
                _this.tagList = data;
        }));
        this.subscriptions.push(this._ticketService.Initialized.subscribe(function (value) {
            if (value) {
                _this.subscriptions.push(_ticketService.TicketCount.subscribe(function (data) {
                    if (data) {
                        var temp_1 = 0;
                        data.map(function (val) { return temp_1 += val.count; });
                        _this.totalCount = temp_1;
                    }
                }));
                _this.subscriptions.push(_this._formDesignerService.WholeForm.subscribe(function (data) {
                    if (!data.length) {
                        _this.Forms = [];
                    }
                    else {
                        _this.Forms = data;
                    }
                }));
                _this.subscriptions.push(_this._ticketService.getPagination().subscribe(function (pagination) {
                    _this.pageIndex = pagination;
                }));
                _this.subscriptions.push(_globalStateService.currentRoute.subscribe(function (route) {
                    _this.currentRoute = route;
                    if (!_this._ticketService.isTicketViewLoaded.getValue() && _this.currentRoute == '/tickets')
                        _this._ticketService.isTicketViewLoaded.next(true);
                    // else this.BackToList();
                }));
                _this.subscriptions.push(_this._ticketAutomationService.Groups.subscribe(function (groups) {
                    _this.all_groups = groups;
                }));
                _this.subscriptions.push(_this._authService.getSettings().subscribe(function (settings) {
                    if (settings)
                        _this.verified = settings.verified;
                }));
                _this.subscriptions.push(_ticketService.getNotification().subscribe(function (notification) {
                    if (notification) {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: notification.img,
                                msg: notification.msg
                            },
                            duration: 3000,
                            panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
                        }).afterDismissed().subscribe(function () {
                            _ticketService.clearNotification();
                        });
                    }
                }));
            }
        }));
        this.subscriptions.push(this._slaPolicySvc.AllInternalSLAPolicies.subscribe(function (data) {
            if (data && data.length) {
                data.map(function (policy) {
                    if (policy.activated) {
                        _this.allActivatedPolicies.push(policy);
                    }
                });
            }
        }));
        this.subscriptions.push(_ticketService.getSelectedThread().subscribe(function (selectedThread) {
            if (selectedThread && Object.keys(selectedThread).length) {
                _this.selectedThread = selectedThread;
                //console.log(this.selectedThread);
                // console.log('Ticket Selected!');
                _this.selectedThread.ticketNotes = _this.selectedThread.ticketNotes && _this.selectedThread.ticketNotes.length ? _this.sortTicketNotes(_this.selectedThread.ticketNotes) : [];
                if (_this.selectedThread && _this.selectedThread.group) {
                    _this._utilityService.getAgentsAgainstGroup([_this.selectedThread.group]).subscribe(function (agents) {
                        _this.all_agents = agents;
                        _this.agentList_original = agents;
                    });
                }
                else {
                    _this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
                        _this.all_agents = agents;
                        _this.agentList_original = agents;
                    });
                }
                /**
                 * CASES:
                 * 1. If user is not registered in icon
                 * 2. If user is registered in chats section but ticket not updated.
                 * 3. If user is not registered by chats section and registered in tickets but not have related info.
                 */
                if ((_this.selectedThread.nsp == '/sbtjapan.com' || _this.selectedThread.nsp == '/sbtjapaninquiries.com')) {
                    //IF STATE OPEN-> WILL CHECK ON VIEW EVERY TIME
                    if (_this.selectedThread.state == 'OPEN') {
                        if ((_this.selectedThread.sbtVisitor || _this.selectedThread.source == 'livechat' || _this.selectedThread.source == 'email' || _this.selectedThread.visitor.phone)) {
                            console.log("Checking Registration...");
                            var splitted = _this.selectedThread.subject.split('/');
                            var useCase = '';
                            var emailCheck_1 = '';
                            if (splitted[0].includes('cmid')) {
                                var minorCase = splitted[0].split(":");
                                useCase = minorCase[minorCase.length - 1].toString();
                            }
                            _this._ticketService.CheckCustomerRegistration(_this.selectedThread.sbtVisitor ? _this.selectedThread.sbtVisitor.toLowerCase() : _this.selectedThread.visitor.email.toLowerCase(), _this.selectedThread.sbtVisitorPhone ? _this.selectedThread.sbtVisitorPhone : _this.selectedThread.visitor.phone ? _this.selectedThread.visitor.phone : '', (splitted && splitted.length && splitted[2]) ? splitted[2].trim() : _this.selectedThread.dynamicFields && Object.keys(_this.selectedThread.dynamicFields).length && _this.selectedThread.dynamicFields['CM ID'] ? _this.selectedThread.dynamicFields['CM ID'] : useCase != '' ? useCase : '', _this.selectedThread._id).subscribe(function (result) {
                                if (result && result.ResultInformation && result.ResultInformation.length && result.ResultInformation[0].ResultCode == "0") {
                                    console.log("Record Found");
                                    _this.matchedData = result.CustomerData[0];
                                    _this.matchedData.ContactMailAddressList.map(function (res) {
                                        if (res.Default == "1") {
                                            emailCheck_1 = res.MailAddress;
                                        }
                                    });
                                    if (!_this.selectedThread.sbtVisitor && (_this.selectedThread.visitor.email == 'support@bizzchats.com' || _this.selectedThread.visitor.email == 'no-reply@sbtjapan.com' || _this.selectedThread.visitor.email == 'noreply@sbtjapan.com' || _this.selectedThread.visitor.email.includes('@tickets.livechatinc.com'))) {
                                        _this.selectedThread.sbtVisitor = _this.matchedData.ContactMailAddressList[0].MailAddress;
                                    }
                                    //CUSTOMER INFO CHECK
                                    if ((!_this.selectedThread.CustomerInfo || (_this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.salesPersonName != result.CustomerData[0].SalesPersonData[0].UserName))) {
                                        console.log("Customer Info not Found!");
                                        _this.selectedThread.CustomerInfo = {};
                                        _this.selectedThread.RelatedCustomerInfo = [];
                                        var restOfCustomerBasicData_1 = [];
                                        var restOfCustomerEmails_1 = [];
                                        var restOfCustomerPhone_1 = [];
                                        var restOfCustomerSalesPerson_1 = [];
                                        var restOfCustomersId_1 = [];
                                        /**Emails exact match */
                                        _this.matchedData.ContactMailAddressList.map(function (email) {
                                            if (email.MailAddress.toLowerCase() == (_this.selectedThread.sbtVisitor ? _this.selectedThread.sbtVisitor : _this.selectedThread.visitor.email).toLowerCase()) {
                                                _this.selectedThread.CustomerInfo['customerId'] = email.CustomerId;
                                            }
                                        });
                                        /**Basic data match/related */
                                        _this.matchedData.BasicData.map(function (x) {
                                            if (x.CustomerId == _this.selectedThread.CustomerInfo['customerId']) {
                                                _this.selectedThread.CustomerInfo['customerId'] = x.CustomerId;
                                                _this.selectedThread.CustomerInfo['customerName'] = x.CustomerName;
                                                _this.selectedThread.CustomerInfo['customerRank'] = x.CustomerRank;
                                                _this.selectedThread.CustomerInfo['customerCountry'] = x.Country;
                                                _this.selectedThread.CustomerInfo['customerType'] = x.CustomerType;
                                            }
                                            if (x.CustomerId != _this.selectedThread.CustomerInfo['customerId']) {
                                                restOfCustomersId_1.push(x.CustomerId);
                                                restOfCustomerBasicData_1.push(x);
                                            }
                                        });
                                        /**ContactPhoneNumberList match/related */
                                        _this.matchedData.ContactPhoneNumberList.map(function (x) {
                                            if (x.CustomerId == _this.selectedThread.CustomerInfo['customerId']) {
                                                _this.selectedThread.CustomerInfo['customerPhone'] = [];
                                                if (x.Default == "1")
                                                    _this.selectedThread.CustomerInfo['customerPhone'].unshift(x.PhoneNumber);
                                                else
                                                    _this.selectedThread.CustomerInfo['customerPhone'].push(x.PhoneNumber);
                                            }
                                            if (x.CustomerId != _this.selectedThread.CustomerInfo['customerId'])
                                                restOfCustomerPhone_1.push(x);
                                        });
                                        /**ContactMailAddressList match/related */
                                        _this.matchedData.ContactMailAddressList.map(function (x) {
                                            if (x.CustomerId == _this.selectedThread.CustomerInfo['customerId']) {
                                                _this.selectedThread.CustomerInfo['customerEmail'] = [];
                                                if (x.Default == "1")
                                                    _this.selectedThread.CustomerInfo['customerEmail'].unshift(x.MailAddress);
                                                else
                                                    _this.selectedThread.CustomerInfo['customerEmail'].push(x.MailAddress);
                                            }
                                            if (x.CustomerId != _this.selectedThread.CustomerInfo['customerId'])
                                                restOfCustomerEmails_1.push(x);
                                        });
                                        /**SalesPersonData match/related */
                                        _this.matchedData.SalesPersonData.map(function (x) {
                                            if (x.CustomerId == _this.selectedThread.CustomerInfo['customerId']) {
                                                _this.selectedThread.CustomerInfo['salesPersonName'] = x.UserName;
                                                _this.selectedThread.CustomerInfo['salesPersonCode'] = x.UserCode;
                                                _this.selectedThread.CustomerInfo['salesPersonOffice'] = x.Office;
                                            }
                                            if (x.CustomerId != _this.selectedThread.CustomerInfo['customerId'])
                                                restOfCustomerSalesPerson_1.push(x);
                                        });
                                        /**Dealing with rest related data */
                                        if (restOfCustomersId_1 && restOfCustomersId_1.length) {
                                            var restBasicData_1 = {};
                                            var restSalesData_1 = {};
                                            var contactEmail_1 = [];
                                            var contactPhone_1 = [];
                                            restOfCustomersId_1.forEach(function (val, index) {
                                                restOfCustomerBasicData_1.map(function (x) {
                                                    if (x.CustomerId == restOfCustomersId_1[index]) {
                                                        restBasicData_1['customerId'] = x.CustomerId;
                                                        restBasicData_1['customerName'] = x.CustomerName;
                                                        restBasicData_1['customerRank'] = x.CustomerRank;
                                                        restBasicData_1['customerType'] = x.CustomerType;
                                                        restBasicData_1['customerCountry'] = x.Country;
                                                    }
                                                });
                                                restOfCustomerSalesPerson_1.map(function (x) {
                                                    if (x.CustomerId == restOfCustomersId_1[index]) {
                                                        restSalesData_1['salesPersonName'] = x.UserName;
                                                        restSalesData_1['salesPersonCode'] = x.UserCode;
                                                        restSalesData_1['salesPersonOffice'] = x.Office;
                                                    }
                                                });
                                                restOfCustomerPhone_1.map(function (x) {
                                                    if (x.CustomerId == restOfCustomersId_1[index]) {
                                                        if (x.Default == "1")
                                                            contactPhone_1.unshift(x.PhoneNumber);
                                                        else
                                                            contactPhone_1.push(x.PhoneNumber);
                                                    }
                                                });
                                                restOfCustomerEmails_1.map(function (x) {
                                                    if (x.CustomerId == restOfCustomersId_1[index]) {
                                                        if (x.Default == "1")
                                                            contactEmail_1.unshift(x.MailAddress);
                                                        else
                                                            contactEmail_1.push(x.MailAddress);
                                                    }
                                                });
                                            });
                                            var similarData = __assign(__assign({}, restBasicData_1), restSalesData_1);
                                            similarData['customerEmail'] = contactEmail_1;
                                            similarData['customerPhone'] = contactPhone_1;
                                            _this.selectedThread.RelatedCustomerInfo.push(similarData);
                                        }
                                        _this._ticketService.InsertCustomerInfo(_this.selectedThread._id, _this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.customerId ? _this.selectedThread.CustomerInfo : {}, _this.selectedThread.RelatedCustomerInfo && _this.selectedThread.RelatedCustomerInfo.length ? _this.selectedThread.RelatedCustomerInfo : [], 'iconAssigned').subscribe(function (val) {
                                            if (val.status == "ok") {
                                                // if (splitted && splitted.length && splitted[3]) {
                                                // 	splitted[3] = this.selectedThread.CustomerInfo.salesPersonName;
                                                // 	this.selectedThread.subject.split('/')[3] = splitted[3];
                                                // 	this.selectedThread.subject.split('/')[2] = this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId ? this.selectedThread.CustomerInfo.customerId : this.selectedThread.subject.split('/')[2];
                                                // 	matter = this.selectedThread.subject;
                                                // }
                                                // this.selectedThread.subject = matter;
                                                _this.selectedThread.CustomerInfo = val.res.CustomerInfo;
                                                _this.selectedThread.RelatedCustomerInfo = val.res.RelatedCustomerInfo;
                                                if (_this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.customerId) {
                                                    var logfound_1 = false;
                                                    _this.selectedThread.ticketlog = _this.selectedThread.ticketlog.map(function (log) {
                                                        if (log.date == new Date(val.ticketlog.time_stamp).toDateString()) {
                                                            log.groupedticketlogList.unshift(val.ticketlog);
                                                            logfound_1 = true;
                                                        }
                                                        return log;
                                                    });
                                                    if (!logfound_1) {
                                                        _this.selectedThread.ticketlog.unshift({
                                                            date: new Date(val.ticketlog.time_stamp).toDateString(),
                                                            groupedticketlogList: [val.ticketlog]
                                                        });
                                                    }
                                                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                                        data: {
                                                            img: 'ok',
                                                            msg: 'Customer Found Successfully ' + (_this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.customerId ? 'with ID: ' + _this.selectedThread.CustomerInfo.customerId : '')
                                                        },
                                                        duration: 3000,
                                                        panelClass: ['user-alert', 'success']
                                                    });
                                                }
                                            }
                                        });
                                    }
                                    //ASSIGN AGENT CHECK
                                    if (!_this.agentAssigned) {
                                        if ((_this.selectedThread.sbtVisitor ? _this.selectedThread.sbtVisitor : _this.selectedThread.visitor.email).toLowerCase() == emailCheck_1.toLowerCase()) {
                                            _this.agentAssigned = true;
                                            if (result.CustomerData[0].SalesPersonData[0].UserName != 'FREE') {
                                                console.log("Not free");
                                                var assigned_to_1 = '';
                                                _this._iconIntSvc.GetMasterData(19).subscribe(function (res) {
                                                    if (res) {
                                                        _this.SalesEmpList = res.MasterData;
                                                        _this.SalesEmpList.map(function (val) {
                                                            if (val.EmployeeName == result.CustomerData[0].SalesPersonData[0].UserName) {
                                                                assigned_to_1 = val.EmailAddress;
                                                                _this._ticketService.getAgentByEmail(assigned_to_1, _this.selectedThread.nsp).subscribe(function (agent) {
                                                                    console.log(agent);
                                                                    if (agent && agent.length) {
                                                                        if (assigned_to_1 != _this.selectedThread.assigned_to) {
                                                                            _this.AssignAgentForTicket(assigned_to_1, 'iconAssigned');
                                                                            _this.selectedThread.assigned_to = assigned_to_1;
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                    //DYNAMIC FIELD CHECK
                                    if ((!_this.selectedThread.dynamicFields || !_this.selectedThread.dynamicFields['CM ID']) && ((_this.selectedThread.sbtVisitor ? _this.selectedThread.sbtVisitor : _this.selectedThread.visitor.email).toLowerCase() == emailCheck_1.toLowerCase())) {
                                        var fieldName_1 = 'CM ID';
                                        var fieldValue_1 = result.CustomerData[0].BasicData[0].CustomerId;
                                        _this._ticketService.UpdateDynamicProperty(_this.selectedThread._id, fieldName_1, fieldValue_1, 'iconRegistered').subscribe(function (response) {
                                            if (!_this.selectedThread.dynamicFields)
                                                _this.selectedThread.dynamicFields = {};
                                            _this.selectedThread.dynamicFields[fieldName_1] = fieldValue_1;
                                            // let logfound = false;
                                            // this.selectedThread.ticketlog = this.selectedThread.ticketlog.map(log => {
                                            // 	if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
                                            // 		log.groupedticketlogList.unshift(response.ticketlog);
                                            // 		logfound = true;
                                            // 	}
                                            // 	return log;
                                            // });
                                            // if (!logfound) {
                                            // 	this.selectedThread.ticketlog.unshift({
                                            // 		date: new Date(response.ticketlog.time_stamp).toDateString(),
                                            // 		groupedticketlogList: [response.ticketlog]
                                            // 	})
                                            // }
                                        });
                                        // }
                                    }
                                }
                                else if (result && result.ResultInformation && result.ResultInformation.length && result.ResultInformation[0].ResultCode == "1") {
                                    console.log("No record found!");
                                }
                                else {
                                    console.log("Error in getting data!");
                                }
                            });
                        }
                    }
                }
                if (_this.selectedThread && _this.selectedThread.watchers && _this.selectedThread.watchers.length) {
                    _this.subscriptions.push(_this._ticketService.getAgentAgainstWatchers(_this.selectedThread.watchers).subscribe(function (agents) {
                        _this.watch_agents = agents;
                    }));
                }
                else {
                    _this.subscriptions.push(_this._utilityService.getAllAgentsListObs().subscribe(function (agent) {
                        _this.watch_agents = agent;
                    }));
                }
                if (_this.selectedThread.historyBy) {
                    _this.subscriptions.push(_ticketService.getTicketHistoryByEmail(_this.selectedThread.historyBy).subscribe(function (threads) {
                        if (threads) {
                            _this.visitor_ticket_history = _this.transformVisitorTicketHistory(threads);
                        }
                    }));
                }
                else {
                    _this.subscriptions.push(_ticketService.getTicketHistory(_this.selectedThread.visitor.email).subscribe(function (threads) {
                        if (threads) {
                            _this.visitor_ticket_history = _this.transformVisitorTicketHistory(threads);
                        }
                    }));
                }
                _this.CheckIndex().subscribe();
                _this.selectedThreadArray.push(_this.selectedThread);
                _this.showVisitorHistorySwitch = false;
                if (!_this.selectedThread.synced) {
                    // this._ticketService.getTask(this.selectedThread._id);
                    if (_this.selectedThread.merged && _this.selectedThread.mergedTicketIds.length) {
                        //this is when merge ids are appended with selected thread.-->for merged ticket work.
                        _this._ticketService.getMessagesForMergedTicket(_this.selectedThread.mergedTicketIds).subscribe(function (data) {
                            if (data.length > 0) {
                                data = data.reduce(function (previous, current) {
                                    if (!previous[new Date(current.datetime).toDateString()]) {
                                        previous[new Date(current.datetime).toDateString()] = [current];
                                    }
                                    else {
                                        previous[new Date(current.datetime).toDateString()].push(current);
                                    }
                                    return previous;
                                }, {});
                            }
                            _this.selectedThread.messages = Object.keys(data).map(function (key) {
                                return { date: key, groupedMessagesList: data[key] };
                            }).sort(function (a, b) {
                                //sorts in most recent chat.
                                if (new Date(a.date) < new Date(b.date))
                                    return -1;
                                else if (new Date(a.date) > new Date(b.date))
                                    return 1;
                                else
                                    0;
                            });
                            _this.selectedThread.synced = true;
                        });
                    }
                    else {
                        _this._ticketService.getMessages(_this.selectedThread._id).subscribe(function (data) {
                            if (data) {
                                if (data.length > 0) {
                                    data = data.reduce(function (previous, current) {
                                        if (!previous[new Date(current.datetime).toDateString()]) {
                                            previous[new Date(current.datetime).toDateString()] = [current];
                                        }
                                        else {
                                            previous[new Date(current.datetime).toDateString()].push(current);
                                        }
                                        return previous;
                                    }, {});
                                }
                                _this.selectedThread.messages = Object.keys(data).map(function (key) {
                                    return { date: key, groupedMessagesList: data[key] };
                                }).sort(function (a, b) {
                                    //sorts in most recent chat.
                                    if (new Date(a.date) < new Date(b.date))
                                        return -1;
                                    else if (new Date(a.date) > new Date(b.date))
                                        return 1;
                                    else
                                        0;
                                });
                                _this.selectedThread.synced = true;
                            }
                            else {
                                _this.selectedThread.messages = [];
                                _this.selectedThread.synced = true;
                            }
                        });
                    }
                }
                if (!_this.selectedThread.viewState || _this.selectedThread.viewState == 'UNREAD') {
                    _this._ticketService.updateViewState('READ', [_this.selectedThread._id]).subscribe(function (response) {
                    });
                }
                _this.autoscroll = true;
                if (_this.selectedThread.group && _this.permissions.canView != 'team') {
                    _this._ticketService.getAgentsAgainstGroup([_this.selectedThread.group]).subscribe(function (agents) {
                        _this.all_agents = agents;
                        _this.agentList_original = agents;
                    });
                }
                else {
                    _this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
                        _this.all_agents = agents;
                        _this.agentList_original = agents;
                    });
                }
                setTimeout(function () {
                    if (_this.selectedThread && _this.selectedThread.messages && _this.selectedThread.messages.length) {
                        var lastGroupedMessage = _this.selectedThread.messages[_this.selectedThread.messages.length - 1].groupedMessagesList;
                        var recentMessageId = lastGroupedMessage[lastGroupedMessage.length - 1]._id;
                        var elem = document.getElementById(recentMessageId);
                        if (elem)
                            elem.parentElement.parentElement.scrollIntoView({ behavior: 'smooth', block: "start" });
                    }
                }, 0);
            }
            else {
                _this.selectedThread = undefined;
            }
        }));
        this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(function (groups) {
            _this.all_groups = groups;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(this._ticketTemplateService.getAutomatedResponseAgainstAgent().subscribe(function (data) {
            if (data.status == "ok") {
                _this.automatedResponses = data.AutomatedResponses;
            }
        }));
        this.subscriptions.push(_ticketService.getNotification().subscribe(function (notification) {
            if (notification) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: notification.img,
                        msg: notification.msg
                    },
                    duration: 3000,
                    panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
                }).afterDismissed().subscribe(function () {
                    _ticketService.clearNotification();
                });
            }
        }));
        this.subscriptions.push(this._globalStateService.shortcutEvents.subscribe(function (data) {
            if (_this.selectedThread) {
                _this.GetTicket(data);
            }
        }));
        this.searchInput.debounceTime(500)
            .distinctUntilChanged()
            .switchMap(function (term) {
            return new Observable_1.Observable(function (observer) {
                if (term) {
                    if (!_this.selectedGroup) {
                        var agents_2 = _this.agentList_original.filter(function (a) { return a.email.includes(term.toLowerCase() || a.first_name.toLowerCase().includes(term.toLowerCase())); });
                        _this._utilityService.SearchAgent(term).subscribe(function (response) {
                            if (response && response.agentList.length) {
                                response.agentList.forEach(function (element) {
                                    if (!agents_2.filter(function (a) { return a.email == element.email; }).length) {
                                        agents_2.push(element);
                                    }
                                });
                            }
                            _this.all_agents = agents_2;
                        });
                    }
                    else {
                        var agents = _this.agentList_original.filter(function (a) { return a.includes(term.toLowerCase()); });
                        _this.all_agents = agents;
                        _this.watch_agents = agents;
                    }
                    // if (this.permissions.canView == 'all') {
                    // } else {
                    // 	let agents = this.agentList_original.filter(a => a.includes((term as string).toLowerCase()));
                    // 	this.all_agents = agents;
                    // }
                    // this.agentList = agents;
                }
                else {
                    _this.all_agents = _this.agentList_original;
                    _this.watch_agents = _this.agentList_original;
                }
            });
        }).subscribe();
    }
    TicketViewComponent.prototype.populateInfo = function (to, from, cc, bcc) {
        // console.log(to, from, cc ,bcc);
        this.messageDetails.to = (to) ? to : '';
        this.messageDetails.from = (from) ? from : '';
        this.messageDetails.cc = (cc) ? cc.join() : '';
        this.messageDetails.bcc = (bcc) ? bcc.join() : '';
    };
    TicketViewComponent.prototype.Reply = function (subject, from, to, tid, message) {
        var _this = this;
        // console.log('Replying');
        // console.log('subject', subject);
        // console.log('to', to);
        // console.log('tid', tid);
        var threadMessage = {
            type: 'reply',
            data: {
                from: message.from,
                date: message.datetime,
                subject: subject,
                to: message.to,
                body: message.message,
                attachment: message.attachment
            }
        };
        //console.log(threadMessage);
        this.msg = {
            subject: '',
            to: '',
            tid: [],
            body: '',
            attachment: [],
            type: '',
            from: '',
            cc: [],
            bcc: []
        };
        setTimeout(function () {
            if (!Array.isArray(tid))
                tid = [tid];
            _this.msg = {
                subject: subject,
                to: to,
                from: from,
                tid: tid,
                body: '',
                attachment: [],
                type: 'reply',
                cc: [],
                bcc: []
            };
            _this.threadMessage = threadMessage;
        }, 0);
        setTimeout(function () {
            var elem = document.getElementById('ticketMsg');
            if (elem)
                elem.scrollIntoView({ behavior: 'smooth', block: "start" });
        }, 0);
    };
    TicketViewComponent.prototype.sortTicketNotes = function (notes) {
        var ticketnotes = [];
        ticketnotes = notes;
        ticketnotes.sort(function (a, b) {
            if (new Date(a.added_at) > new Date(b.added_at))
                return -1;
            else if (new Date(a.added_at) < new Date(b.added_at))
                return 1;
            else
                0;
        });
        return ticketnotes;
    };
    TicketViewComponent.prototype.ReplyAll = function (subject, from, to, cc, bcc, tid, message) {
        var _this = this;
        var threadMessage = {
            type: 'reply-all',
            data: {
                from: message.from,
                date: message.datetime,
                subject: subject,
                to: message.to,
                body: message.message,
                attachment: message.attachment
            }
        };
        //console.log(threadMessage);
        this.msg = {
            subject: '',
            to: '',
            tid: [],
            body: '',
            attachment: [],
            type: '',
            from: '',
            cc: (cc) ? cc : [],
            bcc: (bcc) ? bcc : []
        };
        setTimeout(function () {
            if (!Array.isArray(tid))
                tid = [tid];
            _this.msg = {
                subject: subject,
                to: to,
                from: from,
                tid: tid,
                body: '',
                attachment: [],
                type: 'reply-all',
                cc: (cc) ? cc : [],
                bcc: (bcc) ? bcc : []
            };
            _this.threadMessage = threadMessage;
        }, 0);
        setTimeout(function () {
            var elem = document.getElementById('ticketMsg');
            if (elem)
                elem.scrollIntoView({ behavior: 'smooth', block: "start" });
        }, 0);
    };
    TicketViewComponent.prototype.seeCMID = function () {
        var res = this.selectedThread.subject.split('/');
        if (res && res.length) {
            if (res[4] && res[4].trim() == 'Beelinks' && this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId) {
                if (res[2] && res[2].toString().trim() == this.selectedThread.CustomerInfo.customerId.toString().trim()) {
                    return false;
                }
                else
                    return true;
            }
        }
        else
            return false;
    };
    TicketViewComponent.prototype.Forward = function (subject, from, tid, message) {
        var _this = this;
        var threadMessage = {
            type: 'forward',
            data: {
                from: message.from,
                date: message.datetime,
                subject: subject,
                to: message.to,
                body: message.message,
                attachment: message.attachment
            }
        };
        this.msg = {
            subject: '',
            to: '',
            tid: [],
            body: '',
            attachment: [],
            type: '',
            from: '',
            cc: [],
            bcc: []
        };
        setTimeout(function () {
            if (!Array.isArray(tid))
                tid = [tid];
            _this.msg = {
                subject: subject,
                to: '',
                tid: tid,
                body: '',
                attachment: [],
                type: 'fwd',
                from: from,
                cc: [],
                bcc: []
            };
            _this.threadMessage = threadMessage;
        }, 0);
        setTimeout(function () {
            var elem = document.getElementById('ticketMsg');
            if (elem)
                elem.scrollIntoView({ behavior: 'smooth', block: "start" });
        }, 0);
    };
    TicketViewComponent.prototype.Clear = function () {
        if (!this.uploading) {
            this.msg = {
                subject: '',
                to: '',
                tid: [],
                body: '',
                attachment: [],
                type: '',
                from: '',
                cc: [],
                bcc: []
            };
        }
    };
    TicketViewComponent.prototype.ngOnInit = function () {
    };
    TicketViewComponent.prototype.ToggleForm = function () {
        this.formtoggle = !this.formtoggle;
    };
    //send message
    // Multiple file attachment
    TicketViewComponent.prototype.SendTicketMessage = function (message) {
        var _this = this;
        if (message.attachments && message.attachments.length && !this.uploading) {
            this.uploading = true;
            var links = [];
            this._uploadingService.GenerateLinksForTickets(message.attachments.map(function (m) { return m.file; }), 0, links).subscribe(function (response) {
                var attachment = response;
                _this._ticketService.SendMessage({
                    senderType: 'Agent',
                    message: message.body,
                    from: message.from,
                    to: message.to,
                    cc: (message.cc) ? message.cc : [],
                    bcc: (message.bcc) ? message.bcc : [],
                    tid: [_this.selectedThread._id],
                    subject: message.subject,
                    attachment: attachment,
                    form: (message.form) ? message.form : '',
                    submittedForm: (message.submittedForm && message.submittedForm.length) ? message.submittedForm : [],
                    surveyAttached: (message.surveyAttached) ? true : false,
                    replytoAddress: message.to,
                    threadMessage: (message.threadMessage) ? message.threadMessage : undefined
                }).subscribe(function (response) {
                    _this.uploading = false;
                    if (response.status == 'ok') {
                        // console.log("completed");
                        _this.Clear();
                    }
                }, function (err) {
                    _this.uploading = false;
                });
            }, function (err) {
                // console.log(err);
                // this.uploading = false;
                // this.fileValid = false;
                // setTimeout(() => [
                // 	this.ShowAttachmentAreaDnd = false,
                // 	this.fileValid = true
                // ], 3000);
                // this.ClearFile();
            });
        }
        else {
            if (message.attachments && !message.attachments.length) {
                this.uploading = true;
                this._ticketService.SendMessage({
                    senderType: 'Agent',
                    message: message.body,
                    from: message.from,
                    to: message.to,
                    cc: (message.cc) ? message.cc : [],
                    bcc: (message.bcc) ? message.bcc : [],
                    tid: [this.selectedThread._id],
                    subject: message.subject,
                    attachment: [],
                    form: (message.form) ? message.form : '',
                    submittedForm: (message.submittedForm && message.submittedForm.length) ? message.submittedForm : [],
                    survey: (message.surveyAttached) ? true : false,
                    replytoAddress: message.to,
                    threadMessage: (message.threadMessage) ? message.threadMessage : undefined
                }).subscribe(function (response) {
                    _this.uploading = false;
                    if (response.status == 'ok')
                        _this.Clear();
                }, function (err) {
                    _this.uploading = false;
                });
            }
        }
        this.formRef = '';
    };
    TicketViewComponent.prototype.ClearFile = function () {
        this.file = undefined;
        this.files = [];
        this.fileInput.nativeElement.value = '';
    };
    TicketViewComponent.prototype.ngAfterViewInit = function () {
        // if (this.scrollContainer && this.scrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
        // 	// this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
        // 	// this.scrollContainer.nativeElement.scrollTop = this.scrollHeight;
        // }
    };
    TicketViewComponent.prototype.ngAfterViewChecked = function () {
    };
    TicketViewComponent.prototype.setSelectedThread = function (id) {
        this._ticketService.setSelectedThread(id);
    };
    TicketViewComponent.prototype.OpenViewHistory = function () {
        this.showViewHistory = true;
    };
    //state change work
    TicketViewComponent.prototype.changedStatus = function (status) {
        var _this = this;
        if (this.selectedThread.todo && this.selectedThread.todo) {
            if (this.selectedThread.todo.every(function (t) { return t.completed; }))
                this.confirm = true;
            else
                this.confirm = false;
            if (this.confirm) {
                this.subscriptions.push(this._ticketService.SetState([this.selectedThread._id], status.toUpperCase()).subscribe(function (status) {
                    if (status == 'ok') {
                    }
                }));
            }
            else {
                if (status == 'CLOSED' || status == 'SOLVED') {
                    this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                        panelClass: ['confirmation-dialog'],
                        data: { headermsg: 'Are you sure want to change the state?' }
                    }).afterClosed().subscribe(function (data) {
                        if (data == 'ok') {
                            // if (this.selectedStatus) {
                            _this.subscriptions.push(_this._ticketService.SetState([_this.selectedThread._id], status.toUpperCase()).subscribe(function (res) {
                                if (res == 'ok') {
                                }
                            }));
                        }
                        else {
                            return;
                        }
                    });
                }
                else {
                    this.subscriptions.push(this._ticketService.SetState([this.selectedThread._id], status.toUpperCase()).subscribe(function (res) {
                        if (res == 'ok') {
                        }
                    }));
                }
            }
        }
        else {
            this.subscriptions.push(this._ticketService.SetState([this.selectedThread._id], status.toUpperCase()).subscribe(function (res) {
                if (res == 'ok') {
                }
            }));
        }
    };
    //add/delete tag
    TicketViewComponent.prototype.addTags = function (tags) {
        this._ticketService.addTag([this.selectedThread._id], tags).subscribe(function (response) {
            if (response.status == 'ok') {
            }
        });
    };
    TicketViewComponent.prototype.deleteTag = function (tag) {
        // console.log(tag);
        this._ticketService.deleteTag(tag);
    };
    TicketViewComponent.prototype.onSearch = function (value) {
        var _this = this;
        // console.log('Search');
        // console.log(value);
        if (value) {
            var agents_3 = this.agentList_original.filter(function (a) { return a.email.includes(value.toLowerCase()); });
            this._utilityService.SearchAgent(value).subscribe(function (response) {
                //console.log(response);
                if (response && response.agentList.length) {
                    response.agentList.forEach(function (element) {
                        if (!agents_3.filter(function (a) { return a.email == element.email; }).length) {
                            agents_3.push(element);
                        }
                    });
                }
                _this.all_agents = agents_3;
            });
            // this.agentList = agents;
        }
        else {
            this.all_agents = this.agentList_original;
            // this.setScrollEvent();
        }
    };
    TicketViewComponent.prototype.Recieve = function () {
        this._ticketService.TestReply();
    };
    //snooze work
    TicketViewComponent.prototype.Snooze = function (time) {
        if (time && !isNaN(Date.parse(time)))
            this._ticketService.Snooze(new Date(time).toISOString());
    };
    TicketViewComponent.prototype.editTask = function (todo) {
        todo.editable = true;
    };
    TicketViewComponent.prototype.Cancel = function (todo) {
        todo.editable = false;
    };
    //note add/delete
    TicketViewComponent.prototype.SaveNote = function (note) {
        // console.log(note);
        this.loading = true;
        this._ticketService.editNote({ ticketNote: note }, [this.selectedThread._id])
            .subscribe(function (response) {
            if (response.status == 'ok') {
            }
        });
    };
    TicketViewComponent.prototype.DeleteNote = function (data) {
        this._ticketService.DeleteNote(data.id, data.note);
    };
    //task (todo) work
    TicketViewComponent.prototype.onEnter = function (task) {
        this._ticketService.addTask(task, [this.selectedThread._id]).subscribe(function (res) {
        });
    };
    TicketViewComponent.prototype.editedTask = function (todo) {
        this._ticketService.updateTask(todo.newTodo, todo.updateId);
    };
    TicketViewComponent.prototype.deleteTask = function (data) {
        this._ticketService.deleteTask(data.id, data.task);
    };
    TicketViewComponent.prototype.TaskDone = function (event) {
        this._ticketService.checkedTask(event.id, event.status, event.name);
    };
    //assign agent && group work
    // AssignAgentForTicket(agent) {
    // 	if (agent) {
    // 		if (this.selectedThread.merged) {
    // 			this.selectedThread.references.push(this.selectedThread._id);
    // 			this.dialog.open(ConfirmationDialogComponent, {
    // 				panelClass: ['confirmation-dialog'],
    // 				data: { headermsg: 'Are you sure want to assign agent to all merged tickets' }
    // 			}).afterClosed().subscribe(data => {
    // 				if (data == 'ok') {
    // 					this.subscriptions.push(this._ticketService.assignAgentForTicket(this.selectedThread.references, agent, this.selectedThread.assigned_to).subscribe(response => {
    // 						if (response == 'ok') {
    // 						}
    // 					}));
    // 				} else {
    // 					return;
    // 				}
    // 			});
    // 		} else {
    // 			this.subscriptions.push(this._ticketService.assignAgentForTicket([this.selectedThread._id], agent, this.selectedThread.assigned_to).subscribe(response => {
    // 				if (response == 'ok') {
    // 				}
    // 			}));
    // 		}
    // 	}
    // }
    TicketViewComponent.prototype.assignGroupTicket = function (group) {
        this._ticketService.updateGroup([this.selectedThread._id], group, this.selectedThread.group).subscribe(function (res) {
        });
    };
    TicketViewComponent.prototype.keydown = function (event) {
        switch (event.key.toLowerCase()) {
            case 'shift':
                {
                    this.shiftdown = true;
                    break;
                }
        }
    };
    TicketViewComponent.prototype.transformVisitorTicketHistory = function (visitor_ticket_history) {
        var ticketlist = [];
        var ticketlistsingular;
        ticketlist = visitor_ticket_history;
        if (ticketlist.length > 0) {
            ticketlist = ticketlist.reduce(function (previous, current) {
                if (!previous[new Date(current.datetime).toDateString()]) {
                    previous[new Date(current.datetime).toDateString()] = [current];
                }
                else {
                    previous[new Date(current.datetime).toDateString()].push(current);
                }
                return previous;
            }, {});
        }
        ticketlistsingular = Object.keys(ticketlist).map(function (key) {
            return { date: key, groupedticketList: ticketlist[key] };
        }).sort(function (a, b) {
            if (new Date(a.date) > new Date(b.date))
                return -1;
            else if (new Date(a.date) < new Date(b.date))
                return 1;
            else
                0;
        });
        ticketlistsingular.forEach(function (element) {
            element.groupedticketList.sort(function (a, b) {
                if (new Date(a.datetime) > new Date(b.datetime))
                    return -1;
                else if (new Date(a.datetime) < new Date(b.datetime))
                    return 1;
                else
                    0;
            });
        });
        return ticketlistsingular;
    };
    TicketViewComponent.prototype.GotoAR = function (ev) {
        if (ev) {
            this._globalStateService.NavigateForce('/settings/general/automated-responses');
        }
    };
    TicketViewComponent.prototype.AssignAgentForTicket = function (agent, assignment) {
        var _this = this;
        // this.selectedThread.references.push(this.selectedThread._id);
        if (agent) {
            if (this.selectedThread.merged) {
                this.selectedThread.references.push(this.selectedThread._id);
                this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                    panelClass: ['confirmation-dialog'],
                    data: { headermsg: 'Are you sure want to assign agent to all merged tickets' }
                }).afterClosed().subscribe(function (data) {
                    if (data == 'ok') {
                        _this.subscriptions.push(_this._ticketService.assignAgentForTicket(_this.selectedThread.references, agent, _this.selectedThread.assigned_to, assignment).subscribe(function (response) {
                            if (response.status == 'ok') {
                                _this.agentAssigned = true;
                                if (assignment != '') {
                                    _this.selectedThread.assigned_to = agent;
                                    var logfound_2 = false;
                                    _this.selectedThread.ticketlog = _this.selectedThread.ticketlog.map(function (log) {
                                        if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response.ticketlog);
                                            logfound_2 = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound_2) {
                                        _this.selectedThread.ticketlog.unshift({
                                            date: new Date(response.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response.ticketlog]
                                        });
                                    }
                                }
                            }
                        }));
                    }
                    else {
                        return;
                    }
                });
            }
            else {
                this.subscriptions.push(this._ticketService.assignAgentForTicket([this.selectedThread._id], agent, this.selectedThread.assigned_to, assignment).subscribe(function (response) {
                    if (response.status == 'ok') {
                        _this.agentAssigned = true;
                        if (assignment != '') {
                            _this.selectedThread.assigned_to = agent;
                            var logfound_3 = false;
                            _this.selectedThread.ticketlog = _this.selectedThread.ticketlog.map(function (log) {
                                if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response.ticketlog);
                                    logfound_3 = true;
                                }
                                return log;
                            });
                            if (!logfound_3) {
                                _this.selectedThread.ticketlog.unshift({
                                    date: new Date(response.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response.ticketlog]
                                });
                            }
                        }
                    }
                }));
            }
        }
    };
    TicketViewComponent.prototype.AssignGroupForTicket = function (selectedGroup) {
        this._ticketService.updateGroup(this.selectedThread._id, selectedGroup, this.selectedThread.group);
        if (selectedGroup) {
            //Then get the agents of that group
            //If more than one group selected then merge the two agentlists
            // this.getAgentsForGroup(selectedGroup)
            // this._ticketService.getAgentsAgainstGroup([selectedGroup]).subscribe(agents => {
            // 	this.all_agents = agents;
            // 	this.agentList_original = agents;
            // });
        }
        else {
            this.all_agents = this.agentList_original;
        }
    };
    TicketViewComponent.prototype.GetUrl = function () {
        return 'https://beelinks.solutions/agent/ticketFrame' + this.selectedThread.nsp + '/' + this.selectedThread._id;
    };
    TicketViewComponent.prototype.CheckIndex = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this._ticketService.ThreadList.getValue().map(function (thread, index) {
                if (thread._id == _this.selectedThread._id) {
                    if (index / ((_this.pageIndex + 1) * _this.paginationLimit) < 1 && _this.pageIndex > 0) {
                        _this._ticketService.setPagination(_this.pageIndex - 1);
                    }
                    else if (index / ((_this.pageIndex + 1) * _this.paginationLimit) >= 1) {
                        _this._ticketService.setPagination(_this.pageIndex + 1);
                    }
                    if (_this._ticketService.ThreadList.getValue()[index - 1])
                        _this.indexCheckPrevious = true;
                    else
                        _this.indexCheckPrevious = false;
                    if (_this._ticketService.ThreadList.getValue()[index + 1])
                        _this.indexCheckNext = true;
                    else {
                        _this.checkMoreTickets().subscribe(function (data) {
                            if (data)
                                _this.indexCheckNext = true;
                            else
                                _this.indexCheckNext = false;
                            observer.next(true);
                            observer.complete();
                        });
                    }
                }
            });
        });
    };
    TicketViewComponent.prototype.onScroll = function ($event) {
        var _this = this;
        if (!this.selectedGroup) {
            if (!this.ended) {
                this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(function (response) {
                    _this.all_agents = _this.all_agents.concat(response.agents);
                    _this.ended = response.ended;
                });
            }
        }
    };
    TicketViewComponent.prototype.GetTicket = function (value) {
        if (value == 'previous') {
            if (this.indexCheckPrevious)
                this.PreviousTicket();
        }
        else {
            if (this.indexCheckNext)
                this.NextTicket();
        }
    };
    TicketViewComponent.prototype.NextTicket = function () {
        var id = this._ticketService.getNextThreadId(this.selectedThread._id, 'next');
        // if (id) this._ticketService.setSelectedThread(id);
        if (id)
            this._globalStateService.NavigateForce('/tickets/ticket-view/' + id);
        else
            this.indexCheckNext = false;
    };
    TicketViewComponent.prototype.PreviousTicket = function () {
        var id = this._ticketService.getNextThreadId(this.selectedThread._id, 'previous');
        if (id)
            this._globalStateService.NavigateForce('/tickets/ticket-view/' + id);
        else
            this.indexCheckPrevious = false;
    };
    TicketViewComponent.prototype.checkMoreTickets = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var loadMore = false;
            _this._ticketService.ThreadList.getValue();
            if ((_this.pageIndex + 1) < _this.totalCount / _this.paginationLimit) {
                if (!_this._ticketService.ThreadList.getValue()[(_this.pageIndex * _this.paginationLimit) + _this.paginationLimit] && _this._ticketService.ThreadList.getValue().length < _this.totalCount)
                    loadMore = true;
                //this._ticketService.setPagination(this.pageIndex + 1);
            }
            if (loadMore) {
                _this.subscriptions.push(_this._ticketService.getMoreTicketFromBackend().subscribe(function (response) {
                    if (response.status == 'ok')
                        observer.next(true);
                    else
                        observer.next(false);
                    observer.complete();
                }));
            }
        });
    };
    TicketViewComponent.prototype.Demerge = function (demergeInfo) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want to Demerge this ticket, All agents assigned will remain same' }
        }).afterClosed().subscribe(function (data) {
            if (data && data == 'ok') {
                _this._ticketService.DemergeTicket(demergeInfo.selectedThreadId, demergeInfo.DemergeId).subscribe(function (response) {
                });
            }
            else {
                return;
            }
        });
    };
    TicketViewComponent.prototype.SelectedForm = function (form) {
        if (form) {
            this.formRef = {
                id: form._id,
                type: "cannedForm"
            };
            this.selectedForm = [form];
        }
    };
    TicketViewComponent.prototype.ScrollintoView = function (id) {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: "start" });
    };
    TicketViewComponent.prototype.GetDynamicFields = function () {
        if (this.fields && this.fields.length) {
            return this.fields.filter(function (field) { field.value = ''; return !field.default; });
        }
        else
            return [];
    };
    // savingCustomField = false;
    TicketViewComponent.prototype.SaveCustomField = function (event) {
        // this.savingCustomFields[fieldName] = true;
        // console.log(event.fieldName, event.fieldvalue);
        // this.selectedThread_copy.dynamicFields[fieldName] = fieldvalue;
        // console.log(this.selectedThread_copy[fieldName]);
        this._ticketService.UpdateDynamicProperty(event.threadID, event.fieldName, event.fieldvalue).subscribe(function (response) {
            // this.savingCustomFields[fieldName] = false;
            // if(response.status == 'ok'){
            // }
        });
    };
    TicketViewComponent.prototype.CheckAttachmentType = function (data) {
        return (typeof data === 'string');
    };
    // scenario execution work
    TicketViewComponent.prototype.ExecuteScenario = function (scenario) {
        var _this = this;
        this._ticketService.ExecuteScenario(scenario, [this.selectedThread._id], [this.selectedThread]).subscribe(function (res) {
            _this.scenarioPopper.hide();
        });
    };
    TicketViewComponent.prototype.RevertScenario = function () {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure want to revert scenario, events you perform in between will be lost!' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._ticketService.RevertScenario([_this.selectedThread._id]);
            }
            else {
                return;
            }
        });
    };
    TicketViewComponent.prototype.RegisterIconCustomer = function (details) {
        var _this = this;
        this.selectedThread.CustomerInfo = {};
        if (details.customerId) {
            this.selectedThread.RelatedCustomerInfo.map(function (res) {
                if (res.customerId == details.customerId) {
                    _this.selectedThread.CustomerInfo.customerId = res.customerId;
                    _this.selectedThread.CustomerInfo.customerName = res.customerName;
                    _this.selectedThread.CustomerInfo.customerRank = res.customerRank;
                    _this.selectedThread.CustomerInfo.customerCountry = res.customerCountry;
                    _this.selectedThread.CustomerInfo.customerType = res.customerType;
                    _this.selectedThread.CustomerInfo.salesPersonName = res.salesPersonName;
                    _this.selectedThread.CustomerInfo.salesPersonCode = res.salesPersonCode;
                    _this.selectedThread.CustomerInfo.salesPersonOffice = res.salesPersonOffice;
                    _this.selectedThread.CustomerInfo.customerEmail = res.customerEmail;
                    _this.selectedThread.CustomerInfo.customerPhone = res.customerPhone;
                    _this._ticketService.InsertCustomerInfo(_this.selectedThread._id, _this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.customerId ? _this.selectedThread.CustomerInfo : {}, _this.selectedThread.RelatedCustomerInfo && _this.selectedThread.RelatedCustomerInfo.length ? _this.selectedThread.RelatedCustomerInfo : []).subscribe(function (result) {
                        if (result.status == "ok") {
                            if (_this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.customerId) {
                                var logfound_4 = false;
                                _this.selectedThread.ticketlog = _this.selectedThread.ticketlog.map(function (log) {
                                    if (log.date == new Date(result.ticketlog.time_stamp).toDateString()) {
                                        log.groupedticketlogList.unshift(result.ticketlog);
                                        logfound_4 = true;
                                    }
                                    return log;
                                });
                                if (!logfound_4) {
                                    _this.selectedThread.ticketlog.unshift({
                                        date: new Date(result.ticketlog.time_stamp).toDateString(),
                                        groupedticketlogList: [result.ticketlog]
                                    });
                                }
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'ok',
                                        msg: 'Customer Found Successfully ' + _this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.customerId ? 'with ID: ' + _this.selectedThread.CustomerInfo.customerId : ''
                                    },
                                    duration: 3000,
                                    panelClass: ['user-alert', 'success']
                                });
                            }
                        }
                    });
                    setTimeout(function () {
                        if (_this.selectedThread.nsp == '/sbtjapan.com' || _this.selectedThread.nsp == '/sbtjapaninquiries.com') {
                            //DYNAMIC FIELD UPDATE
                            if (!_this.selectedThread.dynamicFields || !_this.selectedThread.dynamicFields['CM ID'] && (_this.selectedThread.sbtVisitor ? _this.selectedThread.sbtVisitor : _this.selectedThread.visitor.email).toLowerCase() == res.CustomerData[0].ContactMailAddressList[0].MailAddress.toLowerCase()) {
                                var fieldName = 'CM ID';
                                var fieldValue = res.CustomerData[0].BasicData[0].CustomerId;
                                _this._ticketService.UpdateDynamicProperty(_this.selectedThread._id, fieldName, fieldValue).subscribe(function (response) {
                                });
                            }
                            //AGENT ASSIGN
                            if ((_this.selectedThread.sbtVisitor ? _this.selectedThread.sbtVisitor : _this.selectedThread.visitor.email).toLowerCase() == res.CustomerData[0].ContactMailAddressList[0].MailAddress.toLowerCase()) {
                                if (res.CustomerData[0].SalesPersonData[0].UserName != 'FREE') {
                                    var assigned_to_2 = '';
                                    _this._iconIntSvc.GetMasterData(19).subscribe(function (res) {
                                        if (res) {
                                            _this.SalesEmpList = res.MasterData;
                                            _this.SalesEmpList.map(function (val) {
                                                if (val.EmployeeName == res.CustomerData[0].SalesPersonData[0].UserName) {
                                                    assigned_to_2 = val.EmailAddress;
                                                    _this.selectedThread.assigned_to = assigned_to_2;
                                                    _this.AssignAgentForTicket(assigned_to_2);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }, 3000);
                }
            });
        }
        else {
            this.loadingReg = true;
            this._ticketService.CustomerRegistration(details).subscribe(function (res) {
                if (res.response && res.response.ResultInformation.length && res.response.ResultInformation[0].ResultCode == "0") {
                    if (res.response.Customer && res.response.Customer.length && res.response.Customer[0].CustomerId) {
                        setTimeout(function () {
                            _this._ticketService.CheckCustomerRegistration('', '', res.response.Customer[0].CustomerId, _this.selectedThread._id).subscribe(function (result) {
                                if (result && result.ResultInformation &&
                                    result.ResultInformation.length &&
                                    result.ResultInformation[0].ResultCode == "0") {
                                    _this.selectedThread.CustomerInfo.customerId = result.CustomerData[0].BasicData[0].CustomerId;
                                    _this.selectedThread.CustomerInfo.customerName = result.CustomerData[0].BasicData[0].CustomerName;
                                    _this.selectedThread.CustomerInfo.customerRank = result.CustomerData[0].BasicData[0].CustomerRank;
                                    _this.selectedThread.CustomerInfo.customerCountry = result.CustomerData[0].BasicData[0].Country;
                                    _this.selectedThread.CustomerInfo.customerType = result.CustomerData[0].BasicData[0].customerType;
                                    _this.selectedThread.CustomerInfo.salesPersonName = result.CustomerData[0].SalesPersonData[0].UserName;
                                    _this.selectedThread.CustomerInfo.salesPersonCode = result.CustomerData[0].SalesPersonData[0].UserCode;
                                    _this.selectedThread.CustomerInfo.salesPersonOffice = result.CustomerData[0].SalesPersonData[0].Office;
                                    _this.selectedThread.CustomerInfo.customerEmail = _this.ParseEmailAddresses(result.CustomerData[0].ContactMailAddressList);
                                    _this.selectedThread.CustomerInfo.customerPhone = _this.ParsePhoneNumbers(result.CustomerData[0].ContactPhoneNumberList);
                                    _this._ticketService.InsertCustomerInfo(_this.selectedThread._id, _this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.customerId ? _this.selectedThread.CustomerInfo : {}, _this.selectedThread.RelatedCustomerInfo && _this.selectedThread.RelatedCustomerInfo.length ? _this.selectedThread.RelatedCustomerInfo : []).subscribe(function (value) {
                                        if (value.status == "ok") {
                                            if (_this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.customerId) {
                                                var logfound_5 = false;
                                                _this.selectedThread.ticketlog = _this.selectedThread.ticketlog.map(function (log) {
                                                    if (log.date == new Date(value.ticketlog.time_stamp).toDateString()) {
                                                        log.groupedticketlogList.unshift(value.ticketlog);
                                                        logfound_5 = true;
                                                    }
                                                    return log;
                                                });
                                                if (!logfound_5) {
                                                    _this.selectedThread.ticketlog.unshift({
                                                        date: new Date(value.ticketlog.time_stamp).toDateString(),
                                                        groupedticketlogList: [value.ticketlog]
                                                    });
                                                }
                                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                                    data: {
                                                        img: 'ok',
                                                        msg: 'Customer Found Successfully ' + _this.selectedThread.CustomerInfo && _this.selectedThread.CustomerInfo.customerId ? 'with ID: ' + _this.selectedThread.CustomerInfo.customerId : ''
                                                    },
                                                    duration: 3000,
                                                    panelClass: ['user-alert', 'success']
                                                });
                                            }
                                        }
                                    });
                                    setTimeout(function () {
                                        if (_this.selectedThread.nsp == '/sbtjapan.com' || _this.selectedThread.nsp == '/sbtjapaninquiries.com') {
                                            //DYNAMIC FIELD UPDATE
                                            if (!_this.selectedThread.dynamicFields || !_this.selectedThread.dynamicFields['CM ID'] && (_this.selectedThread.sbtVisitor ? _this.selectedThread.sbtVisitor : _this.selectedThread.visitor.email).toLowerCase() == result.CustomerData[0].ContactMailAddressList[0].MailAddress.toLowerCase()) {
                                                var fieldName = 'CM ID';
                                                var fieldValue = result.CustomerData[0].BasicData[0].CustomerId;
                                                _this._ticketService.UpdateDynamicProperty(_this.selectedThread._id, fieldName, fieldValue).subscribe(function (response) {
                                                });
                                            }
                                            //ASSIGN AGENT CHECK
                                            if ((_this.selectedThread.sbtVisitor ? _this.selectedThread.sbtVisitor : _this.selectedThread.visitor.email).toLowerCase() == result.CustomerData[0].ContactMailAddressList[0].MailAddress.toLowerCase()) {
                                                if (result.CustomerData[0].SalesPersonData[0].UserName != 'FREE') {
                                                    var assigned_to_3 = '';
                                                    _this._iconIntSvc.GetMasterData(19).subscribe(function (res) {
                                                        if (res) {
                                                            _this.SalesEmpList = res.MasterData;
                                                            _this.SalesEmpList.map(function (val) {
                                                                if (val.EmployeeName == result.CustomerData[0].SalesPersonData[0].UserName) {
                                                                    assigned_to_3 = val.EmailAddress;
                                                                    _this.selectedThread.assigned_to = assigned_to_3;
                                                                    _this.AssignAgentForTicket(assigned_to_3);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }, 3000);
                                }
                                else {
                                    _this.selectedThread.CustomerInfo = undefined;
                                    return;
                                }
                            });
                        }, 8000);
                    }
                    setTimeout(function () {
                        _this.loadingReg = false;
                    }, 10000);
                }
                else if (res.response && res.response.ResultInformation.length && (res.response.ResultInformation[0].ResultCode == "11" || res.response.ResultInformation[0].ResultCode == "12")) {
                    _this.loadingReg = false;
                    _this.selectedThread.CustomerInfo = undefined;
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in customer registration! ' + (res.response.ResultInformation.length ? 'The reason is: ' + res.response.ResultInformation[0].Message : '')
                        },
                        duration: 4000,
                        panelClass: ['user-alert', 'warning']
                    });
                    return;
                }
                else if (res.response && res.response.ResultInformation.length && (res.response.ResultInformation[0].ResultCode == "11" || res.response.ResultInformation[0].ResultCode == "9003")) {
                    _this.loadingReg = false;
                    _this.selectedThread.CustomerInfo = undefined;
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error! Only sales agent can register customer'
                        },
                        duration: 4000,
                        panelClass: ['user-alert', 'warning']
                    });
                    return;
                }
                else {
                    _this.loadingReg = false;
                    _this.selectedThread.CustomerInfo = undefined;
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in customer registration! Please try again later'
                        },
                        duration: 4000,
                        panelClass: ['user-alert', 'warning']
                    });
                    return;
                }
            });
        }
    };
    TicketViewComponent.prototype.SearchIconCustomer = function (data) {
        var _this = this;
        this.loadingIconSearch = true;
        this.searchedData = [];
        setTimeout(function () {
            _this._ticketService.CheckCustomerRegistration(data.emailAddress, data.phoneNumber, data.customerId, _this.selectedThread._id).subscribe(function (result) {
                if (result && result._id == _this.selectedThread._id) {
                    if (result && result.ResultInformation && result.ResultInformation.length && result.ResultInformation[0].ResultCode == "0") {
                        _this.matchedData = result.CustomerData[0];
                        var CustomersId_1 = [];
                        _this.matchedData.BasicData.map(function (x) {
                            CustomersId_1.push(x.CustomerId);
                        });
                        if (CustomersId_1 && CustomersId_1.length) {
                            var BasicData_1 = {};
                            var SalesData_1 = {};
                            var customerEmail_1 = [];
                            var customerPhone_1 = [];
                            CustomersId_1.forEach(function (val, index) {
                                _this.matchedData.BasicData.map(function (x) {
                                    if (x.CustomerId == CustomersId_1[index]) {
                                        BasicData_1['customerId'] = x.CustomerId;
                                        BasicData_1['customerName'] = x.CustomerName;
                                        BasicData_1['customerRank'] = x.CustomerRank;
                                        BasicData_1['customerType'] = x.CustomerType;
                                        BasicData_1['customerCountry'] = x.Country;
                                        BasicData_1['CustomerMainStatus'] = x.CustomerMainStatus;
                                        BasicData_1['CustomerSubStatus'] = x.CustomerSubStatus;
                                    }
                                });
                                _this.matchedData.SalesPersonData.map(function (x) {
                                    if (x.CustomerId == CustomersId_1[index]) {
                                        SalesData_1['salesPersonName'] = x.UserName;
                                        SalesData_1['salesPersonCode'] = x.UserCode;
                                        SalesData_1['salesPersonOffice'] = x.Office;
                                    }
                                });
                                _this.matchedData.ContactPhoneNumberList.map(function (x) {
                                    if (x.CustomerId == CustomersId_1[index]) {
                                        if (x.Default == "1")
                                            customerPhone_1.unshift(x.PhoneNumber);
                                        else
                                            customerPhone_1.push(x.PhoneNumber);
                                    }
                                });
                                _this.matchedData.ContactMailAddressList.map(function (x) {
                                    if (x.CustomerId == CustomersId_1[index]) {
                                        if (x.Default == "1")
                                            customerEmail_1.unshift(x.MailAddress);
                                        else
                                            customerEmail_1.push(x.MailAddress);
                                    }
                                });
                            });
                            var mergedData = __assign(__assign({}, BasicData_1), SalesData_1);
                            mergedData['customerEmail'] = customerEmail_1;
                            mergedData['customerPhone'] = customerPhone_1;
                            _this.searchedData.push(mergedData);
                        }
                        else {
                            _this.searchedData[0] = "empty";
                        }
                    }
                    else {
                        _this.searchedData[0] = "empty";
                    }
                }
            });
        }, 8000);
        setTimeout(function () {
            _this.loadingIconSearch = false;
        }, 10000);
    };
    TicketViewComponent.prototype.ParseEmailAddresses = function (emails) {
        var emailList = [];
        emails.map(function (val) {
            if (val.Default == "1") {
                emailList.unshift(val.MailAddress);
            }
            else {
                emailList.push(val.MailAddress);
            }
        });
        return emailList;
    };
    TicketViewComponent.prototype.ParsePhoneNumbers = function (numbers) {
        var phoneList = [];
        numbers.map(function (val) {
            if (val.Default == "1") {
                phoneList.unshift(val.PhoneNumber);
            }
            else {
                phoneList.push(val.PhoneNumber);
            }
        });
        return phoneList;
    };
    // ticket-view > watchers add/delete,close work
    TicketViewComponent.prototype.AddWatchers = function (event) {
        var _this = this;
        this.selectedwatchAgents = event;
        // console.log(this.selectedwatchAgents);
        this._ticketService.AddWatchersToTicket(this.selectedwatchAgents, [this.selectedThread._id]).subscribe(function (res) {
            if (res.status == "ok") {
                _this.selectedwatchAgents = [];
            }
        });
    };
    TicketViewComponent.prototype.gotoScenario = function () {
        this._globalStateService.NavigateForce('/settings/ticket-management/scenario-automation');
    };
    TicketViewComponent.prototype.deleteWatchers = function (agent) {
        this._ticketService.DeleteWatcherAgent(agent, this.selectedThread._id);
        if (this.permissions.canView == 'assignedOnly') {
            if (!this.selectedThread.assigned_to || (this.selectedThread.assigned_to && this.selectedThread.assigned_to != this.agent.email)) {
                this._ticketService.removeTicketAndRedirect(this.selectedThread._id);
            }
        }
    };
    TicketViewComponent.prototype.Close = function () {
        this.watcherPopper.hide();
    };
    //view history > ticket actions > assign agent work:
    TicketViewComponent.prototype.loadMoreAgents = function (agentsFromDB) {
        var _this = this;
        if (!this.ended && !this.loadingMoreAgents) {
            this.loadingMoreAgents = true;
            this._utilityService.getMoreAgentsObs(agentsFromDB).subscribe(function (response) {
                _this.all_agents = _this.all_agents.concat(response.agents);
                _this.ended = response.ended;
                _this.loadingMoreAgents = false;
            });
        }
    };
    TicketViewComponent.prototype.OnSearchFromDB = function (value) {
        var _this = this;
        // console.log('Search Agents');
        if (value) {
            var agents_4 = this.agentList_original.filter(function (a) { return a.email.includes(value.toLowerCase()); });
            this._utilityService.SearchAgent(value).subscribe(function (response) {
                if (response && response.agentList.length) {
                    response.agentList.forEach(function (element) {
                        if (!agents_4.filter(function (a) { return a.email == element.email; }).length) {
                            agents_4.push(element);
                        }
                    });
                }
                _this.all_agents = agents_4;
            });
        }
        else {
            this.all_agents = this.agentList_original;
        }
    };
    //ticket view > watchers work:
    TicketViewComponent.prototype.loadMoreWatchers = function (event) {
        var _this = this;
        if (!this.endedWatchers && !this.endedWatchers && !this.selectedwatchAgents.length) {
            //console.log('Fetch More');
            this.loadingMoreAgentsWatchers = true;
            this._utilityService.getMoreAgentsObs(this.watch_agents[this.watch_agents.length - 1].first_name).subscribe(function (response) {
                _this.watch_agents = _this.watch_agents.concat(response.agents);
                _this.endedWatchers = response.ended;
                _this.loadingMoreAgentsWatchers = false;
            });
        }
    };
    TicketViewComponent.prototype.onSearchWatchers = function (value) {
        var _this = this;
        // console.log('Search');
        if (value) {
            if (this.selectedwatchAgents && !this.selectedwatchAgents.length) {
                var agents_5 = this.watch_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    //console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_5.filter(function (a) { return a.email == element.email; }).length) {
                                agents_5.push(element);
                            }
                        });
                    }
                    _this.watch_agents = agents_5;
                });
            }
            else {
                var agents = this.watch_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.watch_agents = agents;
            }
            // this.agentList = agents;
        }
        else {
            this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
                _this.watch_agents = agents;
                // this.watch_agents = this.agentList_original;
            });
            this.endedWatchers = false;
            // this.setScrollEvent();
        }
    };
    TicketViewComponent.prototype.ClosePopper = function () {
        this.watcherPopper.hide();
        this.watch_agents = this.agentList_original;
    };
    //#endregion
    TicketViewComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        // console.log('Ticket View Destroyer')
        this._ticketService.setSelectedThread(undefined);
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], TicketViewComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.ViewChild('tasks')
    ], TicketViewComponent.prototype, "AddTask", void 0);
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], TicketViewComponent.prototype, "scrollContainer", void 0);
    __decorate([
        core_1.ViewChild('scenarioPopper')
    ], TicketViewComponent.prototype, "scenarioPopper", void 0);
    __decorate([
        core_1.ViewChild('watcherPopper')
    ], TicketViewComponent.prototype, "watcherPopper", void 0);
    TicketViewComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-view',
            templateUrl: './ticket-view.component.html',
            styleUrls: ['./ticket-view.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketViewComponent);
    return TicketViewComponent;
}());
exports.TicketViewComponent = TicketViewComponent;
//# sourceMappingURL=ticket-view.component.js.map