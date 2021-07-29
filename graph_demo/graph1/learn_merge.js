var jsonObject = [{"language": ['java','python','GAMS']},
                  {"language": ['R','C','C++']}
                  ];

var group_language = [];

// extract data from each array
jsonObject.forEach(jsonObject => group_language.push(jsonObject.language));

// merge
var merged_Array = Array.prototype.concat.apply([], group_language);

// output
console.log( JSON.stringify(jsonObject, undefined, 2) );
console.log(merged_Array);




