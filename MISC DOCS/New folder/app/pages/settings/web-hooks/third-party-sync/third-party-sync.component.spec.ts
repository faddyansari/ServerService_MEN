import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartySyncComponent } from './third-party-sync.component';

describe('ThirdPartySyncComponent', () => {
  let component: ThirdPartySyncComponent;
  let fixture: ComponentFixture<ThirdPartySyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdPartySyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartySyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
