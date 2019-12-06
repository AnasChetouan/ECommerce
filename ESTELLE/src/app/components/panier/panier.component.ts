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
  private panier: Subject<String> = new BehaviorSubject<string>(undefined);
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
      this.panier.next(JSON.stringify(value));
      //console.log("panier dans sub:"+JSON.stringify(this.panier));
      //console.log("value dans sub:"+JSON.stringify(value));
      this.decomposerPanier()
    })
  }

  decomposerPanier(){
    console.log("panier : "+ JSON.stringify(this.panier));
    console.log("on test : "+this.panier["_value"]["contenu"]);
    console.log("on test : "+this.panier["_value"]);
    
    let value = this.panier["_value"];
    let contenu = value["contenue"];
    console.log("on value : "+value);
    console.log("on contenu : "+contenu);

    for(let p of this.panier["_value"["contenu"]]){
      console.log("id:"+p["id"]);
      this.produits.push(this.produitService.getProduit(p["id"]));
    }
  }


  /*onDeleteItem(id: string) {
    if (confirm(`Do you want to delete this item...?`)) {
      this.userItemService.deleteItem(id).subscribe(data => {
        if (data.success) {
          this.flashMessage.showFlashMessage({
            messages: ["Item deleted from your cart, Let's add one!"],
            dismissible: true,
            timeout: 4000,
            type: 'success'
          });
        }
        this.router.navigate(['items']);
      });
    } else {
      this.router.navigate(['user/item', this.id]);
    }
  }*/

}
