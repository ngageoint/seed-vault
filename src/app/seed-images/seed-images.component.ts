import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Message } from 'primeng/primeng';
import * as beautify from 'js-beautify';
import * as Clipboard from 'clipboard';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

@Component({
    selector: 'seed-images',
    template: `
        <div class="seed-images">
            <div class="search">
                <p-autoComplete [(ngModel)]="image" (completeMethod)="filterImages($event)" field="Name" styleClass="search-input"
                                placeholder="Search Images" [minLength]="0"></p-autoComplete>
                <div class="loader" *ngIf="loading">
                    <svg version="1.1" id="loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                         x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;"
                         xml:space="preserve">
                        <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,
                                             18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,
                                             14.615H43.935z">
                            <animateTransform attributeType="xml"
                                              attributeName="transform"
                                              type="rotate"
                                              from="0 25 25"
                                              to="360 25 25"
                                              dur="0.6s"
                                              repeatCount="indefinite"/>
                        </path>
                    </svg>
                </div>
            </div>
            <div class="results">
                <h3>{{ images.length }} image(s) found</h3>
                <p-dataGrid [value]="images">
                    <ng-template let-image pTemplate="item">
                        <div class="ui-g-12 ui-md-3">
                            <a (click)="showImageDetails(image)">
                                <p-panel [header]="image.Name" [style]="{'text-align':'center'}">
                                    {{ image.Org }}<br />
                                    {{ image.Registry }}
                                </p-panel>
                            </a>
                        </div>
                    </ng-template>
                </p-dataGrid>
                <p-dialog *ngIf="currImage" [header]="currImage.Name" [(visible)]="showDialog" (onHide)="hideImageDetails()"
                          [responsive]="true" [dismissableMask]="true" [modal]="true" positionTop="40" class="image-details">
                    <h2>{{ currImage.Title }} v{{ currImage.JobVersion }}</h2>
                    {{ currImage.Description }}
                    <div *ngIf="!env.scale && imageManifest" class="code">
                        <button class="copy-btn" pButton type="button" (click)="onCopyClick()" icon="fa-copy" pTooltip="Copy to clipboard"
                                tooltipPosition="left" data-clipboard-target="#manifest"></button>
                        <pre id="manifest"><code>{{ imageManifest }}</code></pre>
                    </div>
                    <p-footer *ngIf="env.scale">
                        <button pButton type="button" (click)="onImportClick()" label="Import" [icon]="importBtnIcon"
                                iconPos="right"></button>
                    </p-footer>
                </p-dialog>
            </div>
        </div>
        <p-growl [(value)]="msgs"></p-growl>
    `,
    styles: [`
        @keyframes spin {
            to {
                transform: rotate(1440deg);
            }
        }
        .seed-images .search {
            position: relative;
            text-align: center;
            width: 50%;
            margin: 0 auto 15px auto;
        }
        ::ng-deep .seed-images .search-input {
            width: 100%;
        }
        ::ng-deep .seed-images .ui-autocomplete-input {
            width: 100%;
        }
        .seed-images .search .loader {
            position: absolute;
            top: 7px;
            right: 20px;
        }
        .seed-images .search .loader svg path, .seed-images .search .loader svg rect {
            fill: #FF6700;
        }
        ::ng-deep .seed-images .search .ui-inputtext {
            font-size: 1.5em !important;
        }
        ::ng-deep .seed-images .search .ui-autocomplete-loader {
            display: none;
        }
        .seed-images .results h3 {
            text-align: center;
            margin: 18px 0;
        }
        .seed-images .image-details h2 {
            font-size: 1.2em;
        }
        .seed-images .image-details .code {
            position: relative;
        }
        .seed-images .image-details .code button {
            position: absolute;
            top: 10px;
            right: 10px;
        }
        .seed-images .image-details .code pre {
            width: 100%;
            height: 500px;
            overflow-x: hidden;
            background: #efefef;
            border: 1px solid #bbb;
            font-size: 0.9em;
        }
        ::ng-deep .seed-images .results .ui-panel:hover {
            background: #48ACFF;
            transition: background-color 0.5s;
        }
        ::ng-deep .seed-images .results .ui-dialog {
            width: 35% !important;
        }
    `]
})
export class SeedImagesComponent implements OnInit {
    @Input() url: string;
    images: any[] = [];
    image: any;
    imageManifest: any;
    loading: boolean;
    showDialog = false;
    currImage: any;
    importBtnIcon = 'fa-cloud-download';
    env = environment;
    clipboard = new Clipboard('.copy-btn');
    msgs: Message[] = [];

    constructor(
        private http: Http
    ) {}

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        this.importBtnIcon = 'fa-cloud-download';
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

    getImageManifest(id): any {
        this.importBtnIcon = 'fa-spinner fa-spin';
        return this.http.get(`${this.url}/images/${id}/manifest`)
            .toPromise()
            .then(response => {
                this.importBtnIcon = 'fa-cloud-download';
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

    showImageDetails(image): void {
        this.currImage = image;
        this.showDialog = true;
        this.getImageManifest(this.currImage.ID).then(data => {
            this.imageManifest = beautify(JSON.stringify(data));
        });
    }

    hideImageDetails(): void {
        this.currImage = null;
    }

    onCopyClick(): void {

    }

    onImportClick(): void {
        // send to algorithm import form
    }

    ngOnInit() {
        this.getImages().then(data => {
            this.images = data;
        });
        this.clipboard.on('success', () => {
            this.msgs = [{severity: 'success', summary: 'Success!', detail: 'Manifest JSON copied to clipboard.'}];
        });
    }
}
