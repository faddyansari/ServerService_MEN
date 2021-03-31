import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmDetailsComponent } from './crm-details.component';

describe('CrmDetailsComponent', () => {
  let component: CrmDetailsComponent;
  let fixture: ComponentFixture<CrmDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
