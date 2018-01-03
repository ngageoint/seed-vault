import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { Message } from 'primeng/primeng';

import { environment } from '../../environments/environment';

import { StateService } from '../state.service';

@Component({
    selector: 'seed-users',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class UsersComponent implements OnInit {
    env = environment;
    msgs: Message[] = [];
    users: any[] = [];
    loading: boolean;

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

    addUser() {
        console.log('add user');
    }

    deleteUser(user) {
        console.log(user);
    }

    ngOnInit() {
        this.getUsers().then((data: any) => {
            this.users = data;
        }).catch(err => {
            this.handleError(err, 'Unable to get users');
        });
    }
}
