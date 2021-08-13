function drawChart(container, data){
    const chartWidth = 400;
    const chartHeight = 400;
   
    const xScale = d3.scaleLinear() 
            .domain([0, data.length])
            .range([0, chartWidth]);
   
    const yScale = d3.scaleLinear()
                      .domain([0, d3.max(data)]) 
                      .range([0, chartHeight]);
   
   // First and only difference, instead of creating SVG, we are appending it to container
    const svg = d3.select(container).append('svg')
       .attr('width',chartWidth)
       .attr('height',chartHeight)
 
    svg.append("g")
       .attr("fill", 'aqua')
       .selectAll("rect")
       .data(data)
       .join("rect")
       .attr("x", (d, i) => xScale(i))
       .attr("y", d => -yScale(d)+chartHeight)
       .attr("height", d => yScale(d))
       .attr("width", 10);
 }