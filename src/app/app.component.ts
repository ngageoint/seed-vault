import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem, Message, OverlayPanel } from 'primeng/primeng';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { environment } from '../environments/environment';
import { StateService } from './state.service';

@Component({
    selector: 'seed-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('user') inputEl: ElementRef;
    authenticated: boolean;
    apiUrl = 'http://ec2-18-217-60-133.us-east-2.compute.amazonaws.com';
    loading: boolean;
    loginIcon = 'fa-sign-in';
    username: string;
    password: string;
    remember = false;
    authToken: any;
    msgs: Message[] = [];
    items: MenuItem[] = [
        { label: 'Registries', icon: 'fa-circle', routerLink: ['/registries'] },
        { label: 'Users', icon: 'fa-user', routerLink: ['/users'] },
        { label: 'Logout', icon: 'fa-sign-out', command: () => {
                this.logout();
            }
        }
    ];
    env = environment;

    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        private stateService: StateService,
        private idle: Idle,
        private keepalive: Keepalive
    ) {}

    private handleError(err: any, summary?: string): void {
        let detail = '';
        if (err.status === 0) {
            detail = 'CORS error: Unable to access server';
        } else {
            detail = err.statusText.length > 0 ? err.statusText : 'Server error';
        }
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: summary || 'Error', detail: detail });
        this.loading = false;
        this.loginIcon = 'fa-sign-in';
    }

    private doLogin(creds) {
        this.loading = true;
        this.loginIcon = 'fa-spinner fa-spin';
        return this.http.post(`${this.apiUrl}/login`, creds)
            .toPromise()
            .then(response => {
                this.loading = false;
                this.loginIcon = 'fa-sign-in';
                this.authenticated = true;
                return Promise.resolve(response);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    private reset(): void {
        this.idle.watch();
    }

    initOverlayPanel(op: OverlayPanel): void {
        if (!this.authenticated) {
            this.inputEl.nativeElement.focus();
        }
    }

    onKeyPress(event: any): void {
        if (event.charCode === 13) {
            // login when the enter key is pressed
            this.login();
        }
    }

    login(): any {
        if (!this.authenticated) {
            this.doLogin({ username: this.username, password: this.password }).then((data: any) => {
                this.stateService.setAuthToken(data.token);
                this.cookieService.set('SeedVaultToken', data.token);
                this.cookieService.set('SeedVaultRemember', this.remember.toString());
                if (!this.remember) {
                    this.reset();
                }
            }).catch(err => {
                this.handleError(err, 'Login Failed');
            });
        }
    }

    logout(): void {
        if (this.cookieService.check('SeedVaultToken')) {
            this.cookieService.delete('SeedVaultToken');
        }
        if (this.cookieService.check('SeedVaultRemember')) {
            this.cookieService.delete('SeedVaultRemember');
        }
        this.stateService.setAuthToken(null);
        this.authenticated = false;
    }

    ngOnInit() {
        // attempt to authenticate
        this.authToken = this.stateService.getAuthToken();
        if (this.authToken) {
            this.authenticated = true;
        } else {
            // try and retrieve login from cookie
            this.authToken = this.cookieService.get('SeedVaultToken');
            this.remember = this.cookieService.get('SeedVaultRemember') === 'true';
            if (this.authToken) {
                this.stateService.setAuthToken(this.authToken);
                this.authenticated = true;
            }
        }
        // set up process to check for user activity
        this.idle.setIdle(600);
        this.idle.setTimeout(30);
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onTimeout.subscribe(() => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Alert', detail: `Your session has expired` });
            if (this.authenticated && !this.remember) {
                // user is authenticated and does not want to be remembered, so log out
                this.logout();
            }
        });
        this.idle.onIdleStart.subscribe(() => {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Warning', detail: `Your session will expire in 30 seconds` });
        });

        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);

        if (this.authenticated && !this.remember) {
            this.reset();
        }
    }
}
