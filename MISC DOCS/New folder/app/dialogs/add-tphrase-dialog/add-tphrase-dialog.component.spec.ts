import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTphraseDialogComponent } from './add-tphrase-dialog.component';

describe('AddTphraseDialogComponent', () => {
  let component: AddTphraseDialogComponent;
  let fixture: ComponentFixture<AddTphraseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTphraseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTphraseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
