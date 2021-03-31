"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DpIntentComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var DpIntentComponent = /** @class */ (function () {
    // @HostListener('input', ['$event.target'])
    function DpIntentComponent(snackBar, formbuilder, dialog, BotService) {
        var _this = this;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.BotService = BotService;
        // selectAll = false;
        // editMode = false;
        // checked_list = [];
        // edit = false;
        this.intent_list = [];
        this.t_phrase_list = [];
        this.entities_list = [];
        this.add = false;
        this.intentID = 0;
        this.subscriptions = [];
        this.list = [];
        this.showTrainingPhrasesOpts = false;
        this.showTrainingPhrasesForm = false;
        this.trainingPhraseSelected = false;
        this.showIntentForm = false;
        this.updatedIntent = '';
        this.IntentForm = formbuilder.group({
            'name': [null, forms_1.Validators.required]
        });
        this.TrainingForm = formbuilder.group({
            'training_phrases': [null, forms_1.Validators.required]
        });
        this.subscriptions.push(BotService.getEntity().subscribe(function (data) {
            _this.entities_list = data;
            // console.log('Entities List');
        }));
        this.subscriptions.push(BotService.getIntent().subscribe(function (data) {
            _this.intent_list = data;
        }));
        this.subscriptions.push(BotService.getTPhrase().subscribe(function (data) {
            _this.t_phrase_list = data;
            // console.log('Phrase List!');
        }));
    }
    // @HostListener('mouseup', ['$event'])
    // MouseEvent(event) {
    //   console.log('Mouse Up');
    //   if (event.target.id == 'training_phrase') {
    //     var text = "";
    //     if (window.getSelection) {
    //       text = window.getSelection().toString();
    //     }
    //     if (text != "") {
    //       this.showTrainingPhrasesOpts = true;
    //     } else {
    //       this.showTrainingPhrasesOpts = false;
    //     }
    //   }
    // }
    DpIntentComponent.prototype.ngOnInit = function () { };
    DpIntentComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    // Save(){
    //  //Send a rest call or call an api from ChatBotService
    // }
    DpIntentComponent.prototype.AddIntent = function (name) {
        this.BotService.addIntent(name);
        this.IntentForm.reset();
    };
    DpIntentComponent.prototype.ToggleAdd = function () {
        this.add = !this.add;
    };
    DpIntentComponent.prototype.editIntent = function (intent) {
        var _this = this;
        this.updatedIntent = '';
        this.intent_list.map(function (i) {
            if (i._id == intent._id) {
                i.editable = true;
                _this.updatedIntent = i.name;
                return i;
            }
        });
    };
    DpIntentComponent.prototype.cancelEdit = function (intent) {
        this.intent_list.map(function (i) {
            if (i._id == intent._id) {
                i.editable = false;
                return i;
            }
        });
    };
    DpIntentComponent.prototype.updateIntent = function (intent) {
        intent.editable = false;
        this.BotService.updateIntent(intent._id, this.updatedIntent);
        this.updatedIntent = '';
    };
    DpIntentComponent.prototype.deleteIntent = function (intent, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete " + intent.name + " ?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                // this.intent_list.splice(index, 1);
                // this.t_phrase_list.filter(i => i.intent_id == intent.id).forEach((element, index) => {
                //   this.t_phrase_list.splice(index,1);
                // })
                _this.BotService.deleteIntent(intent._id, index);
            }
        });
        // this.BotService.updateIntentList(this.intent_list);
    };
    DpIntentComponent.prototype.showTrainingPhrases = function (intent) {
        var _this = this;
        this.intent_list.map(function (i) {
            if (i._id == intent._id) {
                i.trainingPhrases = true;
                _this.trainingPhraseSelected = true;
                return i;
            }
            i.trainingPhrases = false;
        });
        //console.log(this.intent_list);
    };
    DpIntentComponent.prototype.toggleTrainingPhraseForm = function () {
        this.showTrainingPhrasesForm = !this.showTrainingPhrasesForm;
    };
    DpIntentComponent.prototype.toggleIntentForm = function () {
        this.showIntentForm = !this.showIntentForm;
    };
    DpIntentComponent.prototype.AddTPhrase = function (name, id) {
        this.BotService.addTPhrase(name, id);
        this.TrainingForm.reset();
    };
    DpIntentComponent.prototype.deleteTrainPhrase = function (trainPhrase, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete this PHRASE ?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                // this.t_phrase_list.splice(index, 1);
                _this.BotService.deleteTPhrase(trainPhrase._id, trainPhrase.intent_id, index);
            }
        });
        // this.BotService.updateTPhraseList(this.t_phrase_list);
    };
    // getSelectionText() {
    //     var text = "";
    //     if (window.getSelection) {
    //         text = window.getSelection().toString();
    //     } else if ((document as HTMLDocument).selection && document.selection.type != "Control") {
    //         text = document.selection.createRange().text;
    //     }
    //     return text;
    //   }
    DpIntentComponent.prototype.toggleSelection = function (j) {
        var _this = this;
        setTimeout(function () {
            if (window.getSelection().type == 'None') {
                j.markable = false;
                return;
            }
            ;
            var text = window.getSelection().toString();
            var start = window.getSelection().getRangeAt(0).startOffset;
            var end = window.getSelection().getRangeAt(0).endOffset;
            _this.t_phrase_list.map(function (i) {
                if (i._id == j._id && text && start != end) {
                    i.markable = true;
                    return i;
                }
                else {
                    i.markable = false;
                    return i;
                }
                // i.markable = false;
            });
        }, 0);
    };
    DpIntentComponent.prototype.scrollDown = function (tPhrase) {
        this.t_phrase_list.map(function (i) {
            if (i._id == tPhrase._id) {
                tPhrase.entities.map(function (p) {
                    if (p.id) {
                        i.isScroll = true;
                        i.markable = false;
                    }
                    else {
                        i.isScroll = false;
                        i.markable = false;
                    }
                });
                return i;
            }
        });
    };
    DpIntentComponent.prototype.scrollUp = function (tPhrase) {
        console.log('hello');
        this.t_phrase_list.map(function (i) {
            if (i._id == tPhrase._id) {
                tPhrase.entities.map(function (p) {
                    if (p.id) {
                        i.isScroll = false;
                    }
                });
                return i;
            }
        });
    };
    DpIntentComponent.prototype.dupError = function (tPhrase) {
        this.t_phrase_list.map(function (i) {
            if (i._id == tPhrase._id) {
                tPhrase.entities.map(function (p) {
                    if (p.id) {
                        i.markable = false;
                        console.log('Can not mark duplicate entity');
                    }
                });
                return i;
            }
        });
    };
    DpIntentComponent.prototype.MarkPhrase = function (tPhrase) {
        var _this = this;
        var text = window.getSelection().toString();
        var start = window.getSelection().getRangeAt(0).startOffset;
        var end = window.getSelection().getRangeAt(0).endOffset;
        this.BotService.markPhrase(tPhrase._id, start, end, text).subscribe(function (response) {
            if (response == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Word marked successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.scrollDown(tPhrase);
            }
            else {
                // this.scrollUp(tPhrase);
                _this.dupError(tPhrase);
            }
        });
        window.getSelection().empty();
    };
    DpIntentComponent.prototype.selectEntity = function (phrase, entity, event) {
        this.BotService.selEntity(phrase._id, entity.id, event.target.value);
    };
    DpIntentComponent.prototype.deleteMarkedEntity = function (tPhraseId, entId, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete this marked entity ?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                // this.t_phrase_list = JSON.parse(JSON.stringify(this.t_phrase_list));
                _this.BotService.delMarkEnt(tPhraseId, entId, index);
            }
        });
    };
    DpIntentComponent = __decorate([
        core_1.Component({
            selector: 'app-dp-intent',
            templateUrl: './dp-intent.component.html',
            styleUrls: ['./dp-intent.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DpIntentComponent);
    return DpIntentComponent;
}());
exports.DpIntentComponent = DpIntentComponent;
//# sourceMappingURL=dp-intent.component.js.map