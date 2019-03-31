// Create link to API source for air measurement
var link = "https://api.openaq.org/v1/measurements";

d3.json(link).then(function(data){
	// save JSON results in 'locations'
	var locations = data.results;

	// Create initial map object
	var myMap = L.map('map', {
		center: [45.52, -100],
		zoom: 4
	});

	// Adding a tile layer (the background map image) to the map
	L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	  // set maximum zoom level
	  maxZoom: 18,
	  id: "mapbox.streets",
	  accessToken: API_KEY
	}).addTo(myMap);
	

	// Function that will give each location a different radius
	// based on it's particular gas' value
	function markerSize(gasValue){
		return gasValue;
	}

	// Function that will change the color of the circles based on its value



	// City, Lat, lon
	// PM2.5, PM10, Ozone(O3), NO2, SO2, CO, black carbon (BC)


	// loop through the data and place markers


});


