import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTotalvisitorsNewComponent } from './analytics-totalvisitors-new.component';

describe('AnalyticsTotalvisitorsNewComponent', () => {
  let component: AnalyticsTotalvisitorsNewComponent;
  let fixture: ComponentFixture<AnalyticsTotalvisitorsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsTotalvisitorsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsTotalvisitorsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
