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
    var svgHeight = svgWidth - svgWidth / 1.75;

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
      // d3.selectAll("g")
      // .data(dataArray)
      // .
      // .tween("text", function(d, i) {
      //   // const v0 = this.textContent || "0";
      //   // const v1 = d.value;
      //   // const j = d3.interpolateRound(d.value);
      //   // return t => this.textContent = j(t);
      //   return d.value
      // });
// //Rotate x ticks
//       d3.select("#x-axis")
//       .selectAll("text")
//       .attr("dx", "-0.4em")
//       .attr("dy", "1.24em")
//       .attr("transform", "rotate(-16)" );
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

    // //ylabel
    // chartGroup.append("g")
    // .attr("transform", "rotate(-90)")
    // // .attr("y", 0 - margin.left)
    // // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    // .append("text")
    // .attr("x", 0 - (height / 1.25))
    // .attr("y", 20 - margin.left)
    // .classed("y label", true)
    // .text("Annual Military Expenditure(as % of GDP)");

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
    
  var intervalId = setInterval(showBar, 50);
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
    var svgHeight = svgWidth - svgWidth / 1.75;

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
      // d3.selectAll("g")
      // .data(dataArray)
      // .
      // .tween("text", function(d, i) {
      //   // const v0 = this.textContent || "0";
      //   // const v1 = d.value;
      //   // const j = d3.interpolateRound(d.value);
      //   // return t => this.textContent = j(t);
      //   return d.value
      // });
// //Rotate x ticks
//       d3.select("#x-axis")
//       .selectAll("text")
//       .attr("dx", "-0.4em")
//       .attr("dy", "1.24em")
//       .attr("transform", "rotate(-16)" );
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
      .text("Annual Military Expenditure(in Bn USD)");

    // //ylabel
    // chartGroup.append("g")
    // .attr("transform", "rotate(-90)")
    // // .attr("y", 0 - margin.left)
    // // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    // .append("text")
    // .attr("x", 0 - (height / 1.25))
    // .attr("y", 20 - margin.left)
    // .classed("y label", true)
    // .text("Annual Military Expenditure(as % of GDP)");

    i++;
  };
});
});
}
amountRace()
  // disableBtn()
  // // d3.select("button").attr("disabled")
  //     var data = []
  //     var years = []
  //     var names = []
  //     var dataArray = []
  // d3.json("/timeline").then(jsonData => {
  //   data.push(jsonData);
  //   d3.json("/colors").then(colorData => {
  //   // console.log(data);
  //   // year_list.forEach(d => dataArray.push(d.value))
  //   // setTimeout(function(){
  //   // for (var i = 1960; i < 2019; i++) {
      
  //   var intervalId = setInterval(showBarAmt, 750);
  //   var i = 1960;
  
  //   function showBarAmt() {
  //     // console.log(i);
  //     if (i == 2019) {
  //       enableBtn()
  //       // d3.select("button").attr("disabled", null)
  //       clearInterval(intervalId);
  //     }
  //     names = [];
  //     dataArray = [];
  //     // years = [];
  //     years.push(i)
  //     var year_list = data[0][i]
  //     year_list.forEach(function (d) {
  //       if (d.rank <= 13) {
  //         // console.log(d.rank)
  //         dataArray.push(d.value / 1000000000)
  //         names.push(d.name)
  //       }
  //       return dataArray, names
  //     });
  //     var svgArea = d3.select("#timeline").select("svg");
  //     if (!svgArea.empty()) {
  //       svgArea.remove();
  //     }
  
  //     var svgWidth = parseInt(d3.select("#timeline").style("width"));
  //     var svgHeight = svgWidth - svgWidth / 1.75;
  
  //     // margins
  //     var margin = {
  //       top: 50,
  //       right: 50,
  //       bottom: 80,
  //       left: 60
  //     };
  
  //     var width = svgWidth - margin.left - margin.right;
  //     var height = svgHeight - margin.top - margin.bottom;
  //     // d3.select("#timeline").html("");

  
  //     // create svg container
  //     var svg = d3.select("#timeline").append("svg")
  //       .attr("height", svgHeight)
  //       .attr("width", svgWidth);
  
  //     // shift everything over by the margins
  //     var chartGroup = svg.append("g")
  //       .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  //     var yScale = d3.scaleLinear()
  //       .domain([0, d3.max(dataArray)+50])
  //       .range([height, 0]);
  
  //     // scale x to chart width
  //     var xScale = d3.scaleBand()
  //       .domain(names)
  //       .range([0, width])
  //       .padding(0.1);
  
  //     // create axes
  //     var yAxis = d3.axisLeft(yScale);
  //     var xAxis = d3.axisBottom(xScale);
  
  //     // set x to the bottom of the chart
  //     chartGroup.append("g")
  //       .attr("transform", `translate(0, ${height})`)
  //       .call(xAxis)
  //       .attr("class", "x axis")
  //       .attr("id", "x-axis");
  
  //     // set y to the y axis
  //     chartGroup.append("g")
  //       .call(yAxis)
  //       .attr("class", "y axis");
  
  //     // Create the rectangles using data binding
  //     var barsGroup = chartGroup.selectAll("rect")
  //       .data(dataArray)
  //       .enter()
  //       .append("rect")
  //       .attr("x", (d, i) => xScale(names[i]))
  //       .attr("y", d => yScale(d))
  //       .attr("width", xScale.bandwidth())
  //       .attr("height", d => height - yScale(d))
  //       .style("opacity", 0.60)
  //       .style("fill", function(d, i) {
  //           var picked=colorData.find(data=> data.country==names[i]).color
  //           return picked
  //         })
  //       .transition()
  //       .duration(200)
  // //Rotate x ticks
  //       d3.select("#x-axis")
  //       .selectAll("text")
  //       .attr("dx", "-0.4em")
  //       .attr("dy", "1.24em")
  //       .attr("transform", "rotate(-16)" );
  //     //Ticker
  //     d3.select("svg").append("text")
  //       .attr("x", width - 35)
  //       .attr("y", margin.top)
  //       .text(i)
  //       .attr("class", "ticker-text")
  //     //x label
  //     chartGroup.append("g")
  //       .attr("transform", `translate(${width / 2}, ${height + 20})`)
  //       .append("text")
  //       .attr("x", -90)
  //       .attr("y", 50)
  //       .classed("x label", true)
  //       .text("Countries (Top 13)");
  
  //     //ylabel
  //     chartGroup.append("g")
  //     .attr("transform", "rotate(-90)")
  //     .attr("dy", "1em")
  //     .append("text")
  //     .attr("x", 0 - (height / 1.25))
  //     .attr("y", 20 - margin.left)
  //     .classed("y label", true)
  //     .text("Annual Military Expenditure(in Bn USD)");
  
  //     i++;
  //   };
  // });
  // });
  // }
  