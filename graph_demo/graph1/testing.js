var jsonObject = [{"language": ['java','python','GAMS']},
                  {"language": ['R','C','C++']}
                  ];


var group_language = [];


jsonObject.forEach(jsonObject => group_language.push(jsonObject.language));

var merged_Array = Array.prototype.concat.apply([], group_language);

// console.log( JSON.stringify(jsonObject, undefined, 2) );

// console.log(group_language);
// console.log(merged_Array);





var group_all = [{"name":"main.group_name.PLEXOS"},{"name":"main.group_name.GridLAB-D"},{"name":"main.group_name.ReEDS"},{"name":"main.group_name.MATPOWER"},{"name":"main.group_name.PowerModels-jl"},{"name":"main.group_name.PowerSimulations-jl"},{"name":"main.group_name.ANDES"},{"name":"main.group_name.SAM"},{"name":"main.group_name.SWITCH"},{"name":"main.group_name.PandaPower"},{"name":"main.group_name.OpenDSS"},{"name":"main.group_name.Spine Toolbox"}];

// const obj = {group_all}

const fs = require('fs');
fs.writeFile("/Users/pchanpiw/Documents/Git_PTN111/tools/graph_demo/graph1/save_file.json", JSON.stringify(group_all), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

console.log(obj);