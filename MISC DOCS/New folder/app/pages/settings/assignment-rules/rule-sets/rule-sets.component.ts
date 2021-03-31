import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SocketService } from '../../../../../services/SocketService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../services/AuthenticationService';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ValidationService } from '../../../../../services/UtilityServices/ValidationService';
import { AssignmentAutomationSettingsService } from '../../../../../services/LocalServices/AssignmentRuleService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-rule-sets',
	templateUrl: './rule-sets.component.html',
	styleUrls: ['./rule-sets.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class RuleSetsComponent implements OnInit {
	@ViewChild('ADDRULES') AddRuleArea: ElementRef;

	offX: number
	offY: number
	DraggerDiv: HTMLElement;
	CopyDraggedDiv: HTMLElement
	DraggerDivNext: HTMLElement

	subscriptions: Subscription[] = [];
	loading = false;
	socket;
	public working = false;
	public fetching: boolean = false;
	RulesList: Array<any> = [];
	RuleSetList: Array<any> = [];
	RuleSet: any = {};
	public assignmentRuleSetForm: FormGroup;
	//rulesMap: Array<any> = [];
	//filterKeys = [];
	showRulesetForm = false;

	eventListener: Array<any> = [];

	constructor(private formbuilder: FormBuilder,
		private _socketService: SocketService,
		public _authService: AuthService,
		public _assignmentRuleService: AssignmentAutomationSettingsService,
		public snackBar: MatSnackBar,
		public _appStateService: GlobalStateService) {

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
		this.subscriptions.push(_socketService.getSocket().subscribe(socket => {
			this.socket = socket;
		}));


		this.subscriptions.push(_assignmentRuleService.fetchingCases.subscribe(data => {

			this.fetching = data;
		}));
		this.subscriptions.push(_socketService.getSocket().subscribe(socket => {
			this.socket = socket;
		}));



		this.subscriptions.push(_authService.getRequestState().subscribe(requestState => {
			this.loading = requestState;
		}));

		this.subscriptions.push(_assignmentRuleService.RulesList.subscribe(list => {
			if (list && list.length) {
				this.RulesList = list;

			}
		}));
		this.subscriptions.push(_assignmentRuleService.RuleSetList.subscribe(list => {
			if (list && list.length) {
				this.RuleSetList = list;

			}
		}));

		this.assignmentRuleSetForm = formbuilder.group({
			'ruleSetName': [
				null,
				[
					Validators.required,
					Validators.maxLength(50),

				],
				this.CheckRuleSetName.bind(this)
			]
		});
		this.RuleSet['rules'] = [];
		this.RuleSet['criteria'] = {};
	}

	ngOnInit() {
	}

	CheckRuleSetName(control: FormControl): Observable<any> {

		let name = this.assignmentRuleSetForm.get('ruleSetName');
		for (let i = 0; i < this.RuleSetList.length; i++) {
			if (this.RuleSetList[i].ruleSetName == name.value) {
				return Observable.of({ 'matched': true });
			}

		}
		return Observable.of(null);
	}

	// DragEvent(event: MouseEvent) {

	//   //console.log(event);
	//   event.preventDefault();
	//   event.stopPropagation();
	//   event.stopImmediatePropagation();
	//   if ((event.target as HTMLElement).id.indexOf('assignRule') !== -1) {
	//     //this.DraggerDiv = (event.target as HTMLElement);

	//     this.CopyDraggedDiv = ((event.target as HTMLElement).cloneNode(true) as HTMLElement);
	//     //this.CopyDraggedDiv.style.visibility = 'hidden';
	//     (event.target as HTMLElement).parentNode.insertBefore(this.CopyDraggedDiv, (event.target as HTMLElement).nextSibling);
	//     let ev = new MouseEvent("mousedown", {
	//       bubbles: true,
	//       cancelable: false,
	//     } as MouseEvent);

	//     Object.defineProperty(ev, 'target', { writable: true, value: this.CopyDraggedDiv });
	//     this.divMove((ev as MouseEvent))
	//   }

	// }



	divMove(event: MouseEvent) {
		if (!this.AddRuleArea || !this.AddRuleArea.nativeElement) return
		event.stopPropagation();
		event.stopImmediatePropagation();

		// //console.log(event);

		if ((event.target as HTMLElement).id) {
			console.log('divMove');


			if ((event.target as HTMLElement).id.indexOf('assignRule') !== -1) {
				event.preventDefault();
				this.CopyDraggedDiv = ((event.target as HTMLElement).cloneNode(true) as HTMLElement);
				//this.CopyDraggedDiv.style.visibility = 'hidden';
				//(event.target as HTMLElement).parentNode.insertBefore(this.CopyDraggedDiv, (event.target as HTMLElement).nextSibling);
				this.DraggerDiv = (event.target as HTMLElement);
				this.DraggerDivNext = (this.DraggerDiv.nextSibling as HTMLElement)


				if (this.DraggerDivNext) {
					this.DraggerDivNext.parentNode.insertBefore(this.CopyDraggedDiv, this.DraggerDivNext);
					this.CopyDraggedDiv.addEventListener('mousedown', (e: MouseEvent) => {

						console.log('mousedown');
						this.divMove(e);
					}, false)

				}



				window.addEventListener('mouseup', (e: MouseEvent) => {
					console.log('mouseup');

					this.divMoveStop(e);

				}, false)

				if ((event.target as HTMLElement).id.indexOf('assignRule') !== -1) {

					this.offY = event.clientY - parseInt((event.target as HTMLElement).offsetTop as any);
					this.offX = event.clientX - parseInt((event.target as HTMLElement).offsetLeft as any);


					let self = this
					// window.addEventListener('mousemove', this.divMoving, true)
					window.addEventListener('mousemove', function func(e) {

						self.divMoving(e);
						self.eventListener.push(func)

					}, true)
					// element.addEventListener("click", function _listener() {
					// 	// do something

					// 	element.removeEventListener("click", _listener, true);
					//   }, true);


				}
			}
		}
		else return false

	}

	divMoving(e: MouseEvent) {
		console.log('mousemove');
		let targetOffsetx = RuleSetsComponent.getOffset(this.AddRuleArea.nativeElement).left
		let targetOffsety = RuleSetsComponent.getOffset(this.AddRuleArea.nativeElement).top
		let targetwidth = targetOffsetx + parseInt((this.AddRuleArea.nativeElement as HTMLElement).style.width)
		let targetheight = targetOffsety + parseInt((this.AddRuleArea.nativeElement as HTMLElement).style.height);



		if (this.DraggerDiv) {
			this.DraggerDiv.style.position = 'absolute';
			this.DraggerDiv.style.top = (e.clientY - this.offY) + 'px';
			this.DraggerDiv.style.left = (e.clientX - this.offX) + 'px';
			if ((e.clientX >= targetOffsetx && e.clientX <= targetwidth) && (e.clientY >= targetOffsety && e.clientY <= targetheight)) {

				this.AddRuleArea.nativeElement.style.background = '#ccc'

			}
			else {
				this.AddRuleArea.nativeElement.style.background = '#0000000d'
			}


		}

	}

	divMoveStop(event: MouseEvent) {

		event.stopPropagation();
		event.stopImmediatePropagation();
		this.eventListener.map(e => {
			window.removeEventListener('mousemove', e, true)
			return
		})

		// window.addEventListener('mousemove', this.divMoving, true)
		if (this.DraggerDiv) {
			this.DraggerDiv.style.position = 'absolute';
			this.DraggerDiv.style.top = (event.clientY - this.offY) + 'px';
			this.DraggerDiv.style.left = (event.clientX - this.offX) + 'px';
			this.DraggerDiv.style.display = 'none'
			// this.CopyDraggedDiv.style.zIndex = '9999';
			// this.CopyDraggedDiv.style.display = 'none';
			this.AddRuleInRuleSet(this.DraggerDiv.id.split('assignRule')[1], event).subscribe(data => {
				// this.DraggerDiv.remove();
				// if (this.DraggerDivNext) this.DraggerDivNext.nextSibling.parentNode.insertBefore(this.CopyDraggedDiv, this.DraggerDivNext.nextSibling);
				// this.DraggerDiv = undefined
				// this.CopyDraggedDiv = undefined



				// window.removeEventListener('mouseup', function (e: MouseEvent) {
				//   //console.log('Mouse up removed');
				// }, false);
			},
				err => {

					// this.snackBar.openFromComponent(ToastNotifications, {
					// 	data: { img: 'warning', msg: err.error },
					// 	duration: 3000,
					// 	panelClass: ['user-alert', 'error']
					// });

				}

			);

			this.DraggerDiv.remove();
			// if (this.DraggerDivNext) {
			//   this.DraggerDivNext.nextSibling.parentNode.insertBefore(this.CopyDraggedDiv, this.DraggerDivNext);
			//   this.CopyDraggedDiv.addEventListener('mousedown', function (e: MouseEvent) {
			//     this.divMove(e);
			//   }, false)

			// }
			this.AddRuleArea.nativeElement.style.background = '#0000000d'
			this.DraggerDiv = undefined
			this.CopyDraggedDiv = undefined
		}
	}

	AddRuleInRuleSet(ruleName, event: MouseEvent): Observable<boolean> {
		return new Observable(observer => {
			if (event) {
				let targetOffsetx = RuleSetsComponent.getOffset(this.AddRuleArea.nativeElement).left
				let targetOffsety = RuleSetsComponent.getOffset(this.AddRuleArea.nativeElement).top
				let targetwidth = targetOffsetx + parseInt((this.AddRuleArea.nativeElement as HTMLElement).style.width)
				let targetheight = targetOffsety + parseInt((this.AddRuleArea.nativeElement as HTMLElement).style.height);

				if ((event.clientX >= targetOffsetx && event.clientX <= (targetwidth)) && (event.clientY >= targetOffsety && event.clientY <= (targetheight))) {

					this.AddRule(ruleName)
					observer.next(true)
					observer.complete();
				}
				else {
					//observer.error({ error: 'Rule Already Present' })
					this.snackBar.openFromComponent(ToastNotifications, {
						data: { img: 'warning', msg: 'Please Drag the Element to Drop Area' },
						duration: 3000,
						panelClass: ['user-alert', 'error']
					});
				}
			}
		})
	}


AddRule(ruleName){
	this.CheckIfRulePresent(ruleName).subscribe(data => {
		if (data) {

			this.RuleSet['rules'].push(ruleName);
		}
		else {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: { img: 'warning', msg: 'Rule Already Present'},
				duration: 3000,
				panelClass: ['user-alert', 'error']
			});
		}
	})
}


CheckIfRulePresent(ruleName): Observable <boolean> {

	return new Observable(observer => {

		this.RuleSet['rules'].map(rule => {
			if (rule == ruleName) {

				observer.next(false)
				observer.complete();
			}

		});
		observer.next(true);
	})

}

DeleteRuleInRuleSet(ruleName) {

	//let arr = this.RuleSet.rules;
	this.RuleSet.rules = this.RuleSet.rules.filter(rule => rule != ruleName);
	////console.log(res);

}

	public SetAssignmentCriteria(value: string) {
	if (value == 'allMatch') {
		this.RuleSet.firstmatch = false;
		this.RuleSet.allMatch = true;

	} else {
		this.RuleSet.firstmatch = true;
		this.RuleSet.allMatch = false;
	}
}

toggleRulesetForm() {
	this.showRulesetForm = !this.showRulesetForm
}

	static getOffset(el) {
	let rect = (el as HTMLElement).getBoundingClientRect();
	return {
		left: rect.left + window.scrollX,
		top: rect.top + window.scrollY
	};
}


AddAssignmentRuleSet() {

	if (this.assignmentRuleSetForm.valid) {
		this._authService.setRequestState(true);
		let ruleSet = {
			ruleSetName: this.assignmentRuleSetForm.get('').value,
			rules: (this.assignmentRuleSetForm.get('ruleKeyType').value) ? this.assignmentRuleSetForm.get('ruleKeyType').value : 'any',
			criteria: this.assignmentRuleSetForm.get('ruleKeyName').value,
			enabled: this.assignmentRuleSetForm.get('ruleKeyValue').value,


		}

		this._assignmentRuleService.AddNewRuleSet(ruleSet).subscribe(data => {

			if (data) {
				this._authService.setRequestState(false);


				//this._authService.updateAutomatedMessages(this.assignmentRuleForm.get('hashTag').value, this.assignmentRuleForm.get('ruleName').value);
				//this.assignmentRuleForm.reset();



				//this.RulesList = this.RulesList.concat(rule);


				//this.UpdateRulesMap(this.RulesList);

				this.snackBar.openFromComponent(ToastNotifications, {
					data: { img: 'ok', msg: 'Assignment Rule Added Successfully' },
					duration: 3000,
					panelClass: ['user-alert', 'success']
				});

			}
		},
			err => {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: { img: 'warning', msg: 'Cannot Add Assignment Rule' },
					duration: 3000,
					panelClass: ['user-alert', 'error']
				});
			})
	}
}
ngOnDestroy() {
	// this._assignmentRuleService.Destroy();
	this.subscriptions.forEach(res => {
		res.unsubscribe();
	})
}
}
