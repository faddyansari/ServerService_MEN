import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsChatComponent } from './agents-chat.component';

describe('AgentsChatComponent', () => {
  let component: AgentsChatComponent;
  let fixture: ComponentFixture<AgentsChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentsChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
