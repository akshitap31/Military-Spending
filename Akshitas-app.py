import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from flask import Flask, jsonify
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
    return "hello World!"

# Choropleth
# @app.route("/choropleth")

# #Timeline
@app.route("/timeline")
def timeline_data():
    conn = engine.connect()
    df = pd.read_sql("SELECT * FROM tms", conn)
    my_dict={}
    for index, row in df.iterrows():
        my_dict[row['name']] = [{colname:row[colname]} for colname in df.columns[2:]]
    return jsonify(my_dict)

if __name__ == "__main__":
    app.run(debug=True)