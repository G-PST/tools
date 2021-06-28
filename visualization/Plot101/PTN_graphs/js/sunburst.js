var data = [{
    type: "sunburst",
    labels: ["Language", ".NET", "Julia", "GAMS", "Python", "ReEDS","ReEDS", "Spine Toolbox", "MATLAB", "MATPOWER", "SWITCH", "PandaPower", "ANDES", "C++", "GridLAB-D","PowerModels.jl", "PowerSimulations.jl", "PLEXOS","Augur","SubModel1","SubModel2","SubModel3","SubModelA","SubModelB"],
    parents: ["", "Language", "Language", "Language","Language", "GAMS","Python","GAMS","Language", "MATLAB","Python","Python","Python", "Language", "C++", "Julia", "Julia", ".NET", "GAMS","Spine Toolbox","Spine Toolbox","Spine Toolbox","PLEXOS","PLEXOS"],
    values:  [10, 10, 10, 10, 10, 5, 5, 10, 10, 5, 5, 5, 5 , 5, 10, 5, 5, 5,5, 2,4,6,4,2],
    outsidetextfont: {size: 20, color: "#377eb8"},
    leaf: {opacity: 0.4},
    marker: {line: {width: 2}},
  }];
  
  var layout = {
    margin: {l: 0, r: 0, b: 0, t: 0},
    width: 800,
    height: 800
  };
  
  
  Plotly.newPlot('plot_sunbrust', data, layout);

// Issues of a tool having multiples languages, e.g., ReEDS uses Python + GAMS. It will only show one.  