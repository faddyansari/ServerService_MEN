import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WidgetMarketingService } from '../../../../../services/LocalServices/WidgetMarketing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';

@Component({
	selector: 'app-wm-faqs',
	templateUrl: './wm-faqs.component.html',
	styleUrls: ['./wm-faqs.component.scss'],
	providers: [
		WidgetMarketingService
	],
	encapsulation: ViewEncapsulation.None
})
export class WmFaqsComponent implements OnInit {

	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	scrollChanged: Subject<any> = new Subject();
	subscriptions: Subscription[] = [];
	faqForm: FormGroup;
	faqSearchForm: FormGroup;
	faqList = [];
	cubeLoading = false;
	loading = false;
	faqsSearch: Subject<any> = new Subject();
	widgetMarketingSettings: any;
	currentFaq = undefined;
	update = false;
	//Scrolling
	scrollHeight = 0;
	scrollTop: number = 10;
	fetchedMore = false;
	displayList: any[];
	search = '';
	tempTypingData: string = ''
	config: any = {
		placeholder: 'Answer..',
		toolbar: [
			['style', ['italic', 'underline']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['fontName', ['fontName']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['400']],
			['view', ['codeview', 'undo', 'redo']]
			// ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
			// ['fontsize', ['fontsize']],
			// ['color', ['color']],
			// ['para', ['ul', 'ol', 'paragraph', 'height']],
		]
	};

	constructor(private formBuilder: FormBuilder, private _WMService: WidgetMarketingService, private snackBar: MatSnackBar,
		private dialog: MatDialog, private _appStateService: GlobalStateService) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Widget Marketing');
		_WMService.GetFaqs();
		this.faqForm = formBuilder.group({
			'question': [
				null,
				[
					Validators.required
				]
			],
			'answer': [
				null,
				[
					Validators.required
				]
			]
		});
		this.faqSearchForm = formBuilder.group({
			'searchValue': ['', [],]
		});
		this.subscriptions.push(_WMService.faqList.subscribe(data => {
			this.faqList = data;
			this.displayList = data;
		}));
		this.subscriptions.push(_WMService.cubeLoading.subscribe(data => {
			this.cubeLoading = data;
		}));
		this.subscriptions.push(_WMService.widgetMarketingSettings.subscribe(data => {
			if (data) {
				this.widgetMarketingSettings = data;
			}
		}));

		this.subscriptions.push(this.scrollChanged.debounceTime(200).subscribe(event => {
			if (event) {
				this.scrollTop = this.scrollContainer.nativeElement.scrollTop;
				// raw.scrollTop + raw.offsetHeight > raw.scrollHeight
				if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
					this.fetchedMore = true;
					if (!(this.faqList as any).ended) {
						console.log('fetch more');
						this._WMService.cubeLoading.next(true);
						this._WMService.GetMoreFaqs(this.faqList[this.faqList.length - 1]._id);
					}
				}
				this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
			}
		}))
		this.subscriptions.push(this.faqsSearch.pipe(debounceTime(750)).subscribe(data => {
			if (!this.search) {
				
				this.displayList = this.faqList;
				this.tempTypingData = ''
				return;
			}
			if (this.search) {
				if (this.tempTypingData != this.search) {
					this.loading = true;
					this.tempTypingData = this.search
					this._WMService.GetFaqsBySearch(this.search).subscribe(response => {
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
		this.faqsSearch.next()
	}
	
	ngOnInit() {
	}

	ScrollChanged(event: UIEvent) {
		this.scrollChanged.next(event);
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.scrollChanged.next();
		}, 0);

	}

	Submit(data) {
		if (this.update && this.currentFaq) {
			this.currentFaq.question = this.faqForm.get('question').value;
			this.currentFaq.answer = this.faqForm.get('answer').value;
			this._WMService.AddFaq(this.currentFaq, this.update);
		} else {
			this._WMService.AddFaq(data, this.update);
		}
		this.update = false;
		this.currentFaq = undefined;
		this.faqForm.reset();
	}
	toggleFaqPermission(value) {
		this.widgetMarketingSettings.permissions.faqs = value;
		this._WMService.saveWMSettings(this.widgetMarketingSettings);
	}

	cancelUpdate() {
		delete this.currentFaq.selected
		this.update = false;
		this.faqForm.reset();
	}

	Delete(fId) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want To delete this?' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._WMService.DeleteFaq(fId);
				if (this.currentFaq) {
					this.currentFaq = {};
					this.faqForm.get('question').setValue('');
					this.faqForm.get('answer').setValue('');
					this.update = false;
				}
			}
		});
	}
	setCurrentFaq(data) {

		// delete this.currentFaq.selected
		this.currentFaq = data;
		this.faqForm.get('question').setValue(data.question);
		this.faqForm.get('answer').setValue(data.answer);
		this.update = true;
	}
	ngOnDestroy() {
		this.subscriptions.forEach(res => {
			res.unsubscribe();
		})
	}
}
