import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFaqDialogComponent } from './add-faq-dialog.component';

describe('AddFaqDialogComponent', () => {
  let component: AddFaqDialogComponent;
  let fixture: ComponentFixture<AddFaqDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFaqDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFaqDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
