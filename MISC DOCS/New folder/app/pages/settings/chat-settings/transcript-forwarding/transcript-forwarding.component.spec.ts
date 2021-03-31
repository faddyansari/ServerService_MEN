import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptForwardingComponent } from './transcript-forwarding.component';

describe('TranscriptForwardingComponent', () => {
  let component: TranscriptForwardingComponent;
  let fixture: ComponentFixture<TranscriptForwardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriptForwardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptForwardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
