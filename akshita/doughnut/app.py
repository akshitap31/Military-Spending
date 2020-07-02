import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from flask import Flask, jsonify, render_template
import pandas as pd

engine = create_engine("sqlite:///project2-repository/db/military.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)
# Military = Base.classes.tms
# # Station=Base.classes.station
# Measurement = Base.classes.measurement
# Station=Base.classes.station
app = Flask(__name__)
# Basic Country wise Amount and share of GDP Chart
@app.route("/")
def render_index():
    # return "hello World!"
    return render_template("index.html")

# Choropleth
# @app.route("/choropleth")

# #Timeline
@app.route("/timeline")
def timeline_data():
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

# @app.route("/timeline_names")
# def timeline_names():
#     conn = engine.connect()
#     df = pd.read_sql("SELECT * FROM tms", conn)
#     df=df.fillna(0)
#     names=[]
#     names.append(row["name"] for index, row in df.iterrows())
#     return names


if __name__ == "__main__":
    app.run(debug=True)