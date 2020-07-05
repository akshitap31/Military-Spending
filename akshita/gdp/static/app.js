// Make responsive function
      var svgArea = d3.select("#gdp").select("svg");
      var svgWidth = parseInt(d3.select("#gdp").style("width"));
      var svgHeight = svgWidth - svgWidth / 3.9;
      // var height = 600;
      // var width = 1000;

      // margins
      var margin = {
        top: 50,
        right: 50,
        bottom: 100,
        left: 70
      };

      var width = svgWidth - margin.left - margin.right;
      var height = svgHeight - margin.top - margin.bottom;

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  d3.select("#gdp").html("");
  d3.select("tbody").html("");
  
 
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var value = dropdownMenu.property("value");

  var url=`/amountdata/${value}`
  var gdpurl=`/gdpdata/${value}`
    // Import data from an external CSV file
    d3.json(url).then(function(amtData) {
      console.log(amtData);
      d3.json(gdpurl).then(function(gdpData) {
        console.log(gdpData);
    //   // Create scaling functions
        if (amtData.length ===0){
          d3.select("#gdp").append("h3").attr("class", "error-text").text("Oops! No Data Found for your search, try another Country");
                  }
        else{
          var svg = d3.select("#gdp").append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);
        
        // shift everything over by the margins
        var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      var xTimeScale = d3.scaleLinear()
        .domain(d3.extent(amtData, d => +d.year))
        .range([0, width]);
    
      var yLinearScale1 = d3.scaleLinear()
        .domain([0, d3.max(amtData, d => d.amount)])
        .range([height, 0]);
    
      var yLinearScale2 = d3.scaleLinear()
        .domain([0, d3.max(gdpData, d => d.gdp)])
        .range([height, 0]);
    
    //   // Create axis functions
      var bottomAxis = d3.axisBottom(xTimeScale)
        // .tickFormat(d3.timeFormat("%Y"));
      var leftAxis = d3.axisLeft(yLinearScale1);
      var rightAxis = d3.axisRight(yLinearScale2);
    
      // Add x-axis
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
      // Add y1-axis to the left side of the display
      chartGroup.append("g")
        // Define the color of the axis text
        .classed("green", true)
        .call(leftAxis);
    
      // Add y2-axis to the right side of the display
      chartGroup.append("g")
        // Define the color of the axis text
        .classed("blue", true)
        .attr("transform", `translate(${width}, 0)`)
        .call(rightAxis);
    
      // Line generators for each line
      var line1 = d3.line()
        .x(d => xTimeScale(d.year))
        .y(d => yLinearScale1(d.amount));
    
      var line2 = d3.line()
        .x(d => xTimeScale(d.year))
        .y(d => yLinearScale2(d.gdp));
    
      // Append a path for line1
      chartGroup.append("path")
        .data([amtData])
        .attr("d", line1)
        .classed("line green", true);
    
      // Append a path for line2
      chartGroup.append("path")
        .data([gdpData])
        .attr("d", line2)
        .classed("line blue", true);
      // Append axes titles
      chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .classed("amt-text text", true)
        .text("Expenditure (in 100,000 USD)");
    
      chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
        .classed("gdp-text text", true)
        .text("Military Expenditure as % of GDP");
      }
  var url2=`/ranktable/${value}`
  if (amtData.length ===0){
    // d3.select("table").html("");
  
    d3.select("tbody").append("tr").append("td").attr("rowspan", "4").attr("colspan", "5").text("Oops! No Data Found for your search, try another Country");
  }
  else{

  d3.json(url2).then(function(tableData) {

    // console.log(tableData)
    var table=d3.select("#table")
  table.select("tbody").selectAll("tr")
  .data(tableData)
  .enter()
  .append("tr")
  .html(function(d){
    return `<td>${d["Year"]}</td><td>${d["Amount (in 1000 USD)"]}</td><td>${d["Amount (in % of GDP)"]}</td><td>${d["Rank(Amount)"]}</td><td>${d["Rank(Share of GDP)"]}</td>`;
  })
});
  }
});
}).catch(function(error) {
  console.log(error);
});
}
updatePlotly()  