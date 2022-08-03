//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require('mongoose');

//database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/todolistDB');
}

const itemSchema=new mongoose.Schema({
  item:String
});

const Item=mongoose.model('item',itemSchema)

async function getdata(){
  const doc= await Item.find();    
    return doc;
};


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const workItems = [];

app.get("/", async function(req, res) {
const doc=await getdata();

const day = date.getDate();

  res.render("list", {listTitle: day, newListItems: doc});

});

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

app.post("/delete",async (req,res)=>{
  console.log(req.body);
  await Item.deleteOne({_id:req.body.checkbox});
  res.redirect("/");
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
