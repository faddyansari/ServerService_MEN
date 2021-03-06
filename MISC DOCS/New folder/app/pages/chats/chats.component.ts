import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChatService } from '../../../services/ChatService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../services/AuthenticationService';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TransferChatDialog } from '../../dialogs/transfer-chat-dialog/transfer-chat-dialog.component';
import { GlobalStateService } from '../../../services/GlobalStateService';
import { UploadingService } from '../../../services/UtilityServices/UploadingService';
import { AdminSettingsService } from '../../../services/adminSettingsService';
import { CallDialogComponent } from '../../dialogs/call-dialog/call-dialog.component';
import { CallingService } from '../../../services/CallingService';
import { Subject } from 'rxjs/Subject';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { VisitorBanTimeComponent } from '../../dialogs/visitor-ban-time/visitor-ban-time.component';
import { Visitorservice } from '../../../services/VisitorService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { EmailChatTranscriptComponent } from '../../dialogs/email-chat-transcript/email-chat-transcript.component';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ShowChatInfoDialogComponent } from '../../dialogs/show-chat-info-dialog/show-chat-info-dialog.component';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
//import { RestService } from '../../../services/rest.service';
var RecordRTC = require('recordrtc');

@Component({
	selector: 'app-chats',
	templateUrl: './chats.component.html',
	styleUrls: ['./chats.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ChatsComponent implements OnInit, AfterViewInit {

	@ViewChild('fileInput') fileInput: ElementRef;
	@ViewChild('scrollContainer') scrollContainer: ElementRef;

	//@Input() keyBoardEvent: Subject<any>;
	arrToDialog = [];
	nsp = '';
	checkBox = false
	loadingReg = false;
	clearRegForm = false;
	removedFile: any;
	production = true;
	fileerror: string;
	subscriptions: Subscription[] = [];
	verified = true;
	error = false;
	currentConversation: any = {};
	selectedVisitor: any;
	agent: any;
	msgBody = '';
	agentName = '';
	count = 0;
	links = [];
	isDragged = false;
	showError = false;
	liveAgents: any = [];
	automatedMessagesList = [];
	countryList = [];
	countryName = '';
	filteredAutomatedMessages = [];
	ShowAttachmentAreaDnd = false;
	files = [];
	hashQuery = '';
	hashIndex = -1;
	shiftdown = false;
	ready = false;
	activeTab = 'INBOX';
	showVisitorHistorySwitch = false;

	addNewNumber = false;
	addNewEmail = false;
	checkBoxPhone = false;
	checkBoxEmail = false
	feedback = [];
	uploading = false;
	showViewHistory = true;
	fileSharePermission = true;
	file: any = undefined;
	fileValid = true;
	browsingHistory = false;
	additionalData = false;
	stockList = false;
	fileUploadParams = {
		key: '',
		acl: '',
		success_action_status: '',
		policy: '',
		"x-amz-algorithm": '',
		"x-amz-credintials": '',
		"x-amz-date": '',
		"x-amz-signature": ''

	}
	//Call Record
	mediaStream: MediaStream;
	recordRTC: any;
	seconds: number = 0;
	mins: number = 0;
	imagetarget: any;
	recordingStarted = false;
	isAudioSent = false;
	recordingInterval: any;
	recordedFile: any;
	loading = false;
	callSettings: any;
	EmojiWrapper: boolean = false;
	sbt = false;
	selectionDone = false;
	tabs = {
		"visitorHistory": true,
		"additionalData": false,
		"browsingHistory": false,
		"chatHistory": false,
		"convertChatToTicket": false,
		"emailTranscript": false,
		"stockList": true,
	}
	chatPermissions: any = {};
	updateDeliveryStatus: boolean = false

	//typing
	CheckTypingState: Subject<any> = new Subject()
	tempTypingState: boolean = false;
	subscription: Subscription[] = [];

	//tag
	public tagForm: FormGroup;

	//textArea AutoComplete
	formHashQuery: boolean = false
	tempMsgBody: string = ''
	autoGrowSyncMsgBody: string = ''


	CannedForms: any;
	actionForm: any = '';

	//Chat History
	ifMoreChats: boolean = true
	scrollHeight = 0;
	fetchingConversation: boolean = false
	uploaded = false;
	selectedChatHistory: any;

	//autoSize TextArea
	restrictAutoSize = true

	hashQuerySelected = false
	errorFile = []
	drafts = [];
	tagList = [];
	uploadingCount: number = 0

	//reactive Forms (chat to ticket)
	public addTicketForm: FormGroup;
	public emailTranscriptForm: FormGroup;
	//public registerCustomerForm: FormGroup;
	public stockListForm: FormGroup;

	@ViewChild('chatMessage') messageTextArea: ElementRef;

	emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	whiteSpace = /^\S*$/;
	numberRegex = /^([^0-9]*)$/;
	phoneNumberRegex = /^([+]{1})?\d+$/;



	// CharacterLimit = /^[0-9A-Za-z!@.,;:'"?-]{1,100}\z/;
	SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
	loadingWithArchive: boolean;
	attachmentGallery = [];
	agentPermissions: any;
	//MasterData
	country: any = [];
	customerID: any = [];
	phoneID: any = [];
	portID: any = [];
	gpp: any = [];
	carMakerID: any = [];
	carsName: any = [];
	carModel: any = [];
	carBodyID: any = [];
	carBodySubID: any = [];
	carFuelID: any = [];
	carColorID: any = [];
	purchaseCountryID: any = [];
	locationPortID: any = [];
	carBodyLengthID: any = [];
	carLoadingCapacityID: any = [];
	carTruckSizeID: any = [];
	carSortTypeID: any = [];
	countryID: any = [];
	employeeList: any = [];
	employeeId: any = '';
	autoCountry: any = '';
	autoPort: any = [];
	countryCode: any = '';
	salesAgent: any = [];
	emailList: any = [];
	phoneList: any = [];
	defaultEmail: any = '';
	defaultPhone: any = '';
	autoMake: any = ''
	autoCar: any = ''
	ccList = [
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
	]
	mileage = [
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
	]
	registrationYear = [1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987
		, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2004, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
	registrationMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	priceRangeFrom = [
		{
			"ItemCode": "1",
			"ItemName": "1??"
		},
		{
			"ItemCode": "100001",
			"ItemName": "100001??"
		},
		{
			"ItemCode": "200001",
			"ItemName": "200001??"
		},
		{
			"ItemCode": "500001",
			"ItemName": "500001??"
		},
		{
			"ItemCode": "1000001",
			"ItemName": "1000001??"
		},
		{
			"ItemCode": "2000001",
			"ItemName": "2000001??"
		},
		{
			"ItemCode": "3000001",
			"ItemName": "3000001??"
		},
		{
			"ItemCode": "4000001",
			"ItemName": "4000001??"
		},
		{
			"ItemCode": "5000001",
			"ItemName": "5000001??"
		},
		{
			"ItemCode": "6000001",
			"ItemName": "6000001??"
		},
		{
			"ItemCode": "7000001",
			"ItemName": "7000001??"
		},
		{
			"ItemCode": "8000001",
			"ItemName": "8000001??"
		},
		{
			"ItemCode": "9000001",
			"ItemName": "9000001??"
		},

	]
	priceRangeTo = [
		{
			"ItemCode": "100",
			"ItemName": "100??"
		},
		{
			"ItemCode": "100000",
			"ItemName": "100000??"
		},
		{
			"ItemCode": "200000",
			"ItemName": "200000??"
		},
		{
			"ItemCode": "500000",
			"ItemName": "500000??"
		},
		{
			"ItemCode": "1000000",
			"ItemName": "1000000??"
		},
		{
			"ItemCode": "2000000",
			"ItemName": "2000000??"
		},
		{
			"ItemCode": "3000000",
			"ItemName": "3000000??"
		},
		{
			"ItemCode": "4000000",
			"ItemName": "4000000??"
		},
		{
			"ItemCode": "5000000",
			"ItemName": "5000000??"
		},
		{
			"ItemCode": "6000000",
			"ItemName": "6000000??"
		},
		{
			"ItemCode": "7000000",
			"ItemName": "7000000??"
		},
		{
			"ItemCode": "8000000",
			"ItemName": "8000000??"
		},
		{
			"ItemCode": "9000000",
			"ItemName": "9000000??"
		},
		{
			"ItemCode": "10000000",
			"ItemName": "10000000??"
		},

	]
	package: any = {};
	fields: any[];
	savingCustomFields: any = {}
	constructor(
		public _chatService: ChatService,
		public _visitorService: Visitorservice,
		private _authService: AuthService,
		public dialog: MatDialog,
		private _appStateService: GlobalStateService,
		private _uploadingService: UploadingService,
		private _adminSettingsService: AdminSettingsService,
		private _callingService: CallingService,
		private formbuilder: FormBuilder,
		private snackBar: MatSnackBar,
		private http: Http
		//	private _restService: RestService
	) {

		this.tagForm = formbuilder.group({
			'hashTag':
				[
					null,
					[
						Validators.maxLength(20),
						Validators.required,
						Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/)
					],
				]
		});
		this.addTicketForm = formbuilder.group({
			'subject': [(this.currentConversation.clientID) ? (this.currentConversation.clientID || this.currentConversation._id) + ' ' : null, [Validators.required]],
			'state': ['OPEN', Validators.required],
			'priority': ['LOW', Validators.required],
			'visitor': formbuilder.group({
				'name': [(this.currentConversation && this.currentConversation.visitorName) ? this.currentConversation.visitorName : null, [Validators.required]],
				'phone': [(this.currentConversation && this.currentConversation.session && this.currentConversation.session.phone) ? this.currentConversation.session.phone : null],
				'email': [(this.currentConversation && this.currentConversation.visitorEmail && this.currentConversation.visitorEmail != 'Unregistered') ? this.currentConversation.visitorEmail : null,
				[
					Validators.pattern(this.emailPattern),
					Validators.required
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
		this._chatService.GetMasterData(18).subscribe(result => {
			if (result) {
				this.countryID = result.MasterData
			}
		});
		// //	console.log(this.agent)





		this.emailTranscriptForm = formbuilder.group({
			'email': [null, [
				Validators.pattern(this.emailPattern),
				Validators.required
			]],
		});


		this.stockListForm = formbuilder.group({
			'customerCountryId': ['', [Validators.required]],
			'currencyId': ['', [Validators.required]],
			'destinationCountryId': ['', [Validators.required]],
			'destinationPortId': ['', [Validators.required]],
			'shipmentId': ['', [Validators.required]],
			'freightPaymentId': ['', [Validators.required]],
			'protectionProgramId': ['', [Validators.required]],
			'sortingTypeId': ['', [Validators.required]],
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
		this.subscriptions.push(this._chatService.GetTagList().subscribe(tags => {
			this.tagList = tags
			// //console.log(this.tagList);
		}));



		this.subscription.push(_chatService.ShowAttachmentAreaDnd.subscribe(data => {
			this.ShowAttachmentAreaDnd = data;
		}));

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg;
				if (!this.package.chats.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}

			}
		}));




		//without draft
		this.subscriptions.push(this._chatService.getCurrentConversation().subscribe(data => {
			if (Object.keys(data).length) {

				if (!data.dynamicFields) data.dynamicFields = {};
				// let customerEmail = this.selectedVisitor.email
				if (data && this.currentConversation && (this.currentConversation._id != data._id)) {
					//console.log(data);



					let draft = {
						id: this.currentConversation._id,
						message: (this.msgBody) ? this.msgBody : ''
					}
					this._chatService.SetDraft(draft);

					this.vhListTabs('visitorHistory');
					this._chatService.ShowAttachmentAreaDnd.next(false)
					this.files = [];
					this.arrToDialog = []
					this.attachmentGallery = []
					this.shiftdown = false

					if (this.drafts.length) {
						let draft = this.drafts.filter(d => d.id == data._id);
						if (draft && draft.length) {
							this.msgBody = draft[0].message;
						}
						else this.msgBody = ''
					}
				}

				if (this.tagForm) this.tagForm.controls['hashTag'].setValue('');

				if (data && (this.currentConversation._id != data._id)) {


					if (!data.hasOwnProperty('registered')) {
						let custData = {
							"MailAddress": (data.visitorEmail != 'Unregistered') ? data.visitorEmail : '',
							"PhoneNumber": '',
							"StockId": '',
							"CustomerId": (data.CMID) ? data.CMID : (data.CustomerInfo && data.CustomerInfo.customerId) ? data.CustomerInfo.customerId : '',
						}

						// //Real Customer Variables
						let customerEmails = []
						let basicData = []
						let customerPhoneList = []
						let salesPersonList = []
						//	let registered = ''
						let realCustomerId = ''
						let realCustomerBasicData = []
						let realCustomerEmails = []
						let realCustomerPhone = []
						let realCustomerSalesPerson = []
						//Rest Of Customers Variables
						let restOfCustomersId = []
						let restOfCustomerBasicData = []
						let restOfCustomerEmails = []
						let restOfCustomerPhone = []

						let restOfCustomerSalesPerson = []
						let allCustomers = []


						this.emailList = []
						this.phoneList = []
						this.defaultEmail = ''
						this.defaultPhone = ''
						this._chatService.CheckRegisterCustomerRest(custData.MailAddress, data._id, custData.CustomerId).subscribe(result => {

							if (result && (result.response._id == data._id)) {
								if (result.response.ResultInformation[0].ResultCode != 0) {
									this.currentConversation.RelatedCustomerInfo = [];
									this.currentConversation.CustomerInfo = undefined;
									data.registered = 'Unregistered Customer'
									this._chatService.IsCustomerRegistered(data.registered, data._id, this.nsp).subscribe(result => { })

								}
								else {
									customerEmails = result.response.CustomerData[0].ContactMailAddressList
									basicData = result.response.CustomerData[0].BasicData
									customerPhoneList = result.response.CustomerData[0].ContactPhoneNumberList
									salesPersonList = result.response.CustomerData[0].SalesPersonData
									if (custData.CustomerId != '') realCustomerId = custData.CustomerId

									else {
										customerEmails.map(x => {
											if (x.MailAddress.toLowerCase() == data.visitorEmail.toLowerCase()) realCustomerId = x.CustomerId
											return x
										})
									}
									data.registered = (realCustomerId != '') ? 'Registered Customer' : 'UnRegistered Customer'
									//console.log(data.registered)
									this._chatService.IsCustomerRegistered(data.registered, data._id, this.nsp).subscribe(result => { })
									basicData.map(x => {
										if (x.CustomerId == realCustomerId) {
											realCustomerBasicData = x
											data.basicDataId = x.CustomerId
											data.basicDataName = x.CustomerName
											data.basicDataRank = x.CustomerRank
											data.basicDataType = x.CustomerType
											data.basicDataCountry = x.Country

										}
										if (x.CustomerId != realCustomerId) {
											restOfCustomerBasicData.push(x)
											restOfCustomersId.push(x.CustomerId)
										}
										return x
									})
									customerEmails.map(x => {
										if (x.CustomerId == realCustomerId) realCustomerEmails.push(x)
										if (x.CustomerId != realCustomerId) restOfCustomerEmails.push(x)
										return x
									})
									customerPhoneList.map(x => {
										if (x.CustomerId == realCustomerId) realCustomerPhone.push(x)
										if (x.CustomerId != realCustomerId) restOfCustomerPhone.push(x)
										return x
									})
									salesPersonList.map(x => {
										if (x.CustomerId == realCustomerId) {
											realCustomerSalesPerson = x
											data.salesPersonName = x.UserName
											data.salesPersonCode = x.UserCode
											data.salesPersonOffice = x.Office
										}
										if (x.CustomerId != realCustomerId) restOfCustomerSalesPerson.push(x)
										return x

									});
									if (restOfCustomersId && restOfCustomersId.length) {
										console.log("v", restOfCustomersId);

										let c = 0
										restOfCustomersId.forEach(customer => {
											let cID = ''
											let cName = ''
											let cRank = ''
											let cType = ''
											let cCountry = ''
											let cSalesName = ''
											let cSalesCode = ''
											let cSalesOffice = ''
											let singleCustomerEmail = []
											let singleCustomerPhone = []
											let defaultPhone = ''
											let defaultEmail = ''
											restOfCustomerBasicData.map(x => {
												if (x.CustomerId == restOfCustomersId[c]) {
													cID = x.CustomerId
													cName = x.CustomerName
													cRank = x.CustomerRank
													cType = x.CustomerType
													cCountry = x.Country
												}
											})
											restOfCustomerSalesPerson.map(x => {
												if (x.CustomerId == restOfCustomersId[c]) {
													cSalesName = x.UserName
													cSalesCode = x.UserCode
													cSalesOffice = x.Office

												}
											})
											restOfCustomerEmails.map(x => {
												if (x.CustomerId == restOfCustomersId[c]) {
													singleCustomerEmail.push(x)
												}
											})
											if (singleCustomerEmail && singleCustomerEmail.length) {

												singleCustomerEmail.map(x => {
													if (x.Default == 1) defaultEmail = x.MailAddress
													return x
												})

											}
											singleCustomerEmail = []

											restOfCustomerEmails.map(x => {
												if (x.CustomerId == restOfCustomersId[c]) {
													if (x.Default == 1) singleCustomerEmail.unshift(x.MailAddress)
													else singleCustomerEmail.push(x.MailAddress)
												}
											})
											singleCustomerEmail = singleCustomerEmail.filter((n, i) => singleCustomerEmail.indexOf(n) === i);

											restOfCustomerPhone.map(x => {
												if (x.CustomerId == restOfCustomersId[c]) {
													singleCustomerPhone.push(x)
												}
											})
											if (singleCustomerPhone && singleCustomerPhone.length) {

												singleCustomerPhone.map(x => {
													if (x.Default == 1) defaultPhone = x.PhoneNumber
													return x
												})

											}
											singleCustomerPhone = []

											restOfCustomerPhone.map(x => {
												if (x.CustomerId == restOfCustomersId[c]) {
													if (x.Default == 1) singleCustomerPhone.unshift(x.PhoneNumber)
													else singleCustomerPhone.push(x.PhoneNumber)
												}
											})
											singleCustomerPhone = singleCustomerPhone.filter((n, i) => singleCustomerPhone.indexOf(n) === i);
											//	console.log(singleCustomerPhone)
											//	console.log(singleCustomerEmail)
											let CustomerDetails = {
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
											}

											allCustomers[c] = CustomerDetails
											c = c + 1
										})
										if (!data.RelatedCustomerInfo) this._chatService.InsertSimilarCustomers(allCustomers, data._id, this.nsp).subscribe(result => {

										})
									}
									data.contactEmail = realCustomerEmails
									if (data.contactEmail && data.contactEmail.length) {
										data.contactEmail.forEach(x => {
											if (x.Default == 1) this.emailList.unshift(x.MailAddress)
											else this.emailList.push(x.MailAddress);
											return x
										})
										this.emailList = this.emailList.filter((n, i) => this.emailList.indexOf(n) === i);
										data.contactEmail.map(x => {
											if (x.Default == 1) this.defaultEmail = x.MailAddress
											return x
										})

									}
									data.contactPhone = realCustomerPhone
									if (data.contactPhone && data.contactPhone.length) {
										data.contactPhone.forEach(x => {
											if (x.Default == 1) this.phoneList.unshift(x.PhoneNumber)
											this.phoneList.push(x.PhoneNumber);
											return x
										})
										this.phoneList = this.phoneList.filter((n, i) => this.phoneList.indexOf(n) === i);

										data.contactPhone.map(x => {
											if (x.Default == 1) this.defaultPhone = x.PhoneNumber
											return x
										})
									}

									if (data.registered == 'Registered Customer' && !data.CustomerInfo) {
										this._chatService.InsertCustomerInfo({ customerId: data.basicDataId, customerName: data.basicDataName, customerRank: data.basicDataRank, customerType: data.basicDataType, customerEmail: this.emailList, customerPhone: this.phoneList, defaultEmail: this.defaultEmail, defaultPhone: this.defaultPhone, customerCountry: data.basicDataCountry, salesPersonName: data.salesPersonName, salesPersonCode: data.salesPersonCode, salesPersonOffice: data.salesPersonOffice }, data._id, this.nsp).subscribe(result => {
											//	console.log(result)
										})
									}
								}

							}


						})
					}

				}

				this.currentConversation = data;

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
				this.countryName = ''
				if (this.selectedVisitor && this.selectedVisitor.fullCountryName) {
					this.countryID.map(x => {
						if (x.ItemName.toUpperCase() == (this.selectedVisitor.fullCountryName).toUpperCase()) {
							this.countryName = x.ItemName;
							return x
						}
						// else this.countryName = ''
					})
				}
				else if (data && data.session && data.session.fullCountryName) {
					this.countryID.map(x => {
						if (x.ItemName.toUpperCase() == data.session.fullCountryName.toUpperCase()) {
							this.countryName = x.ItemName;
							return x
						}
						// else this.countryName = ''
					})
				}
				else {
					this.countryName = ''
				}

				this.addTicketForm.controls['visitor'].get('name').setValue((data && data.visitorName) ? data.visitorName : '');
				this.addTicketForm.controls['visitor'].get('email').setValue((data && data.visitorEmail) ? data.visitorEmail : '');
				this.addTicketForm.controls['visitor'].get('phone').setValue((data && data.session && data.session.phone) ? data.session.phone : '');
				// this.stockListForm.get('customerCountryId').setValue('37')
				// this.stockListForm.get('currencyId').setValue('1')
				// this.stockListForm.get('destinationCountryId').setValue('37')
				// this.stockListForm.get('shipmentId').setValue('1')
				// this.stockListForm.get('freightPaymentId').setValue('0')
				// this.stockListForm.get('protectionProgramId').setValue('0')
				// this.stockListForm.get('sortingTypeId').setValue('0')

				if (data && data.CustomerInfo) this.addTicketForm.get('subject').setValue(((data.clientID) ? (data.clientID || data._id) + ' / ' + data.CustomerInfo.customerCountry + ' / ' + data.CustomerInfo.customerId + ' / ' + data.CustomerInfo.salesPersonName + ' / ' + 'Beelinks' : ''));
				else
					this.addTicketForm.get('subject').setValue((data.clientID) ? (data.clientID || data._id) + ' ' : '');


				if (this.selectedVisitor && this.selectedVisitor.fullCountryName) {
					this.countryID.map(x => {
						if (x.ItemName.toLowerCase() == (this.selectedVisitor.fullCountryName).toLowerCase()) this.countryCode = x.PhoneCountryCode;
						return x
					})
				}
				else if (data && data.session && data.session.fullCountryName) {
					this.countryID.map(x => {
						if (x.ItemName.toLowerCase() == data.session.fullCountryName.toLowerCase()) this.countryCode = x.PhoneCountryCode;
						return x
					})
				}
				else {
					this.countryCode = ''
				}

				// console.log('code',this.countryCode)

				if (this.currentConversation.state == 4) {
					if (this.currentConversation.feedback && this.currentConversation.feedback.Q2 && !isNaN(this.currentConversation.feedback.Q2)) {
						this.feedback = Array(parseInt(this.currentConversation.feedback.Q2)).fill(1);
					}
				}
				if (data && (data as Object).hasOwnProperty('_id')) {
					//setTimeout(() => {
					this.restrictAutoSize = false
					// 	this._appStateService.selectingThread.next(false)
					//}, 0);
				}

			}
			else this.currentConversation = {};


		}));

	}

	ngOnInit() {

		this._appStateService.displayChatBar(false);


		this.subscriptions.push(this._authService.SBT.subscribe(data => {
			this.sbt = data;
		}));

		this.subscriptions.push(this._chatService.selectedChatHistory.subscribe(data => {
			this.selectedChatHistory = data;
		}));

		this.subscriptions.push(this._uploadingService.getRemovedFile().subscribe(data => {
			if (data) {
				this.removedFile = data;
			}
			else {
				this.removedFile = undefined;
			}
		}));

		this.subscriptions.push(this._authService.Production.subscribe(production => {
			this.production = production;
		}));

		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {



			if (settings && Object.keys(settings).length) this.verified = settings.verified;
			if (settings && settings.permissions) {
				this.chatPermissions = settings.permissions.chats;
				this.agentPermissions = settings.permissions.agents;
			}
			this.automatedMessagesList = settings.automatedMessages;
		}));

		this.subscriptions.push(this._authService.Agent.subscribe(data => {
			this.agent = data;
			this.nsp = data.nsp;
			this._chatService.GetMasterData(19).subscribe(result => {
				if (result) {
					this.employeeList = result.MasterData;
					this.employeeList.map(val => {
						if (val.EmailAddress == this.agent.email) {
							this.agentName = val.EmployeeName;
						}
					});
				}
			})

		}));

		this.subscriptions.push(this._chatService.GetSelectedVisitor().subscribe(selectedVisitor => {

			this.selectedVisitor = selectedVisitor;
		}));

		this.subscriptions.push(this._chatService.customFields.subscribe(fields => {


			this.fields = fields;


		}));
		this.subscriptions.push(this._chatService.getActiveTab().subscribe(tab => {
			this.activeTab = tab;

		}));
		this.subscriptions.push(this._adminSettingsService.getFileSharingSettings().subscribe(fileSharingSettings => {
			this.fileSharePermission = fileSharingSettings;
		}));
		this.subscriptions.push(this._adminSettingsService.callSettings.subscribe(data => {
			this.callSettings = data;
		}));


		this.subscriptions.push(this._chatService.tempTypingState.subscribe(data => {
			this.tempTypingState = data;
		}));

		this.subscriptions.push(this.CheckTypingState.debounceTime(500).subscribe(data => {


			if (!this.msgBody.trim()) {
				this._chatService.SendTypingEventRest({ state: false, conversation: data }).subscribe(data => {
					this._chatService.tempTypingState.next(false)
				})
			}
			else if (this.msgBody.trim().length > 1 && !this.tempTypingState) {
				this._chatService.SendTypingEventRest({ state: true, conversation: data }).subscribe(data => {
					this._chatService.tempTypingState.next(true)
				})
			}
			else {
				if (this.msgBody.trim().length < 2 && !this.tempTypingState) {
					this._chatService.SendTypingEventRest({ state: true, conversation: data }).subscribe(data => {
						this._chatService.tempTypingState.next(true)
					})
				}
			}
		}));

		this.subscriptions.push(this._appStateService.shortcutEvents.subscribe(data => {


			this._chatService.SelectConversation(data, this.activeTab);


		}));

		this.subscriptions.push(this._chatService.CannedForms.subscribe(forms => {


			if (forms && forms.length) {

				this.CannedForms = forms;
				this.CannedForms.map(forms => {
					if (forms.formName.indexOf('##') == -1) forms.formName = '##' + forms.formName
					return forms
				});

			}


		}));

		this.subscriptions.push(this._appStateService.resizeEvent.subscribe(data => {

			this.showViewHistory = data;
		}));

		this.subscriptions.push(this._chatService.messageDrafts.subscribe(data => {
			this.drafts = data;
		}));

		this.subscription.push(this._chatService.notification.subscribe(notification => {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: notification.img,
					msg: notification.msg
				},
				duration: 3000,
				panelClass: ['user-alert', 'warning']
			})
		}))

	}


	RemoveDuplicateTags(array) {

		let arr = {};
		array.map(value => { arr[value] = value });
		return Object.keys(arr);

	}

	selectTag(event) {
		if (event.target && event.target.value) {
			if (this.tagList.indexOf(event.target.value) !== -1) {
				let hashTag = event.target.value.split('#')[1]
				//let commaseparatedTags = this.RemoveDuplicateTags((hashTag as string).split(','));
				if (this.currentConversation.tags && this.currentConversation.tags.length) {
					if (!this.currentConversation.tags.includes(hashTag)) {

						this._chatService.addConversationTags(this.currentConversation._id, [hashTag]).subscribe(response => {
							if (response.status == 'ok') {

							}
						})
					}
					else {
						this.snackBar.openFromComponent(ToastNotifications, {
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
					this._chatService.addConversationTags(this.currentConversation._id, [hashTag]).subscribe(response => {
						if (response.status == 'ok') {

						}
					})
				}

				this.tagForm.reset();
			}
		}
	}


	addTags() {

		let hashTag = this.tagForm.get('hashTag').value

		let commaseparatedTags = this.RemoveDuplicateTags((hashTag as string).split(','));

		this._chatService.addConversationTags(this.currentConversation._id, commaseparatedTags).subscribe(response => {
			if (response.status == 'ok') {

			}
		})
		this.tagForm.reset();
	}

	DeleteTag(index) {

		this._chatService.deleteConversationTag(this.currentConversation.tags[index], index, this.currentConversation._id);
	}

	ngAfterViewInit() {

		if (this.scrollContainer && this.scrollContainer.nativeElement) {
			this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
		}
	}


	// ScrollChanged($event: UIEvent) {

	// 	if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
	// 		if (!this.selectedChatHistory.noMoreChats && this.selectedChatHistory.conversations) this._chatService.getMoreConversationsFromBackend(this.selectedChatHistory.deviceID, this.selectedChatHistory.conversations[this.selectedChatHistory.conversations.length - 1]._id);
	// 	}
	// 	this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
	// }
	ngAfterViewChecked() {
		//Called after every check of the component's view. Applies to components only.
		//Add 'implements AfterViewChecked' to the class.
		if (this.loading && this.scrollContainer && this.scrollContainer.nativeElement) {
			this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
		}
	}

	CheckAttachmentType(data) {
		return (typeof data === 'string');
	}

	ngOnDestroy() {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
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
	}

	onSelectionChanged(responseText: MatAutocompleteSelectedEvent) {
	}

	filterInput(autocompleteString: string) {
		this.filteredAutomatedMessages = this.automatedMessagesList.filter(automatedMessage => {
			if (automatedMessage.hashTag.toLowerCase().indexOf(autocompleteString) != -1 && autocompleteString) {
				return automatedMessage;
			}
		})
	}

	//for Canned Forms
	filterInput1(autocompleteString: string) {
		if (this.formHashQuery) {
			// this.filteredAutomatedMessages = []
			this.filteredAutomatedMessages = this.CannedForms.filter(forms => {
				if (forms.formName.toLowerCase().indexOf(autocompleteString.toLowerCase()) != -1 && autocompleteString) {
					return forms;
				}
			})
		}
		else {
			this.filteredAutomatedMessages = this.automatedMessagesList.filter(automatedMessage => {

				if (automatedMessage.hashTag.toLowerCase().indexOf(autocompleteString.toLowerCase()) != -1 && autocompleteString) {
					return automatedMessage;
				}
			})
		}
	}

	clearinputFilter() {
		this.hashQuery = '';
		this.hashIndex = -1;
		this.caretPosition = -1;
	}

	//typingEvent
	TypingEvent(e: Event) {
		this.CheckTypingState.next(this.currentConversation)
		this.tempMsgBody = this.msgBody
	}

	setShift() {
		if (this.hashQuerySelected) {
			this.hashQuery = '';
			this.hashQuerySelected = false
		}

	}
	keydown(event: KeyboardEvent) {
		switch (event.key.toLowerCase()) {
			case 'shift':
				this.shiftdown = true;
				break;
			case 'enter':
				if (!this.msgBody && !this.shiftdown) {
					event.preventDefault();
				}
				else if (!this.shiftdown) return false
				break;
		}
	}

	keydown1(event: KeyboardEvent) {

		switch (event.key.toLowerCase()) {
			case 'shift':
				this.shiftdown = true;
				break;
			case 'enter':
				if (this.actionForm && this.actionForm.length) {
					this.shiftdown = false
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

	}

	keyup(event: KeyboardEvent) {

		if (this.hashQuery) {

			switch (event.key.toLowerCase()) {
				case 'backspace':
					{
						if (this.autoComplete) {
							this.clearinputFilter();
						} else {
							this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
						}
						break;
					}

				case 'arrowleft':
				case 'arrowright':
				case ' ':
				case 'enter':
					{
						if (this.shiftdown) this.shiftdown = false;
						(event.target as HTMLTextAreaElement).selectionStart = this.caretPosition;
						(event.target as HTMLTextAreaElement).selectionEnd = this.caretPosition;
						this.clearinputFilter();
						break;
					}
				default:
					//////console.log('default 1');
					(event.target as HTMLTextAreaElement).focus()
					break;
			}


		} else {
			switch (event.key.toLowerCase()) {
				case 'enter':
					{
						if (this.shiftdown) {
							event.preventDefault();
						} else {
							let id = this.currentConversation._id
							this._chatService.DeleteDraft(id)
							this.SendMessage();
						}
						break;
					}
				case 'shift':
					{
						setTimeout(() => {
							this.shiftdown = false;
						}, 100);
						break;
					}
			}

		}

		this.filterInput(this.hashQuery);
	}

	//for Canned Forms
	keyup1(event: KeyboardEvent) {


		if (this.hashQuery && !this.formHashQuery) {
			//////console.log("keyup 1");
			switch (event.key.toLowerCase()) {
				case 'backspace':
					{
						//////console.log("keyup backspace");
						if (this.autoComplete) {
							this.clearinputFilter();
						} else {

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
						if (this.shiftdown) this.shiftdown = false;
						(event.target as HTMLTextAreaElement).selectionStart = this.caretPosition;
						(event.target as HTMLTextAreaElement).selectionEnd = this.caretPosition;
						this.clearinputFilter();
						break;
					}
				default:
					//////console.log('default 1');
					(event.target as HTMLTextAreaElement).focus()
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
						this.hashIndex = (event.target as HTMLTextAreaElement).selectionStart - 1;
					}
					// }
					break;

				case 'arrowleft':
				case 'arrowright':
				case ' ':
				case 'enter':
					{
						//////console.log("keyup enter");
						if (this.shiftdown) this.shiftdown = false;
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
						} else {

							this.SendMessage();
							this._chatService.DeleteDraft(this.currentConversation._id)
						}
						break;
					}


				case 'shift':
					{
						//////console.log("keyup 3 shift");
						setTimeout(() => {
							this.shiftdown = false;
						}, 100);
						break;
					}

				default:
					break;
			}

		}
		if (this.hashQuerySelected) {
			this.hashQuery = '';
			this.hashQuerySelected = false
		}
		//////console.log(this.hashQuery);
		this.filterInput(this.hashQuery);
	}


	ItemSelected(event) {


		this.caretPosition = this.hashIndex + event.option.value.length;
		let hashQueryFilter = this.hashQuery.split('#')[1];
		this.msgBody = (event.option.value) ? this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length) : this.tempMsgBody.slice(0, this.hashIndex) + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length)
		this.hashQuerySelected = true
		if (this.shiftdown) this.shiftdown = false;

		this.filteredAutomatedMessages = []
		this.formHashQuery = false
	}

	ItemSelected1(event) {

		if (this.formHashQuery && event.option.value) {

			let hashQueryFilter = this.hashQuery.split('##')[1];
			this.caretPosition = this.hashIndex - 1;

			this.msgBody = ((this.tempMsgBody) ? this.tempMsgBody.slice(0, this.hashIndex - 1) : '') + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length);
			this.actionForm = this.CannedForms.filter(form => { return form.formName == event.option.value })
			if (this.actionForm && this.actionForm.length > 0) {
				this.hashQuerySelected = true
				if (this.shiftdown) this.shiftdown = false;
				this._chatService.ShowAttachmentAreaDnd.next(true);
			}
		}
		else if (!this.formHashQuery) {

			this.caretPosition = this.hashIndex + event.option.value.length;
			let hashQueryFilter = this.hashQuery.split('#')[1];
			this.msgBody = (event.option.value) ? this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length) : this.tempMsgBody.slice(0, this.hashIndex) + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length)
			this.hashQuerySelected = true
			if (this.shiftdown) this.shiftdown = false;
		}
		this.filteredAutomatedMessages = []
		this.formHashQuery = false

	}


	autoComplete = true;
	caretPosition = -1;
	keyPress(event: KeyboardEvent) {
		if (event.key == '#') {
			this.hashQuery = '#';
			this.hashIndex = (event.target as HTMLTextAreaElement).selectionStart;
		} else if (this.hashQuery) {
			this.hashQuery += event.key;
		}
	}

	//for Canned Forms
	// autoComplete = true;
	// caretPosition = -1;
	keyPress1(event: KeyboardEvent) {
		if (event.key == '#') {
			if (this.hashQuery == '#') {
				this.formHashQuery = true
				this.hashQuery = '##'
				this.hashIndex = (event.target as HTMLTextAreaElement).selectionStart;
			}
			else if (this.hashQuery == '') {
				this.hashQuery = '#';
				this.hashIndex = (event.target as HTMLTextAreaElement).selectionStart;
			}
			else {
				this.hashQuery += event.key;
			}
		}
		else if (this.hashQuery) {
			this.hashQuery += event.key;
		}
	}



	stopRecording() {
		if (!this.isAudioSent && !this.recordedFile) {
			this.seconds = 0;
			this.mins = 0;
			this.recordingStarted = false;
			this.loading = true;
			this.recordRTC.stopRecording(() => {
				// let recording = this.recordRTC.getBlob();
				this._uploadingService.getSeekableBlob(this.recordRTC.getBlob(), (blob) => {
					let file = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
					if (file && !this.uploading) {
						this.uploading = true;
						this._uploadingService.SignRequest(file, 'SendAttachMent').subscribe(response => {
							let params = JSON.parse(response.text());
							params.file = file;
							this._uploadingService.uploadAttachment(params).subscribe(s3response => {
								if (s3response.status == '201') {

									this._uploadingService.parseXML(s3response.text()).subscribe(json => {

										this._chatService.SendAttachment(this.currentConversation.sessionid, {
											from: this.agent.nickname,
											to: this.currentConversation.sessionid,
											body: [{ filename: file.name, path: json.response.PostResponse.Location[0] }],
											cid: this.currentConversation._id,
											attachment: true,
											filename: file.name
										}, file.name).subscribe(res => { }, err => { });
										this.file = '';
										this.fileInput.nativeElement.value = '';
										this.uploading = false;
										this.loading = false;
									}, err => {
										this.uploading = false;
										this.loading = false;
									});
								}
							}, err => {
								this.uploading = false;
								this.loading = false;
							});
						}, err => {
							this.uploading = false;
							this.loading = false;
							this.fileValid = false;
							setTimeout(() => [
								this.fileValid = true
							], 3000);
						});
					}
					// saveAs(file, 'stream'+ new Date().getTime() + '.mp3');
					this.mediaStream.getTracks()[0].stop();
					this.isAudioSent = true;
					clearInterval(this.recordingInterval);
				});
			});
		} else if (this.recordedFile) {
			this.uploading = true;
			this._uploadingService.SignRequest(this.recordedFile, 'SendAttachMent').subscribe(response => {
				let params = JSON.parse(response.text());
				params.file = this.recordedFile;
				this._uploadingService.uploadAttachment(params).subscribe(s3response => {
					if (s3response.status == '201') {
						this._uploadingService.parseXML(s3response.text()).subscribe(json => {
							this._chatService.SendAttachment(this.currentConversation.sessionid, {
								from: this.agent.nickname,
								to: this.currentConversation.sessionid,
								body: [{ filename: this.recordedFile.name, path: json.response.PostResponse.Location[0] }],
								cid: this.currentConversation._id,
								attachment: true,
								filename: this.recordedFile.name
							}, this.recordedFile.name).subscribe(res => { }, err => { });
							this.recordedFile = undefined;
							this.fileInput.nativeElement.value = '';
							this.uploading = false;
							this.loading = false;
							this.mediaStream.getTracks()[0].stop();
							this.isAudioSent = true;
							clearInterval(this.recordingInterval);
						}, err => {
							this.uploading = false;
							this.loading = false;
						});
					}
				}, err => {
					this.uploading = false;
					this.loading = false;
				});
			}, err => {
				this.uploading = false;
				this.loading = false;
				this.fileValid = false;
				setTimeout(() => [
					this.fileValid = true
				], 3000);
			});
		}
	}

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
	keyDownFunction(event: MouseEvent) {
		if (event.which == 1) {
			let result
			let ev = new KeyboardEvent("keydown", {
				shiftKey: false,
				bubbles: true,
				cancelable: false,
				key: "Enter",
			});
			result = (this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(ev);
			let ev1 = new KeyboardEvent("keypress", {
				shiftKey: false,
				bubbles: true,
				cancelable: false,
				key: "Enter",
			});
			result = (this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(ev1);

			let ev3 = new KeyboardEvent("keyup", {
				shiftKey: false,
				bubbles: true,
				cancelable: false,
				key: "Enter",
			});
			this.keyup((ev3 as KeyboardEvent));
		}
	}

	SendMessageSingleAttach(file, conversation) {
		this.uploading = true
		let galleryIndex = this.attachmentGallery.findIndex(w => w.name == file.name);
		if (galleryIndex != -1) {
			this.attachmentGallery[galleryIndex].uploading = true;
		}
		this._uploadingService.GenerateLinksForFiles(file, 'SendAttachMent').subscribe(response => {
			if (response) {

				this.uploadingCount = this.uploadingCount - 1
				if (this.uploadingCount == 0) {

					this.uploading = false
				}
				if (!response.error) {
					this._chatService.SendAttachment(conversation.sessionid, {
						from: this.agent.nickname,
						to: conversation.sessionid,
						body: [response],
						cid: conversation._id,
						attachment: true,
						form: this.actionForm
					}, file.name).subscribe(res => { }, err => { });

					let galleryIndex = this.attachmentGallery.findIndex(w => w.name == file.name);
					if (galleryIndex != -1) {
						this.attachmentGallery[galleryIndex].uploading = false;
						this.attachmentGallery.splice(galleryIndex, 1);
					}
					let fileIndex = this.files.findIndex(w => w.name == file.name);
					if (fileIndex != -1) this.files.splice(fileIndex, 1);


				} else {
					file.error = true;
					let ind = this.attachmentGallery.findIndex(w => w.name == file.name);
					if (ind != -1) {
						this.attachmentGallery[ind].uploading = false;
						this._uploadingService.ShowAttachmentError(response.error).subscribe(value => {
							this.attachmentGallery[ind].error = value;
						});
					}


				}
			}
		}, err => {
			let ind = this.attachmentGallery.findIndex(w => w.name == file.name);
			if (ind != -1) {
				this.attachmentGallery[ind].uploading = false;
				this.attachmentGallery[ind].error = 'error in uploading';
			}

		});
	}

	public SendMessage() {
		////console.log(this.files);
		let conversation = JSON.parse(JSON.stringify(this.currentConversation));
		if (conversation && conversation.state < 3) {
			if (this.files && this.files.length && !this.uploading) {
				this.uploadingCount = this.files.length
				this.files.map((file) => {
					this.SendMessageSingleAttach(file, conversation);
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
			this._chatService.SendTypingEventRest({ state: false, conversation: conversation }).subscribe(data => {
				this._chatService.tempTypingState.next(false)

			})
			this._chatService.setAutoScroll(true);
			this._chatService.conversationSeen();

			//for Action Forms
			if (this.files && !this.files.length && this.actionForm) {
				// this.ShowAttachmentAreaDnd = false;
				this._chatService.ShowAttachmentAreaDnd.next(false);
				this.actionForm = ''
			}
			setTimeout(() => {
				let event = new KeyboardEvent("keydown", {
					shiftKey: false,
					bubbles: true,
					cancelable: false,
					key: "Enter",
				});
				if (this.messageTextArea && this.messageTextArea.nativeElement) {
					(this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(event);
					this.messageTextArea.nativeElement.focus();
				}
			}, 0);

		}
	}


	public TransferChat(event: Event, location: string) {
		let currentConversation = JSON.parse(JSON.stringify(this.currentConversation));
		event.preventDefault();
		this._chatService.GetLiveAgent(location).subscribe(data => {
			if (data && data.length) {

				this.dialog.open(TransferChatDialog, {
					panelClass: ['responsive-dialog'],
					data: data
				}).afterClosed().subscribe(selectedAgent => {
					if (selectedAgent) {
						if (selectedAgent.id != 'dummy') {
							this._chatService.TransferChatRest({ id: selectedAgent.id, name: selectedAgent.nickname }, currentConversation.sessionid).subscribe();
						}
					}
				});
			} else {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'warning',
						msg: 'No Agents Available to Transfer'
					},
					duration: 3000,
					panelClass: ['user-alert', 'warning']
				});
			}
		});
	}

	public OpenViewHistory() {
		this.showViewHistory = true;
	}
	public CloseViewHistory() {
		this.showViewHistory = false;
	}

	public EndChat(event: Event) {
		event.preventDefault();
		let conversation = JSON.parse(JSON.stringify(this.currentConversation));
		//console.log('endChat');
		// if (confirm('Are you sure you want to Stop the Chat')) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure you want to End the Chat " + conversation.clientID + "?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._chatService.EndChatRest(conversation).subscribe(data => {
					if (!data) {
						this.snackBar.openFromComponent(ToastNotifications, {
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
	}

	public ShowVisitorHistoryPanel() {
		this.showVisitorHistorySwitch = !this.showVisitorHistorySwitch;
	}
	public toggleBrowsingHistory() {
		this.browsingHistory = !this.browsingHistory;
	}
	public toggleAdditionalData() {
		this.additionalData = !this.additionalData;
	}
	public toggleStockList() {
		this.stockList = !this.stockList;
	}


	vhListTabs(tabName) {

		Object.keys(this.tabs).map(k => {
			if (k == tabName) {
				this.tabs[k] = true
			} else {
				this.tabs[k] = false
			}
		});
	}

	public FileSelected(event: Event) {
		this._chatService.ShowAttachmentAreaDnd.next(false);
		// this.fileValid = true;
		for (let i = 0; i < this.fileInput.nativeElement.files.length; i++) {
			if (this.fileInput.nativeElement.files.length > 0) {
				this.files.push(this.fileInput.nativeElement.files[i]);
				// this.files = this.files.concat(this.fileInput.nativeElement.files[i]);
			}
		}

		this.readURL(this.files).subscribe(response => {
			if (response.status == 'ok') {
				this._chatService.ShowAttachmentAreaDnd.next(true);
				//	if (!this.uploading) this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.currentConversation.arrToDialog);
			}
		});

		setTimeout(() => {
		}, 0);


		////console.log(this.files);

	}

	readURL(files): Observable<any> {
		return new Observable((observer) => {
			this.attachmentGallery = [];

			this._uploadingService.readURL(files).subscribe(data => {
				////console.log('readURL')
				if (data) {
					this.attachmentGallery = data;
					observer.next({ status: 'ok' });
					observer.complete();
				}

			})
		});
	}

	readURL1(files): Observable<any> {
		return new Observable((observer) => {
			this.currentConversation.arrToDialog = [];
			if (files && files.length) {
				files.map(file => {
					this.attachmentGallery = [];
					let picReader = new FileReader();
					picReader.addEventListener("load", (event: any) => {
						//console.log('file url load');
						this.imagetarget = event.target.result;
						let obj = { url: this.imagetarget, name: file.name };
						this.attachmentGallery.push(obj);
					});
					picReader.readAsDataURL(file);
				})
				observer.next({ status: 'ok' });
				observer.complete();
			}
		});
	}


	public ClearFile() {
		this.file = undefined;
		this.files = [];
		this.fileInput.nativeElement.value = '';
	}
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
	onClear(event) {

		if (event.clearActionForm) {
			this.actionForm = ''
			if (this.files && !this.files.length) this._chatService.ShowAttachmentAreaDnd.next(false);
		}
		else if (event.clearAll) {
			this.fileInput.nativeElement.value = '';
			this._chatService.ShowAttachmentAreaDnd.next(false);
			this.uploading = false;
			this.fileValid = false;
			this.files = [];
		} else if (event.fileToRemove) {
			let index = this.files.findIndex(w => w.name == event.fileToRemove.name);
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
	}


	//DRAG AND DROP FUNCTIONS

	public OnDragOver(event) {

		if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2) return false;
		this.isDragged = true;

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

	}

	public onDragLeave(event) {

		if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2) return false;
		this.isDragged = false;

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
	}

	public onDrop(event) {

		if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2) return false;
		this.isDragged = false;

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		this._chatService.ShowAttachmentAreaDnd.next(false);
		this.fileValid = true;
		if (event.dataTransfer.items) {
			for (let i = 0; i < event.dataTransfer.items.length; i++) {
				if (event.dataTransfer.items[i].kind === "file") {
					let file = event.dataTransfer.items[i].getAsFile();
					this.files = this.files.concat(file);
				}
			}
		}
		this.readURL(this.files).subscribe(response => {
			if (response.status == 'ok') {
				this._chatService.ShowAttachmentAreaDnd.next(true);
				// this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);

			}
		});
		setTimeout(() => {
			// this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
			// this._chatService.ShowAttachmentAreaDnd.next(true);
		}, 0);

	}

	//VoiceNotes
	startRecording() {

		try {

			if (this.currentConversation && this.currentConversation.state < 3) {
				this.isAudioSent = false;
				this.recordingStarted = true;
				navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
					this.mediaStream = stream;
					this.recordRTC = RecordRTC(stream, {
						type: 'audio'
					});

					this.recordRTC.startRecording();
					this.recordingInterval = setInterval(() => {
						this.seconds++;
						if (this.seconds == 60) {
							this.mins += 1;
							this.stopRecording();
							clearInterval(this.recordingInterval);
						}
					}, 1000);
				}).catch((err) => {

					this.recordingStarted = false
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'warning',
							msg: err.toString().split(':')[1]
						},
						duration: 2000,
						panelClass: ['user-alert', 'error']
					});
				});
			}
			else return false
		}

		catch (error) {
			// console.log(error);
			this.recordingStarted = false
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Error in accessing Media'
				},
				duration: 2000,
				panelClass: ['user-alert', 'error']
			});
		}
	}
	cancelRecording() {
		this.seconds = 0;
		this.mins = 0;
		this.recordingStarted = false;
		this.recordRTC.stopRecording(() => {
			this.mediaStream.getTracks()[0].stop();
			this.isAudioSent = false;
			clearInterval(this.recordingInterval);
		});
	}
	stopWithTimeout() {
		if (!this.isAudioSent) {
			this.seconds = 0;
			this.mins = 0;
			this.recordingStarted = false;
			this.loading = true;
			this.recordRTC.stopRecording(() => {
				// let recording = this.recordRTC.getBlob();
				this._uploadingService.getSeekableBlob(this.recordRTC.getBlob(), (blob) => {
					this.recordedFile = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
					clearInterval(this.recordingInterval);
				});
			});
		}
	}


	public TryCall(selectedVisitor: any) {

		event.preventDefault();
		this.dialog.open(CallDialogComponent, {
			panelClass: ['calling-dialog'],
			data: selectedVisitor,
			disableClose: true,
			autoFocus: true
		}).afterClosed().subscribe(response => {

			this._callingService.EndCall();
		});



	}


	public isArray(obj: any) {
		return Array.isArray(obj)
	}

	Emoji($event) {

		this.msgBody += $event;
		this.EmojiWrapper = false;
	}



	BanChat(event: Event) {
		event.preventDefault();
		let conversation = JSON.parse(JSON.stringify(this.currentConversation));
		this.subscriptions.push(this.dialog.open(VisitorBanTimeComponent, {
			panelClass: ['confirmation-dialog'],
			data: {
				sessionid: conversation.sessionid,
				deviceID: conversation.deviceID
			}
		}).afterClosed().subscribe(response => {
			if (response && response.hours) {
				this.dialog.open(ConfirmationDialogComponent, {
					panelClass: ['confirmation-dialog'],
					data: { headermsg: "Are you sure you want to Ban the Visitor " + conversation.visitorName + " for " + response.hours + " " + ((response.hours < 2) ? "hour" : "hours") + "?" }
				}).afterClosed().subscribe(data => {
					if (data == 'ok') {
						this._chatService.BanVisitorChat(conversation.sessionid, conversation.deviceID, parseInt(response.hours)).subscribe((response) => {
							this.loading = false;
							if (response) {
								this.snackBar.openFromComponent(ToastNotifications, {
									data: {
										img: 'ok',
										msg: 'Visitor banned successfully!'
									},
									duration: 2000,
									panelClass: ['user-alert', 'success']
								});
							} else {
								this.snackBar.openFromComponent(ToastNotifications, {
									data: {
										img: 'warning',
										msg: 'Visitor already banned!'
									},
									duration: 2000,
									panelClass: ['user-alert', 'error']
								});
							}

						}, err => {
							this.snackBar.openFromComponent(ToastNotifications, {
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

	}

	StopChat(event: Event) {
		//console.log('stopChat');

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
		let conversation = JSON.parse(JSON.stringify(this.currentConversation));;
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure you want to move this chat to Archive?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._chatService.StopVisitorChatRest(conversation.sessionid, conversation).subscribe((response) => {
					this.loading = false;
					if (response && response._id) {
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'ok',
								msg: 'Chat moved to archive successfully!'
							},
							duration: 2000,
							panelClass: ['user-alert', 'success']
						});
					} else {
						this.snackBar.openFromComponent(ToastNotifications, {
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

	}


	EmailTranscriptInDialoge(event: Event) {
		event.preventDefault();
		this.subscriptions.push(this.dialog.open(EmailChatTranscriptComponent, {
			panelClass: ['confirmation-dialog'],
			data: {
				email: this.agent.email
			},
			disableClose: false
		}).afterClosed().subscribe(response => {
			if (response && response.email) {
				this.dialog.open(ConfirmationDialogComponent, {
					panelClass: ['confirmation-dialog'],
					data: { headermsg: "Are you sure you want to Email the transcript to " + response.email + "?" }
				}).afterClosed().subscribe(data => {
					if (data == 'ok') {
						this._chatService.EmailChatTranscript({ email: response.email, cid: this.currentConversation._id }).subscribe((result) => {
							if (result) {

								this.snackBar.openFromComponent(ToastNotifications, {
									data: {
										img: 'ok',
										msg: 'Transcript Sent Successfully to ' + response.email + '!'
									},
									duration: 2000,
									panelClass: ['user-alert', 'success']
								});
							}
						}, err => {
							this.snackBar.openFromComponent(ToastNotifications, {
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
	}

	EmailTranscript(event: Event) {

		if (this.emailTranscriptForm.get('email').value && !this.emailTranscriptForm.invalid) {

			let email = this.emailTranscriptForm.get('email').value;
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: "Are you sure you want to Email the transcript to " + email + "?" }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {

					this.loading = true;
					this._chatService.EmailChatTranscript({ email: email, cid: this.currentConversation._id }).subscribe((result) => {
						if (result) {

							this.snackBar.openFromComponent(ToastNotifications, {
								data: {
									img: 'ok',
									msg: 'Transcript Sent Successfully to ' + email + '!'
								},
								duration: 2000,
								panelClass: ['user-alert', 'success']
							});
						}
						this.loading = false;
					}, err => {
						this.loading = false;
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'warning',
								msg: 'Transcript Sending failed!'
							},
							duration: 2000,
							panelClass: ['user-alert', 'error']
						});

					});
				}
				this.emailTranscriptForm.reset()
			});
		}

	}

	ShowConversationInfo(conversation) {
		if (!conversation.msgFetched) conversation.msgFetched = false;
		if (!conversation.msgFetched && !conversation.msgList) {
			this._chatService.ShowSelectedChat(conversation).subscribe(data => {
				if (data) {
					conversation.msgFetched = true;
					conversation.msgList = data;
					this._chatService.UpdateChatHistory(conversation, data);
					this.subscriptions.push(this.dialog.open(ShowChatInfoDialogComponent, {
						panelClass: ['responsive-dialog'],
						disableClose: false,
						autoFocus: true,
						data: {
							conversation: conversation
						}
					}).afterClosed().subscribe(response => {

					}));
				}
			});

		}
		else {
			this.subscriptions.push(this.dialog.open(ShowChatInfoDialogComponent, {
				panelClass: ['responsive-dialog'],
				disableClose: false,
				autoFocus: true,
				data: {
					conversation: conversation
				}
			}).afterClosed().subscribe(response => {

			}));
		}



	}
	RegisterCustomer(details) {
		let currentConversation = JSON.parse(JSON.stringify(this.currentConversation))
		if (details.customerId) {
			currentConversation.RelatedCustomerInfo.map(x => {
				if (x.customerId == details.customerId) {
					currentConversation.basicDataId = x.customerId
					currentConversation.basicDataName = x.customerName
					currentConversation.basicDataRank = x.customerRank
					currentConversation.basicDataType = x.customerType
					currentConversation.basicDataCountry = x.customerCountry
					currentConversation.salesPersonName = x.salesPersonName
					currentConversation.salesPersonCode = x.salesPersonCode
					currentConversation.salesPersonOffice = x.salesPersonOffice
					currentConversation.defaultPhone = x.defaultPhone
					currentConversation.defaultEmial = x.defaultEmial
					currentConversation.customerEmail = x.customerEmail
					currentConversation.customerPhone = x.customerPhone
					currentConversation.registered = 'Registered Customer'

				}
			})
			this._chatService.IsCustomerRegistered(currentConversation.registered, currentConversation._id, this.nsp).subscribe(result => { })
			this._chatService.InsertCustomerInfo({ customerId: currentConversation.basicDataId, customerName: currentConversation.basicDataName, customerRank: currentConversation.basicDataRank, customerType: currentConversation.basicDataType, customerEmail: currentConversation.customerEmail, customerPhone: currentConversation.customerPhone, defaultEmail: currentConversation.defaultEmail, defaultPhone: currentConversation.defaultPhone, customerCountry: currentConversation.basicDataCountry, salesPersonName: currentConversation.salesPersonName, salesPersonCode: currentConversation.salesPersonCode, salesPersonOffice: currentConversation.salesPersonOffice }, currentConversation._id, this.nsp).subscribe(result => {
			})

		}
		else {
			this._chatService.CustomerRegisterRest(details).subscribe(result => {

				if (result.response.ResultInformation[0].ResultCode == 0) {
					this.currentConversation.customerID = result.response.Customer[0].CustomerId
					this._chatService.InsertCustomerID(this.currentConversation.customerID, details.tid, this.nsp).subscribe(result => {
					})
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Customer Registered Successfully with ID: ' + result.response.Customer[0].CustomerId
						},
						duration: 10000,
						panelClass: ['user-alert', 'success']
					});
					this.loadingReg = false


				}

				else {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'warning',
							msg: result.response.ResultInformation[0].Message
						},
						duration: 4000,
						panelClass: ['user-alert', 'warning']
					});
					this.clearRegForm = false
					this.loadingReg = false

				}
				let customerEmails = []
				let basicData = []
				let customerPhoneList = []
				let salesPersonList = []
				//	let registered = ''
				let realCustomerId = ''
				let realCustomerBasicData = []
				let realCustomerEmails = []
				let realCustomerPhone = []
				let realCustomerSalesPerson = []
				this.emailList = []
				this.phoneList = []
				this.defaultEmail = ''
				this.defaultPhone = ''
				let restOfCustomersId = []
				let restOfCustomerBasicData = []
				let restOfCustomerEmails = []
				let restOfCustomerPhone = []

				let restOfCustomerSalesPerson = []
				let restOfCustomers = []
				let allCustomers = []

				setTimeout(() => {
					this._chatService.CheckRegisterCustomerRest('', details.tid, this.currentConversation.customerID).subscribe(result => {

						// 		//	console.log(result);
						if (result && (result.response._id == details.tid)) {

							//console.log(result)
							if (result.response.ResultInformation[0].ResultCode != 0) {
								currentConversation.registered = 'Unregistered Customer'
								this._chatService.IsCustomerRegistered(currentConversation.registered, details.tid, this.nsp).subscribe(result => { })

							}
							else {
								customerEmails = result.response.CustomerData[0].ContactMailAddressList
								basicData = result.response.CustomerData[0].BasicData
								customerPhoneList = result.response.CustomerData[0].ContactPhoneNumberList
								salesPersonList = result.response.CustomerData[0].SalesPersonData
								realCustomerId = this.currentConversation.customerID

								currentConversation.registered = 'Registered Customer'
								this._chatService.IsCustomerRegistered(currentConversation.registered, details.tid, this.nsp).subscribe(result => { })
								basicData.map(x => {
									if (x.CustomerId == realCustomerId) {
										realCustomerBasicData = x
										currentConversation.basicDataName = x.CustomerName
										currentConversation.basicDataRank = x.CustomerRank
										currentConversation.basicDataId = x.CustomerId
										currentConversation.basicDataCountry = x.Country
										currentConversation.basicDataType = x.CustomerType
										if (x.CustomerId != realCustomerId) {
											restOfCustomerBasicData.push(x)
											restOfCustomersId.push(x.CustomerId)
										}
										return x
									}
								})
								customerEmails.map(x => {
									if (x.CustomerId == realCustomerId) realCustomerEmails.push(x)
									if (x.CustomerId != realCustomerId) restOfCustomerEmails.push(x)

									return x
								})
								customerPhoneList.map(x => {
									if (x.CustomerId == realCustomerId) realCustomerPhone.push(x)
									if (x.CustomerId != realCustomerId) restOfCustomerPhone.push(x)
									return x
								})
								salesPersonList.map(x => {
									if (x.CustomerId == realCustomerId) {
										realCustomerSalesPerson = x
										currentConversation.salesPersonName = x.UserName
										currentConversation.salesPersonCode = x.UserCode
										currentConversation.salesPersonOffice = x.Office
									}
									if (x.CustomerId != realCustomerId) restOfCustomerSalesPerson.push(x)
									return x

								})
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


								currentConversation.contactEmail = realCustomerEmails
								if (currentConversation.contactEmail && currentConversation.contactEmail.length) {
									currentConversation.contactEmail.forEach(x => {
										if (x.Default == 1) this.emailList.unshift(x.MailAddress)
										else this.emailList.push(x.MailAddress);
										return x
									})
									this.emailList = this.emailList.filter((n, i) => this.emailList.indexOf(n) === i);
									currentConversation.contactEmail.map(x => {
										if (x.Default == 1) this.defaultEmail = x.MailAddress
										return x
									})

								}
								currentConversation.contactPhone = realCustomerPhone
								if (currentConversation.contactPhone && currentConversation.contactPhone.length) {
									currentConversation.contactPhone.forEach(x => {
										if (x.Default == 1) this.phoneList.unshift(x.PhoneNumber)
										else this.phoneList.push(x.PhoneNumber);
										return x
									})
									this.phoneList = this.phoneList.filter((n, i) => this.phoneList.indexOf(n) === i);

									currentConversation.contactPhone.map(x => {
										if (x.Default == 1) this.defaultPhone = x.PhoneNumber
										return x
									})
								}


								if (currentConversation.registered == 'Registered Customer' && !currentConversation.CustomerInfo) {

									this._chatService.InsertCustomerInfo({ customerId: currentConversation.basicDataId, customerName: currentConversation.basicDataName, customerRank: currentConversation.basicDataRank, customerType: currentConversation.basicDataType, customerEmail: this.emailList, customerPhone: this.phoneList, defaultEmail: this.defaultEmail, defaultPhone: this.defaultPhone, customerCountry: currentConversation.basicDataCountry, salesPersonName: currentConversation.salesPersonName, salesPersonCode: currentConversation.salesPersonCode, salesPersonOffice: currentConversation.salesPersonOffice }, details.tid, this.nsp).subscribe(result => {
										//	console.log(result)
										if (result) this.addTicketForm.get('subject').setValue(((currentConversation.clientID) ? (currentConversation.clientID || currentConversation._id) + ' / ' + currentConversation.CustomerInfo.customerCountry + ' / ' + currentConversation.CustomerInfo.customerId + ' / ' + currentConversation.CustomerInfo.salesPersonName + ' / ' + 'Beelinks' : ''));


									})
								}
							}

						}
					})

				}, 8000);



			});
		}

	}




	SearchStockList() {

		let currentConversation = JSON.parse(JSON.stringify(this.currentConversation))

		let details = {

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



		}
		//console.log(details.thread)
		this._chatService.StockListRest(details).subscribe(result => {
			//	console.log(result)
			// if(result && result.response=)





		})
	}

	ConvertChatToTIcket(moveToArchive = false) {

		let currentConversation = JSON.parse(JSON.stringify(this.currentConversation));

		let thread: any = {
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
		}
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure you want to convert the selected chat to ticket?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				if (!moveToArchive) this.loading = true
				else this.loadingWithArchive = true
				let details = {
					cid: currentConversation._id,
					thread: JSON.parse(JSON.stringify(thread))
				}

				this._chatService.ConvertChatToTicket(details).subscribe(data => {

					if (data) {
						this.ClearForm(currentConversation);

						if (moveToArchive) {
							this._chatService.StopVisitorChatRest(currentConversation.sessionid, currentConversation).subscribe((response) => {
								if (!moveToArchive) this.loading = false
								else this.loadingWithArchive = false
								if (response && response._id) {
									this.snackBar.openFromComponent(ToastNotifications, {
										data: {
											img: 'ok',
											msg: 'Chat moved to archive successfully!'
										},
										duration: 2000,
										panelClass: ['user-alert', 'success']
									});
								} else {
									this.snackBar.openFromComponent(ToastNotifications, {
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
							this.snackBar.openFromComponent(ToastNotifications, {
								data: {
									img: 'ok',
									msg: 'Ticket creted successfully!'
								},
								duration: 2000,
								panelClass: ['user-alert', 'success']
							});
							if (!moveToArchive) this.loading = false
							else this.loadingWithArchive = false
						}
					}
					else {
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'warning',
								msg: 'Operation failed!'
							},
							duration: 2000,
							panelClass: ['user-alert', 'error']
						});
					}

				},
					err => {
						if (!moveToArchive) this.loading = false
						else this.loadingWithArchive = false
					}
				);
			}
			//this.addTicketForm.reset()
		});

	}

	SuperViseChat(event: Event, currentConversation: any) {

		event.preventDefault();
		this._appStateService.NavigateForce('/chats' + currentConversation._id)
	}


	ClearForm(currentConversation) {

		if (currentConversation._id == this.currentConversation._id) {
			this.addTicketForm.reset();
			this.addTicketForm.get('priority').setValue('LOW');
			this.addTicketForm.get('state').setValue('OPEN');
			this.addTicketForm.get('subject').setValue(currentConversation.clientID || currentConversation._id);
		}
	}
	// ClearRegistrationForm(currentConversation) {
	// 	if (currentConversation._id == this.currentConversation._id) {
	// 		this.registerCustomerForm.reset();

	// 	}
	// }

	EndSuperVision(event: Event, visitor: any) {

		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure you want to end supervising this Conversation?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._visitorService.EndSuperVisesChat(visitor.conversationID.toString(), true).subscribe(data => {
					if (data && data.status == 'ok') {
						this._chatService.SuperVisedChatList.next(this._chatService.SuperVisedChatList.getValue().filter((id) => { return id != visitor.conversationID }))
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'ok',
								msg: 'Super Vision Ended successfully!'
							},
							duration: 2000,
							panelClass: ['user-alert', 'success']
						});
					} else {
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'warning',
								msg: 'Error in ending super vision!'
							},
							duration: 2000,
							panelClass: ['user-alert', 'error']
						});
					}

				})
			}
		})
	}

	CheckIfChatSuperVised(superVisers: Array<any>) {
		let supervise = false;

		if (!superVisers) return supervise
		if (superVisers && superVisers.length) {
			superVisers.map(agents => {
				if (agents == this.agent.csid) supervise = true
				return agents
			})
			return supervise
		}
	}

	SaveCustomField(_id, name, value) {
		this.savingCustomFields[name] = true
		this._chatService.UpdateDynamicProperty(_id, name, value).subscribe(data => {
			if (data) this.savingCustomFields[name] = false
		})

	}
}
