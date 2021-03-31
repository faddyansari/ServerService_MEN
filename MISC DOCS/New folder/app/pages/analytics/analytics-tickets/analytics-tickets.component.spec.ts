import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTicketsComponent } from './analytics-tickets.component';

describe('AnalyticsTicketsComponent', () => {
  let component: AnalyticsTicketsComponent;
  let fixture: ComponentFixture<AnalyticsTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
