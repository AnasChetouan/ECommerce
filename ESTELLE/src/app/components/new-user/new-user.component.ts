import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { newUserService } from '../../services/newUser.service'
import { AuthentificationService } from '../../services/authentification.service'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})


export class NewUserComponent {
	
  private utilisateur = {"nom":"", "prenom":"","email":"", "password1":"", "password2":""};
  private message: string = "";

 constructor(private newUser: newUserService, private router: Router, private authService: AuthentificationService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.newUser.saveUser(this.utilisateur).subscribe(reponse => {
      this.message = reponse['message'];
      if (reponse['resultat']){
        this.authService.connect(this.utilisateur.email);
        this.newUser.connect(this.utilisateur.email);

        this.router.navigate(['/categories']);
      }
      setTimeout( () => { this.router.navigate(['/categories']); }, 1000);
    });
  }
}
