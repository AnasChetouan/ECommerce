const express = require ('express');
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

MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
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
                db.collection("materiaux").find().toArray((err, documents) => {
                    for (let doc of documents) {
                        if (!materiaux.includes(doc.materiaux)) 
                        materiaux.push(doc.materiaux);
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
        app.get("/panier/get/:email", (req, res) => {
            console.log("/panier");
            let email = req.params.email;
            produits = [];
            console.log("email reçue:"+email);
            try{
                db.collection("paniers").find({proprio:email}).toArray((err, documents) => {
                    for (let doc of documents) {
                        if (doc != undefined && !produits.includes(doc)) 
                            produits.push(doc);
                    }
                    console.log("Renvoi de "+JSON.stringify(produits));
                    res.end(JSON.stringify(produits));
                });
            } catch(e) {
                console.log("Erreur sur /panier : " + e);
                res.end(JSON.stringify([]));
            }
        });

     /* Ajout produit dans panier */
     app.post("/panier/ajouter", (req, res) => {
        console.log("/panier/ajouter"+JSON.stringify(req.body));
        let produit = {test: 1};
        try{
            db.collection("panier").insertOne(
                {"proprio":"user@mail.com",
            "contenu":[
                produit
            ]  
            });
            console.log("Insertion faite");
            
        } catch(e) {
            res.end(JSON.stringify({"resultat": 0, "message": e}));
        }
    });


        /* Récupérer le produit par son id */
        app.get("/produits/:ref", (req, res) => {
            let ref = req.params.ref;
            console.log("/produits/"+ref);
            try{
                db.collection("produits").find({"ref":ref}).toArray((err, documents) => {
                    res.end(JSON.stringify(documents));
                    console.log("Renvoi de "+JSON.stringify(documents));
                });
            } catch(e) {
                console.log("/produits/"+ ref + " : " + e);
                res.end(JSON.stringify([]));
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
            //console.log(prix2);
            //console.log(materiau);
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
                                        if(ParseInt(doc.prix) <= ParseInt(prix2) && ParseInt(doc.prix) >= ParseInt(prix1)){
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
                                    if(ParseInt(doc.prix) <= ParseInt(prix2) && ParseInt(doc.prix) >= ParseInt(prix1)){
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

    /* Connexion */
    app.post("/membres/connexion", (req, res) => {
        console.log("/membres/connexion avec "+JSON.stringify(req.body));
        try{
            db.collection("membres")
            .find(req.body)
            .toArray((err, documents) => {
                if (documents.length == 1)
                    res.end(JSON.stringify({"resultat": 1, "message": "Authentification réussie"}));
                else res.end(JSON.stringify({"resultat": 0, "message": "Email et/ou mot de passe incorrect"}));
            });
        } catch(e) {
            res.end(JSON.stringify({"resultat": 0, "message": e}));
        }
    });


});