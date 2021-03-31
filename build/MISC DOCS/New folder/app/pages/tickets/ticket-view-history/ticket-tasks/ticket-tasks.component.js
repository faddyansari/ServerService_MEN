"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketTasksComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var TicketTasksComponent = /** @class */ (function () {
    function TicketTasksComponent(snackBar) {
        this.snackBar = snackBar;
        this.tasks = new core_1.EventEmitter();
        this.checkedTask = new core_1.EventEmitter();
        this.removeId = new core_1.EventEmitter();
        this.updateTask = new core_1.EventEmitter();
        this.whiteSpaceRegex = /^[^-\s][a-zA-Z0-9_\s-]+$/;
        this.checkedList = [];
        this.display = false;
        this.display = false;
    }
    TicketTasksComponent.prototype.ngOnInit = function () {
    };
    TicketTasksComponent.prototype.onEnter = function (task) {
        if (!task) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Must enter task first'
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        if (this.whiteSpaceRegex.test(task)) {
            this.tasks.emit(task);
            this.AddTask.nativeElement.value = '';
        }
        else {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No spaces allowed in task'
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
    };
    TicketTasksComponent.prototype.editTask = function (todo) {
        todo.editable = true;
    };
    TicketTasksComponent.prototype.Cancel = function (todo) {
        todo.editable = false;
    };
    TicketTasksComponent.prototype.TaskChecked = function (todo, event) {
        var _this = this;
        if (event.target.checked) {
            this.ticketTasks.forEach(function (element) {
                if (element.id == todo.id) {
                    todo.completed = true;
                    _this.TaskDone(todo.id, true, todo.todo);
                }
            });
        }
        else if (!event.target.checked) {
            this.ticketTasks.forEach(function (element) {
                if (element.id == todo.id) {
                    todo.completed = false;
                    _this.TaskDone(todo.id, false, todo.todo);
                }
            });
        }
    };
    TicketTasksComponent.prototype.TaskDone = function (id, flag, name) {
        this.checkedTask.emit({ id: id, status: flag, name: name });
    };
    TicketTasksComponent.prototype.deleteTask = function (task) {
        this.removeId.emit({ id: task.id, task: task.todo });
    };
    TicketTasksComponent.prototype.editedTask = function (updateId, newTodo, todo) {
        this.updateTask.emit({
            updateId: updateId,
            newTodo: newTodo
        });
        todo.editable = false;
    };
    __decorate([
        core_1.Input('ticketTasks')
    ], TicketTasksComponent.prototype, "ticketTasks", void 0);
    __decorate([
        core_1.ViewChild('tasks')
    ], TicketTasksComponent.prototype, "AddTask", void 0);
    __decorate([
        core_1.Output('tasks')
    ], TicketTasksComponent.prototype, "tasks", void 0);
    __decorate([
        core_1.Output('checkedTask')
    ], TicketTasksComponent.prototype, "checkedTask", void 0);
    __decorate([
        core_1.Output('removeId')
    ], TicketTasksComponent.prototype, "removeId", void 0);
    __decorate([
        core_1.Output('updateTask')
    ], TicketTasksComponent.prototype, "updateTask", void 0);
    TicketTasksComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-tasks',
            templateUrl: './ticket-tasks.component.html',
            styleUrls: ['./ticket-tasks.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], TicketTasksComponent);
    return TicketTasksComponent;
}());
exports.TicketTasksComponent = TicketTasksComponent;
//# sourceMappingURL=ticket-tasks.component.js.map