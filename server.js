const express=require('express');
const dotenv=require('dotenv').config({path:'.env'});
const app=express();
const ejs=require('ejs');
const path=require('path');
const multer=require('multer');
const recipeModel=require('./model/recipemode.js');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname,'static/uploads')); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName);
    }
});

const upload=multer({storage:storage});

app.set('views engine',ejs);

app.use(express.urlencoded({extended:true}));

app.use('/static',express.static(path.join(__dirname,'static')));
app.use(express.json());


app.get('/',(req,res)=>res.render('index.ejs'));
app.get('/addrecipe',(req,res)=>res.render('addrecipe.ejs'));
app.get('/deleterecipe',(req,res)=>res.render('deleterecipe.ejs'));


app.post('/createrecipe',upload.single('recipeimg'),async(req,res)=>{
   const file=req.file;
   const body=JSON.parse(JSON.stringify(req.body))
   const recipe=await recipeModel.create({
    "recipename":body.recipe,
    "recipetype":body.recipetype,
    "recipeorigin":body.origin,
    "recipeingredient":body.ingredient,
    "recipedestination":file.path,
   })
   if(recipe)
   {
    return res.json({"msg":"recipe saved!"})
   }
   return res.json({"msg":"issue in saving recipe!"})
});

app.listen('2001',()=>console.log('server started!'));