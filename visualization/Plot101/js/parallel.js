var trace = {
    type: 'parcoords',
    line: {
      color: 'blue'
    },
    dimensions: [{
      label: 'Model Name',
      range: [1, 13],
    //   constraintrange: [1, 2],
      values: [1,2,3,4,5,6,7,8,9,10,11,12,13],
      tickvals: [1,2,3,4,5,6,7,8,9,10,11,12,13],
      ticktext: ['PLEXOS','GridLAB-D','ReEDS','MATPOWER','PowerModels.jl','PowerSimulations.jl','ANDES','SAM','SWITCH','PandaPower','OpenDSS','Spine Toolbox','PSST']
    }, {    
      label: 'Lowest Temporal Resolution',
      range: [1, 9],
      //   constraintrange: [1, 2],
      values: [8,8,9,8,5,7,2,5,8,8,8,,6],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {    
      label: 'Typical Temporal Resolution',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [5,5,5,5,5,4,2,5,5,5,4,,5],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {
      label: 'Highest Temporal Resolution',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [4,2,5,8,1,3,2,4,4,1,3,,5],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {
      label: 'Smallest Temporal Scope',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [5,4,8,4,1,1,1,4,8,1,3,,5],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {    
      label: 'Typical Temporal Scope',
      range: [1, 9,9],
    //   constraintrange: [1, 2],
      values: [8,5,7,5,8,7,2,5,9,5,4,,5],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {    
      label: 'Largest Temporal Scope',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [9,8,9,8,9,8,2,5,9,8,8,,6],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']    }]
  };
  
  var data = [trace]
  
  Plotly.newPlot('plot_parallel', data);

  // -problem is that we cannot show lables/legend
  // -it is good to give a overview, but cannot zoom in or identify a line
