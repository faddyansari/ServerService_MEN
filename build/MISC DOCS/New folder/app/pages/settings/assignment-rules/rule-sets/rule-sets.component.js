"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleSetsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var Observable_1 = require("rxjs/Observable");
var RuleSetsComponent = /** @class */ (function () {
    function RuleSetsComponent(formbuilder, _socketService, _authService, _assignmentRuleService, snackBar, _appStateService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._socketService = _socketService;
        this._authService = _authService;
        this._assignmentRuleService = _assignmentRuleService;
        this.snackBar = snackBar;
        this._appStateService = _appStateService;
        this.subscriptions = [];
        this.loading = false;
        this.working = false;
        this.fetching = false;
        this.RulesList = [];
        this.RuleSetList = [];
        this.RuleSet = {};
        //rulesMap: Array<any> = [];
        //filterKeys = [];
        this.showRulesetForm = false;
        this.eventListener = [];
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
        this.subscriptions.push(_socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        }));
        this.subscriptions.push(_assignmentRuleService.fetchingCases.subscribe(function (data) {
            _this.fetching = data;
        }));
        this.subscriptions.push(_socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        }));
        this.subscriptions.push(_authService.getRequestState().subscribe(function (requestState) {
            _this.loading = requestState;
        }));
        this.subscriptions.push(_assignmentRuleService.RulesList.subscribe(function (list) {
            if (list && list.length) {
                _this.RulesList = list;
            }
        }));
        this.subscriptions.push(_assignmentRuleService.RuleSetList.subscribe(function (list) {
            if (list && list.length) {
                _this.RuleSetList = list;
            }
        }));
        this.assignmentRuleSetForm = formbuilder.group({
            'ruleSetName': [
                null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(50),
                ],
                this.CheckRuleSetName.bind(this)
            ]
        });
        this.RuleSet['rules'] = [];
        this.RuleSet['criteria'] = {};
    }
    RuleSetsComponent_1 = RuleSetsComponent;
    RuleSetsComponent.prototype.ngOnInit = function () {
    };
    RuleSetsComponent.prototype.CheckRuleSetName = function (control) {
        var name = this.assignmentRuleSetForm.get('ruleSetName');
        for (var i = 0; i < this.RuleSetList.length; i++) {
            if (this.RuleSetList[i].ruleSetName == name.value) {
                return Observable_1.Observable.of({ 'matched': true });
            }
        }
        return Observable_1.Observable.of(null);
    };
    // DragEvent(event: MouseEvent) {
    //   //console.log(event);
    //   event.preventDefault();
    //   event.stopPropagation();
    //   event.stopImmediatePropagation();
    //   if ((event.target as HTMLElement).id.indexOf('assignRule') !== -1) {
    //     //this.DraggerDiv = (event.target as HTMLElement);
    //     this.CopyDraggedDiv = ((event.target as HTMLElement).cloneNode(true) as HTMLElement);
    //     //this.CopyDraggedDiv.style.visibility = 'hidden';
    //     (event.target as HTMLElement).parentNode.insertBefore(this.CopyDraggedDiv, (event.target as HTMLElement).nextSibling);
    //     let ev = new MouseEvent("mousedown", {
    //       bubbles: true,
    //       cancelable: false,
    //     } as MouseEvent);
    //     Object.defineProperty(ev, 'target', { writable: true, value: this.CopyDraggedDiv });
    //     this.divMove((ev as MouseEvent))
    //   }
    // }
    RuleSetsComponent.prototype.divMove = function (event) {
        var _this = this;
        if (!this.AddRuleArea || !this.AddRuleArea.nativeElement)
            return;
        event.stopPropagation();
        event.stopImmediatePropagation();
        // //console.log(event);
        if (event.target.id) {
            console.log('divMove');
            if (event.target.id.indexOf('assignRule') !== -1) {
                event.preventDefault();
                this.CopyDraggedDiv = event.target.cloneNode(true);
                //this.CopyDraggedDiv.style.visibility = 'hidden';
                //(event.target as HTMLElement).parentNode.insertBefore(this.CopyDraggedDiv, (event.target as HTMLElement).nextSibling);
                this.DraggerDiv = event.target;
                this.DraggerDivNext = this.DraggerDiv.nextSibling;
                if (this.DraggerDivNext) {
                    this.DraggerDivNext.parentNode.insertBefore(this.CopyDraggedDiv, this.DraggerDivNext);
                    this.CopyDraggedDiv.addEventListener('mousedown', function (e) {
                        console.log('mousedown');
                        _this.divMove(e);
                    }, false);
                }
                window.addEventListener('mouseup', function (e) {
                    console.log('mouseup');
                    _this.divMoveStop(e);
                }, false);
                if (event.target.id.indexOf('assignRule') !== -1) {
                    this.offY = event.clientY - parseInt(event.target.offsetTop);
                    this.offX = event.clientX - parseInt(event.target.offsetLeft);
                    var self_1 = this;
                    // window.addEventListener('mousemove', this.divMoving, true)
                    window.addEventListener('mousemove', function func(e) {
                        self_1.divMoving(e);
                        self_1.eventListener.push(func);
                    }, true);
                    // element.addEventListener("click", function _listener() {
                    // 	// do something
                    // 	element.removeEventListener("click", _listener, true);
                    //   }, true);
                }
            }
        }
        else
            return false;
    };
    RuleSetsComponent.prototype.divMoving = function (e) {
        console.log('mousemove');
        var targetOffsetx = RuleSetsComponent_1.getOffset(this.AddRuleArea.nativeElement).left;
        var targetOffsety = RuleSetsComponent_1.getOffset(this.AddRuleArea.nativeElement).top;
        var targetwidth = targetOffsetx + parseInt(this.AddRuleArea.nativeElement.style.width);
        var targetheight = targetOffsety + parseInt(this.AddRuleArea.nativeElement.style.height);
        if (this.DraggerDiv) {
            this.DraggerDiv.style.position = 'absolute';
            this.DraggerDiv.style.top = (e.clientY - this.offY) + 'px';
            this.DraggerDiv.style.left = (e.clientX - this.offX) + 'px';
            if ((e.clientX >= targetOffsetx && e.clientX <= targetwidth) && (e.clientY >= targetOffsety && e.clientY <= targetheight)) {
                this.AddRuleArea.nativeElement.style.background = '#ccc';
            }
            else {
                this.AddRuleArea.nativeElement.style.background = '#0000000d';
            }
        }
    };
    RuleSetsComponent.prototype.divMoveStop = function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.eventListener.map(function (e) {
            window.removeEventListener('mousemove', e, true);
            return;
        });
        // window.addEventListener('mousemove', this.divMoving, true)
        if (this.DraggerDiv) {
            this.DraggerDiv.style.position = 'absolute';
            this.DraggerDiv.style.top = (event.clientY - this.offY) + 'px';
            this.DraggerDiv.style.left = (event.clientX - this.offX) + 'px';
            this.DraggerDiv.style.display = 'none';
            // this.CopyDraggedDiv.style.zIndex = '9999';
            // this.CopyDraggedDiv.style.display = 'none';
            this.AddRuleInRuleSet(this.DraggerDiv.id.split('assignRule')[1], event).subscribe(function (data) {
                // this.DraggerDiv.remove();
                // if (this.DraggerDivNext) this.DraggerDivNext.nextSibling.parentNode.insertBefore(this.CopyDraggedDiv, this.DraggerDivNext.nextSibling);
                // this.DraggerDiv = undefined
                // this.CopyDraggedDiv = undefined
                // window.removeEventListener('mouseup', function (e: MouseEvent) {
                //   //console.log('Mouse up removed');
                // }, false);
            }, function (err) {
                // this.snackBar.openFromComponent(ToastNotifications, {
                // 	data: { img: 'warning', msg: err.error },
                // 	duration: 3000,
                // 	panelClass: ['user-alert', 'error']
                // });
            });
            this.DraggerDiv.remove();
            // if (this.DraggerDivNext) {
            //   this.DraggerDivNext.nextSibling.parentNode.insertBefore(this.CopyDraggedDiv, this.DraggerDivNext);
            //   this.CopyDraggedDiv.addEventListener('mousedown', function (e: MouseEvent) {
            //     this.divMove(e);
            //   }, false)
            // }
            this.AddRuleArea.nativeElement.style.background = '#0000000d';
            this.DraggerDiv = undefined;
            this.CopyDraggedDiv = undefined;
        }
    };
    RuleSetsComponent.prototype.AddRuleInRuleSet = function (ruleName, event) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (event) {
                var targetOffsetx = RuleSetsComponent_1.getOffset(_this.AddRuleArea.nativeElement).left;
                var targetOffsety = RuleSetsComponent_1.getOffset(_this.AddRuleArea.nativeElement).top;
                var targetwidth = targetOffsetx + parseInt(_this.AddRuleArea.nativeElement.style.width);
                var targetheight = targetOffsety + parseInt(_this.AddRuleArea.nativeElement.style.height);
                if ((event.clientX >= targetOffsetx && event.clientX <= (targetwidth)) && (event.clientY >= targetOffsety && event.clientY <= (targetheight))) {
                    _this.AddRule(ruleName);
                    observer.next(true);
                    observer.complete();
                }
                else {
                    //observer.error({ error: 'Rule Already Present' })
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: { img: 'warning', msg: 'Please Drag the Element to Drop Area' },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                }
            }
        });
    };
    RuleSetsComponent.prototype.AddRule = function (ruleName) {
        var _this = this;
        this.CheckIfRulePresent(ruleName).subscribe(function (data) {
            if (data) {
                _this.RuleSet['rules'].push(ruleName);
            }
            else {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: { img: 'warning', msg: 'Rule Already Present' },
                    duration: 3000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    };
    RuleSetsComponent.prototype.CheckIfRulePresent = function (ruleName) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.RuleSet['rules'].map(function (rule) {
                if (rule == ruleName) {
                    observer.next(false);
                    observer.complete();
                }
            });
            observer.next(true);
        });
    };
    RuleSetsComponent.prototype.DeleteRuleInRuleSet = function (ruleName) {
        //let arr = this.RuleSet.rules;
        this.RuleSet.rules = this.RuleSet.rules.filter(function (rule) { return rule != ruleName; });
        ////console.log(res);
    };
    RuleSetsComponent.prototype.SetAssignmentCriteria = function (value) {
        if (value == 'allMatch') {
            this.RuleSet.firstmatch = false;
            this.RuleSet.allMatch = true;
        }
        else {
            this.RuleSet.firstmatch = true;
            this.RuleSet.allMatch = false;
        }
    };
    RuleSetsComponent.prototype.toggleRulesetForm = function () {
        this.showRulesetForm = !this.showRulesetForm;
    };
    RuleSetsComponent.getOffset = function (el) {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    };
    RuleSetsComponent.prototype.AddAssignmentRuleSet = function () {
        var _this = this;
        if (this.assignmentRuleSetForm.valid) {
            this._authService.setRequestState(true);
            var ruleSet = {
                ruleSetName: this.assignmentRuleSetForm.get('').value,
                rules: (this.assignmentRuleSetForm.get('ruleKeyType').value) ? this.assignmentRuleSetForm.get('ruleKeyType').value : 'any',
                criteria: this.assignmentRuleSetForm.get('ruleKeyName').value,
                enabled: this.assignmentRuleSetForm.get('ruleKeyValue').value,
            };
            this._assignmentRuleService.AddNewRuleSet(ruleSet).subscribe(function (data) {
                if (data) {
                    _this._authService.setRequestState(false);
                    //this._authService.updateAutomatedMessages(this.assignmentRuleForm.get('hashTag').value, this.assignmentRuleForm.get('ruleName').value);
                    //this.assignmentRuleForm.reset();
                    //this.RulesList = this.RulesList.concat(rule);
                    //this.UpdateRulesMap(this.RulesList);
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: { img: 'ok', msg: 'Assignment Rule Added Successfully' },
                        duration: 3000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            }, function (err) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: { img: 'warning', msg: 'Cannot Add Assignment Rule' },
                    duration: 3000,
                    panelClass: ['user-alert', 'error']
                });
            });
        }
    };
    RuleSetsComponent.prototype.ngOnDestroy = function () {
        // this._assignmentRuleService.Destroy();
        this.subscriptions.forEach(function (res) {
            res.unsubscribe();
        });
    };
    var RuleSetsComponent_1;
    __decorate([
        core_1.ViewChild('ADDRULES')
    ], RuleSetsComponent.prototype, "AddRuleArea", void 0);
    RuleSetsComponent = RuleSetsComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-rule-sets',
            templateUrl: './rule-sets.component.html',
            styleUrls: ['./rule-sets.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], RuleSetsComponent);
    return RuleSetsComponent;
}());
exports.RuleSetsComponent = RuleSetsComponent;
//# sourceMappingURL=rule-sets.component.js.map