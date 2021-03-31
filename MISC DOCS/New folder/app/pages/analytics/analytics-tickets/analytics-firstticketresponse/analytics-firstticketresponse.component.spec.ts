import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsFirstticketresponseComponent } from './analytics-firstticketresponse.component';

describe('AnalyticsFirstticketresponseComponent', () => {
  let component: AnalyticsFirstticketresponseComponent;
  let fixture: ComponentFixture<AnalyticsFirstticketresponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsFirstticketresponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsFirstticketresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
