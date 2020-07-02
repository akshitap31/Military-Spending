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

@app.route("/country_names")
def count_names():
    conn = engine.connect()
    df = pd.read_sql("SELECT * FROM gdp", conn)
    names=df.name.unique()
    return names
@app.route("/amountdata/<country>")
def amount_data(country):
    conn = engine.connect()
    df = pd.read_sql('SELECT * FROM tms WHERE name = "'+ str(country)+'"', conn)
    df=df.fillna(0)
    df=df.loc[:, (df != 0).any(axis=0)]
    df=df.drop(['name', 'code'], axis=1)
    output=df.to_json(orient="split")
    return  output 
@app.route("/gdpdata/<country>")
def gdp_data(country):
    conn = engine.connect()
    gdpdf = pd.read_sql('SELECT * FROM gdp WHERE name = "'+ str(country)+'"', conn)
    gdpdf=gdpdf.fillna(0)
    gdpdf=gdpdf.loc[:, (gdpdf != 0).any(axis=0)]
    gdpdf=gdpdf.drop(['name', 'code'], axis=1)
    gdp_output=gdpdf.to_json(orient="split")
    return  gdp_output

if __name__ == "__main__":
    app.run(debug=True)