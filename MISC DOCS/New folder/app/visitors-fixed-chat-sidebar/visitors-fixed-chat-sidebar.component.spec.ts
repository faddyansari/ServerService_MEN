import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorsFixedChatSidebarComponent } from './visitors-fixed-chat-sidebar.component';

describe('VisitorsFixedChatSidebarComponent', () => {
  let component: VisitorsFixedChatSidebarComponent;
  let fixture: ComponentFixture<VisitorsFixedChatSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorsFixedChatSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorsFixedChatSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
