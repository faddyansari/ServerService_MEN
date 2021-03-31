"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var ChatBotService = /** @class */ (function () {
    function ChatBotService(snackBar, http, _socketService, _authService, dialog) {
        //console.log('Chat bot service initialized');
        var _this = this;
        this.snackBar = snackBar;
        this.http = http;
        this._socketService = _socketService;
        this._authService = _authService;
        this.dialog = dialog;
        this.entities_list = new BehaviorSubject_1.BehaviorSubject([]);
        this.intent_list = new BehaviorSubject_1.BehaviorSubject([]);
        this.t_phrase_list = new BehaviorSubject_1.BehaviorSubject([]);
        this.synonym_list = new BehaviorSubject_1.BehaviorSubject([]);
        this.resp_func_list = new BehaviorSubject_1.BehaviorSubject([]);
        this.response_list = new BehaviorSubject_1.BehaviorSubject([]);
        this.story_list = new BehaviorSubject_1.BehaviorSubject([]);
        this.action_list = new BehaviorSubject_1.BehaviorSubject([]);
        this.regex_list = new BehaviorSubject_1.BehaviorSubject([]);
        this.subscriptions = [];
        this.viewContentInfo = new BehaviorSubject_1.BehaviorSubject(false);
        this.Agent = undefined;
        this.botAddress = '';
        this.rasa_JSON = new BehaviorSubject_1.BehaviorSubject({
            "rasa_nlu_data": {
                "common_examples": [],
                "entity_synonyms": [],
                "regex_features": []
            }
        });
        this.subscriptions.push(_socketService.getSocket().subscribe(function (socket) {
            if (socket) {
                _this._authService.getAgent().subscribe(function (agent) { _this.Agent = agent; });
                _this.socket = socket;
                _this.getIntentList();
                _this.getTPhraseList();
                _this.getEntityList();
                _this.getSynonymList();
                _this.getRespFuncList();
                _this.getStoryList();
                _this.getActionsList();
                _this.getRegexList();
            }
        }));
        this.subscriptions.push(_authService.botServiceURL.subscribe(function (address) {
            _this.botAddress = address;
        }));
    }
    //	public selectedStory : BehaviorSubject<any> = new BehaviorSubject(undefined);
    ChatBotService.prototype.getIntentList = function () {
        var _this = this;
        this.socket.emit('getIntents', {}, function (response) {
            if (response.status == 'ok') {
                _this.intent_list.next(response.intentList);
            }
        });
    };
    ChatBotService.prototype.addIntent = function (name) {
        var _this = this;
        // console.log('Emitting Intent');
        // console.log(this.socket);
        this.socket.emit('addIntent', { intent_name: name }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Intent added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.intent_list.getValue().push(response.intent);
                _this.intent_list.next(_this.intent_list.getValue());
            }
            else if (response.status == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Intent already exists!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
        // this.intent_list.getValue().push(intent);
        // this.intent_list.next(this.intent_list.getValue());
    };
    // updateIntentList(intent_list) {
    // 	this.intent_list.next(intent_list);
    // }
    ChatBotService.prototype.toggleInfo = function () {
        this.viewContentInfo.next(!this.viewContentInfo.getValue());
    };
    ChatBotService.prototype.setShowInfo = function (value) {
        this.viewContentInfo.next(value);
    };
    ChatBotService.prototype.updateIntent = function (id, intent_name) {
        var _this = this;
        this.socket.emit('updateIntent', { _id: id, name: intent_name }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Intent updated successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.intent_list.getValue().map(function (i) {
                    if (i._id == response.intent._id) {
                        i.name = response.intent.name;
                    }
                    return;
                });
                _this.intent_list.next(_this.intent_list.getValue());
            }
            else {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Intent already exists!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    };
    ChatBotService.prototype.deleteIntent = function (id, index) {
        var _this = this;
        this.socket.emit('deleteIntent', { _id: id }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Intent deleted successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.intent_list.getValue().splice(index, 1);
                _this.intent_list.next(_this.intent_list.getValue());
            }
        });
    };
    ChatBotService.prototype.getIntent = function () {
        return this.intent_list.asObservable();
    };
    ChatBotService.prototype.addEntity = function (entity, slot_type, color) {
        var _this = this;
        this.socket.emit('addEntity', { name: entity, slot: slot_type, color: color }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Entity added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.entities_list.getValue().push(response.entity);
                _this.entities_list.next(_this.entities_list.getValue());
            }
        });
    };
    ChatBotService.prototype.selSlotType = function (entity, slotValue) {
        var _this = this;
        this.socket.emit('selSlotType', { entity: entity, slotValue: slotValue }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Slot set successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.entities_list.getValue().map(function (p) {
                    if (p._id == response.slotType._id) {
                        p.slot_type = slotValue;
                    }
                });
                _this.entities_list.next(_this.entities_list.getValue());
            }
        });
    };
    ChatBotService.prototype.getEntityList = function () {
        var _this = this;
        this.socket.emit('getEntity', {}, function (response) {
            if (response.status == 'ok') {
                _this.entities_list.next(response.entityList);
            }
        });
    };
    ChatBotService.prototype.updateEntity = function (entity, updatedEnt) {
        var _this = this;
        this.socket.emit('updateEnt', { entity: entity, updatedEnt: updatedEnt }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Entity updated successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.entities_list.getValue().map(function (p) {
                    if (p._id == entity._id) {
                        p.entity_name = updatedEnt;
                    }
                    return;
                });
                _this.entities_list.next(_this.entities_list.getValue());
            }
        });
    };
    ChatBotService.prototype.deleteEntity = function (id) {
        var _this = this;
        this.socket.emit('deleteEntity', { _id: id }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Entity deleted successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.entities_list.next(_this.entities_list.getValue());
                //this.t_phrase_list.next(this.t_phrase_list.getValue());
            }
        });
    };
    ChatBotService.prototype.getEntity = function () {
        return this.entities_list.asObservable();
    };
    ChatBotService.prototype.addTPhrase = function (t_phrase, id) {
        var _this = this;
        this.socket.emit('addTPhrase', { tPhrase: t_phrase, intent_id: id }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Training phrase added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.t_phrase_list.getValue().push(response.tPhrase);
                _this.t_phrase_list.next(_this.t_phrase_list.getValue());
            }
        });
    };
    ChatBotService.prototype.getTPhraseList = function () {
        var _this = this;
        this.socket.emit('getTPhrase', {}, function (response) {
            if (response.status == 'ok') {
                _this.t_phrase_list.next(response.tPhraseList);
            }
        });
    };
    ChatBotService.prototype.getTPhrase = function () {
        return this.t_phrase_list.asObservable();
    };
    ChatBotService.prototype.deleteTPhrase = function (id, intent_id, index) {
        var _this = this;
        this.socket.emit('deleteTPhrase', { _id: id, intent_id: intent_id }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Training Phrase deleted successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.t_phrase_list.getValue().splice(index, 1);
                _this.t_phrase_list.next(_this.t_phrase_list.getValue());
            }
        });
    };
    ChatBotService.prototype.markPhrase = function (_id, start, end, text) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('markPhrase', { _id: _id, start: start, end: end, text: text }, function (response) {
                if (response.status == 'ok') {
                    _this.t_phrase_list.getValue().map(function (p) {
                        if (p._id == response.tpEntity._id) {
                            p.entities = response.tpEntity.entities;
                        }
                        return;
                    });
                    _this.t_phrase_list.next(_this.t_phrase_list.getValue());
                    observer.next(response.status);
                    observer.complete();
                }
                else {
                    observer.next(response.status);
                    observer.complete();
                }
            });
        });
    };
    ChatBotService.prototype.selEntity = function (tPhrase, entity_id, entVal) {
        var _this = this;
        this.socket.emit('selectEntity', { tPhrase: tPhrase, entArray: entity_id, entVal: entVal }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Entity assigned successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.t_phrase_list.getValue().map(function (p) {
                    if (p._id == response.tPhrase._id) {
                        p.entities.map(function (e) {
                            if (e.id == entity_id) {
                                // console.log('Matched!');
                                e.entity = entVal;
                                return;
                            }
                            return;
                        });
                    }
                });
                //this.t_phrase_list.getValue().push(response.tPhrase)
                _this.t_phrase_list.next(_this.t_phrase_list.getValue());
            }
        });
    };
    ChatBotService.prototype.delMarkEnt = function (tPhraseId, entId, index) {
        var _this = this;
        this.socket.emit('delMarkEnt', { _id: tPhraseId, entId: entId }, function (response) {
            if (response.status == 'ok') {
                // console.log(this.t_phrase_list.getValue());
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Selected word deleted successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.t_phrase_list.getValue().map(function (p) {
                    p.entities.splice(index, 1);
                });
                _this.t_phrase_list.next(JSON.parse(JSON.stringify(_this.t_phrase_list.getValue())));
            }
        });
    };
    ChatBotService.prototype.getSynonymList = function () {
        var _this = this;
        this.socket.emit('getSynonym', {}, function (response) {
            if (response.status == 'ok') {
                _this.synonym_list.next(response.synList);
            }
        });
    };
    ChatBotService.prototype.addSynonymValues = function (synValue) {
        var _this = this;
        this.socket.emit('addSynVal', { synValue: synValue }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Selected word added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.synonym_list.getValue().push(response.synVal);
                _this.synonym_list.next(_this.synonym_list.getValue());
            }
        });
    };
    ChatBotService.prototype.addSynonym = function (value, syn_list) {
        var _this = this;
        this.socket.emit('addSyn', { value: value, syn_list: syn_list }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Synonym added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    ChatBotService.prototype.getSynonym = function () {
        return this.synonym_list.asObservable();
    };
    ChatBotService.prototype.removeSynonym = function (index, syn_list) {
        var _this = this;
        this.socket.emit('delSyn', { value: index, syn_list: syn_list }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Synonym removed successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    ChatBotService.prototype.deleteSynonymValues = function (syn_list) {
        var _this = this;
        this.socket.emit('delSynVal', { syn_list: syn_list }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Selected value deleted successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    // public ExecuteNlu(rasaJSON: any): Observable<any> {
    // 	return this.http.post('http://localhost:5000/executeNlu', rasaJSON)
    // 		.map((response) => {
    // 			return response
    // 		}).catch(err => {
    // 			return Observable.throw(err);
    // 		})
    // }
    // this.http.get('http://localhost:8005/execute').subscribe((response) => {
    // 	observer.next(response);
    //     observer.complete();
    // }, err => {
    //     observer.error(err);
    // });
    // })
    ChatBotService.prototype.userInput = function (inputText) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post('http://localhost:5000/input', inputText).subscribe(function (response) {
                observer.next(response);
                observer.complete();
            }, function (err) {
                observer.error(err);
            });
        });
    };
    //core works
    ChatBotService.prototype.addResponse = function (resp, id) {
        //console.log(resp + ' - ' + id);
        var _this = this;
        this.socket.emit('addResponse', { resp: resp, resp_func_id: id }, function (response) {
            //console.log(response);
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Response added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                //console.log(response.resp["response"]);
                _this.response_list.getValue().push({
                    text: resp
                });
                _this.response_list.next(_this.response_list.getValue());
                _this.resp_func_list.getValue().map(function (r) {
                    if (r._id == id) {
                        r.response.push({
                            text: resp
                        });
                    }
                });
                _this.resp_func_list.next(_this.resp_func_list.getValue());
            }
        });
    };
    ChatBotService.prototype.getResponses = function (id) {
        var _this = this;
        //console.log(id);
        this.socket.emit('getResponse', { id: id }, function (response) {
            console.log(response);
            if (response.status == 'ok') {
                _this.response_list.next(response.RespList);
            }
            else {
                _this.response_list.next([]);
                console.log(response);
            }
        });
    };
    ChatBotService.prototype.getResponse = function () {
        return this.response_list.asObservable();
    };
    ChatBotService.prototype.updateResponse = function (responses, updatedResp, intent_id) {
        var _this = this;
        this.socket.emit('updateResp', { response: responses, updatedResp: updatedResp, intent_id: intent_id }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Response updated successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.response_list.getValue().map(function (p) {
                    if (p.id == responses.id) {
                        responses.text = updatedResp;
                    }
                });
                _this.response_list.next(_this.response_list.getValue());
            }
        });
    };
    ChatBotService.prototype.deleteResponse = function (resp_id, intent_id, index) {
        var _this = this;
        this.socket.emit('delResp', { resp_id: resp_id, intent_id: intent_id }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Response deleted successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.response_list.getValue().splice(index, 1);
                _this.response_list.next(_this.response_list.getValue());
                //this.t_phrase_list.next(this.t_phrase_list.getValue());
            }
        });
    };
    ChatBotService.prototype.getRespFuncList = function () {
        var _this = this;
        this.socket.emit('getRespFunc', {}, function (response) {
            if (response.status == 'ok') {
                _this.resp_func_list.next(response.respFuncList);
                //console.log(response.respFuncList);
            }
        });
    };
    ChatBotService.prototype.getRespFunc = function () {
        return this.resp_func_list.asObservable();
    };
    ChatBotService.prototype.addRespFunc = function (name) {
        var _this = this;
        this.socket.emit('addRespFunc', { resp_func_name: name }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Response function added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.resp_func_list.getValue().push(response.respFunc);
                _this.resp_func_list.next(_this.resp_func_list.getValue());
            }
        });
    };
    ChatBotService.prototype.updateRespFunc = function (resp_func_id, resp_func_name) {
        var _this = this;
        this.socket.emit('updateRespFunc', { _id: resp_func_id, func_name: resp_func_name }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Response function updated successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.resp_func_list.getValue().map(function (i) {
                    if (i._id == response.respFunc._id) {
                        i.func_name = response.respFunc.func_name;
                    }
                    return;
                });
                _this.resp_func_list.next(_this.resp_func_list.getValue());
            }
            else {
            }
        });
    };
    ChatBotService.prototype.deleteRespFunc = function (id, index) {
        var _this = this;
        this.socket.emit('deleteRespFunc', { _id: id }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Response function deleted successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.resp_func_list.getValue().splice(index, 1);
                _this.resp_func_list.next(_this.resp_func_list.getValue());
            }
        });
    };
    //#region Stories
    ChatBotService.prototype.AddStory = function (story_name) {
        var _this = this;
        this.socket.emit('addStory', { story_name: story_name }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Story added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.story_list.getValue().push(response.storyName);
                _this.story_list.next(_this.story_list.getValue());
            }
        });
    };
    ChatBotService.prototype.getStoryList = function () {
        var _this = this;
        this.socket.emit('getStories', {}, function (response) {
            if (response.status == 'ok') {
                _this.story_list.next(response.stories);
            }
        });
    };
    ChatBotService.prototype.getStories = function () {
        return this.story_list.asObservable();
    };
    ChatBotService.prototype.deleteStory = function (id, index) {
        var _this = this;
        this.socket.emit('deleteStory', { _id: id }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Story deleted successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.story_list.getValue().splice(index, 1);
                _this.story_list.next(_this.story_list.getValue());
                //this.t_phrase_list.next(this.t_phrase_list.getValue());
            }
        });
    };
    ChatBotService.prototype.AddIntentToStory = function (intent_id, story_id) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addIntentToStory', { intent_id: intent_id, story_id: story_id }, function (response) {
                if (response.status == 'ok') {
                    _this.story_list.next(_this.story_list.getValue().map(function (story) {
                        if (story._id == story_id) {
                            story.intents.push({
                                intent_id: intent_id,
                                respFuncs: [],
                                actions: []
                            });
                            //this.selectedStory.next(story);
                        }
                        return story;
                    }));
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    ChatBotService.prototype.AddRespFuncToIntent = function (intent_id, story_id, respFuncId) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addRespFuncToIntent', { intent_id: intent_id, story_id: story_id, respFuncId: respFuncId }, function (response) {
                if (response.status == 'ok') {
                    //	console.log(response);
                    _this.story_list.next(_this.story_list.getValue().map(function (story) {
                        if (story._id == story_id) {
                            story.intents = response.stories.intents;
                        }
                        return story;
                    }));
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    ChatBotService.prototype.AddActionToIntent = function (intent_id, story_id, actId) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addActionToIntent', { intent_id: intent_id, story_id: story_id, actId: actId }, function (response) {
                if (response.status == 'ok') {
                    _this.story_list.next(_this.story_list.getValue().map(function (story) {
                        if (story._id == story_id) {
                            story.intents = response.stories.intents;
                        }
                        return story;
                    }));
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    //Setters
    ChatBotService.prototype.setRasaJSON = function (value) {
        this.rasa_JSON.next(value);
    };
    ChatBotService.prototype.AddAction = function (action_name, endpoint_url, template) {
        var _this = this;
        this.socket.emit('addAction', { action_name: action_name, endpoint_url: endpoint_url, template: template }, function (response) {
            if (response.status == 'ok') {
                _this.action_list.getValue().push(response.action);
                _this.action_list.next(_this.action_list.getValue());
            }
        });
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.botAddress + '/action', { action_name: action_name, endpoint_url: endpoint_url, template: template, csid: _this.Agent.csid }).subscribe(function (response) {
                observer.next(response);
                observer.complete();
            }, function (err) {
                observer.error(err);
            });
        });
    };
    ChatBotService.prototype.deleteAction = function (id, index) {
        var _this = this;
        this.socket.emit('deleteAction', { _id: id }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Action deleted successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.action_list.getValue().splice(index, 1);
                _this.action_list.next(_this.action_list.getValue());
                //this.t_phrase_list.next(this.t_phrase_list.getValue());
            }
        });
    };
    ChatBotService.prototype.getActionsList = function () {
        var _this = this;
        this.socket.emit('getActions', {}, function (response) {
            if (response.status == 'ok') {
                _this.action_list.next(response.actions);
            }
        });
    };
    ChatBotService.prototype.getActions = function () {
        return this.action_list.asObservable();
    };
    ChatBotService.prototype.Execute = function (domain, stories, nluJson) {
        return this.http.post(this.botAddress + '/execute', { domain: domain, stories: stories, nluJson: nluJson, agentEmail: this.Agent.email, agentNsp: this.Agent.nsp })
            .map(function (response) {
            return response;
        }).catch(function (err) {
            return Observable_1.Observable.throw(err);
        });
    };
    ChatBotService.prototype.AddMessageAsTPhrase = function (tPhrase) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addTPhrase', { intent_id: tPhrase.intents, tPhrase: tPhrase.tPhrase }, function (response) {
                if (response.status == 'ok') {
                    _this.t_phrase_list.getValue().splice(0, 0, response.tPhrase);
                    _this.t_phrase_list.next(_this.t_phrase_list.getValue());
                }
                observer.next(response.status);
                observer.complete();
            });
        });
    };
    ChatBotService.prototype.addRegexValue = function (regValue) {
        var _this = this;
        this.socket.emit('addRegexVal', { regValue: regValue }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Value for regex added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                _this.regex_list.getValue().push(response.regVal);
                _this.regex_list.next(_this.regex_list.getValue());
            }
        });
    };
    ChatBotService.prototype.getRegexList = function () {
        var _this = this;
        this.socket.emit('getRegex', {}, function (response) {
            if (response.status == 'ok') {
                _this.regex_list.next(response.regList);
            }
        });
    };
    ChatBotService.prototype.getRegex = function () {
        return this.regex_list.asObservable();
    };
    ChatBotService.prototype.addRegex = function (value, reg_list) {
        var _this = this;
        this.socket.emit('addReg', { value: value, reg_list: reg_list }, function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Regex added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    ChatBotService.prototype.removeRegex = function (index, reg_list) {
        var _this = this;
        this.socket.emit('delReg', { value: index, reg_list: reg_list }, function (response) {
            if (response.status == 'ok') {
                //console.log('Regex deleted!');
                if (response.status == 'ok') {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Regex removed successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            }
        });
    };
    ChatBotService.prototype.deleteRegexValues = function (reg_list) {
        var _this = this;
        this.socket.emit('delRegVal', { reg_list: reg_list }, function (response) {
            if (response.status == 'ok') {
                if (response.status == 'ok') {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Regex Value deleted successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            }
        });
    };
    ChatBotService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatBotService = __decorate([
        core_1.Injectable()
    ], ChatBotService);
    return ChatBotService;
}());
exports.ChatBotService = ChatBotService;
//# sourceMappingURL=ChatBotService.js.map