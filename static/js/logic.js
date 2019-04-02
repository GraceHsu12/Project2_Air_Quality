// Create link to API source for air measurement
var url = "https://api.openaq.org/v1/measurements";

// var condition = "?parameter=pm25";

d3.json(url).then(function(data){
	// save JSON results in 'locations'
	var locations = data.results;
	console.log(locations);

	// Create initial map object
	var myMap = L.map('map').setView([45.52, 40], 2);

	// Adding a tile layer (the background map image) to the map
	L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	  // set maximum zoom level
	  maxZoom: 15,
	  id: "mapbox.streets",
	  accessToken: API_KEY
	}).addTo(myMap);
	
	// City, country, Lat, lon
	var city = [];
	var country = [];
	var latlng = [];
	var units = [];

	// pm2.5, pm10, o3, no2, so2, co, black carbon (BC)
	var pm25 = [];
	var pm10 = [];
	var o3 = [];
	var no2 = [];
	var so2 = [];
	var co = [];
	var bc = [];

	// save local variables for city, country, latitude, longitude,
	// various gases
	locations.forEach(function(d){
		city.push(d.city);
		country.push(d.country);
		// create an array of [latitude,longitude] coordinates
		latlng.push([d.coordinates.latitude, d.coordinates.longitude]);
		if (d.parameter == "pm25") {
			pm25.push(d.value);
		}
		else if (d.parameter == "pm10"){
			pm10.push(d.value);
		}
		else if (d.parameter == "o3"){
			o3.push(d.value);
		}
		else if (d.parameter == "no2"){
			no2.push(d.value);
		}
		else if (d.parameter == "so2"){
			so2.push(d.value);
		}
		else if (d.parameter == "co"){
			co.push(d.value);
		}
		else if (d.parameter == "bc"){
			bc.push(d.value);
		}
		else {
			console.log('parameter not found');
		}

	});


	// function that returns a fill color based on the value entered
	function pmChooseColor(value){
		if (value >= 50) {
			return '#AD2700';
		}
		else if (value >= 40) {
			return '#F16F0F';
		}
		else if (value >= 35) {
			return '#F1A10F';
		}
		else if (value >= 20) {
			return '#FFDD1E';
		}
		else if (value >= 10) {
			return '#CAE520';
		}
		else {
			return '#2CE62A';
		}
	}

	locations.forEach(function(d){
		if (d.parameter == "pm25"){
			L.circle([d.coordinates.latitude, d.coordinates.longitude], {
				fillOpacity: 0.75,
				color: pmChooseColor(d.value),
				weight: 0.5,
				fillColor: pmChooseColor(d.value),
				radius: d.value * 800
			}).bindPopup("<h1>" + d.city + ", " + d.country + 
				"</h1><hr><h3>" + d.parameter + ": " +
				d.value + d.unit + "</h3>").addTo(myMap);
		}
	});





});


