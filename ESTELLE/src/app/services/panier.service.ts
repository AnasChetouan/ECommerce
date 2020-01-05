import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "Content-type",
        "Content-Type": "application/add",
        "Access-Control-Allow-Origin": "*"
    })
};

@Injectable({providedIn: 'root'})

export class PanierService {

    private urlBase: string = 'http://localhost:8888/';

    constructor(private http: HttpClient) {}

    getPanier(email): Observable<any> {
        return this.http.get(this.urlBase+'panier/get/'+email);
    }

    //Add items to cart
    saveItemPanier(produit): Observable<any> {
        console.log("saveUserItem");
        return this.http.post(this.urlBase+'panier/ajouter', produit, httpOptions);
    }
    
}