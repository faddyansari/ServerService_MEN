import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../../../../services/TicketsService';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-print-tickets',
  templateUrl: './print-tickets.component.html',
  styleUrls: ['./print-tickets.component.css']
})
export class PrintTicketsComponent implements OnInit {
  subscriptions: Subscription[] = [];
  selectedThread: any = undefined;

  constructor() {
  }

  ngOnInit() {
  }

}
