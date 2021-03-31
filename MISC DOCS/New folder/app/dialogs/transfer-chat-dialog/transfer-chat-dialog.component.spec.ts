import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferChatDialog } from './transfer-chat-dialog.component';

describe('TransferChatDialogComponent', () => {
  let component: TransferChatDialog;
  let fixture: ComponentFixture<TransferChatDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferChatDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferChatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
