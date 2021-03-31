import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackForm } from './feedback-form.component';

describe('FeedbackForm', () => {
    let component: FeedbackForm;
    let fixture: ComponentFixture<FeedbackForm>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackForm]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedbackForm);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
