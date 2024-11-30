const express=require('express');
const dotenv=require('dotenv').config({path:'.env'});
const app=express();
const ejs=require('ejs');
const path=require('path');
const multer=require('multer');

const upload=multer({storage:'/uploads'});

app.set('views engine',ejs);

app.use(express.urlencoded({extended:true}));

app.use('/static',express.static(path.join(__dirname,'static')));
app.use(express.json());


app.get('/',(req,res)=>res.render('index.ejs'));
app.get('/addrecipe',(req,res)=>res.render('addrecipe.ejs'));
app.get('/deleterecipe',(req,res)=>res.render('deleterecipe.ejs'));


app.post('/createrecipe',upload.single('file'),(req,res)=>{
   const file=req.file;

   console.log(file);
});

app.listen('2001',()=>console.log('server started!'));