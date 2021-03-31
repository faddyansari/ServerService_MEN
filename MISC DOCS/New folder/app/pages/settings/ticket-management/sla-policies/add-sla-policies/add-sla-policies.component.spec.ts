import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlaPoliciesComponent } from './add-sla-policies.component';

describe('AddSlaPoliciesComponent', () => {
  let component: AddSlaPoliciesComponent;
  let fixture: ComponentFixture<AddSlaPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSlaPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSlaPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
