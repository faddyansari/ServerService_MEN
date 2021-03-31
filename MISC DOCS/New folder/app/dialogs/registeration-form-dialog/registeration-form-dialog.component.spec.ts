import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterationFormDialogComponent } from './registeration-form-dialog.component';

describe('RegisterationFormDialogComponent', () => {
  let component: RegisterationFormDialogComponent;
  let fixture: ComponentFixture<RegisterationFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterationFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterationFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
