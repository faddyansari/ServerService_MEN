"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var noagent_ticket_dialog_component_1 = require("./noagent-ticket-dialog.component");
describe('NoagentTicketDialogComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [noagent_ticket_dialog_component_1.NoagentTicketDialogComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(noagent_ticket_dialog_component_1.NoagentTicketDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=noagent-ticket-dialog.component.spec.js.map