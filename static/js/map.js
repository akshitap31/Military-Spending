
function UpdateMap(){


////CREATE URLs to retrieve country data
// Store API query variables
const API_KEY = "pk.eyJ1IjoiZXZhbnMzODMiLCJhIjoiY2tiaWlkYzF4MGRoaDJzdGR2enl0dnpiZyJ9.8wRWWOQVll_mZpvv_bP8tw";
var CountryURL = "https://api.thenmap.net/v2/world-2/geo/";
// Add the dates in the ISO formats
var Year = d3.select("#selTime").property("value");
var Cat = d3.select("#selCategory").property("value");
// Add the dataproperties
var CountryProps = "?geo_props=sdate|edate|name";

// Assemble API query URL
var ThenMapURL = `${CountryURL}${Year}${CountryProps}`
//console.log(ThenMapURL)


///CREATE URL to retrieve gdp and tms data
var SpendURL = `/all_data/${Year}/${Cat}`;
//console.log(SpendURL)

var myMap = null;

// Creating map object

var myMap = L.map("map", {
  // center: [51.47, 0.00],
  center: [25.784211, -3.284970],
  zoom: 2
})




//d3.select("#map").attr("style","../css/map.css")
d3.select("head").append("link").attr("rel","stylesheet").attr("type","text/css").attr("href","../static/css/map.css")
// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox.boundaries-adm1-v3", //"mapbox/streets-v11", //
  accessToken: API_KEY
}).addTo(myMap);

 var promises = [d3.json(SpendURL),d3.json(ThenMapURL)];
 Promise.all(promises).then(function(responses) {
  
  var topten = [];
  
  for (var key in responses[0]) {
      if (responses[0].hasOwnProperty(key)) {
          topten.push(key);
      }
  }
  topten = topten.slice(0,9)

  responses[1]['features'].forEach(feature => {
    if (responses[0][feature['properties']['name']]){
      feature['properties']['tms'] =responses[0][feature['properties']['name']]['tms']
      feature['properties']['gdp'] =responses[0][feature['properties']['name']]['gdp']
      feature['properties']['src_name'] =responses[0][feature['properties']['name']]['src_name']
    } else {
      feature['properties']['tms'] = null
      feature['properties']['gdp'] = null

    }

  });

  var values = responses[1].features.map(function(feature) {
    return feature.properties[Cat];
  });

  console.log(responses)

  var getColor = d3
    .scaleLinear()
    .domain(d3.extent(values.slice(9,values.length))) // get the min and max values
    .range(d3.schemeGreys[5]); // set 5 color buckets

  
    var colorList = []
    Chart.helpers.each(Chart.instances, function(instance){

        colorList = instance.data.datasets[0].backgroundColor
        console.log(colorList)
    });


  function style(feature) {
    

    if (feature.properties[Cat]) {
      // check if valid (no 0s or undefined)
      if(topten.includes(feature.properties['name'])){
        var colorIndex = topten.indexOf(feature.properties['name']);


        return {
        
          fillColor: colorList[colorIndex],
          fillOpacity: 0.7,
          weight: 0.5,
          //color: 'rgba(255, 255, 255, 0.8)'
        }  

      }else{
        return {
        
          fillColor: getColor(feature.properties[Cat]),
          fillOpacity: 0.7,
          weight: 0.5,
          color: 'rgba(255, 255, 255, 0.8)'
        };}
    } else {
      return {
        
        weight: 2,
        fillOpacity: 0,
        weight: 0.5,
        color: 'rgba(255, 255, 255, 0.8)'
      };
    }
  }



  L.geoJson(responses[1],{
     // Passing in our style object
    style: style,
    onEachFeature: function(feature, layer) {

      var timeout;
      //
      // Set mouse events to change map styling

      var popupText = "<h2 style=\"text-align:left\";>" + feature.properties.name +"</h2><hr>"+
                      "<h3 style=\"text-align:left\";>Total Spending:   " + Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(feature.properties.tms) + "</h3>"+ 
                      "<h3 style=\"text-align:left\";>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp%PCT GDP:   " + Intl.NumberFormat('en-us', { style: 'decimal', maximumSignificantDigits: 3}).format(feature.properties.gdp) + "%</h3>"
      layer.bindPopup(popupText);
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });        

        },


        mousemove:function(event){
          
          this.closePopup();
          clearTimeout(timeout);
          timeout = setTimeout(function(){
            layer = event.target.getPopup();
            layer.setLatLng(event.latlng).openOn(myMap);
          },1000)
          
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer.closePopup()
          clearTimeout(timeout);
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.7
          });
          
        }
      });

      
    }
  
  }).addTo(myMap);

  var button = document.getElementById("refresh").addEventListener("click", function(){
      myMap.remove()
      UpdateMap()
    });
});

}
UpdateMap();