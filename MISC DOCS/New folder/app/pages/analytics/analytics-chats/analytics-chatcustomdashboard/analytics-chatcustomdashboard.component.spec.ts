import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsChatcustomdashboardComponent } from './analytics-chatcustomdashboard.component';

describe('AnalyticsChatcustomdashboardComponent', () => {
  let component: AnalyticsChatcustomdashboardComponent;
  let fixture: ComponentFixture<AnalyticsChatcustomdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsChatcustomdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsChatcustomdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
