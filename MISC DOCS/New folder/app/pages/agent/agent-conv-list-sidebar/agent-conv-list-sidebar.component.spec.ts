import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentConvListSidebarComponent } from './agent-conv-list-sidebar.component';

describe('AgentConvListSidebarComponent', () => {
  let component: AgentConvListSidebarComponent;
  let fixture: ComponentFixture<AgentConvListSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentConvListSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentConvListSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
