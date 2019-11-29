import { Component, OnInit } from '@angular/core';
import { ProduitModel } from "../../models/produit.model";
import { Router } from "@angular/router";
import { PanierService } from "../../services/panier.service";

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  id: string;
  userItem: ProduitModel[];
  constructor(
    private userItemService: PanierService,
    private router: Router,
   // private flashMessage: NgFlashMessageService
  ) { }

  ngOnInit() {
    this.id = this.router.url.split('/')[3];
    this.fetchUserItems();
  }

  fetchUserItems() {
    this.userItemService.getUserItem(this.id).subscribe(data => {
      this.userItem = data;
    });
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
