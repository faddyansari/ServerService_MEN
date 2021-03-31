import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListInboxComponent } from './chat-list-inbox.component';

describe('ChatListInboxComponent', () => {
  let component: ChatListInboxComponent;
  let fixture: ComponentFixture<ChatListInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatListInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatListInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
