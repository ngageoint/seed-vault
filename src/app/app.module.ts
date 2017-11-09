import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import {
    DataGridModule,
    PanelModule,
    AutoCompleteModule,
    DialogModule
} from 'primeng/primeng';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StateService } from './state.service';
import { ImagesComponent } from './images.component';

@NgModule({
    declarations: [
        AppComponent,
        ImagesComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        DataGridModule,
        PanelModule,
        AutoCompleteModule,
        DialogModule
    ],
    providers: [
        StateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
