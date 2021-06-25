var trace = {
    type: 'parcoords',
    line: {
      color: 'blue'
    },
    dimensions: [{
      label: 'Lowest Temporal Resolution',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [1,4],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {    
      label: 'Typical Temporal Resolution',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [1,4],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {
      label: 'Highest Temporal Resolution',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [1,4],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {
      label: 'Lowest Temporal Scope',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [1,4],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {    
      label: 'Typical Temporal Scope',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [1,4],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']
    }, {    
      label: 'Largest Temporal Scope',
      range: [1, 9],
    //   constraintrange: [1, 2],
      values: [1,4],
      tickvals: [1,2,3,4,5,6,7,8,9],
      ticktext: ['instant','Milliseconds','Seconds','Minutes','Hours','Days', 'Months','Years','Decades']    }]
  };
  
  var data = [trace]
  
  Plotly.newPlot('plot_parallel', data);

  // -problem is that we cannot show lables/legend
  // -it is good to give a overview, but cannot zoom in or identify a line