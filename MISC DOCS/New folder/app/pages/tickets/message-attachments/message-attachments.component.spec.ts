import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageAttachmentsComponent } from './message-attachments.component';

describe('MessageAttachmentsComponent', () => {
  let component: MessageAttachmentsComponent;
  let fixture: ComponentFixture<MessageAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
