import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSlaPoliciesComponent } from './internal-sla-policies.component';

describe('InternalSlaPoliciesComponent', () => {
  let component: InternalSlaPoliciesComponent;
  let fixture: ComponentFixture<InternalSlaPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSlaPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSlaPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
