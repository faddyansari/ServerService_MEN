import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { Subscription } from 'rxjs/Subscription';
import { SurveyService } from '../../../../../services/LocalServices/SurveyService';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
	selector: 'app-survey',
	templateUrl: './survey.component.html',
	styleUrls: ['./survey.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class SurveyComponent implements OnInit {
	subscriptions: Subscription[] = [];
	addSurvey = false;
	selectedSurvey = undefined;
	surveyObject = undefined;
	package: any;
	constructor(private _authService: AuthService,private _appStateService: GlobalStateService, private _surveyService: SurveyService) {
		this.surveyObject = {
			nsp: '',
			surveyName: '',
			criteria: 'asc',

			basicQuestion: '',
			pointScaleBasic: '3',
			RatingLabelBasic: [{
				name: 'Extremely satisfied',
				ForRadio: ['2', '3', '5', '7'],
				color: "#3c763d"
			},
			{
				name: 'Mostly satisfied',
				ForRadio: ['5', '7'],
				color: "#368763"

			},
			{
				name: 'Slightly satisfied',
				ForRadio: ['7'],
				color: "#52ba5b"

			},
			{
				name: 'Neither satisfied nor dissatisfied',
				ForRadio: ['3', '5', '7'],
				color: "#f7b555"

			},
			{
				name: 'Slightly dissatisfied',
				ForRadio: ['7'],
				color: "#ff681f"

			},
			{
				name: 'Mostly dissatisfied',
				ForRadio: ['5', '7'],
				color: "#e55353"

			},
			{
				name: 'Extremely dissatisfied',
				ForRadio: ['2', '3', '5', '7'],
				color: "#d64646"

			}],

			AdditionalQuestions: [{ question: '' }],
			pointScaleAdd: '3',
			RatingLabelAdd: [{
				name: 'Extremely satisfied',
				ForRadio: ['2', '3', '5', '7'],
				color: "#3c763d"
			},
			{
				name: 'Mostly satisfied',
				ForRadio: ['5', '7'],
				color: "#368763"

			},
			{
				name: 'Slightly satisfied',
				ForRadio: ['7'],
				color: "#52ba5b"

			},
			{
				name: 'Neither satisfied nor dissatisfied',
				ForRadio: ['3', '5', '7'],
				color: "#f7b555"

			},
			{
				name: 'Slightly dissatisfied',
				ForRadio: ['7'],
				color: "#ff681f"

			},
			{
				name: 'Mostly dissatisfied',
				ForRadio: ['5', '7'],
				color: "#e55353"

			},
			{
				name: 'Extremely dissatisfied',
				ForRadio: ['2', '3', '5', '7'],
				color: "#d64646"

			}],
			activated: false,
			thankyouMessage: '',
			commentBox: false,
			additionalDetails: '',
			sendWhen: 'resolved',
			created: { date: new Date().toISOString(), by: '' },
			lastModified: { date: '', by: '' },

		};
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management');
		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			if (pkg) {
				this.package = pkg.tickets.satisfactionSurvey;
				if(!this.package.allowed){
					this._appStateService.NavigateTo('/noaccess');
				}
			}
			// console.log(agent);
		}));
		this.subscriptions.push(this._surveyService.AddSurvey.subscribe(data => {
			this.addSurvey = data;
		}));

		this.subscriptions.push(this._surveyService.selectedSurvey.subscribe(data => {
			this.selectedSurvey = data;
		}));
	}

	ngOnInit() {

	}

	public AddSurvey() {
		this._surveyService.AddSurvey.next(true);
	}

	ngOnDestroy() {
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}

}
