import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../services/authentification.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PanierService } from '../../services/panier.service';
import { ProduitsService } from '../../services/produits.service';
import { AdminService } from '../../services/admin.service';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
//import { NgForm } from "@angular/forms";
//import { NgFlashMessageService } from "ng-flash-messages";


@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {

  private Precherche = {"categorie":"","materiau":"or","prix1":"0","prix2":"10000"};
  private user: Observable<string>;
  private produit: Object[] = new Array();
  private categories: String[] = new Array;
  private materiaux: String[] = new Array;
  name: string;
  price: string;
  selectedFile: File;
  idRefProduit : string;

  constructor(private route: ActivatedRoute, private authService: AuthentificationService, private produitsService: ProduitsService, private router: Router, private PanierService: PanierService, private adminService : AdminService) { 

  this.idRefProduit = this.route.snapshot.params.id;
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.produitsService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.produitsService.getMateriaux().subscribe(materiaux => {
      this.materiaux = materiaux;
    });
    this.produitsService.getProduitParRef(this.idRefProduit).subscribe(produit => { 
    	this.produit = produit;
    });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
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
