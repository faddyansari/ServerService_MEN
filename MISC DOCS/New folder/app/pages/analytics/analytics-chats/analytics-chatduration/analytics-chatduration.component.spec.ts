import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsChatdurationComponent } from './analytics-chatduration.component';

describe('AnalyticsChatdurationComponent', () => {
  let component: AnalyticsChatdurationComponent;
  let fixture: ComponentFixture<AnalyticsChatdurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsChatdurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsChatdurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
