import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAvgwaittimeComponent } from './analytics-avgwaittime.component';

describe('AnalyticsAvgwaittimeComponent', () => {
  let component: AnalyticsAvgwaittimeComponent;
  let fixture: ComponentFixture<AnalyticsAvgwaittimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsAvgwaittimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsAvgwaittimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
