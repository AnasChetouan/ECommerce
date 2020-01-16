import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({
      "Access-control-Allow-Methods": "GET,POST",
      "Access-control-Allow-Headers": "Content-type",
      "Content-type": "application/json",
      "Access-control-Allow-Origin": "*"
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
    panierAjouterProduit(data): Observable<any> {
        console.log("le produit de référence : "+data["ref"]+" a été ajouté au panier");
        return this.http.post(this.urlBase+'panier/ajouter', JSON.stringify(data), httpOptions);
    }

    panierSupprimerProduit(data): Observable<any> {
        console.log("le produit de référence : "+data["ref"]+" a été supprimé du panier");
        return this.http.post(this.urlBase+'panier/supprimer', JSON.stringify(data), httpOptions);
    }

    panierAjoutUn(data): Observable<any> {
        console.log("+1 dans le panier du produit de référence : "+data["ref"]);
        return this.http.post(this.urlBase+'panier/ajoutUn', JSON.stringify(data), httpOptions);
    }

    panierRetraitUn(data): Observable<any> {
        console.log("-1 dans le panier du produit de référence : "+data["ref"]);
        return this.http.post(this.urlBase+'panier/retraitUn', JSON.stringify(data), httpOptions);
    }

    validerCommande(email): Observable<any> {
        console.log("Le panier a été vidé ! ");
        return this.http.get(this.urlBase+'panier/validerPanier/'+email);
    }
    
    
}