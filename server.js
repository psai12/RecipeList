const express=require('express');
const dotenv=require('dotenv').config({path:'.env'});
const app=express();
const ejs=require('ejs');
const path=require('path');
const multer=require('multer');
const recipeModel=require('./model/recipemode.js');
const mongoose=require('mongoose');

mongoose.set('debug', true);

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



app.get('/addrecipe',(req,res)=>res.render('addrecipe.ejs'));

app.get('/editrecipe',(req,res)=>res.render('editrecipe.ejs'));



app.get('/',async (req,res)=>
{
    const recipes=await recipeModel.find({});
    
    if(!recipes)
    {
        return res.json({"message":"recipes not added!"})
    }
    res.render('index.ejs',{recipes})
   
});


app.get('/deleterecipe',async(req,res)=>{
    const recipes=await recipeModel.find({});
    res.render('deleterecipe.ejs',{recipes});
});


app.put('/update',upload.single('recipeimg'),async(req,res)=>{
    const body=JSON.parse(JSON.stringify(req.body))
    const file=req.file;
  
    const recipe=await recipeModel.findOne({"_id":body.recipeid});
 
    if(!recipe)
    {
        return res.json({"success":"false","message":"recipe not found"});
    }

    console.log(recipe);
    recipe.recipename=body.recipe,
    recipe.recipetype=body.recipetype,
    recipe.recipeorigin=body.origin,
    recipe.recipeingredient=body.ingredient,
    recipe.recipedestination=`/static/uploads/${file.filename}`,

    console.log(recipe);
    await recipe.save();
    return res.json({"success":"true","message":"recipe updated successfully"});
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
   if(!file)
   {
    return res.status(400).json({"message":"file not found!"});
   }
   const recipe=await recipeModel.create({
    "recipename":body.recipe,
    "recipetype":body.recipetype,
    "recipeorigin":body.origin,
    "recipeingredient":body.ingredient,
    "recipedestination":`/static/uploads/${file.filename}`,
   })
   if(recipe)
   {
    return res.json({"message":"recipe saved!"})
   }
   return res.json({"message":"issue in saving recipe!"})
});

app.get('/deleterecipe/:id',async(req,res)=>{
    const id=req.params.id;

    const recipesName=await recipeModel.find({'recipename':id}).sort({recipename:1});
    const recipesType=await recipeModel.find({'recipetype':id}).sort({recipename:1});
    const recipesOrigin=await recipeModel.find({'recipeorigin':id}).sort({recipename:1});
    
    if(recipesName.length>0)
    {
        return res.render('deleterecipe.ejs',{"recipes":recipesName});
    }
    else if(recipesType.length>0)
    {
        return res.render('deleterecipe.ejs',{"recipes":recipesType});
    }
    else if(recipesOrigin.length>0)
    {
        return res.render('deleterecipe.ejs',{"recipes":recipesOrigin});
    }
});

app.get('/:id',async(req,res)=>{
    const id=req.params.id;

    const recipesName=await recipeModel.find({'recipename':id}).sort({recipename:1});
    const recipesType=await recipeModel.find({'recipetype':id}).sort({recipename:1});
    const recipesOrigin=await recipeModel.find({'recipeorigin':id}).sort({recipename:1});

    if(recipesName.length>0)
    {
        return res.render('index.ejs',{"recipes":recipesName});
    }
    else if(recipesType.length>0)
    {
        return res.render('index.ejs',{"recipes":recipesType});
    }
    else if(recipesOrigin.length>0)
    {
        return res.render('index.ejs',{"recipes":recipesOrigin});
    }
});


app.listen('2001',()=>console.log('server started!'));