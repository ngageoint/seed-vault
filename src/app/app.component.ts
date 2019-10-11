import { Component } from '@angular/core';

import { environment } from '../environments/environment';

@Component({
    selector: 'seed-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
    ) {}

    onClick(e) {
        if (e.ctrlKey || e.metaKey) {
            window.open(environment.seedSpecUrl);
        } else {
            location.href = environment.seedSpecUrl;
        }
    }
}
