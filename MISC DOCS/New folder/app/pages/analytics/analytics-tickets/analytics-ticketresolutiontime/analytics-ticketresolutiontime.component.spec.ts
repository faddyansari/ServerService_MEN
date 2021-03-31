import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTicketresolutiontimeComponent } from './analytics-ticketresolutiontime.component';

describe('AnalyticsTicketresolutiontimeComponent', () => {
  let component: AnalyticsTicketresolutiontimeComponent;
  let fixture: ComponentFixture<AnalyticsTicketresolutiontimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsTicketresolutiontimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsTicketresolutiontimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
