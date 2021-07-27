const all_issues = '{"name":"John", "age":30, "city":"New York"}';

const obj = JSON.parse(all_issues);




const data = [
   {
     name: 'Bob',
     gender: 'male',
     age: 34,
   },
   {
     name: 'Carol',
     gender: 'female',
     age: 36,
   },
   {
     name: 'Ted',
     gender: 'male',
     age: 38,
   },
   {
     name: 'Jack',
     gender: 'female',
     age: 40,
   },
 ];


let name_list = "";
let age_list = "";


data.forEach(i => {
name_list += i.name + ", ";
// if(!i.name) i.name = "missing_name";

age_list += i.age + ",";

});

console.log(name_list);
console.log();
console.log(age_list);

// data process
// let name_list = "";

// issue_data.forEach(i => {
// name_list += i.highest_spatial_resolution + ", ";
// // if(!i.name) i.name = "missing_name";
// });

 // output data
// console.log(data.name + data.age);