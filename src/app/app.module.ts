import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

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
        HttpModule,
        SeedImagesModule
    ],
    providers: [
        StateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
