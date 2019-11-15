import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification.service';
import { Router } from '@angular/router';
import { ProduitService } from '../produits.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  private user : Observable<string>;
  private categories: String[] = new Array;
  constructor(private router: Router,
              private authService : AuthentificationService,
              private produitService : ProduitService) {
          this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.produitService.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  produitsParCategorie(categorie){
    this.router.navigate(['/produits', categorie]);
  }

}
