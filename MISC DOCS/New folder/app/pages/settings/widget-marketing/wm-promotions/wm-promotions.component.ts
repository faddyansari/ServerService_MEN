import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WidgetMarketingService } from '../../../../../services/LocalServices/WidgetMarketing';
import { UploadingService } from '../../../../../services/UtilityServices/UploadingService';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';

@Component({
	selector: 'app-wm-promotions',
	templateUrl: './wm-promotions.component.html',
	styleUrls: ['./wm-promotions.component.css'],
	providers: [
		WidgetMarketingService
	],
	encapsulation: ViewEncapsulation.None
})


export class WmPromotionsComponent implements OnInit {

	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	scrollChanged: Subject<any> = new Subject();

	currentPromtion = undefined;
	update = false;
	subscriptions: Subscription[] = [];
	promotionForm: FormGroup;
	promSearchForm: FormGroup;
	promList = [];
	promToDisplay: any;
	loading = false;
	cubeLoading = false;
	image: any;
	background: any;
	imgAttachment = false;
	bgAttachment = false;
	widgetMarketingSettings: any;
	currencyList = [];
	displayList: any[];
	search = '';
	tempTypingData: string = ''
	//Scrolling
	scrollHeight = 0;
	scrollTop: number = 10;
	fetchedMore = false;
	//private apiUrl = 'https://openexchangerates.org/api/currencies.json';
	promotionsSearch: Subject<any> = new Subject();
	constructor(private formBuilder: FormBuilder, private _WMService: WidgetMarketingService, private _uploadingService: UploadingService, private snackBar: MatSnackBar,
		private dialog: MatDialog, private _appStateService: GlobalStateService) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Widget Marketing');
		_WMService.GetPromotions();

		this.currencyList = [
			"AED",
			"AFN",
			"ALL",
			"AMD",
			"ANG",
			"AOA",
			"ARS",
			"AUD",
			"AWG",
			"AZN",
			"BAM",
			"BBD",
			"BDT",
			"BGN",
			"BHD",
			"BIF",
			"BMD",
			"BND",
			"BOB",
			"BRL",
			"BSD",
			"BTC",
			"BTN",
			"BWP",
			"BYN",
			"BZD",
			"CAD",
			"CDF",
			"CHF",
			"CLF",
			"CLP",
			"CNH",
			"CNY",
			"COP",
			"CRC",
			"CUC",
			"CUP",
			"CVE",
			"CZK",
			"DJF",
			"DKK",
			"DOP",
			"DZD",
			"EGP",
			"ERN",
			"ETB",
			"EUR",
			"FJD",
			"FKP",
			"GBP",
			"GEL",
			"GGP",
			"GHS",
			"GIP",
			"GMD",
			"GNF",
			"GTQ",
			"GYD",
			"HKD",
			"HNL",
			"HRK",
			"HTG",
			"HUF",
			"IDR",
			"ILS",
			"IMP",
			"INR",
			"IQD",
			"IRR",
			"ISK",
			"JEP",
			"JMD",
			"JOD",
			"JPY",
			"KES",
			"KGS",
			"KHR",
			"KMF",
			"KPW",
			"KRW",
			"KWD",
			"KYD",
			"KZT",
			"LAK",
			"LBP",
			"LKR",
			"LRD",
			"LSL",
			"LYD",
			"MAD",
			"MDL",
			"MGA",
			"MKD",
			"MMK",
			"MNT",
			"MOP",
			"MRO",
			"MRU",
			"MUR",
			"MVR",
			"MWK",
			"MXN",
			"MYR",
			"MZN",
			"NAD",
			"NGN",
			"NIO",
			"NOK",
			"NPR",
			"NZD",
			"OMR",
			"PAB",
			"PEN",
			"PGK",
			"PHP",
			"PKR",
			"PLN",
			"PYG",
			"QAR",
			"RON",
			"RSD",
			"RUB",
			"RWF",
			"SAR",
			"SBD",
			"SCR",
			"SDG",
			"SEK",
			"SGD",
			"SHP",
			"SLL",
			"SOS",
			"SRD",
			"SSP",
			"STD",
			"STN",
			"SVC",
			"SYP",
			"SZL",
			"THB",
			"TJS",
			"TMT",
			"TND",
			"TOP",
			"TRY",
			"TTD",
			"TWD",
			"TZS",
			"UAH",
			"UGX",
			"USD",
			"UYU",
			"UZS",
			"VEF",
			"VES",
			"VND",
			"VUV",
			"WST",
			"XAF",
			"XAG",
			"XAU",
			"XCD",
			"XDR",
			"XOF",
			"XPD",
			"XPF",
			"XPT",
			"YER",
			"ZAR",
			"ZMW",
			"ZWL",
		]
		this.promotionForm = formBuilder.group({
			'title': [
				null,
				[]
			],
			'desc': [
				null,
				[]
			],
			'link': [
				null,
				[]
			],
			'type': [
				'banner',
				[Validators.required]
			],
			'image': [
				null,
				[Validators.required]
			],
			'price': [
				null,
				[]
			],
			'currency': [
				'USD',
				[]
			],
			'background': [
				null,
				[]
			]
		});
		this.promSearchForm = formBuilder.group({
			'searchValue': ['', []]
		});
		this.subscriptions.push(_WMService.promotionsList.subscribe(data => {
			//console.log(data);

			this.promList = data;
			this.displayList = data
		}));
		this.subscriptions.push(_WMService.widgetMarketingSettings.subscribe(data => {
			if (data) {
				this.widgetMarketingSettings = data;
			}
		}));
		this.subscriptions.push(_WMService.loading.subscribe(data => {
			this.loading = data;
		}));
		this.subscriptions.push(_WMService.cubeLoading.subscribe(data => {
			this.cubeLoading = data;
		}));

		this.subscriptions.push(this.scrollChanged.debounceTime(200).subscribe(event => {
			if (event) {
				this.scrollTop = this.scrollContainer.nativeElement.scrollTop;
				// raw.scrollTop + raw.offsetHeight > raw.scrollHeight
				if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
					this.fetchedMore = true;
					if (!(this.promList as any).ended) {
						if (this.promList.length) {
							this._WMService.cubeLoading.next(true);
							this._WMService.GetMorePromotions((this.promList && this.promList.length) ? this.promList[this.promList.length - 1]._id : []);
						}

					}
				}
				this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
			}
		}))
		this.subscriptions.push(this.promotionsSearch.pipe(debounceTime(750)).subscribe(data => {
			if (!this.search) {
		
				this.displayList = this.promList;
				this.tempTypingData = ''
				return;
			}
			if (this.search) {

				if (this.tempTypingData != this.search) {
					this.loading = true;
					this.tempTypingData = this.search
					this._WMService.GetPromotionsBySearch(this.search).subscribe(response => {
						//console.log(response)
						this.loading = false;
						if (response) {
							response = response.filter(item => {
								return (this.displayList.find(item2 => {
									return (((item._id == item2._id)));
								})) == undefined;
							});
							
							if (response && response.length) this.displayList = this.displayList.concat(response)
						}
					})
				}
			}
		}));
	}

	ScrollChanged(event: UIEvent) {
		this.scrollChanged.next(event);
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.scrollChanged.next();

		}, 0);
	}
	Typing(event: KeyboardEvent) {
		this.promotionsSearch.next()
	}
	imgSelected(files) {
		if (files && files.length > 0) {
			this.image = files[0];
			this.imgAttachment = true;
		} else {
			this.image = undefined;
			this.imgAttachment = false;
		}
	}
	bgSelected(files) {
		if (files && files.length > 0) {
			this.background = files[0];
			this.bgAttachment = true;
		} else {
			this.background = undefined;
			this.bgAttachment = false;
		}
	}


	TypeChange(type) {
		switch (type) {
			case 'banner':
				this.promotionForm = this.formBuilder.group({
					'title': [
						null,
						[]
					],
					'desc': [
						null,
						[]
					],
					'link': [
						null,
						[]
					],
					'type': [
						'banner',
						[Validators.required]
					],
					'image': [
						null,
						[Validators.required]
					],
					'price': [
						null,
						[]
					],
					'currency': [
						'USD',
						[]
					],
					'background': [
						null,
						[]
					]
				});
				break;
			case 'post':
				this.promotionForm = this.formBuilder.group({
					'title': [
						null,
						[Validators.required]
					],
					'desc': [
						null,
						[Validators.required]
					],
					'link': [
						null,
						[]
					],
					'type': [
						'post',
						[Validators.required]
					],
					'image': [
						null,
						[Validators.required]
					],
					'price': [
						null,
						[]
					],
					'currency': [
						'USD',
						[]
					],
					'background': [
						null,
						[]
					]
				});
				break;
			case 'product':
				this.promotionForm = this.formBuilder.group({
					'title': [
						null,
						[Validators.required]
					],
					'desc': [
						null,
						[]
					],
					'link': [
						null,
						[Validators.required]
					],
					'type': [
						'product',
						[Validators.required]
					],
					'image': [
						null,
						[Validators.required]
					],
					'price': [
						null,
						[Validators.required]
					],
					'currency': [
						'USD',
						[Validators.required]
					],
					'background': [
						null,
						[]
					]
				});
				break;

		}
	}

	Submit(data) {

		this.loading = true;
	//	console.log(data);
	//	console.log(this.promList);
		if (this.promList.filter(obj =>  (obj.title.toLowerCase() == data.title.toLowerCase())).length < 1 || this.update) {
			let imgObservable = this.uploadImage();
			let bgObservable = this.uploadBackground();
			forkJoin([imgObservable, bgObservable]).subscribe(results => {


				if (this.update && this.currentPromtion) {
				
					//this.currentPromtion.image = results[0];
					//this.currentPromtion.background = results[1];
					this.currentPromtion.title = this.promotionForm.get('title').value;

					this.currentPromtion.desc = this.promotionForm.get('desc').value;
					this.currentPromtion.price = this.promotionForm.get('price').value;
					this.currentPromtion.currency = this.promotionForm.get('currency').value;
					this.currentPromtion.link = this.promotionForm.get('link').value;
                    //  this.currentPromtion.count=0 
					this._WMService.AddPromotion(this.currentPromtion, this.update);
					this.promotionForm.get('image').setValidators([Validators.required]);

				//	this.promotionForm.get('type').setValue(this.currentPromtion.type);
				
					//this.image = undefined;
					//this.background = undefined;

				}



				else {
				//	console.log('Results');
					//console.log(results);
					data.image = results[0];
					data.background = results[1];
					data.count=0 
					this._WMService.AddPromotion(data, this.update);
					this.image = undefined;
					this.background = undefined;

					this.promotionForm.get('type').setValue(data.type);
				}
				
				this.update = false;
				this.currentPromtion = undefined;
				this.promotionForm.reset();
				this.promotionForm.get('type').setValue('banner');

			}, err => {
				this._WMService.loading.next(true);
			});
		} else {
			console.log('promotions already added!');
			this._WMService.loading.next(false);
		}
	}

	Toggle(pId, check) {
		this._WMService.TogglePromotion(pId, !check);
	}
	togglePromotionPermission(value) {
		this.widgetMarketingSettings.permissions.promotions = value;
		this._WMService.saveWMSettings(this.widgetMarketingSettings);
		// this._WMService.widgetMarketingSettings.next(this.widgetMarketingSettings)
	}

	Delete(pId) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want To delete this?' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._WMService.DeletePromotion(pId);
				if (this.currentPromtion) {
					this.currentPromtion = {};
					this.currentPromtion.get('title').setValue('');
					this.currentPromtion.get('desc').setValue('');
					this.currentPromtion.get('currency').setValue('');
					this.currentPromtion.get('price').setValue('');
					this.currentPromtion.get('image').setValue('');
					this.currentPromtion.get('background').setValue('');
					this.currentPromtion.get('link').setValue('');

					this.update = false;
				}

			}
		});
	}


	setCurrentPromtions(data) {

	//	console.log(data)
		// delete this.currentFaq.selected
		this.currentPromtion = data;
		data.count=0;
		//if(this.promList.filter(obj=>data.type=='promotion'))
		this.promotionForm.get('title').setValue(data.title);
		this.promotionForm.get('desc').setValue(data.desc);
		this.promotionForm.get('currency').setValue(data.currency);
		this.promotionForm.get('price').setValue(data.price);
		this.promotionForm.get('image').setValidators(null);
		this.promotionForm.get('image').updateValueAndValidity();
		this.promotionForm.get('link').setValue(data.link);
		this.update = true;
	}



	cancelUpdate() {
		delete this.currentPromtion.selected
		this.update = false;
		this.promotionForm.reset();
	}
	uploadImage(): Observable<any> {
		return new Observable((observer) => {
			if (this.image) {
				this._uploadingService.SignRequest(this.image, 'knowledgebase', { params: { "folderName": this.promotionForm.get('type').value } }).subscribe(response => {
					let params = JSON.parse(response.text());
					params.file = this.image;
					this._uploadingService.uploadAttachment(params).subscribe(s3response => {
						if (s3response.status == '201') {
							this._uploadingService.parseXML(s3response.text()).subscribe(json => {
								observer.next(json.response.PostResponse.Location[0])
								observer.complete();
							}, err => {
								observer.error(err);
							});
						}
					}, err => {
						observer.error(err);
					});
				}, err => {
					observer.error(err);
				});
			} else {
				observer.next(null);
				observer.complete();
			}
		});
	}

	uploadBackground(): Observable<any> {
		return new Observable((observer) => {
			if (this.background) {
				//console.log('Background Observable!');
				this._uploadingService.SignRequest(this.background, 'knowledgebase', { params: { "folderName": this.promotionForm.get('type').value } }).subscribe(response => {
					let params = JSON.parse(response.text());
					params.file = this.background;
					this._uploadingService.uploadAttachment(params).subscribe(s3response => {
						if (s3response.status == '201') {
							this._uploadingService.parseXML(s3response.text()).subscribe(json => {
								observer.next(json.response.PostResponse.Location[0]);
								observer.complete();
							}, err => {
								observer.error(err);
							});
						}
					}, err => {
						observer.error(err);
					});
				}, err => {
					observer.error(err);
				});
			} else {
				observer.next(null);
				observer.complete();
			}

		});
	}
	ngOnDestroy() {
		this.subscriptions.forEach(res => {
			res.unsubscribe();
		})
	}
}
