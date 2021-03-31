"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketNotesComponent = void 0;
var core_1 = require("@angular/core");
var TicketNotesComponent = /** @class */ (function () {
    function TicketNotesComponent(sanitized) {
        this.sanitized = sanitized;
        this.enableAdd = false;
        this.index = '';
        this.ticketNote = '';
        this.Ticketnotes = [];
        this.ticketnote = new core_1.EventEmitter();
        this.deleteNote = new core_1.EventEmitter();
        this.config = {
            placeholder: 'Add Note..',
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['table', ['table']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontstyle', ['backcolor']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['linkDialogShow', 'unlink']],
                ['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]
            ]
        };
    }
    TicketNotesComponent.prototype.ngOnInit = function () {
    };
    TicketNotesComponent.prototype.AddNote = function () {
        this.enableAdd = true;
    };
    TicketNotesComponent.prototype.CancelNote = function () {
        this.enableAdd = false;
    };
    TicketNotesComponent.prototype.SaveNote = function () {
        // if (this.Ticketnotes && this.Ticketnotes.filter(data => data.ticketNote == this.ticketNote).length > 0) {
        // this.snackBar.openFromComponent(ToastNotifications, {
        //     data: {
        //         img: 'warning',
        //         msg: 'Note already exists!'
        //     },
        //     duration: 3000,
        //     panelClass: ['user-alert', 'error']
        // });
        // }
        this.ticketnote.emit(this.ticketNote);
        this.enableAdd = false;
        this.ticketNote = '';
    };
    TicketNotesComponent.prototype.isNullOrWhiteSpace = function () {
        return !this.ticketNote.replace(/&nbsp;|<br>|<\/br>/g, ' ').trim();
    };
    TicketNotesComponent.prototype.popperOnClick = function (data, index) {
        this.previewNote = this.sanitized.bypassSecurityTrustHtml(data);
        this.index = index;
    };
    TicketNotesComponent.prototype.ClosePopper = function () {
        this.previewPopper.hide();
    };
    TicketNotesComponent.prototype.DeleteNote = function (note) {
        this.deleteNote.emit({ id: note.id, note: note });
    };
    __decorate([
        core_1.ViewChild('previewPopper')
    ], TicketNotesComponent.prototype, "previewPopper", void 0);
    __decorate([
        core_1.Input('Ticketnotes')
    ], TicketNotesComponent.prototype, "Ticketnotes", void 0);
    __decorate([
        core_1.Output('ticketnote')
    ], TicketNotesComponent.prototype, "ticketnote", void 0);
    __decorate([
        core_1.Output('deleteNote')
    ], TicketNotesComponent.prototype, "deleteNote", void 0);
    TicketNotesComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-notes',
            templateUrl: './ticket-notes.component.html',
            styleUrls: ['./ticket-notes.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], TicketNotesComponent);
    return TicketNotesComponent;
}());
exports.TicketNotesComponent = TicketNotesComponent;
//# sourceMappingURL=ticket-notes.component.js.map