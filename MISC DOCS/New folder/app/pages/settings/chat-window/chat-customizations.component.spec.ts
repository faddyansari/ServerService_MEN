import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCustomizationsComponent } from './chat-customizations.component';

describe('ChatCustomizationsComponent', () => {
  let component: ChatCustomizationsComponent;
  let fixture: ComponentFixture<ChatCustomizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatCustomizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatCustomizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
