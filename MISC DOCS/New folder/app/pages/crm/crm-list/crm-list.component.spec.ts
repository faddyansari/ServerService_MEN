import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmListComponent } from './crm-list.component';

describe('CrmListComponent', () => {
  let component: CrmListComponent;
  let fixture: ComponentFixture<CrmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
