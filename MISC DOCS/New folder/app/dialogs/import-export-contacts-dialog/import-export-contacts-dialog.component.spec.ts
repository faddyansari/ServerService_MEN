import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExportContactsDialogComponent } from './import-export-contacts-dialog.component';

describe('ImportExportContactsDialogComponent', () => {
  let component: ImportExportContactsDialogComponent;
  let fixture: ComponentFixture<ImportExportContactsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExportContactsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportContactsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
