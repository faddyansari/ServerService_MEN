import { Injectable, group } from "@angular/core";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { PushNotificationsService } from '../NotificationService';
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs/Subscription";
import { Subject } from "rxjs/Subject";
import { ActivatedRoute } from "@angular/router";
var cleaner = require('clean-html');


@Injectable()

export class EmailTemplateService {
    socket: SocketIOClient.Socket;
    public ShowTemplateBuilder: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public ShowImportTemplate: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public ShowHTMLEditor: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public showHideList: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public ShowTemplateOptions: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public selectedTemplate: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public sendLayout: BehaviorSubject<any> = new BehaviorSubject([]);
    public showTemplateList: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public selectedSettings: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public EmailLayout: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public passLayout: BehaviorSubject<any> = new BehaviorSubject('');
    public ButtonPressed: Subject<any> = new Subject();
    public validation: Subject<any> = new Subject();

    //changing properties
    defaultSettings: BehaviorSubject<any> = new BehaviorSubject({
        ContainerSettings: {
            containerWidth: 900,
            paddingContainer_top: 20,
            paddingContainer_bottom: 20,
            paddingContainer_left: 20,
            paddingContainer_right: 20,
            marginContainer_top: 20,
            marginContainer_bottom: 20,
            marginContainer_left: 20,
            marginContainer_right: 20,
            backgroundColor_Container: 'transparent',
            backgroundImg_Container: '',
            borderWidthContainer: 1,
            borderStyleContainer: 'solid',
            borderColorContainer: 'black',
            containerimageOpacity: 1,
            backgroundRepeat_Container: 'repeat',
            backgroundSize_Container: 'cover',
            backgroundSizePercent_Container: 50,
            backgroundPositionX_Container: 'left',
            backgroundPositionY_ContainerY: 'center'

        },
        ParentSettings: {
            textAlign: 'left',
            paddingParent_top: 10,
            paddingParent_bottom: 10,
            paddingParent_left: 10,
            paddingParent_right: 10,
            marginParent_top: 20,
            marginParent_bottom: 20,
            marginParent_left: 20,
            marginParent_right: 20,
            backgroundColorParent: 'transparent',
            borderParent_width: 1,
            borderParent_style: 'solid',
            borderParent_color: 'black'
        },
        ChildSettings: {
            color: 'transparent',
            textColor: '#000',
            paddingChild_top: 10,
            paddingChild_bottom: 10,
            paddingChild_left: 10,
            paddingChild_right: 10,
            // placement: 'flex-column',
            borderRadius: 0,
            borderChild_width: 0,
            borderChild_style: 'solid',
            borderChild_color: 'black',
            fontWeight: '',
            fontStyle: '',
            button_FontSize: 12,
            button_Width_Type: '',
            button_Width: 100,
            scaleType: 'px'
        }

    });

    defualtProperties: BehaviorSubject<any> = new BehaviorSubject({
        mainContainerSettings: {
            paddingContainer_top: 0,
            paddingContainer_right: 0,
            paddingContainer_bottom: 0,
            paddingContainer_left: 0,
            marginContainer_top: 0,
            marginContainer_right: 0,
            marginContainer_bottom: 0,
            marginContainer_left: 0,
            backgroundColor_Container: 'transparent',
            backgroundImg_Container: '',
            backgroundRepeat_Container: 'repeat',
            borderWidthContainer: 1,
            borderStyleContainer: 'solid',
            borderColorContainer: '#c8d1e1',
            containerimageOpacity: 1,
            containerWidth: 900,
            backgroundSize_Container: 'cover',
            backgroundSizePercent_Container: 50,
            backgroundPositionX_Container: 'left',
            backgroundPositionY_Container: 'center'
        },
        ParentSettings: {
            paragraph: {
                textAlignParent: 'left',
                paddingParent_top: 10,
                paddingParent_bottom: 10,
                paddingParent_left: 10,
                paddingParent_right: 10,
                marginParent_top: 20,
                marginParent_bottom: 20,
                marginParent_left: 20,
                marginParent_right: 20,
                backgroundColorParent: 'transparent',
                borderParent_width: 1,
                borderParent_style: 'solid',
                borderParent_color: 'black'
            },
            button: {
                textAlignParent: 'left',
                paddingParent_top: 10,
                paddingParent_bottom: 10,
                paddingParent_left: 10,
                paddingParent_right: 10,
                marginParent_top: 20,
                marginParent_bottom: 20,
                marginParent_left: 20,
                marginParent_right: 20,
                backgroundColorParent: 'transparent',
                borderParent_width: 1,
                borderParent_style: 'solid',
                borderParent_color: 'black'
            },
            image: {
                textAlignParent: 'left',
                paddingParent_top: 10,
                paddingParent_bottom: 10,
                paddingParent_left: 10,
                paddingParent_right: 10,
                marginParent_top: 20,
                marginParent_bottom: 20,
                marginParent_left: 20,
                marginParent_right: 20,
                backgroundColorParent: 'transparent',
                borderParent_width: 1,
                borderParent_style: 'solid',
                borderParent_color: 'black'
            },
            SocialMediaLinks: {
                textAlignParent: 'left',
                paddingParent_top: 10,
                paddingParent_bottom: 10,
                paddingParent_left: 10,
                paddingParent_right: 10,
                marginParent_top: 20,
                marginParent_bottom: 20,
                marginParent_left: 20,
                marginParent_right: 20,
                backgroundColorParent: 'transparent',
                borderParent_width: 1,
                borderParent_style: 'solid',
                borderParent_color: 'black'
            },
            separator: {
                textAlignParent: 'left',
                paddingParent_top: 10,
                paddingParent_bottom: 10,
                paddingParent_left: 10,
                paddingParent_right: 10,
                marginParent_top: 20,
                marginParent_bottom: 20,
                marginParent_left: 20,
                marginParent_right: 20,
                backgroundColorParent: 'transparent',
                borderParent_width: 1,
                borderParent_style: 'solid',
                borderParent_color: 'black'
            }
        },

        ChildSettings: {
            paragraph: {
                textColorChild: 'black',
                colorChild: 'gray',
                paddingChild_top: 10,
                paddingChild_bottom: 10,
                paddingChild_left: 10,
                paddingChild_right: 10,
                // placementChild: 'flex-column',
                borderRadiusChild: 0,
                fontWeightChild: '',
                fontStyleChild: '',
                button_FontSizeChild: 10,
                borderChild_width: 1,
                borderChild_style: 'solid',
                borderChild_color: 'black',
                button_WidthChild: 100,
                scaleTypeChild: 'auto',

            },
            button: {
                textColorChild: '#ffffff',
                colorChild: '#56a6ff',
                paddingChild_top: 10,
                paddingChild_bottom: 10,
                paddingChild_left: 10,
                paddingChild_right: 10,
                // placementChild: 'flex-column',
                borderRadiusChild: 4,
                fontWeightChild: '',
                fontStyleChild: '',
                button_FontSizeChild: 10,
                borderChild_width: 1,
                borderChild_style: 'solid',
                borderChild_color: '#1986ff',
                // button_Width_Type_Child: '',
                button_WidthChild: 100,
                scaleTypeChild: 'px'
            },
            image: {
                textColorChild: 'black',
                colorChild: 'gray',
                paddingChild_top: 10,
                paddingChild_bottom: 10,
                paddingChild_left: 10,
                paddingChild_right: 10,
                // placementChild: 'flex-column',
                borderRadiusChild: 0,
                fontWeightChild: '',
                fontStyleChild: '',
                button_FontSizeChild: 10,
                borderChild_width: 1,
                borderChild_style: 'solid',
                borderChild_color: 'black',
                button_WidthChild: 100,
                scaleTypeChild: 'auto'
            },
            SocialMediaLinks: {
                textColorChild: 'black',
                colorChild: 'gray',
                paddingChild_top: 10,
                paddingChild_bottom: 10,
                paddingChild_left: 10,
                paddingChild_right: 10,
                // placementChild: 'flex-column',
                borderRadiusChild: 0,
                fontWeightChild: '',
                fontStyleChild: '',
                button_FontSizeChild: 10,
                borderChild_width: 1,
                borderChild_style: 'solid',
                borderChild_color: 'black',
                button_WidthChild: 100,
                scaleTypeChild: 'auto'
            },
            separator: {
                textColorChild: 'black',
                colorChild: 'gray',
                paddingChild_top: 1,
                paddingChild_bottom: 3,
                paddingChild_left: 10,
                paddingChild_right: 13,
                // placementChild: 'flex-column',
                borderRadiusChild: 0,
                fontWeightChild: '',
                fontStyleChild: '',
                button_FontSizeChild: 10,
                borderChild_width: 1,
                borderChild_style: 'solid',
                borderChild_color: 'black',
                button_WidthChild: 100,
                scaleTypeChild: '%'
            }

        }

    });
    public Agent: any = undefined;
    private subscriptions: Subscription[] = [];
    AllTemplates: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(_socket: SocketService, _authService: AuthService, private _router: ActivatedRoute, private _notificationService: PushNotificationsService, private snackbar: MatSnackBar) {

        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }

        this.subscriptions.push(_socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getTemplates();
                this.getLayoutByName();
                // this.getActivatedRoute();
            }
        }));

        this.subscriptions.push(_authService.getAgent().subscribe(data => {
            if (data) {
                this.Agent = data;
            }
        }));
    }
    getTemplates() {
        this.socket.emit('getAllTemplates', {}, (response) => {
            if (response.status == 'ok') {
                // console.log(response.templates);

                this.AllTemplates.next(response.templates);
            }
        });
    }

    getLayoutByName() {
        // console.log(this.passLayout.getValue());
        
        this.socket.emit('getLayoutByName', { templateName: this.passLayout.getValue() }, (response) => {
            if (response.status == 'ok') {
                // console.log(response);
                
                this.EmailLayout.next(response.layout);
            }
        });
    }

    // getActivatedRoute() {
    //     this._router.params.subscribe(params => {
    //         console.log(params);
    //     });
    // }
    public SetCodeAndReturn(value: string): string {

        // value.replace(/(?=<!--)([\s\S]*?)-->/, '');
        // value.replace(/<(\w+)\s*(?:(?:(?:(?!class=|id=|name=)[^>]))*((?:class|id|name)=['"][^'"]*['"]\s*)?)(?:(?:(?:(?!class=|id=|name=)[^>]))*((?:class|id|name)=['"][^'"]*['"]\s*)?)(?:(?:(?:(?!class=|id=|name=)[^>]))*((?:class|id|name)=['"][^'"]*['"]\s*)?)[^>]*>/, '')
        var options = {
            'indent': '    ',
            'remove-comments': true,
            'remove-tags': [/app-/],
            'remove-attributes': [/ng-/, /id/, /routerlink/],
            'break-around-tags': ['body', 'blockquote', 'br', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'link', 'meta', 'p', 'table', 'title', 'td', 'tr', 'i', 'a', 'button', 'ul', 'div', 'form', 'span'],
        };
        cleaner.clean(value, options, function (html) {
            value = html;
        });
        return value;
    }

    DeleteTemplate(id) {
        this.socket.emit('deleteTemplate', { id: id }, (response) => {
            if (response.status == 'ok') {
                // console.log(this.WholeForm.getValue());
                let index = this.AllTemplates.getValue().findIndex(obj => obj._id == id);


                this.AllTemplates.getValue().splice(index, 1);
                //delete this line by fixing live update issue
                this.getTemplates();
                // console.log(this.WholeForm.getValue());

                this.AllTemplates.next(this.AllTemplates.getValue());
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Template Deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Template Not Deleted!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    }

    public UpdateTemplate(fid, obj): Observable<any> {
        return new Observable(observer => {

            this.socket.emit('editTemplate', { fid: fid, template: obj }, response => {
                if (response.status == 'ok') {

                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Template Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.AllTemplates.getValue().findIndex(a => a._id == fid);
                    this.AllTemplates.getValue()[index] = response.templateUpdated;
                    this.selectedTemplate.next(undefined);
                    observer.next({ status: 'ok', allTemplates: response.templateUpdated })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating template, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }

    public RGBAToHexAString(rgba) {
        // console.log(rgba);

        if (new RegExp(/^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/).test(rgba)) return rgba;
        let sep = rgba.indexOf(",") > -1 ? "," : " ";
        rgba = rgba.substr(5).split(")")[0].split(sep);

        // Strip the slash if using space-separated syntax
        if (rgba.indexOf("/") > -1)
            rgba.splice(3, 1);

        for (let R in rgba) {
            let r = rgba[R];
            if (r.indexOf("%") > -1) {
                let p = r.substr(0, r.length - 1) / 100;

                if (parseInt(R) < 3) {
                    rgba[R] = Math.round(p * 255);
                } else {
                    rgba[R] = p;
                }
            }
        }
        // console.log(this.RGBAToHexA(rgba));
        return this.RGBAToHexA(rgba);
    }


    private RGBAToHexA(rgba) {
        //console.log(rgba);
        let r = (+rgba[0]).toString(16),
            g = (+rgba[1]).toString(16),
            b = (+rgba[2]).toString(16),
            a = Math.round(+rgba[3] * 255).toString(16);
        if (!a) a = 'F';
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        if (a.length == 1)
            a = "0" + a;
        //console.log(a);

        return "#" + r + g + b + a;
    }

    insertEmailTemplate(obj): Observable<any> {
        return new Observable((observer) => {
            // console.log(obj);

            this.socket.emit('addTemplate', { template: obj }, (response) => {
                if (response.status == 'ok') {
                    this.AllTemplates.getValue().unshift(response.template);
                    this.AllTemplates.next(this.AllTemplates.getValue());
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Template Designed Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });

                    observer.next({ status: 'ok', allTemplates: response.templateInserted })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in designing template, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }
    Destroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}

