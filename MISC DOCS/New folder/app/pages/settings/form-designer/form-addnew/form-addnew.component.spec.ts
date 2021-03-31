import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddnewComponent } from './form-addnew.component';

describe('FormAddnewComponent', () => {
  let component: FormAddnewComponent;
  let fixture: ComponentFixture<FormAddnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAddnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
