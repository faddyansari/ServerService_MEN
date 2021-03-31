import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsUniquevisitorsComponent } from './analytics-uniquevisitors.component';

describe('AnalyticsUniquevisitorsComponent', () => {
  let component: AnalyticsUniquevisitorsComponent;
  let fixture: ComponentFixture<AnalyticsUniquevisitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsUniquevisitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsUniquevisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
