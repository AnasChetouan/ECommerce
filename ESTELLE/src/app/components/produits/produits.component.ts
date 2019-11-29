import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../services/authentification.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PanierService } from '../../services/panier.service';
import { ProduitsService } from '../../services/produits.service';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
//import { NgForm } from "@angular/forms";
//import { NgFlashMessageService } from "ng-flash-messages";

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {

  private user: Observable<string>;
  private produits: Object[] = new Array();
  name: string;
  price: string;

  constructor(private route: ActivatedRoute, private authService: AuthentificationService, private produitsServices: ProduitsService, private router: Router, private PanierService: PanierService) { 
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log("Dans produits.component.ts avec "+params["categorie"]);
      if (params["categorie"] !== undefined) {
        console.log("/produits/"+params["categorie"]);
        this.produitsServices.getProduitsParCategorie(params["categorie"]).subscribe(produits => { this.produits = produits; })
      }
      else{
        this.produitsServices.getProduits().subscribe(produits => {
          this.produits = produits;
        });
      }
    });
  }

  onAddToCart(name: string, price: string) {
    this.name = name;
    this.price = price;
    let userItem = {
      name: this.name,
      price: this.price,
    };

    this.PanierService.saveUserItem(userItem).subscribe(data => {
      console.log("entrée saveUserItem");
      if (data) {
        /*this.flashMessage.showFlashMessage({
          messages: ['Item added to your cart!'],
          dismissible: true,
          timeout: 4000,
          type: 'success'*/
          console.log("l'objet a été ajouté au panier : "+userItem);
        this.router.navigate(['panier']);
        return true;
      }
    });

  }

}
