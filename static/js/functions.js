// create a function to retrieve country codes
function countryCode(){
	var url_countries = "https://api.openaq.org/v1/countries";

	var countries = [];
	d3.json(url_countries).then(function(data){
		var results = data.results;
		//  obtain each country code
		
		results.forEach(function(data){
			countries.push(data.code);
		});
	});

	return countries;
}


