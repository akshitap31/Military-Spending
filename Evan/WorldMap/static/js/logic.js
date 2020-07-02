////CREATE URLs to retrieve country data
// Store API query variables
var CountryURL = "http://api.thenmap.net/v2/world-2/geo/";
// Add the dates in the ISO formats
var Year = "1980";
// Add the dataproperties
var CountryProps = "?geo_props=sdate|edate|name";

// Assemble API query URL
var ThenMapURL = `${CountryURL}${Year}${CountryProps}`
console.log(ThenMapURL)


///CREATE URL to retrieve gdp and tms data
var SpendURL = `//localhost:5000/all_data/${Year}`;
console.log(SpendURL)

// Creating map object
var myMap = L.map("map", {
  center: [51.47, 0.00],
  zoom: 3
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//  tileSize: 512,
//  maxZoom: 18,
//  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);



var mapStyle = {
  color: "white",
  fillColor: "blue",
  fillOpacity: 0.8,
  weight: 1.5
};

//Promise.all([d3.json(SpendURL),d3.json(ThenMapURL)]).then(function(data){
//  console.log(data[0])
//  console.log(data[1])
//})
d3.json(SpendURL, function(response1){
  d3.json(ThenMapURL, function(response2){
    console.log(response2);
  });
  console.log(response1);
});




//CountryData.map()

//function MapData(response){

//  console.log(response);

//  L.geoJson(response, {
    // Passing in our style object
//    style: mapStyle
//  }).addTo(myMap);
//}

function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}

function style(feature) {
  return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

//L.geoJson(statesData, {style: style}).addTo(map);
//mapStyle.fillColor = "pink"
//date = "1960"
//d3.json(url, function(response){

//  console.log(response);

//  L.geoJson(response, {
    // Passing in our style object
//    style: mapStyle
//  }).addTo(myMap);


//});

  // Create a new marker cluster group
//  var markers = L.markerClusterGroup();

  // Loop through data
//  for (var i = 0; i < response.length; i++) {
//    var location = response[i].location;

//    if (location) {
//      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])).bindPopup("<h1>" + response[i].borough + "</h1> <hr> <h2>" + response[i].cross_street_2 + "</h2>");
      
    // Set the data location property to a variable
  

    // Check for location property
    

      // Add a new marker to the cluster group and bind a pop-up
      

  // Add our marker cluster layer to the map
//    }
//  }
//myMap.addLayer(markers);
