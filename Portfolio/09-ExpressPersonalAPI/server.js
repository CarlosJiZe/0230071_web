// Hacemos las incializaciones necesarias
const exp = require("constants");
const express = require("express");
const bodyParser=require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

//Creamos arrays para los nombres y listas
let names = [];
let tasks = [];

//Creamos el middleware para poder hacer el parse
app.use(bodyParser.urlencoded({ extended: false }));

//Hacemos el set de ejs
app.set('view engine','ejs');

//Configuramos la ruta para las views
app.set('views',path.join(__dirname,'views'));

//Inicializamos el servidor
app.listen(port,()=>{
    console.log(`Server runing on http://localhost:${port}`);
});

//Mandamos index.ejs a '/'
app.get('/',(req,res)=>{
    res.render('index',{names: names,tasks:tasks,error:null});
});

//Get de nombres
app.get('/greet',(req,res)=>{
    const {name} = req.query;
    if(name){
        console.log(name);
        names.push(name);
    }
    res.render('index',{names: names,tasks:tasks,error:null});
});

//Get para mandar a un saludo personalizado

app.get("/greet/:index",(req,res,next)=>{
    const index = parseInt(req.params.index);
    if(index>=0 && index < names.length){
        res.render('wazzup',{name: names[index]});
    }else{
        next(new Error('Invalid index, please select a valid name.'));
    }
});

//Manejador de errores
app.use((err, req, res, next) => {
    res.status(500).render('index', { names: names, tasks: tasks, error: err.message });
});

//Añadir tareas a la lista
app.post("/task",(req,res)=>{
    const {task} = req.body;
    if(task){
        tasks.push(task);
    }
    res.redirect("/");
});

//Eliminar tareas de la lista
app.post("/task/delete/:index",(req,res)=>{
    const index= parseInt(req.params.index);
    if(index>=0 && index<tasks.length){
        tasks.splice(index,1);
    }
    res.redirect("/");
});

//Mover los items de la lista
app.post("/task/move/:index",(req,res)=>{
    const index= parseInt(req.params.index);
    const direction = req.body.direction;

    if(direction ==="up" && index>0){
        [tasks[index-1],tasks[index]]=[tasks[index],tasks[index-1]];
    }else if(direction==="down" && index <tasks.length-1){
        [tasks[index+1],tasks[index]]=[tasks[index],tasks[index+1]];
    }
    res.redirect("/");
});

//Ruta put para postman
app.put("/greet/:name",(req,res)=>{
    const {name} = req.params;
    if(name){
        names.push(name);
    }
    res.json(names);
});

//Ruta get para postman
app.get("/task",(req,res)=>{
    res.json(tasks);
});


