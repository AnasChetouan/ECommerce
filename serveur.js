const express = require ('express');
const Formidable = require('formidable');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
//app.use(require("cors")); // méthode alternative

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017";
const router = express.Router();

app.listen(8888);



MongoClient.connect(url, {useUnifiedTopology: true,useNewUrlParser: true}, (err, client) => {
    let db = client.db("ESTELLE");

    /* Liste des produits */
    app.get("/produits", (req, res) => {
        console.log("/produits");
        try{
            db.collection("produits").find().toArray((err, documents) => {
                res.end(JSON.stringify(documents));
            });
        } catch(e) {
            console.log("Erreur sur /produits : " + e);
            res.end(JSON.stringify([]));
        }
    });

    app.get("/produits/categories/:categorie", (req, res) => {
        let categorie = req.params.categorie;
        console.log("/produits/"+categorie);
        try{
            db.collection("produits").find({categorie:categorie}).toArray((err, documents) => {
                res.end(JSON.stringify(documents));
            });
        } catch(e) {
            console.log("Erreur sur /produits/"+categorie+" : " + e);
            res.end(JSON.stringify([]));
        }
    });

    /*produits par ref*/
    app.get("/produit/:ref", (req, res) => {
        let ref = req.params.ref;
        try{
            db.collection("produits").find({"ref":ref}).toArray((err, produitsDetailles) => {
                                            //console.log("Produit:"+JSON.stringify(documents2[0]));
                        var produit = produitsDetailles;
                        res.end(JSON.stringify(produit));
            });
           } catch(e) {
            console.log("Erreur sur /produit/ref"+ref+" : " + e);
            res.end(JSON.stringify([]));
        }
    });

    /*ajout d'un produit*/
    app.post("/produit/add", (req, res) => {
        //console.log("/membres/add avec "+JSON.stringify(req.body));
        let id = req.body;
        console.log("test");
    });


    /* Liste des catégories de produits */
    app.get("/categories", (req, res) => {
        console.log("/categories");
        categories = [];
        try{
            db.collection("produits").find().toArray((err, documents) => {
                for (let doc of documents) {
                    if (!categories.includes(doc.categorie)) 
                        categories.push(doc.categorie);
                }
                console.log("Renvoi de "+JSON.stringify(categories));
                res.end(JSON.stringify(categories));
            });
        } catch(e) {
            console.log("Erreur sur /categories : " + e);
            res.end(JSON.stringify([]));
        }
    });


        /* Liste des materiaux de produits */

        app.get("/materiaux", (req, res) => {
            console.log("/materiaux");
            materiaux = [];
            try{
                db.collection("produits").find().toArray((err, documents) => {
                    for (let doc of documents) {
                    	//console.log(doc.materiaux);
                    	for(let m of doc.materiaux){
                    		if (!materiaux.includes(m)) 
                        		materiaux.push(m);
                    	}
                    }
                    console.log("Renvoi de "+JSON.stringify(materiaux));
                    res.end(JSON.stringify(materiaux));
                });
            } catch(e) {
                console.log("Erreur sur /materiaux : " + e);
                res.end(JSON.stringify([]));
            }
        });


        /* Liste des materiauxPrincipaux de produits */
        app.get("/materiauxPrincipaux", (req, res) => {
            console.log("/materiauxPrincipaux");
            materiaux = [];
            try{
                db.collection("produits").find().toArray((err, documents) => {
                    for (let doc of documents) {
                        if (!materiaux.includes(doc.materiaux.materiau1)) 
                        materiaux.push(doc.materiaux.materiau1);
                    }
                    console.log("Renvoi de "+JSON.stringify(materiaux));
                    res.end(JSON.stringify(materiaux));
                });
            } catch(e) {
                console.log("Erreur sur /materiauxPrincipaux : " + e);
                res.end(JSON.stringify([]));
            }
        });

        /* Liste des materiauxSecondaires de produits */
        app.get("/materiauxSecondaires", (req, res) => {
            console.log("/materiauxSecondaires");
            materiaux = [];
            try{
                db.collection("produits").find().toArray((err, documents) => {
                    for (let doc of documents) {
                        if (!materiaux.includes(doc.materiaux.materiau2)) 
                        materiaux.push(doc.materiaux.materiau2);
                    }
                    console.log("Renvoi de "+JSON.stringify(materiaux));
                    res.end(JSON.stringify(materiaux));
                });
            } catch(e) {
                console.log("Erreur sur /materiauxSecondaires : " + e);
                res.end(JSON.stringify([]));
            }
        });

        /* Liste des produits dans le panier, pour le user identifié par 'email' */
        // http://localhost:8888/panier/get/user@mail.com
        app.get("/panier/get/:email", (req, res) => {
            console.log("/panier");
            let email = req.params.email;
            panierResultat = [];
            console.log("email reçue:"+email);

            var retour = function() {
                console.log("Panier retourné:"+JSON.stringify(panierResultat));
                res.end(JSON.stringify(panierResultat));
            }

            try{
                db.collection("paniers").find({proprio:email}).toArray((err, paniers) => {

                    for (let panier of paniers) { // Normalement 1 panier par user mais on parcourt avec une boucle for au cas où
                        if (panier != undefined){
                            console.log("contenu :"+JSON.stringify(panier.contenu));
                            var produits = panier.contenu;

                            var i = 1;
                            for(let p of produits){
                                //console.log("Un contenu du panier:"+JSON.stringify(p));
                                if (p != undefined){
                                    /* Récupérer le produit par sa ref */
                                    try{
                                        console.log("ref :"+ p.ref);
                                        db.collection("produits").find({"ref":p.ref}).toArray((err, produitsDetailles) => {
                                            //console.log("Produit:"+JSON.stringify(documents2[0]));
                                            var produit = produitsDetailles[0];
                                            // On associe la quantité associée à ce produit dans le panier : 
                                            produit.quantite = p.quantite; 
                                            panierResultat.push(produit);
                                            
                                            //console.log("Contenu du panier à ce moment:"+JSON.stringify(panierResultat));
                                            if(i == produits.length) // Si le produit actuel est le dernier, alors on appelle la fonction de retour comme le db.collection.find est asynchrone
                                                retour();
                                            i++;
                                        });
                                    } catch(e) {
                                        console.log("/produits/"+ ref + " : " + e);
                                        res.end(JSON.stringify([])); 
                                    }
                                }
                            }
                        }
                    }

                });
            } catch(e) {
                console.log("Erreur sur /panier : " + e);
                res.end(JSON.stringify([]));
            }
        });

        /* Ajout produit dans panier */
        app.post("/panier/ajouter", (req, res) => {
            console.log("/panier/ajouter"+JSON.stringify(req.body));
            let email = req.body.email;
            let ref = req.body.ref;

            try{
                db.collection("paniers").find({proprio:email}).toArray((err, paniers) => {
                    for (let panier of paniers) { // Normalement 1 panier par user mais on parcourt avec une boucle for au cas où
                        if (panier != undefined){
                            console.log("contenu :"+JSON.stringify(panier.contenu));
                            var produits = panier.contenu;
                            var estDansPanier = false;
                            
                            var i = 0;
                            var indiceProduit = 0;
                            for(let p of produits){
                                if (p.ref == ref) {
                                    estDansPanier = true;
                                    indiceProduit = i;
                                }
                                i++;
                            }
                            if(estDansPanier){ // Le produit que l'on souhaite ajouté est déjà dans le panier, dans ce cas on agit seulement sur la quantité
                                produits[indiceProduit].quantite++;
                                try{
                                    db.collection("paniers").updateOne(
                                        {"proprio":email},
                                        {$set:{ "contenu" : produits}}
                                    );

                                    console.log("Produit ajouté");
                                    res.end(JSON.stringify({"resultat": 1, "message": "L'ajout a bien été pris en compte!"}));
                                } catch(e){
                                    console.log("Erreur ajout produit existant panier : "+e);
                                    res.end(JSON.stringify({"resultat": 0, "message": e}));
                                }
                            }
                            else{ // Sinon on l'ajoute directement avec une quantité de 1
                                produits.push({"ref":ref, "quantite" : 1});
                                try{
                                    db.collection("paniers").updateOne(
                                        {"proprio":email},
                                        {$set:{ "contenu" : produits}}
                                    );
                                    console.log("Produit ajouté");
                                    res.end(JSON.stringify({"resultat": 1, "message": "L'ajout a bien été pris en compte!"}));

                                } catch(e){
                                    //console.log("Message retourné: "+JSON.stringify(resultat));
                                    console.log("Erreur ajout nouveau produit panier : "+e);
                                    res.end(JSON.stringify({"resultat": 0, "message": e}));
                                }
                
                            }
                           
                        }
                    }
                });

            } catch(e) {
                console.log("Erreur get panier : "+e);
                res.end(JSON.stringify({"resultat": "", "message": e}));
            }
        });

        /* +1 dans la quantité d'un certain produit */
        app.post("/panier/ajoutUn", (req, res) => {
            console.log("/panier/ajoutUn/"+JSON.stringify(req.body));
            let email = req.body.email;
            let ref = req.body.ref;
            panierResultat = [];

            var retour = function() {
                console.log("Panier retourné:"+JSON.stringify(panierResultat));
                res.end(JSON.stringify(panierResultat));
            }

            try{
                db.collection("paniers").find({proprio:email}).toArray((err, paniers) => {

                    for (let panier of paniers) { // Normalement 1 panier par user mais on parcourt avec une boucle for au cas où
                        if (panier != undefined){
                            console.log("contenu :"+JSON.stringify(panier.contenu));
                            var produits = panier.contenu;

                            var i = 1;
                            for(let p of produits){
                                //console.log("Un contenu du panier:"+JSON.stringify(p));
                                /* Récupérer le produit par sa ref */
                                try{
                                    db.collection("produits").find({"ref":p.ref}).toArray((err, produitsDetailles) => {
                                        //console.log("Produit:"+JSON.stringify(documents2[0]));
                                        var produit = produitsDetailles[0];
                                        if(p.ref == ref){
                                            var updateQuantite = p.quantite + 1;
                                            // On associe la quantité associée à ce produit dans le panier : 
                                            produit.quantite = updateQuantite; 
                                            p.quantite = updateQuantite;

                                            try{
                                                db.collection("paniers").updateOne(
                                                    {"proprio":email},
                                                    {$set:{ "contenu" : produits}}
                                                );

                                                console.log(("p : "+JSON.stringify(p)));
                                                //db.collection("paniers").findOneAndReplace({"email":email},{["contenu."+i-1]:p});
                                                console.log("Update fini :");
                                            } catch(e){
                                                console.log("erreur modif :"+e);
                                            }
                                        }

                                        else
                                            produit.quantite = p.quantite; 

                                        panierResultat.push(produit);
                                        
                                        //console.log("Contenu du panier à ce moment:"+JSON.stringify(panierResultat));
                                        if(i == produits.length) // Si le produit actuel est le dernier, alors on appelle la fonction de retour comme le db.collection.find est asynchrone
                                            retour();
                                        i++;
                                    });
                                } catch(e) {
                                    console.log("/produits/"+ ref + " : " + e);
                                    res.end(JSON.stringify([])); 
                                }
                            }
                        }
                    }

                });
            } catch(e) {
                console.log("Erreur sur /panier : " + e);
                res.end(JSON.stringify([]));
            }
        });

        /* -1 dans la quantité d'un certain produit */
            app.post("/panier/retraitUn", (req, res) => {
                console.log("/panier/retraitUn/"+JSON.stringify(req.body));
                let email = req.body.email;
                let ref = req.body.ref;
                panierResultat = [];
    
                var retour = function() {
                    console.log("Panier retourné:"+JSON.stringify(panierResultat));
                    res.end(JSON.stringify(panierResultat));
                }
    
                try{
                    db.collection("paniers").find({proprio:email}).toArray((err, paniers) => {
    
                        for (let panier of paniers) { // Normalement 1 panier par user mais on parcourt avec une boucle for au cas où
                            if (panier != undefined){
                                console.log("contenu :"+JSON.stringify(panier.contenu));
                                var produits = panier.contenu;
    
                                var i = 1;
                                var nbProduitsAvant = produits.length;
                                for(let p of produits){
                                    //console.log("Un contenu du panier:"+JSON.stringify(p));
                                    /* Récupérer le produit par sa ref */
                                    try{
                                        db.collection("produits").find({"ref":p.ref}).toArray((err, produitsDetailles) => {
                                            //console.log("Produit:"+JSON.stringify(documents2[0]));
                                            var produit = produitsDetailles[0];
                                            if(p.ref == ref){
                                                var updateQuantite = p.quantite - 1;
                                                // On associe la quantité associée à ce produit dans le panier : 
                                                produit.quantite = updateQuantite; 
                                                p.quantite = updateQuantite;
                                                if (updateQuantite < 1){
                                                    produits.pop(p);
                                                }
                                                else
                                                    panierResultat.push(produit);
                                                try{
                                                    db.collection("paniers").updateOne(
                                                    {"proprio":email},
                                                    {$set:{ "contenu" : produits}}
                                                    );
                                                } catch(e){
                                                    console.log("erreur modif :"+e);
                                                }
            
                                            }
    
                                            else{
                                                produit.quantite = p.quantite; 
                                                panierResultat.push(produit);
                                            }
                                            
                                            //console.log("Contenu du panier à ce moment:"+JSON.stringify(panierResultat));
                                            if(i == nbProduitsAvant) // Si le produit actuel est le dernier, alors on appelle la fonction de retour comme le db.collection.find est asynchrone
                                                retour();
                                            i++;
                                        });
                                    } catch(e) {
                                        console.log("/produits/"+ ref + " : " + e);
                                        res.end(JSON.stringify([])); 
                                    }
                                }
                            }
                        }
    
                    });
                } catch(e) {
                    console.log("Erreur sur /panier : " + e);
                    res.end(JSON.stringify([]));
                }
            });

        /* Supprimer un produit du panier */
        app.post("/panier/supprimer", (req, res) => {
            console.log("/panier/supprimer/"+JSON.stringify(req.body));
            let email = req.body.email;
            let ref = req.body.ref;
            var panierResultat = [];

            try{
                db.collection("paniers").find({proprio:email}).toArray((err, paniers) => {

                    for (let panier of paniers) { // Normalement 1 panier par user mais on parcourt avec une boucle for au cas où
                        if (panier != undefined){
                            console.log("contenu :"+JSON.stringify(panier.contenu));
                            var produits = panier.contenu;

                            var i = 1;
                            var nbProduitsAvant = produits.length;
                            for(let p of produits){
                                //console.log("Un contenu du panier:"+JSON.stringify(p));
                                /* Récupérer le produit par sa ref */
                                try{
                                    db.collection("produits").find({"ref":p.ref}).toArray((err, produitsDetailles) => {
                                        //console.log("Produit:"+JSON.stringify(documents2[0]));
                                        var produit = produitsDetailles[0];
                                        if(p.ref == ref){
                                            produits.pop(p); // On l'enlève

                                            try{
                                                db.collection("paniers").updateOne(
                                                    {"proprio":email},
                                                    {$set:{ "contenu" : produits}}
                                                );

                                            } catch(e){
                                                console.log("erreur modif :"+e);
                                            }
                                        }

                                        else{
                                            produit.quantite = p.quantite; 
                                            panierResultat.push(produit); // On push seulement dans le panier de retour si c'est pas le produit qu'on veut supprimer
                                        }
                                        
                                        //console.log("Contenu du panier à ce moment:"+JSON.stringify(panierResultat));
                                        if(i == nbProduitsAvant){// Si le produit actuel est le dernier à traiter, alors on retourne le panier, comme db.find est asynchrone, une solution est de procéder comme cela
                                            console.log("Panier retourné:"+JSON.stringify(panierResultat));
                                            res.end(JSON.stringify(panierResultat));
                                        }
                                        i++; // On incrémente pour indiquer qu'on traite le produit suivant

                                    });
                                } catch(e) {
                                    console.log("/produits/"+ ref + " : " + e);
                                    res.end(JSON.stringify([])); 
                                }
                            }
                        }
                    }

                });
            } catch(e) {
                console.log("Erreur sur /panier : " + e);
                res.end(JSON.stringify([]));
            }
        });

        /* Vide le panier */
        app.get("/panier/validerPanier/:email", (req, res) => {
            console.log("/panier/viderPanier/"+JSON.stringify(req.body));
            let email = req.params.email;
            panierResultat = [];

            var retour = function() {
                console.log("Panier retourné:"+JSON.stringify(panierResultat));
                res.end(JSON.stringify(panierResultat));
            }
            
            try{
                db.collection("paniers").updateOne(
                {"proprio":email},
                {$set:{ "contenu" : [] }} // On remplace le contenu par un tableau vide
                );
                retour();
            } catch(e){
                console.log("erreur vidage panier :"+e);
                retour();
            }
        });

        /* Filtre par catégorie et par matériau */
        app.get("/produits/:categorie/:materiau", (req, res) => {
            let categorie = req.params.categorie;
            let materiau = req.params.materiau;
            retour = [];
            console.log("/produits/"+categorie+"/"+materiau);
            try{
                if (categorie === '*'){
                db.collection("produits").find().toArray((err, documents) => {
                    if(materiau === '*'){
                        for (let doc of documents) {
                            if (!retour.includes(doc.materiaux)) 
                                retour.push(doc);
                        }

                    }
                    else{
                        for (let doc of documents) {
                            for(let x of doc.materiaux){
                                if(x === materiau)
                                    retour.push(doc);
                            }          
                        }

                    }

                    console.log("Renvoi de "+JSON.stringify(retour));
                    res.end(JSON.stringify(retour));
                });
                }
                else{
                    db.collection("produits").find({categorie:categorie}).toArray((err, documents) => {
                        if(materiau === '*'){
                            for (let doc of documents) {
                                if (!retour.includes(doc.materiaux)) 
                                    retour.push(doc);
                            }
    
                        }
                        else{
                            for (let doc of documents) {
                                for(let x of doc.materiaux){
                                    if(x === materiau)
                                        retour.push(doc);
                                }          
                            }
    
                        }
    
                        console.log("Renvoi de "+JSON.stringify(retour));
                        res.end(JSON.stringify(retour));
                    });
                }
            } catch(e) {
                console.log("Erreur sur /produits/"+categorie+"/"+materiau+" : " + e);
                res.end(JSON.stringify([]));
            }
        });

        app.get("/produits/:categorie/:materiau/:prix1/:prix2", (req, res) => {
            let categorie = req.params.categorie;
            let materiau = req.params.materiau;
            let prix1 = req.params.prix1;
            let prix2 = req.params.prix2;
            retour = [];
            console.log(prix1);
            console.log(prix2);
            console.log(materiau);
            console.log(categorie);
            //console.log(prix1);
            //console.log("/produits/"+categorie+"/"+materiau);
            try{
                if (categorie === '*'){
                    if(prix1 === '' || prix2 === ''){
                        if(prix1 === '' && prix2 != ''){
                            db.collection("produits").find().toArray((err, documents) => {
                                if (materiau === '*'){
                                    for (let doc of documents) {
                                        if (!retour.includes(doc.materiaux)){ 
                                            if(parseInt(doc.prix) <= parseInt(prix2) && parseInt(doc.prix) >= 0){
                                                retour.push(doc);
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (let doc of documents) {
                                        for(let x of doc.materiaux){
                                            if(x === materiau){
                                                if(parseInt(doc.prix) <= parseInt(prix2) && parseInt(doc.prix) >= 0){
                                                    retour.push(doc);
                                                }
                                            }
                                        }
                                    }
                                }
                                console.log("Renvoi de "+JSON.stringify(retour));
                                res.end(JSON.stringify(retour));
                            });
                        }
                        if(prix1 != '' && prix2 === ''){
                            db.collection("produits").find().toArray((err, documents) => {
                                if (materiau === '*'){
                                    for (let doc of documents) {
                                        if (!retour.includes(doc.materiaux)){
                                            if(parseInt(doc.prix) >= parseInt(prix1)){
                                                retour.push(doc);
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (let doc of documents) {
                                        for(let x of doc.materiaux){
                                            if(x === materiau){
                                                if(parseInt(doc.prix) >= parseInt(prix1)){
                                                    retour.push(doc);
                                                }
                                            }
                                        }
                                    }
                                }
            
                                console.log("Renvoi de "+JSON.stringify(retour));
                                res.end(JSON.stringify(retour));
                            });
                        }
                        if(prix1 === '' && prix2 === ''){
                            db.collection("produits").find().toArray((err, documents) => {
                                if (materiau === '*'){
                                    for (let doc of documents) {
                                        if (!retour.includes(doc.materiaux)){
                                            if(parseInt(doc.prix) >= 0){
                                                retour.push(doc);
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (let doc of documents) {
                                        for(let x of doc.materiaux){
                                            if(x === materiau){
                                                if(parseInt(doc.prix) >= 0){
                                                    retour.push(doc);
                                                }
                                            }
                                        }
                                    }
                                }
            
                                console.log("Renvoi de "+JSON.stringify(retour));
                                res.end(JSON.stringify(retour));
                            });
                        }
                    }
                    else {
                    db.collection("produits").find().toArray((err, documents) => {
                        if (materiau === '*'){
                            for (let doc of documents) {
                                if (!retour.includes(doc.materiaux)){
                                    if(parseInt(doc.prix) <= parseInt(prix2) && parseInt(doc.prix) >= parseInt(prix1)){
                                    retour.push(doc);
                                    }
                                }
                            }
                        }
                        else{
                            for (let doc of documents) {
                                for(let x of doc.materiaux){
                                    if(x === materiau){
                                        if(parseInt(doc.prix) <= parseInt(prix2) && parseInt(doc.prix) >= parseInt(prix1)){
                                            retour.push(doc);
                                        }
                                    }
                                }
                            }
                        }
                        console.log("Renvoi de "+JSON.stringify(retour));
                        res.end(JSON.stringify(retour));
                    });
                    }
                }
                else {
                if(prix1 === '' || prix2 === ''){
                    if(prix1 === '' && prix2 != ''){
                        db.collection("produits").find({categorie:categorie}).toArray((err, documents) => {
                            if (materiau === '*'){
                                for (let doc of documents) {
                                    if (!retour.includes(doc.materiaux)){ 
                                        if(parseInt(doc.prix) <= parseInt(prix2) && parseInt(doc.prix) >= 0){
                                            retour.push(doc);
                                        }
                                    }
                                }
                            }
                            else {
                                for (let doc of documents) {
                                    for(let x of doc.materiaux){
                                        if(x === materiau){
                                            if(parseInt(doc.prix) <= parseInt(prix2) && parseInt(doc.prix) >= 0){
                                                retour.push(doc);
                                            }
                                        }
                                    }
                                }
                            }
                            console.log("Renvoi de "+JSON.stringify(retour));
                            res.end(JSON.stringify(retour));
                        });
                    }
                    if(prix1 != '' && prix2 === ''){
                        db.collection("produits").find({categorie:categorie}).toArray((err, documents) => {
                            if (materiau === '*'){
                                for (let doc of documents) {
                                    if (!retour.includes(doc.materiaux)){
                                        if(parseInt(doc.prix) >= parseInt(prix1)){
                                            retour.push(doc);
                                        }
                                    }
                                }
                            }
                            else {
                                for (let doc of documents) {
                                    for(let x of doc.materiaux){
                                        if(x === materiau){
                                            if(parseInt(doc.prix) >= parseInt(prix1)){
                                                retour.push(doc);
                                            }
                                        }
                                    }
                                }
                            }
        
                            console.log("Renvoi de "+JSON.stringify(retour));
                            res.end(JSON.stringify(retour));
                        });
                    }
                    if(prix1 === '' && prix2 === ''){
                        db.collection("produits").find({categorie:categorie}).toArray((err, documents) => {
                            if (materiau === '*'){
                                for (let doc of documents) {
                                    if (!retour.includes(doc.materiaux)){
                                        if(parseInt(doc.prix) >= 0){
                                            retour.push(doc);
                                        }
                                    }
                                }
                            }
                            else {
                                for (let doc of documents) {
                                    for(let x of doc.materiaux){
                                        if(x === materiau){
                                            if(parseInt(doc.prix) >= 0){
                                                retour.push(doc);
                                            }
                                        }
                                    }
                                }
                            }
        
                            console.log("Renvoi de "+JSON.stringify(retour));
                            res.end(JSON.stringify(retour));
                        });
                    }
                }
                else {
                db.collection("produits").find({categorie:categorie}).toArray((err, documents) => {
                    if (materiau === '*'){
                        for (let doc of documents) {
                            if (!retour.includes(doc.materiaux)){
                                if(parseInt(doc.prix) <= parseInt(prix2) && parseInt(doc.prix) >= parseInt(prix1)){
                                retour.push(doc);
                                }
                            }
                        }
                    }
                    else{
                        for (let doc of documents) {
                            for(let x of doc.materiaux){
                                if(x === materiau){
                                    if(parseInt(doc.prix) <= parseInt(prix2) && parseInt(doc.prix) >= parseInt(prix1)){
                                        retour.push(doc);
                                    }
                                }
                            }
                        }
                    }
                    console.log("Renvoi de "+JSON.stringify(retour));
                    res.end(JSON.stringify(retour));
                });
                }
            }
            } catch(e) {
                console.log("Erreur sur /produits/"+categorie+"/"+materiau+" : " + e);
                res.end(JSON.stringify([]));
            }
        })
    

    /*upload image*/
    app.post("/admin/upload/:id/:nom/:cat/:mat1/:prix/:desc", (req, res) => {
        
        console.log("image");
        //console.log("nom"+req.params.nom);
        
            let produit = '{"ref":"'+req.params.id+'",'+
            '"categorie":"'+req.params.cat+'",'+
            '"nom":"'+req.params.nom+'",'+
            '"prix":"'+req.params.prix+'",'+
            '"materiaux":["'+req.params.mat1+'"],'+
            '"description":"'+req.params.desc+'",'+
            '"dispo":"1"}';
            console.log("produit avant JSON avec "+produit);
            let userJson = JSON.parse(produit);
            try{
                let result = db.collection("produits").insertOne(userJson, function(err, res2){
                
                });
            }
            catch(e) {
                res.end(JSON.stringify({"resultat": 0, "message": e}));
                console.log(e);
            }
        
        var form = new Formidable.IncomingForm();

        form.parse(req);

        form.on('admin', function (name, file){
            console.log(file);
            console.log("test");
        });

        form.on('fileBegin', function (name, file){
            //console.log(JSON.stringify(file));
            file.path = __dirname + '/ESTELLE/src/assets/' + req.params.id+".jpg"; 
            //console.log(file.path);
        });

        form.on('file', function (name, file){
        });

            res.end(JSON.stringify([]));
            //res.sendFile(__dirname + '/index.html');
        
    });

    /* Connexion */
    app.post("/membres/connexion", (req, res) => {
        console.log("/membres/connexion avec "+JSON.stringify(req.body));
        try{
            db.collection("membres")
            .find(req.body)
            .toArray((err, documents) => {
                if (documents.length == 1){
                	//window.localStorage.setItem('auth', "authentifie");
                    res.end(JSON.stringify({"resultat": 1, "message": "Authentification réussie"}));
                }
                else res.end(JSON.stringify({"resultat": 0, "message": "Email et/ou mot de passe incorrect"}));
            });
        } catch(e) {
            res.end(JSON.stringify({"resultat": 0, "message": e}));
        }
    });

    app.post("/membres/add", (req, res) => {
        //console.log("/membres/add avec "+JSON.stringify(req.body));
        let mdp1 = req.body.password1;
        //console.log("mdp1 : "+mdp1);
        let mdp2 = req.body.password2;
        let prenom = req.body.prenom;
        let trouve = false;
        db.collection("membres").find().toArray((err, documents) => {  
                //let trouve = false;
                for (let doc of documents) {
                        //console.log(doc);
                        //console.log(req.body.email);
                        if(doc.email == req.body.email){ //verif email deja present en base ?
                            trouve = true;
                            
                            res.end(JSON.stringify({"resultat": 0, "message": "Un utilisateur est deja associé a cet email"}));
                        }
                        else {}
                }
                if(trouve == false){ //si aucun utilisateur deja associé a l'email
                    if(mdp1 == mdp2){

                        //console.log(trouve);
                        if(trouve == false){
                                let user = '{"nom":"'+req.body.nom+'",'+
                                '"prenom":"'+req.body.prenom+'",'+
                                '"email":"'+req.body.email+'",'+
                                '"password":"'+req.body.password1+
                                '"admin":"0"}';
                                //console.log("user avant JSON avec "+user);
                                let userJson = JSON.parse(user);
                                console.log("/membres/add avec "+JSON.stringify(userJson));
                                try{
                                    let result = db.collection("membres").insertOne(userJson, function(err, res2){
                                    if(err) {}
                                    else {
                                        db.collection("paniers").insertOne({"proprio":req.body.email, "contenu":[]}, function(err, res3){
                                            if(err){}
                                            else{
                                                res.end(JSON.stringify({"resultat": 1, "message": "Membre Ajouté"}));
                                                //console.log("reussi");
                                            }
                                        });

                                    }
                                    });
                                }
                                catch(e) {
                                    res.end(JSON.stringify({"resultat": 0, "message": e}));
                                    console.log(e);
                                }
                        }
                        else {
                            
                        }
                    }
                    else {
                        res.end(JSON.stringify({"resultat": 0, "message": "Les mots de passe ne concordent pas"}));
                    }
                }
                else {
                    console.log("email deja present");
                }
        	});
        
    	});



});


