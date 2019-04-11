# import objects from the Flask model
from flask import Flask, jsonify, request, render_template

# import requests module
import requests


# function to obtain all country names
def getGases():
	link = "https://api.openaq.org/v1/parameters"
	r = requests.get(link)

	# format request into json
	gas_names_json = r.json()

	# obtain only the "results" portion of the json file
	gas_names_json = gas_names_json['results']

	return gas_names_json



# function to get latest measurements received 
	# takes in a string as a parameter
# accepts the following for gasParameter: 
	# (bc, co, no2, o3, pm10, pm25, so2)
def getLatestParamMeasurement(gasParameter):
	# link to API for latest 1000 gas measurements
	link = "https://api.openaq.org/v1/latest?limit=10000&parameter="

	acceptable_gasParameters = ['bc', 'co', 'no2', 'o3', 'pm10', 'pm25', 'so2']

	# check if an acceptable gas parameter was passed
	for each in acceptable_gasParameters:
		if gasParameter == each:
			search_param = gasParameter
			url = link + search_param
	

	# create a request to the built url
	r = requests.get(url)

	# store request as json
	gasParamMeasure = r.json()

	# return only the results section 
	gasParamMeasure = gasParamMeasure['results']
	return gasParamMeasure
