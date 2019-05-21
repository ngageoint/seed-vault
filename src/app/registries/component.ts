import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/primeng';

import { environment } from '../../environments/environment';

import { StateService } from '../state.service';

@Component({
    selector: 'seed-registries',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class RegistriesComponent implements OnInit {
    env = environment;
    registries: any[] = [];
    registriesIcon = 'fa fa-refresh';
    loading: boolean;
    isScanning: boolean;
    columns: any[];

    constructor(
        private messageService: MessageService,
        private router: Router,
        private http: HttpClient,
        private stateService: StateService
    ) {
        if (!this.stateService.getAuthToken()) {
            this.router.navigate(['/']);
        }
        this.columns = [
            { field: 'Name', header: 'Name' },
            { field: 'Url', header: 'URL' },
            { field: 'Org', header: 'Organization' }
        ];
    }

    private handleError(err: any, summary?: string): void {
        let detailText = '';
        if (err.status === 0) {
            detailText = 'CORS error: Unable to access server';
        } else {
            detailText = err.statusText.length > 0 ? err.statusText : 'Server error';
        }
        this.messageService.add({
            severity: 'error',
            summary: summary || 'Error',
            detail: detailText
        });
        this.loading = false;
    }

    private getRegistries() {
        this.loading = true;
        return this.http.get(`${this.env.siloUrl}/registries`)
            .toPromise()
            .then(response => {
                this.loading = false;
                return Promise.resolve(response);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    scanRegistry(registry?: any) {
        let url = '';
        let detailText = '';
        if (registry) {
            registry.icon = 'fa fa-refresh fa-spin';
            registry.isScanning = true;
            url = `${this.env.siloUrl}/registries/${registry.ID}/scan`;
        } else {
            this.registriesIcon = 'fa fa-refresh fa-spin';
            url = `${this.env.siloUrl}/registries/scan`;
            this.isScanning = true;
        }
        this.http.get(url, {
                headers: { Authorization: `token ${this.stateService.getAuthToken()}` },
                responseType: 'text'
            })
            .toPromise()
            .then(response => {
                console.log(response);
                if (registry) {
                    registry.icon = 'fa fa-refresh';
                    registry.isScanning = false;
                    detailText = `${registry.Name} successfully scanned.`;
                } else {
                    this.registriesIcon = 'fa fa-refresh';
                    detailText = 'All registries successfully scanned.';
                    this.isScanning = false;
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Registry Scan Complete',
                    detail: detailText
                });
            })
            .catch(err => {
                if (registry) {
                    registry.icon = 'fa fa-refresh';
                    registry.isScanning = false;
                    detailText = `Failed to scan ${registry.Name}`;
                } else {
                    this.registriesIcon = 'fa fa-refresh';
                    detailText = 'Failed to scan registries';
                    this.isScanning = false;
                }
                this.handleError(err, detailText);
            });
    }

    ngOnInit() {
        this.getRegistries().then((data: any) => {
            data.forEach(d => {
                d.icon = 'fa fa-refresh';
                d.isScanning = false;
            });
            this.registries = data;
        }).catch(err => {
            this.handleError(err, 'Unable to get registries');
        });
    }
}
