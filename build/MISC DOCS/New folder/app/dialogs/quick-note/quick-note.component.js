"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickNoteComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var QuickNoteComponent = /** @class */ (function () {
    function QuickNoteComponent(_ticketService, data, dialogRef) {
        this._ticketService = _ticketService;
        this.data = data;
        this.dialogRef = dialogRef;
        this.loading = false;
        this.ticketNote = '';
        this.buttonIsDisabled = true;
        this.editNote = false;
        this.shiftdown = false;
        this.subscriptions = [];
        this.config = {
            placeholder: 'Add Note..',
            toolbar: [
                ['style', ['bold', 'italic', 'underline']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['fontName', ['fontName']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['linkDialogShow', 'unlink']],
                ['view', ['fullscreen', 'codeview', 'undo', 'redo']]
            ]
        };
    }
    QuickNoteComponent.prototype.isNullOrWhiteSpace = function () {
        return !this.ticketNote.replace(/&nbsp;|<br>|<\/br>/g, ' ').trim();
    };
    QuickNoteComponent.prototype.keydownX = function (event) {
        switch (event.key.toLowerCase()) {
            case 'shift':
                {
                    this.shiftdown = true;
                    break;
                }
        }
    };
    QuickNoteComponent.prototype.keyupX = function (event) {
        var _this = this;
        switch (event.key.toLowerCase()) {
            case 'enter':
                {
                    if (!this.shiftdown) {
                        this.Save();
                    }
                    break;
                }
            case 'shift':
                {
                    setTimeout(function () {
                        _this.shiftdown = false;
                    }, 100);
                    break;
                }
        }
    };
    QuickNoteComponent.prototype.Save = function () {
        var _this = this;
        // console.log(this.previousNote);
        // console.log(this.ticketNote);
        this.editNote = true;
        this._ticketService.editNote({ ticketNote: this.ticketNote }, this.data.details.map(function (e) { return e._id; }))
            .subscribe(function (response) {
            if (response.status == 'ok') {
                // console.log(response);
                _this.editNote = false;
                _this.dialogRef.close({
                    status: true,
                    ticketids: _this.data.details.map(function (e) { return e._id; }),
                    updatedNote: response
                });
            }
        });
        // this.ticketNote= (this.previousNote) ? this.previousNote + this.ticketNote : this.ticketNote
        // console.log("after res" ,this.ticketNote);
    };
    QuickNoteComponent = __decorate([
        core_1.Component({
            selector: 'app-note',
            templateUrl: './quick-note.component.html',
            styleUrls: ['./quick-note.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], QuickNoteComponent);
    return QuickNoteComponent;
}());
exports.QuickNoteComponent = QuickNoteComponent;
//# sourceMappingURL=quick-note.component.js.map