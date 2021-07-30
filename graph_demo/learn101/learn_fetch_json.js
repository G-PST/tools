const fetch = require('node-fetch');

let url = "https://gpst-tools.herokuapp.com/api/tools";

let settings = { method: "Get" };

var data_json;


// fetch(url, settings)
//     .then(res => res.json())
//     .then(data => data_json = data);


// console.log(data_json)


let jsondata;    
fetch(url).then(
        function(u){ return u.json();}
      ).then(
        function(json_fetch_data){
          jsondata = JSON.stringify(json_fetch_data);
          console.log(jsondata);
        }
      )


