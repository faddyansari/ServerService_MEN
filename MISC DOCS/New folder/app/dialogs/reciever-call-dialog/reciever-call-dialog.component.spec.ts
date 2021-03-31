import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieverCallDialogComponent } from './reciever-call-dialog.component';

describe('RecieverCallDialogComponent', () => {
  let component: RecieverCallDialogComponent;
  let fixture: ComponentFixture<RecieverCallDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecieverCallDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecieverCallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
