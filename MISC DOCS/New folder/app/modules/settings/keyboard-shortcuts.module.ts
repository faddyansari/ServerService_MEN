import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { KeyboardShortcutsComponent } from '../../pages/settings/keyboard-shortcuts/keyboard-shortcuts.component';


const routes: Routes = [
    
];

@NgModule({
    imports:[
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
       
    ]
})
export class KeyboardShortcutsModule {}