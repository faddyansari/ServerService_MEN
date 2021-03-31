import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTicketcustomdashboardComponent } from './analytics-ticketcustomdashboard.component';

describe('AnalyticsTicketcustomdashboardComponent', () => {
  let component: AnalyticsTicketcustomdashboardComponent;
  let fixture: ComponentFixture<AnalyticsTicketcustomdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsTicketcustomdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsTicketcustomdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
