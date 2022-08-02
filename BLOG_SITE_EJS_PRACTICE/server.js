const express=require('express');
const bodyParser=require('body-parser');
const data=require(__dirname+'/data.js');
const _ = require('lodash');

const app=express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
let listItems=[{
  postName :"hello",
  postContent :"dfadfad afdfadsf  dfadfa  adfadf  adfadfa  dfadf"  
}]

let map={
    hello:0,
}


app.use(bodyParser.json())
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("home",{
        data:data.homeContent,
        list:listItems,
    })
})

app.get('/about',(req,res)=>{
    res.render('index',{
        data:data.aboutContent,
    })
})

app.get('/contact',(req,res)=>{
    res.render('index',{
        data:data.contactContent
    })
})

app.get('/compose',(req,res)=>{
    
    res.render('compose');
})

app.post('/compose',(req,res)=>{
    const temp=_.lowerCase(req.body.post);
    if(map.hasOwnProperty(temp))
        res.send("<h1>POST ALREADY EXIST</h1>");
    else{
    map[temp]=listItems.length;

    const post={
        postName:req.body.post,
        postContent :req.body.text
    }
    listItems.push(post);
    res.redirect('/');
}
})

app.get("/posts/:name",(req,res)=>{
   let postname=_.lowerCase(req.params.name);
    res.render("home",{
        data:"",
        topic: listItems[map[postname]].postName,
        content: listItems[map[postname]].postContent,
    })
})

app.listen(3000,()=>{
    console.log("Server Running")
});

