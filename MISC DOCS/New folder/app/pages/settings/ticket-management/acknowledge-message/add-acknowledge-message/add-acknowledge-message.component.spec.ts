import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAcknowledgeMessageComponent } from './add-acknowledge-message.component';

describe('AddAcknowledgeMessageComponent', () => {
  let component: AddAcknowledgeMessageComponent;
  let fixture: ComponentFixture<AddAcknowledgeMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAcknowledgeMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAcknowledgeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
