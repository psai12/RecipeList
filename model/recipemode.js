const mongoose=require('mongoose');

const schema=mongoose.Schema({
    "recipename":{
        type:String,
        required:true
    },
    "recipetype":{
        type:String,
        required:true
    },
    "recipeorigin":{
        type:String,
        required:true
    },
    "recipeingredient":{
        type:String,
        required:true
    },
    "recipedestination":{
        type:String,
        required:true
    },
});

const model=mongoose.model("Recipe",schema);


module.exports=model;