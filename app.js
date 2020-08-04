const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const port = 3000;

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articlesSchema= {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articlesSchema);

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

//All Articles
app.route("/articles")
.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        res.send(foundArticles);
    });
})

.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if (!err) res.send("Sucessfully Added!");
        else res.send(err);
    });
})

.delete(function(req, res){
    Article.deleteMany({}, function(err, foundArticles){
        if (!err) res.send("Sucessfully Deleted!");
        else res.send(err);
    });
});


//Specific Article

app.route("/articles/:articleTitle")

.get(function(req, res){

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle);     
        }else{
            res.send("No article found");
        }
    });
})

.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true}, function(err){
            if (!err) res.send("Sucessfully Updated Article");
            else res.send(err);
        }
    );
})

.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if (!err) res.send("Sucessfully Updated Article");
            else res.send(err);
        }
    );

})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle}, function(err){
            if (!err) res.send("Sucessfully Deleted");
            else res.send(err);
        } 
    );
});

app.listen(port, () => {
    console.log("Listening on port " + port);
})
