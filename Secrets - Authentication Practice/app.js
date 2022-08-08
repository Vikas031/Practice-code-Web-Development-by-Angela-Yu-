//jshint esversion:6
require('dotenv').config()
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
const app=express();

async function main() {
  await mongoose.connect('mongodb://localhost:27017/SecretDB');
}
//database
main().catch(err => console.log(err));

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


//database schema
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const User=mongoose.model('user',userSchema);

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',(req,res)=>{
    console.log(req.body)
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })

    newUser.save((err)=>{
        if(!err)
        res.render('secrets');
        else
        res.send(err);
    })
})

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},(err,foundUser)=>{
        if(err)
        console.log(err);
        else{
            if(foundUser){
                if(foundUser.password==password)
                res.render("secrets");
            }
        }
    })
})


app.listen(3000,()=>{
    console.log("App running in port 3000 !")
})
