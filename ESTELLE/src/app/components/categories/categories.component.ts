import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../services/authentification.service';
import { Router } from '@angular/router';
import { ProduitsService } from '../../services/produits.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  private user : Observable<string>;
  private categories: String[] = new Array;
  private produits: Object[] = new Array();
  
  constructor(private router: Router,
              private authService : AuthentificationService,
              private produitsService : ProduitsService) {
          this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.produitsService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.produitsService.getProduitsIndex().subscribe(produits => {
          this.produits = produits;
    });
  }

  produitsParMateriaux(materiaux){
    this.router.navigate(['/produits', materiaux]);
  }


  produitsParCategorie(categorie){
    this.router.navigate(['/produits', categorie]);
  }

}
