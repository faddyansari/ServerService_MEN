import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { EmailTemplateService } from '../../../../services/LocalServices/EmailTemplateService';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-bulk-marketing-email',
  templateUrl: './bulk-marketing-email.component.html',
  styleUrls: ['./bulk-marketing-email.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BulkMarketingEmailComponent implements OnInit {

  @Input() activeTab: string;
  currentRoute: any;
  validation = undefined;
  objectkeys = Object.keys;

  showTemplatingOptions = false;
  showTemplateList = false;
  passLayout = '';
  subscriptions: Subscription[] = [];
  selectedTemplate = undefined;
  name = '';

  constructor(private _globalStateService: GlobalStateService, private _emailTemplateService: EmailTemplateService) {

    this._globalStateService.contentInfo.next('');
		this._globalStateService.breadCrumbTitle.next('Ticket Management');
    this.subscriptions.push(this._emailTemplateService.selectedTemplate.subscribe(res => {
      if (res) {
        this.selectedTemplate = res;
      }
      else {
				this.selectedTemplate = undefined;
			}
    }));

    this.subscriptions.push(this._emailTemplateService.validation.subscribe(res => {
      if (res) {
        this.validation = res;
      }
      else {
        this.validation = undefined;
      }
    }));

    this._globalStateService.currentRoute.subscribe(route => {
      this.currentRoute = route;

    });

  }
  buttonPressed(event, type) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    this._emailTemplateService.ButtonPressed.next({
      type: this.name,
      buttonType: type,
    });
  }

  IfBuilder() {
    if (this.currentRoute.endsWith('basic') ||
      this.currentRoute.endsWith('commerce') ||
      this.currentRoute.endsWith('three-col') ||
      this.currentRoute.endsWith('text')
    ) {
      return true;
    }
    else return false;
  }


  ToggleTemplateOptions() {
    this.showTemplatingOptions = !this.showTemplatingOptions;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
    this._emailTemplateService.selectedTemplate.next(undefined);
  }
}
