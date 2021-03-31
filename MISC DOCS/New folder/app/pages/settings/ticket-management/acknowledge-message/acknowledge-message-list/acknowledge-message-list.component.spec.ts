import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgeMessageListComponent } from './acknowledge-message-list.component';

describe('AcknowledgeMessageListComponent', () => {
  let component: AcknowledgeMessageListComponent;
  let fixture: ComponentFixture<AcknowledgeMessageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcknowledgeMessageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgeMessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
