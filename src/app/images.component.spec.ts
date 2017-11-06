import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ImagesComponent } from './images.component';


describe('ImagesComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [ImagesComponent]
        });
    });

    it('should be created', inject([ImagesComponent], (service: ImagesComponent) => {
        expect(service).toBeTruthy();
    }));
});
