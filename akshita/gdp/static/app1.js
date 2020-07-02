
var svgArea = d3.select("#timeline").select("svg");
var svgWidth= parseInt(d3.select("#scatter").style("width"));
var svgHeight= svgWidth - svgWidth / 3.9;
var margin = {
  top: 20,
  right: 100,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#timeline")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Axis
  var yScale = d3.scaleLinear()
  .domain([0, d3.max(dataArray)])
  .range([height, 0]);

// scale x to chart width
var xScale = d3.scaleBand()
  .domain(dataCategories)
  .range([0, width])
  .padding(0.1);
