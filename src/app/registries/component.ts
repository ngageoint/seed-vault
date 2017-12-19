import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../state.service';

@Component({
    selector: 'seed-registries',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class RegistriesComponent implements OnInit {

    constructor(
        private router: Router,
        private stateService: StateService
    ) {
        if (!this.stateService.getAuthToken()) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
    }
}
