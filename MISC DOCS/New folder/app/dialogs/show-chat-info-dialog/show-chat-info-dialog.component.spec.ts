import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChatInfoDialogComponent } from './show-chat-info-dialog.component';

describe('ShowChatInfoDialogComponent', () => {
  let component: ShowChatInfoDialogComponent;
  let fixture: ComponentFixture<ShowChatInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowChatInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChatInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
