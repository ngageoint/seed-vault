import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { SeedImagesModule } from 'seed-images';

import {
    ButtonModule, CheckboxModule, DataTableModule, GrowlModule, InputTextModule, MenuModule,
    OverlayPanelModule, TooltipModule
} from 'primeng/primeng';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StateService } from './state.service';
import { RegistriesComponent } from './registries/component';
import { UsersComponent } from './users/component';
import { AuthenticationComponent } from './authentication/component';
import { SearchComponent } from './search/component';

@NgModule({
    declarations: [
        AppComponent,
        RegistriesComponent,
        UsersComponent,
        AuthenticationComponent,
        SearchComponent
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
        DataTableModule,
        GrowlModule,
        InputTextModule,
        MenuModule,
        OverlayPanelModule,
        TooltipModule
    ],
    providers: [
        CookieService,
        StateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
