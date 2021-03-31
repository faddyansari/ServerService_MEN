import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsChatsComponent } from './analytics-chats.component';

describe('AnalyticsChatsComponent', () => {
  let component: AnalyticsChatsComponent;
  let fixture: ComponentFixture<AnalyticsChatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsChatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
