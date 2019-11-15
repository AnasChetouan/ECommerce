import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ProduitService {

    private urlBase: string = 'http://localhost:8888';

    constructor(private http: HttpClient) {}

    getProduits(): Observable<any> {
        return this.http.get(this.urlBase+'produit');
    }

    getProduitsParCategorie(categorie): Observable<any>{
        return this.http.get(this.urlBase+'produit/'+categorie);
    }

    getCategories(): Observable<any> {
        return this.http.get(this.urlBase+'categories');
    }



}