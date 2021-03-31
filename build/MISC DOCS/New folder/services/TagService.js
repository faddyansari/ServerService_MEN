"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var toast_notifications_component_1 = require("../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var TagService = /** @class */ (function () {
    function TagService(_socket, _authService, snackbar) {
        // console.log('Tag Service');
        var _this = this;
        this.snackbar = snackbar;
        this.Tag = new BehaviorSubject_1.BehaviorSubject({});
        this.Agent = new BehaviorSubject_1.BehaviorSubject({});
        this.Tags = new BehaviorSubject_1.BehaviorSubject([]);
        // Subscribing Agent Object
        _authService.getAgent().subscribe(function (data) {
            _this.Agent = data;
        });
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getTags();
            }
        });
    }
    TagService.prototype.getTags = function () {
        var _this = this;
        this.socket.emit('getTagByNSP', {}, function (data) {
            if (data.status == 'ok') {
                _this.Tags.next(data.tag_data);
            }
            else {
                _this.Tags.next([]);
            }
        });
    };
    TagService.prototype.sort = function (order) {
        var _this = this;
        this.socket.emit('sortTag', { order: order }, function (data) {
            if (data.status == 'ok') {
                _this.Tags.next(data.tag_data);
            }
            else {
                _this.Tags.next([]);
            }
        });
    };
    TagService.prototype.insertTag = function (tags) {
        var _this = this;
        this.socket.emit('updateTagProperty', { tags: tags }, function (data) {
            if (data.status == 'ok') {
                _this.Tags.next(tags);
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Tag(s) added Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.Tags.next([]);
            }
        });
    };
    TagService.prototype.deleteTag = function (tags) {
        var _this = this;
        console.log(tags);
        this.socket.emit('updateTagProperty', { tags: tags }, function (data) {
            if (data.status == 'ok') {
                _this.Tags.next(tags);
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Tag deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.Tag.next([]);
            }
        });
    };
    TagService.prototype.UpdateTag = function (tags) {
        var _this = this;
        this.socket.emit('updateTagProperty', { tags: tags }, function (data) {
            if (data.status == 'ok') {
                _this.Tags.next(tags);
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Tag updated Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.Tag.next([]);
            }
        });
    };
    TagService = __decorate([
        core_1.Injectable()
    ], TagService);
    return TagService;
}());
exports.TagService = TagService;
//# sourceMappingURL=TagService.js.map