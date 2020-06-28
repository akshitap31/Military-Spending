from flask import Flask, jsonify, render_template
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
import datetime as dt
import pandas as pd

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///db/military.sqlite", echo=True)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to tables
TMS_Table = Base.classes.tms
GDP_Table = Base.classes.gdp

# Create our session (link) from Python to the DB
session = Session(engine)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return render_template("index.html")
    # return (
    #     f"Welcome to the Military Spending API!<br/>"
    #     f"Available Routes:<br/>"
    #     f"To return a JSON list of Total Military Spending, append: /api/v1.0/tms<br/>"
    #     f"To return a JSON list of spending as a percentage of GDP, append: /api/v1.0/gdp<br/>"
    # )


@app.route("/tms/<year>")
def tms(year):
    query = f"""SELECT name, "{year}" FROM tms ORDER BY 2 DESC LIMIT 10"""
    conn = engine.connect()
    tms_df = pd.read_sql(query, conn)
    return tms_df.to_json(orient="values")

@app.route("/gdp/<year>")
def gdp(year):
    query = f"""SELECT name, "{year}" FROM gdp ORDER BY 2 DESC LIMIT 10"""
    conn = engine.connect()
    gdp_df = pd.read_sql(query, conn)
    return gdp_df.to_json(orient="values")


@app.route("/api/v1.0/tobs")
def tobs():
    """Return a JSON list of temperature observations (TOBS) for the previous year."""
    #Retreive max date data from engine into tuple and retreive first element of tuple
    max_date = session.query(TMS_Table.date).order_by(TMS_Table.date.desc()).first()
    max_date = max_date[0]
    
    #Calculate the date 1 year ago from today
    year_ago = dt.datetime.strptime(max_date, "%Y-%m-%d") - dt.timedelta(days=366)
    
    #Return the observation data
    results_tobs = session.query(TMS_Table.date, TMS_Table.tobs).filter(TMS_Table.date >= year_ago).all()
    
    #Convert data into list for returning
    tobs_list = list(results_tobs)
    
    #Return JSONified data from list
    return jsonify(results_tobs)


@app.route("/api/v1.0/<start>")
def start(start=None):
    """Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start date."""
    
    #Pull data from engine for dates after start date specified
    start_data = session.query(TMS_Table.date, func.min(TMS_Table.tobs), func.avg(TMS_Table.tobs), func.max(TMS_Table.tobs)).filter(TMS_Table.date >= start).group_by(TMS_Table.date).all()
    
    #Convert data into list for returning
    start_list=list(start_data)
    
    #Return JSONified data from list
    return jsonify(start_list)


@app.route("/api/v1.0/<start>/<end>")
def start_end(start=None, end=None):
    """Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given date range."""
    
    #Pull data from engine for dates range specified
    range_data = session.query(TMS_Table.date, func.min(TMS_Table.tobs), func.avg(TMS_Table.tobs), func.max(TMS_Table.tobs)).filter(TMS_Table.date >= start).filter(TMS_Table.date <= end).group_by(TMS_Table.date).all()
    
    #Convert data into list for returning
    range_list=list(range_data)
    
    #Return JSONified data from list
    return jsonify(range_list)


if __name__ == "__main__":
    app.run(debug=True)
