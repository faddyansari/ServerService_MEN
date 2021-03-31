import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespFunctionComponent } from './resp-function.component';

describe('RespFunctionComponent', () => {
  let component: RespFunctionComponent;
  let fixture: ComponentFixture<RespFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
