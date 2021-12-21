const articleSchema = require("./articleSchema");
const mongoose = require("mongoose");
const Article = mongoose.model('article', articleSchema);
const connectionString = 'mongodb+srv://Naman:naman1@cluster0.w8and.mongodb.net/hw7?retryWrites=true&w=majority'
const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const uploadImage = require('./uploadCloudinary.js').uploadImage

const getArticles = (req,res) => {
  const id = req.params.id;
  if(id){
    let user_id = parseInt(id)
    if (isNaN(user_id)){
      connector.then(()=>{
        Article.find({author:id},(err,item)=>{
          if(err){
            res.status(400).send({error:err})
          }
          else{
            if(item){
              res.status(200).send({ articles: [item]})
            }
            else{
              res.status(404).send({result:'No matched items!'})
            }
          }
        })
      })
     
    }
  else {
    connector.then(()=>{
      Article.find({articleId:id},(err,item)=>{
        if(err){
          res.status(400).send({error:err})
        }
        else{
          if(item){
            res.status(200).send({ articles: [item]})
          }
          else{
            res.status(404).send({result:'No matched items!'})
          }
        }
      })
    })
    
    }
  }

  else{
    connector.then(()=>{
      Article.find({},(err, items)=>{
        if(err){
          res.status(400).send({error:err})
        }
        else{
          if(items){
            res.status(200).send({ articles: items})
          }
          else{
            res.status(404).send({result:'Not Found'})
          }
        }
      })
    })
   
  }
}

const postArticle = (req, res) => {
  const image = req.fileurl
  if(!req.body.text){
    res.status(401).send("Please provide new Article");
    return;
  }
  connector.then(()=>{
    new Article({author: req.username, date: new Date().getTime(), text:req.body.text, comments:[],img:image})
    .save((err, article)=>{
      if(err){
        res.status(400).send({error:err})
      }
      if(article){
        res.status(200).send({articles:[article]})
      }
      else{
        res.status(404).send({result:'Not Found'})
      }
    })
  })
  
}


function putArticle(req, res) {
  let text = req.body.text;
  let commentId = req.body.commentId;
  let postId = req.params.id;
  if(isNaN(parseInt(postId))) {
      res.sendStatus(400)
  } else {

      if(commentId == null) {
        
          editArticleToDbForArticleModification(req, res, text, postId);
      } else {
          editArticleToDbForCommentModification(req, res, text, commentId, postId);
      }
  }
}

const editArticleToDbForArticleModification = (req, res, text, postId) => {
  (async () => {
      let postToEditId = parseInt(postId);
      const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      await connector.then(()=> {
          Article.findOneAndUpdate({articleId: postToEditId, username: req.username}, {
              text: text
          }, {upsert: false}, function (err, doc) {
              if (err) {
                  res.sendStatus(401);
              } else {
                  getArticles(req, res);
              }
          })
      })
  })();
};

const editArticleToDbForCommentModification = (req, res, text, commentId, postId) => {
  (() => {
      const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      connector.then(async ()=> {
          const article = await Article.findOne({articleId: parseInt(postId)});
          if(article) {
              let commentFound = false;
              let commentToAdd;
              if(article.comments.length === 0) {
                  commentToAdd = {
                      username: req.username,
                      commentId: 1,
                      comment: text
                  };
                  article.comments.unshift(commentToAdd);
              } else {
                  commentToAdd = {
                      username: req.username,
                      commentId: article.comments[0].commentId + 1,
                      comment: text
                  };
                  article.comments.forEach(comment => {
                      if(comment.commentId === commentId) {
                          comment.comment = text;
                          commentFound = true;
                      }
                  })
                  if(commentFound === false) {
                      article.comments.unshift(commentToAdd);
                      commentFound = true;
                  }
              }
              article.markModified('comments')
              await article.save().then(response => {
                  res.send(response);
              });
          } else {
              res.sendStatus(404);
          }
      })
  })();
};

module.exports = app => {
  app.post('/article', uploadImage('image'),postArticle)
  app.get('/articles/:id*?',getArticles)
  app.put('/articles/:id', putArticle)
}
