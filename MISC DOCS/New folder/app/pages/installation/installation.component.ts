import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from '../../../services/AuthenticationService';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../../../services/SocketService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../dialogs/SnackBar-Dialog/toast-notifications.component';
import 'codemirror/mode/javascript/javascript';

@Component({
	selector: 'app-installation',
	templateUrl: './installation.component.html',
	styleUrls: ['./installation.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class InstallationComponent implements OnInit, AfterViewInit {
	codeMirrorOptions: any = {
		theme: 'base16-light',
		mode: { name: 'javascript' },
		lineNumbers: true,
		lineWrapping: true,
		foldGutter: true,
		gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
		autoCloseBrackets: true,
		matchBrackets: true,
		readOnly: true, className: "readOnly",
		lint: true
	  };
	script: string = '';
	scubscriptions: Subscription[] = [];
	socket;
	public loading = false;
	public email = '';
	emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	public invalidEmail = false;
	viewContentInfo = false;
	constructor(
		private http: Http,
		private _authService: AuthService,
		private _socketService: SocketService,
		public snackBar: MatSnackBar) {
		_socketService.getSocket().subscribe((data) => {
			this.socket = data;
		});

		_socketService.getScript().subscribe(script => {
			if (script == '') {
				this.socket.emit('displayScript');
			} else {
				this.script = script;
			}
		})

	}

	ngOnInit() {
	}


	ngAfterViewInit() {
	}


	ngOnDestroy() {
		this.scubscriptions.forEach(subscript => {
			subscript.unsubscribe();
		});
	}

	public RequestCode() {
		this.invalidEmail = false;
		if (!new RegExp(this.emailPattern).test(this.email)) {
			this.invalidEmail = true;
			return;
		}
		this.loading = true;
		this.socket.emit('sendCode', {
			email: this.email,
			sender: this._authService.Agent.getValue().email
		}, (response) => {
			this.loading = false;
			if (response.status == 'ok') {

				this.snackBar.openFromComponent(ToastNotifications, {
					data: { img: 'ok', msg: 'Code Sent to ' + this.email },
					duration: 3000,
					panelClass: ['user-alert', 'success']
				}).afterDismissed().subscribe(result => {
					this.email = '';
				});

			} else {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'warning',
						msg: "Unable To Send Code."
					},
					duration: 3000,
					panelClass: ['user-alert', 'error']
				})
			}
		});
	}

	toggleInfoArea(){
		this.viewContentInfo = !this.viewContentInfo;
	}



}
