// Enter code here

var link = "https://api.openaq.org/v1/measurements";

d3.json(link).then(function(data){
	console.log(data);
});