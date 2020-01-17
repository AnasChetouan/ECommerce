import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../services/authentification.service'
import { StorageServiceModule, WebStorageService, LOCAL_STORAGE }  from 'angular-webstorage-service'

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})

export class ConnexionComponent {

  private utilisateur = {"email":"", "password":"", "admin":""};
  private message: string = "";

  constructor(private authService: AuthentificationService, private router: Router,
   @Inject(LOCAL_STORAGE) private storage: WebStorageService ) { }

  onSubmit() {
    this.authService.verificationConnexion(this.utilisateur).subscribe(reponse => {
      this.message = reponse['message'];
      if (reponse['resultat']){
        if(reponse['resultat'] == 1){
          this.storage.set("connect",this.utilisateur.email);
          this.authService.connect(this.utilisateur.email);
          this.storage.set("admin",this.utilisateur.admin);
          this.router.navigate(['/categories']);
        }
        else {

        }
      }
      //setTimeout( () => { this.router.navigate(['/categories']); }, 1000);
    });
  }
}
