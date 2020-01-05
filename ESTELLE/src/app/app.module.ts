import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ProduitsService } from './services/produits.service';
import { newUserService } from './services/newUser.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './components/menu/menu.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { HttpClient } from 'selenium-webdriver/http';
import { PanierComponent } from './components/panier/panier.component';
import { NewUserComponent } from './components/new-user/new-user.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    MenuComponent,
    ConnexionComponent,
    ProduitsComponent,
    PanierComponent,
    NewUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [ProduitsService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
