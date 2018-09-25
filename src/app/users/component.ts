import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { Message, SelectItem } from 'primeng/primeng';

import { environment } from '../../environments/environment';

import { StateService } from '../state.service';
import { User } from './user.model';

@Component({
    selector: 'seed-users',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class UsersComponent implements OnInit {
    @ViewChild('username') userEl: ElementRef;
    env = environment;
    msgs: Message[] = [];
    users: any;
    user: User;
    loading: boolean;
    displayDialog: boolean;
    roles: SelectItem[] = [];
    saveIcon = 'fa fa-check';
    passwordVerify: string;

    constructor(
        private router: Router,
        private http: HttpClient,
        private stateService: StateService
    ) {
        if (!this.stateService.getAuthToken()) {
            this.router.navigate(['/']);
        }
        this.roles.push({
            label: 'Administrator',
            value: 'admin'
        }, {
            label: 'User',
            value: 'user'
        });
        this.user = new User(this.roles[0].value);
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
        this.saveIcon = 'fa fa-cog fa-spin';
        return this.http.post(
                `${this.env.siloUrl}/users/add`,
                this.user,
                { headers: {'Authorization': `token ${this.stateService.getAuthToken()}` } }
            )
            .toPromise()
            .then(response => {
                this.loading = false;
                this.saveIcon = 'fa fa-check';
                return Promise.resolve(response);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    private deleteUser(id: number) {
        this.loading = true;
        return this.http.delete(
                `${this.env.siloUrl}/users/delete/${id}`,
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
        this.displayDialog = true;
    }

    delete(user: User) {
        user.icon = 'fa fa-cog fa-spin';
        user.isRemoving = true;
        this.deleteUser(user.ID).then(() => {
            const users = [...this.users];
            users.splice(users.indexOf(user), 1);
            this.users = users;
        }).catch(err => {
            user.icon = 'fa fa-remove';
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
                    icon: 'fa fa-remove',
                    isRemoving: false
                });
                this.users = users;
                this.displayDialog = false;
                this.user = new User(this.roles[0].value);
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
        this.user = new User(this.roles[0].value);
    }

    initDialog() {
        // wrap in a setTimeout to trigger another change detection :/
        // https://github.com/angular/angular/issues/6005
        setTimeout(() => {
            this.userEl.nativeElement.focus();
        });
    }

    ngOnInit() {
        this.getUsers().then((data: any) => {
            data.forEach(d => {
                d.icon = 'fa fa-remove';
                d.isRemoving = false;
            });
            this.users = User.transformer(data);
        }).catch(err => {
            this.handleError(err, 'Unable to get users');
        });
    }
}
