import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { StateService } from '../state.service';
import { RegistriesComponent } from './component';

describe('RegistriesComponent', () => {
    let component: RegistriesComponent;
    let fixture: ComponentFixture<RegistriesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistriesComponent],
            imports: [HttpClientModule],
            providers: [
                MessageService, StateService,
                { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
            ],
            // Tells the compiler not to error on unknown elements and attributes
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
