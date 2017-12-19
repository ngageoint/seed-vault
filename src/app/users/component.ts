import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../state.service';

@Component({
    selector: 'seed-users',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class UsersComponent implements OnInit {

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
