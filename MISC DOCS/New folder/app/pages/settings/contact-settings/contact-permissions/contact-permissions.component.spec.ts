import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPermissionsComponent } from './contact-permissions.component';

describe('ContactPermissionsComponent', () => {
  let component: ContactPermissionsComponent;
  let fixture: ComponentFixture<ContactPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
