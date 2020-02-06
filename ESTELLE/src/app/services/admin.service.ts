import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "Content-type",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    })
};

@Injectable({
    providedIn: 'root'
})

export class AdminService {
    private user:Subject<string> = new BehaviorSubject<string>(undefined);
    private urlBase: string = 'http://localhost:8888/';

    constructor(private http: HttpClient) {}

    getProduits(): Observable<any> {
        return this.http.get(this.urlBase+'produits');
    }

    getCategories(): Observable<any> {
        return this.http.get(this.urlBase+'categories');
    }

    getMateriaux(): Observable<any> {
        return this.http.get(this.urlBase+'materiaux');
    }

    getProduitParRef(ref): Observable<any> {
        return this.http.get(this.urlBase+'produits/'+ref);
    }

    getProduitsParCategorie(categorie): Observable<any>{
        return this.http.get(this.urlBase+'produits/categories/'+categorie);
    }

    uploadImage(image: File): Observable<any> {
    	const formData = new FormData();
    	formData.append('image',image);
    	return this.http.post(this.urlBase+'admin/upload', formData);
    }

    addProduit(produit, image){
    	const uploadData = new FormData();
  		uploadData.append('myFile', image, image.name);
  		this.http.post(this.urlBase+'admin/upload', uploadData, {
	    	reportProgress: true,
    		observe: 'events'
  			})
    	.subscribe(event => {
      		console.log(event); // handle event here
    		});


    }



    getProduitParRecherche(produit): Observable<any> {
        //console.log("myProduct" + JSON.stringify(produit));
        //let product = JSON.parse(produit);
        console.log(produit.categorie);
        console.log(produit.materiau);
        console.log(produit.prix1);
        console.log(produit.prix2);
        //return null;
        return this.http.get(this.urlBase+'produits/'+produit.categorie+'/'+produit.materiau+'/'+0+'/'+produit.prix2);
    }

    
}