import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTotalchatsComponent } from './analytics-totalchats.component';

describe('AnalyticsTotalchatsComponent', () => {
  let component: AnalyticsTotalchatsComponent;
  let fixture: ComponentFixture<AnalyticsTotalchatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsTotalchatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsTotalchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
