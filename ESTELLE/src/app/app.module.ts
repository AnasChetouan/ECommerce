import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AuthentificationService } from './authentification.service';
import { ProduitService } from './produit.service'

import { AppComponent } from './app.component';
import { ConnexionComponent } from './connexion/connexionComponent';
import { ProduitsComponent } from './produits/produits.component';
import { CategoriesComponent } from './categories/categories.component';
import { MenuComponent } from './menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    ProduitsComponent,
    CategoriesComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthentificationService, ProduitService],
  bootstrap: [AppComponent]
})
export class AppModule { }
