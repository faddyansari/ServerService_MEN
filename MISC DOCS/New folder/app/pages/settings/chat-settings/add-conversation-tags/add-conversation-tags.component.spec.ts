import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConversationTagsComponent } from './add-conversation-tags.component';

describe('AddConversationTagsComponent', () => {
  let component: AddConversationTagsComponent;
  let fixture: ComponentFixture<AddConversationTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConversationTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConversationTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
