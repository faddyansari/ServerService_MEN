import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsReturnvisitorratioComponent } from './analytics-returnvisitorratio.component';

describe('AnalyticsReturnvisitorratioComponent', () => {
  let component: AnalyticsReturnvisitorratioComponent;
  let fixture: ComponentFixture<AnalyticsReturnvisitorratioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsReturnvisitorratioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsReturnvisitorratioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
