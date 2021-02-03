import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OnInit } from '@angular/core';

/**
 * @author renan.aquino
 *
 * generic services where the methods return the type pass with generic <?>
 */
export class Service<T> implements OnInit {

    retry: number = 0;
    constructor(
        private instanceHttp: HttpClient
        , public _basePath: string
    ) { }

    ngOnInit() { }

    /**
     *
     * @param endpoint
     * @param params
     */
    find<T>(endpoint: string, params?: { [key: string]: any }): Observable<T> {
        return this.instanceHttp.get<T>(`${this._basePath}${endpoint}`, params)
            .pipe(map(response => response as T | any));
    }
    /**
     *
     * @param endpoint
     * @param body
     * @param params
     */
    post(endpoint: string, body: T | any, params?: { [key: string]: any }): Observable<any> {

        return this.instanceHttp.post(`${this._basePath}${endpoint}`, body, params)
    }
    /**
     *
     * @param endpoint
     * @param body
     * @param params
     */
    put(endpoint: string, body: T | any, params?: { [key: string]: any }): Observable<any> {

        return this.instanceHttp.put(`${this._basePath}${endpoint}`, body, params);
    }
}
