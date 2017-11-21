import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'seed-images',
    template: `
        <div class="seed-image-search">
            <p-autoComplete [(ngModel)]="image" (completeMethod)="filterImages($event)" field="Name" [size]="60"
                            placeholder="Search Images" [minLength]="0"></p-autoComplete>
        </div>
        <!--<div class="seed-image-progress" *ngIf="!loading">-->
            <!--<p-progressBar mode="indeterminate"></p-progressBar>-->
        <!--</div>-->
        <div class="seed-image-results" *ngIf="!loading">
            <h3>{{ images.length }} image(s) found</h3>
            <p-dataGrid [value]="images">
                <ng-template let-image pTemplate="item">
                    <div class="ui-g-12 ui-md-3">
                        <a (click)="showManifest(image)">
                            <p-panel [header]="image.Name" [style]="{'text-align':'center'}">
                                {{ image.Org }}<br />
                                {{ image.Registry }}
                            </p-panel>
                        </a>
                    </div>
                </ng-template>
            </p-dataGrid>
            <p-dialog *ngIf="currImage" [header]="currImage.Name" [(visible)]="showDialog" (onHide)="hideManifest()" [responsive]="true"
                      [dismissableMask]="true" [modal]="true" positionTop="40">
                {{ currImage.Manifest }}
            </p-dialog>
        </div>
    `,
    styles: [`
        .seed-image-search {
            text-align: center;
            width: 100%;
            margin-bottom: 15px;
        }
        ::ng-deep .seed-image-search .ui-inputtext {
            font-size: 1.5em !important;
        }
        .seed-image-progress {
            position: absolute;
            top: 0;
            left: 0;
        }
        .seed-image-results h3 {
            text-align: center;
        }
        ::ng-deep .seed-image-results .ui-panel:hover {
            background: #48ACFF;
            transition: background-color 0.5s;
        }
        ::ng-deep .seed-image-results .ui-dialog {
            width: 75% !important;
        }
    `]
})
export class SeedImagesComponent implements OnInit {
    @Input() url: string;
    images: any[] = [];
    image: any;
    loading: boolean;
    showDialog: Boolean = false;
    currImage: any;

    constructor(
        private http: Http
    ) {}

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        this.loading = false;
        return Promise.reject(error.message || error);
    }

    getImages(): any {
        this.loading = true;
        return this.http.get(`${this.url}/images`)
            .toPromise()
            .then(response => {
                this.loading = false;
                return response.json();
            })
            .catch(this.handleError);
    }

    searchImages(query): any {
        this.loading = true;
        return this.http.get(`${this.url}/images/search/${query}`)
            .toPromise()
            .then(response => {
                this.loading = false;
                return response.json();
            })
            .catch(this.handleError);
    }

    filterImages(event): void {
        if (event.query) {
            this.searchImages(event.query).then(data => {
                this.images = data;
            });
        } else {
            this.getImages().then(data => {
                this.images = data;
            });
        }
    }

    showManifest(image): void {
        this.currImage = image;
        console.log(image);
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
