import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappMessagesComponent } from './whatsapp-messages.component';

describe('WhatsappMessagesComponent', () => {
  let component: WhatsappMessagesComponent;
  let fixture: ComponentFixture<WhatsappMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
