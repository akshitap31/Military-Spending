function disableBtn() {
  document.getElementById("myBtn").disabled = true;
  // d3.select("#myBtn").style("font")  
  document.getElementById("selDataset").disabled = true;
  
}

function enableBtn() {
  document.getElementById("myBtn").disabled = false;
  document.getElementById("selDataset").disabled = false;
  
}
// var colors=[]
// d3.select(window).on("resize", updateBar)
d3.selectAll("#selDataset").on("change", updateBar);
d3.select("#myBtn").on("click", updateBar);
  // console.log("hi")
// This function is called when a dropdown menu item is selected
function updateBar() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  var dataset = dropdownMenu.property("value");
  if (dataset == 'GDP') {
    GDPRace()
  }

  if (dataset == 'Amount') {
    amountRace()
  }
}
function GDPRace(){
  disableBtn()
  // d3.select("button").attr("disabled")
    var data = []
    var years = []
    var names = []
    var dataArray = []
d3.json("/timelinegdp").then(jsonData => {
  data.push(jsonData);
  d3.json("/colors").then(colorData => {
    
  var intervalId = setInterval(showBar, 500);
  var i = 1960;

  function showBar() {

    if (i == 2019) {
      enableBtn()
      // d3.select("button").attr("disabled", null)
      clearInterval(intervalId);
    }
    // years = [];
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
      // dataArray=dataArray.reverse()
      // names=names.reverse()
      
      return dataArray, names
      // console.log(dataArray)
    });
    var svgArea = d3.select("#timeline").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    var svgWidth = parseInt(d3.select("#timeline").style("width"));
    var svgHeight = svgWidth - svgWidth / 1.5;

    // margins
    var margin = {
      top: 90,
      right: 70,
      bottom: 40,
      left: 170
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    // d3.select("#timeline").html("");

    // create svg container
    var svg = d3.select("#timeline").append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    // shift everything over by the margins
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var xScale = d3.scaleLinear()
      .domain([0, d3.max(dataArray)+1])
      .range([0, width]);

    // scale x to chart width
    var yScale = d3.scaleBand()
      .domain(names)
      .range([0, height])
      .padding(0.1);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisTop(xScale);

    // set x to the bottom of the chart
    chartGroup.append("g")
      // .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .attr("class", "y axis")
      
    // set y to the y axis
    chartGroup.append("g")
      .call(yAxis)
      .attr("class", "x axis")
      .attr("id", "x-axis");

      var t = d3.transition()
      .duration(750);
    var barsGroup = chartGroup.selectAll("rect")
      .data(dataArray)
      .enter()
      .append("rect")
      .attr("y", (d, i) => yScale(names[i]))
      .attr("x", d => console.log(xScale(d)))
      .attr("height", yScale.bandwidth())
      .attr("width", d => xScale(d))
      .style("opacity", 0.80)
      .style("fill", function(d, i) {
         var picked=colorData.find(data=> data.country==names[i]).color
          return picked
        })
      .transition(t)
    //Ticker
    d3.select("svg").append("text")
      .attr("x", width - 35)
      .attr("y", 40)
      .text(i)
      .attr("class", "ticker-text")
    //x label
    chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)
      .append("text")
      .attr("x", -130)
      .attr("y", -620)
      .classed("x label", true)
      .text("Annual Military Expenditure(as % of GDP)");
    i++;
  };
});
});
}
function amountRace(){
  disableBtn()
  // d3.select("button").attr("disabled")
    var data = []
    var years = []
    var names = []
    var dataArray = []
d3.json("/timeline").then(jsonData => {
  data.push(jsonData);
  d3.json("/colors").then(colorData => {
    
  var intervalId = setInterval(showBar, 500);
  var i = 1960;

  function showBar() {

    if (i == 2019) {
      enableBtn()
      // d3.select("button").attr("disabled", null)
      clearInterval(intervalId);
    }
    // years = [];
    names = [];
    dataArray = [];
    years.push(i)
    var year_list = data[0][i]
    year_list.forEach(function (d) {
      if (d.rank <= 13) {
        // console.log(d.rank)
        dataArray.push(d.value/1000000000)
        names.push(d.name)
      }
      // dataArray=dataArray.reverse()
      // names=names.reverse()
      
      return dataArray, names
      // console.log(dataArray)
    });
    var svgArea = d3.select("#timeline").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    var svgWidth = parseInt(d3.select("#timeline").style("width"));
    var svgHeight = svgWidth - svgWidth / 1.5;

    // margins
    var margin = {
      top: 90,
      right: 70,
      bottom: 40,
      left: 170
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    // d3.select("#timeline").html("");

    // create svg container
    var svg = d3.select("#timeline").append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    // shift everything over by the margins
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var xScale = d3.scaleLinear()
      .domain([0, d3.max(dataArray)+50])
      .range([0, width]);

    // scale x to chart width
    var yScale = d3.scaleBand()
      .domain(names)
      .range([0, height])
      .padding(0.1);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisTop(xScale);

    // set x to the bottom of the chart
    chartGroup.append("g")
      // .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .attr("class", "y axis")
      
    // set y to the y axis
    chartGroup.append("g")
      .call(yAxis)
      .attr("class", "x axis")
      .attr("id", "x-axis");

      var t = d3.transition()
      .duration(750);
    var barsGroup = chartGroup.selectAll("rect")
      .data(dataArray)
      .enter()
      .append("rect")
      .attr("y", (d, i) => yScale(names[i]))
      .attr("x", d => console.log(xScale(d)))
      .attr("height", yScale.bandwidth())
      .attr("width", d => xScale(d))
      .style("opacity", 0.80)
      .style("fill", function(d, i) {
         var picked=colorData.find(data=> data.country==names[i]).color
          return picked
        })
      .transition(t)

    d3.select("svg").append("text")
      .attr("x", width - 35)
      .attr("y", 40)
      .text(i)
      .attr("class", "ticker-text")
    //x label
    chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)
      .append("text")
      .attr("x", -130)
      .attr("y", -620)
      .classed("x label", true)
      .text("Annual Military Expenditure(in Bn USD)");
    i++;
  };
});
});
}
amountRace()
