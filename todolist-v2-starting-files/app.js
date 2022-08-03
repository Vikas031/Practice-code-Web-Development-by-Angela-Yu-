//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require('mongoose');
var _ = require('lodash');

//database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/todolistDB');
}

const itemSchema=new mongoose.Schema({
  item:String
});

const listSchema=new mongoose.Schema({
  name:String,
  content:[itemSchema]
})


const List=mongoose.model('list',listSchema);
const Item=mongoose.model('item',itemSchema)

async function getdata(){
  const doc= await Item.find();    
    return doc;
};


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//main home page route 
app.get("/", async function(req, res) {
const doc=await getdata();

const day = date.getDate();

  res.render("list", {listTitle: "Today", newListItems: doc});

});

// Route to add post to home page
app.post("/",async function(req, res){

  const item = req.body.newItem;
  console.log(item);
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    const i=new Item({item:item});
    await i.save();
    res.redirect("/");
  }
});

//routes for other list than home 
app.get("/home/:path",async (req,res)=>{
  const param=_.lowerCase(req.params.path);
  const data=await List.findOne({name:param});
  if(data){
    //if list available
    res.render('list',{listTitle: param, newListItems:data.content})

  }else{
    //else create list
    const newList=new List({name:param,content:[]})
    newList.save();
    res.render('list',{listTitle: param, newListItems:[]})
  }
})

//post route for adding new element to custom lists
app.post("/home",(req,res)=>{
  const data=req.body;
  const item=new Item({item:data.newItem});
  List.findOne({name:_.lowerCase(data.list)},function (err,list){
      list.content.push(item);
      list.save();
      res.redirect("/home/"+data.list);
  })
});

app.post("/delete",async (req,res)=>{
  console.log(req.body);
  await Item.deleteOne({_id:req.body.checkbox});
  res.redirect("/");
})

app.post("/home/delete",(req,res)=>{
  let lis=req.body.list;
  const id=req.body.checkbox;
  List.findOneAndUpdate({name:_.lowerCase(lis)},{$pull:{content:{_id:id}}},function (err,foundList){
    if(!err){
      res.redirect("/home/"+lis);
    }
})
})


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
