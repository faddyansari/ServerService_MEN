import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActionsDialogComponent } from './add-actions-dialog.component';

describe('AddActionsDialogComponent', () => {
  let component: AddActionsDialogComponent;
  let fixture: ComponentFixture<AddActionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
