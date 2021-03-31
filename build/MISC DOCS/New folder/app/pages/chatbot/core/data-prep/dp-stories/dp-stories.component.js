"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DpStoriesComponent = void 0;
var core_1 = require("@angular/core");
var add_story_dialog_component_1 = require("../../../../../dialogs/add-story-dialog/add-story-dialog.component");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var DpStoriesComponent = /** @class */ (function () {
    function DpStoriesComponent(snackBar, dialog, formbuilder, BotService) {
        var _this = this;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.BotService = BotService;
        this.intent_list = [];
        this.story_list = [];
        this.action_list = [];
        this.resp_func_list = [];
        this.subscriptions = [];
        this.showintents = false;
        this.showStoryForm = false;
        this.intent_id = '';
        this.resp_func = '';
        this.action = '';
        this.StoryForm = formbuilder.group({
            'story_name': [null, forms_1.Validators.required]
        });
        this.subscriptions.push(BotService.getActions().subscribe(function (data) {
            _this.action_list = data;
        }));
        this.subscriptions.push(BotService.getIntent().subscribe(function (data) {
            _this.intent_list = data;
        }));
        this.subscriptions.push(BotService.getRespFunc().subscribe(function (data) {
            _this.resp_func_list = data;
            // console.log(this.resp_func_list);
        }));
        this.subscriptions.push(BotService.getStories().subscribe(function (data) {
            _this.story_list = data;
        }));
    }
    DpStoriesComponent.prototype.ngOnInit = function () {
    };
    DpStoriesComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    DpStoriesComponent.prototype.AddStory = function () {
        var _this = this;
        this.dialog.open(add_story_dialog_component_1.AddStoryDialogComponent, {
            disableClose: true
        }).afterClosed().subscribe(function (response) {
            if (response.data) {
                _this.BotService.AddStory(response.data);
            }
        });
    };
    // toggleStoryForm() {
    // 	this.showStoryForm = !this.showStoryForm;
    // }
    DpStoriesComponent.prototype.showIntents = function (stories) {
        this.resp_func = '';
        this.intent_id = '';
        // this.story_list.map(p=>{
        //   if(p._id==stories._id){
        //     p.showintents= true;
        //   }else{
        //     p.showintents=false;
        //   }
        // });
    };
    DpStoriesComponent.prototype.selectIntent = function (event) {
        if (event.target.value) {
            this.intent_id = event.target.value;
        }
    };
    DpStoriesComponent.prototype.AddIntentToStory = function (story) {
        var _this = this;
        //console.log(story._id);
        this.BotService.AddIntentToStory(this.intent_id, story._id).subscribe(function (response) {
            // this.intent_id = '';
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Intent added to story successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    DpStoriesComponent.prototype.selectRespFunc = function (event) {
        if (event.target.value) {
            this.resp_func = event.target.value;
        }
    };
    DpStoriesComponent.prototype.selectAction = function (event) {
        if (event.target.value) {
            this.action = event.target.value;
        }
    };
    DpStoriesComponent.prototype.addRespFunc = function (story_id, intent_id) {
        var _this = this;
        this.BotService.AddRespFuncToIntent(intent_id, story_id, this.resp_func).subscribe(function (response) {
            // this.resp_func = '';
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Response function added under intent successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    DpStoriesComponent.prototype.addAction = function (story_id, intent_id) {
        var _this = this;
        this.BotService.AddActionToIntent(intent_id, story_id, this.action).subscribe(function (response) {
            // this.resp_func = '';
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Action added under intent successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    //Helpers
    DpStoriesComponent.prototype.getIntentName = function (intent_id) {
        if (intent_id && this.intent_list.filter(function (i) { return i._id == intent_id; }).length) {
            return this.intent_list.filter(function (i) { return i._id == intent_id; })[0].name;
        }
        else {
            return intent_id;
        }
    };
    DpStoriesComponent.prototype.getResponseName = function (resp_id) {
        if (resp_id && this.resp_func_list.filter(function (i) { return i._id == resp_id; }).length) {
            return this.resp_func_list.filter(function (i) { return i._id == resp_id; })[0].func_name;
        }
        else {
            return resp_id;
        }
    };
    DpStoriesComponent.prototype.getActionName = function (act_id) {
        if (act_id && this.action_list.filter(function (i) { return i._id == act_id; }).length) {
            return this.action_list.filter(function (i) { return i._id == act_id; })[0].action_name;
        }
        else {
            return act_id;
        }
    };
    DpStoriesComponent.prototype.showAddIntent = function (storyID) {
        this.story_list.forEach(function (s) {
            if (s._id == storyID) {
                if (s.intents.length) {
                    if (s.intents[s.intents.length - 1].respFuncs.length || s.intents[s.intents.length - 1].actions.length) {
                        // console.log('Resp func length: ' + s.intents[s.intents.length - 1].respFuncs.length);
                        return 'show';
                    }
                    else {
                        return 'hide';
                    }
                }
                else {
                    return 'hide';
                }
            }
        });
    };
    DpStoriesComponent.prototype.deleteStory = function (story, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete story " + story.story_name + " ?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this.BotService.deleteStory(story._id, index);
            }
        });
    };
    DpStoriesComponent = __decorate([
        core_1.Component({
            selector: 'app-dp-stories',
            templateUrl: './dp-stories.component.html',
            styleUrls: ['./dp-stories.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], DpStoriesComponent);
    return DpStoriesComponent;
}());
exports.DpStoriesComponent = DpStoriesComponent;
//# sourceMappingURL=dp-stories.component.js.map