import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgeMessageComponent } from './acknowledge-message.component';

describe('AcknowledgeMessageComponent', () => {
  let component: AcknowledgeMessageComponent;
  let fixture: ComponentFixture<AcknowledgeMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcknowledgeMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
