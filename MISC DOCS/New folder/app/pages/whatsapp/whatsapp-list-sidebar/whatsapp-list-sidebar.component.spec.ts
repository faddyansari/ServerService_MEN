import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappListSidebarComponent } from './whatsapp-list-sidebar.component';

describe('WhatsappListSidebarComponent', () => {
  let component: WhatsappListSidebarComponent;
  let fixture: ComponentFixture<WhatsappListSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappListSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappListSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
