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

  constructor(private route: ActivatedRoute, private authService: AuthentificationService, private produitsService: ProduitsService, private router: Router, private PanierService: PanierService) { 
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log("Dans produits.component.ts avec "+params["categorie"]);
      if (params["categorie"] !== undefined) {
        console.log("/produits/"+params["categorie"]);
        this.produitsService.getProduitsParCategorie(params["categorie"]).subscribe(produits => { this.produits = produits;
          //console.log("Produits : "+JSON.stringify(this.produits)); 
        })
      }
      else{
        this.produitsService.getProduits().subscribe(produits => {
          this.produits = produits;
        });
      }
    });
  }
  
  onAddToCart(produit){
    console.log("addtocart");
    var e;
    this.user.subscribe(email=>{e = email;})

    this.PanierService.saveItemPanier({"email":e, "produit":produit}).subscribe(reponse => {
      if (reponse['resultat']){
        this.router.navigate(['/categories']);
      }
    });
  }

}
