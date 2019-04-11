// link to json object
var url = "https://api.openaq.org/v1/latest";

// obtain country codes
var countryCodes = countryCode();
console.log(countryCodes);

// use country codes to query the url 
// fill in code



d3.json(url).then(function(d){
	var results = d.results;

	// enter code
	



});