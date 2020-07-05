d3.selectAll("#selDataset").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // // Use D3 to select the dropdown menu
  d3.select("#doughnut-chart").html("");
  d3.select("#doughnut-chart3").html("");
  // chart.destroy();
  // chart3.destroy();
  var dropdownMenu = d3.select("#selDataset");
  // // Assign the value of the dropdown menu option to a variable
  var value = dropdownMenu.property("value");
// var value="United States";
  var url=`/posession/${value}`
  //   // Import data from an external CSV file
    d3.json(url).then(function(data) {
      var data_dict=data[0]
      console.log(Object.entries(data_dict));
      var chart= new Chart(document.getElementById("doughnut-chart").getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.entries(data_dict),
          datasets: [
            {
              label: "Count",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#ed6dc5", "#fa4b77", "#93edd8", "#b4f58e", "#de7880", "#9378de", "#f0f084" ],
              data: Object.values(data_dict)
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: `Military Posessions as of 2018 for ${value}`,
            fontSize:23
          }
        }
    });
    });
      var url3=`/personnel/${value}`
      //   // Import data from an external CSV file
        d3.json(url3).then(function(data) {
          var data_dict=data[0]
          console.log(Object.entries(data_dict));
          var chart2= new Chart(document.getElementById("doughnut-chart3").getContext('2d'), {
            type: 'doughnut',
            data: {
              labels: Object.entries(data_dict),
              datasets: [
                {
                  label: "Count",
                  backgroundColor: ["#ec96f2", "#77bd84", "#99d4f2"],
                  data: Object.values(data_dict)
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: `Military Personnel as of 2018 for ${value} `,
                fontSize:23
              }
            }
        });
        });
      } 
function init(){
  var dropdownMenu = d3.select("#selDataset");
  // // Assign the value of the dropdown menu option to a variable
  var value = dropdownMenu.property("value");
  d3.select("#doughnut-chart").html("");
  d3.select("#doughnut-chart3").html("");
  var url=`/posession/${value}`
  //   // Import data from an external CSV file
    d3.json(url).then(function(data) {
      var data_dict=data[0]
      console.log(Object.entries(data_dict));
      var chart= new Chart(document.getElementById("doughnut-chart").getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.entries(data_dict),
          datasets: [
            {
              label: "Count",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#ed6dc5", "#fa4b77", "#93edd8", "#b4f58e", "#de7880", "#9378de", "#f0f084" ],
              data: Object.values(data_dict)
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: `Military Posessions as of 2018 for ${value}`,
            fontSize:23
          }
        }
    });
    });
      var url3=`/personnel/${value}`
      //   // Import data from an external CSV file
        d3.json(url3).then(function(data) {
          var data_dict=data[0]
          console.log(Object.entries(data_dict));
          var chart3= new Chart(document.getElementById("doughnut-chart3").getContext('2d'), {
            type: 'doughnut',
            data: {
              labels: Object.entries(data_dict),
              datasets: [
                {
                  label: "Count",
                  backgroundColor: ["#ec96f2", "#77bd84", "#99d4f2"],
                  data: Object.values(data_dict)
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: `Military Personnel as of 2018 for ${value} `,
                fontSize:23
              }
            }
        });
        });

var url4="/personnel_average"
//   // Import data from an external CSV file
  d3.json(url4).then(function(data) {
    var data_dict=data[0]
    console.log(Object.entries(data_dict));
    var chart2= new Chart(document.getElementById("doughnut-chart4").getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: Object.entries(data_dict),
        datasets: [
          {
            label: "Count",
            backgroundColor: ["#ec96f2", "#77bd84", "#99d4f2"],
            data: Object.values(data_dict)
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: `World Average Military Personnel as of 2018`,
          fontSize:23
        }
      }
  });
  });
  var url2="/posession_average"
  //   // Import data from an external CSV file
    d3.json(url2).then(function(data) {
      var data_dict=data[0]
      console.log(Object.entries(data_dict));
      var chart4= new Chart(document.getElementById("doughnut-chart2").getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.entries(data_dict),
          datasets: [
            {
              label: "Count",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#ed6dc5", "#fa4b77", "#93edd8", "#b4f58e", "#de7880", "#9378de", "#f0f084" ],
              data: Object.values(data_dict),
              // fontSize:16
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: `World Average Military Posessions as of 2018`,
            fontSize:23
          }
        }
    });
    });
  }
init()