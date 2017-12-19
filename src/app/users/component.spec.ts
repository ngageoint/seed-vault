import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateService } from '../state.service';
import { UsersComponent } from './component';

describe('RegistriesComponent', () => {
    let component: UsersComponent;
    let fixture: ComponentFixture<UsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UsersComponent],
            imports: [],
            providers: [
                StateService,
                { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
            ],
            // Tells the compiler not to error on unknown elements and attributes
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
