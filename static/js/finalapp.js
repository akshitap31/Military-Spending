var data = []
var years = []
var names = []
var dataArray = []
var colors=[]
// d3.selectAll("#selDataset").on("change", updatePlotly);
d3.select(window).on("resize", updateBar)
d3.selectAll("#selDataset").on("change", updateBar);

// This function is called when a dropdown menu item is selected
function updateBar() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");

  if (dataset === 'GDP') {
    GDPRace()
  }

  if (dataset === 'Amount') {
    amountRace()
  }
}
function GDPRace(){
d3.json("/timelinegdp").then(jsonData => {
  data.push(jsonData);
  d3.json("/colors").then(colorData => {
  // console.log(data);
  // year_list.forEach(d => dataArray.push(d.value))
  // setTimeout(function(){
  // for (var i = 1960; i < 2019; i++) {

  var intervalId = setInterval(showBar, 500);
  var i = 1960;

  function showBar() {
    console.log(i);

    if (i == 2019) {
      clearInterval(intervalId);
    }
    names = [];
    dataArray = [];
    years.push(i)
    var year_list = data[0][i]
    year_list.forEach(function (d) {
      if (d.rank <= 13) {
        // console.log(d.rank)
        dataArray.push(d.value)
        names.push(d.name)
      }
      return dataArray, names
    });
    // year_list.forEach(d=> names)


    // console.log(names, dataArray)

    var svgArea = d3.select("#timeline").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    var svgWidth = parseInt(d3.select("#timeline").style("width"));
    var svgHeight = svgWidth - svgWidth / 1.75;
    // var height = 600;
    // var width = 1000;

    // margins
    var margin = {
      top: 50,
      right: 50,
      bottom: 80,
      left: 60
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    d3.select("#timeline").html("");

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
      .domain([0, d3.max(dataArray)+1])
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
      .call(xAxis)
      .attr("class", "x axis")
      .attr("id", "x-axis");

    // set y to the y axis
    chartGroup.append("g")
      .call(yAxis)
      .attr("class", "y axis");

    // Create the rectangles using data binding
    // var color=[
    //     "#3e95cd",
    //     "#8e5ea2",
    //     "#3cba9f",
    //     "#e8c3b9",
    //     "#c45850",
    //     "#ed6dc5",
    //     "#fa4b77",
    //     "#93edd8",
    //     "#b4f58e",
    //     "#de7880",
    //     "#9378de",
    //     "#f0f084",
    //     "#c2c3c4",
    //   ]
    // var color=d3.scale.ordinal().range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    // var colorScale = d3.scale.category10();
    // Create the rectangles using data binding
    var barsGroup = chartGroup.selectAll("rect")
      .data(dataArray)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(names[i]))
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d))
      .style("opacity", 0.50)
      .style("fill", function(d, i) {
        
          // colors.push(jsonData);
          var picked=colorData.find(data=> data.country==names[i]).color
          return picked
        }
        )
        
        // if(names[i]=="China"){return "#c2c3c4"};
        //   if(names[i]=="Saudi Arabia"){return "#f0f084"
      .transition()
      .duration(200)
//Rotate x ticks
      d3.select("#x-axis")
      .selectAll("text")
      .attr("dx", "-0.4em")
      .attr("dy", "1.24em")
      .attr("transform", "rotate(-16)" );
    //Ticker
    d3.select("svg").append("text")
      .attr("x", width - 35)
      .attr("y", margin.top)
      .text(i)
      .attr("class", "ticker-text")
    //x label
    chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)
      .append("text")
      .attr("x", -90)
      .attr("y", 50)
      // .attr("value", "income") // value to grab for event listener
      .classed("x label", true)
      .text("Countries (Top 13)");

    //ylabel
    chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    // .attr("y", 0 - margin.left)
    // .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .append("text")
    .attr("x", 0 - (height / 1.25))
    .attr("y", 20 - margin.left)
    // .attr("value", "obesity") // value to grab for event listener
    .classed("y label", true)
    .text("Annual Military Expenditure(as % of GDP)");

    i++;
  };
});
});
}
function amountRace(){
  d3.json("/timeline").then(jsonData => {
    data.push(jsonData);
    d3.json("/colors").then(colorData => {
    // console.log(data);
    // year_list.forEach(d => dataArray.push(d.value))
    // setTimeout(function(){
    // for (var i = 1960; i < 2019; i++) {
  
    var intervalId = setInterval(showBarAmt, 500);
    var i = 1960;
  
    function showBarAmt() {
      console.log(i);
  
      if (i == 2019) {
        clearInterval(intervalId);
      }
      names = [];
      dataArray = [];
      years.push(i)
      var year_list = data[0][i]
      year_list.forEach(function (d) {
        if (d.rank <= 13) {
          // console.log(d.rank)
          dataArray.push(d.value / 1000000000)
          names.push(d.name)
        }
        return dataArray, names
      });
      // year_list.forEach(d=> names)
  
  
      // console.log(names, dataArray)
  
      var svgArea = d3.select("#timeline").select("svg");
      if (!svgArea.empty()) {
        svgArea.remove();
      }
  
      var svgWidth = parseInt(d3.select("#timeline").style("width"));
      var svgHeight = svgWidth - svgWidth / 1.75;
      // var height = 600;
      // var width = 1000;
  
      // margins
      var margin = {
        top: 50,
        right: 50,
        bottom: 80,
        left: 60
      };
  
      var width = svgWidth - margin.left - margin.right;
      var height = svgHeight - margin.top - margin.bottom;
      d3.select("#timeline").html("");

  
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
        .domain([0, d3.max(dataArray)+50])
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
        .call(xAxis)
        .attr("class", "x axis")
        .attr("id", "x-axis");
  
      // set y to the y axis
      chartGroup.append("g")
        .call(yAxis)
        .attr("class", "y axis");
  
      // Create the rectangles using data binding
      // var color=[
      //     "#3e95cd",
      //     "#8e5ea2",
      //     "#3cba9f",
      //     "#e8c3b9",
      //     "#c45850",
      //     "#ed6dc5",
      //     "#fa4b77",
      //     "#93edd8",
      //     "#b4f58e",
      //     "#de7880",
      //     "#9378de",
      //     "#f0f084",
      //     "#c2c3c4",
      //   ]
      // var color=d3.scale.ordinal().range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
      // var colorScale = d3.scale.category10();
      // Create the rectangles using data binding
      var barsGroup = chartGroup.selectAll("rect")
        .data(dataArray)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(names[i]))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d))
        .style("opacity", 0.60)
        .style("fill", function(d, i) {
          
            // colors.push(jsonData);
            var picked=colorData.find(data=> data.country==names[i]).color
            return picked
          }
          )
          
          // if(names[i]=="China"){return "#c2c3c4"};
          //   if(names[i]=="Saudi Arabia"){return "#f0f084"
        .transition()
        .duration(200)
  //Rotate x ticks
        d3.select("#x-axis")
        .selectAll("text")
        .attr("dx", "-0.4em")
        .attr("dy", "1.24em")
        .attr("transform", "rotate(-16)" );
      //Ticker
      d3.select("svg").append("text")
        .attr("x", width - 35)
        .attr("y", margin.top)
        .text(i)
        .attr("class", "ticker-text")
      //x label
      chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .append("text")
        .attr("x", -90)
        .attr("y", 50)
        // .attr("value", "income") // value to grab for event listener
        .classed("x label", true)
        .text("Countries (Top 13)");
  
      //ylabel
      chartGroup.append("g")
      .attr("transform", "rotate(-90)")
      // .attr("y", 0 - margin.left)
      // .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .append("text")
      .attr("x", 0 - (height / 1.25))
      .attr("y", 20 - margin.left)
      // .attr("value", "obesity") // value to grab for event listener
      .classed("y label", true)
      .text("Annual Military Expenditure(in Bn USD)");
  
      i++;
    };
  });
  });
  }
  GDPRace()
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