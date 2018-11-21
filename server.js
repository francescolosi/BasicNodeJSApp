/*********************************************************************************
*  BTI325 – Assignment 5
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Francesco Losi Student ID: 015202153 Date: Oct 20/2018
*
*  Online (Heroku) Link: 
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
    dataService.getDepartments()
    .then((data)=>{
        res.render('addEmployee', {departments:data});
    })
    .catch((err)=>{
        res.render("addEmployee", {departments:[]})
    })
})

app.get("/employees", (req, res)=>{
   if (req.query.status){
       dataService.getEmployeesByStatus(req.query.status)
       .then((data)=>{
           if (data.length>0){
            res.render("employees",{employees:data});
        }else{
            console.log("returning msg");
            res.render("employees", {message: "no results"});
           }
       }).catch((err)=>{
        res.status(500).send("Unable to Get Employee by Status");
       })
   }else if (req.query.department){
       dataService.getEmployeesByDepartment(req.query.department)
       .then((data)=>{
            if (data.length>0){
                res.render("employees",{employees:data});
            }else{
                res.render("employees", {message: "no results"});
        }
       }).catch((err)=>{
            res.status(500).send("Unable to Get Employee by department");
       })
   }else if (req.query.manager){
        dataService.getEmployeesByManager(req.query.manager)
        .then((data)=>{
            if (data.length>0){
                res.render("employees",{employees:data});
            }else{
                res.render("employees", {message: "no results"});
        }
        }).catch((err)=>{
            res.status(500).send("Unable to Get Employee by manager");
        })
   } else {
        dataService.getAllEmployees()
        .then((data)=>{
            if (data.length>0){
                res.render("employees",{employees:data});
            }else{
                res.render("employees", {message: "no results"});
        }
        }).catch((err)=>{
            res.status(500).send("Unable to Get Employees");
        })
    }
});

app.get("/departments", function(req, res){
    dataService.getDepartments()
    .then((data)=>{
        if (data.length>0){
            res.render("departments",{departments:data});
        }else{
            res.render("departments",{message:"no results"})
        }
    })
    .catch((msg)=>{
        res.status(500).send("Unable to Get Departments");
    })
});
app.get("/employee/:empNum", (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};

    dataService.getEmployeesByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error 
    }).then(dataService.getDepartments)
    .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"

        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching 
        // viewData.departments object

        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }

    }).catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
        if (viewData.employee == null) { // if no employee - return an error
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData }); // render the "employee" view
        }
    });
});


app.get("/employees/delete/:empNum",(req,res)=>{
    dataService.deleteEmployeeByNum(req.params.empNum)
    .then(()=>{
        res.redirect("/employees")
    })
    .catch(()=>{
        res.status(500).send("Unable to Remove EMployee/ Employee Not Found");
    })
})
app.get("/departments/add", (req,res)=>{
    res.render("addDepartment");
})

app.get("/images/add", function(req,res){
    res.render('addImage');
})
app.get("/images",function(req,res){
    fs.readdir("./public/images/uploaded",function(err,items){
        res.render("images",{pictures:items});
    })
})
app.get("/departments/:depId",(req,res)=>{
    dataService.getDepartmentById(req.params.depId)
    .then((data)=>{
        if (data.length>0){
            res.render("department",{department:data[0]});
        } else{
            console.log("success but fail")
            res.status(404).send("Department Not Found-but getbyidworks");
        }
    })
    .catch((msg)=>{
        res.status(500).send("Unable to Get Department by Id");
    })
})
app.post("/images/add",upload.single("imageFile"),(req,res)=>{
    res.redirect('/images');
})

app.post("/employee/update",(req,res)=>{
    console.log("in emp update route ")
    dataService.updateEmployee(req.body)
    .then((data)=>{
        res.redirect("/employees");
    }).catch((msg)=>{
        res.status(500).send("Unable to update employe");
    })
})
app.post("/employees/add",(req,res)=>{
    dataService.addEmployee(req.body)
    .then((data)=>{
        res.redirect("/employees")
    })
    .catch((msg)=>{
        res.status(500).send("Unable to Add Employee");
    })
})
app.post("/departments/add",(req,res)=>{
    dataService.addDepartment(req.body)
    .then((data)=>{
        res.redirect("/departments")
    })
    .catch((msg)=>{
        res.status(500).send("Unable to Add department");
    })
})
app.post("/departments/update",(req,res)=>{
    dataService.updateDepartment(req.body)
    .then((data)=>{
        res.redirect("/departments")
    })
    .catch((msg)=>{
        res.status(500).send("Unable to update departments");
    })
})

app.use((req,res)=>{
    res.status(404).send("Page not found");
})

dataService.initialize()
.then((data)=>{
    app.listen(HTTP_PORT, onHttpStart);
})
.catch(function(msg){
    res.status(500).send("Unable to Get Employee by Status");
})