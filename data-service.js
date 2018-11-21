const Sequelize = require('sequelize');
var sequelize =new Sequelize('dap83gean1ede8','tnyfduvtcupyeg', '2e831653993eb088b97b2559554c3892cd52b850a14d4c6647202ca7c16e2044', {
    host: 'ec2-54-235-212-58.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});
var Employees= sequelize.define('Employees', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
    },{
        createdAt: false,
        updatedAt: false
});
var Departments= sequelize.define('Departments',{
    departmentId: {
       type: Sequelize.INTEGER,
       autoIncrement:true,
       primaryKey:true
    },
    departmentName: Sequelize.STRING
    },{
        createdAt: false,
        updatedAt: false
})

sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));

module.exports.initialize= function(){
    return new Promise(function(resolve, reject){
        sequelize.sync().then(()=>{
            resolve();
        }).catch(function(err){
                reject("unable to sync with db");
        })
    })
}
module.exports.getAllEmployees= function(){
    return new Promise((resolve, reject)=>{
            Employees.findAll()
            .then((data)=>{
                console.log(data)
                resolve(data);
            }).catch((err)=>{
                reject("getAll failed");
            })
        })
}
module.exports.getDepartments= function(){
    return new Promise(function(resolve, reject){
        sequelize.sync().then(function(){
            Departments.findAll({})
            .then((data)=>{
                resolve(data);
            }).catch(function(err){
                reject("getAll failed");
            })
        })
    })
}
module.exports.addEmployee= function(employeeData){
    return new Promise(function(resolve,reject){
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const val in employeeData){
            if (employeeData[val]== ""){
                employeeData[val]=null;
            }
        }
        sequelize.sync().then(()=>{
            Employees.create(employeeData).then(()=>{
                console.log("added")
                resolve("employee Added");
            }).catch((err)=>{
                console.log("emp add fail" + err)
                reject("Employee Add Failed");
            })
        })
       
    })
}
module.exports.getEmployeesByStatus= function(empStatus){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function(){
            Employees.findAll({
                where: {status:empStatus}
            }).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject("no emps found");
            })
        })
    })
}
module.exports.getEmployeesByDepartment= function(dept){
    return new Promise(function(resolve,reject){
        
        sequelize.sync().then(function(){
            Employees.findAll({
                where: {department:dept}
            }).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject("no emps found");
            })
        })
    })
}
module.exports.getEmployeesByManager= function(managerNum){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function(){
            Employees.findAll({
                where: {employeeManagerNum:managerNum}
            }).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject("no emps found");
            })
        })
    })
}
module.exports.getEmployeesByNum= function(num){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function(){
            Employees.findAll({
                where: {employeeNum:num}
            }).then((data)=>{
                resolve(data[0]);
            }).catch((err)=>{
                reject("no emps found");
            })
        })
    })
}
module.exports.updateEmployee= function(employeeData){
    return new Promise(function(resolve,reject){
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const val in employeeData){
            if (employeeData.val== ""){
                employeeData.val=null;
            }
        }
        sequelize.sync().then(()=>{
            Employees.update(employeeData
            ,{
                where: {employeeNum: employeeData.employeeNum}
            }).then(()=>{
                resolve();
            }).catch((err)=>{
                console.log("emp add fail")
                reject("Employee Update Failed");
            })
        })
    })
}
module.exports.addDepartment=function(departmentData){
    return new Promise(function(resolve,reject){
        for (const val in departmentData){
            if (departmentData.val== ""){
                departmentData.val=null;
            }
        }
        sequelize.sync().then(()=>{
            Departments.create(departmentData).then(()=>{
                resolve("department Added");
            }).catch((err)=>{
                console.log("dep add fail")
                reject("department Add Failed");
            })
        })
       
    })
}
module.exports.updateDepartment=function(departmentData){
    return new Promise(function(resolve,reject){
        for (const val in departmentData){
            if (departmentData[val]== ""){
                departmentData[val]=null;
            }
        }
        sequelize.sync().then(()=>{
            Departments.update(departmentData
            ,{
                where: {departmentId: departmentData.departmentId}
            }).then((data)=>{
                console.log("dep update success")
                resolve();
            }).catch((err)=>{
                console.log("dep add fail")
                reject("department Update Failed");
            })
        })
       
    })
}
module.exports.getDepartmentById= function(num){
    return new Promise(function(resolve,reject){
        console.log("inside gebyid"+ num)
        sequelize.sync().then(function(){
            Departments.findAll({
                where: {departmentId:num}
            }).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject("no results found");
            })
        })
    })
}
module.exports.deleteEmployeeByNum=function(empNum){
    console.log(empNum)
    return new Promise(function(resolve,reject){
        sequelize.sync().then(()=>{
            Employees.destroy({
                where: {employeeNum:empNum}
            }).then(()=>{
                console.log("deleted")
                resolve();
            }).catch((err)=>{
                console.log("delete failed")
                reject();
            })
        })
    })
}