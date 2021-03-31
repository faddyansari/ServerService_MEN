import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsMissedchatsComponent } from './analytics-missedchats.component';

describe('AnalyticsMissedchatsComponent', () => {
  let component: AnalyticsMissedchatsComponent;
  let fixture: ComponentFixture<AnalyticsMissedchatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsMissedchatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsMissedchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
