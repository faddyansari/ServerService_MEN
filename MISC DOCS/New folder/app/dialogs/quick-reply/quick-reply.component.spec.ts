import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickReplyComponent } from './quick-reply.component';

describe('QuickReplyComponent', () => {
  let component: QuickReplyComponent;
  let fixture: ComponentFixture<QuickReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
