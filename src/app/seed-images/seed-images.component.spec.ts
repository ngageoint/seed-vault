import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { SeedImagesComponent } from './seed-images.component';


describe('SeedImagesComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [SeedImagesComponent]
        });
    });

    it('should be created', inject([SeedImagesComponent], (service: SeedImagesComponent) => {
        expect(service).toBeTruthy();
    }));
});
