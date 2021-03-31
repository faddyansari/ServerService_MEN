import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAckMessageComponent } from './preview-ack-message.component';

describe('PreviewAckMessageComponent', () => {
  let component: PreviewAckMessageComponent;
  let fixture: ComponentFixture<PreviewAckMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewAckMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAckMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
