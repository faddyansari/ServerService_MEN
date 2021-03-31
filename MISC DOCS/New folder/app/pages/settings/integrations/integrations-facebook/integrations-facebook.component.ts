import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IntegrationsService } from '../../../../../services/LocalServices/IntegrationsService';
import { timeout } from 'q';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { httpFactory } from '@angular/http/src/http_module';
import { AuthService } from '../../../../../services/AuthenticationService';
import { SocketService } from '../../../../../services/SocketService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { environment } from '../../../../../environments/environment';
import { TicketAutomationService } from '../../../../../services/LocalServices/TicketAutomationService';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';

@Component({
	selector: 'app-integrations-facebook',
	templateUrl: './integrations-facebook.component.html',
	styleUrls: ['./integrations-facebook.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class IntegrationsFacebookComponent implements OnInit {

	public subscriptions: Subscription[] = [];
	private FBSDKScriptElement;
	editCase = false;
	extendedToken = '';
	public views = {
		loading: true,
		AppIdView: false,
		FBLoginView: false,
		FBChoosePagesView: false,
		FBChosenPageView: false,
	}

	public loading = false;
	private sendingInfo: Object = {};
	public FBPagesView;
	public connectedPage;
	private agent;
	sbt = false;
	appIdForm: FormGroup;

	fb_appid = '';
	fb_secretId = '';
	pageURI = environment.FBMicroserviceURI + "/FB/getPageData";
	editAppId = false;
	all_groups = [];
	userid = '';
	package = undefined;
	// private FBMicroserviceURI = "http://beelinks.solutions";

	constructor(
		public _integrationsService: IntegrationsService,
		private fb: FacebookService,
		private http: HttpClient,
		private _authService: AuthService,
		private _appStateService: GlobalStateService,
		private _ticketAutomationService: TicketAutomationService,
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
		private formbuilder: FormBuilder) {

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Integerations');

		this.subscriptions.push(this._authService.getPackageInfo().subscribe(pkg => {
			console.log(pkg);
			if (pkg) {
			  this.package = pkg.integratons;
			  if (!this.package.allowed) {
				this._appStateService.NavigateTo('/noaccess');
			  }
			}
		  }));

		this.appIdForm = this.formbuilder.group({
			'fb_appid': [this.fb_appid, Validators.required]
		});

	

		//Getting App Id and loading SDK.
		this.subscriptions.push(this._integrationsService.getFacebookAppId().subscribe(res => {
			if (res) {
				this.fb_appid = res.app_id;
				console.log(this.fb_appid)
				this.fb_secretId = res.app_secret;
				this.appIdForm.get('fb_appid').setValue(this.fb_appid);
				this.http.post(this.pageURI, { nsp: this.agent.nsp }).subscribe(resp => {
					if (resp && resp["name"]) {
						this.connectedPage = resp;
						this.loadFBSDK();
						this.showView('FBChosenPageView');
					}
					else {
						this.loadFBSDK();
						this.showView('FBLoginView');
					}
				}, err => {
					console.log(err);
					this.loadFBSDK();
					this.showView('FBLoginView');
				});
			} else {
				this.showView('AppIdView');
			}
		}));

	

		this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
			this.agent = agent;
		}));

		this.subscriptions.push(_authService.SBT.subscribe(data => {
			this.sbt = data;
		}));

	}

	connectFB() {
		this.loading = true;
		this.loginFB().then(loginResp => {
			this.sendingInfo['accessToken'] = loginResp.authResponse.accessToken;
			this.getFBPages(loginResp.authResponse.userID)
				.then(pagesResp => {
					this.getPagePicture(pagesResp.data[0].id).then(res => {
						console.log("getpicture",res);
						pagesResp.data[0].url = (res["picture"]["data"]["url"]);
						pagesResp.data[0].link = (res["link"]);

						console.log('pagesResp')
						console.log(pagesResp)
	
						this.sendingInfo['userPageData'] = pagesResp.data;
						this.FBPagesView = { array: [], selected: -1 };
						pagesResp.data.forEach(element => {
							// show only pages where the user has the "MODERATE" property:
							// user must be a administrator, moderator or editor on a page to have this permission
							if (element.tasks.includes("MODERATE"))
								this.FBPagesView.array.push({name:element.name,url:element.url,link:element.link});
	
						});
						console.log(this.FBPagesView.array);
					}).catch(err => {
						console.log(err);
						this.loading=false;
					})
				

					this.fb.logout()
						.then(() => {
							this.showView('FBChoosePagesView');
							this.loading = false;
						})
						.catch(err => {
							console.log('Logout cancelled');
							this.loading = false;
						});


				})
		})
			.catch(err => {
				console.log(err);
				this.loading = false;
			});
	}

	// communicate with server to add user facebook page
	subscribeFBPage() {
		if (this.FBPagesView.selected > -1) {
			this.loading = true;

			let subscribeURI = environment.FBMicroserviceURI + "/FB/connectPage";
			this.sendingInfo['selectedPage'] = this.FBPagesView['selected'];
			this.sendingInfo['companyNSP'] = this.agent.nsp;
			this.sendingInfo['overwrite'] = false;
			console.log('this.sendingInfo');
			console.log(this.sendingInfo);
			console.log("Sending POST request on '/FB/connectPage'")
			this.http.post(subscribeURI, this.sendingInfo)
				.subscribe(resp => {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Facebook page associated successfully!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'success']
					});
					console.log('/FB/connectPage')
					console.log('resp')
					console.log(resp)
					this.connectedPage = this.sendingInfo['userPageData'][this.sendingInfo['selectedPage']];

					console.log('this.connectedPage')
					console.log(this.connectedPage)
					this.loading = false;
					if (resp) {
						this.showView('FBChosenPageView');
					}
					else {
					}
				}, err => {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'warning',
							msg: 'Error in association, Please try again!'
						},
						duration: 2000,
						panelClass: ['user-alert', 'warning']
					});
					this.loading = false;
				});
		}

	}

	setFBAppId() {
		this._integrationsService.setFacebookAppId(this.appIdForm.get('fb_appid').value).subscribe(app_id => {
			if (app_id) {
				this.editAppId = false;
				this.showView('loading');
				this.fb_appid = app_id;
				this.http.post(this.pageURI, { nsp: this.agent.nsp })
					.subscribe(
						resp => {
							// check if complete object is sent by checking the presence of one of the fields 
							if (resp['name']) {
								this.connectedPage = resp;
								this.loadFBSDK();
								this.showView('FBChosenPageView');
							}
							else {
								this.loadFBSDK();
								this.showView('FBLoginView');
							}
						},
						err => {
							this.loadFBSDK();
							this.showView('FBLoginView');
						}
					);
			} else {
				console.log('error');
			}
		})
	}

	cancel() {
		this.editAppId = false;
		this.showView('loading');
		this.http.post(this.pageURI, { nsp: this.agent.nsp }).subscribe(resp => {
			if (resp['name']) {
				this.connectedPage = resp;
				this.loadFBSDK();
				this.showView('FBChosenPageView');
			}
			else {
				this.loadFBSDK();
				this.showView('FBLoginView');
			}
		},
			err => {
				this.loadFBSDK();
				this.showView('FBLoginView');
			}
		);
	}



	editPage() {
		this.editCase = true;
	}
	changeAppId() {
		this.editAppId = true;
		this.showView('AppIdView');
	}

	changeState(event){
		this.editCase=event;
	}

	getPagePicture(id) {
		let url = "/" + id + "/?fields=link,picture{url}";
		return new Promise((resolve, reject) => {
			this.fb.api(url)
				.then(resp => {
					resolve(resp)
				})
				.catch((error: any) => {
					console.error("getpicture error");
					reject(error);
				});
		});
	}

	// GOTO: create an expected error has occured or server can not be reached error \
	// to tell the user the application was not supposed to work this way
	// catch all the http subscribes

	// run when user wishes to disconnect his/her page from the platform
	disconnectFB() {
		let uri = environment.FBMicroserviceURI + "/FB/disconnectPage";
		let para = { nsp: this.agent.nsp, page: this.connectedPage };
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure wan to deassociate this page?' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this.loading = true;
				this.http.post(uri, para)
					.subscribe(response => {
						this.loading = false;
						if (response) {
							this.connectedPage = undefined;
							this.showView('FBLoginView');
							this.snackBar.openFromComponent(ToastNotifications, {
								data: {
									img: 'ok',
									msg: 'Facebook page deassociated successfully!'
								},
								duration: 2000,
								panelClass: ['user-alert', 'success']
							});
						}
						else {
							console.log("Error occured in disconnecting page");
						}
					});

				// 			this.fb.logout()
				//   .then(() => {
				// this.FBPagesView = null;
				// this.sendingInfo = {};

				// this.http.post(uri, para)
				//   .subscribe(resp => {
				// 	this.fb.logout()
				//     this.loading = false;
				//     if (resp) {
				//       this.connectedPage = undefined;
				//       this.showView('FBLoginView');
				//     }
				//     else {
				//       console.log("Error occured in disconnecting page from platform");
				//     }
				//   });
				//   })
				//   .catch(err => {
				//     console.log('Logout cancelled');
				//     this.loading = false;
				//   });
			}
			else {
				return
			}
		});



	}

	private loginFB(): Promise<any> {

		let loginOptions = { scope: 'manage_pages,read_page_mailboxes' };

		return new Promise((resolve, reject) => {
			this.fb.login(loginOptions)
				.then((resp: LoginResponse) => {
					resolve(resp);
				})
				.catch((error: any) => {
					this.loading = false;
					console.error("Login cancelled");
					reject(error);
				});
		});
	}

	backToLoginView() {
		this.FBPagesView = null;
		this.sendingInfo = {};
		this.showView('FBLoginView');

		this.fb.logout()
			.then(() => {
				this.FBPagesView = null;
				this.sendingInfo = {};
				this.showView('FBLoginView');
				this.loading = false;
			})
			.catch(err => {
				console.log('Logout cancelled');
				this.loading = false;
			});
	}

	private getFBPages(userID): Promise<any> {

		let url = "/" + userID + "/accounts";
		console.log(url)
		return new Promise((resolve, reject) => {
			this.fb.api(url)
				.then(resp => {
					resolve(resp)
				})
				.catch((error: any) => {
					console.error("getpage error");
					reject(error);
				});
		});
	}

	private loadFBSDK() {
		if (this.fb_appid) {
			this.FBSDKScriptElement = document.createElement('script');
			this.FBSDKScriptElement.type = 'text/javascript';
			this.FBSDKScriptElement.async = true;
			this.FBSDKScriptElement.src = 'https://connect.facebook.net/en_US/sdk.js';
			var scriptsList = document.getElementsByTagName('script');
			var lastScript = scriptsList[scriptsList.length - 1]
			lastScript.parentNode.insertBefore(this.FBSDKScriptElement, lastScript.nextSibling);

			this.FBSDKScriptElement.onload = () => {
				let initParams: InitParams = {
					appId: this.fb_appid,
					xfbml: true,
					version: 'v6.0',
				};

				this.fb.init(initParams);
			}
		} else {
			console.log('no app id found!');
		}
	}

	showView(viewNameSelect: string) {
		let viewNames = Object.keys(this.views);

		viewNames.forEach(viewName => {
			if (viewNameSelect == viewName)
				this.views[viewName] = true;
			else
				this.views[viewName] = false;
		});

		this.loading = false;
	}

	ngOnInit() { }

	ngOnDestroy(): void {
		if(this.FBSDKScriptElement) this.FBSDKScriptElement.remove();

//		this.FBSDKScriptElement.remove();
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
	Sendreq(): Promise<any> {
		let uri = "/" + this.userid + "?fields=posts{created_time,message,full_picture,attachments{url,description,media,media_type}}"
		return new Promise((resolve, reject) => {
			this.fb.api(uri)
				.then(resp => {
					console.log("data post", resp);

					resolve(resp)
				})
				.catch((error: any) => {
					console.error("getpicture error");
					reject(error);
				});
		});
	}
}
