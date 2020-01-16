import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { PanierService } from "../../services/panier.service";
//import { ProduitsService } from "../../services/produits.service";
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  id: string;
  private panier: Object[];
  private dataProduitPanier = {"email":"", "ref":""};
  private user:Subject<string> = new BehaviorSubject<string>(undefined);
  private email: string;

  constructor(
    private panierService: PanierService,
    private router: Router,
    private authService: AuthentificationService
    //private produitService: ProduitsService
    //private flashMessage: NgFlashMessageService
   ) {
    this.user = this.authService.getUser();
    this.user.subscribe(email=>{this.email = email;});
    this.dataProduitPanier["email"] = this.email;
   }

  ngOnInit() {
    this.panierService.getPanier(this.email).subscribe(value => {
     this.panier = value;
    });
  }

  moinsUn(ref){ 
  this.dataProduitPanier["ref"] = ref;
  //console.log("t:"+JSON.stringify(this.dataProduitPanier));
    this.panierService.panierRetraitUn(this.dataProduitPanier).subscribe(value => {
      // On reçoit le nouveau panier, mis à jour
      this.panier = value;
    });
  }

  plusUn(ref){
    // On récupère la référence du produit à modifier
    this.dataProduitPanier["ref"] = ref;
    this.panierService.panierAjoutUn(this.dataProduitPanier).subscribe(value => {
      // On reçoit le nouveau panier, mis à jour
      this.panier = value;
    });
  }

  supprimerProduit(ref){
    // On récupère la référence du produit à modifier
    this.dataProduitPanier["ref"] = ref;
    this.panierService.panierSupprimerProduit(this.dataProduitPanier).subscribe(value => {
      // On reçoit le nouveau panier, mis à jour
      this.panier = value;
      this.router.navigate(['/produits']);
    });
  }

  sommePrix() { 
    var somme = 0;
    for(let i=0;i<this.panier.length;i++){
      let prix = this.panier[i]['prix'];
      let quantite = this.panier[i]['quantite'];
      somme += prix * quantite;
    }

    return somme; 
  }

  validerCommande(){
    this.panierService.validerCommande(this.email).subscribe(value => {
      // On reçoit le nouveau panier, mis à jour
      this.panier = value;
      this.router.navigate(['/produits']);
    });
  }

}
