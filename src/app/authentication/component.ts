import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { CookieService } from 'ngx-cookie-service';
import { MenuItem, Message, OverlayPanel } from 'primeng/primeng';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { StateService } from '../state.service';

@Component({
    selector: 'seed-authentication',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class AuthenticationComponent implements OnInit {
    @ViewChild('user') userEl: ElementRef;
    @ViewChild('op') opEl: OverlayPanel;
    env = environment;
    loading: boolean;
    authenticated: boolean;
    loginIcon = 'fa fa-sign-in';
    username: string;
    password: string;
    remember = false;
    authToken: any;
    msgs: Message[] = [];
    items: MenuItem[] = [
        {
            label: 'Search', icon: 'fa fa-search', routerLink: ['/'], command: () => { this.opEl.hide(); },
            routerLinkActiveOptions: { exact: true }
        },
        { label: 'Registries', icon: 'fa fa-circle', routerLink: ['/registries'], command: () => { this.opEl.hide(); } },
        { label: 'Users', icon: 'fa fa-user', routerLink: ['/users'], command: () => { this.opEl.hide(); } },
        { label: 'Logout', icon: 'fa fa-sign-out', command: () => { this.logout(); } }
    ];

    constructor(
        private http: HttpClient,
        private router: Router,
        private cookieService: CookieService,
        private stateService: StateService,
        private idle: Idle,
        private keepalive: Keepalive
    ) {}

    private handleError(err: any, summary?: string): void {
        let detailText = '';
        if (err.status === 0) {
            detailText = 'CORS error: Unable to access server';
        } else {
            detailText = err.statusText.length > 0 ? err.statusText : 'Server error';
        }
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: summary || 'Error', detail: detailText });
        this.loading = false;
        this.loginIcon = 'fa fa-sign-in';
    }

    private doLogin(creds) {
        this.loading = true;
        this.loginIcon = 'fa fa-spinner fa-spin';
        return this.http.post(`${this.env.siloUrl}/login`, creds)
            .toPromise()
            .then(response => {
                this.loading = false;
                this.loginIcon = 'fa fa-sign-in';
                this.authenticated = true;
                return Promise.resolve(response);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    initOverlayPanel(): void {
        if (!this.authenticated) {
            setTimeout(() => {
                this.userEl.nativeElement.focus();
            });
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
                this.password = null;
                this.stateService.setAuthToken(data.token);
                if (this.remember) {
                    this.cookieService.set('SeedVaultToken', data.token);
                } else {
                    this.idle.watch();
                }
                this.opEl.hide();
            }).catch(err => {
                this.handleError(err, 'Login Failed');
                this.password = null;
            });
        }
    }

    logout(): void {
        if (this.cookieService.check('SeedVaultToken')) {
            this.cookieService.delete('SeedVaultToken');
        }
        this.stateService.setAuthToken(null);
        this.authenticated = false;
        this.router.navigate(['/']);
    }

    ngOnInit() {
        // attempt to authenticate
        this.authToken = this.stateService.getAuthToken();
        if (this.authToken) {
            this.authenticated = true;
        } else {
            // try and retrieve login from cookie
            this.authToken = this.cookieService.get('SeedVaultToken');
            if (this.authToken) {
                this.stateService.setAuthToken(this.authToken);
                this.authenticated = true;
            } else {
                console.log('anonymous user');
            }
        }
        // set up process to check for user activity
        this.idle.setIdle(5); // let user sit idle for 15 minutes
        this.idle.setTimeout(5); // after 15 minutes, wait 30 seconds before timeout
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onTimeout.subscribe(() => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Alert', detail: `Your session has expired` });
            if (this.authenticated && !this.remember) {
                // user is authenticated and does not want to be remembered, so log out
                this.logout();
            }
            this.router.navigate(['/']);
        });

        this.idle.onIdleStart.subscribe(() => {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Warning', detail: `Your session will expire in 30 seconds` });
        });

        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);

        if (this.authenticated && !this.remember && !this.cookieService.check('SeedVaultToken')) {
            this.idle.watch();
        }
    }
}
