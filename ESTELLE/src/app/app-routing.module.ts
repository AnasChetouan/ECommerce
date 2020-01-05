import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { PanierComponent} from './components/panier/panier.component';
import { NewUserComponent} from './components/new-user/new-user.component';

const routes: Routes = [
  {
    path: 'membres/connexion',
    component: ConnexionComponent
  },
    {
    path: 'membres/newUser',
    component: NewUserComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'produits/:categorie',
    component: ProduitsComponent
  },
  {
    path: 'produits',
    component: ProduitsComponent
  },
  {
    path: 'panier',
    component: PanierComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
