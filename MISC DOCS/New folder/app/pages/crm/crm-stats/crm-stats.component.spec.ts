import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmStatsComponent } from './crm-stats.component';

describe('CrmStatsComponent', () => {
  let component: CrmStatsComponent;
  let fixture: ComponentFixture<CrmStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
