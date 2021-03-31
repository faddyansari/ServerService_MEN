import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeConfirmationComponent } from './merge-confirmation.component';

describe('MergeConfirmationComponent', () => {
  let component: MergeConfirmationComponent;
  let fixture: ComponentFixture<MergeConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
