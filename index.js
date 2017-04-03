var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();

// DB setting
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection; 
db.once("open", function(){
 console.log("DB connected");
});
db.on("error", function(err){
 console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// DB schema
var contactSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true},
    email:{type:String},
    phone:{type:String}
})
var Contact = mongoose.model("contact",contactSchema);

//Home
app.get("/",function(req,res){
    res.redirect("/contacts");
});

//Contacts - index
app.get("/Contacts",function(req,res){
    Contact.find({},function(err,contacts){
        if(err)return res.json(err);
        res.render("contacts/index",{contacts:contacts});
    })
});

//Contact - New
app.get("/contacts/new",function(req,res){
    res.render("contacts/new");
});

//Contact - create
app.post("/contacts",function(req,res){
    Contact.create(req.body,function(err,contact){
        if(err) return res.json(err);
        res.redirect("/contacts");
    });
});

// Contacts - show // 3 
app.get("/contacts/:id", function(req, res){
 Contact.findOne({_id:req.params.id}, function(err, contact){
  if(err) return res.json(err);
  res.render("contacts/show", {contact:contact});
 });
});
// Contacts - edit // 4 
app.get("/contacts/:id/edit", function(req, res){
 Contact.findOne({_id:req.params.id}, function(err, contact){
  if(err) return res.json(err);
  res.render("contacts/edit", {contact:contact});
 });
});
// Contacts - update // 5 
app.put("/contacts/:id", function(req, res){
 Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
  if(err) return res.json(err);
  res.redirect("/contacts/"+req.params.id);
 });
});
// Contacts - destroy // 6
app.delete("/contacts/:id", function(req, res){
 Contact.remove({_id:req.params.id}, function(err, contact){
  if(err) return res.json(err);
  res.redirect("/contacts");
 });
});
// Port setting
app.listen(5000, function(){
 console.log("server on!");
});