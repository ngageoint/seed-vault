import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    constructor(
        private http: HttpClient
    ) {}

    loadAppConfig(path: string): Promise<any> {
        return this.http.get(path)
            .toPromise()
            .then((data: any) => {
                // loop over all keys in the appconfig.json file
                Object.keys(data).forEach(key => {
                    // try to parse the values as json
                    let value = data[key];
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        // ignore, not valid json value so default to original
                    }

                    // override the local env with the appConfig.json file value
                    environment[key] = value;
                });
            });
    }
}
