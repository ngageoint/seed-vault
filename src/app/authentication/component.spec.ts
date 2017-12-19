import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { CookieService } from 'ngx-cookie-service';

import { StateService } from '../state.service';
import { AuthenticationComponent } from './component';

describe('AuthenticationComponent', () => {
    let component: AuthenticationComponent;
    let fixture: ComponentFixture<AuthenticationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AuthenticationComponent],
            imports: [HttpClientModule, NgIdleKeepaliveModule.forRoot()],
            providers: [
                CookieService, StateService,
                { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
            ],
            // Tells the compiler not to error on unknown elements and attributes
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthenticationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
