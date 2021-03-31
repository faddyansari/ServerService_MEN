"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsComponent = void 0;
var core_1 = require("@angular/core");
var transfer_chat_dialog_component_1 = require("../../dialogs/transfer-chat-dialog/transfer-chat-dialog.component");
var call_dialog_component_1 = require("../../dialogs/call-dialog/call-dialog.component");
var Subject_1 = require("rxjs/Subject");
var forms_1 = require("@angular/forms");
var visitor_ban_time_component_1 = require("../../dialogs/visitor-ban-time/visitor-ban-time.component");
var toast_notifications_component_1 = require("../../dialogs/SnackBar-Dialog/toast-notifications.component");
var email_chat_transcript_component_1 = require("../../dialogs/email-chat-transcript/email-chat-transcript.component");
var confirmation_dialog_component_1 = require("../../dialogs/confirmation-dialog/confirmation-dialog.component");
var show_chat_info_dialog_component_1 = require("../../dialogs/show-chat-info-dialog/show-chat-info-dialog.component");
var Observable_1 = require("rxjs/Observable");
//import { RestService } from '../../../services/rest.service';
var RecordRTC = require('recordrtc');
var ChatsComponent = /** @class */ (function () {
    function ChatsComponent(_chatService, _visitorService, _authService, dialog, _appStateService, _uploadingService, _adminSettingsService, _callingService, formbuilder, snackBar, http
    //	private _restService: RestService
    ) {
        var _this = this;
        this._chatService = _chatService;
        this._visitorService = _visitorService;
        this._authService = _authService;
        this.dialog = dialog;
        this._appStateService = _appStateService;
        this._uploadingService = _uploadingService;
        this._adminSettingsService = _adminSettingsService;
        this._callingService = _callingService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this.http = http;
        //@Input() keyBoardEvent: Subject<any>;
        this.arrToDialog = [];
        this.nsp = '';
        this.checkBox = false;
        this.loadingReg = false;
        this.clearRegForm = false;
        this.production = true;
        this.subscriptions = [];
        this.verified = true;
        this.error = false;
        this.currentConversation = {};
        this.msgBody = '';
        this.agentName = '';
        this.count = 0;
        this.links = [];
        this.isDragged = false;
        this.showError = false;
        this.liveAgents = [];
        this.automatedMessagesList = [];
        this.countryList = [];
        this.countryName = '';
        this.filteredAutomatedMessages = [];
        this.ShowAttachmentAreaDnd = false;
        this.files = [];
        this.hashQuery = '';
        this.hashIndex = -1;
        this.shiftdown = false;
        this.ready = false;
        this.activeTab = 'INBOX';
        this.showVisitorHistorySwitch = false;
        this.addNewNumber = false;
        this.addNewEmail = false;
        this.checkBoxPhone = false;
        this.checkBoxEmail = false;
        this.feedback = [];
        this.uploading = false;
        this.showViewHistory = true;
        this.fileSharePermission = true;
        this.file = undefined;
        this.fileValid = true;
        this.browsingHistory = false;
        this.additionalData = false;
        this.stockList = false;
        this.fileUploadParams = {
            key: '',
            acl: '',
            success_action_status: '',
            policy: '',
            "x-amz-algorithm": '',
            "x-amz-credintials": '',
            "x-amz-date": '',
            "x-amz-signature": ''
        };
        this.seconds = 0;
        this.mins = 0;
        this.recordingStarted = false;
        this.isAudioSent = false;
        this.loading = false;
        this.EmojiWrapper = false;
        this.sbt = false;
        this.selectionDone = false;
        this.tabs = {
            "visitorHistory": true,
            "additionalData": false,
            "browsingHistory": false,
            "chatHistory": false,
            "convertChatToTicket": false,
            "emailTranscript": false,
            "stockList": true,
        };
        this.chatPermissions = {};
        this.updateDeliveryStatus = false;
        //typing
        this.CheckTypingState = new Subject_1.Subject();
        this.tempTypingState = false;
        this.subscription = [];
        //textArea AutoComplete
        this.formHashQuery = false;
        this.tempMsgBody = '';
        this.autoGrowSyncMsgBody = '';
        this.actionForm = '';
        //Chat History
        this.ifMoreChats = true;
        this.scrollHeight = 0;
        this.fetchingConversation = false;
        this.uploaded = false;
        //autoSize TextArea
        this.restrictAutoSize = true;
        this.hashQuerySelected = false;
        this.errorFile = [];
        this.drafts = [];
        this.tagList = [];
        this.uploadingCount = 0;
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.whiteSpace = /^\S*$/;
        this.numberRegex = /^([^0-9]*)$/;
        this.phoneNumberRegex = /^([+]{1})?\d+$/;
        // CharacterLimit = /^[0-9A-Za-z!@.,;:'"?-]{1,100}\z/;
        this.SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
        this.attachmentGallery = [];
        //MasterData
        this.country = [];
        this.customerID = [];
        this.phoneID = [];
        this.portID = [];
        this.gpp = [];
        this.carMakerID = [];
        this.carsName = [];
        this.carModel = [];
        this.carBodyID = [];
        this.carBodySubID = [];
        this.carFuelID = [];
        this.carColorID = [];
        this.purchaseCountryID = [];
        this.locationPortID = [];
        this.carBodyLengthID = [];
        this.carLoadingCapacityID = [];
        this.carTruckSizeID = [];
        this.carSortTypeID = [];
        this.countryID = [];
        this.employeeList = [];
        this.employeeId = '';
        this.autoCountry = '';
        this.autoPort = [];
        this.countryCode = '';
        this.salesAgent = [];
        this.emailList = [];
        this.phoneList = [];
        this.defaultEmail = '';
        this.defaultPhone = '';
        this.autoMake = '';
        this.autoCar = '';
        this.ccList = [
            {
                "ItemCode": "660",
                "ItemName": "660cc"
            },
            {
                "ItemCode": "1000",
                "ItemName": "1000cc"
            },
            {
                "ItemCode": "1500",
                "ItemName": "1500cc"
            },
            {
                "ItemCode": "1800",
                "ItemName": "1800cc"
            },
            {
                "ItemCode": "2000",
                "ItemName": "2000cc"
            },
            {
                "ItemCode": "2500",
                "ItemName": "2500cc"
            },
            {
                "ItemCode": "4000",
                "ItemName": "4000cc"
            },
        ];
        this.mileage = [
            {
                "ItemCode": "10000",
                "ItemName": "10000km"
            },
            {
                "ItemCode": "30000",
                "ItemName": "30000km"
            },
            {
                "ItemCode": "50000",
                "ItemName": "50000km"
            },
            {
                "ItemCode": "80000",
                "ItemName": "80000km"
            },
            {
                "ItemCode": "100000",
                "ItemName": "100000km"
            },
            {
                "ItemCode": "150000",
                "ItemName": "150000km"
            },
            {
                "ItemCode": "200000",
                "ItemName": "200000km"
            },
            {
                "ItemCode": "300000",
                "ItemName": "300000km"
            },
            {
                "ItemCode": "400000",
                "ItemName": "400000km"
            },
            {
                "ItemCode": "500000",
                "ItemName": "500000km"
            },
        ];
        this.registrationYear = [1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987,
            1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2004, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
        this.registrationMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        this.priceRangeFrom = [
            {
                "ItemCode": "1",
                "ItemName": "1¥"
            },
            {
                "ItemCode": "100001",
                "ItemName": "100001¥"
            },
            {
                "ItemCode": "200001",
                "ItemName": "200001¥"
            },
            {
                "ItemCode": "500001",
                "ItemName": "500001¥"
            },
            {
                "ItemCode": "1000001",
                "ItemName": "1000001¥"
            },
            {
                "ItemCode": "2000001",
                "ItemName": "2000001¥"
            },
            {
                "ItemCode": "3000001",
                "ItemName": "3000001¥"
            },
            {
                "ItemCode": "4000001",
                "ItemName": "4000001¥"
            },
            {
                "ItemCode": "5000001",
                "ItemName": "5000001¥"
            },
            {
                "ItemCode": "6000001",
                "ItemName": "6000001¥"
            },
            {
                "ItemCode": "7000001",
                "ItemName": "7000001¥"
            },
            {
                "ItemCode": "8000001",
                "ItemName": "8000001¥"
            },
            {
                "ItemCode": "9000001",
                "ItemName": "9000001¥"
            },
        ];
        this.priceRangeTo = [
            {
                "ItemCode": "100",
                "ItemName": "100¥"
            },
            {
                "ItemCode": "100000",
                "ItemName": "100000¥"
            },
            {
                "ItemCode": "200000",
                "ItemName": "200000¥"
            },
            {
                "ItemCode": "500000",
                "ItemName": "500000¥"
            },
            {
                "ItemCode": "1000000",
                "ItemName": "1000000¥"
            },
            {
                "ItemCode": "2000000",
                "ItemName": "2000000¥"
            },
            {
                "ItemCode": "3000000",
                "ItemName": "3000000¥"
            },
            {
                "ItemCode": "4000000",
                "ItemName": "4000000¥"
            },
            {
                "ItemCode": "5000000",
                "ItemName": "5000000¥"
            },
            {
                "ItemCode": "6000000",
                "ItemName": "6000000¥"
            },
            {
                "ItemCode": "7000000",
                "ItemName": "7000000¥"
            },
            {
                "ItemCode": "8000000",
                "ItemName": "8000000¥"
            },
            {
                "ItemCode": "9000000",
                "ItemName": "9000000¥"
            },
            {
                "ItemCode": "10000000",
                "ItemName": "10000000¥"
            },
        ];
        this.package = {};
        this.savingCustomFields = {};
        this.autoComplete = true;
        this.caretPosition = -1;
        this.tagForm = formbuilder.group({
            'hashTag': [
                null,
                [
                    forms_1.Validators.maxLength(20),
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/)
                ],
            ]
        });
        this.addTicketForm = formbuilder.group({
            'subject': [(this.currentConversation.clientID) ? (this.currentConversation.clientID || this.currentConversation._id) + ' ' : null, [forms_1.Validators.required]],
            'state': ['OPEN', forms_1.Validators.required],
            'priority': ['LOW', forms_1.Validators.required],
            'visitor': formbuilder.group({
                'name': [(this.currentConversation && this.currentConversation.visitorName) ? this.currentConversation.visitorName : null, [forms_1.Validators.required]],
                'phone': [(this.currentConversation && this.currentConversation.session && this.currentConversation.session.phone) ? this.currentConversation.session.phone : null],
                'email': [(this.currentConversation && this.currentConversation.visitorEmail && this.currentConversation.visitorEmail != 'Unregistered') ? this.currentConversation.visitorEmail : null,
                    [
                        forms_1.Validators.pattern(this.emailPattern),
                        forms_1.Validators.required
                    ]
                ],
            })
        });
        // this.registerCustomerForm = this.formbuilder.group({
        // 	'customerName': [(this.currentConversation && this.currentConversation.visitorName) ? this.currentConversation.visitorName : null, [Validators.required]],
        // 	'firstName': [(this.currentConversation && this.currentConversation.visitorName) ? this.currentConversation.visitorName : null],
        // 	'lastName': [null],
        // 	'destCountryCode': [null, [Validators.required]],
        // 	'arrivalPortId': [null, [Validators.required]],
        // 	'customerTypeId': [null, [Validators.required]],
        // 	'salePersonUserCode': [null, [Validators.required]],
        // 	'contactPhoneTypeId': [null, [Validators.required]],
        // 	//'contactPhonePerson': [null, [Validators.required]],
        // 	'contactPhoneNumber': this.formbuilder.array(this.TransformPhoneNumber()),
        // 	'contactMailEmailAddress': this.formbuilder.array(this.TransformEmailAddress()),
        // 	//	'contactMailPerson': [null, [Validators.required]],
        // 	// 'contactMailEmailAddress': [(this.currentConversation && this.currentConversation.visitorEmail && this.currentConversation.visitorEmail != 'Unregistered') ? this.currentConversation.visitorEmail : null,
        // 	// [
        // 	// 	Validators.pattern(this.emailPattern),
        // 	// 	Validators.required
        // 	// ]
        // 	// ],
        // 	// 'contactPhoneNumber':[(this.currentConversation && this.currentConversation.session && this.currentConversation.session.phone) ? this.currentConversation.session.phone : null,
        // 	// [Validators.pattern(this.phoneNumberRegex),
        // 	// 	Validators.required]],
        // 	'homePageOnFlg': [null, [Validators.required]],
        // 	'myPageOnFlg': [null, [Validators.required]],
        // 	'bulkEmailFlg': [null, [Validators.required]],
        // 	'bulkEmailStockListFlg': [null, [Validators.required]],
        // 	//'whyNotBuy': [null, [Validators.required]],
        // });
        // this._chatService.GetSalesAgent(0).subscribe(result => {
        // 	if (result) {
        // 		this.salesAgent = result.response.MasterData
        // 		//console.log(this.salesAgent)
        // 	}
        // })
        // this._chatService.GetMasterData(1).subscribe(result => {
        // 	if (result) {
        // 		//console.log(result)
        // 		this.country = result.MasterData
        // 		// console.log(this.country.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(2).subscribe(result => {
        // 	if (result) {
        // 		this.portID = result.MasterData
        // 		//console.log(this.portID)
        // 	}
        // })
        // this._chatService.GetMasterData(3).subscribe(result => {
        // 	if (result) {
        // 		this.customerID = result.MasterData
        // 		//console.log(this.customerID)
        // 	}
        // })
        // this._chatService.GetMasterData(4).subscribe(result => {
        // 	if (result) {
        // 		this.phoneID = result.MasterData
        // 		//console.log(this.phoneID)
        // 	}
        // })
        // this._chatService.GetMasterData(6).subscribe(result => {
        // 	if (result) {
        // 		this.gpp = result.MasterData
        // 		//console.log(this.gpp.MaterData)
        // 	}
        // })
        // this._chatService.GetMasterData(7).subscribe(result => {
        // 	if (result) {
        // 		this.carMakerID = result.MasterData
        // 		//console.log(this.carMakerID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(8).subscribe(result => {
        // 	if (result) {
        // 		this.carBodyID = result.MasterData
        // 		//console.log(this.carBodyID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(9).subscribe(result => {
        // 	if (result) {
        // 		this.carBodySubID = result.MasterData
        // 		//console.log(this.carBodySubID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(10).subscribe(result => {
        // 	if (result) {
        // 		this.carFuelID = result.MasterData
        // 		//console.log(this.carFuelID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(11).subscribe(result => {
        // 	if (result) {
        // 		this.carColorID = result.MasterData
        // 		//console.log(this.carColorID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(12).subscribe(result => {
        // 	if (result) {
        // 		this.purchaseCountryID = result.MasterData
        // 		//console.log(this.purchaseCOuntryID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(13).subscribe(result => {
        // 	if (result) {
        // 		this.locationPortID = result.MasterData
        // 		//console.log(this.locationPortID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(14).subscribe(result => {
        // 	if (result) {
        // 		this.carBodyLengthID = result.MasterData
        // 		//console.log(this.carBodyLengthID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(15).subscribe(result => {
        // 	if (result) {
        // 		this.carLoadingCapacityID = result.MasterData
        // 		//console.log(this.carLoadingCapacityID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(16).subscribe(result => {
        // 	if (result) {
        // 		this.carTruckSizeID = result.MasterData
        // 		//console.log(this.carTruckSizeID.MasterData)
        // 	}
        // })
        // this._chatService.GetMasterData(17).subscribe(result => {
        // 	if (result) {
        // 		this.carSortTypeID = result.MasterData
        // 		//console.log(this.carSortTypeID.MasterData)
        // 	}
        // })
        this._chatService.GetMasterData(18).subscribe(function (result) {
            if (result) {
                _this.countryID = result.MasterData;
            }
        });
        // //	console.log(this.agent)
        this.emailTranscriptForm = formbuilder.group({
            'email': [null, [
                    forms_1.Validators.pattern(this.emailPattern),
                    forms_1.Validators.required
                ]],
        });
        this.stockListForm = formbuilder.group({
            'customerCountryId': ['', [forms_1.Validators.required]],
            'currencyId': ['', [forms_1.Validators.required]],
            'destinationCountryId': ['', [forms_1.Validators.required]],
            'destinationPortId': ['', [forms_1.Validators.required]],
            'shipmentId': ['', [forms_1.Validators.required]],
            'freightPaymentId': ['', [forms_1.Validators.required]],
            'protectionProgramId': ['', [forms_1.Validators.required]],
            'sortingTypeId': ['', [forms_1.Validators.required]],
            'makerId': [''],
            'carName': [''],
            'modelCode': [''],
            'steeringId': [''],
            'bodyTypeId': [''],
            'subBodyTypeId': [''],
            'driveId': [''],
            'regYearFrom': [''],
            'regYearTo': [''],
            'regMonthFrom': [''],
            'regMonthTo': [''],
            'vehiclePriceFrom': [''],
            'vehiclePriceTo': [''],
            'ccFrom': [''],
            'ccTo': [''],
            'mileageFrom': [''],
            'mileageTo': [''],
            'transmission': [''],
            'fuelId': [''],
            'colorId': [''],
            'prodYearFrom': [''],
            'prodYearTo': [''],
            'engineTypeName': [''],
            'bodyLengthId': [''],
            'loadingCapacityId': [''],
            'truckSize': [''],
            'emissionCode3': [''],
            'purchaseCountryId': [''],
            'locationPortId': [''],
            'accessoryAB': [''],
            'accessoryABS': [''],
            'accessoryAC': [''],
            'accessoryAW': [''],
            'accessoryBT': [''],
            'accessoryFOG': [''],
            'accessoryGG': [''],
            'accessoryLS': [''],
            'accessoryNV': [''],
            'accessoryPS': [''],
            'accessoryPW': [''],
            'accessoryRR': [''],
            'accessoryRS': [''],
            'accessorySR': [''],
            'accessoryTV': [''],
            'accessoryWAB': [''],
        });
        this.subscriptions.push(this._chatService.GetTagList().subscribe(function (tags) {
            _this.tagList = tags;
            // //console.log(this.tagList);
        }));
        this.subscription.push(_chatService.ShowAttachmentAreaDnd.subscribe(function (data) {
            _this.ShowAttachmentAreaDnd = data;
        }));
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
                if (!_this.package.chats.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        //without draft
        this.subscriptions.push(this._chatService.getCurrentConversation().subscribe(function (data) {
            if (Object.keys(data).length) {
                if (!data.dynamicFields)
                    data.dynamicFields = {};
                // let customerEmail = this.selectedVisitor.email
                if (data && _this.currentConversation && (_this.currentConversation._id != data._id)) {
                    //console.log(data);
                    var draft = {
                        id: _this.currentConversation._id,
                        message: (_this.msgBody) ? _this.msgBody : ''
                    };
                    _this._chatService.SetDraft(draft);
                    _this.vhListTabs('visitorHistory');
                    _this._chatService.ShowAttachmentAreaDnd.next(false);
                    _this.files = [];
                    _this.arrToDialog = [];
                    _this.attachmentGallery = [];
                    _this.shiftdown = false;
                    if (_this.drafts.length) {
                        var draft_1 = _this.drafts.filter(function (d) { return d.id == data._id; });
                        if (draft_1 && draft_1.length) {
                            _this.msgBody = draft_1[0].message;
                        }
                        else
                            _this.msgBody = '';
                    }
                }
                if (_this.tagForm)
                    _this.tagForm.controls['hashTag'].setValue('');
                if (data && (_this.currentConversation._id != data._id)) {
                    if (!data.hasOwnProperty('registered')) {
                        var custData_1 = {
                            "MailAddress": (data.visitorEmail != 'Unregistered') ? data.visitorEmail : '',
                            "PhoneNumber": '',
                            "StockId": '',
                            "CustomerId": (data.CMID) ? data.CMID : (data.CustomerInfo && data.CustomerInfo.customerId) ? data.CustomerInfo.customerId : '',
                        };
                        // //Real Customer Variables
                        var customerEmails_1 = [];
                        var basicData_1 = [];
                        var customerPhoneList_1 = [];
                        var salesPersonList_1 = [];
                        //	let registered = ''
                        var realCustomerId_1 = '';
                        var realCustomerBasicData_1 = [];
                        var realCustomerEmails_1 = [];
                        var realCustomerPhone_1 = [];
                        var realCustomerSalesPerson_1 = [];
                        //Rest Of Customers Variables
                        var restOfCustomersId_1 = [];
                        var restOfCustomerBasicData_1 = [];
                        var restOfCustomerEmails_1 = [];
                        var restOfCustomerPhone_1 = [];
                        var restOfCustomerSalesPerson_1 = [];
                        var allCustomers_1 = [];
                        _this.emailList = [];
                        _this.phoneList = [];
                        _this.defaultEmail = '';
                        _this.defaultPhone = '';
                        _this._chatService.CheckRegisterCustomerRest(custData_1.MailAddress, data._id, custData_1.CustomerId).subscribe(function (result) {
                            if (result && (result.response._id == data._id)) {
                                if (result.response.ResultInformation[0].ResultCode != 0) {
                                    _this.currentConversation.RelatedCustomerInfo = [];
                                    _this.currentConversation.CustomerInfo = undefined;
                                    data.registered = 'Unregistered Customer';
                                    _this._chatService.IsCustomerRegistered(data.registered, data._id, _this.nsp).subscribe(function (result) { });
                                }
                                else {
                                    customerEmails_1 = result.response.CustomerData[0].ContactMailAddressList;
                                    basicData_1 = result.response.CustomerData[0].BasicData;
                                    customerPhoneList_1 = result.response.CustomerData[0].ContactPhoneNumberList;
                                    salesPersonList_1 = result.response.CustomerData[0].SalesPersonData;
                                    if (custData_1.CustomerId != '')
                                        realCustomerId_1 = custData_1.CustomerId;
                                    else {
                                        customerEmails_1.map(function (x) {
                                            if (x.MailAddress.toLowerCase() == data.visitorEmail.toLowerCase())
                                                realCustomerId_1 = x.CustomerId;
                                            return x;
                                        });
                                    }
                                    data.registered = (realCustomerId_1 != '') ? 'Registered Customer' : 'UnRegistered Customer';
                                    //console.log(data.registered)
                                    _this._chatService.IsCustomerRegistered(data.registered, data._id, _this.nsp).subscribe(function (result) { });
                                    basicData_1.map(function (x) {
                                        if (x.CustomerId == realCustomerId_1) {
                                            realCustomerBasicData_1 = x;
                                            data.basicDataId = x.CustomerId;
                                            data.basicDataName = x.CustomerName;
                                            data.basicDataRank = x.CustomerRank;
                                            data.basicDataType = x.CustomerType;
                                            data.basicDataCountry = x.Country;
                                        }
                                        if (x.CustomerId != realCustomerId_1) {
                                            restOfCustomerBasicData_1.push(x);
                                            restOfCustomersId_1.push(x.CustomerId);
                                        }
                                        return x;
                                    });
                                    customerEmails_1.map(function (x) {
                                        if (x.CustomerId == realCustomerId_1)
                                            realCustomerEmails_1.push(x);
                                        if (x.CustomerId != realCustomerId_1)
                                            restOfCustomerEmails_1.push(x);
                                        return x;
                                    });
                                    customerPhoneList_1.map(function (x) {
                                        if (x.CustomerId == realCustomerId_1)
                                            realCustomerPhone_1.push(x);
                                        if (x.CustomerId != realCustomerId_1)
                                            restOfCustomerPhone_1.push(x);
                                        return x;
                                    });
                                    salesPersonList_1.map(function (x) {
                                        if (x.CustomerId == realCustomerId_1) {
                                            realCustomerSalesPerson_1 = x;
                                            data.salesPersonName = x.UserName;
                                            data.salesPersonCode = x.UserCode;
                                            data.salesPersonOffice = x.Office;
                                        }
                                        if (x.CustomerId != realCustomerId_1)
                                            restOfCustomerSalesPerson_1.push(x);
                                        return x;
                                    });
                                    if (restOfCustomersId_1 && restOfCustomersId_1.length) {
                                        console.log("v", restOfCustomersId_1);
                                        var c_1 = 0;
                                        restOfCustomersId_1.forEach(function (customer) {
                                            var cID = '';
                                            var cName = '';
                                            var cRank = '';
                                            var cType = '';
                                            var cCountry = '';
                                            var cSalesName = '';
                                            var cSalesCode = '';
                                            var cSalesOffice = '';
                                            var singleCustomerEmail = [];
                                            var singleCustomerPhone = [];
                                            var defaultPhone = '';
                                            var defaultEmail = '';
                                            restOfCustomerBasicData_1.map(function (x) {
                                                if (x.CustomerId == restOfCustomersId_1[c_1]) {
                                                    cID = x.CustomerId;
                                                    cName = x.CustomerName;
                                                    cRank = x.CustomerRank;
                                                    cType = x.CustomerType;
                                                    cCountry = x.Country;
                                                }
                                            });
                                            restOfCustomerSalesPerson_1.map(function (x) {
                                                if (x.CustomerId == restOfCustomersId_1[c_1]) {
                                                    cSalesName = x.UserName;
                                                    cSalesCode = x.UserCode;
                                                    cSalesOffice = x.Office;
                                                }
                                            });
                                            restOfCustomerEmails_1.map(function (x) {
                                                if (x.CustomerId == restOfCustomersId_1[c_1]) {
                                                    singleCustomerEmail.push(x);
                                                }
                                            });
                                            if (singleCustomerEmail && singleCustomerEmail.length) {
                                                singleCustomerEmail.map(function (x) {
                                                    if (x.Default == 1)
                                                        defaultEmail = x.MailAddress;
                                                    return x;
                                                });
                                            }
                                            singleCustomerEmail = [];
                                            restOfCustomerEmails_1.map(function (x) {
                                                if (x.CustomerId == restOfCustomersId_1[c_1]) {
                                                    if (x.Default == 1)
                                                        singleCustomerEmail.unshift(x.MailAddress);
                                                    else
                                                        singleCustomerEmail.push(x.MailAddress);
                                                }
                                            });
                                            singleCustomerEmail = singleCustomerEmail.filter(function (n, i) { return singleCustomerEmail.indexOf(n) === i; });
                                            restOfCustomerPhone_1.map(function (x) {
                                                if (x.CustomerId == restOfCustomersId_1[c_1]) {
                                                    singleCustomerPhone.push(x);
                                                }
                                            });
                                            if (singleCustomerPhone && singleCustomerPhone.length) {
                                                singleCustomerPhone.map(function (x) {
                                                    if (x.Default == 1)
                                                        defaultPhone = x.PhoneNumber;
                                                    return x;
                                                });
                                            }
                                            singleCustomerPhone = [];
                                            restOfCustomerPhone_1.map(function (x) {
                                                if (x.CustomerId == restOfCustomersId_1[c_1]) {
                                                    if (x.Default == 1)
                                                        singleCustomerPhone.unshift(x.PhoneNumber);
                                                    else
                                                        singleCustomerPhone.push(x.PhoneNumber);
                                                }
                                            });
                                            singleCustomerPhone = singleCustomerPhone.filter(function (n, i) { return singleCustomerPhone.indexOf(n) === i; });
                                            //	console.log(singleCustomerPhone)
                                            //	console.log(singleCustomerEmail)
                                            var CustomerDetails = {
                                                'customerId': cID,
                                                'customerName': cName,
                                                'customerRank': cRank,
                                                'customerType': cType,
                                                'customerCountry': cCountry,
                                                'salesPersonName': cSalesName,
                                                'salesPersonCode': cSalesCode,
                                                'salesPersonOffice': cSalesOffice,
                                                'defaultPhone': defaultPhone,
                                                'defaultEmail': defaultEmail,
                                                'customerEmail': singleCustomerEmail,
                                                'customerPhone': singleCustomerPhone
                                            };
                                            allCustomers_1[c_1] = CustomerDetails;
                                            c_1 = c_1 + 1;
                                        });
                                        if (!data.RelatedCustomerInfo)
                                            _this._chatService.InsertSimilarCustomers(allCustomers_1, data._id, _this.nsp).subscribe(function (result) {
                                            });
                                    }
                                    data.contactEmail = realCustomerEmails_1;
                                    if (data.contactEmail && data.contactEmail.length) {
                                        data.contactEmail.forEach(function (x) {
                                            if (x.Default == 1)
                                                _this.emailList.unshift(x.MailAddress);
                                            else
                                                _this.emailList.push(x.MailAddress);
                                            return x;
                                        });
                                        _this.emailList = _this.emailList.filter(function (n, i) { return _this.emailList.indexOf(n) === i; });
                                        data.contactEmail.map(function (x) {
                                            if (x.Default == 1)
                                                _this.defaultEmail = x.MailAddress;
                                            return x;
                                        });
                                    }
                                    data.contactPhone = realCustomerPhone_1;
                                    if (data.contactPhone && data.contactPhone.length) {
                                        data.contactPhone.forEach(function (x) {
                                            if (x.Default == 1)
                                                _this.phoneList.unshift(x.PhoneNumber);
                                            _this.phoneList.push(x.PhoneNumber);
                                            return x;
                                        });
                                        _this.phoneList = _this.phoneList.filter(function (n, i) { return _this.phoneList.indexOf(n) === i; });
                                        data.contactPhone.map(function (x) {
                                            if (x.Default == 1)
                                                _this.defaultPhone = x.PhoneNumber;
                                            return x;
                                        });
                                    }
                                    if (data.registered == 'Registered Customer' && !data.CustomerInfo) {
                                        _this._chatService.InsertCustomerInfo({ customerId: data.basicDataId, customerName: data.basicDataName, customerRank: data.basicDataRank, customerType: data.basicDataType, customerEmail: _this.emailList, customerPhone: _this.phoneList, defaultEmail: _this.defaultEmail, defaultPhone: _this.defaultPhone, customerCountry: data.basicDataCountry, salesPersonName: data.salesPersonName, salesPersonCode: data.salesPersonCode, salesPersonOffice: data.salesPersonOffice }, data._id, _this.nsp).subscribe(function (result) {
                                            //	console.log(result)
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
                _this.currentConversation = data;
                // this._chatService.GetMasterData(1).subscribe(result => {
                // 	if (result) {
                // 		this.countryList = result.MasterData;
                // 		this.countryList.map(val => {
                // 			if (val.ItemName == this.currentConversation.session.fullCountryName.toUpperCase()) {
                // 				this.countryName = val.ItemName;
                // 				// console.log(this.countryName);
                // 			}
                // 		});
                // 	}
                // });
                _this.countryName = '';
                if (_this.selectedVisitor && _this.selectedVisitor.fullCountryName) {
                    _this.countryID.map(function (x) {
                        if (x.ItemName.toUpperCase() == (_this.selectedVisitor.fullCountryName).toUpperCase()) {
                            _this.countryName = x.ItemName;
                            return x;
                        }
                        // else this.countryName = ''
                    });
                }
                else if (data && data.session && data.session.fullCountryName) {
                    _this.countryID.map(function (x) {
                        if (x.ItemName.toUpperCase() == data.session.fullCountryName.toUpperCase()) {
                            _this.countryName = x.ItemName;
                            return x;
                        }
                        // else this.countryName = ''
                    });
                }
                else {
                    _this.countryName = '';
                }
                _this.addTicketForm.controls['visitor'].get('name').setValue((data && data.visitorName) ? data.visitorName : '');
                _this.addTicketForm.controls['visitor'].get('email').setValue((data && data.visitorEmail) ? data.visitorEmail : '');
                _this.addTicketForm.controls['visitor'].get('phone').setValue((data && data.session && data.session.phone) ? data.session.phone : '');
                // this.stockListForm.get('customerCountryId').setValue('37')
                // this.stockListForm.get('currencyId').setValue('1')
                // this.stockListForm.get('destinationCountryId').setValue('37')
                // this.stockListForm.get('shipmentId').setValue('1')
                // this.stockListForm.get('freightPaymentId').setValue('0')
                // this.stockListForm.get('protectionProgramId').setValue('0')
                // this.stockListForm.get('sortingTypeId').setValue('0')
                if (data && data.CustomerInfo)
                    _this.addTicketForm.get('subject').setValue(((data.clientID) ? (data.clientID || data._id) + ' / ' + data.CustomerInfo.customerCountry + ' / ' + data.CustomerInfo.customerId + ' / ' + data.CustomerInfo.salesPersonName + ' / ' + 'Beelinks' : ''));
                else
                    _this.addTicketForm.get('subject').setValue((data.clientID) ? (data.clientID || data._id) + ' ' : '');
                if (_this.selectedVisitor && _this.selectedVisitor.fullCountryName) {
                    _this.countryID.map(function (x) {
                        if (x.ItemName.toLowerCase() == (_this.selectedVisitor.fullCountryName).toLowerCase())
                            _this.countryCode = x.PhoneCountryCode;
                        return x;
                    });
                }
                else if (data && data.session && data.session.fullCountryName) {
                    _this.countryID.map(function (x) {
                        if (x.ItemName.toLowerCase() == data.session.fullCountryName.toLowerCase())
                            _this.countryCode = x.PhoneCountryCode;
                        return x;
                    });
                }
                else {
                    _this.countryCode = '';
                }
                // console.log('code',this.countryCode)
                if (_this.currentConversation.state == 4) {
                    if (_this.currentConversation.feedback && _this.currentConversation.feedback.Q2 && !isNaN(_this.currentConversation.feedback.Q2)) {
                        _this.feedback = Array(parseInt(_this.currentConversation.feedback.Q2)).fill(1);
                    }
                }
                if (data && data.hasOwnProperty('_id')) {
                    //setTimeout(() => {
                    _this.restrictAutoSize = false;
                    // 	this._appStateService.selectingThread.next(false)
                    //}, 0);
                }
            }
            else
                _this.currentConversation = {};
        }));
    }
    ChatsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._appStateService.displayChatBar(false);
        this.subscriptions.push(this._authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscriptions.push(this._chatService.selectedChatHistory.subscribe(function (data) {
            _this.selectedChatHistory = data;
        }));
        this.subscriptions.push(this._uploadingService.getRemovedFile().subscribe(function (data) {
            if (data) {
                _this.removedFile = data;
            }
            else {
                _this.removedFile = undefined;
            }
        }));
        this.subscriptions.push(this._authService.Production.subscribe(function (production) {
            _this.production = production;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
            if (settings && settings.permissions) {
                _this.chatPermissions = settings.permissions.chats;
                _this.agentPermissions = settings.permissions.agents;
            }
            _this.automatedMessagesList = settings.automatedMessages;
        }));
        this.subscriptions.push(this._authService.Agent.subscribe(function (data) {
            _this.agent = data;
            _this.nsp = data.nsp;
            _this._chatService.GetMasterData(19).subscribe(function (result) {
                if (result) {
                    _this.employeeList = result.MasterData;
                    _this.employeeList.map(function (val) {
                        if (val.EmailAddress == _this.agent.email) {
                            _this.agentName = val.EmployeeName;
                        }
                    });
                }
            });
        }));
        this.subscriptions.push(this._chatService.GetSelectedVisitor().subscribe(function (selectedVisitor) {
            _this.selectedVisitor = selectedVisitor;
        }));
        this.subscriptions.push(this._chatService.customFields.subscribe(function (fields) {
            _this.fields = fields;
        }));
        this.subscriptions.push(this._chatService.getActiveTab().subscribe(function (tab) {
            _this.activeTab = tab;
        }));
        this.subscriptions.push(this._adminSettingsService.getFileSharingSettings().subscribe(function (fileSharingSettings) {
            _this.fileSharePermission = fileSharingSettings;
        }));
        this.subscriptions.push(this._adminSettingsService.callSettings.subscribe(function (data) {
            _this.callSettings = data;
        }));
        this.subscriptions.push(this._chatService.tempTypingState.subscribe(function (data) {
            _this.tempTypingState = data;
        }));
        this.subscriptions.push(this.CheckTypingState.debounceTime(500).subscribe(function (data) {
            if (!_this.msgBody.trim()) {
                _this._chatService.SendTypingEventRest({ state: false, conversation: data }).subscribe(function (data) {
                    _this._chatService.tempTypingState.next(false);
                });
            }
            else if (_this.msgBody.trim().length > 1 && !_this.tempTypingState) {
                _this._chatService.SendTypingEventRest({ state: true, conversation: data }).subscribe(function (data) {
                    _this._chatService.tempTypingState.next(true);
                });
            }
            else {
                if (_this.msgBody.trim().length < 2 && !_this.tempTypingState) {
                    _this._chatService.SendTypingEventRest({ state: true, conversation: data }).subscribe(function (data) {
                        _this._chatService.tempTypingState.next(true);
                    });
                }
            }
        }));
        this.subscriptions.push(this._appStateService.shortcutEvents.subscribe(function (data) {
            _this._chatService.SelectConversation(data, _this.activeTab);
        }));
        this.subscriptions.push(this._chatService.CannedForms.subscribe(function (forms) {
            if (forms && forms.length) {
                _this.CannedForms = forms;
                _this.CannedForms.map(function (forms) {
                    if (forms.formName.indexOf('##') == -1)
                        forms.formName = '##' + forms.formName;
                    return forms;
                });
            }
        }));
        this.subscriptions.push(this._appStateService.resizeEvent.subscribe(function (data) {
            _this.showViewHistory = data;
        }));
        this.subscriptions.push(this._chatService.messageDrafts.subscribe(function (data) {
            _this.drafts = data;
        }));
        this.subscription.push(this._chatService.notification.subscribe(function (notification) {
            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: notification.img,
                    msg: notification.msg
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
        }));
    };
    ChatsComponent.prototype.RemoveDuplicateTags = function (array) {
        var arr = {};
        array.map(function (value) { arr[value] = value; });
        return Object.keys(arr);
    };
    ChatsComponent.prototype.selectTag = function (event) {
        if (event.target && event.target.value) {
            if (this.tagList.indexOf(event.target.value) !== -1) {
                var hashTag = event.target.value.split('#')[1];
                //let commaseparatedTags = this.RemoveDuplicateTags((hashTag as string).split(','));
                if (this.currentConversation.tags && this.currentConversation.tags.length) {
                    if (!this.currentConversation.tags.includes(hashTag)) {
                        this._chatService.addConversationTags(this.currentConversation._id, [hashTag]).subscribe(function (response) {
                            if (response.status == 'ok') {
                            }
                        });
                    }
                    else {
                        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'Tag already added'
                            },
                            duration: 3000,
                            panelClass: ['user-alert', 'warning']
                        });
                    }
                }
                else {
                    this._chatService.addConversationTags(this.currentConversation._id, [hashTag]).subscribe(function (response) {
                        if (response.status == 'ok') {
                        }
                    });
                }
                this.tagForm.reset();
            }
        }
    };
    ChatsComponent.prototype.addTags = function () {
        var hashTag = this.tagForm.get('hashTag').value;
        var commaseparatedTags = this.RemoveDuplicateTags(hashTag.split(','));
        this._chatService.addConversationTags(this.currentConversation._id, commaseparatedTags).subscribe(function (response) {
            if (response.status == 'ok') {
            }
        });
        this.tagForm.reset();
    };
    ChatsComponent.prototype.DeleteTag = function (index) {
        this._chatService.deleteConversationTag(this.currentConversation.tags[index], index, this.currentConversation._id);
    };
    ChatsComponent.prototype.ngAfterViewInit = function () {
        if (this.scrollContainer && this.scrollContainer.nativeElement) {
            this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
        }
    };
    // ScrollChanged($event: UIEvent) {
    // 	if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
    // 		if (!this.selectedChatHistory.noMoreChats && this.selectedChatHistory.conversations) this._chatService.getMoreConversationsFromBackend(this.selectedChatHistory.deviceID, this.selectedChatHistory.conversations[this.selectedChatHistory.conversations.length - 1]._id);
    // 	}
    // 	this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    // }
    ChatsComponent.prototype.ngAfterViewChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        if (this.loading && this.scrollContainer && this.scrollContainer.nativeElement) {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
        }
    };
    ChatsComponent.prototype.CheckAttachmentType = function (data) {
        return (typeof data === 'string');
    };
    ChatsComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._chatService.currentConversation.next({});
        this._chatService.selectedVisitor.next({});
        this._appStateService.CloseControlSideBar();
        this._appStateService.displayChatBar(true);
        this._appStateService.setChatBar(false);
        this.files = [];
        this._chatService.ShowAttachmentAreaDnd.next(false);
        this.fileValid = false;
        this.uploading = false;
    };
    ChatsComponent.prototype.onSelectionChanged = function (responseText) {
    };
    ChatsComponent.prototype.filterInput = function (autocompleteString) {
        this.filteredAutomatedMessages = this.automatedMessagesList.filter(function (automatedMessage) {
            if (automatedMessage.hashTag.toLowerCase().indexOf(autocompleteString) != -1 && autocompleteString) {
                return automatedMessage;
            }
        });
    };
    //for Canned Forms
    ChatsComponent.prototype.filterInput1 = function (autocompleteString) {
        if (this.formHashQuery) {
            // this.filteredAutomatedMessages = []
            this.filteredAutomatedMessages = this.CannedForms.filter(function (forms) {
                if (forms.formName.toLowerCase().indexOf(autocompleteString.toLowerCase()) != -1 && autocompleteString) {
                    return forms;
                }
            });
        }
        else {
            this.filteredAutomatedMessages = this.automatedMessagesList.filter(function (automatedMessage) {
                if (automatedMessage.hashTag.toLowerCase().indexOf(autocompleteString.toLowerCase()) != -1 && autocompleteString) {
                    return automatedMessage;
                }
            });
        }
    };
    ChatsComponent.prototype.clearinputFilter = function () {
        this.hashQuery = '';
        this.hashIndex = -1;
        this.caretPosition = -1;
    };
    //typingEvent
    ChatsComponent.prototype.TypingEvent = function (e) {
        this.CheckTypingState.next(this.currentConversation);
        this.tempMsgBody = this.msgBody;
    };
    ChatsComponent.prototype.setShift = function () {
        if (this.hashQuerySelected) {
            this.hashQuery = '';
            this.hashQuerySelected = false;
        }
    };
    ChatsComponent.prototype.keydown = function (event) {
        switch (event.key.toLowerCase()) {
            case 'shift':
                this.shiftdown = true;
                break;
            case 'enter':
                if (!this.msgBody && !this.shiftdown) {
                    event.preventDefault();
                }
                else if (!this.shiftdown)
                    return false;
                break;
        }
    };
    ChatsComponent.prototype.keydown1 = function (event) {
        switch (event.key.toLowerCase()) {
            case 'shift':
                this.shiftdown = true;
                break;
            case 'enter':
                if (this.actionForm && this.actionForm.length) {
                    this.shiftdown = false;
                }
                if (!this.msgBody && !this.shiftdown) {
                    event.preventDefault();
                }
                else if (this.msgBody && !this.shiftdown && !this.hashQuery && !this.hashQuerySelected) {
                    this.autoGrowSyncMsgBody = this.msgBody;
                    this.msgBody = '';
                }
                break;
        }
    };
    ChatsComponent.prototype.keyup = function (event) {
        var _this = this;
        if (this.hashQuery) {
            switch (event.key.toLowerCase()) {
                case 'backspace':
                    {
                        if (this.autoComplete) {
                            this.clearinputFilter();
                        }
                        else {
                            this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
                        }
                        break;
                    }
                case 'arrowleft':
                case 'arrowright':
                case ' ':
                case 'enter':
                    {
                        if (this.shiftdown)
                            this.shiftdown = false;
                        event.target.selectionStart = this.caretPosition;
                        event.target.selectionEnd = this.caretPosition;
                        this.clearinputFilter();
                        break;
                    }
                default:
                    //////console.log('default 1');
                    event.target.focus();
                    break;
            }
        }
        else {
            switch (event.key.toLowerCase()) {
                case 'enter':
                    {
                        if (this.shiftdown) {
                            event.preventDefault();
                        }
                        else {
                            var id = this.currentConversation._id;
                            this._chatService.DeleteDraft(id);
                            this.SendMessage();
                        }
                        break;
                    }
                case 'shift':
                    {
                        setTimeout(function () {
                            _this.shiftdown = false;
                        }, 100);
                        break;
                    }
            }
        }
        this.filterInput(this.hashQuery);
    };
    //for Canned Forms
    ChatsComponent.prototype.keyup1 = function (event) {
        var _this = this;
        if (this.hashQuery && !this.formHashQuery) {
            //////console.log("keyup 1");
            switch (event.key.toLowerCase()) {
                case 'backspace':
                    {
                        //////console.log("keyup backspace");
                        if (this.autoComplete) {
                            this.clearinputFilter();
                        }
                        else {
                            this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
                        }
                        break;
                    }
                case 'arrowleft':
                case 'arrowright':
                case ' ':
                case 'enter':
                    {
                        //////console.log("keyup enter");
                        if (this.shiftdown)
                            this.shiftdown = false;
                        event.target.selectionStart = this.caretPosition;
                        event.target.selectionEnd = this.caretPosition;
                        this.clearinputFilter();
                        break;
                    }
                default:
                    //////console.log('default 1');
                    event.target.focus();
                    break;
            }
        }
        else if (this.hashQuery && this.formHashQuery) {
            //////console.log("keyup 2");
            switch (event.key.toLowerCase()) {
                case 'backspace':
                    //////console.log("backspace");
                    this.formHashQuery = false;
                    //this.shiftdown = false;
                    // if (this.autoComplete) {
                    // 	this.clearinputFilter();
                    // } else {
                    //////console.log("keyup");
                    if (this.hashQuery == '##') {
                        this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
                        this.hashIndex = event.target.selectionStart - 1;
                    }
                    // }
                    break;
                case 'arrowleft':
                case 'arrowright':
                case ' ':
                case 'enter':
                    {
                        //////console.log("keyup enter");
                        if (this.shiftdown)
                            this.shiftdown = false;
                        // (event.target as HTMLTextAreaElement).selectionStart = this.caretPosition;
                        // (event.target as HTMLTextAreaElement).selectionEnd = this.caretPosition;
                        this.clearinputFilter();
                        break;
                    }
                // case '#':
                // 	this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
                // 	//this.filterInput(this.hashQuery);
                // 	break;
                default:
                    //////console.log('default 2');
                    // 	(event.target as HTMLTextAreaElement).focus()
                    break;
            }
        }
        else {
            switch (event.key.toLowerCase()) {
                case 'enter':
                    {
                        if ((this.shiftdown || !this.autoGrowSyncMsgBody.trim()) && (this.actionForm && !this.actionForm.length)) {
                            event.preventDefault();
                        }
                        else {
                            this.SendMessage();
                            this._chatService.DeleteDraft(this.currentConversation._id);
                        }
                        break;
                    }
                case 'shift':
                    {
                        //////console.log("keyup 3 shift");
                        setTimeout(function () {
                            _this.shiftdown = false;
                        }, 100);
                        break;
                    }
                default:
                    break;
            }
        }
        if (this.hashQuerySelected) {
            this.hashQuery = '';
            this.hashQuerySelected = false;
        }
        //////console.log(this.hashQuery);
        this.filterInput(this.hashQuery);
    };
    ChatsComponent.prototype.ItemSelected = function (event) {
        this.caretPosition = this.hashIndex + event.option.value.length;
        var hashQueryFilter = this.hashQuery.split('#')[1];
        this.msgBody = (event.option.value) ? this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length) : this.tempMsgBody.slice(0, this.hashIndex) + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length);
        this.hashQuerySelected = true;
        if (this.shiftdown)
            this.shiftdown = false;
        this.filteredAutomatedMessages = [];
        this.formHashQuery = false;
    };
    ChatsComponent.prototype.ItemSelected1 = function (event) {
        if (this.formHashQuery && event.option.value) {
            var hashQueryFilter = this.hashQuery.split('##')[1];
            this.caretPosition = this.hashIndex - 1;
            this.msgBody = ((this.tempMsgBody) ? this.tempMsgBody.slice(0, this.hashIndex - 1) : '') + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length);
            this.actionForm = this.CannedForms.filter(function (form) { return form.formName == event.option.value; });
            if (this.actionForm && this.actionForm.length > 0) {
                this.hashQuerySelected = true;
                if (this.shiftdown)
                    this.shiftdown = false;
                this._chatService.ShowAttachmentAreaDnd.next(true);
            }
        }
        else if (!this.formHashQuery) {
            this.caretPosition = this.hashIndex + event.option.value.length;
            var hashQueryFilter = this.hashQuery.split('#')[1];
            this.msgBody = (event.option.value) ? this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length) : this.tempMsgBody.slice(0, this.hashIndex) + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length);
            this.hashQuerySelected = true;
            if (this.shiftdown)
                this.shiftdown = false;
        }
        this.filteredAutomatedMessages = [];
        this.formHashQuery = false;
    };
    ChatsComponent.prototype.keyPress = function (event) {
        if (event.key == '#') {
            this.hashQuery = '#';
            this.hashIndex = event.target.selectionStart;
        }
        else if (this.hashQuery) {
            this.hashQuery += event.key;
        }
    };
    //for Canned Forms
    // autoComplete = true;
    // caretPosition = -1;
    ChatsComponent.prototype.keyPress1 = function (event) {
        if (event.key == '#') {
            if (this.hashQuery == '#') {
                this.formHashQuery = true;
                this.hashQuery = '##';
                this.hashIndex = event.target.selectionStart;
            }
            else if (this.hashQuery == '') {
                this.hashQuery = '#';
                this.hashIndex = event.target.selectionStart;
            }
            else {
                this.hashQuery += event.key;
            }
        }
        else if (this.hashQuery) {
            this.hashQuery += event.key;
        }
    };
    ChatsComponent.prototype.stopRecording = function () {
        var _this = this;
        if (!this.isAudioSent && !this.recordedFile) {
            this.seconds = 0;
            this.mins = 0;
            this.recordingStarted = false;
            this.loading = true;
            this.recordRTC.stopRecording(function () {
                // let recording = this.recordRTC.getBlob();
                _this._uploadingService.getSeekableBlob(_this.recordRTC.getBlob(), function (blob) {
                    var file = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
                    if (file && !_this.uploading) {
                        _this.uploading = true;
                        _this._uploadingService.SignRequest(file, 'SendAttachMent').subscribe(function (response) {
                            var params = JSON.parse(response.text());
                            params.file = file;
                            _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                                if (s3response.status == '201') {
                                    _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                                        _this._chatService.SendAttachment(_this.currentConversation.sessionid, {
                                            from: _this.agent.nickname,
                                            to: _this.currentConversation.sessionid,
                                            body: [{ filename: file.name, path: json.response.PostResponse.Location[0] }],
                                            cid: _this.currentConversation._id,
                                            attachment: true,
                                            filename: file.name
                                        }, file.name).subscribe(function (res) { }, function (err) { });
                                        _this.file = '';
                                        _this.fileInput.nativeElement.value = '';
                                        _this.uploading = false;
                                        _this.loading = false;
                                    }, function (err) {
                                        _this.uploading = false;
                                        _this.loading = false;
                                    });
                                }
                            }, function (err) {
                                _this.uploading = false;
                                _this.loading = false;
                            });
                        }, function (err) {
                            _this.uploading = false;
                            _this.loading = false;
                            _this.fileValid = false;
                            setTimeout(function () { return [
                                _this.fileValid = true
                            ]; }, 3000);
                        });
                    }
                    // saveAs(file, 'stream'+ new Date().getTime() + '.mp3');
                    _this.mediaStream.getTracks()[0].stop();
                    _this.isAudioSent = true;
                    clearInterval(_this.recordingInterval);
                });
            });
        }
        else if (this.recordedFile) {
            this.uploading = true;
            this._uploadingService.SignRequest(this.recordedFile, 'SendAttachMent').subscribe(function (response) {
                var params = JSON.parse(response.text());
                params.file = _this.recordedFile;
                _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                    if (s3response.status == '201') {
                        _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                            _this._chatService.SendAttachment(_this.currentConversation.sessionid, {
                                from: _this.agent.nickname,
                                to: _this.currentConversation.sessionid,
                                body: [{ filename: _this.recordedFile.name, path: json.response.PostResponse.Location[0] }],
                                cid: _this.currentConversation._id,
                                attachment: true,
                                filename: _this.recordedFile.name
                            }, _this.recordedFile.name).subscribe(function (res) { }, function (err) { });
                            _this.recordedFile = undefined;
                            _this.fileInput.nativeElement.value = '';
                            _this.uploading = false;
                            _this.loading = false;
                            _this.mediaStream.getTracks()[0].stop();
                            _this.isAudioSent = true;
                            clearInterval(_this.recordingInterval);
                        }, function (err) {
                            _this.uploading = false;
                            _this.loading = false;
                        });
                    }
                }, function (err) {
                    _this.uploading = false;
                    _this.loading = false;
                });
            }, function (err) {
                _this.uploading = false;
                _this.loading = false;
                _this.fileValid = false;
                setTimeout(function () { return [
                    _this.fileValid = true
                ]; }, 3000);
            });
        }
    };
    //with draft
    // public SendMessage() {
    // 	if (this.files && this.files.length && !this.uploading) {
    // 		this.uploading = true;
    // 		let abc = this.files
    // 		this._uploadingService.GenerateLinks(abc, 'SendAttachMent').subscribe(response => {
    // 			//console.log(response);
    // 			let filesReadyToUpload = response.filter(file => {
    // 				return (!(file as Object).hasOwnProperty('error'))
    // 			});
    // 			this.file = [];
    // 			this.errorFile = response.filter(file => {
    // 				return ((file as Object).hasOwnProperty('error'))
    // 			});
    // 			if ((this.errorFile && this.errorFile.length)) {
    // 				this.errorFile.map(file => {
    // 					//console.log(file.error);
    // 					this._uploadingService.ShowAttachmentError(file.error).subscribe(fileerror => {
    // 						//console.log(fileerror);
    // 						file.error = fileerror
    // 						if (file.error) {
    // 							this.fileValid = false;
    // 							this.uploading = false;
    // 							this.fileInput.nativeElement.value = '';
    // 							this.ClearFile();
    // 						}
    // 					}, err => {
    // 						this.fileValid = false;
    // 						file.error = "Error in uploading..Please try again!"
    // 						this.uploading = false;
    // 					});
    // 					return file
    // 				});
    // 				//this.fileerror = true
    // 			}
    // 			//console.log(this.errorFile)
    // 			if (filesReadyToUpload && filesReadyToUpload.length) {
    // 				let attachment = filesReadyToUpload;
    // 				this._chatService.SendAttachment(this.currentConversation.sessionid, {
    // 					from: this.agent.nickname,
    // 					to: this.currentConversation.sessionid,
    // 					body: attachment,
    // 					cid: this.currentConversation._id,
    // 					attachment: true,
    // 					form: this.actionForm
    // 				}).subscribe(res => {
    // 					if (res.status == "ok") {
    // 						this.uploading = false;
    // 						this.currentConversation.arrToDialog = []
    // 						this.currentConversation.arrToDialog = []
    // 						this._chatService.setDraftFiles(this.currentConversation._id, [], [])
    // 						// filesReadyToUpload.forEach(x => {
    // 						// 	this.currentConversation.arrToDialog.splice(this.currentConversation.arrToDialog.findIndex(w => w.name == x.filename), 1);
    // 						// });
    // 					}
    // 				});
    // 				//console.log(this.currentConversation.arrToDialog);
    // 				this.actionForm = '';
    // 				if (this.currentConversation.arrToDialog && !this.currentConversation.arrToDialog.length) {
    // 					this.currentConversation.arrToDialog = [];
    // 					this.files = [];
    // 					if (this.errorFile && !this.errorFile.length) this._chatService.ShowAttachmentAreaDnd.next(false);
    // 				}
    // 			}
    // 		}, err => {
    // 		});
    // 	}
    // 	if (this.autoGrowSyncMsgBody.trim() || (this.actionForm && this.actionForm.length)) {
    // 		this._chatService.SendMessage(this.currentConversation.sessionid, {
    // 			from: this.agent.nickname,
    // 			to: this.currentConversation.sessionid,
    // 			body: this.autoGrowSyncMsgBody.trim(),
    // 			cid: this.currentConversation._id,
    // 			form: this.actionForm
    // 		});
    // 		//setTimeout(() => {
    // 		this.msgBody = '';
    // 		this.autoGrowSyncMsgBody = '';
    // 		//}, 0);
    // 	}
    // 	this._chatService.SendTypingEventRest({ state: false, conversation: this.currentConversation }).subscribe(data => {
    // 		this._chatService.tempTypingState.next(false)
    // 	})
    // 	this._chatService.setAutoScroll(true);
    // 	this._chatService.conversationSeen();
    // }
    // OnChange(event, index) {
    // 	this.checkBoxPhone = true;
    // 	(<FormGroup>(<FormArray>this.registerCustomerForm.controls['contactPhoneNumber']).controls[index]).controls['isDefaultPN'].setValue(event.target.checked);
    // }
    // OnChangeEmail(event, index) {
    // 	this.checkBoxEmail = true;
    // 	(<FormGroup>(<FormArray>this.registerCustomerForm.controls['contactMailEmailAddress']).controls[index]).controls['isDefault'].setValue(event.target.checked);
    // }
    ChatsComponent.prototype.keyDownFunction = function (event) {
        if (event.which == 1) {
            var result = void 0;
            var ev = new KeyboardEvent("keydown", {
                shiftKey: false,
                bubbles: true,
                cancelable: false,
                key: "Enter",
            });
            result = this.messageTextArea.nativeElement.dispatchEvent(ev);
            var ev1 = new KeyboardEvent("keypress", {
                shiftKey: false,
                bubbles: true,
                cancelable: false,
                key: "Enter",
            });
            result = this.messageTextArea.nativeElement.dispatchEvent(ev1);
            var ev3 = new KeyboardEvent("keyup", {
                shiftKey: false,
                bubbles: true,
                cancelable: false,
                key: "Enter",
            });
            this.keyup(ev3);
        }
    };
    ChatsComponent.prototype.SendMessageSingleAttach = function (file, conversation) {
        var _this = this;
        this.uploading = true;
        var galleryIndex = this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
        if (galleryIndex != -1) {
            this.attachmentGallery[galleryIndex].uploading = true;
        }
        this._uploadingService.GenerateLinksForFiles(file, 'SendAttachMent').subscribe(function (response) {
            if (response) {
                _this.uploadingCount = _this.uploadingCount - 1;
                if (_this.uploadingCount == 0) {
                    _this.uploading = false;
                }
                if (!response.error) {
                    _this._chatService.SendAttachment(conversation.sessionid, {
                        from: _this.agent.nickname,
                        to: conversation.sessionid,
                        body: [response],
                        cid: conversation._id,
                        attachment: true,
                        form: _this.actionForm
                    }, file.name).subscribe(function (res) { }, function (err) { });
                    var galleryIndex_1 = _this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
                    if (galleryIndex_1 != -1) {
                        _this.attachmentGallery[galleryIndex_1].uploading = false;
                        _this.attachmentGallery.splice(galleryIndex_1, 1);
                    }
                    var fileIndex = _this.files.findIndex(function (w) { return w.name == file.name; });
                    if (fileIndex != -1)
                        _this.files.splice(fileIndex, 1);
                }
                else {
                    file.error = true;
                    var ind_1 = _this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
                    if (ind_1 != -1) {
                        _this.attachmentGallery[ind_1].uploading = false;
                        _this._uploadingService.ShowAttachmentError(response.error).subscribe(function (value) {
                            _this.attachmentGallery[ind_1].error = value;
                        });
                    }
                }
            }
        }, function (err) {
            var ind = _this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
            if (ind != -1) {
                _this.attachmentGallery[ind].uploading = false;
                _this.attachmentGallery[ind].error = 'error in uploading';
            }
        });
    };
    ChatsComponent.prototype.SendMessage = function () {
        var _this = this;
        ////console.log(this.files);
        var conversation = JSON.parse(JSON.stringify(this.currentConversation));
        if (conversation && conversation.state < 3) {
            if (this.files && this.files.length && !this.uploading) {
                this.uploadingCount = this.files.length;
                this.files.map(function (file) {
                    _this.SendMessageSingleAttach(file, conversation);
                });
                this.fileInput.nativeElement.value = '';
                //#region Old_Commented_Code
                //for sending attachment all at once
                //this.uploading = true;
                // this._uploadingService.GenerateLinks(this.files, 'SendAttachMent').subscribe(response => {
                // 	let filesReadyToUpload = response.filter(file => {
                // 		return (!(file as Object).hasOwnProperty('error'))
                // 	});
                // 	this.file = response.filter(file => {
                // 		return ((file as Object).hasOwnProperty('error'))
                // 	});
                // 	if (filesReadyToUpload && filesReadyToUpload.length) {
                // 		let attachment = filesReadyToUpload;
                // 		this._chatService.SendAttachment(this.currentConversation.sessionid, {
                // 			from: this.agent.nickname,
                // 			to: this.currentConversation.sessionid,
                // 			body: attachment,
                // 			cid: this.currentConversation._id,
                // 			attachment: true,
                // 			form: this.actionForm
                // 		}, this.files[0].name).subscribe(res => { }, err => { });
                // 		this.uploading = false;
                // 		filesReadyToUpload.forEach(x => {
                // 			let ind = this.currentConversation.arrToDialog.findIndex(w => w.name == x.filename);
                // 			this.currentConversation.arrToDialog.splice(ind, 1);
                // 		});
                // 		// let ind = this.arrToDialog.findIndex(w => w.filename == x.name);
                // 		// this.arrToDialog.splice(ind, 1);
                // 		// let index = this.files.findIndex(w => w.name == x.name);
                // 		// this.files.splice(index, 1);
                // 		if (this.file && !this.file.length) {
                // 			this.files = [];
                // 			this.currentConversation.arrToDialog = [];
                // 		}
                // 		if (!this.currentConversation.arrToDialog.length) {
                // 			this._chatService.ShowAttachmentAreaDnd.next(false);
                // 			this.files = [];
                // 			this.fileerror = '';
                // 		}
                // 	}
                // 	//when there is no media service or all wrong files..
                // 	// if ((this.file && this.file.length) || (filesReadyToUpload && filesReadyToUpload.length)) {
                // 	if ((this.file && this.file.length)) {
                // 		this.file.map(errors => {
                // 			this._uploadingService.ShowAttachmentError(errors.error).subscribe(fileerror => {
                // 				this.fileerror = fileerror;
                // 				if (errors.error) {
                // 					this.fileValid = false;
                // 					this.uploading = false;
                // 					this.fileInput.nativeElement.value = '';
                // 					this.ClearFile();
                // 				}
                // 			}, err => {
                // 				this.fileValid = false;
                // 				this.fileerror = "Error in uploading..Please try again!"
                // 				this.uploading = false;
                // 				//////console.log("error in showAttachment", err);
                // 			});
                // 		});
                // 	}
                // }, err => {
                // });
                //#endregion
            }
            // if (this.autoGrowSyncMsgBody.trim() || (this.actionForm && this.actionForm.length)) {
            if (this.msgBody.trim()) {
                this._chatService.SendMessage(conversation, {
                    from: this.agent.nickname,
                    to: conversation.sessionid,
                    body: this.msgBody.trim(),
                    cid: conversation._id,
                    form: this.actionForm
                });
                this.msgBody = '';
                // this.autoGrowSyncMsgBody = '';
            }
            this._chatService.SendTypingEventRest({ state: false, conversation: conversation }).subscribe(function (data) {
                _this._chatService.tempTypingState.next(false);
            });
            this._chatService.setAutoScroll(true);
            this._chatService.conversationSeen();
            //for Action Forms
            if (this.files && !this.files.length && this.actionForm) {
                // this.ShowAttachmentAreaDnd = false;
                this._chatService.ShowAttachmentAreaDnd.next(false);
                this.actionForm = '';
            }
            setTimeout(function () {
                var event = new KeyboardEvent("keydown", {
                    shiftKey: false,
                    bubbles: true,
                    cancelable: false,
                    key: "Enter",
                });
                if (_this.messageTextArea && _this.messageTextArea.nativeElement) {
                    _this.messageTextArea.nativeElement.dispatchEvent(event);
                    _this.messageTextArea.nativeElement.focus();
                }
            }, 0);
        }
    };
    ChatsComponent.prototype.TransferChat = function (event, location) {
        var _this = this;
        var currentConversation = JSON.parse(JSON.stringify(this.currentConversation));
        event.preventDefault();
        this._chatService.GetLiveAgent(location).subscribe(function (data) {
            if (data && data.length) {
                _this.dialog.open(transfer_chat_dialog_component_1.TransferChatDialog, {
                    panelClass: ['responsive-dialog'],
                    data: data
                }).afterClosed().subscribe(function (selectedAgent) {
                    if (selectedAgent) {
                        if (selectedAgent.id != 'dummy') {
                            _this._chatService.TransferChatRest({ id: selectedAgent.id, name: selectedAgent.nickname }, currentConversation.sessionid).subscribe();
                        }
                    }
                });
            }
            else {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'No Agents Available to Transfer'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'warning']
                });
            }
        });
    };
    ChatsComponent.prototype.OpenViewHistory = function () {
        this.showViewHistory = true;
    };
    ChatsComponent.prototype.CloseViewHistory = function () {
        this.showViewHistory = false;
    };
    ChatsComponent.prototype.EndChat = function (event) {
        var _this = this;
        event.preventDefault();
        var conversation = JSON.parse(JSON.stringify(this.currentConversation));
        //console.log('endChat');
        // if (confirm('Are you sure you want to Stop the Chat')) {
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure you want to End the Chat " + conversation.clientID + "?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._chatService.EndChatRest(conversation).subscribe(function (data) {
                    if (!data) {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Chat with ID ' + conversation.clientID + ' has been ended.'
                            },
                            duration: 5000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                });
            }
        });
    };
    ChatsComponent.prototype.ShowVisitorHistoryPanel = function () {
        this.showVisitorHistorySwitch = !this.showVisitorHistorySwitch;
    };
    ChatsComponent.prototype.toggleBrowsingHistory = function () {
        this.browsingHistory = !this.browsingHistory;
    };
    ChatsComponent.prototype.toggleAdditionalData = function () {
        this.additionalData = !this.additionalData;
    };
    ChatsComponent.prototype.toggleStockList = function () {
        this.stockList = !this.stockList;
    };
    ChatsComponent.prototype.vhListTabs = function (tabName) {
        var _this = this;
        Object.keys(this.tabs).map(function (k) {
            if (k == tabName) {
                _this.tabs[k] = true;
            }
            else {
                _this.tabs[k] = false;
            }
        });
    };
    ChatsComponent.prototype.FileSelected = function (event) {
        var _this = this;
        this._chatService.ShowAttachmentAreaDnd.next(false);
        // this.fileValid = true;
        for (var i = 0; i < this.fileInput.nativeElement.files.length; i++) {
            if (this.fileInput.nativeElement.files.length > 0) {
                this.files.push(this.fileInput.nativeElement.files[i]);
                // this.files = this.files.concat(this.fileInput.nativeElement.files[i]);
            }
        }
        this.readURL(this.files).subscribe(function (response) {
            if (response.status == 'ok') {
                _this._chatService.ShowAttachmentAreaDnd.next(true);
                //	if (!this.uploading) this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.currentConversation.arrToDialog);
            }
        });
        setTimeout(function () {
        }, 0);
        ////console.log(this.files);
    };
    ChatsComponent.prototype.readURL = function (files) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.attachmentGallery = [];
            _this._uploadingService.readURL(files).subscribe(function (data) {
                ////console.log('readURL')
                if (data) {
                    _this.attachmentGallery = data;
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
            });
        });
    };
    ChatsComponent.prototype.readURL1 = function (files) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.currentConversation.arrToDialog = [];
            if (files && files.length) {
                files.map(function (file) {
                    _this.attachmentGallery = [];
                    var picReader = new FileReader();
                    picReader.addEventListener("load", function (event) {
                        //console.log('file url load');
                        _this.imagetarget = event.target.result;
                        var obj = { url: _this.imagetarget, name: file.name };
                        _this.attachmentGallery.push(obj);
                    });
                    picReader.readAsDataURL(file);
                });
                observer.next({ status: 'ok' });
                observer.complete();
            }
        });
    };
    ChatsComponent.prototype.ClearFile = function () {
        this.file = undefined;
        this.files = [];
        this.fileInput.nativeElement.value = '';
    };
    // // //AUTOPORT
    // AutoPort() {
    // 	this.autoPort = []
    // 	this.autoCountry = this.stockListForm.get('destinationCountryId').value;
    // 	this.portID.map(x => {
    // 		if (x.CountryId == this.autoCountry) this.autoPort.push(x);
    // 		return x
    // 	})
    // 	this.autoCountry = ''
    // 	this.stockListForm.get('destinationPortId').setValue('');
    // }
    // //AutoCarName
    // AutoCarName() {
    // 	//	this.autoPort = []
    // 	this.carsName = []
    // 	this.carModel = []
    // 	this.autoMake = this.stockListForm.get('makerId').value;
    // 	this._chatService.GetCarNameMasterData(this.autoMake).subscribe(result => {
    // 		this.carsName = result.MasterData
    // 		console.log(this.carsName)
    // 	})
    // 	this.autoMake = ''
    // }
    // //AutoCarModel
    // AutoCarModel() {
    // 	//	this.autoPort = []
    // 	this.carModel = []
    // 	this.autoMake = this.stockListForm.get('makerId').value;
    // 	this.autoCar = this.stockListForm.get('carName').value;
    // 	console.log(this.autoMake)
    // 	console.log(this.autoCar)
    // 	this._chatService.GetCarModelMasterData(this.autoMake, this.autoCar).subscribe(result => {
    // 		this.carModel = result.MasterData
    // 	})
    // 	console.log(this.carModel)
    // 	this.autoMake = ''
    // 	this.autoCar = ''
    // }
    ChatsComponent.prototype.onClear = function (event) {
        if (event.clearActionForm) {
            this.actionForm = '';
            if (this.files && !this.files.length)
                this._chatService.ShowAttachmentAreaDnd.next(false);
        }
        else if (event.clearAll) {
            this.fileInput.nativeElement.value = '';
            this._chatService.ShowAttachmentAreaDnd.next(false);
            this.uploading = false;
            this.fileValid = false;
            this.files = [];
        }
        else if (event.fileToRemove) {
            var index = this.files.findIndex(function (w) { return w.name == event.fileToRemove.name; });
            if (index != -1) {
                this.files.splice(index, 1);
            }
        }
        // if (event.clear) {
        // 	if (this.fileInput) this.fileInput.nativeElement.value = '';
        // 	//this.files = [];
        // 	this.fileerror = '';
        // 	//this._chatService.ShowAttachmentAreaDnd.next(false);
        // 	this.uploading = false;
        // 	this.fileValid = false;
        // 	// if (this.currentConversation.attachments) {
        // 	// 	this.currentConversation.attachments = []
        // 	// 	this.currentConversation.arrToDialog = []
        // 	// }
        // }
        // else if (event.clearActionForm) {
        // 	this.actionForm = ''
        // 	// this.ShowAttachmentAreaDnd = false
        // 	this._chatService.ShowAttachmentAreaDnd.next(false);
        // }
    };
    //DRAG AND DROP FUNCTIONS
    ChatsComponent.prototype.OnDragOver = function (event) {
        if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2)
            return false;
        this.isDragged = true;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    };
    ChatsComponent.prototype.onDragLeave = function (event) {
        if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2)
            return false;
        this.isDragged = false;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    };
    ChatsComponent.prototype.onDrop = function (event) {
        var _this = this;
        if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2)
            return false;
        this.isDragged = false;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this._chatService.ShowAttachmentAreaDnd.next(false);
        this.fileValid = true;
        if (event.dataTransfer.items) {
            for (var i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === "file") {
                    var file = event.dataTransfer.items[i].getAsFile();
                    this.files = this.files.concat(file);
                }
            }
        }
        this.readURL(this.files).subscribe(function (response) {
            if (response.status == 'ok') {
                _this._chatService.ShowAttachmentAreaDnd.next(true);
                // this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
            }
        });
        setTimeout(function () {
            // this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
            // this._chatService.ShowAttachmentAreaDnd.next(true);
        }, 0);
    };
    //VoiceNotes
    ChatsComponent.prototype.startRecording = function () {
        var _this = this;
        try {
            if (this.currentConversation && this.currentConversation.state < 3) {
                this.isAudioSent = false;
                this.recordingStarted = true;
                navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
                    _this.mediaStream = stream;
                    _this.recordRTC = RecordRTC(stream, {
                        type: 'audio'
                    });
                    _this.recordRTC.startRecording();
                    _this.recordingInterval = setInterval(function () {
                        _this.seconds++;
                        if (_this.seconds == 60) {
                            _this.mins += 1;
                            _this.stopRecording();
                            clearInterval(_this.recordingInterval);
                        }
                    }, 1000);
                }).catch(function (err) {
                    _this.recordingStarted = false;
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: err.toString().split(':')[1]
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                });
            }
            else
                return false;
        }
        catch (error) {
            // console.log(error);
            this.recordingStarted = false;
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Error in accessing Media'
                },
                duration: 2000,
                panelClass: ['user-alert', 'error']
            });
        }
    };
    ChatsComponent.prototype.cancelRecording = function () {
        var _this = this;
        this.seconds = 0;
        this.mins = 0;
        this.recordingStarted = false;
        this.recordRTC.stopRecording(function () {
            _this.mediaStream.getTracks()[0].stop();
            _this.isAudioSent = false;
            clearInterval(_this.recordingInterval);
        });
    };
    ChatsComponent.prototype.stopWithTimeout = function () {
        var _this = this;
        if (!this.isAudioSent) {
            this.seconds = 0;
            this.mins = 0;
            this.recordingStarted = false;
            this.loading = true;
            this.recordRTC.stopRecording(function () {
                // let recording = this.recordRTC.getBlob();
                _this._uploadingService.getSeekableBlob(_this.recordRTC.getBlob(), function (blob) {
                    _this.recordedFile = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
                    clearInterval(_this.recordingInterval);
                });
            });
        }
    };
    ChatsComponent.prototype.TryCall = function (selectedVisitor) {
        var _this = this;
        event.preventDefault();
        this.dialog.open(call_dialog_component_1.CallDialogComponent, {
            panelClass: ['calling-dialog'],
            data: selectedVisitor,
            disableClose: true,
            autoFocus: true
        }).afterClosed().subscribe(function (response) {
            _this._callingService.EndCall();
        });
    };
    ChatsComponent.prototype.isArray = function (obj) {
        return Array.isArray(obj);
    };
    ChatsComponent.prototype.Emoji = function ($event) {
        this.msgBody += $event;
        this.EmojiWrapper = false;
    };
    ChatsComponent.prototype.BanChat = function (event) {
        var _this = this;
        event.preventDefault();
        var conversation = JSON.parse(JSON.stringify(this.currentConversation));
        this.subscriptions.push(this.dialog.open(visitor_ban_time_component_1.VisitorBanTimeComponent, {
            panelClass: ['confirmation-dialog'],
            data: {
                sessionid: conversation.sessionid,
                deviceID: conversation.deviceID
            }
        }).afterClosed().subscribe(function (response) {
            if (response && response.hours) {
                _this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                    panelClass: ['confirmation-dialog'],
                    data: { headermsg: "Are you sure you want to Ban the Visitor " + conversation.visitorName + " for " + response.hours + " " + ((response.hours < 2) ? "hour" : "hours") + "?" }
                }).afterClosed().subscribe(function (data) {
                    if (data == 'ok') {
                        _this._chatService.BanVisitorChat(conversation.sessionid, conversation.deviceID, parseInt(response.hours)).subscribe(function (response) {
                            _this.loading = false;
                            if (response) {
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'ok',
                                        msg: 'Visitor banned successfully!'
                                    },
                                    duration: 2000,
                                    panelClass: ['user-alert', 'success']
                                });
                            }
                            else {
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'warning',
                                        msg: 'Visitor already banned!'
                                    },
                                    duration: 2000,
                                    panelClass: ['user-alert', 'error']
                                });
                            }
                        }, function (err) {
                            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                data: {
                                    img: 'warning',
                                    msg: 'Visitor banning failed!'
                                },
                                duration: 2000,
                                panelClass: ['user-alert', 'error']
                            });
                        });
                    }
                });
            }
        }));
    };
    ChatsComponent.prototype.StopChat = function (event) {
        //console.log('stopChat');
        var _this = this;
        event.preventDefault();
        // this.subscriptions.push(this.dialog.open(VisitorBanTimeComponent, {
        // 	panelClass: ['confirmation-dialog'],
        // 	data: {
        // 		sessionid: this.currentConversation.sessionid,
        // 		deviceID: this.currentConversation.deviceID
        // 	}
        // }).afterClosed().subscribe(response => {
        //if (response && response.hours) {
        // if (!this.currentConversation.tickets || (this.currentConversation.tickets && !this.currentConversation.tickets.length)) {
        // 	this.snackBar.openFromComponent(ToastNotifications, {
        // 		data: {
        // 			img: 'warning',
        // 			msg: 'Please create ticket of chat first!'
        // 		},
        // 		duration: 2000,
        // 		panelClass: ['user-alert', 'error']
        // 	});
        // }
        // else {
        var conversation = JSON.parse(JSON.stringify(this.currentConversation));
        ;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure you want to move this chat to Archive?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._chatService.StopVisitorChatRest(conversation.sessionid, conversation).subscribe(function (response) {
                    _this.loading = false;
                    if (response && response._id) {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Chat moved to archive successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    else {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'Operation failed!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'error']
                        });
                    }
                });
            }
        });
        // }
    };
    ChatsComponent.prototype.EmailTranscriptInDialoge = function (event) {
        var _this = this;
        event.preventDefault();
        this.subscriptions.push(this.dialog.open(email_chat_transcript_component_1.EmailChatTranscriptComponent, {
            panelClass: ['confirmation-dialog'],
            data: {
                email: this.agent.email
            },
            disableClose: false
        }).afterClosed().subscribe(function (response) {
            if (response && response.email) {
                _this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                    panelClass: ['confirmation-dialog'],
                    data: { headermsg: "Are you sure you want to Email the transcript to " + response.email + "?" }
                }).afterClosed().subscribe(function (data) {
                    if (data == 'ok') {
                        _this._chatService.EmailChatTranscript({ email: response.email, cid: _this.currentConversation._id }).subscribe(function (result) {
                            if (result) {
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'ok',
                                        msg: 'Transcript Sent Successfully to ' + response.email + '!'
                                    },
                                    duration: 2000,
                                    panelClass: ['user-alert', 'success']
                                });
                            }
                        }, function (err) {
                            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                data: {
                                    img: 'warning',
                                    msg: 'Transcript Sending failed!'
                                },
                                duration: 2000,
                                panelClass: ['user-alert', 'error']
                            });
                        });
                    }
                });
            }
        }));
    };
    ChatsComponent.prototype.EmailTranscript = function (event) {
        var _this = this;
        if (this.emailTranscriptForm.get('email').value && !this.emailTranscriptForm.invalid) {
            var email_1 = this.emailTranscriptForm.get('email').value;
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: "Are you sure you want to Email the transcript to " + email_1 + "?" }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this.loading = true;
                    _this._chatService.EmailChatTranscript({ email: email_1, cid: _this.currentConversation._id }).subscribe(function (result) {
                        if (result) {
                            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                data: {
                                    img: 'ok',
                                    msg: 'Transcript Sent Successfully to ' + email_1 + '!'
                                },
                                duration: 2000,
                                panelClass: ['user-alert', 'success']
                            });
                        }
                        _this.loading = false;
                    }, function (err) {
                        _this.loading = false;
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'Transcript Sending failed!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'error']
                        });
                    });
                }
                _this.emailTranscriptForm.reset();
            });
        }
    };
    ChatsComponent.prototype.ShowConversationInfo = function (conversation) {
        var _this = this;
        if (!conversation.msgFetched)
            conversation.msgFetched = false;
        if (!conversation.msgFetched && !conversation.msgList) {
            this._chatService.ShowSelectedChat(conversation).subscribe(function (data) {
                if (data) {
                    conversation.msgFetched = true;
                    conversation.msgList = data;
                    _this._chatService.UpdateChatHistory(conversation, data);
                    _this.subscriptions.push(_this.dialog.open(show_chat_info_dialog_component_1.ShowChatInfoDialogComponent, {
                        panelClass: ['responsive-dialog'],
                        disableClose: false,
                        autoFocus: true,
                        data: {
                            conversation: conversation
                        }
                    }).afterClosed().subscribe(function (response) {
                    }));
                }
            });
        }
        else {
            this.subscriptions.push(this.dialog.open(show_chat_info_dialog_component_1.ShowChatInfoDialogComponent, {
                panelClass: ['responsive-dialog'],
                disableClose: false,
                autoFocus: true,
                data: {
                    conversation: conversation
                }
            }).afterClosed().subscribe(function (response) {
            }));
        }
    };
    ChatsComponent.prototype.RegisterCustomer = function (details) {
        var _this = this;
        var currentConversation = JSON.parse(JSON.stringify(this.currentConversation));
        if (details.customerId) {
            currentConversation.RelatedCustomerInfo.map(function (x) {
                if (x.customerId == details.customerId) {
                    currentConversation.basicDataId = x.customerId;
                    currentConversation.basicDataName = x.customerName;
                    currentConversation.basicDataRank = x.customerRank;
                    currentConversation.basicDataType = x.customerType;
                    currentConversation.basicDataCountry = x.customerCountry;
                    currentConversation.salesPersonName = x.salesPersonName;
                    currentConversation.salesPersonCode = x.salesPersonCode;
                    currentConversation.salesPersonOffice = x.salesPersonOffice;
                    currentConversation.defaultPhone = x.defaultPhone;
                    currentConversation.defaultEmial = x.defaultEmial;
                    currentConversation.customerEmail = x.customerEmail;
                    currentConversation.customerPhone = x.customerPhone;
                    currentConversation.registered = 'Registered Customer';
                }
            });
            this._chatService.IsCustomerRegistered(currentConversation.registered, currentConversation._id, this.nsp).subscribe(function (result) { });
            this._chatService.InsertCustomerInfo({ customerId: currentConversation.basicDataId, customerName: currentConversation.basicDataName, customerRank: currentConversation.basicDataRank, customerType: currentConversation.basicDataType, customerEmail: currentConversation.customerEmail, customerPhone: currentConversation.customerPhone, defaultEmail: currentConversation.defaultEmail, defaultPhone: currentConversation.defaultPhone, customerCountry: currentConversation.basicDataCountry, salesPersonName: currentConversation.salesPersonName, salesPersonCode: currentConversation.salesPersonCode, salesPersonOffice: currentConversation.salesPersonOffice }, currentConversation._id, this.nsp).subscribe(function (result) {
            });
        }
        else {
            this._chatService.CustomerRegisterRest(details).subscribe(function (result) {
                if (result.response.ResultInformation[0].ResultCode == 0) {
                    _this.currentConversation.customerID = result.response.Customer[0].CustomerId;
                    _this._chatService.InsertCustomerID(_this.currentConversation.customerID, details.tid, _this.nsp).subscribe(function (result) {
                    });
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Customer Registered Successfully with ID: ' + result.response.Customer[0].CustomerId
                        },
                        duration: 10000,
                        panelClass: ['user-alert', 'success']
                    });
                    _this.loadingReg = false;
                }
                else {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: result.response.ResultInformation[0].Message
                        },
                        duration: 4000,
                        panelClass: ['user-alert', 'warning']
                    });
                    _this.clearRegForm = false;
                    _this.loadingReg = false;
                }
                var customerEmails = [];
                var basicData = [];
                var customerPhoneList = [];
                var salesPersonList = [];
                //	let registered = ''
                var realCustomerId = '';
                var realCustomerBasicData = [];
                var realCustomerEmails = [];
                var realCustomerPhone = [];
                var realCustomerSalesPerson = [];
                _this.emailList = [];
                _this.phoneList = [];
                _this.defaultEmail = '';
                _this.defaultPhone = '';
                var restOfCustomersId = [];
                var restOfCustomerBasicData = [];
                var restOfCustomerEmails = [];
                var restOfCustomerPhone = [];
                var restOfCustomerSalesPerson = [];
                var restOfCustomers = [];
                var allCustomers = [];
                setTimeout(function () {
                    _this._chatService.CheckRegisterCustomerRest('', details.tid, _this.currentConversation.customerID).subscribe(function (result) {
                        // 		//	console.log(result);
                        if (result && (result.response._id == details.tid)) {
                            //console.log(result)
                            if (result.response.ResultInformation[0].ResultCode != 0) {
                                currentConversation.registered = 'Unregistered Customer';
                                _this._chatService.IsCustomerRegistered(currentConversation.registered, details.tid, _this.nsp).subscribe(function (result) { });
                            }
                            else {
                                customerEmails = result.response.CustomerData[0].ContactMailAddressList;
                                basicData = result.response.CustomerData[0].BasicData;
                                customerPhoneList = result.response.CustomerData[0].ContactPhoneNumberList;
                                salesPersonList = result.response.CustomerData[0].SalesPersonData;
                                realCustomerId = _this.currentConversation.customerID;
                                currentConversation.registered = 'Registered Customer';
                                _this._chatService.IsCustomerRegistered(currentConversation.registered, details.tid, _this.nsp).subscribe(function (result) { });
                                basicData.map(function (x) {
                                    if (x.CustomerId == realCustomerId) {
                                        realCustomerBasicData = x;
                                        currentConversation.basicDataName = x.CustomerName;
                                        currentConversation.basicDataRank = x.CustomerRank;
                                        currentConversation.basicDataId = x.CustomerId;
                                        currentConversation.basicDataCountry = x.Country;
                                        currentConversation.basicDataType = x.CustomerType;
                                        if (x.CustomerId != realCustomerId) {
                                            restOfCustomerBasicData.push(x);
                                            restOfCustomersId.push(x.CustomerId);
                                        }
                                        return x;
                                    }
                                });
                                customerEmails.map(function (x) {
                                    if (x.CustomerId == realCustomerId)
                                        realCustomerEmails.push(x);
                                    if (x.CustomerId != realCustomerId)
                                        restOfCustomerEmails.push(x);
                                    return x;
                                });
                                customerPhoneList.map(function (x) {
                                    if (x.CustomerId == realCustomerId)
                                        realCustomerPhone.push(x);
                                    if (x.CustomerId != realCustomerId)
                                        restOfCustomerPhone.push(x);
                                    return x;
                                });
                                salesPersonList.map(function (x) {
                                    if (x.CustomerId == realCustomerId) {
                                        realCustomerSalesPerson = x;
                                        currentConversation.salesPersonName = x.UserName;
                                        currentConversation.salesPersonCode = x.UserCode;
                                        currentConversation.salesPersonOffice = x.Office;
                                    }
                                    if (x.CustomerId != realCustomerId)
                                        restOfCustomerSalesPerson.push(x);
                                    return x;
                                });
                                //  let c=0
                                // restOfCustomersId.forEach(customer => {
                                // 	let cID = ''
                                // 	let cName = ''
                                // 	let cRank = ''
                                // 	let cType = ''
                                // 	let cCountry = ''
                                // 	let cSalesName = ''
                                // 	let cSalesCode = ''
                                // 	let cSalesOffice =''
                                // 	let singleCustomerEmail = []
                                // 	let singleCustomerPhone = []
                                // 	let defaultPhone = ''
                                // 	let defaultEmail = ''
                                // 	restOfCustomerBasicData.map(x => {
                                // 		if (x.CustomerId == restOfCustomersId[c]) {
                                // 			cID = x.CustomerId
                                // 			cName = x.CustomerName
                                // 			cRank = x.CustomerRank
                                // 			cType = x.CustomerType
                                // 			cCountry = x.Country
                                // 		}
                                // 	})
                                // 	restOfCustomerSalesPerson.map(x => {
                                // 		if (x.CustomerId == restOfCustomersId[c]) {
                                // 			cSalesName = x.UserName
                                // 			cSalesCode = x.UserCode
                                // 			cSalesOffice=x.Office
                                // 		}
                                // 	})
                                // 	restOfCustomerEmails.map(x => {
                                // 		if (x.CustomerId == restOfCustomersId[c]) {
                                // 			singleCustomerEmail.push(x)
                                // 		}
                                // 	})
                                // 	if (singleCustomerEmail && singleCustomerEmail.length) {
                                // 		singleCustomerEmail.map(x => {
                                // 			if (x.Default == 1) defaultEmail =   x.MailAddress
                                // 			return x
                                // 		})
                                // 	}
                                // 	singleCustomerEmail = []
                                // 	restOfCustomerEmails.map(x => {
                                // 		if (x.CustomerId == restOfCustomersId[c]) {
                                // 			singleCustomerEmail.push(x.MailAddress)
                                // 		}
                                // 	})
                                // 	singleCustomerEmail = singleCustomerEmail.filter((n, i) => singleCustomerEmail.indexOf(n) === i);
                                // 	restOfCustomerPhone.map(x => {
                                // 		if (x.CustomerId == restOfCustomersId[c]) {
                                // 			singleCustomerPhone.push(x)
                                // 		}
                                // 	})
                                // 	if (singleCustomerPhone && singleCustomerPhone.length) {
                                // 		singleCustomerPhone.map(x => {
                                // 			if (x.Default == 1) defaultPhone = x.PhoneNumber
                                // 			return x
                                // 		})
                                // 	}
                                // 	singleCustomerPhone = []
                                // 	restOfCustomerPhone.map(x => {
                                // 		if (x.CustomerId == restOfCustomersId[c]) {
                                // 			singleCustomerPhone.push(x.PhoneNumber)
                                // 		}
                                // 	})
                                // 	singleCustomerPhone = singleCustomerPhone.filter((n, i) => singleCustomerPhone.indexOf(n) === i);
                                // 	let CustomerDetails = {
                                // 		'CustomerID': cID,
                                // 		'CustomerName': cName,
                                // 		'CustomerRank': cRank,
                                // 		'CustomerType': cType,
                                // 		'CustomerCountry': cCountry,
                                // 		'SalesPersonName': cSalesName,
                                // 		'SalesPersonCode': cSalesCode,
                                // 		'SalesPersonOffice':cSalesOffice,
                                // 		'DefaultPhone': defaultPhone,
                                // 		'DefaultEmail': defaultEmail,
                                // 		'EmailList': singleCustomerEmail,
                                // 		'PhoneList': singleCustomerPhone
                                // 	}
                                // 	allCustomers[c] = CustomerDetails
                                // c = c + 1
                                // })
                                // this._chatService.InsertSimilarCustomers(allCustomers, data._id, this.nsp).subscribe(result => {
                                // })
                                currentConversation.contactEmail = realCustomerEmails;
                                if (currentConversation.contactEmail && currentConversation.contactEmail.length) {
                                    currentConversation.contactEmail.forEach(function (x) {
                                        if (x.Default == 1)
                                            _this.emailList.unshift(x.MailAddress);
                                        else
                                            _this.emailList.push(x.MailAddress);
                                        return x;
                                    });
                                    _this.emailList = _this.emailList.filter(function (n, i) { return _this.emailList.indexOf(n) === i; });
                                    currentConversation.contactEmail.map(function (x) {
                                        if (x.Default == 1)
                                            _this.defaultEmail = x.MailAddress;
                                        return x;
                                    });
                                }
                                currentConversation.contactPhone = realCustomerPhone;
                                if (currentConversation.contactPhone && currentConversation.contactPhone.length) {
                                    currentConversation.contactPhone.forEach(function (x) {
                                        if (x.Default == 1)
                                            _this.phoneList.unshift(x.PhoneNumber);
                                        else
                                            _this.phoneList.push(x.PhoneNumber);
                                        return x;
                                    });
                                    _this.phoneList = _this.phoneList.filter(function (n, i) { return _this.phoneList.indexOf(n) === i; });
                                    currentConversation.contactPhone.map(function (x) {
                                        if (x.Default == 1)
                                            _this.defaultPhone = x.PhoneNumber;
                                        return x;
                                    });
                                }
                                if (currentConversation.registered == 'Registered Customer' && !currentConversation.CustomerInfo) {
                                    _this._chatService.InsertCustomerInfo({ customerId: currentConversation.basicDataId, customerName: currentConversation.basicDataName, customerRank: currentConversation.basicDataRank, customerType: currentConversation.basicDataType, customerEmail: _this.emailList, customerPhone: _this.phoneList, defaultEmail: _this.defaultEmail, defaultPhone: _this.defaultPhone, customerCountry: currentConversation.basicDataCountry, salesPersonName: currentConversation.salesPersonName, salesPersonCode: currentConversation.salesPersonCode, salesPersonOffice: currentConversation.salesPersonOffice }, details.tid, _this.nsp).subscribe(function (result) {
                                        //	console.log(result)
                                        if (result)
                                            _this.addTicketForm.get('subject').setValue(((currentConversation.clientID) ? (currentConversation.clientID || currentConversation._id) + ' / ' + currentConversation.CustomerInfo.customerCountry + ' / ' + currentConversation.CustomerInfo.customerId + ' / ' + currentConversation.CustomerInfo.salesPersonName + ' / ' + 'Beelinks' : ''));
                                    });
                                }
                            }
                        }
                    });
                }, 8000);
            });
        }
    };
    ChatsComponent.prototype.SearchStockList = function () {
        var currentConversation = JSON.parse(JSON.stringify(this.currentConversation));
        var details = {
            customerCountryId: this.stockListForm.get('customerCountryId').value,
            currencyId: this.stockListForm.get('currencyId').value,
            destinationCountryId: this.stockListForm.get('destinationCountryId').value,
            destinationPortId: this.stockListForm.get('destinationPortId').value,
            shipmentId: this.stockListForm.get('shipmentId').value,
            freightPaymentId: this.stockListForm.get('freightPaymentId').value,
            protectionProgramId: this.stockListForm.get('protectionProgramId').value,
            sortingTypeId: this.stockListForm.get('sortingTypeId').value,
            makerId: this.stockListForm.get('makerId').value,
            carName: this.stockListForm.get('carName').value,
            modelCode: this.stockListForm.get('modelCode').value,
            steeringId: this.stockListForm.get('steeringId').value,
            bodyTypeId: this.stockListForm.get('bodyTypeId').value,
            subBodyTypeId: this.stockListForm.get('subBodyTypeId').value,
            driveId: this.stockListForm.get('driveId').value,
            regYearFrom: this.stockListForm.get('regYearFrom').value,
            regYearTo: this.stockListForm.get('regYearTo').value,
            regMonthFrom: this.stockListForm.get('regMonthFrom').value,
            regMonthTo: this.stockListForm.get('regMonthTo').value,
            vehiclePriceFrom: this.stockListForm.get('vehiclePriceFrom').value,
            vehiclePriceTo: this.stockListForm.get('vehiclePriceTo').value,
            ccFrom: this.stockListForm.get('ccFrom').value,
            ccTo: this.stockListForm.get('ccTo').value,
            mileageFrom: this.stockListForm.get('mileageFrom').value,
            mileageTo: this.stockListForm.get('mileageTo').value,
            transmission: this.stockListForm.get('transmission').value,
            fuelId: this.stockListForm.get('fuelId').value,
            colorId: this.stockListForm.get('colorId').value,
            prodYearFrom: this.stockListForm.get('prodYearFrom').value,
            prodYearTo: this.stockListForm.get('prodYearTo').value,
            engineTypeName: this.stockListForm.get('engineTypeName').value,
            bodyLengthId: this.stockListForm.get('bodyLengthId').value,
            loadingCapacityId: this.stockListForm.get('loadingCapacityId').value,
            truckSize: this.stockListForm.get('truckSize').value,
            emissionCode3: (this.stockListForm.get('emissionCode3').value) == true ? '1' : '0',
            purchaseCountryId: this.stockListForm.get('purchaseCountryId').value,
            locationPortId: this.stockListForm.get('locationPortId').value,
            accessoryAB: (this.stockListForm.get('accessoryAB').value) == true ? '1' : '0',
            accessoryABS: (this.stockListForm.get('accessoryABS').value) == true ? '1' : '0',
            accessoryAC: (this.stockListForm.get('accessoryAC').value) == true ? '1' : '0',
            accessoryAW: (this.stockListForm.get('accessoryAW').value) == true ? '1' : '0',
            accessoryBT: (this.stockListForm.get('accessoryBT').value) == true ? '1' : '0',
            accessoryFOG: (this.stockListForm.get('accessoryFOG').value) == true ? '1' : '0',
            accessoryGG: (this.stockListForm.get('accessoryGG').value) == true ? '1' : '0',
            accessoryLS: (this.stockListForm.get('accessoryLS').value) == true ? '1' : '0',
            accessoryNV: (this.stockListForm.get('accessoryNV').value) == true ? '1' : '0',
            accessoryPS: (this.stockListForm.get('accessoryPS').value) == true ? '1' : '0',
            accessoryPW: (this.stockListForm.get('accessoryPW').value) == true ? '1' : '0',
            accessoryRR: (this.stockListForm.get('accessoryRR').value) == true ? '1' : '0',
            accessoryRS: (this.stockListForm.get('accessoryRS').value) == true ? '1' : '0',
            accessorySR: (this.stockListForm.get('accessorySR').value) == true ? '1' : '0',
            accessoryTV: (this.stockListForm.get('accessoryTV').value) == true ? '1' : '0',
            accessoryWAB: (this.stockListForm.get('accessoryWAB').value) == true ? '1' : '0',
        };
        //console.log(details.thread)
        this._chatService.StockListRest(details).subscribe(function (result) {
            //	console.log(result)
            // if(result && result.response=)
        });
    };
    ChatsComponent.prototype.ConvertChatToTIcket = function (moveToArchive) {
        var _this = this;
        if (moveToArchive === void 0) { moveToArchive = false; }
        var currentConversation = JSON.parse(JSON.stringify(this.currentConversation));
        var thread = {
            subject: this.addTicketForm.get('subject').value,
            state: this.addTicketForm.get('state').value,
            priority: this.addTicketForm.get('priority').value,
            visitor: {
                name: this.addTicketForm.get('visitor').get('name').value,
                email: this.addTicketForm.get('visitor').get('email').value,
                phone: this.addTicketForm.get('visitor').get('phone').value
            },
            viewColor: currentConversation.viewColor,
            clientID: currentConversation.clientID || currentConversation._id
        };
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure you want to convert the selected chat to ticket?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                if (!moveToArchive)
                    _this.loading = true;
                else
                    _this.loadingWithArchive = true;
                var details = {
                    cid: currentConversation._id,
                    thread: JSON.parse(JSON.stringify(thread))
                };
                _this._chatService.ConvertChatToTicket(details).subscribe(function (data) {
                    if (data) {
                        _this.ClearForm(currentConversation);
                        if (moveToArchive) {
                            _this._chatService.StopVisitorChatRest(currentConversation.sessionid, currentConversation).subscribe(function (response) {
                                if (!moveToArchive)
                                    _this.loading = false;
                                else
                                    _this.loadingWithArchive = false;
                                if (response && response._id) {
                                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                        data: {
                                            img: 'ok',
                                            msg: 'Chat moved to archive successfully!'
                                        },
                                        duration: 2000,
                                        panelClass: ['user-alert', 'success']
                                    });
                                }
                                else {
                                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                        data: {
                                            img: 'warning',
                                            msg: 'Operation failed!'
                                        },
                                        duration: 2000,
                                        panelClass: ['user-alert', 'error']
                                    });
                                }
                            });
                        }
                        else {
                            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                data: {
                                    img: 'ok',
                                    msg: 'Ticket creted successfully!'
                                },
                                duration: 2000,
                                panelClass: ['user-alert', 'success']
                            });
                            if (!moveToArchive)
                                _this.loading = false;
                            else
                                _this.loadingWithArchive = false;
                        }
                    }
                    else {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'Operation failed!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'error']
                        });
                    }
                }, function (err) {
                    if (!moveToArchive)
                        _this.loading = false;
                    else
                        _this.loadingWithArchive = false;
                });
            }
            //this.addTicketForm.reset()
        });
    };
    ChatsComponent.prototype.SuperViseChat = function (event, currentConversation) {
        event.preventDefault();
        this._appStateService.NavigateForce('/chats' + currentConversation._id);
    };
    ChatsComponent.prototype.ClearForm = function (currentConversation) {
        if (currentConversation._id == this.currentConversation._id) {
            this.addTicketForm.reset();
            this.addTicketForm.get('priority').setValue('LOW');
            this.addTicketForm.get('state').setValue('OPEN');
            this.addTicketForm.get('subject').setValue(currentConversation.clientID || currentConversation._id);
        }
    };
    // ClearRegistrationForm(currentConversation) {
    // 	if (currentConversation._id == this.currentConversation._id) {
    // 		this.registerCustomerForm.reset();
    // 	}
    // }
    ChatsComponent.prototype.EndSuperVision = function (event, visitor) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure you want to end supervising this Conversation?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._visitorService.EndSuperVisesChat(visitor.conversationID.toString(), true).subscribe(function (data) {
                    if (data && data.status == 'ok') {
                        _this._chatService.SuperVisedChatList.next(_this._chatService.SuperVisedChatList.getValue().filter(function (id) { return id != visitor.conversationID; }));
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Super Vision Ended successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    else {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'Error in ending super vision!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'error']
                        });
                    }
                });
            }
        });
    };
    ChatsComponent.prototype.CheckIfChatSuperVised = function (superVisers) {
        var _this = this;
        var supervise = false;
        if (!superVisers)
            return supervise;
        if (superVisers && superVisers.length) {
            superVisers.map(function (agents) {
                if (agents == _this.agent.csid)
                    supervise = true;
                return agents;
            });
            return supervise;
        }
    };
    ChatsComponent.prototype.SaveCustomField = function (_id, name, value) {
        var _this = this;
        this.savingCustomFields[name] = true;
        this._chatService.UpdateDynamicProperty(_id, name, value).subscribe(function (data) {
            if (data)
                _this.savingCustomFields[name] = false;
        });
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], ChatsComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], ChatsComponent.prototype, "scrollContainer", void 0);
    __decorate([
        core_1.ViewChild('chatMessage')
    ], ChatsComponent.prototype, "messageTextArea", void 0);
    ChatsComponent = __decorate([
        core_1.Component({
            selector: 'app-chats',
            templateUrl: './chats.component.html',
            styleUrls: ['./chats.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ChatsComponent);
    return ChatsComponent;
}());
exports.ChatsComponent = ChatsComponent;
//# sourceMappingURL=chats.component.js.map