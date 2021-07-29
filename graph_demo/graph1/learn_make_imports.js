var jsonObject = [  {
                     "language": ['python','GAMS'],
                     "name": "PLEXOS",
                     "typical_temporal_scope": "years",
                     "modeling_paradigm":["Optimization","Data"]
                    },
                    { 
                     "language": ['java','R','GAMS'],
                     "name": "ReEDS",
                     "typical_temporal_scope": "minutes",
                     "modeling_paradigm": ["Data","Engineering/Design"]
                    }
                 ];


// var getData = {};
// var obj = {};
// obj[jsonObject.name] = jsonObject.typical_temporal_scope;
// getData.push(obj);

var all_language = [];
var all_name = [];
var all_typical_temporal_scope = [];
var all_modeling_paradigm = [];

var all_pair = {};
var getData = [];


// e.g., ReEDS: ['R','Python','minutes']
const node_pair = [];
const node_pair_elements = [];

//----------------//
//--- for loop ---//
//----------------//
for (var i = 0; i < jsonObject.length; i++){


//--- loop name for node 
all_name.push(jsonObject[i].name);
all_language.push(jsonObject[i].language);
all_typical_temporal_scope.push(jsonObject[i].typical_temporal_scope);
all_modeling_paradigm.push(jsonObject[i].modeling_paradigm);

//--- loop pair for directed graphs
// all_pair[jsonObject[i].name] = jsonObject[i].typical_temporal_scope;
all_pair[jsonObject[i].name] = [...jsonObject[i].language,
                                jsonObject[i].typical_temporal_scope
                                ];


// all_pair[jsonObject[i].name] = [...jsonObject[i].language,
//                                 ...jsonObject[i].typical_temporal_scope
//                                 ];


// getData.push(all_pair);


    // for (const key_name in jsonObject[i]) {

        
        // node_pair[jsonObject[i].name] = jsonObject[i][key_name];
        // node_pair_elements.push(jsonObject[i][key_name]);
        // node_pair_elements = jsonObject[i][key_name];

        // console.log(`${jsonObject[i].name}: ${jsonObject[i][key_name]}`);
        // console.log(`${jsonObject[i].name}: ${jsonObject[i].typical_temporal_scope}`);
        
        // console.log(`${jsonObject[i].name}`);
        
    // }

// node_pair[jsonObject[i].name] = node_pair_elements;

}

// console.log(node_pair);
// console.log(node_pair_elements);



// merge for each key if having multiple values
all_language = Array.prototype.concat.apply([], all_language);
all_modeling_paradigm = Array.prototype.concat.apply([], all_modeling_paradigm);



//--- output ---//
console.log();
console.log("# lists of name for node");
console.log(all_name);
console.log(all_language);
console.log(all_typical_temporal_scope);
console.log(all_modeling_paradigm);

console.log();
console.log();
console.log("# pairs for directed graphs");
console.log(all_pair);
// console.log(getData);






// extract data from each array
// jsonObject.forEach(jsonObject => group_language.push(jsonObject.language));

// // merge
// var merged_Array = Array.prototype.concat.apply([], group_language);

// // output
// console.log( JSON.stringify(jsonObject, undefined, 2) );
// console.log("original data:");
// console.log(jsonObject);



