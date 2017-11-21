import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeedImagesComponent } from './seed-images.component';

import {
    AutoCompleteModule,
    DataGridModule,
    DialogModule,
    PanelModule
} from 'primeng/primeng';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // prime-ng
        AutoCompleteModule,
        DataGridModule,
        DialogModule,
        PanelModule
    ],
    declarations: [SeedImagesComponent],
    exports: [SeedImagesComponent]
})
export class SeedImagesModule {
}
