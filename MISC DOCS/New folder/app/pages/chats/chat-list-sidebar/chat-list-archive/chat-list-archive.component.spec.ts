import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListArchiveComponent } from './chat-list-archive.component';

describe('ChatListArchiveComponent', () => {
  let component: ChatListArchiveComponent;
  let fixture: ComponentFixture<ChatListArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatListArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatListArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
