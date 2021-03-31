import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomScriptComponent } from './custom-script.component';

describe('CustomScriptComponent', () => {
  let component: CustomScriptComponent;
  let fixture: ComponentFixture<CustomScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
