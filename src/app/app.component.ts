import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Message } from 'primeng/primeng';

@Component({
    selector: 'seed-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    authenticated: boolean;
    apiUrl = 'http://ec2-18-217-60-133.us-east-2.compute.amazonaws.com';
    loading: boolean;
    loginIcon = 'fa-sign-in';
    username: string;
    password: string;
    userData: any;
    msgs: Message[] = [];

    constructor(
        private http: Http
    ) {}

    private doLogin(creds) {
        this.loading = true;
        this.loginIcon = 'fa-spinner fa-spin';
        return this.http.post(`${this.apiUrl}/login`, creds)
            .toPromise()
            .then(response => {
                this.loading = false;
                this.loginIcon = 'fa-sign-in';
                this.authenticated = true;
                return response.json();
            })
            .catch(this.handleError);
    }

    login(): any {
        if (!this.authenticated) {
            this.doLogin({ username: this.username, password: this.password }).then(data => {
                this.userData = JSON.stringify(data);
            }).catch(err => {
                const detail = err.statusText.length > 0 ? err.statusText : 'Server error';
                this.msgs = [{severity: 'error', summary: 'Login Failed', detail: detail}];
                this.loading = false;
                this.loginIcon = 'fa-sign-in';
            });
        }
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
