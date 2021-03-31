import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebHooksComponent } from './web-hooks.component';

describe('WebHooksComponent', () => {
  let component: WebHooksComponent;
  let fixture: ComponentFixture<WebHooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebHooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebHooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
