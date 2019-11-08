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

    app.get("/produits/:categorie", (req, res) => {
        let categorie = req.params.categorie;
        console.log("/produits/"+categorie);
        try{
            db.collection("produits").find({type:categorie}).toArray((err, documents) => {
                res.end(JSON.stringify(documents));
            });
        } catch(e) {
            console.log("Erreur sur /produits/"+categorie+" : " + e);
            res.end(JSON.stringify([]));
        }
    });

    /* Connexion */
    app.post("/membre/connexion", (req, res) => {
        console.log("/utilisateurs/connexion avec "+JSON.stringify(req.body));
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