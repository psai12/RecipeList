const express=require('express');
const dotenv=require('dotenv').config({path:'.env'});
const app=express();



app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get('/',(req,res)=>res.render('index.ejs'));

app.listen('2001',()=>console.log('server started!'));