import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedPoliciesComponent } from './activated-policies.component';

describe('ActivatedPoliciesComponent', () => {
  let component: ActivatedPoliciesComponent;
  let fixture: ComponentFixture<ActivatedPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivatedPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivatedPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
