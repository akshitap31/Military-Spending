// This code works to select the dropdown values from index.html
function parseSelection() {
    var year = d3.select("#selTime").property("value");
    var cat = d3.select("#selCategory").property("value");

    console.log(year);
    console.log(cat);
}

// Initialize Page
function init() {
    d3.json("samples.json").then((data) => {
      // select dropdown menu 
      var dropdown = d3.select("#selDataset");
  
      // Use select.append to add options w/ texts and value
      data.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value", name);
      });
      // Build charts and metadata for the first sample aka first "name" in names array
  
      // Get the variables necessary to create bar plot
      // Use slice to get the top 10 values & reverse to make bars stack greatest to smallest
      var sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();
      var sampleIDs = data.samples[0].otu_ids.slice(0, 10).reverse();
      var sampleLabels = data.samples[0].otu_labels.slice(0, 10).reverse();
  
      var stringIDs = sampleIDs.map(samID =>  `OTU ${samID}`);
      //console.log(sampleIDs);
  
      // Trace1 for the OTU Data
      var trace1 = {
          x: sampleValues,    
          y: stringIDs,      
          text: sampleLabels, 
          name: "OTU",
          type: "bar",
          orientation: "h"
        };
  
      // Create bar chart for the first subject in the data
      var layout1 = {
          title: "Belly Button Biodiversity Bar Chart",
          xaxis:{title: "OTU Values"},
          yaxis:{title: "OTU ID"},
          height: 600,
          width: 1000,
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
  
  
      // Bubble plot
      var trace2 = {
        x: data.samples[0].otu_ids,
        y: data.samples[0].sample_values,
        mode: "markers",
        marker: {
            size: data.samples[0].sample_values,
            color: data.samples[0].otu_ids
        },
        text:  data.samples[0].otu_labels
  
      };
  
      // set the layout for the bubble plot
      var layout_2 = {
        title: "Belly Button Biodiversity Bubble Plot",
        xaxis:{title: "OTU ID"},
        yaxis:{title: "OTU Values"},
        height: 600,
        width: 1000
      };
  
      // creating data variable 
      var data2 = [trace2];
  
      // create the bubble plot
      Plotly.newPlot("bubble", data2, layout_2); 
  
      // Insert metadata into panel for first subject
      var metadata = data.metadata[0];
      //console.log(metadata);
  
      // filter meta data info by id
      var mData = d3.select("#sample-metadata");
        
      // empty the mData panel each time before getting new id info
      mData.html("");
  
      // choose first subject's metadata to get selectedMetadata
      // selectedMetadata --> Append something for each
      // Use Object.entries to iterate over selectedMetata
      Object.entries(metadata).forEach((key) => {   
        mData.append("p").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
    });
}
  
  // Update plots and metadata for newly selected value in dropdown menu
  function optionChanged(selectValue) {
    d3.json("samples.json").then((data) => {
  
      var sampleData = data.samples;
      
      // Filter data by matching id for samples to the selectValue
      // Get the variables necessary to create bar plot
      // Use slice to get the top 10 values & reverse to make bars stack greatest to smallest
      var filteredSample = sampleData.filter(record => record.id === selectValue)[0];
      //console.log(filteredSample);
      var sampleValues = filteredSample.sample_values.slice(0, 10).reverse();
      var sampleIDs = filteredSample.otu_ids.slice(0, 10).reverse();
      var stringIDs = sampleIDs.map(samID =>  `OTU ${samID}`);
      var sampleLabels = filteredSample.otu_labels.slice(0, 10).reverse();
  
  
      // Trace1 for the OTU Data
      var trace1 = {
        x: sampleValues,    
        y: stringIDs,      
        text: sampleLabels, 
        name: "OTU",
        type: "bar",
        orientation: "h"
      };
  
    // Create bar chart for the first subject in the data
    var layout1 = {
        title: "Belly Button Biodiversity Bar Chart",
        xaxis:{title: "OTU Values"},
        yaxis:{title: "OTU ID"},
        height: 600,
        width: 1000,
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
  
                // // Update values for barchart
                // var update = {
                //   x: sampleValues,    
                //   y: stringIDs,      
                //   text: sampleLabels
                // };
                // console.log(update);
  
                // // Use restyle to update bar chart
                // Plotly.restyle("bar", update);
  
      // Bubble plot
      var bubValues = filteredSample.sample_values;
      var bubIDs = filteredSample.otu_ids;
      var stringBubIDs = bubIDs.map(bubID =>  `OTU ${bubID}`);
      var bubLabels = filteredSample.otu_labels;
  
      var trace2 = {
        x: bubIDs,
        y: bubValues,
        mode: "markers",
        marker: {
            size: bubValues,
            color: bubIDs
        },
        text:  bubLabels
      };
  
      // set the layout for the bubble plot
      var layout_2 = {
        title: "Belly Button Biodiversity Bubble Plot",
        xaxis:{title: "OTU ID"},
        yaxis:{title: "OTU Values"},
        height: 600,
        width: 1000
      };
  
      // creating data variable 
      var data2 = [trace2];
  
      // create the bubble plot
      Plotly.newPlot("bubble", data2, layout_2); 
  
  
      // Build metadata based on the filter
      var metadata = data.metadata;
      //console.log(sampleData);
      //console.log(metadata);
  
      // filter meta data info by id
      var filteredMeta = metadata.filter(record => record.id.toString()  === selectValue)[0];
      //console.log(filteredMeta);
  
      var mData = d3.select("#sample-metadata");
        
      // empty the mData panel each time before getting new id info
      mData.html("");
  
      // choose first subject's metadata to get selectedMetadata
      // selectedMetadata --> Append something for each
      // Use Object.entries to iterate over selectedMetata
      Object.entries(filteredMeta).forEach((key) => {   
        mData.append("p").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
    });
  }
  

  