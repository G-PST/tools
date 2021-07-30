var jsonObject = [  {
                     "language": ['python','GAMS'],
                     "name": "PLEXOS",
                     "typical_temporal_scope": 'years',
                     "modeling_paradigm":["Optimization","Data"],
                     "operating_systems": [
                        "Windows"
                    ]
                    },
                    { 
                     "language": ['java','R','GAMS'],
                     "name": "ReEDS",
                     "typical_temporal_scope": "minutes",
                     "modeling_paradigm": ["Data","Engineering/Design"],
                     "operating_systems": [
                        "Windows",
                        "Mac OSX",
                        "Linux"
                    ]
                    }
                 ];


function remove_duplicates(arr) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in seen)) {
            ret_arr.push(arr[i]);
            seen[arr[i]] = true;
        }
    }
    return ret_arr;
}


// var getPair = {};
// var obj = {};
// obj[jsonObject.name] = jsonObject.typical_temporal_scope;
// getPair.push(obj);

var all_language = [];
var all_name = [];
var all_typical_temporal_scope = [];
var all_modeling_paradigm = [];
var all_operating_systems = [];


var all_pair = {};



// e.g., ReEDS: ['R','Python','minutes']
const node_pair = [];
const node_pair_elements = [];



//-----------------------------//
//--- Loop: Extracting Data ---//
//-----------------------------//
for (var i = 0; i < jsonObject.length; i++){


//--- loop name for node 
all_name.push(jsonObject[i].name);
all_language.push(jsonObject[i].language);
all_typical_temporal_scope.push(jsonObject[i].typical_temporal_scope);
all_modeling_paradigm.push(jsonObject[i].modeling_paradigm);
all_operating_systems.push(jsonObject[i].operating_systems);

//--- loop pair for directed graphs
// all_pair[jsonObject[i].name] = jsonObject[i].typical_temporal_scope;


//- name
// add string to be compatible for the format of flare plot
// group_name = group_name.map(i => "main.group_name." + i);
all_pair[jsonObject[i].name] = 
            [...jsonObject[i].language.map(j => "plt.language." + j),
                "plt.typical_temporal_scope." + jsonObject[i].typical_temporal_scope, // it only has one element
             ...jsonObject[i].modeling_paradigm.map(j => "plt.modeling_paradigm." + j),
             ...jsonObject[i].operating_systems.map(j => "plt.operating_systems." + j)
            ];


//- interface

// modeling_paradigm
// all_pair[jsonObject[i].modeling_paradigm] = 
//                                 [...jsonObject[i].language,
//                                 ...jsonObject[i].typical_temporal_scope
//                                 ];



    // for (const key_name in jsonObject[i]) {
        // node_pair[jsonObject[i].name] = jsonObject[i][key_name];
        // console.log(`${jsonObject[i].name}`);
    // }

// node_pair[jsonObject[i].name] = node_pair_elements;

}
//--- End Loop ---//


//--- Make Into Name and Import Format ---//


var getPair = [];


for (i in all_pair) {
    var obj = {};
    
    for (j in all_pair[i]) {
    var modelName = i;  
    obj['name'] = "plt.name."+i;
    obj['imports'] = all_pair[i];
    }

    getPair.push(obj);

}


// console.log()
// console.log("# getPair");
// console.log(getPair);

// console.log()
// console.log("# all_pair");
// console.log(all_pair)



//--- Merge Elements in Array ---//
// merge for each key if having multiple values
all_language          = Array.prototype.concat.apply([], all_language);
all_modeling_paradigm = Array.prototype.concat.apply([], all_modeling_paradigm);
// all_typical_temporal_scope  --> no need to merge
all_operating_systems = Array.prototype.concat.apply([], all_operating_systems);


//--- remove duplicate ---//
all_language                = remove_duplicates(all_language)
all_modeling_paradigm       = remove_duplicates(all_modeling_paradigm)
all_typical_temporal_scope  = remove_duplicates(all_typical_temporal_scope)
all_operating_systems       = remove_duplicates(all_operating_systems)


//--- remove null ---//
all_language                = all_language.filter(function (element) { return element != null; });
all_modeling_paradigm       = all_modeling_paradigm.filter(function (element) { return element != null; });
all_typical_temporal_scope  = all_typical_temporal_scope.filter(function (element) { return element != null; });
all_operating_systems       = all_operating_systems.filter(function (element) { return element != null; });


//--- add prefix to each element ---//
all_language                = all_language.map(j => "plt.language." + j);
all_modeling_paradigm       = all_modeling_paradigm.map(j => "plt.modeling_paradigm." + j);
all_typical_temporal_scope  = all_typical_temporal_scope.map(j => "plt.typical_temporal_scope." + j);
all_operating_systems       = all_operating_systems.map(j => "plt.operating_systems." + j);


var arrayNode = [
                ...all_language,
                ...all_modeling_paradigm,
                ...all_typical_temporal_scope,
                ...all_operating_systems
              ];


var getNode = [];


for (i in arrayNode) {
    var objNode = {};
    objNode['name'] = arrayNode[i];
    

    getNode.push(objNode);
}

// console.log();
// console.log(arrayNode);
console.log([...getPair,...getNode]);


//--------------//
//--- output ---//
//--------------//
// console.log();
// console.log("# lists of name for node");
// // console.log(all_name);
// console.log(all_language);
// console.log(all_typical_temporal_scope);
// console.log(all_modeling_paradigm);
// console.log(all_operating_systems);


// console.log();
// console.log();
// console.log("# pairs for directed graphs");
// console.log(all_pair);

// console.log();
// console.log();
// console.log("# flare_data one");
// console.log(flare_data_one)





// extract data from each array
// jsonObject.forEach(jsonObject => group_language.push(jsonObject.language));

// // merge
// var merged_Array = Array.prototype.concat.apply([], group_language);

// // output
// console.log( JSON.stringify(jsonObject, undefined, 2) );
// console.log("original data:");
// console.log(jsonObject);



