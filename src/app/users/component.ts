import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { Message, SelectItem } from 'primeng/primeng';

import { environment } from '../../environments/environment';

import { StateService } from '../state.service';

@Component({
    selector: 'seed-users',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class UsersComponent implements OnInit {
    @ViewChild('username') userEl: ElementRef;
    env = environment;
    msgs: Message[] = [];
    users: any[] = [];
    user: any;
    loading: boolean;
    displayDialog: boolean;
    roles: SelectItem[] = [];

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

    private getUsers() {
        this.loading = true;
        return this.http.get(`${this.env.siloUrl}/users`)
            .toPromise()
            .then(response => {
                this.loading = false;
                return Promise.resolve(response);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    private saveUser() {
        this.loading = true;
        return this.http.post(
                `${this.env.siloUrl}/user/add`,
                this.user,
                { headers: {'Authorization': this.stateService.getAuthToken() } }
            )
            .toPromise()
            .then(response => {
                this.loading = false;
                return Promise.resolve(response);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    addUser() {
        this.user = {
            username: null,
            role: null
        };
        this.displayDialog = true;
    }

    deleteUser(user) {
        console.log(user);
    }

    save() {
        this.saveUser().then((data: any) => {
            console.log(data);
            this.displayDialog = false;
            this.user = null;
        }).catch(err => {
            this.handleError(err, 'Error creating user');
        });
    }

    cancel() {
        this.displayDialog = false;
        this.user = null;
    }

    initDialog() {
        this.userEl.nativeElement.focus();
    }

    ngOnInit() {
        this.roles.push({
            label: 'Administrator',
            value: 'admin'
        }, {
            label: 'User',
            value: 'user'
        });
        this.getUsers().then((data: any) => {
            this.users = data;
        }).catch(err => {
            this.handleError(err, 'Unable to get users');
        });
    }
}
