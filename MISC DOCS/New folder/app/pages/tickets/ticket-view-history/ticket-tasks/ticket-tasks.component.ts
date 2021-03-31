import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-ticket-tasks',
	templateUrl: './ticket-tasks.component.html',
	styleUrls: ['./ticket-tasks.component.css'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketTasksComponent implements OnInit {
	@Input('ticketTasks') ticketTasks: any;
	@ViewChild('tasks') AddTask: ElementRef;
	@Output('tasks') tasks = new EventEmitter();
	@Output('checkedTask') checkedTask = new EventEmitter();
	@Output('removeId') removeId = new EventEmitter();
	@Output('updateTask') updateTask = new EventEmitter();
	whiteSpaceRegex = /^[^-\s][a-zA-Z0-9_\s-]+$/;
	checkedList = [];
	display = false;
	constructor(private snackBar: MatSnackBar) {
		this.display = false;
	}

	ngOnInit() {
	}

	onEnter(task: string) {
		if (!task) {
			this.snackBar.openFromComponent(ToastNotifications, {
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
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'No spaces allowed in task'
				},
				duration: 3000,
				panelClass: ['user-alert', 'warning']
			});
			return;
		
		}
	}

	editTask(todo) {
		todo.editable = true;
	}

	Cancel(todo) {
		todo.editable = false;
	}

	TaskChecked(todo, event) {
		if (event.target.checked) {
			this.ticketTasks.forEach(element => {
				if (element.id == todo.id) {
					todo.completed = true;
					this.TaskDone(todo.id, true, todo.todo);
				}
			});

		}
		else if (!event.target.checked) {
			this.ticketTasks.forEach(element => {
				if (element.id == todo.id) {
					todo.completed = false;
					this.TaskDone(todo.id, false, todo.todo);
				}
			});
		}

	}

	TaskDone(id, flag, name) {
		this.checkedTask.emit({ id: id, status: flag, name: name });
	}

	deleteTask(task) {
		this.removeId.emit({ id: task.id, task: task.todo })
	}

	editedTask(updateId, newTodo, todo) {
		this.updateTask.emit({
			updateId: updateId,
			newTodo: newTodo
		})
		todo.editable = false;
	}
}
