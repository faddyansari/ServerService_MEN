import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsVisitorsComponent } from './analytics-visitors.component';

describe('AnalyticsVisitorsComponent', () => {
  let component: AnalyticsVisitorsComponent;
  let fixture: ComponentFixture<AnalyticsVisitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsVisitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsVisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
