import { Component } from '@angular/core';

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
            window.open('https://ngageoint.github.io/seed/seed.html');
        } else {
            location.href = 'https://ngageoint.github.io/seed/seed.html';
        }
    }
}
