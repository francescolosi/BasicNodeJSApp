/*********************************************************************************
*  BTI325 – Assignment 4
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Francesco Losi Student ID: 015202153 Date: November 6, 2018
*
*  Online (Heroku) Link: https://sleepy-atoll-23400.herokuapp.com/
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT ||8080;
var express = require("express");
const fs= require('fs');
var exphbs = require("express-handlebars")
var app = express();
var path = require('path');
var bodyParser= require('body-parser');
var dataService= require('./data-service.js')
const multer =require("multer");
const storage=multer.diskStorage({
    destination:"./public/images/uploaded",
    filename: function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
});
const upload= multer({ storage: storage});
function onHttpStart(){
    console.log("Express http server listening on: "+ HTTP_PORT);
}
app.use(express.static("./public/images"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public')); 
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.engine(".hbs", exphbs(
    {extname: '.hbs',
     helpers:{
        navLink: function(url, options){
            /*return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';*/
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
        
    },
        defaultLayout:'main'
    }));
app.set('view engine', '.hbs');
app.get("/", function(req,res){
    res.render('home');
});

app.get("/about", function(req,res){
    res.render('about');
})

app.get("/employees/add", function(req,res){
    res.render('addEmployee');
})

app.get("/employees", (req, res)=>{
   if (req.query.status){
       dataService.getEmployeesByStatus(req.query.status)
       .then((data)=>{
           if (employees.length>0){
            res.render("employees",{employees:data});
            res.render("employees", {message: "no results"});
           }
       }).catch((err)=>{
           res.render("employees",{message:"no results"});
       })
   }else if (req.query.department){
       dataService.getEmployeesByDepartment(req.query.department)
       .then((data)=>{
           res.render("employees",{employees:data});
       }).catch((err)=>{
           res.render("employees",{message:"no results"});
       })
   }else if (req.query.manager){
        dataService.getEmployeesByManager(req.query.manager)
        .then((data)=>{
            res.render("employees",{employees:data});
        }).catch((err)=>{
            res.render("employees",{message:"no results"});
        })
   } else {
        dataService.getAllEmployees()
        .then((data)=>{
            res.render("employees", {employees: data});
        }).catch((msg)=>{
            res.render("employees",{message:"no results"});
        })
    }
});

app.get("/departments", function(req, res){
    dataService.getDepartments()
    .then((data)=>{
        res.render("departments",{departments:data});
    })
    .catch((msg)=>{
        res.send("departments",{message:"no results"})
    })
});
app.get("/employee/:empNum",function(req,res){
    dataService.getEmployeesByNum(req.params.empNum)
    .then((data)=>{
       res.render("employee",{employee:data});    
    })
    .catch((msg)=>{
        res.render("employee", {message:"no results"});
    })
});

app.get("/departments/add", (req,res)=>{
    dataService.a
})

app.get("/images/add", function(req,res){
    res.render('addImage');
})
app.get("/images",function(req,res){
    fs.readdir("./public/images/uploaded",function(err,items){
        res.render("images",{pictures:items});
    })
})
app.post("/images/add",upload.single("imageFile"),(req,res)=>{
    res.redirect('/images');
})

app.post("/employee/update",(req,res)=>{
    dataService.updateEmployee(req.body)
    .then((data)=>{
        res.redirect("/employees");
    }).catch((msg)=>{
        console.log(msg);
    })
})
app.post("/employees/add",(req,res)=>{
    dataService.addEmployee(req.body)
    .then((data)=>{
        res.send(data);
    })
    .catch((msg)=>{
        console.log(msg);
    })
})
app.use((req,res)=>{
    res.status(404).send("Page not found");
})

dataService.initialize()
.then((data)=>{
    console.log(data);
    app.listen(HTTP_PORT, onHttpStart);
})
.catch(function(msg){
    console.log(msg);
})