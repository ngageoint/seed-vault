import { Injectable } from '@angular/core';

const INITIAL_STATE = {
};

@Injectable()
export class StateService {
    state: any;

    constructor() {
        this.state = INITIAL_STATE;
    }

    public getAuthToken(): any {
        return this.state.authToken;
    }

    public setAuthToken(data): void {
        this.state.authToken = data;
    }
}
