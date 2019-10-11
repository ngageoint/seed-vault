import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { SeedImagesModule } from '@ngageoint/seed-images';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import {
    ButtonModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule,
    MenuModule, OverlayPanelModule, TooltipModule
} from 'primeng/primeng';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StateService } from './state.service';
import { RegistriesComponent } from './registries/component';
import { UsersComponent } from './users/component';
import { AuthenticationComponent } from './authentication/component';
import { SearchComponent } from './search/component';
import { AppConfigService } from './app-config.service';


const appInitializer = (appConfig: AppConfigService) => {
    return () => {
        return appConfig.loadAppConfig('./assets/appConfig.json')
            .catch(err => {
                console.log(err);
            });
    };
};


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
        DialogModule,
        DropdownModule,
        InputTextModule,
        MenuModule,
        OverlayPanelModule,
        TableModule,
        ToastModule,
        TooltipModule
    ],
    providers: [
        CookieService,
        StateService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [AppConfigService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
