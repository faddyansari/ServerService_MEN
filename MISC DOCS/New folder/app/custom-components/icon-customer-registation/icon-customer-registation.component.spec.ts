import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCustomerRegistationComponent } from './icon-customer-registation.component';

describe('IconCustomerRegistationComponent', () => {
  let component: IconCustomerRegistationComponent;
  let fixture: ComponentFixture<IconCustomerRegistationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconCustomerRegistationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconCustomerRegistationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
