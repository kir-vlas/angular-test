import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
    constructor(private http: HttpClient) { }

    configUrl = 'config.json';

    getConfig() {
        return this.http.get(this.configUrl);
    }
}