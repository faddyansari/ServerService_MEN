import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ticket-browsing-history',
  templateUrl: './ticket-browsing-history.component.html',
  styleUrls: ['./ticket-browsing-history.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketBrowsingHistoryComponent implements OnInit {

  @Input('visitorData') visitorData: any;
  constructor() { }

  ngOnInit() {
    
  }
  public ToArray(value: any): Array<string> {
    if (value instanceof Array) return value as Array<string>;
    else {
      return [value] as Array<string>;
    }
  }
}
