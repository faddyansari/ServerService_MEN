import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactListSidebarComponent } from './contact-list-sidebar.component';

describe('ContactListSidebarComponent', () => {
  let component: ContactListSidebarComponent;
  let fixture: ComponentFixture<ContactListSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactListSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
