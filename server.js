const express=require('express');
const dotenv=require('dotenv').config({path:'.env'});
const app=express();
const ejs=require('ejs');
const path=require('path');
const multer=require('multer');
const recipeModel=require('./model/recipemode.js');
const mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/',{dbName:'recipebook'}).then(e=>console.log('database connected')).catch(e=>{
    console.log('issue in connecting database!');
})

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


app.get('/',async (req,res)=>
{
    const recipes=await recipeModel.find({});
    
    console.log(recipes);

    if(!recipes)
    {
        return res.json({"message":"recipes not added!"})
    }
    res.render('index.ejs',{recipes})
   
}
);

app.get('/addrecipe',(req,res)=>res.render('addrecipe.ejs'));

app.get('/deleterecipe',async(req,res)=>{
    const recipes=await recipeModel.find({});
    res.render('deleterecipe.ejs',{recipes});
});

app.delete('/:id/delete',async(req,res)=>{
    const id=req.params.id;
    const recipe=await recipeModel.findById(id);

    if(!recipe)
    {
        return res.json({"success":false,"message":"no item found!"})
    }
    const recipeDeleted=await recipeModel.deleteOne({_id:id});
    if(recipeDeleted)
    {
        return res.json({"success":true,"message":"recipe deleted"})
    }
    return res.json({"success":false,"message":"network issue"})
});


app.post('/createrecipe',upload.single('recipeimg'),async(req,res)=>{
   const file=req.file;
   const body=JSON.parse(JSON.stringify(req.body))
   const recipe=await recipeModel.create({
    "recipename":body.recipe,
    "recipetype":body.recipetype,
    "recipeorigin":body.origin,
    "recipeingredient":body.ingredient,
    "recipedestination":`/static/uploads/${file.filename}`,
   })
   if(recipe)
   {
    return res.json({"msg":"recipe saved!"})
   }
   return res.json({"msg":"issue in saving recipe!"})
});

app.listen('2001',()=>console.log('server started!'));