import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})

export class PanierService {

    private urlBase: string = 'http://localhost:8888/';

    constructor(private http: HttpClient) {}

    getPanier(email): Observable<any> {
        return this.http.get(this.urlBase+'panier/'+email);
    }
    
}