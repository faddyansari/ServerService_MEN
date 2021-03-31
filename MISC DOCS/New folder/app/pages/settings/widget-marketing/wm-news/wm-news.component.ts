import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WidgetMarketingService } from '../../../../../services/LocalServices/WidgetMarketing';
import { UploadingService } from '../../../../../services/UtilityServices/UploadingService';
import { forkJoin } from "rxjs/observable/forkJoin";
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';

@Component({
	selector: 'app-wm-news',
	templateUrl: './wm-news.component.html',
	styleUrls: ['./wm-news.component.css'],
	providers: [
		WidgetMarketingService
	],
	encapsulation: ViewEncapsulation.None
})
export class WmNewsComponent implements OnInit {

	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	scrollChanged: Subject<any> = new Subject();

	subscriptions: Subscription[] = [];
	newsForm: FormGroup;
	newsSearchForm: FormGroup;
	newsList = [];
	newsToDisplay: any;
	loading = false;
	cubeLoading = false;
	image: any;
	background: any;
	widgetMarketingSettings: any;
	//Scrolling
	scrollHeight = 0;
	scrollTop: number = 10;
	fetchedMore = false;
	currentNews = undefined;
	update = false;
	displayList: any[];
	search = '';
	tempTypingData: string = ''

	newsSearch: Subject<any> = new Subject();
	constructor(private formBuilder: FormBuilder, private _WMService: WidgetMarketingService, private _uploadingService: UploadingService, private snackBar: MatSnackBar,
		private dialog: MatDialog, private _appStateService: GlobalStateService) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Widget Marketing');
		_WMService.GetNews();
		this.newsForm = formBuilder.group({
			'title': [
				null,
				[
					Validators.required
				]
			],
			'desc': [
				null,
				[
					Validators.required
				]
			],
			'link': [
				null,
				[

				]
			],
			'image': [
				null,
				[
					Validators.required
				]
			],
			'background': [
				null,
				[]
			]
		});
		this.newsSearchForm = formBuilder.group({
			'searchValue': ['', [],]
		});
		this.subscriptions.push(_WMService.newsList.subscribe(data => {
			this.newsList = data;
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
					if (!(this.newsList as any).ended) {
						//console.log('fetch more');
						this._WMService.cubeLoading.next(true);
						this._WMService.GetMoreNews((this.newsList && this.newsList.length) ? this.newsList[this.newsList.length - 1]._id : []);
					}
				}
				this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
			}
		}))


		this.subscriptions.push(this.newsSearch.pipe(debounceTime(750)).subscribe(data => {
			if (!this.search) {
				
				this.displayList = this.newsList;
				this.tempTypingData = ''
				return;
			}
			if (this.search) {
				if (this.tempTypingData != this.search) {
					this.loading = true;
					this.tempTypingData = this.search
					this._WMService.GetNewsBySearch(this.search).subscribe(response => {
						this.loading = false;
						if (response) {
							response = response.filter(item => {
								return (this.displayList.find(item2 => {
									return (((item._id == item2._id)));
								})) == undefined;
							});
							// this.Filteredfaqs = response.FAQS;
							// this.filterApplied = true;
							if (response && response.length) this.displayList = this.displayList.concat(response)
						}
					})
				}
			}
		}));


	}
	Typing(event: KeyboardEvent) {
		this.newsSearch.next()
	}

	ScrollChanged(event: UIEvent) {
		this.scrollChanged.next(event);
	}

	ngOnInit() {
		// console.log(this.scrollRef);
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.scrollChanged.next();
		}, 0);
	}

	ngAfterViewChecked() {
		// console.log(this.scrollRef);

	}

	imgSelected(files) {
		//console.log(files);
		if (files && files.length > 0) {
			this.image = files[0];
		} else {
			this.image = undefined;
		}
	}
	bgSelected(files) {
		if (files && files.length > 0) {
			this.background = files[0];
		} else {
			this.background = undefined;
		}
	}

	Submit(data) {
		this._WMService.loading.next(true);

		if (this.newsList.filter(obj => obj.title.toLowerCase() == data.title.toLowerCase()).length < 1 || this.update) {
			let imgObservable = this.uploadImage();
			let bgObservable = this.uploadBackground();
			forkJoin([imgObservable, bgObservable]).subscribe(results => {
				this._WMService.loading.next(true);

				// console.log('Results');
				// console.log(results);
				if (this.update && this.currentNews) {
					this.currentNews.image = results[0];
					this.currentNews.background = results[1];
					this.currentNews.title = this.newsForm.get('title').value;
					this.currentNews.desc = this.newsForm.get('desc').value;
					this.currentNews.link = this.newsForm.get('link').value;

					this._WMService.AddNews(this.currentNews, this.update);
					this.newsForm.get('image').setValidators([Validators.required]);
					//this.image = undefined;
					//this.background = undefined;

				}
				else {
					// console.log(data);
					data.image = results[0]
					data.background = results[1];
					this._WMService.AddNews(data, this.update);
					this.image = undefined;
					this.background = undefined;
				}

				this.ResetControls();
			}, err => {
				this._WMService.loading.next(true);

			});
		} else {
			//console.log('news already added!');
			this._WMService.loading.next(false);
		}




	}
	ResetControls() {
		this.update = false;
		this.currentNews = undefined;

		this.newsForm.reset();
	}

	Toggle(newsId, check) {
		this._WMService.ToggleNews(newsId, !check);
	}
	toggleNewsPermission(value) {
		this.widgetMarketingSettings.permissions.news = value;
		this._WMService.saveWMSettings(this.widgetMarketingSettings);
	}
	setCurrentNews(data) {

		console.log(data)
		// delete this.currentFaq.selected
		this.currentNews = data;
		this.newsForm.get('title').setValue(data.title);
		this.newsForm.get('desc').setValue(data.desc);
		this.newsForm.get('image').setValidators(null);
		this.newsForm.get('image').updateValueAndValidity();
		this.newsForm.get('link').setValue(data.link);
		this.update = true;
	}
	cancelUpdate() {
		delete this.currentNews.selected
		this.update = false;
		this.newsForm.reset();
	}
	Delete(newsId) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want To delete this?' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._WMService.DeleteNews(newsId);
				if (this.currentNews) {
					this.currentNews = {};
					this.newsForm.get('title').setValue('');
					this.newsForm.get('desc').setValue('');
					this.newsForm.get('image').setValue('');
					this.newsForm.get('background').setValue('');
					this.newsForm.get('link').setValue('');
					this.update = false;
				}



			}
		});
	}

	uploadImage(): Observable<any> {
		return new Observable((observer) => {
			if (this.image) {
				this._uploadingService.SignRequest(this.image, 'knowledgebase', { params: { "folderName": "news" } }).subscribe(response => {
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
				this._uploadingService.SignRequest(this.background, 'knowledgebase', { params: { "folderName": "news" } }).subscribe(response => {
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
