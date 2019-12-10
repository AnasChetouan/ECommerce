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
  private produits: Object[] = new Array;
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
    let e;
    this.user.subscribe(email=>{e = email;});
    console.log("email envoyé : "+e);

    this.panierService.getPanier(e).subscribe(value => {
      this.panier = value;
      this.decomposerPanier()
    })
  }

  decomposerPanier(){
    var value = this.panier[0];
    console.log("on value : "+value);
    var contenu = JSON.stringify(value["contenu"]);
    console.log("on contenu : "+contenu);

    for(let p of contenu){
      console.log("p :"+p);
      var id = JSON.stringify(p["id"]);
      console.log("id:"+id);
      this.produits.push(this.produitService.getProduit(id));
    }
  }

}
