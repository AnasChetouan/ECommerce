import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../services/authentification.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PanierService } from '../../services/panier.service';
import { ProduitsService } from '../../services/produits.service';
import { AdminService } from '../../services/admin.service';
import { Router } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import { NgForm } from "@angular/forms";
//import { NgFlashMessageService } from "ng-flash-messages";

class ImageSnippet {
	constructor(public src: string, public file: File){}
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private Precherche = {"id":"0","nom":"","categorie":"","materiau1":"","materiau2":"","prix":"0","description":""};
  private user: Observable<string>;
  private produits: Object[] = new Array();
  private categories: String[] = new Array;
  private materiaux: String[] = new Array;
  name: string;
  price: string;
  selectedFile: ImageSnippet;

  fileData: File = null;
	previewUrl:any = null;
	fileUploadProgress: string = null;
	uploadedFilePath: string = null;

  constructor(private route: ActivatedRoute, private authService: AuthentificationService, private produitsService: ProduitsService, private router: Router, private PanierService: PanierService, private adminService: AdminService,private http: HttpClient) { 
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.produitsService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.produitsService.getMateriaux().subscribe(materiaux => {
      this.materiaux = materiaux;
    });
    this.route.params.subscribe((params: Params) => {
      console.log("Dans produits.component.ts avec "+params["categorie"]);
      if (params["categorie"] !== undefined) {
        console.log("/produits/"+params["categorie"]);
        this.produitsService.getProduitsParCategorie(params["categorie"]).subscribe(produits => { this.produits = produits;
          //console.log("Produits : "+JSON.stringify(this.produits)); 
        })
      }
      else{
        this.produitsService.getProduits().subscribe(produits => {
          this.produits = produits;
        });
      }
    });
  }

 
fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
}
 
preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
}




onSubmit() {
	//this.http.post('http://localhost:8888/produit/add/',JSON.stringify(this.Precherche));

	var nom = this.Precherche.nom;
	var cat = this.Precherche.categorie;
	var mat1 = this.Precherche.materiau1;
	var prix = this.Precherche.prix;
	var desc = this.Precherche.description;
  var mat2 = this.Precherche.materiau2;

    const formData = new FormData();
      formData.append('file', this.fileData);
      formData.append('infos', JSON.stringify(this.Precherche));
      console.log(mat2);
      if(mat2 == ""){
        this.http.post('http://localhost:8888/admin/upload/'+this.produits.length+1+"/"+nom+"/"+cat+"/"+mat1+"/"+prix+"/"+desc, formData)
        .subscribe(res => {
          console.log(res);
          //this.uploadedFilePath = res.data.filePath;
          alert('success');
        });
      }
      else{
        this.http.post('http://localhost:8888/admin/upload/'+this.produits.length+1+"/"+nom+"/"+cat+"/"+mat1+"/"+mat2+"/"+prix+"/"+desc, formData)
        .subscribe(res => {
          console.log(res);
          //this.uploadedFilePath = res.data.filePath;
          alert('success');
        });
      }

	}

  

}

