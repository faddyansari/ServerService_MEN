"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var LayoutComponent = /** @class */ (function () {
    function LayoutComponent(dialog, _emailTemplateService, snackBar) {
        this.dialog = dialog;
        this._emailTemplateService = _emailTemplateService;
        this.snackBar = snackBar;
        this.editClosed = false;
        this.isDragged = false;
        this.activeId = '';
        this.sendingChange = new core_1.EventEmitter();
        this.deleteChange = new core_1.EventEmitter();
        this.cloneElement = new core_1.EventEmitter();
        this.draggedElement = new core_1.EventEmitter();
        this.links = {
            'Facebook': '/assets/img/icons/icons-sprite.svg#facebook',
            'Twitter': '/assets/img/icons/icons-sprite.svg#twitter',
            'LinkedIn': '/assets/img/icons/icons-sprite.svg#linkedin',
            'Youtube': '/assets/img/icons/icons-sprite.svg#youtube',
            'Instagram': '/assets/img/icons/icons-sprite.svg#instagram',
        };
        this.showPanel = false;
        this.subscriptions = [];
    }
    LayoutComponent.prototype.ngOnInit = function () {
    };
    LayoutComponent.prototype.ngAfterViewInit = function () {
    };
    LayoutComponent.prototype.DeleteElement = function (event, id) {
        var _this = this;
        var el = document.getElementById(id);
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this element?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                if (el.parentNode.tagName.toLowerCase() == 'td') {
                    _this.elementsList.map(function (search) {
                        search.childs.map(function (sectionSearch) {
                            if (sectionSearch.id == el.parentNode.id) {
                                sectionSearch.sectionChilds.map(function (x, ind) {
                                    if (x.id == id) {
                                        sectionSearch.sectionChilds.splice(ind, 1);
                                    }
                                });
                            }
                        });
                    });
                }
                else {
                    _this.elementsList.map(function (val, ind) {
                        if (val['id'] == id) {
                            _this.elementsList.splice(ind, 1);
                            _this.deleteChange.emit({ showPanel: false });
                        }
                    });
                }
                _this.deleteChange.emit({ showPanel: false });
            }
            else
                return;
        });
    };
    LayoutComponent.prototype.EditElement = function (event, id) {
        this.activeId = id;
        this.showPanel = true;
        this.sendingChange.emit({ showPanel: this.showPanel, id: id, event: event });
        // this.showPanel = false;
    };
    LayoutComponent.prototype.CloneElement = function (event, element, td) {
        this.cloneElement.emit({ element: element, event: event, td: td });
    };
    LayoutComponent.prototype.ReturnImg = function (linkType) {
        var key = Object.keys(this.links).filter(function (part) { return part == linkType; });
        return this.links[linkType];
    };
    // dragStart(ev) {
    //   console.log(ev);
    //   ev.dataTransfer.effectAllowed = "move";
    //   this.draggedElement.emit(ev);
    //   // let index = this.elementsList.findIndex(x => x.id == ev.target.id);
    //   // console.log(index);
    //   // [this.elementsList[index], this.elementsList[index + 1]] = [this.elementsList[index + 1], this.elementsList[index]];
    // }
    // DragLeave(event) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   event.stopImmediatePropagation();
    //   event.dataTransfer.dropEffect = "move";
    //   this.isDragged = false;
    //   //console.log('Drag End');
    // }
    // allowDrop(event) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   event.stopImmediatePropagation();
    //   event.dataTransfer.dropEffect = "move";
    //   this.isDragged = true;
    // }
    LayoutComponent.prototype.reOrderUp = function (index, elt) {
        var _a;
        var _this = this;
        console.log("ele", elt);
        if (index == 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No element to swap up!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            if (elt.includes('Insection')) {
                this.elementsList.map(function (search) {
                    search.childs.forEach(function (sectionSearch) {
                        if (sectionSearch.sectionChilds && sectionSearch.sectionChilds.length) {
                            for (var i = 0; i <= sectionSearch.sectionChilds.length - 1; i++) {
                                if (sectionSearch.sectionChilds[i].id == elt.id) {
                                    sectionSearch.sectionChilds = _this.reOrderFunc(index, sectionSearch.sectionChilds, 'up');
                                    break;
                                }
                            }
                        }
                    });
                });
            }
            else {
                _a = [this.elementsList[index - 1], this.elementsList[index]], this.elementsList[index] = _a[0], this.elementsList[index - 1] = _a[1];
            }
        }
    };
    LayoutComponent.prototype.reOrderDown = function (index) {
        var _a;
        if (index === this.elementsList.length - 1) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No element to swap down!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            _a = [this.elementsList[index + 1], this.elementsList[index]], this.elementsList[index] = _a[0], this.elementsList[index + 1] = _a[1];
        }
    };
    LayoutComponent.prototype.reOrderDownSec = function (index, elt) {
        var _this = this;
        this.elementsList.map(function (search) {
            search.childs.forEach(function (sectionSearch) {
                if (sectionSearch.sectionChilds && sectionSearch.sectionChilds.length) {
                    if (index === sectionSearch.sectionChilds.length - 1) {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'No element to swap down!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'warning']
                        });
                        return;
                    }
                    else {
                        for (var i = 0; i <= sectionSearch.sectionChilds.length - 1; i++) {
                            if (sectionSearch.sectionChilds[i].id == elt.id) {
                                sectionSearch.sectionChilds = _this.reOrderFunc(index, sectionSearch.sectionChilds, 'down');
                                break;
                            }
                        }
                    }
                }
                else
                    return;
            });
        });
    };
    LayoutComponent.prototype.reOrderFunc = function (index, elements, type) {
        var _a, _b;
        switch (type) {
            case 'up':
                _a = [elements[index - 1], elements[index]], elements[index] = _a[0], elements[index - 1] = _a[1];
                break;
            case 'down':
                _b = [elements[index + 1], elements[index]], elements[index] = _b[0], elements[index + 1] = _b[1];
                break;
        }
        return elements;
    };
    __decorate([
        core_1.Input()
    ], LayoutComponent.prototype, "elementsList", void 0);
    __decorate([
        core_1.Input()
    ], LayoutComponent.prototype, "editClosed", void 0);
    __decorate([
        core_1.Input()
    ], LayoutComponent.prototype, "isDragged", void 0);
    __decorate([
        core_1.Output()
    ], LayoutComponent.prototype, "sendingChange", void 0);
    __decorate([
        core_1.Output()
    ], LayoutComponent.prototype, "deleteChange", void 0);
    __decorate([
        core_1.Output()
    ], LayoutComponent.prototype, "cloneElement", void 0);
    __decorate([
        core_1.Output()
    ], LayoutComponent.prototype, "draggedElement", void 0);
    LayoutComponent = __decorate([
        core_1.Component({
            selector: 'app-layout',
            templateUrl: './layout.component.html',
            styleUrls: ['./layout.component.scss'],
            // changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], LayoutComponent);
    return LayoutComponent;
}());
exports.LayoutComponent = LayoutComponent;
//# sourceMappingURL=layout.component.js.map