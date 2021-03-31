import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSettingsTimeoutsComponent } from './chat-settings-timeouts.component';

describe('ChatSettingsTimeoutsComponent', () => {
  let component: ChatSettingsTimeoutsComponent;
  let fixture: ComponentFixture<ChatSettingsTimeoutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatSettingsTimeoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSettingsTimeoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
