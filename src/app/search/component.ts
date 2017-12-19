import { Component } from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
    selector: 'seed-search',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class SearchComponent {
    env = environment;
}
