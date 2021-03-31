import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentListSidebarComponent } from './agent-list-sidebar.component';

describe('AgentListSidebarComponent', () => {
  let component: AgentListSidebarComponent;
  let fixture: ComponentFixture<AgentListSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentListSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentListSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
