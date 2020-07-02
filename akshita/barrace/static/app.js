var data = []
var years = []
var names = []
var dataArray = []

// chart area minus margins
// var chartHeight = height - margin.top - margin.bottom;
// var chartWidth = width - margin.left - margin.right;
d3.json("/timeline").then(jsonData => {
  data.push(jsonData);
  // console.log(data);
  // year_list.forEach(d => dataArray.push(d.value))
  for (var i = 1960; i < 2019; i++) {
    names = [];
    dataArray = [];
    years.push(i)
    var year_list = data[0][i]
    year_list.forEach(function (d) {
      if (d.rank <= 13) {
        // console.log(d.rank)
        dataArray.push(d.value / 10000000)
        names.push(d.name)
      }
      return dataArray, names
    });
    // year_list.forEach(d=> names)


    console.log(names, dataArray)
    // setTimeout(function(){   
      var svgArea = d3.select("#timeline").select("svg");
      if (!svgArea.empty()) {
        svgArea.remove();
      }

      var svgWidth = parseInt(d3.select("#timeline").style("width"));
      var svgHeight = svgWidth - svgWidth / 3.9;
      // var height = 600;
      // var width = 1000;

      // margins
      var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      };

      var width = svgWidth - margin.left - margin.right;
      var height = svgHeight - margin.top - margin.bottom;


      // create svg container
      var svg = d3.select("#timeline").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

      // shift everything over by the margins
      var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // svg container
      // var svgArea = d3.select("#scatter").select("svg");
      // scale y to chart height
      // d3.interval(function () {
      var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataArray)])
        .range([height, 0]);

      // scale x to chart width
      var xScale = d3.scaleBand()
        .domain(names)
        .range([0, width])
        .padding(0.1);

      // create axes
      var yAxis = d3.axisLeft(yScale);
      var xAxis = d3.axisBottom(xScale);

      // set x to the bottom of the chart
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      // set y to the y axis
      chartGroup.append("g")
        .call(yAxis);

      // Create the rectangles using data binding

      // Create the rectangles using data binding
      var barsGroup = chartGroup.selectAll("rect")
        .data(dataArray)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(names[i]))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d))
        .transition()
        .duration(200)
      // .delay(d => height - yScale(d))
      // .attr("fill", "green");

      //Ticker
      d3.select("svg").append("text")
        .attr("x", width - 15)
        .attr("y", height - 400)
        .text(i)
    // },3000)
  }
});

//   .
// // var svgArea = d3.select("#timeline").select("svg");
// var svgWidth= 1000;
// var svgHeight= 600;

//   // var svgWidth= parseInt(d3.select("#timeline").style("width"));
//   // var svgHeight= svgWidth - svgWidth / 3.9;

//   // if (!svgArea.empty()) {
//   //   svgArea.remove();
//   // }

//   var margin = {
//   top: 20,
//   right: 100,
//   bottom: 80,
//   left: 100
// };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// // Create an SVG wrapper, append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// var svg = d3
//   .select("#timeline")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// // Append an SVG group
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// //Axis

// // scale y to chart height
// var yScale = d3.scaleLinear()
//     .domain(names)
//     .range([height, 0]);
//     // .padding(0.1);

// // scale x to chart width
// var xScale = d3.scaleBand()
//     .domain([0, d3.max(dataArray)])
//     .range([0, width]);

// // create axes
// var yAxis = d3.axisLeft(yScale);
// var xAxis = d3.axisTop(xScale);

// // set x to the top of the chart
// chartGroup.append("g")
//     // .attr("transform", `translate(0, 0)`)
//     .call(xAxis);

// // set y to the y axis
// chartGroup.append("g")
//     .call(yAxis);

// // Create the rectangles using data binding
// var barsGroup = chartGroup.selectAll("rect")
//     .data(dataArray)
//     .enter()
//     .append("rect")
//     .attr("y", (d, i) => yScale(names[i]))
//     .attr("x", d => xScale(d))
//     .attr("width", d => width - xScale(d))
//     .attr("height",xScale.bandwidth() )
//     .attr("fill", "green");