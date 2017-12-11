import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { ButtonModule, GrowlModule, InputTextModule, OverlayPanelModule } from 'primeng/primeng';

import { AppRoutingModule } from './app-routing.module';
import { SeedImagesModule } from './seed-images/seed-images.module';
import { AppComponent } from './app.component';
import { StateService } from './state.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        // primeng
        ButtonModule,
        GrowlModule,
        InputTextModule,
        OverlayPanelModule,
        SeedImagesModule
    ],
    providers: [
        StateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
