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
    saveIcon = 'fa-check';
    passwordVerify: string;

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
        this.saveIcon = 'fa-cog fa-spin';
        return this.http.post(
                `${this.env.siloUrl}/user/add`,
                this.user,
                { headers: {'Authorization': `token ${this.stateService.getAuthToken()}` } }
            )
            .toPromise()
            .then(response => {
                this.loading = false;
                this.saveIcon = 'fa-check';
                return Promise.resolve(response);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    private deleteUser(id: number) {
        this.loading = true;
        return this.http.delete(
                `${this.env.siloUrl}/user/delete/${id}`,
                { headers: {'Authorization': `token ${this.stateService.getAuthToken()}` } }
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
            password: null,
            role: this.roles[0].value
        };
        this.displayDialog = true;
    }

    delete(user: any) {
        user.icon = 'fa-cog fa-spin';
        user.isRemoving = true;
        this.deleteUser(user.ID).then(() => {
            const users = [...this.users];
            users.splice(users.indexOf(user), 1);
            this.users = users;
        }).catch(err => {
            user.icon = 'fa-remove';
            user.isRemoving = false;
            this.handleError(err, 'Error deleting user');
        });
    }

    save() {
        if (this.user.password === this.passwordVerify) {
            this.saveUser().then((data: any) => {
                const users = [...this.users];
                users.push({
                    ID: data.ID,
                    username: data.username,
                    role: data.role,
                    icon: 'fa-remove',
                    isRemoving: false
                });
                this.users = users;
                this.displayDialog = false;
                this.user = null;
                this.msgs = [];
                this.msgs.push({
                    severity: 'success',
                    summary: 'Success',
                    detail: `${data.username} successfully added`
                });
            }).catch(err => {
                this.handleError(err, 'Error creating user');
            });
        } else {
            this.msgs = [];
            this.msgs.push({
                severity: 'error',
                summary: 'Password verification failed',
                detail: `Make sure the same value is entered in both fields.`
            });
        }
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
            data.forEach(d => {
                d.icon = 'fa-remove';
                d.isRemoving = false;
            });
            this.users = data;
        }).catch(err => {
            this.handleError(err, 'Unable to get users');
        });
    }
}
