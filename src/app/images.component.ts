import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'app-images',
    template: `
        <div class="image-search">
            <p-autoComplete [(ngModel)]="image" [suggestions]="filteredImages" (completeMethod)="filterImages($event)"
                            field="Name" [size]="60" placeholder="Search Images" [minLength]="1"></p-autoComplete>
        </div>
        <div class="image-results">
            <h3>{{ images.length }} image(s) found</h3>
            <p-dataGrid [value]="images">
                <ng-template let-image pTemplate="item">
                    <div class="ui-g-12 ui-md-3">
                        <a (click)="showManifest(image)">
                            <p-panel [header]="image.Name" [style]="{'text-align':'center'}">
                                {{ image.Registry }}
                            </p-panel>
                        </a>
                    </div>
                </ng-template>
            </p-dataGrid>
        </div>
        <p-dialog *ngIf="currImage" [header]="currImage.Name" [(visible)]="showDialog" (onHide)="hideManifest()" [dismissableMask]="true">
            {{ currImage.Manifest }}
        </p-dialog>
    `,
    styles: [`
        .image-search {
            text-align: center;
            width: 100%;
            margin-bottom: 15px;
        }
        ::ng-deep .image-search .ui-inputtext {
            font-size: 1.5em !important;
        }
        .image-results h3 {
            text-align: center;
        }
        ::ng-deep .image-results .ui-panel:hover {
            background: red;
            transition: background-color 1s;
        }
    `]
})
export class ImagesComponent implements OnInit {
    images: any[] = [];
    image: any;
    filteredImages: any[];
    showDialog: Boolean = false;
    currImage: any;

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

    searchImages(query): any {
        return this.http.get(`http://52.14.95.20:8080/images/search/${query}`)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    filterImages(event): void {
        this.searchImages(event.query).then(data => {
            this.filteredImages = data;
        });
    }

    showManifest(image): void {
        this.currImage = image;
        this.showDialog = true;
    }

    hideManifest(): void {
        this.currImage = null;
    }

    ngOnInit() {
        this.getImages().then(data => {
            this.images = data;
        });
    }
}
