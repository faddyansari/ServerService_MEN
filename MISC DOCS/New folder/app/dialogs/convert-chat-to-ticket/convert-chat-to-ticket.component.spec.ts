import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertChatToTicketComponent } from './convert-chat-to-ticket.component';

describe('ConvertChatToTicketComponent', () => {
  let component: ConvertChatToTicketComponent;
  let fixture: ComponentFixture<ConvertChatToTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertChatToTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertChatToTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
