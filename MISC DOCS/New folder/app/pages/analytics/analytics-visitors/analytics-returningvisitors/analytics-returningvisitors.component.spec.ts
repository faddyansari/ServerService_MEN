import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsReturningvisitorsComponent } from './analytics-returningvisitors.component';

describe('AnalyticsReturningvisitorsComponent', () => {
  let component: AnalyticsReturningvisitorsComponent;
  let fixture: ComponentFixture<AnalyticsReturningvisitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsReturningvisitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsReturningvisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
