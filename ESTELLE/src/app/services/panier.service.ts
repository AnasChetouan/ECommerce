import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ProduitModel } from "../models/produit.model";

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private baseURL: string = "http://localhost:8888/";
  token: string;

  constructor(
    private http: HttpClient
  ) { }

  //Add items to cart
  saveUserItem(userItem: object): Observable<ProduitModel> {
    this.onLoadToken();
    console.log("objet reçu : ");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });
    return this.http.post<ProduitModel>(this.baseURL+'/membre/item/add', userItem, { headers: headers });
  }

  //Get all items to cart
  getUserItem(id: string): Observable<ProduitModel[]> {
    this.onLoadToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });
    return this.http.get<ProduitModel[]>('${this.uri}/user/item/${id}', { headers: headers });
  }

  //Get token from the local storage
  onLoadToken() {
    this.token = localStorage.getItem('access_token');
  }
}