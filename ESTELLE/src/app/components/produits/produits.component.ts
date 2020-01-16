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

  private Precherche = {"categorie":"","materiau":"or","prix1":"0","prix2":"10000"};
  private user: Observable<string>;
  private produits: Object[] = new Array();
  private categories: String[] = new Array;
  private materiaux: String[] = new Array;
  name: string;
  price: string;

  constructor(private route: ActivatedRoute, private authService: AuthentificationService, private produitsService: ProduitsService, private router: Router, private PanierService: PanierService) { 
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.produitsService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.produitsService.getMateriaux().subscribe(materiaux => {
      this.materiaux = materiaux;
    });
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

  onSubmit() {
  this.produitsService.getProduitParRecherche(this.Precherche).subscribe(produits => {
        this.produits = produits;
        this.router.navigate(['/produits']);
      });
  }
 /*  this.route.params.subscribe((params: Params) => {
    console.log("Mesparams" + params);
    console.log("/produits/"+params["categorie"]);
    let categorie = params["categorie"];
    let materiau = params["materiau"];
    let prixMax = params["PrixMax"];

    console.log("categorie" + categorie);
    console.log(materiau);
    console.log(prixMax); 

    
    });
  }*/
  
  onAddToCart(produit){
    var e;
    this.user.subscribe(email=>{e = email;})

    this.PanierService.panierAjouterProduit({"email":e, "ref":produit}).subscribe(reponse => {
      if (reponse['resultat']){
        console.log("Message reçu : "+reponse["message"]);
        this.router.navigate(['/panier']);
      }
    });
  }

}
