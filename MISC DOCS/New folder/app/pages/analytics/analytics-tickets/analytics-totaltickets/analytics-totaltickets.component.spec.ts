import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTotalticketsComponent } from './analytics-totaltickets.component';

describe('AnalyticsTotalticketsComponent', () => {
  let component: AnalyticsTotalticketsComponent;
  let fixture: ComponentFixture<AnalyticsTotalticketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsTotalticketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsTotalticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
