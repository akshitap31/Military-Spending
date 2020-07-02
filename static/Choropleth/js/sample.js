
    //adapted from https://leafletjs.com/examples/choropleth/

    //init map
    var map = L.map('map').setView([28.466944, -82.498148], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //query all states for 60 or older, and 60 or older veterans
    //https://api.census.gov/data/2017/acs/acs1/subject/groups/S0102.html
    census(
      {
        vintage: 2017,
        geoHierarchy: {
          state: {
            lat: 28.466944,
            lng: -82.498148
          },
          county: '*'
        },
        geoResolution: '5m',
        sourcePath: ['acs', 'acs5', 'subject'],
        // Total!!Estimate!!Total population : S0102_C01_001E
        // 60 years and over!!Estimate!!Total population : S0102_C02_001E
        values: ['S0102_C01_001E', 'S0102_C02_001E'],
        statsKey: '3c04140849164b373c8b1da7d7cc8123ef71b7ab'
      },
      function(error, response) {
        //setup styles
        function getColor(percent) {
          return percent > 50
            ? '#800026'
            : percent > 30
            ? '#BD0026'
            : percent > 20
            ? '#E31A1C'
            : percent > 10
            ? '#FC4E2A'
            : percent > 5
            ? '#FD8D3C'
            : percent > 0
            ? '#FEB24C'
            : '#FFF';
        }

        function style(feature) {
          var total_pop = feature.properties.S0102_C01_001E;
          var total_pop_over60 = feature.properties.S0102_C02_001E;
          //calculate percent
          if (total_pop && total_pop_over60) {
            // check if valid (no 0s or undefined)
            var percent = (total_pop_over60 / total_pop) * 100;
            return {
              fillColor: getColor(percent),
              fillOpacity: 0.7,
              weight: 0.5,
              color: 'rgba(255, 255, 255, 0.8)'
            };
          } else {
            return {
              weight: 2,
              fillOpacity: 0,
              weight: 0.5,
              color: 'rgba(255, 255, 255, 0.8)'
            };
          }
        }

        //add layer
        L.geoJson(response, { style: style }).addTo(map);

        //add title and legend
        var grades = [50, 30, 20, 10, 0];
        var div = document.getElementById('legend');

        grades.forEach(function(grade, i) {
          div.innerHTML +=
            '<i style="background:' +
            getColor(grades[i] + 1) +
            '"></i> ' +
            grades[i] +
            '%' +
            (grades[i - 1] ? '&ndash;' + grades[i - 1] + '%' : '+') +
            '<br/>';
        });
      }
    );
  
    //adapted from https://leafletjs.com/examples/choropleth/

    //init map
    var map = L.map('map').setView([28.466944, -82.498148], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //query all states for 60 or older, and 60 or older veterans
    //https://api.census.gov/data/2017/acs/acs1/subject/groups/S0102.html
    census(
      {
        vintage: 2017,
        geoHierarchy: {
          state: {
            lat: 28.466944,
            lng: -82.498148
          },
          county: '*'
        },
        geoResolution: '5m',
        sourcePath: ['acs', 'acs5', 'subject'],
        // Total!!Estimate!!Total population : S0102_C01_001E
        // 60 years and over!!Estimate!!Total population : S0102_C02_001E
        values: ['S0102_C01_001E', 'S0102_C02_001E'],
        statsKey: '3c04140849164b373c8b1da7d7cc8123ef71b7ab'
      },
      function(error, response) {
        //setup styles
        function getColor(percent) {
          return percent > 50
            ? '#800026'
            : percent > 30
            ? '#BD0026'
            : percent > 20
            ? '#E31A1C'
            : percent > 10
            ? '#FC4E2A'
            : percent > 5
            ? '#FD8D3C'
            : percent > 0
            ? '#FEB24C'
            : '#FFF';
        }

        function style(feature) {
          var total_pop = feature.properties.S0102_C01_001E;
          var total_pop_over60 = feature.properties.S0102_C02_001E;
          //calculate percent
          if (total_pop && total_pop_over60) {
            // check if valid (no 0s or undefined)
            var percent = (total_pop_over60 / total_pop) * 100;
            return {
              fillColor: getColor(percent),
              fillOpacity: 0.7,
              weight: 0.5,
              color: 'rgba(255, 255, 255, 0.8)'
            };
          } else {
            return {
              weight: 2,
              fillOpacity: 0,
              weight: 0.5,
              color: 'rgba(255, 255, 255, 0.8)'
            };
          }
        }

        //add layer
        L.geoJson(response, { style: style }).addTo(map);

        //add title and legend
        var grades = [50, 30, 20, 10, 0];
        var div = document.getElementById('legend');

        grades.forEach(function(grade, i) {
          div.innerHTML +=
            '<i style="background:' +
            getColor(grades[i] + 1) +
            '"></i> ' +
            grades[i] +
            '%' +
            (grades[i - 1] ? '&ndash;' + grades[i - 1] + '%' : '+') +
            '<br/>';
        });
      }
    );
  