#####################################################
## Import Dependencies

# import objects from the Flask model
from flask import Flask, jsonify, request, render_template

from flask_restful import Resource, Api

# import pymongo
import pymongo

# import functions from functions.py
from functions import getGases, getLatestParamMeasurement

# import datetime
import datetime as dt


#####################################################
# define app using Flask
app = Flask(__name__)

# create connection variable to mongodb
conn = 'mongodb://localhost:27017'

# pass connection to pymongo instance
client = pymongo.MongoClient(conn)

# connect to a database or create one if not already available
db = client.air_quality_db


###################################################
# create collection in the database and insert documents
# to store gas parameters into mongodb database
gas_list = getGases()

# drop collection if available to remove duplicates
db.gases.drop()

db.gases.insert_many(
	gas_list
)

####################################################
# Get latest measurements and store into mongodb

gasParameters = ['bc', 'co', 'no2', 'o3', 'pm10', 'pm25', 'so2']

latestParamMeasurement = []
for each in gasParameters:
	currentParam = getLatestParamMeasurement(each)
	latestParamMeasurement.append(currentParam)


# drop any duplicates
db.airQualityParamMeasurements.drop()

# insert data
for each in latestParamMeasurement:

	db.airQualityParamMeasurements.insert_many(
		each
		)


#####################################################
# get today's date and time
now = {"request_date": dt.datetime.now()}

# drop any duplicate dates stored as the request date
db.airQualityMeasurementsDate.drop()

# store the request date as a collection in mongodb
db.airQualityMeasurementsDate.insert_one(
	now
	)

###################################################

@app.route("/")
def home():
	# access mongodb for database
	gases = list(db.gases.find())
	# return gases variable for use in html
	return render_template('index.html', gases=gases)


# measurements by gas type
@app.route("/gasMeasurement/<gas>")
def gasMeasurements(gas):
	gasMeasurement = list(db.airQualityParamMeasurements.find({"measurements": {'$elemMatch': {'parameter': gas}}}, {'_id': False}))

	return jsonify(gasMeasurement)


@app.route("/globalData")
def globalData():
	return render_template('global.html')


@app.route("/usData")
def usData():
	return render_template('unitedstates.html')

@app.route("/countryContribution")
def countryContribution():
	return	render_template('country.html')


@app.route("/usAnalysisO3")
def usAnalysisO3():
	return render_template('index1.html')

@app.route("/usAnalysisPM25")
def usAnalysisPM25():
	return render_template('index2.html')

@app.route("/usAnalysisPM10")
def usAnalysisPM10():
	return render_template('index3.html')

@app.route("/usAnalysisSO2")
def usAnalysisSO2():
	return render_template('index4.html')

@app.route("/usAnalysisNO2")
def usAnalysisNO2():
	return render_template('index5.html')

@app.route("/usAnalysisCO")
def usAnalysisCO():
	return render_template('index6.html')

@app.route("/usAnalysisBC")
def usAnalysisBC():
	return render_template('index7.html')

if __name__ == '__main__':
	app.run(debug=True)

