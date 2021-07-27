var jsonObject = [{"language": ['java','python','GAMS']},
                  {"language": ['R','C','C++']}
                  ];

var group_language = [];


jsonObject.forEach(jsonObject => group_language.push(jsonObject.language));

var merged_Array = Array.prototype.concat.apply([], group_language);

// console.log( JSON.stringify(jsonObject, undefined, 2) );

console.log(group_language);
console.log(merged_Array);