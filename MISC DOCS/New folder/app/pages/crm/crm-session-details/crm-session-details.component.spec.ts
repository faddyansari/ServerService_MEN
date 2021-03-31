import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmSessionDetailsComponent } from './crm-session-details.component';

describe('CrmSessionDetailsComponent', () => {
  let component: CrmSessionDetailsComponent;
  let fixture: ComponentFixture<CrmSessionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmSessionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmSessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
