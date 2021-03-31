import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCustomerSearchComponent } from './icon-customer-search.component';

describe('IconCustomerSearchComponent', () => {
  let component: IconCustomerSearchComponent;
  let fixture: ComponentFixture<IconCustomerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconCustomerSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconCustomerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
