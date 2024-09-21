const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");
const { title } = require("process");

// TODO: configure the express server
const PORT = 3000;
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views',path.join(__dirname,'views'));

const longContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

let posts = [
  {
    title: "First post: Lorem ipsum",
    content: longContent
  }
];
let name="";



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});

// Login html
app.get("/loginhtml",(req,res)=>{
  name = req.query.name;
  const security = "GET (not secure)";
  res.send(`Hello ${name}, you have log in by the ${security} method.`)
});

app.post("/loginhtml",(req,res)=>{
  name = req.body.name;
  const security = "POST (secure)";
  res.send(`Hello ${name}, you have log in by the ${security} method.`)
});

//Login EJS
app.get("/loginEJS",(req,res)=>{
  name = req.query.name;
  res.render("test", { name: name, security: "insecure (GET)" });
});

app.post("/loginEJS",(req,res)=>{
  name = req.body.name;
  res.render("test",{name:name,security:"secure (POST)"});
});

//Login Home

app.post("/login",(req,res)=>{
  name=req.body.name;
  res.redirect("/home");
});

app.get("/home",(req,res)=>{
  if(!name){
    return res.redirect("/");
  }
  res.render("home",{name:name,posts:posts,security:"secure (POST)"});
});

//Metod addPost
app.post("/addPost",(req,res)=>{
  const {title,content}=req.body;
  if(!title || !content){
    return res.send(`<p>Title and content are required <a href="/home">Return</a></p>`)
  }
  posts.push({title,content});
  res.redirect("/home");
});

//Metods of post
app.get("/post/:id",(req,res)=>{
  const post = posts[req.params.id];
  res.render("post",{post, id:req.params.id,name:name});
});
// Edit post
app.post("/editPost/:id",(req,res)=>{
  const {title,content} = req.body;
  const postID= req.params.id;

  if(!title || !content){
    return res.send(`<p>Title and content are required <a href='/post/"+postID+"'>Return</a></p>`)
  }

  posts[postID]={title,content};
  res.redirect("/post/"+postID);
  
});

//Delete post

app.post("/deletePost/:id",(req,res)=>{
  posts.splice(req.params.id,1)
  res.redirect("/home")
});

