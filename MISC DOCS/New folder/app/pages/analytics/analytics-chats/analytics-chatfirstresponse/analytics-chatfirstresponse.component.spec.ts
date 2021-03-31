import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsChatfirstresponseComponent } from './analytics-chatfirstresponse.component';

describe('AnalyticsChatfirstresponseComponent', () => {
  let component: AnalyticsChatfirstresponseComponent;
  let fixture: ComponentFixture<AnalyticsChatfirstresponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsChatfirstresponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsChatfirstresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
