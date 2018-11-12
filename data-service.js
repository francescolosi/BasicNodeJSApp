const Sequelize = require('sequelize');
var sequelize =new Sequelize('dbudq477an8lbp','wcgfxewndtvytz', '54defb036c25c84e01d1f24b711d4db536b3c194ae4dbe83a968bab46691a202', {
    host: 'ec2-23-23-101-25.compute-1.amazonaws.com',
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
            Employees.create({
                title: 'Employee1',
                description: 'BTI300'
            }).then(function(Employees){
                console.log("Employees Syncd with DB, now Departments")
                Departments.create({
                    title:'Departments1',
                    description: 'bti300'
                }).then(function(Departments){
                    console.log("departments syncd");
                    resolve();
                }).catch(function(err){
                    reject("unable to sync with DB");
                })
            }).catch(function(err){
                reject("unable to sync with db");
            })
        })
    }
)}
module.exports.getAllEmployees= function(){
    return new Promise(function(resolve, reject){
        sequelize.sync().then(function(){
            Employees.findAll({})
            .then((data)=>{
                resolve(data);
            }).catch(function(err){
                reject("getAll failed");
            })
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
            if (employeeData.val== null){
                employeeData.val="";
            }
        }
        sequelize.sync().then(()=>{
            Employees.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressCity:employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum:employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            }).then(()=>{
                resolve("employee Added");
            }).catch(()=>{
                console.log("emp add fail")
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
                resolve(data);
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
            if (employeeData.val== null){
                employeeData.val="";
            }
        }
        sequelize.sync().then(()=>{
            Employees.update({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressCity:employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum:employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            },{
                where: {employeeNum: employeeData.employeeNum}
            }).then(()=>{
                resolve("employee Added");
            }).catch(()=>{
                console.log("emp add fail")
                reject("Employee Update Failed");
            })
        })
    })
}