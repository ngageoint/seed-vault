import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import {
    ButtonModule, CheckboxModule, GrowlModule, InputTextModule, MenuModule,
    OverlayPanelModule
} from 'primeng/primeng';

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
        HttpClientModule,
        NgIdleKeepaliveModule.forRoot(),
        SeedImagesModule,
        // primeng
        ButtonModule,
        CheckboxModule,
        GrowlModule,
        InputTextModule,
        MenuModule,
        OverlayPanelModule
    ],
    providers: [
        CookieService,
        StateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
