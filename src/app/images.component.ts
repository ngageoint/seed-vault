import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'app-images',
    template: `
        <h2>Images</h2>
        <ul>
            <li *ngFor="let image of images">
                {{ image.name }}<br />
                {{ image.registry }}
            </li>
        </ul>
    `,
    styles: [`
        background: #fff;
    `]
})
export class ImagesComponent implements OnInit {
    images: any[];

    constructor(
        private http: Http
    ) {}

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getImages(): any {
        return this.http.get('http://52.14.95.20:8080/images')
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    ngOnInit() {
        this.getImages().then(data => {
            this.images = data;
        });
    }
}
