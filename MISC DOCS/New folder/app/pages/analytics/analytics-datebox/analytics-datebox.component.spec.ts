import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsDateboxComponent } from './analytics-datebox.component';

describe('AnalyticsDateboxComponent', () => {
  let component: AnalyticsDateboxComponent;
  let fixture: ComponentFixture<AnalyticsDateboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsDateboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsDateboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
