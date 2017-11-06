import { Injectable } from '@angular/core';

const INITIAL_STATE = {
    images: [],
    scanDate: ''
};

@Injectable()
export class StateService {
    state: any;

    constructor() {
        this.state = INITIAL_STATE;
    }

    public getScanDate(): string {
        return this.state.scanDate;
    }

    public setScanDate(data): void {
        this.state.scanDate = data;
    }

    public getImages(): any[] {
        return this.state.images;
    }

    public setImages(data): void {
        this.state.images = data;
    }
}
