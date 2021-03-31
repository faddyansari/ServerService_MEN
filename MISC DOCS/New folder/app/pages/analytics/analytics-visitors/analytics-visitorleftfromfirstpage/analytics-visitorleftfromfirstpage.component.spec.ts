import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsVisitorleftfromfirstpageComponent } from './analytics-visitorleftfromfirstpage.component';

describe('AnalyticsVisitorleftfromfirstpageComponent', () => {
  let component: AnalyticsVisitorleftfromfirstpageComponent;
  let fixture: ComponentFixture<AnalyticsVisitorleftfromfirstpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsVisitorleftfromfirstpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsVisitorleftfromfirstpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
