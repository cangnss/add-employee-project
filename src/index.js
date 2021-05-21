// Elementleri seçme

import {Request} from './requests';
import {UI} from './ui';

const form = document.querySelector('#employee-form');
const nameInput = document.querySelector('#name');
const departmentInput = document.querySelector('#department');
const salaryInput = document.querySelector('#salary');
const employeesList = document.querySelector('#employees');
const updateEmployeeButton = document.querySelector('#update');

const request = new Request('http://localhost:3000/employees');

// request.get()
//         .then(employees => console.log(employees))
//         .catch(err => console.log(err));

// request.post({name:"Ceren Güneş",department:"Tasarım",salary:6000})
//         .then(employee => console.log(employee))
//         .catch(err => console.log(err))

// request.put(1,{name:"Selma Güneş",department:"Ev hanımı",salary:10000})
//         .then(employee => console.log(employee))
//         .catch(err => console.log(err))

// request.delete(4)
//         .then(employee => console.log(employee))
//         .catch(err => console.log(err))

const ui = new UI();

let updateState = null;

eventListeners();

function eventListeners(){

    document.addEventListener('DOMContentLoaded',getAllEmployees);
    form.addEventListener('submit',addEmployee);
    employeesList.addEventListener('click',updateOrDelete);
    updateEmployeeButton.addEventListener('click',updateEmployee);
}

function getAllEmployees(){

    request.get()
            .then(employees => {
                ui.addAllEmployeeToUI(employees);
            })
            .catch(err => console.log(err));

}

function addEmployee(e){

    const employeeName = nameInput.value.trim();
    const employeeDepartment = departmentInput.value.trim();
    const employeeSalary = salaryInput.value.trim();

    if(employeeName === "" && employeeDepartment === "" && employeeSalary === ""){
        alert("Lütfen tüm alanları doldurunuz.");
    }else{
        request.post({name:employeeName,department:employeeDepartment,salary:Number(employeeSalary)})
                .then(employee => {
                    ui.addEmployeeToUI(employee);
                })
                .catch(err => console.log(err));
    }



    ui.clearInputs();
    e.preventDefault();
}

function updateOrDelete(e){

    if(e.target.id === "update-employee"){
        //güncelleme yapılacak
        updateEmployeeController(e.target.parentElement.parentElement)
    }
    else if(e.target.id === "delete-employee"){
        //silme işi yapılacak
        deleteEmployee(e.target);
    }
}

function deleteEmployee(targetEmployee){
    const id = targetEmployee.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    console.log(id)
    request.delete(id)
            .then(message => {
                ui.deleteEmployeeFromUI(targetEmployee.parentElement.parentElement);
            })
            .catch(err => console.log(err));

}

function updateEmployeeController(targetEmployee){

    ui.toggleUpdateButton(targetEmployee);
    if(updateState === null){
        updateState = {
            updateId : targetEmployee.children[0].textContent,
            updateParent : targetEmployee
        }
    }else{
        updateState = null;
    }

}

function updateEmployee(){
    if(updateState){
        const data = {name:nameInput.value.trim(), department:departmentInput.value.trim(),salary:Number(salaryInput.value.trim())};
        request.put(updateState.updateId,data)
                .then((updatedEmployee)=>{
                    ui.updateEmployeeOnUI(updatedEmployee,updateState.updateParent);
                })
                .catch(err => console.log(err));
    }
}