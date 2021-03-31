import { Injectable } from "@angular/core";
import { SocketService } from "./SocketService";
import { AuthService } from "./AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { GlobalStateService } from "./GlobalStateService";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastNotifications } from "../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { Observable } from "rxjs/Observable";

@Injectable()

export class RolesAndPermissionsService {
    socket: SocketIOClient.Socket;
    Agent: any;
    defaultPermissions: BehaviorSubject<any> = new BehaviorSubject({});
    authPermissions: BehaviorSubject<any> = new BehaviorSubject({});
    permissions: BehaviorSubject<any> = new BehaviorSubject({});
    loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    savedPermissions: BehaviorSubject<any> = new BehaviorSubject({});
    roles: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(_socket: SocketService,
        private _authService: AuthService,
        private _appStateService: GlobalStateService,
        private snackBar: MatSnackBar) {
        _appStateService.breadCrumbTitle.next('User Roles and Permissions');
        // Subscribing Agent Object
        _authService.getAgent().subscribe(data => {
            this.Agent = data;
        });

        _authService.permissions.subscribe(permissions => {
            if (permissions && Object.keys(permissions).length) {
                // console.log(permissions);
                this.permissions.next(permissions);
                this.savedPermissions.next(permissions);
                if (this.Agent) {
                    this.roles.next(permissions[this.Agent.role].settings.rolesAndPermissions.canView);
                }
            }

        });

        _socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getDefaultPermissions();
                // this.getNSPPermissions();
            }
        });

    }

    getDefaultPermissions() {
        this.socket.emit('getDefaultPermissions', {}, (response) => {
            if (response.status == 'ok') {
                this.defaultPermissions.next(response.permissions);
                // console.log(this.defaultPermissions.getValue());
            }
        });
    }


    // getAuthenticationSettings(){
    //     this.socket.emit('getAuthSettings', {}, (response) => {
    //         if (response.status == 'ok') {
    //             this.authPermissions.next(response.authPermissions);
    //             // console.log(this.defaultPermissions.getValue());
    //         }
    //     });
    // }

    // getNSPPermissions() {
    //     this.socket.emit('getNSPPermissions', {}, (response) => {
    //         // console.log(response);

    //         if (response.status == 'ok') {
    //             this.permissions.next(response.permissions);
    //             this.roles.next(Object.keys(response.permissions));
    //             this.savedPermissions.next(response.permissions);
    //         }
    //     });
    // }

    savePermissions(permissions, role) {
        this.loading.next(true);
        this.socket.emit('savePermissions', { permissions: permissions, role: role }, (response) => {
            // console.log(response);
            if (response.status == 'ok') {
                // this.permissions.next(response.permissions);
                // this.selectedAgent.next(response.updatedAgent);
            }
            this.loading.next(false);
            this.showSnackbar(response);
        });
    }

    addRole(role) {
        this.socket.emit('addRole', { permissions: this.defaultPermissions.getValue(), role: role }, (response) => {
            // console.log(response);
            if (response.status == 'ok') {
                // console.log(response.permissions);
                // this.permissions.next(response.permissions);
                // this.roles.next(Object.keys(response.permissions));
                // this.selectedAgent.next(response.updatedAgent);
            }
            this.loading.next(false);
            this.showSnackbar(response);
        });
    }
    deleteRole(role) {
        this.socket.emit('deleteRole', { permissions: this.defaultPermissions.getValue(), role: role }, (response) => {
            // console.log(response);
            if (response.status == 'ok') {
                // this.permissions.next(response.permissions);
                // this.selectedAgent.next(response.updatedAgent);
            }
            this.loading.next(false);
            this.showSnackbar(response);
        });
    }


    showSnackbar(response) {
        switch (response.status) {
            case 'ok':
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Settings saved successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                break;
            case 'error':
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
                break;
            default:
                break;
        }

    }

    ToggleAuthPermission(role, value){
        this.socket.emit('toggleAuthPermission', {role: role, value: value}, (response) => {
            // console.log(response);
            this.showSnackbar(response);
        });
    }
    Toggle2FAPermission(role, value){
        this.socket.emit('toggle2FAPermission', {role: role, value: value}, (response) => {
            // console.log(response);
            this.showSnackbar(response);
        });
    }
    ToggleForgotPassPermission(value){
        this.socket.emit('toggleForgotPassword', {value: value}, (response) => {
            // console.log(response);
            this.showSnackbar(response);
        });
    }

    addIP(ip) : Observable<any>{
        return new Observable((observer) => {
            this.socket.emit('addAuthIP', {ip: ip} , (response) => {
               observer.next(response.status);
               observer.complete();
            });
        })
    }
    setSuppressionList(emails) : Observable<any>{
        return new Observable((observer) => {
            this.socket.emit('setSuppressionList', {emails: emails} , (response) => {
               observer.next(response.status);
               observer.complete();
            });
        })
    }
    removeIP(ip){
        this.socket.emit('removeAuthIP', {ip: ip} , (response) => {
            console.log(response);
        });
    }
    removeAgentFromSuppresionList(email){
        this.socket.emit('removeAgentFromSuppressionList', {email: email} , (response) => {
            console.log(response);
        });
    }

    Destroy() {
        this._appStateService.breadCrumbTitle.next('');
    }
}