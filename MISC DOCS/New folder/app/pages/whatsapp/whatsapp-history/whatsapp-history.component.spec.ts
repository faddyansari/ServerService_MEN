import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappHistoryComponent } from './whatsapp-history.component';

describe('WhatsappHistoryComponent', () => {
  let component: WhatsappHistoryComponent;
  let fixture: ComponentFixture<WhatsappHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
