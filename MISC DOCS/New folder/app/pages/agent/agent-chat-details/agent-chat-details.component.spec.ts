import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentChatDetailsComponent } from './agent-chat-details.component';

describe('AgentChatDetailsComponent', () => {
  let component: AgentChatDetailsComponent;
  let fixture: ComponentFixture<AgentChatDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentChatDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentChatDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
