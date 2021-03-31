import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuedComponent } from './queued.component';

describe('QueuedComponent', () => {
  let component: QueuedComponent;
  let fixture: ComponentFixture<QueuedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
