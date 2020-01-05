import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { PanierService } from "../../services/panier.service";
import { ProduitsService } from "../../services/produits.service";
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
  private panier: Object[] = new Array();
  //private panier: String = "";
  private produits: Object[] = new Array();
  private contenu: Object[] = new Array();
  private user:Subject<string> = new BehaviorSubject<string>(undefined);

  constructor(
    private panierService: PanierService,
    private router: Router,
    private authService: AuthentificationService,
    private produitService: ProduitsService
   // private flashMessage: NgFlashMessageService
   ) {
    this.user = this.authService.getUser();
   }

  ngOnInit() {
    var e;
    this.user.subscribe(email=>{e = email;});
    console.log("email envoyé : "+e);

    this.panierService.getPanier(e).subscribe(value => {
      this.panier = value;
      this.decomposerPanier()
    })
  }

  decomposerPanier(){
    if (this.panier[0] != null){
      var value = this.panier[0];
      this.contenu = value["contenu"];
      //console.log("on contenu : "+JSON.stringify(this.contenu));

      for(let p of this.contenu){
       // console.log("p :"+JSON.stringify(p));
        var ref = p["ref"];
       // console.log("ref:"+ref);
        var produit;
        this.produitService.getProduitParRef(ref).subscribe(x => { produit = x[0]; 
          //console.log("Produit affiché : "+JSON.stringify(produit));
          this.produits.push(produit);
          //console.log("Produits : "+JSON.stringify(this.produits));
        })

      }
    }
  }

}
