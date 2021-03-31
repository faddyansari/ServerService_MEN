import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSlaPoliciesListComponent } from './internal-sla-policies-list.component';

describe('InternalSlaPoliciesListComponent', () => {
  let component: InternalSlaPoliciesListComponent;
  let fixture: ComponentFixture<InternalSlaPoliciesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSlaPoliciesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSlaPoliciesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
