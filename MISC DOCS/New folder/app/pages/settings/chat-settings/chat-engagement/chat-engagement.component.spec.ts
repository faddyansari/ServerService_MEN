import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEngagementComponent } from './chat-engagement.component';

describe('ChatEngagementComponent', () => {
  let component: ChatEngagementComponent;
  let fixture: ComponentFixture<ChatEngagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatEngagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatEngagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
