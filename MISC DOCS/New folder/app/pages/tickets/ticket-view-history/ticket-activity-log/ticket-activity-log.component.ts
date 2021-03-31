import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-ticket-activity-log',
  templateUrl: './ticket-activity-log.component.html',
  styleUrls: ['./ticket-activity-log.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketActivityLogComponent implements OnInit {
  @Input('ticketlog') ticketlog: any;
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
