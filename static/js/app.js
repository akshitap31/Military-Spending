// This code works to select the dropdown values from index.html
function parseSelection() {
    var year = d3.select("#selTime").property("value");
    var cat = d3.select("#selCategory").property("value");

    // console.log(year);
    // console.log(cat);

    var path=`/${cat}/${year}`;
    // console.log(path);

    d3.json(path).then(function(data) {
      var names = data.map(row => row[0]);
      var values = data.map(row => row[1]);
      console.log(values);

      bar(names,values,cat,year);
    });
}

function bar(xData, yData, cat, year){
  var CategoryTitle = "";
  if (cat === "gdp") {
    CategoryTitle = "Gross Domestic Product"
  }
  else {
    CategoryTitle = "Total Military Spend"
  }

  var yTitle = "";
  if (cat === "gdp") {
    yTitle = "Percentage of GDP Spent"
  }
  else {
    yTitle = "Total Spend in USD"
  }

  var trace1 = {
    x: xData,    
    y: yData,      
    text: yData,
    name: `Top Ten Countries in ${year} By ${CategoryTitle}`,
    type: "bar"
  };

  var layout1 = {
    title: `Top Ten Countries in ${year} By ${CategoryTitle}`,
    xaxis:{title: "Country"},
    yaxis:{title: `${yTitle}`},
    height: 400,
    width: 600,
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };

  // creating data variable 
  var data1 = [trace1];

  // Create your bar chart using plotly
  Plotly.newPlot("bar", data1, layout1);
}

// Initialize Page
function init() {
  var year = 2018;
  var cat = "tms";
  var path=`/${cat}/${year}`;
  // console.log(path);

  d3.json(path).then(function(data) {
    var names = data.map(row => row[0]);
    var values = data.map(row => row[1]);
    console.log(values);

    bar(names,values,cat,year);
  });
}
  
init();
  