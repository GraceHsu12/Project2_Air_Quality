//setting a map location and zoom level
var map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});
  
// Adding tile layer

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	  // set maximum zoom level
	  maxZoom: 15,
	  id: "mapbox.streets",
	  accessToken: API_KEY
  }).addTo(map);
  
pm10_value = [];
date = [];
city = [];

var url = "https://api.openaq.org/v1/latest?country=US&date_from=2016-01-01&parameter=pm10&limit=10000";

d3.json(url, function(data){

  var feature = data.results;

  //console.log(feature);

  feature.forEach(function(d){
    var value_pm10 = d.measurements[0].value;
    //console.log(d.measurements[0].value);
    var latitude = d.coordinates.latitude;
    //console.log(d.measurements.parameter)
    var longitude = d.coordinates.longitude;

    date.push(d.measurements[0].lastUpdated);

    city.push(d.city);

    units = d.measurements[0].unit;
    //console.log('old: ' + units)
    
    if (units == "ppm"){
      value_pm10 = value_pm10 * 1000
      units = "µg/m³"

     };
     pm10_value.push(value_pm10);


    console.log(value_pm10);
    var fillcolor = "greenyellow";

    if (value_pm10 > 0) {
      fillcolor = "Yellow";
    };

    if (value_pm10 > 20) {
      fillcolor = "Gold";
    };

    if (value_pm10 > 40) {
      fillcolor = "Coral";
    };

    if (value_pm10 > 60) {
      fillcolor = "orange";
    };

    if (value_pm10 > 80) {
      fillcolor = "Red";
    };

    L.circle([latitude, longitude], {
      color: "Blue",
      fillColor: fillcolor,
      fillOpacity: 0.75,
      weight: 1,
      radius: value_pm10*1000 // multiplying by a bigger value to ensure different circle size
    }).bindPopup("<h3> City: " + d.city +
      "</h3><hr><p> PM10 Value: " + value_pm10 + " µg/m³"+ "</p>").addTo(map);

  });

  newDate = []
  date.forEach(function(element){
    newDate.push(element.slice(0, 10));
  });

  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: newDate.slice(0, 100),
      datasets: [{
        label: 'PM10',
        data: pm10_value.slice(0, 100),
        backgroundColor: "rgba(153,255,51,0.4)"
      }, ]
    },
    
  });

});
  //setting the ledgend 

  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {
  //set various colors
      var div = L.DomUtil.create('div', 'legend'),
          grades = [0, 20, 40, 60, 80, 100],
          c_palette = ["greenyellow", "Yellow", "Gold", "Coral", "orange", "Red"],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + c_palette[i] + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' 
                         + grades[i + 1] + '<br>' : '+');
        }
        return div;

  };
  
  legend.addTo(map);












