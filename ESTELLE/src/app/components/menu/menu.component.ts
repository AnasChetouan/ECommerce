import { Component, OnInit, Inject } from '@angular/core';
import { AuthentificationService } from '../../services/authentification.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    private user: Observable<string>;
    
    constructor(private authService: AuthentificationService, private router: Router,
       @Inject(LOCAL_STORAGE) private storage : WebStorageService ) {
        this.user = this.authService.getUser();
        
    }
ngOnInit() {
    if(this.storage.get("connect")){
        this.authService.connect(this.storage.get("connect"));
    } 
    this.router.navigate(['/categories']);
    
}

deconnexion() {
    this.storage.remove("connect");
    this.authService.disconnect();
    this.router.navigate(['/categories']);  
}

admin(){
    return this.storage.get('admin');
}  

}