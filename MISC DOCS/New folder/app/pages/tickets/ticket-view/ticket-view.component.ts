import { SLAPoliciesService } from './../../../../services/LocalServices/SLAPoliciesService';
import { TicketTemplateSevice } from './../../../../services/LocalServices/TicketTemplateService';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ViewChildren, QueryList, ChangeDetectionStrategy } from '@angular/core';
import { TicketsService } from '../../../../services/TicketsService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../services/AuthenticationService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../../dialogs/SnackBar-Dialog/toast-notifications.component'
import { UploadingService } from '../../../../services/UtilityServices/UploadingService';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TicketAutomationService } from '../../../../services/LocalServices/TicketAutomationService';
import { FormDesignerService } from '../../../../services/LocalServices/FormDesignerService';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { ActivatedRoute } from '@angular/router';
import { TicketSecnarioAutomationService } from '../../../../services/LocalServices/TicketSecnarioAutomationService';
import { SurveyService } from '../../../../services/LocalServices/SurveyService';
import { PopperContent } from 'ngx-popper';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';
import { TagService } from '../../../../services/TagService';
import { IconIntegrationService } from '../../../../services/IconIntegrationService';

//line 245->mergedticketids changed to primary ref.

@Component({
	selector: 'app-ticket-view',
	templateUrl: './ticket-view.component.html',
	styleUrls: ['./ticket-view.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TicketViewComponent implements OnInit {

	@ViewChild('fileInput') fileInput: ElementRef;
	@ViewChild('tasks') AddTask: ElementRef;
	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	@ViewChild('scenarioPopper') scenarioPopper: PopperContent
	@ViewChild('watcherPopper') watcherPopper: PopperContent

	shiftdown = false;
	confirm = false;
	formtoggle = false;
	showError = false;
	loadingReg = false;
	loadingIconSearch = false;
	agentAssigned = false;
	clearSerchForm = false;
	selectedThreadArray = [];
	sbtAgents = [];
	scenarios = [];
	scrollTop: number = 10;
	loading = false;
	selectedThread: any = undefined;
	matchedData = undefined;
	subscriptions: Subscription[] = [];
	searchedData = [];
	selectedGroup = '';
	indexCheckPrevious = false;
	indexCheckNext = false;
	formRef: any;
	selectedForm: Array<any> = [];
	scrollHeight = 0;
	autoscroll: boolean;
	showVisitorHistorySwitch: boolean = false;
	verified = true;
	checkedList: any = [];
	visitor_ticket_history: any;
	files = [];
	filenames = [];
	isDragged: boolean;
	ShowAttachmentAreaDnd = false;
	executed = false;
	loadingMoreAgents = false;
	file: any = undefined;
	actSurvey = [];
	fileValid = true;
	uploading = false;
	message: any
	mergedTicket_details = [];
	value = '';
	all_agents = [];
	watch_agents = [];
	selectedwatchAgents = [];
	agentList_original = [];
	all_groups: any = [];
	tagList = [];
	Forms: any;
	private currentRoute = '';
	SalesEmpList = [];
	agentName = '';
	totalCount: number;
	public paginationLimit = 50;
	pageIndex: number;
	permissions: any;
	fields: any;
	ended = false;
	endedWatchers = false;
	loadingMoreAgentsWatchers = false;
	searchInput = new Subject();
	automatedResponses = [];
	allActivatedPolicies = [];
	private msg = {
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

	forceSelected = '';
	messageDetails = {
		to: '',
		from: '',
		cc: '',
		bcc: ''
	};
	threadMessage: any;
	showViewHistory = true;
	agent: any;
	survey: any;
	// savingCustomFields = {

	// };
	// selectedThread_copy: any;

	constructor(
		private _ticketService: TicketsService,
		private _authService: AuthService,
		private _globalStateService: GlobalStateService,
		private _utilityService: UtilityService,
		private _router: ActivatedRoute,
		private snackBar: MatSnackBar,
		public dialog: MatDialog,
		private _tagService: TagService,
		private _ticketScenarios: TicketSecnarioAutomationService,
		private _uploadingService: UploadingService,
		private _ticketAutomationService: TicketAutomationService,
		private _formDesignerService: FormDesignerService,
		private _ticketTemplateService: TicketTemplateSevice,
		private _slaPolicySvc: SLAPoliciesService,
		private _surveyService: SurveyService,
		private _iconIntSvc: IconIntegrationService
	) {
		this.subscriptions.push(this._globalStateService.resizeEvent.subscribe(data => {

			this.showViewHistory = data;
		}));

		this.subscriptions.push(this._surveyService.getActivatedSurvey().subscribe(data => {
			this.survey = data.survey;

		}));

		this.subscriptions.push(_authService.getAgent().subscribe(data => {
			this.agent = data;
			this._iconIntSvc.GetMasterData(19).subscribe(res => {
				if (res) {
					this.SalesEmpList = res.MasterData;
					this.SalesEmpList.map(val => {
						if (val.EmailAddress == this.agent.email) {
							this.agentName = val.EmployeeName;
						}
					});

				}
			})
		}));

		this.subscriptions.push(this._ticketScenarios.AllScenarios.subscribe(data => {
			if (data && data.length) {
				let agents = [];
				data.map(res => {
					if (res.availableFor == "allagents") {
						this.scenarios.push(res)
					}
					else if (res.availableFor == this.agent.email) {
						this.scenarios.push(res);
					}
					else {
						//see for agent in group from groups defined in groupNames..
						let filteredagent = this.all_groups.filter(g => res.groupName.includes(g.group_name)).map(g => g.agent_list);

						filteredagent.map(g => {
							g.map(agent => {
								if (agent.email == this.agent.email) {
									agents.push(agent.email);
								}
							});
						});
						if (agents && agents.length) {
							this.scenarios.push(res);
						}
					}

				})
			}

		}));

		this.subscriptions.push(this._router.params.subscribe(params => {
			if (params.id) {
				this.forceSelected = params.id;
				if (this.forceSelected) {
					// console.log('Force Selected: ' + this.forceSelected);

					this.setSelectedThread(this.forceSelected)
				}
			}
		}));

		this.subscriptions.push(_authService.getSettings().subscribe(data => {

			if (data && data.permissions) {
				this.permissions = data.permissions.tickets;

			}

			if (data) {
				this.fields = data.schemas.ticket.fields.filter(field => { field.value = ''; return !field.default })

			}

		}));

		this.subscriptions.push(this._tagService.Tags.subscribe(data => {
			if (data && data.length) this.tagList = data;

		}));


		this.subscriptions.push(this._ticketService.Initialized.subscribe(value => {
			if (value) {

				this.subscriptions.push(_ticketService.TicketCount.subscribe(data => {
					if (data) {
						let temp = 0;
						data.map(val => temp += val.count);
						this.totalCount = temp;
					}
				}));

				this.subscriptions.push(this._formDesignerService.WholeForm.subscribe(data => {
					if (!data.length) {
						this.Forms = [];
					}
					else {
						this.Forms = data;
					}
				}));

				this.subscriptions.push(this._ticketService.getPagination().subscribe(pagination => {
					this.pageIndex = pagination;
				}));

				this.subscriptions.push(_globalStateService.currentRoute.subscribe(route => {
					this.currentRoute = route;
					if (!this._ticketService.isTicketViewLoaded.getValue() && this.currentRoute == '/tickets') this._ticketService.isTicketViewLoaded.next(true);
					// else this.BackToList();

				}));

				this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(groups => {

					this.all_groups = groups;
				}));

				this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
					if (settings) this.verified = settings.verified;
				}));



				this.subscriptions.push(_ticketService.getNotification().subscribe(notification => {
					if (notification) {

						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: notification.img,
								msg: notification.msg
							},
							duration: 3000,
							panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
						}).afterDismissed().subscribe(() => {
							_ticketService.clearNotification();
						});

					}
				}));


			}
		}));
		this.subscriptions.push(this._slaPolicySvc.AllInternalSLAPolicies.subscribe(data => {
			if (data && data.length) {

				data.map(policy => {
					if (policy.activated) {
						this.allActivatedPolicies.push(policy);
					}
				});
			}

		}));
		this.subscriptions.push(_ticketService.getSelectedThread().subscribe(selectedThread => {

			if (selectedThread && Object.keys(selectedThread).length) {
				this.selectedThread = selectedThread;
				//console.log(this.selectedThread);
				// console.log('Ticket Selected!');

				this.selectedThread.ticketNotes = this.selectedThread.ticketNotes && this.selectedThread.ticketNotes.length ? this.sortTicketNotes(this.selectedThread.ticketNotes) : [];
				if (this.selectedThread && this.selectedThread.group) {
					this._utilityService.getAgentsAgainstGroup([this.selectedThread.group]).subscribe(agents => {

						this.all_agents = agents;
						this.agentList_original = agents;
					});
				} else {
					this._utilityService.getAllAgentsListObs().subscribe(agents => {
						this.all_agents = agents;
						this.agentList_original = agents;
					});
				}

				/**
				 * CASES:
				 * 1. If user is not registered in icon
				 * 2. If user is registered in chats section but ticket not updated.
				 * 3. If user is not registered by chats section and registered in tickets but not have related info.
				 */
				if ((this.selectedThread.nsp == '/sbtjapan.com' || this.selectedThread.nsp == '/sbtjapaninquiries.com')) {

				//IF STATE OPEN-> WILL CHECK ON VIEW EVERY TIME
				if (this.selectedThread.state == 'OPEN') {

					if ((this.selectedThread.sbtVisitor || this.selectedThread.source == 'livechat' || this.selectedThread.source == 'email' || this.selectedThread.visitor.phone)) {
						console.log("Checking Registration...");
						let splitted = this.selectedThread.subject.split('/');
						let useCase = '';
						let emailCheck = '';
						if (splitted[0].includes('cmid')) {
							let minorCase = splitted[0].split(":");
							useCase = minorCase[minorCase.length - 1].toString();
						}
						this._ticketService.CheckCustomerRegistration(this.selectedThread.sbtVisitor ? this.selectedThread.sbtVisitor.toLowerCase() : this.selectedThread.visitor.email.toLowerCase(),
							this.selectedThread.sbtVisitorPhone ? this.selectedThread.sbtVisitorPhone : this.selectedThread.visitor.phone ? this.selectedThread.visitor.phone : '',
							(splitted && splitted.length && splitted[2]) ? splitted[2].trim() : this.selectedThread.dynamicFields && Object.keys(this.selectedThread.dynamicFields).length && this.selectedThread.dynamicFields['CM ID'] ? this.selectedThread.dynamicFields['CM ID'] : useCase != '' ? useCase : '',
							this.selectedThread._id).subscribe(result => {

								if (result && result.ResultInformation && result.ResultInformation.length && result.ResultInformation[0].ResultCode == "0") {
									console.log("Record Found");
									this.matchedData = result.CustomerData[0];
									this.matchedData.ContactMailAddressList.map(res=>{
										if(res.Default == "1"){
											emailCheck = res.MailAddress;
										}
									})
									if (!this.selectedThread.sbtVisitor && (this.selectedThread.visitor.email == 'support@bizzchats.com' || this.selectedThread.visitor.email == 'no-reply@sbtjapan.com' || this.selectedThread.visitor.email == 'noreply@sbtjapan.com' || this.selectedThread.visitor.email.includes('@tickets.livechatinc.com'))) {
										this.selectedThread.sbtVisitor = this.matchedData.ContactMailAddressList[0].MailAddress;
									}
									//CUSTOMER INFO CHECK
									if ((!this.selectedThread.CustomerInfo || (this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.salesPersonName != result.CustomerData[0].SalesPersonData[0].UserName))) {
										console.log("Customer Info not Found!");

										this.selectedThread.CustomerInfo = {};
										this.selectedThread.RelatedCustomerInfo = [];
										let restOfCustomerBasicData = [];
										let restOfCustomerEmails = [];
										let restOfCustomerPhone = [];
										let restOfCustomerSalesPerson = [];
										let restOfCustomersId = [];
										/**Emails exact match */
										this.matchedData.ContactMailAddressList.map(email => {
											if (email.MailAddress.toLowerCase() == (this.selectedThread.sbtVisitor ? this.selectedThread.sbtVisitor : this.selectedThread.visitor.email).toLowerCase()) {
												this.selectedThread.CustomerInfo['customerId'] = email.CustomerId;
											}
										});
										/**Basic data match/related */
										this.matchedData.BasicData.map(x => {
											if (x.CustomerId == this.selectedThread.CustomerInfo['customerId']) {
												this.selectedThread.CustomerInfo['customerId'] = x.CustomerId
												this.selectedThread.CustomerInfo['customerName'] = x.CustomerName
												this.selectedThread.CustomerInfo['customerRank'] = x.CustomerRank
												this.selectedThread.CustomerInfo['customerCountry'] = x.Country
												this.selectedThread.CustomerInfo['customerType'] = x.CustomerType


											}
											if (x.CustomerId != this.selectedThread.CustomerInfo['customerId']) {
												restOfCustomersId.push(x.CustomerId);
												restOfCustomerBasicData.push(x)
											}
										});

										/**ContactPhoneNumberList match/related */
										this.matchedData.ContactPhoneNumberList.map(x => {
											if (x.CustomerId == this.selectedThread.CustomerInfo['customerId']) {
												this.selectedThread.CustomerInfo['customerPhone'] = [];
												if (x.Default == "1") this.selectedThread.CustomerInfo['customerPhone'].unshift(x.PhoneNumber)
												else this.selectedThread.CustomerInfo['customerPhone'].push(x.PhoneNumber)
											}
											if (x.CustomerId != this.selectedThread.CustomerInfo['customerId']) restOfCustomerPhone.push(x)
										})
										/**ContactMailAddressList match/related */
										this.matchedData.ContactMailAddressList.map(x => {
											if (x.CustomerId == this.selectedThread.CustomerInfo['customerId']) {
												this.selectedThread.CustomerInfo['customerEmail'] = [];

												if (x.Default == "1") this.selectedThread.CustomerInfo['customerEmail'].unshift(x.MailAddress)
												else this.selectedThread.CustomerInfo['customerEmail'].push(x.MailAddress)
											}
											if (x.CustomerId != this.selectedThread.CustomerInfo['customerId']) restOfCustomerEmails.push(x)
										})

										/**SalesPersonData match/related */
										this.matchedData.SalesPersonData.map(x => {
											if (x.CustomerId == this.selectedThread.CustomerInfo['customerId']) {

												this.selectedThread.CustomerInfo['salesPersonName'] = x.UserName
												this.selectedThread.CustomerInfo['salesPersonCode'] = x.UserCode
												this.selectedThread.CustomerInfo['salesPersonOffice'] = x.Office
											}
											if (x.CustomerId != this.selectedThread.CustomerInfo['customerId']) restOfCustomerSalesPerson.push(x)

										})

										/**Dealing with rest related data */
										if (restOfCustomersId && restOfCustomersId.length) {
											let restBasicData = {};
											let restSalesData = {};
											let contactEmail = [];
											let contactPhone = [];
											restOfCustomersId.forEach((val, index) => {
												restOfCustomerBasicData.map(x => {
													if (x.CustomerId == restOfCustomersId[index]) {
														restBasicData['customerId'] = x.CustomerId;
														restBasicData['customerName'] = x.CustomerName;
														restBasicData['customerRank'] = x.CustomerRank;
														restBasicData['customerType'] = x.CustomerType;
														restBasicData['customerCountry'] = x.Country;
													}
												});
												restOfCustomerSalesPerson.map(x => {
													if (x.CustomerId == restOfCustomersId[index]) {
														restSalesData['salesPersonName'] = x.UserName;
														restSalesData['salesPersonCode'] = x.UserCode;
														restSalesData['salesPersonOffice'] = x.Office;
													}
												});
												restOfCustomerPhone.map(x => {
													if (x.CustomerId == restOfCustomersId[index]) {
														if (x.Default == "1") contactPhone.unshift(x.PhoneNumber);
														else contactPhone.push(x.PhoneNumber);
													}
												});
												restOfCustomerEmails.map(x => {
													if (x.CustomerId == restOfCustomersId[index]) {
														if (x.Default == "1") contactEmail.unshift(x.MailAddress);
														else contactEmail.push(x.MailAddress);
													}
												});
											});
											let similarData = { ...restBasicData, ...restSalesData }
											similarData['customerEmail'] = contactEmail;
											similarData['customerPhone'] = contactPhone
											this.selectedThread.RelatedCustomerInfo.push(similarData);
										}
										this._ticketService.InsertCustomerInfo(this.selectedThread._id, this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId ? this.selectedThread.CustomerInfo : {}, this.selectedThread.RelatedCustomerInfo && this.selectedThread.RelatedCustomerInfo.length ? this.selectedThread.RelatedCustomerInfo : [], 'iconAssigned').subscribe(val => {
											if (val.status == "ok") {
												// if (splitted && splitted.length && splitted[3]) {
												// 	splitted[3] = this.selectedThread.CustomerInfo.salesPersonName;
												// 	this.selectedThread.subject.split('/')[3] = splitted[3];
												// 	this.selectedThread.subject.split('/')[2] = this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId ? this.selectedThread.CustomerInfo.customerId : this.selectedThread.subject.split('/')[2];
												// 	matter = this.selectedThread.subject;
												// }
												// this.selectedThread.subject = matter;
												this.selectedThread.CustomerInfo = val.res.CustomerInfo;
												this.selectedThread.RelatedCustomerInfo = val.res.RelatedCustomerInfo;
												if (this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId) {
													let logfound = false;
													this.selectedThread.ticketlog = this.selectedThread.ticketlog.map(log => {
														if (log.date == new Date(val.ticketlog.time_stamp).toDateString()) {

															log.groupedticketlogList.unshift(val.ticketlog);
															logfound = true;
														}
														return log;
													});
													if (!logfound) {
														this.selectedThread.ticketlog.unshift({
															date: new Date(val.ticketlog.time_stamp).toDateString(),
															groupedticketlogList: [val.ticketlog]
														})
													}
													this.snackBar.openFromComponent(ToastNotifications, {
														data: {
															img: 'ok',
															msg: 'Customer Found Successfully ' + (this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId ? 'with ID: ' + this.selectedThread.CustomerInfo.customerId : '')
														},
														duration: 3000,
														panelClass: ['user-alert', 'success']
													});
												}
											}

										});
									}
									//ASSIGN AGENT CHECK
									if (!this.agentAssigned) {
										if ((this.selectedThread.sbtVisitor ? this.selectedThread.sbtVisitor : this.selectedThread.visitor.email).toLowerCase() == emailCheck.toLowerCase()) {
											this.agentAssigned = true;
											if (result.CustomerData[0].SalesPersonData[0].UserName != 'FREE') {
												console.log("Not free");

												let assigned_to = '';
												this._iconIntSvc.GetMasterData(19).subscribe(res => {
													if (res) {
														this.SalesEmpList = res.MasterData;
														this.SalesEmpList.map(val => {
															if (val.EmployeeName == result.CustomerData[0].SalesPersonData[0].UserName) {
																assigned_to = val.EmailAddress;
																this._ticketService.getAgentByEmail(assigned_to, this.selectedThread.nsp).subscribe(agent => {
																	console.log(agent);
																	
																	if (agent && agent.length) {
																		
																		if (assigned_to != this.selectedThread.assigned_to) {
																			this.AssignAgentForTicket(assigned_to, 'iconAssigned');
																			this.selectedThread.assigned_to = assigned_to;
																		}
																	}
																});
															}
														});

													}
												})
											}
										}
									}
									//DYNAMIC FIELD CHECK
									if ((!this.selectedThread.dynamicFields || !this.selectedThread.dynamicFields['CM ID']) && ((this.selectedThread.sbtVisitor ? this.selectedThread.sbtVisitor : this.selectedThread.visitor.email).toLowerCase() == emailCheck.toLowerCase())) {

										let fieldName = 'CM ID';
										let fieldValue = result.CustomerData[0].BasicData[0].CustomerId;

										this._ticketService.UpdateDynamicProperty(this.selectedThread._id, fieldName, fieldValue, 'iconRegistered').subscribe(response => {

											if (!this.selectedThread.dynamicFields) this.selectedThread.dynamicFields = {};
											this.selectedThread.dynamicFields[fieldName] = fieldValue;

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

				if (this.selectedThread && this.selectedThread.watchers && this.selectedThread.watchers.length) {
					this.subscriptions.push(this._ticketService.getAgentAgainstWatchers(this.selectedThread.watchers).subscribe(agents => {
						this.watch_agents = agents;
					}));
				}
				else {
					this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agent => {
						this.watch_agents = agent;
					}));
				}

				if (this.selectedThread.historyBy) {
					this.subscriptions.push(_ticketService.getTicketHistoryByEmail(this.selectedThread.historyBy).subscribe(threads => {
						if (threads) {
							this.visitor_ticket_history = this.transformVisitorTicketHistory(threads);
						}
					}));
				} else {
					this.subscriptions.push(_ticketService.getTicketHistory(this.selectedThread.visitor.email).subscribe(threads => {
						if (threads) {
							this.visitor_ticket_history = this.transformVisitorTicketHistory(threads);
						}
					}));
				}
				this.CheckIndex().subscribe();
				this.selectedThreadArray.push(this.selectedThread);

				this.showVisitorHistorySwitch = false;

				if (!this.selectedThread.synced) {
					// this._ticketService.getTask(this.selectedThread._id);
					if (this.selectedThread.merged && this.selectedThread.mergedTicketIds.length) {
						//this is when merge ids are appended with selected thread.-->for merged ticket work.
						this._ticketService.getMessagesForMergedTicket(this.selectedThread.mergedTicketIds).subscribe(data => {
							if (data.length > 0) {
								data = data.reduce((previous, current) => {
									if (!previous[new Date(current.datetime).toDateString()]) {
										previous[new Date(current.datetime).toDateString()] = [current];
									} else {
										previous[new Date(current.datetime).toDateString()].push(current);
									}
									return previous;
								}, {});
							}


							this.selectedThread.messages = Object.keys(data).map(key => {
								return { date: key, groupedMessagesList: data[key] }
							}).sort((a, b) => {
								//sorts in most recent chat.
								if (new Date(a.date) < new Date(b.date)) return -1;
								else if (new Date(a.date) > new Date(b.date)) return 1;
								else 0;
							});
							this.selectedThread.synced = true;
						});

					} else {
						this._ticketService.getMessages(this.selectedThread._id).subscribe(data => {
							if (data) {
								if (data.length > 0) {
									data = data.reduce((previous, current) => {
										if (!previous[new Date(current.datetime).toDateString()]) {
											previous[new Date(current.datetime).toDateString()] = [current];
										} else {
											previous[new Date(current.datetime).toDateString()].push(current);
										}
										return previous;
									}, {});
								}

								this.selectedThread.messages = Object.keys(data).map(key => {
									return { date: key, groupedMessagesList: data[key] }
								}).sort((a, b) => {
									//sorts in most recent chat.
									if (new Date(a.date) < new Date(b.date)) return -1;
									else if (new Date(a.date) > new Date(b.date)) return 1;
									else 0;

								});
								this.selectedThread.synced = true;
							} else {
								this.selectedThread.messages = [];
								this.selectedThread.synced = true;
							}
						});
					}
				}

				if (!this.selectedThread.viewState || this.selectedThread.viewState == 'UNREAD') {
					this._ticketService.updateViewState('READ', [this.selectedThread._id]).subscribe(response => {
					})
				}
				this.autoscroll = true;

				if (this.selectedThread.group && this.permissions.canView != 'team') {
					this._ticketService.getAgentsAgainstGroup([this.selectedThread.group]).subscribe(agents => {
						this.all_agents = agents;
						this.agentList_original = agents;
					});
				} else {
					this._utilityService.getAllAgentsListObs().subscribe(agents => {
						this.all_agents = agents;
						this.agentList_original = agents;
					});
				}

				setTimeout(() => {
					if (this.selectedThread && this.selectedThread.messages && this.selectedThread.messages.length) {
						let lastGroupedMessage = this.selectedThread.messages[this.selectedThread.messages.length - 1].groupedMessagesList;
						let recentMessageId = lastGroupedMessage[lastGroupedMessage.length - 1]._id;
						let elem = document.getElementById(recentMessageId);
						if (elem) (elem as HTMLElement).parentElement.parentElement.scrollIntoView({ behavior: 'smooth', block: "start" });
					}
				}, 0);

			} else {
				this.selectedThread = undefined;
			}

		}));

		this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(groups => {

			this.all_groups = groups;
		}));

		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings) this.verified = settings.verified;
		}));

		this.subscriptions.push(this._ticketTemplateService.getAutomatedResponseAgainstAgent().subscribe(data => {
			if (data.status == "ok") {
				this.automatedResponses = data.AutomatedResponses;
			}
		}));

		this.subscriptions.push(_ticketService.getNotification().subscribe(notification => {
			if (notification) {

				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: notification.img,
						msg: notification.msg
					},
					duration: 3000,
					panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
				}).afterDismissed().subscribe(() => {
					_ticketService.clearNotification();
				});

			}
		}));

		this.subscriptions.push(this._globalStateService.shortcutEvents.subscribe(data => {
			if (this.selectedThread) {
				this.GetTicket(data)
			}

		}));

		this.searchInput.debounceTime(500)
			.distinctUntilChanged()
			.switchMap((term) => {
				return new Observable((observer) => {
					if (term) {
						if (!this.selectedGroup) {
							let agents = this.agentList_original.filter(a => a.email.includes((term as string).toLowerCase() || a.first_name.toLowerCase().includes((term as string).toLowerCase())));
							this._utilityService.SearchAgent(term).subscribe((response) => {
								if (response && response.agentList.length) {
									response.agentList.forEach(element => {
										if (!agents.filter(a => a.email == element.email).length) {
											agents.push(element);
										}
									});
								}
								this.all_agents = agents;
							});
						} else {
							let agents = this.agentList_original.filter(a => a.includes((term as string).toLowerCase()));
							this.all_agents = agents;
							this.watch_agents = agents;
						}
						// if (this.permissions.canView == 'all') {

						// } else {
						// 	let agents = this.agentList_original.filter(a => a.includes((term as string).toLowerCase()));
						// 	this.all_agents = agents;
						// }
						// this.agentList = agents;
					} else {
						this.all_agents = this.agentList_original;
						this.watch_agents = this.agentList_original;
					}
				})
			}).subscribe();
	}


	populateInfo(to, from, cc, bcc) {
		// console.log(to, from, cc ,bcc);
		this.messageDetails.to = (to) ? to : '';
		this.messageDetails.from = (from) ? from : '';
		this.messageDetails.cc = (cc) ? cc.join() : '';
		this.messageDetails.bcc = (bcc) ? bcc.join() : '';

	}


	Reply(subject, from, to, tid, message) {
		// console.log('Replying');
		// console.log('subject', subject);
		// console.log('to', to);
		// console.log('tid', tid);
		let threadMessage = {
			type: 'reply',
			data: {
				from: message.from,
				date: message.datetime,
				subject: subject,
				to: message.to,
				body: message.message,
				attachment: message.attachment
			}
		}
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
		}
		setTimeout(() => {
			if (!Array.isArray(tid)) tid = [tid];
			this.msg = {
				subject: subject,
				to: to,
				from: from,
				tid: tid,
				body: '',
				attachment: [],
				type: 'reply',
				cc: [],
				bcc: []
			}
			this.threadMessage = threadMessage;
		}, 0);



		setTimeout(() => {
			let elem = document.getElementById('ticketMsg');
			if (elem) (elem as HTMLElement).scrollIntoView({ behavior: 'smooth', block: "start" });
		}, 0);


	}

	sortTicketNotes(notes): any {
		let ticketnotes = [];
		ticketnotes = notes;
		ticketnotes.sort((a, b) => {
			if (new Date(a.added_at) > new Date(b.added_at)) return -1;
			else if (new Date(a.added_at) < new Date(b.added_at)) return 1;
			else 0;
		});
		return ticketnotes;
	}

	ReplyAll(subject, from, to, cc, bcc, tid, message) {
		let threadMessage = {
			type: 'reply-all',
			data: {
				from: message.from,
				date: message.datetime,
				subject: subject,
				to: message.to,
				body: message.message,
				attachment: message.attachment
			}
		}
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
		}
		setTimeout(() => {
			if (!Array.isArray(tid)) tid = [tid];
			this.msg = {
				subject: subject,
				to: to,
				from: from,
				tid: tid,
				body: '',
				attachment: [],
				type: 'reply-all',
				cc: (cc) ? cc : [],
				bcc: (bcc) ? bcc : []
			}
			this.threadMessage = threadMessage;
		}, 0);



		setTimeout(() => {
			let elem = document.getElementById('ticketMsg');
			if (elem) (elem as HTMLElement).scrollIntoView({ behavior: 'smooth', block: "start" });
		}, 0);


	}


	seeCMID() {
		let res = this.selectedThread.subject.split('/');
		if (res && res.length) {

			if (res[4] && res[4].trim() == 'Beelinks' && this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId) {

				if (res[2] && res[2].toString().trim() == this.selectedThread.CustomerInfo.customerId.toString().trim()) {
					return false
				}
				else return true
			}
		}
		else return false
	}

	Forward(subject, from, tid, message) {

		let threadMessage = {
			type: 'forward',
			data: {
				from: message.from,
				date: message.datetime,
				subject: subject,
				to: message.to,
				body: message.message,
				attachment: message.attachment
			}
		}
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
		}
		setTimeout(() => {
			if (!Array.isArray(tid)) tid = [tid];

			this.msg = {
				subject: subject,
				to: '',
				tid: tid,
				body: '',
				attachment: [],
				type: 'fwd',
				from: from,
				cc: [],
				bcc: []
			}
			this.threadMessage = threadMessage;

		}, 0);

		setTimeout(() => {
			let elem = document.getElementById('ticketMsg');
			if (elem) (elem as HTMLElement).scrollIntoView({ behavior: 'smooth', block: "start" });
		}, 0);
	}

	Clear() {
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
			}
		}

	}

	ngOnInit() {

	}

	ToggleForm() {
		this.formtoggle = !this.formtoggle;
	}


	//send message
	// Multiple file attachment
	SendTicketMessage(message: any) {
		if (message.attachments && message.attachments.length && !this.uploading) {
			this.uploading = true;
			let links = [];
			this._uploadingService.GenerateLinksForTickets(message.attachments.map(m => m.file), 0, links).subscribe(response => {
				let attachment = response;

				this._ticketService.SendMessage({
					senderType: 'Agent',
					message: message.body,
					from: message.from,
					to: message.to,
					cc: (message.cc) ? message.cc : [],
					bcc: (message.bcc) ? message.bcc : [],
					tid: [this.selectedThread._id],
					subject: message.subject,
					attachment: attachment,
					form: (message.form) ? message.form : '',
					submittedForm: (message.submittedForm && message.submittedForm.length) ? message.submittedForm : [],
					surveyAttached: (message.surveyAttached) ? true : false,
					replytoAddress: message.to,
					threadMessage: (message.threadMessage) ? message.threadMessage : undefined
				}).subscribe(response => {
					this.uploading = false;
					if (response.status == 'ok') {
						// console.log("completed");

						this.Clear();
					}
				}, err => {
					this.uploading = false;
				});
			}, err => {
				// console.log(err);

				// this.uploading = false;
				// this.fileValid = false;
				// setTimeout(() => [
				// 	this.ShowAttachmentAreaDnd = false,
				// 	this.fileValid = true
				// ], 3000);
				// this.ClearFile();

			});

		} else {

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
				}).subscribe(response => {
					this.uploading = false;
					if (response.status == 'ok') this.Clear();
				}, err => {
					this.uploading = false;
				});
			}
		}
		this.formRef = '';
	}

	public ClearFile() {
		this.file = undefined;
		this.files = [];
		this.fileInput.nativeElement.value = '';
	}

	ngAfterViewInit(): void {
		// if (this.scrollContainer && this.scrollContainer.nativeElement.scrollHeight != this.scrollHeight) {

		// 	// this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
		// 	// this.scrollContainer.nativeElement.scrollTop = this.scrollHeight;

		// }

	}

	ngAfterViewChecked() {

	}
	setSelectedThread(id: string) {
		this._ticketService.setSelectedThread(id);
	}

	public OpenViewHistory() {
		this.showViewHistory = true;
	}

	//state change work
	changedStatus(status) {
		if (this.selectedThread.todo && this.selectedThread.todo) {
			if (this.selectedThread.todo.every(t => t.completed)) this.confirm = true;
			else this.confirm = false;
			if (this.confirm) {
				this.subscriptions.push(this._ticketService.SetState([this.selectedThread._id], status.toUpperCase()).subscribe(status => {
					if (status == 'ok') {

					}
				}));
			}
			else {
				if (status == 'CLOSED' || status == 'SOLVED') {
					this.dialog.open(ConfirmationDialogComponent, {
						panelClass: ['confirmation-dialog'],
						data: { headermsg: 'Are you sure want to change the state?' }
					}).afterClosed().subscribe(data => {
						if (data == 'ok') {
							// if (this.selectedStatus) {
							this.subscriptions.push(this._ticketService.SetState([this.selectedThread._id], status.toUpperCase()).subscribe(res => {
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
					this.subscriptions.push(this._ticketService.SetState([this.selectedThread._id], status.toUpperCase()).subscribe(res => {
						if (res == 'ok') {

						}
					}));
				}
			}
		}
		else {
			this.subscriptions.push(this._ticketService.SetState([this.selectedThread._id], status.toUpperCase()).subscribe(res => {
				if (res == 'ok') {

				}
			}));
		}

	}

	//add/delete tag
	addTags(tags) {
		this._ticketService.addTag([this.selectedThread._id], tags).subscribe(response => {
			if (response.status == 'ok') {
			}
		})
	}

	deleteTag(tag) {
		// console.log(tag);

		this._ticketService.deleteTag(tag);
	}


	onSearch(value) {
		// console.log('Search');
		// console.log(value);
		if (value) {
			let agents = this.agentList_original.filter(a => a.email.includes((value as string).toLowerCase()));
			this._utilityService.SearchAgent(value).subscribe((response) => {
				//console.log(response);
				if (response && response.agentList.length) {
					response.agentList.forEach(element => {
						if (!agents.filter(a => a.email == element.email).length) {
							agents.push(element);
						}
					});
				}
				this.all_agents = agents;
			});

			// this.agentList = agents;
		} else {
			this.all_agents = this.agentList_original;
			// this.setScrollEvent();
		}
	}

	Recieve() {
		this._ticketService.TestReply();
	}

	//snooze work
	Snooze(time) {
		if (time && !isNaN(Date.parse(time))) this._ticketService.Snooze(new Date(time).toISOString());
	}

	editTask(todo) {
		todo.editable = true;
	}

	Cancel(todo) {
		todo.editable = false;
	}

	//note add/delete
	SaveNote(note) {
		// console.log(note);

		this.loading = true;
		this._ticketService.editNote({ ticketNote: note }, [this.selectedThread._id])
			.subscribe((response) => {
				if (response.status == 'ok') {
				}
			});
	}

	DeleteNote(data) {
		this._ticketService.DeleteNote(data.id, data.note);
	}

	//task (todo) work
	onEnter(task: string) {
		this._ticketService.addTask(task, [this.selectedThread._id]).subscribe(res => {
		});
	}
	editedTask(todo) {
		this._ticketService.updateTask(todo.newTodo, todo.updateId)
	}
	deleteTask(data) {
		this._ticketService.deleteTask(data.id, data.task);
	}
	TaskDone(event) {
		this._ticketService.checkedTask(event.id, event.status, event.name);
	}

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

	assignGroupTicket(group) {
		this._ticketService.updateGroup([this.selectedThread._id], group, this.selectedThread.group).subscribe(res => {
		});
	}

	keydown(event: KeyboardEvent) {
		switch (event.key.toLowerCase()) {

			case 'shift':
				{
					this.shiftdown = true;
					break;
				}
		}
	}


	transformVisitorTicketHistory(visitor_ticket_history: Array<any>): Array<any> {
		let ticketlist = [];
		let ticketlistsingular: any;
		ticketlist = visitor_ticket_history;
		if (ticketlist.length > 0) {
			ticketlist = ticketlist.reduce((previous, current) => {
				if (!previous[new Date(current.datetime).toDateString()]) {
					previous[new Date(current.datetime).toDateString()] = [current];
				} else {
					previous[new Date(current.datetime).toDateString()].push(current);
				}

				return previous;
			}, {});
		}

		ticketlistsingular = Object.keys(ticketlist).map(key => {
			return { date: key, groupedticketList: ticketlist[key] }
		}).sort((a, b) => {

			if (new Date(a.date) > new Date(b.date)) return -1;
			else if (new Date(a.date) < new Date(b.date)) return 1;
			else 0;
		});

		ticketlistsingular.forEach(element => {
			element.groupedticketList.sort((a, b) => {
				if (new Date(a.datetime) > new Date(b.datetime)) return -1;
				else if (new Date(a.datetime) < new Date(b.datetime)) return 1;
				else 0;
			})
		});
		return ticketlistsingular;
	}

	GotoAR(ev) {
		if (ev) {
			this._globalStateService.NavigateForce('/settings/general/automated-responses');
		}
	}

	AssignAgentForTicket(agent, assignment?: string) {
		// this.selectedThread.references.push(this.selectedThread._id);
		if (agent) {
			if (this.selectedThread.merged) {
				this.selectedThread.references.push(this.selectedThread._id);
				this.dialog.open(ConfirmationDialogComponent, {
					panelClass: ['confirmation-dialog'],
					data: { headermsg: 'Are you sure want to assign agent to all merged tickets' }
				}).afterClosed().subscribe(data => {
					if (data == 'ok') {
						this.subscriptions.push(this._ticketService.assignAgentForTicket(this.selectedThread.references, agent, this.selectedThread.assigned_to, assignment).subscribe(response => {
							if (response.status == 'ok') {

								this.agentAssigned = true;
								if (assignment != '') {
									this.selectedThread.assigned_to = agent;
									let logfound = false;
									this.selectedThread.ticketlog = this.selectedThread.ticketlog.map(log => {
										if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

											log.groupedticketlogList.unshift(response.ticketlog);
											logfound = true;
										}
										return log;
									});
									if (!logfound) {
										this.selectedThread.ticketlog.unshift({
											date: new Date(response.ticketlog.time_stamp).toDateString(),
											groupedticketlogList: [response.ticketlog]
										})
									}
								}
							}
						}));
					} else {
						return;
					}
				});
			} else {
				this.subscriptions.push(this._ticketService.assignAgentForTicket([this.selectedThread._id], agent, this.selectedThread.assigned_to, assignment).subscribe(response => {
					if (response.status == 'ok') {
						this.agentAssigned = true;
						if (assignment != '') {
							this.selectedThread.assigned_to = agent;

							let logfound = false;
							this.selectedThread.ticketlog = this.selectedThread.ticketlog.map(log => {
								if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

									log.groupedticketlogList.unshift(response.ticketlog);
									logfound = true;
								}
								return log;
							});
							if (!logfound) {
								this.selectedThread.ticketlog.unshift({
									date: new Date(response.ticketlog.time_stamp).toDateString(),
									groupedticketlogList: [response.ticketlog]
								})
							}
						}
					}
				}));
			}
		}
	}
	AssignGroupForTicket(selectedGroup) {
		this._ticketService.updateGroup(this.selectedThread._id, selectedGroup, this.selectedThread.group);
		if (selectedGroup) {
			//Then get the agents of that group
			//If more than one group selected then merge the two agentlists
			// this.getAgentsForGroup(selectedGroup)
			// this._ticketService.getAgentsAgainstGroup([selectedGroup]).subscribe(agents => {
			// 	this.all_agents = agents;
			// 	this.agentList_original = agents;
			// });
		} else {
			this.all_agents = this.agentList_original;
		}
	}



	public GetUrl(): string {
		return 'https://beelinks.solutions/agent/ticketFrame' + this.selectedThread.nsp + '/' + this.selectedThread._id;
	}

	CheckIndex(): Observable<any> {
		return new Observable(observer => {
			this._ticketService.ThreadList.getValue().map((thread, index) => {
				if (thread._id == this.selectedThread._id) {



					if (index / ((this.pageIndex + 1) * this.paginationLimit) < 1 && this.pageIndex > 0) {

						this._ticketService.setPagination(this.pageIndex - 1);

					}


					else if (index / ((this.pageIndex + 1) * this.paginationLimit) >= 1) {
						this._ticketService.setPagination(this.pageIndex + 1);
					}


					if (this._ticketService.ThreadList.getValue()[index - 1]) this.indexCheckPrevious = true
					else this.indexCheckPrevious = false

					if (this._ticketService.ThreadList.getValue()[index + 1]) this.indexCheckNext = true
					else {
						this.checkMoreTickets().subscribe(data => {

							if (data) this.indexCheckNext = true
							else this.indexCheckNext = false
							observer.next(true)
							observer.complete()

						});
					}
				}
			});
		})
	}

	onScroll($event) {

		if (!this.selectedGroup) {
			if (!this.ended) {

				this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(response => {

					this.all_agents = this.all_agents.concat(response.agents);
					this.ended = response.ended;
				});
			}
		}
	}

	GetTicket(value) {
		if (value == 'previous') {
			if (this.indexCheckPrevious) this.PreviousTicket()
		}
		else {
			if (this.indexCheckNext) this.NextTicket()
		}
	}

	NextTicket() {
		let id = this._ticketService.getNextThreadId(this.selectedThread._id, 'next');
		// if (id) this._ticketService.setSelectedThread(id);

		if (id) this._globalStateService.NavigateForce('/tickets/ticket-view/' + id);
		else this.indexCheckNext = false

	}

	PreviousTicket() {
		let id = this._ticketService.getNextThreadId(this.selectedThread._id, 'previous');
		if (id) this._globalStateService.NavigateForce('/tickets/ticket-view/' + id);
		else this.indexCheckPrevious = false;

	}
	checkMoreTickets(): Observable<any> {
		return new Observable(observer => {
			let loadMore = false
			this._ticketService.ThreadList.getValue()
			if ((this.pageIndex + 1) < this.totalCount / this.paginationLimit) {
				if (!this._ticketService.ThreadList.getValue()[(this.pageIndex * this.paginationLimit) + this.paginationLimit] && this._ticketService.ThreadList.getValue().length < this.totalCount) loadMore = true;
				//this._ticketService.setPagination(this.pageIndex + 1);
			}
			if (loadMore) {
				this.subscriptions.push(this._ticketService.getMoreTicketFromBackend().subscribe(response => {

					if (response.status == 'ok') observer.next(true)
					else observer.next(false)
					observer.complete();
				}));
			}

		})

	}

	Demerge(demergeInfo) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want to Demerge this ticket, All agents assigned will remain same' }
		}).afterClosed().subscribe(data => {
			if (data && data == 'ok') {
				this._ticketService.DemergeTicket(demergeInfo.selectedThreadId, demergeInfo.DemergeId).subscribe(response => {

				});
			}
			else {
				return;
			}
		})
	}

	SelectedForm(form) {
		if (form) {
			this.formRef = {
				id: form._id,
				type: "cannedForm"
			}
			this.selectedForm = [form];

		}

	}


	ScrollintoView(id: string) {
		document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: "start" });

	}

	GetDynamicFields() {
		if (this.fields && this.fields.length) {
			return this.fields.filter(field => { field.value = ''; return !field.default })
		} else return [];
	}

	// savingCustomField = false;

	SaveCustomField(event) {
		// this.savingCustomFields[fieldName] = true;
		// console.log(event.fieldName, event.fieldvalue);

		// this.selectedThread_copy.dynamicFields[fieldName] = fieldvalue;
		// console.log(this.selectedThread_copy[fieldName]);

		this._ticketService.UpdateDynamicProperty(event.threadID, event.fieldName, event.fieldvalue).subscribe(response => {
			// this.savingCustomFields[fieldName] = false;
			// if(response.status == 'ok'){
			// }
		});

	}

	CheckAttachmentType(data) {

		return (typeof data === 'string');
	}

	// scenario execution work
	ExecuteScenario(scenario) {
		this._ticketService.ExecuteScenario(scenario, [this.selectedThread._id], [this.selectedThread]).subscribe(res => {
			this.scenarioPopper.hide();
		});
	}

	RevertScenario() {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure want to revert scenario, events you perform in between will be lost!' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._ticketService.RevertScenario([this.selectedThread._id]);

			}
			else {
				return;
			}
		});

	}

	RegisterIconCustomer(details) {
		this.selectedThread.CustomerInfo = {};
		if (details.customerId) {
			this.selectedThread.RelatedCustomerInfo.map(res => {
				if (res.customerId == details.customerId) {
					this.selectedThread.CustomerInfo.customerId = res.customerId;
					this.selectedThread.CustomerInfo.customerName = res.customerName;
					this.selectedThread.CustomerInfo.customerRank = res.customerRank;
					this.selectedThread.CustomerInfo.customerCountry = res.customerCountry;
					this.selectedThread.CustomerInfo.customerType = res.customerType;

					this.selectedThread.CustomerInfo.salesPersonName = res.salesPersonName;
					this.selectedThread.CustomerInfo.salesPersonCode = res.salesPersonCode;
					this.selectedThread.CustomerInfo.salesPersonOffice = res.salesPersonOffice;

					this.selectedThread.CustomerInfo.customerEmail = res.customerEmail;
					this.selectedThread.CustomerInfo.customerPhone = res.customerPhone;
					this._ticketService.InsertCustomerInfo(this.selectedThread._id, this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId ? this.selectedThread.CustomerInfo : {}, this.selectedThread.RelatedCustomerInfo && this.selectedThread.RelatedCustomerInfo.length ? this.selectedThread.RelatedCustomerInfo : []).subscribe(result => {
						if (result.status == "ok") {
							if (this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId) {
								let logfound = false;
								this.selectedThread.ticketlog = this.selectedThread.ticketlog.map(log => {
									if (log.date == new Date(result.ticketlog.time_stamp).toDateString()) {

										log.groupedticketlogList.unshift(result.ticketlog);
										logfound = true;
									}
									return log;
								});
								if (!logfound) {
									this.selectedThread.ticketlog.unshift({
										date: new Date(result.ticketlog.time_stamp).toDateString(),
										groupedticketlogList: [result.ticketlog]
									})
								}
								this.snackBar.openFromComponent(ToastNotifications, {
									data: {
										img: 'ok',
										msg: 'Customer Found Successfully ' + this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId ? 'with ID: ' + this.selectedThread.CustomerInfo.customerId : ''
									},
									duration: 3000,
									panelClass: ['user-alert', 'success']
								});
							}
						}
					});

					setTimeout(() => {

						if (this.selectedThread.nsp == '/sbtjapan.com' || this.selectedThread.nsp == '/sbtjapaninquiries.com') {

							//DYNAMIC FIELD UPDATE
							if (!this.selectedThread.dynamicFields || !this.selectedThread.dynamicFields['CM ID'] && (this.selectedThread.sbtVisitor ? this.selectedThread.sbtVisitor : this.selectedThread.visitor.email).toLowerCase() == res.CustomerData[0].ContactMailAddressList[0].MailAddress.toLowerCase()) {

								let fieldName = 'CM ID';
								let fieldValue = res.CustomerData[0].BasicData[0].CustomerId;
								this._ticketService.UpdateDynamicProperty(this.selectedThread._id, fieldName, fieldValue).subscribe(response => {

								});

							}
							//AGENT ASSIGN

							if ((this.selectedThread.sbtVisitor ? this.selectedThread.sbtVisitor : this.selectedThread.visitor.email).toLowerCase() == res.CustomerData[0].ContactMailAddressList[0].MailAddress.toLowerCase()) {
								if (res.CustomerData[0].SalesPersonData[0].UserName != 'FREE') {
									let assigned_to = '';
									this._iconIntSvc.GetMasterData(19).subscribe(res => {
										if (res) {
											this.SalesEmpList = res.MasterData;
											this.SalesEmpList.map(val => {
												if (val.EmployeeName == res.CustomerData[0].SalesPersonData[0].UserName) {
													assigned_to = val.EmailAddress;
													this.selectedThread.assigned_to = assigned_to;

													this.AssignAgentForTicket(assigned_to);


												}
											});

										}
									})

								}

							}

						}
					}, 3000);

				}
			});


		}
		else {
			this.loadingReg = true;
			this._ticketService.CustomerRegistration(details).subscribe(res => {
				if (res.response && res.response.ResultInformation.length && res.response.ResultInformation[0].ResultCode == "0") {

					if (res.response.Customer && res.response.Customer.length && res.response.Customer[0].CustomerId) {
						setTimeout(() => {
							this._ticketService.CheckCustomerRegistration('', '', res.response.Customer[0].CustomerId, this.selectedThread._id).subscribe(result => {

								if (result && result.ResultInformation &&
									result.ResultInformation.length &&
									result.ResultInformation[0].ResultCode == "0") {

									this.selectedThread.CustomerInfo.customerId = result.CustomerData[0].BasicData[0].CustomerId;

									this.selectedThread.CustomerInfo.customerName = result.CustomerData[0].BasicData[0].CustomerName;
									this.selectedThread.CustomerInfo.customerRank = result.CustomerData[0].BasicData[0].CustomerRank;
									this.selectedThread.CustomerInfo.customerCountry = result.CustomerData[0].BasicData[0].Country;
									this.selectedThread.CustomerInfo.customerType = result.CustomerData[0].BasicData[0].customerType;

									this.selectedThread.CustomerInfo.salesPersonName = result.CustomerData[0].SalesPersonData[0].UserName;
									this.selectedThread.CustomerInfo.salesPersonCode = result.CustomerData[0].SalesPersonData[0].UserCode;
									this.selectedThread.CustomerInfo.salesPersonOffice = result.CustomerData[0].SalesPersonData[0].Office;

									this.selectedThread.CustomerInfo.customerEmail = this.ParseEmailAddresses(result.CustomerData[0].ContactMailAddressList);
									this.selectedThread.CustomerInfo.customerPhone = this.ParsePhoneNumbers(result.CustomerData[0].ContactPhoneNumberList);
									this._ticketService.InsertCustomerInfo(this.selectedThread._id, this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId ? this.selectedThread.CustomerInfo : {}, this.selectedThread.RelatedCustomerInfo && this.selectedThread.RelatedCustomerInfo.length ? this.selectedThread.RelatedCustomerInfo : []).subscribe(value => {
										if (value.status == "ok") {
											if (this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId) {
												let logfound = false;
												this.selectedThread.ticketlog = this.selectedThread.ticketlog.map(log => {
													if (log.date == new Date(value.ticketlog.time_stamp).toDateString()) {

														log.groupedticketlogList.unshift(value.ticketlog);
														logfound = true;
													}
													return log;
												});
												if (!logfound) {
													this.selectedThread.ticketlog.unshift({
														date: new Date(value.ticketlog.time_stamp).toDateString(),
														groupedticketlogList: [value.ticketlog]
													})
												}
												this.snackBar.openFromComponent(ToastNotifications, {
													data: {
														img: 'ok',
														msg: 'Customer Found Successfully ' + this.selectedThread.CustomerInfo && this.selectedThread.CustomerInfo.customerId ? 'with ID: ' + this.selectedThread.CustomerInfo.customerId : ''
													},
													duration: 3000,
													panelClass: ['user-alert', 'success']
												});
											}
										}
									});
									setTimeout(() => {

										if (this.selectedThread.nsp == '/sbtjapan.com' || this.selectedThread.nsp == '/sbtjapaninquiries.com') {

											//DYNAMIC FIELD UPDATE
											if (!this.selectedThread.dynamicFields || !this.selectedThread.dynamicFields['CM ID'] && (this.selectedThread.sbtVisitor ? this.selectedThread.sbtVisitor : this.selectedThread.visitor.email).toLowerCase() == result.CustomerData[0].ContactMailAddressList[0].MailAddress.toLowerCase()) {

												let fieldName = 'CM ID';
												let fieldValue = result.CustomerData[0].BasicData[0].CustomerId;
												this._ticketService.UpdateDynamicProperty(this.selectedThread._id, fieldName, fieldValue).subscribe(response => {

												});
											}
											//ASSIGN AGENT CHECK

											if ((this.selectedThread.sbtVisitor ? this.selectedThread.sbtVisitor : this.selectedThread.visitor.email).toLowerCase() == result.CustomerData[0].ContactMailAddressList[0].MailAddress.toLowerCase()) {
												if (result.CustomerData[0].SalesPersonData[0].UserName != 'FREE') {
													let assigned_to = '';
													this._iconIntSvc.GetMasterData(19).subscribe(res => {
														if (res) {
															this.SalesEmpList = res.MasterData;
															this.SalesEmpList.map(val => {
																if (val.EmployeeName == result.CustomerData[0].SalesPersonData[0].UserName) {
																	assigned_to = val.EmailAddress;
																	this.selectedThread.assigned_to = assigned_to;
																	this.AssignAgentForTicket(assigned_to);

																}
															});

														}
													})

												}
											}

										}
									}, 3000);

								}

								else {
									this.selectedThread.CustomerInfo = undefined;
									return;
								}
							});
						}, 8000);
					}
					setTimeout(() => {

						this.loadingReg = false;
					}, 10000);
				}
				else if (res.response && res.response.ResultInformation.length && (res.response.ResultInformation[0].ResultCode == "11" || res.response.ResultInformation[0].ResultCode == "12")) {
					this.loadingReg = false;
					this.selectedThread.CustomerInfo = undefined;
					this.snackBar.openFromComponent(ToastNotifications, {
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
					this.loadingReg = false;
					this.selectedThread.CustomerInfo = undefined;
					this.snackBar.openFromComponent(ToastNotifications, {
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
					this.loadingReg = false;
					this.selectedThread.CustomerInfo = undefined;
					this.snackBar.openFromComponent(ToastNotifications, {
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

	}

	SearchIconCustomer(data) {
		this.loadingIconSearch = true;
		this.searchedData = [];
		setTimeout(() => {
			this._ticketService.CheckCustomerRegistration(data.emailAddress, data.phoneNumber, data.customerId, this.selectedThread._id).subscribe(result => {

				if (result && result._id == this.selectedThread._id) {
					if (result && result.ResultInformation && result.ResultInformation.length && result.ResultInformation[0].ResultCode == "0") {
						this.matchedData = result.CustomerData[0];
						let CustomersId = [];

						this.matchedData.BasicData.map(x => {
							CustomersId.push(x.CustomerId);
						});
						if (CustomersId && CustomersId.length) {
							let BasicData = {};
							let SalesData = {};
							let customerEmail = [];
							let customerPhone = [];
							CustomersId.forEach((val, index) => {
								this.matchedData.BasicData.map(x => {
									if (x.CustomerId == CustomersId[index]) {
										BasicData['customerId'] = x.CustomerId;
										BasicData['customerName'] = x.CustomerName;
										BasicData['customerRank'] = x.CustomerRank;
										BasicData['customerType'] = x.CustomerType;
										BasicData['customerCountry'] = x.Country;
										BasicData['CustomerMainStatus'] = x.CustomerMainStatus;
										BasicData['CustomerSubStatus'] = x.CustomerSubStatus;

									}
								});
								this.matchedData.SalesPersonData.map(x => {
									if (x.CustomerId == CustomersId[index]) {
										SalesData['salesPersonName'] = x.UserName;
										SalesData['salesPersonCode'] = x.UserCode;
										SalesData['salesPersonOffice'] = x.Office;
									}
								});
								this.matchedData.ContactPhoneNumberList.map(x => {
									if (x.CustomerId == CustomersId[index]) {
										if (x.Default == "1") customerPhone.unshift(x.PhoneNumber);
										else customerPhone.push(x.PhoneNumber);
									}
								});
								this.matchedData.ContactMailAddressList.map(x => {
									if (x.CustomerId == CustomersId[index]) {
										if (x.Default == "1") customerEmail.unshift(x.MailAddress);
										else customerEmail.push(x.MailAddress);
									}
								});
							});
							let mergedData = { ...BasicData, ...SalesData }
							mergedData['customerEmail'] = customerEmail;
							mergedData['customerPhone'] = customerPhone;
							this.searchedData.push(mergedData);

						}
						else {
							this.searchedData[0] = "empty";
						}
					}
					else {
						this.searchedData[0] = "empty";
					}
				}
			});
		}, 8000);


		setTimeout(() => {
			this.loadingIconSearch = false;
		}, 10000);
	}

	ParseEmailAddresses(emails) {
		let emailList = [];
		emails.map(val => {
			if (val.Default == "1") {
				emailList.unshift(val.MailAddress);
			}
			else {
				emailList.push(val.MailAddress);
			}
		})
		return emailList;
	}
	ParsePhoneNumbers(numbers) {
		let phoneList = [];
		numbers.map(val => {
			if (val.Default == "1") {
				phoneList.unshift(val.PhoneNumber);
			}
			else {
				phoneList.push(val.PhoneNumber);
			}
		})
		return phoneList;
	}
	// ticket-view > watchers add/delete,close work
	AddWatchers(event) {

		this.selectedwatchAgents = event;
		// console.log(this.selectedwatchAgents);
		this._ticketService.AddWatchersToTicket(this.selectedwatchAgents, [this.selectedThread._id]).subscribe(res => {
			if (res.status == "ok") {
				this.selectedwatchAgents = [];
			}

		});
	}
	gotoScenario() {
		this._globalStateService.NavigateForce('/settings/ticket-management/scenario-automation');
	}

	deleteWatchers(agent) {
		this._ticketService.DeleteWatcherAgent(agent, this.selectedThread._id);
		if (this.permissions.canView == 'assignedOnly') {
			if (!this.selectedThread.assigned_to || (this.selectedThread.assigned_to && this.selectedThread.assigned_to != this.agent.email)) {
				this._ticketService.removeTicketAndRedirect(this.selectedThread._id);
			}
		}
	}

	Close() {
		this.watcherPopper.hide()
	}

	//view history > ticket actions > assign agent work:
	loadMoreAgents(agentsFromDB) {
		if (!this.ended && !this.loadingMoreAgents) {
			this.loadingMoreAgents = true;
			this._utilityService.getMoreAgentsObs(agentsFromDB).subscribe(response => {
				this.all_agents = this.all_agents.concat(response.agents);
				this.ended = response.ended;
				this.loadingMoreAgents = false;
			});
		}
	}

	OnSearchFromDB(value) {
		// console.log('Search Agents');
		if (value) {
			let agents = this.agentList_original.filter(a => a.email.includes((value as string).toLowerCase()));
			this._utilityService.SearchAgent(value).subscribe((response) => {
				if (response && response.agentList.length) {
					response.agentList.forEach(element => {
						if (!agents.filter(a => a.email == element.email).length) {
							agents.push(element);
						}
					});
				}
				this.all_agents = agents;
			});
		} else {
			this.all_agents = this.agentList_original;
		}
	}

	//ticket view > watchers work:
	loadMoreWatchers(event) {
		if (!this.endedWatchers && !this.endedWatchers && !this.selectedwatchAgents.length) {
			//console.log('Fetch More');
			this.loadingMoreAgentsWatchers = true;
			this._utilityService.getMoreAgentsObs(this.watch_agents[this.watch_agents.length - 1].first_name).subscribe(response => {
				this.watch_agents = this.watch_agents.concat(response.agents);
				this.endedWatchers = response.ended;
				this.loadingMoreAgentsWatchers = false;
			});
		}
	}

	onSearchWatchers(value) {
		// console.log('Search');
		if (value) {
			if (this.selectedwatchAgents && !this.selectedwatchAgents.length) {
				let agents = this.watch_agents.filter(a => a.email.includes((value as string).toLowerCase()));
				this._utilityService.SearchAgent(value).subscribe((response) => {
					//console.log(response);
					if (response && response.agentList.length) {
						response.agentList.forEach(element => {
							if (!agents.filter(a => a.email == element.email).length) {
								agents.push(element);
							}
						});
					}
					this.watch_agents = agents;
				});
			} else {
				let agents = this.watch_agents.filter(a => a.email.includes((value as string).toLowerCase()));
				this.watch_agents = agents;
			}
			// this.agentList = agents;
		} else {
			this._utilityService.getAllAgentsListObs().subscribe(agents => {
				this.watch_agents = agents;
				// this.watch_agents = this.agentList_original;
			});
			this.endedWatchers = false;
			// this.setScrollEvent();
		}
	}

	ClosePopper() {
		this.watcherPopper.hide()
		this.watch_agents = this.agentList_original;
	}
	//#endregion

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		// console.log('Ticket View Destroyer')
		this._ticketService.setSelectedThread(undefined);
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}