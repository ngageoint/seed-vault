import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { SeedImagesComponent } from './seed-images.component';


describe('SeedImagesComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [SeedImagesComponent]
        });
    });

    it('should be created', inject([SeedImagesComponent], (service: SeedImagesComponent) => {
        expect(service).toBeTruthy();
    }));
});
