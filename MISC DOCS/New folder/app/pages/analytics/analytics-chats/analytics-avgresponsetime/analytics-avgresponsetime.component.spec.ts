import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAvgresponsetimeComponent } from './analytics-avgresponsetime.component';

describe('AnalyticsAvgresponsetimeComponent', () => {
  let component: AnalyticsAvgresponsetimeComponent;
  let fixture: ComponentFixture<AnalyticsAvgresponsetimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsAvgresponsetimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsAvgresponsetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
