// create the tile layer for the background of the map
var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
})


// initialie all layerGroups to be used
var layers = {
	BC: new L.LayerGroup(),
	CO: new L.LayerGroup(),
	NO2: new L.LayerGroup(),
	O3: new L.LayerGroup(),
	PM10: new L.LayerGroup(),
	PM25: new L.LayerGroup(),
	SO2: new L.LayerGroup()
};

// create the map with the layers
var map = L.map('allGasMap', {
	center: [0, 0],
	zoom: 2,
	layers:[
		layers.BC,
		layers.CO,
		layers.NO2,
		layers.O3,
		layers.PM10,
		layers.PM25,
		layers.SO2
	]
});

// add the 'lightmap' tile layer to the map
streetMap.addTo(map);

// create an overlays object to add to the layer control
var overlays = {
	"Black Carbon (bc)": layers.BC,
	"Carbon Monoxide (co)": layers.CO,
	"Nitric Oxide (no2)": layers.NO2,
	"Ozone (o3)": layers.O3,
	"Particulate Matter 10um or less in diameter (pm10)": layers.PM10,
	"Particulate Matter 2.5um or less in diameter (pm25)": layers.PM25,
	"Sulfer Dioxide (so2)": layers.SO2
};

// create a control for the layers, and add the overlay layers to it
L.control.layers(null, overlays).addTo(map); 

// create a legend to display the values of the colors
var info = L.control({
	position: "bottomleft"
});

// Insert a div with the class of "Legend" when the layer control is added
info.onAdd = function(){
	var div = L.DomUtil.create('div', 'legend');
	return div;
};

// add the info legend to the map
info.addTo(map);


var gasParameters = ['bc', 'co', 'no2', 'o3', 'pm10', 'pm25', 'so2'];

gasParameters.forEach(function(gas){
	// retrieve json data from flask route
	// url to route 
	var url = "/gasMeasurement/" + gas;

	d3.json(url).then(function(data){
		// current gas circle markers
		var current_cm = [];
		// add each found object with existing coordantes as a circle marker
		// to the map. Also bind the popup with the location/gas information
		data.forEach(function(d){
			// make sure there are coordinates in each object
			if (d.coordinates) {
				// make sure there are values to the parameters
				if (d.measurements[0] && d.measurements[0].value > 0) {
					// obtain current value and units
					var current_measurement_val = d.measurements[0].value;
					var current_units = d.measurements[0].unit;

					// convert to ug/ml all values if the unit is "ppm"
					if (current_units=="ppm"){
						if (gas == "co"){
							// carbon monoxide (co) conversion from ppm to ug/m^3 based on the WHO conversion factor
							// at 25 degrees Celcius and 1013mb air pressure
							// 1ppm = 1150ug/m^3

							current_measurement_val = current_measurement_val * 1150;
							current_units = "ug/m" + "3".sup();

						}
						else if (gas=="no2"){
						// carbon monoxide (co) conversion from ppm to ug/m^3 based on the WHO conversion factor
						// at 25 degrees Celcius and 1013mb air pressure
						// 1ppb = 1.88ug/m^3							
							current_measurement_val = (current_measurement_val/1000) * 1.88;
							current_units = "ug/m" + "3".sup();
						}
						else if (gas=="o3"){
							// ozone (o3) conversion from ppm to ug/m^3 based on the WHO conversion factor
							// at 25 degrees Celcius and 1013mb air pressure
							// 1 ppb = 1.96ug/m^3

							current_measurement_val = (current_measurement_val/1000) * 1.96;
							current_units = "ug/m" + "3".sup();	
						}
					}

					if (d.measurements[0].value > 100000){
						console.log("Value is too great! Value not plotted!");
					}
					else {
						// create circle markers and bind a popup message to it
						current_cm.push(L.circle([d.coordinates.latitude, d.coordinates.longitude], {
							fillOpacity: 0.75,
							color: ChooseColor(current_measurement_val),
							weight: 0.5,
							fillColor: ChooseColor(current_measurement_val),
							radius: d.measurements[0].value * 10
						}).bindPopup("<h1>" + d.city + ", " + d.country + 
						"</h1><hr><h3>" + d.measurements[0].parameter + ": " +
						current_measurement_val + current_units + "</h3>"));
					}
				}
			}

			// place markers into the appropriate layers
			if (gas == 'bc') {
				current_cm.forEach(function(d){
					d.addTo(layers['BC']);	
				})
			}
			else if (gas == 'co') {
				current_cm.forEach(function(d){
					d.addTo(layers['CO']);
				})
			}
			else if (gas == 'no2') {
				current_cm.forEach(function(d){
					d.addTo(layers['NO2']);
				})
			}
			else if (gas == ' o3') {
				current_cm.forEach(function(d){
					d.addTo(layers['O3']);
				})
			}
			else if (gas == 'pm10') {
				current_cm.forEach(function(d){
					d.addTo(layers['PM10']);
				})
			}
			else if (gas == 'pm25') {
				current_cm.forEach(function(d){
					d.addTo(layers['PM25']);
				})
			}
			else {
				current_cm.forEach(function(d){
					d.addTo(layers['SO2']);
				})
			}
		});
	


	});
})
updateLegend();

// update legend's innerHTML with the parameters
function updateLegend(){
	magnitude = [0, 0.1, 0.5, 1, 5, 10, 20, 50, 100, 500, 1000];
	magnitudeRanges = ["0-0.1", ">0.1-0.5", ">0.5-1", ">1-5", ">5-10", ">10-20", ">20-50", ">50-100", ">100-500", ">500-1000", "1000+"]
	labels = [];

	// add magnitude color and magnitudeRanges to the 'labels' array
	magnitude.forEach(function(mag, index){
		labels.push("<li style=\"background:"
			+ ChooseColor(mag) + "\"></li><text> " + magnitudeRanges[index]
			+ "</text><br>");
	});

	// div.innerHTML += "<ul>" + labels.join("") + "</ul>";
	document.querySelector('.legend').innerHTML += "<ul>" + labels.join("") + "</ul>";
}