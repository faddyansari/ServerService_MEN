import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCustomFieldsComponent } from './chat-custom-fields.component';

describe('ChatCustomFieldsComponent', () => {
  let component: ChatCustomFieldsComponent;
  let fixture: ComponentFixture<ChatCustomFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatCustomFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
