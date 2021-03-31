import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTotalvisitorsComponent } from './analytics-totalvisitors.component';

describe('AnalyticsTotalvisitorsComponent', () => {
  let component: AnalyticsTotalvisitorsComponent;
  let fixture: ComponentFixture<AnalyticsTotalvisitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsTotalvisitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsTotalvisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
