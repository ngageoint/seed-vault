import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/primeng';

import { environment } from '../../environments/environment';

import { StateService } from '../state.service';

@Component({
    selector: 'seed-registries',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class RegistriesComponent implements OnInit {
    env = environment;
    msgs: Message[] = [];
    registries: any[] = [];
    registriesIcon = 'fa-refresh';
    loading: boolean;
    isScanning: boolean;

    constructor(
        private router: Router,
        private http: HttpClient,
        private stateService: StateService
    ) {
        if (!this.stateService.getAuthToken()) {
            this.router.navigate(['/']);
        }
    }

    private handleError(err: any, summary?: string): void {
        let detail = '';
        if (err.status === 0) {
            detail = 'CORS error: Unable to access server';
        } else {
            detail = err.statusText.length > 0 ? err.statusText : 'Server error';
        }
        this.msgs = [];
        this.msgs.push({
            severity: 'error',
            summary: summary || 'Error',
            detail: detail
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
        let detail = '';
        if (registry) {
            registry.icon = 'fa-refresh fa-spin';
            registry.isScanning = true;
            url = `${this.env.siloUrl}/registry/${registry.ID}/scan`;
        } else {
            this.registriesIcon = 'fa-refresh fa-spin';
            url = `${this.env.siloUrl}/registries/scan`;
            this.isScanning = true;
        }
        this.http.get(url, {
                headers: {'Authorization': `token ${this.stateService.getAuthToken()}` },
                responseType: 'text'
            })
            .toPromise()
            .then(response => {
                console.log(response);
                if (registry) {
                    registry.icon = 'fa-refresh';
                    registry.isScanning = false;
                    detail = `${registry.Name} successfully scanned.`;
                } else {
                    this.registriesIcon = 'fa-refresh';
                    detail = 'All registries successfully scanned.';
                    this.isScanning = false;
                }
                this.msgs = [];
                this.msgs.push({
                    severity: 'success',
                    summary: 'Registry Scan Complete',
                    detail: detail
                });
            })
            .catch(err => {
                if (registry) {
                    registry.icon = 'fa-refresh';
                    registry.isScanning = false;
                    detail = `Failed to scan ${registry.Name}`;
                } else {
                    this.registriesIcon = 'fa-refresh';
                    detail = 'Failed to scan registries';
                    this.isScanning = false;
                }
                this.handleError(err, detail);
            });
    }

    ngOnInit() {
        this.getRegistries().then((data: any) => {
            data.forEach(d => {
                d.icon = 'fa-refresh';
                d.isScanning = false;
            });
            this.registries = data;
        }).catch(err => {
            this.handleError(err, 'Unable to get registries');
        });
    }
}
