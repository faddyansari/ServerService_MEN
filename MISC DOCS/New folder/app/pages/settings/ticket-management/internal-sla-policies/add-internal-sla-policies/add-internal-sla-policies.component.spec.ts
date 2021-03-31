import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternalSlaPoliciesComponent } from './add-internal-sla-policies.component';

describe('AddInternalSlaPoliciesComponent', () => {
  let component: AddInternalSlaPoliciesComponent;
  let fixture: ComponentFixture<AddInternalSlaPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInternalSlaPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInternalSlaPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
