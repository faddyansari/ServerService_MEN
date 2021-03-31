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
exports.NewConversationDialogComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var Observable_1 = require("rxjs/Observable");
var dialog_1 = require("@angular/material/dialog");
var NewConversationDialogComponent = /** @class */ (function () {
    function NewConversationDialogComponent(data, _utilityService, formbuilder) {
        var _this = this;
        this.data = data;
        this._utilityService = _utilityService;
        this.agentList = [];
        this.agentList_original = [];
        this.subscriptions = [];
        this.scrollHeight = 0;
        this.ended = false;
        this.loadingMoreAgents = false;
        this.searchInput = new Subject_1.Subject();
        this.selectionCount = 0;
        this.groupEnabled = false;
        this.groupName = '';
        this.type = 'single';
        this.groupSubmitted = false;
        this.rand = ['#9BB4DD', '#6B9ED4', '#F58758', '#FACE63', '#55C4CC', '#F7C138', '#8580BC', '#7BB446', '#E24050', '#EC59AA', '#F2AEBB', '#01DD9F', '#7AEDDE', '#01D2E9', '#06A1E4', '#A7A9E2', '#A190D7', '#FF99CB', '#FF2D36', '#F19645', '#99CDFF', '#FB896E', '#33BFBE', '#1982C4', '#838DB0', '#50BF94', '#963FC1'];
        this.currentAgent = data.email;
        this.type = data.type;
        this.subscriptions.push(_utilityService.getAllAgentsListObs().subscribe(function (agents) {
            _this.agentList = agents;
            _this.agentList_original = agents;
        }));
        this.searchForm = formbuilder.group({
            'searchValue': ['', []
            ]
        });
        this.searchInput
            .map(function (event) { return event; })
            .debounceTime(500)
            .switchMap(function () {
            return new Observable_1.Observable(function (observer) {
                console.log('search');
                if (_this.searchForm.get('searchValue').value) {
                    var agents_1 = _this.agentList_original.filter(function (a) { return a.email.includes(_this.searchForm.get('searchValue').value.toLowerCase()); });
                    _this._utilityService.SearchAgent(_this.searchForm.get('searchValue').value).subscribe(function (response) {
                        //console.log(response);
                        if (response && response.agentList.length) {
                            response.agentList.forEach(function (element) {
                                if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                                    agents_1.push(element);
                                }
                            });
                        }
                        _this.agentList = agents_1;
                    });
                    // this.agentList = agents;
                }
                else {
                    _this.agentList = _this.agentList_original;
                    // this.setScrollEvent();
                }
            });
        }).subscribe();
    }
    NewConversationDialogComponent.prototype.ngOnInit = function () {
    };
    NewConversationDialogComponent.prototype.ngAfterViewInit = function () {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        if (this.scrollContainer) {
            this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
        }
    };
    // markSelected(email){
    // 	this.agentList.map(a => {
    // 		if(a.email == email){
    // 			a.selected = true;
    // 		}
    // 		return a;
    // 	});
    // }
    NewConversationDialogComponent.prototype.toggleSelected = function (agent) {
        if (!this.agentList.filter(function (a) { return a.email == agent.email; }).length) {
            this.agentList.unshift(agent);
        }
        switch (this.type) {
            case 'single':
                this.agentList.map(function (a) {
                    if (a.email == agent.email) {
                        a.selected = true;
                    }
                    else {
                        a.selected = false;
                    }
                    return a;
                });
                break;
            case 'group':
                this.agentList.map(function (a) {
                    if (a.email == agent.email) {
                        if (a.selected) {
                            a.selected = false;
                        }
                        else {
                            a.selected = true;
                        }
                    }
                    return a;
                });
                break;
            default:
                break;
        }
        // this.selectionCount = this.agentList.filter(a => a.selected).length;
        // if (this.selectionCount > 1) {
        // 	this.groupEnabled = true;
        // } else {
        // 	this.groupEnabled = false;
        // }
    };
    NewConversationDialogComponent.prototype.showList = function () {
        switch (this.type) {
            case 'single':
                return true;
            case 'group':
                return this.groupSubmitted;
        }
    };
    NewConversationDialogComponent.prototype.startChat = function () {
        var _this = this;
        var selectedAgents = [];
        this.agentList.filter(function (a) { return a.selected; }).forEach(function (agent) {
            var randomColor = _this.rand[Math.floor(Math.random() * _this.rand.length)];
            selectedAgents.push({
                email: agent.email,
                viewColor: randomColor,
                isAdmin: false
            });
        });
        selectedAgents.push({
            email: this.currentAgent,
            viewColor: this.rand[Math.floor(Math.random() * this.rand.length)],
            isAdmin: true
        });
        return {
            selectedAgents: selectedAgents,
            type: this.type,
            groupName: this.groupName
        };
    };
    NewConversationDialogComponent.prototype.ScrollChanged = function (event) {
        var _this = this;
        if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
            console.log('Fetch more agents');
            if (!this.ended && !this.loadingMoreAgents) {
                console.log('Fetch More');
                this.loadingMoreAgents = true;
                this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(function (response) {
                    console.log(response);
                    _this.agentList = _this.agentList.concat(response.agents);
                    _this.ended = response.ended;
                    _this.loadingMoreAgents = false;
                });
            }
            //   this._chatService.getMoreArchivesFromBackend();
        }
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    NewConversationDialogComponent.prototype.next = function () {
        this.groupSubmitted = true;
    };
    NewConversationDialogComponent.prototype.previous = function () {
        this.groupSubmitted = false;
    };
    NewConversationDialogComponent.prototype.showSubmit = function () {
        if (this.type == 'group') {
            return this.groupSubmitted;
        }
        else {
            return true;
        }
    };
    NewConversationDialogComponent.prototype.checkDisabled = function () {
        var selectedAgents = this.agentList.filter(function (a) { return a.selected; });
        if (selectedAgents.length) {
            if (this.type == 'group') {
                if (!(selectedAgents.length > 0) || !this.groupName) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (selectedAgents.length) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    };
    NewConversationDialogComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._utilityService.Destroy();
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], NewConversationDialogComponent.prototype, "scrollContainer", void 0);
    NewConversationDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-new-conversation-dialog',
            templateUrl: './new-conversation-dialog.component.html',
            styleUrls: ['./new-conversation-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], NewConversationDialogComponent);
    return NewConversationDialogComponent;
}());
exports.NewConversationDialogComponent = NewConversationDialogComponent;
//# sourceMappingURL=new-conversation-dialog.component.js.map