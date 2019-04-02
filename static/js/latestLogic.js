var url = "https://api.openaq.org/v1/latest";

d3.json(url).then(function(d){
	var results = d.results;

	var countryCodes = countryCode();

	console.log(countryCodes);





});