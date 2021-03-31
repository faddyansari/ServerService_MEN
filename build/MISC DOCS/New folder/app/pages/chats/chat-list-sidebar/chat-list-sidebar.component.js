"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatListSidebarComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var ChatListSidebarComponent = /** @class */ (function () {
    function ChatListSidebarComponent(_chatService, _authService, formbuilder, _router) {
        var _this = this;
        this._chatService = _chatService;
        this._authService = _authService;
        this._router = _router;
        this.subscriptions = [];
        this.chatList = [];
        this.archiveList = [];
        this.archivesSynced = false;
        this.onSearchInput = new Subject_1.Subject();
        this.activeTab = 'INBOX';
        this.loading = false;
        this.loadingCurrentConversations = true;
        this.numbersArray = Array(15).fill(0).map(function (x, i) { return i; });
        this.verified = true;
        this.forceSelected = '';
        this.filterDrawer = false;
        this.filters = {};
        //console.log('Chat Side Bar Initialized');
        //  this._chatService.GetConverSations();
        this.subscriptions.push(this._router.params.subscribe(function (params) {
            if (params.id) {
                _this.forceSelected = params.id;
            }
        }));
        this.searchForm = formbuilder.group({
            'searchValue': ['', []
            ]
        });
        this.searchForm.get('searchValue').value;
        this.subscriptions.push(_chatService.GetAllConversations().subscribe(function (data) {
            // console.log("AllConversations",data);
            _this.chatList = data;
            //console.log(this.forceSelected);
            if (_this.forceSelected) {
                _this._chatService.setCurrentConversation(_this.forceSelected);
            }
        }));
        this.subscriptions.push(_chatService.getArchives().subscribe(function (archives) {
            _this.archiveList = archives;
            // this._chatService.setActiveTab('INBOX')
            // console.log("archive length",this.archiveList.length);
        }));
        this.subscriptions.push(_chatService.Filters.subscribe(function (filters) {
            _this.filters = filters;
            //  console.log(filters);
            // this._chatService.setActiveTab('INBOX')
            // console.log("archive length",this.archiveList.length);
        }));
        this.subscriptions.push(_chatService.getArchivesSynced().subscribe(function (synced) {
            _this.archivesSynced = synced;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(_chatService.getActiveTab().subscribe(function (value) {
            if (_this.activeTab != value)
                _this._chatService.currentConversation.next({});
            _this.activeTab = value;
            if (!_this.archivesSynced && _this.activeTab == 'ARCHIVE') {
                _chatService.getArchivesFromBackend();
            }
        }));
        this.subscriptions.push(_chatService.getLoading('ARCHIVES').subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(_chatService.getLoading('CURRENTCONVERSATIONS').subscribe(function (data) {
            _this.loadingCurrentConversations = data;
        }));
    }
    ChatListSidebarComponent.prototype.ngOnInit = function () {
    };
    ChatListSidebarComponent.prototype.FetchFilterd = function () {
        // this._chatService.Filters.next(this.ApplyFilter());
    };
    // ApplyFilter() {
    // 	let filters = {
    // 		tag: [],
    // 		agent: [],
    // 		daterange: {},
    // 	}
    // 	let matchObject: any = {};
    // 	Object.keys(filters).map(key => {
    // 		//console.log(key + ' ' + JSON.stringify(filters[key]));
    // 		if (filters[key]) {
    // 			if (Array.isArray(filters[key]) && filters[key].length) {
    // 				Object.assign(matchObject, { [key]: filters[key] });
    // 			} else if (!Array.isArray(filters[key]) && Object.keys(filters[key]).length) {
    // 				Object.assign(matchObject, { [key]: filters[key] });
    // 			}
    // 		}
    // 	});
    // 	//console.log(JSON.parse(JSON.stringify(matchObject)));
    // 	return { filter: matchObject}
    // }
    ChatListSidebarComponent.prototype.fetchCalled = function (data) {
        console.log(data);
        var matchObject = {};
        Object.keys(data.filters).map(function (key) {
            var _a, _b;
            //console.log(key + ' ' + JSON.stringify(filters[key]));
            if (data.filters[key]) {
                if (Array.isArray(data.filters[key]) && data.filters[key].length) {
                    Object.assign(matchObject, (_a = {}, _a[key] = data.filters[key], _a));
                }
                else if (!Array.isArray(data.filters[key]) && Object.keys(data.filters[key]).length) {
                    Object.assign(matchObject, (_b = {}, _b[key] = data.filters[key], _b));
                }
            }
        });
        // console.log(matchObject);
        this._chatService.Filters.next({ filter: matchObject, userType: data.userType, sortBy: data.sortBy });
    };
    ChatListSidebarComponent.prototype.toggleFilterDrawer = function () {
        var _this = this;
        setTimeout(function () {
            _this.filterDrawer = !_this.filterDrawer;
            if (_this.filterDrawer) {
                //console.log(this.filters);
            }
        }, 0);
    };
    ChatListSidebarComponent.prototype.ngOnDestroy = function () {
        //  console.log('Destroyed');
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatListSidebarComponent.prototype.CloseFilter = function () {
        this.filterDrawer = false;
    };
    ChatListSidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-chat-list-sidebar',
            templateUrl: './chat-list-sidebar.component.html',
            styleUrls: ['./chat-list-sidebar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ChatListSidebarComponent);
    return ChatListSidebarComponent;
}());
exports.ChatListSidebarComponent = ChatListSidebarComponent;
//# sourceMappingURL=chat-list-sidebar.component.js.map