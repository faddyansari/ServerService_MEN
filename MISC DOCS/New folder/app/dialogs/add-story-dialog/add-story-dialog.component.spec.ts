import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoryDialogComponent } from './add-story-dialog.component';

describe('AddStoryDialogComponent', () => {
  let component: AddStoryDialogComponent;
  let fixture: ComponentFixture<AddStoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
