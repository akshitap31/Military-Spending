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

@app.route("/timeline/tms")
def timeline_data_tms():
    conn = engine.connect()
    df = pd.read_sql("SELECT * FROM tms", conn)
    df=df.fillna(0)
    my_dict={}
    for colname in df.columns[2:]:
            my_dict[colname]= [{"name": row["name"], "value": row[colname]} for index, row in df.iterrows()]
    for lis in my_dict:
        my_dict[lis]=sorted(my_dict[lis], key= lambda i:i["value"], reverse=True)
        for dic in my_dict[lis]:
            dic["rank"]=my_dict[lis].index(dic)+1
    return my_dict

@app.route("/timeline/gdp")
def timeline_data_gdp():
    conn = engine.connect()
    df = pd.read_sql("SELECT * FROM gdp", conn)
    df=df.fillna(0)
    my_dict={}
    for colname in df.columns[2:]:
            my_dict[colname]= [{"name": row["name"], "value": row[colname]} for index, row in df.iterrows()]
    for lis in my_dict:
        my_dict[lis]=sorted(my_dict[lis], key= lambda i:i["value"], reverse=True)
        for dic in my_dict[lis]:
            dic["rank"]=my_dict[lis].index(dic)+1
    return my_dict

if __name__ == "__main__":
    app.run(debug=True)
