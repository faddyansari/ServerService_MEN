import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AutomatedResponsesComponent } from '../../pages/settings/automated-responses/automated-responses.component';
import { RolesAndPermissionsComponent } from '../../pages/settings/roles-and-permissions/roles-and-permissions.component';
import { NewRoleDialogComponent } from '../../dialogs/new-role-dialog/new-role-dialog.component';
import { RolesAndPermissionsService } from '../../../services/RolesAndPermissionsService';
import { AuthSettingsComponent } from '../../pages/settings/auth-settings/auth-settings.component';
import { KeyboardShortcutsComponent } from '../../pages/settings/keyboard-shortcuts/keyboard-shortcuts.component';
import { TicketResponseComponent } from '../../pages/settings/ticket-management/ticket-response/ticket-response.component';

const routes: Routes = [
    { path: '', redirectTo: 'automated-responses' },
    { path: 'automated-responses', component: AutomatedResponsesComponent },
    { path: 'roles-and-permissions', component: RolesAndPermissionsComponent },
    { path: 'auth-settings', component: AuthSettingsComponent },
    { path: 'keyboard-shortcuts', component: KeyboardShortcutsComponent },
    { path: 'response', component: TicketResponseComponent },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxSummernoteModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: [
        AutomatedResponsesComponent,
        RolesAndPermissionsComponent,
        AuthSettingsComponent,
        NewRoleDialogComponent,
        KeyboardShortcutsComponent,
        TicketResponseComponent
    ],
    providers: [
        RolesAndPermissionsService,
    ],
    entryComponents: [
        NewRoleDialogComponent
    ]
})
export class GeneralSettingsModule { }