var group_all = [{"name":"main.group_name.PLEXOS"},{"name":"main.group_name.GridLAB-D"},{"name":"main.group_name.ReEDS"},{"name":"main.group_name.MATPOWER"},{"name":"main.group_name.PowerModels-jl"},{"name":"main.group_name.PowerSimulations-jl"},{"name":"main.group_name.ANDES"},{"name":"main.group_name.SAM"},{"name":"main.group_name.SWITCH"},{"name":"main.group_name.PandaPower"},{"name":"main.group_name.OpenDSS"},{"name":"main.group_name.Spine Toolbox"}];



const fs = require('fs');
fs.writeFile("/Users/pchanpiw/Documents/Git_PTN111/tools/graph_demo/graph1/save_file.json", JSON.stringify(group_all), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 

console.log(group_all);