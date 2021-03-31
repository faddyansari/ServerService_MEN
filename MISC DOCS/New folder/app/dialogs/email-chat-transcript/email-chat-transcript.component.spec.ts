import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailChatTranscriptComponent } from './email-chat-transcript.component';

describe('EmailChatTranscriptComponent', () => {
  let component: EmailChatTranscriptComponent;
  let fixture: ComponentFixture<EmailChatTranscriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailChatTranscriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailChatTranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
