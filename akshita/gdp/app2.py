import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from flask import Flask, jsonify, render_template
import pandas as pd
import json

engine = create_engine("sqlite:///../project2-repository/db/military.sqlite")
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
    names=list(df.name.unique())
    names=json.dumps(names)
    return names
@app.route("/amountdata/<country>")
def amount_data(country):
    conn = engine.connect()
    a_df = pd.read_sql('SELECT * FROM tms WHERE name = "'+ str(country)+'"', conn)
    a_df=a_df.fillna(0)
    a_df=a_df.loc[:, (a_df != 0).any(axis=0)]
    a_df=a_df.drop(['name', 'code'], axis=1)
    output=a_df.to_json(orient="split")
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

@app.route("/ranktable/<country>")
def rank_table(country):
    conn = engine.connect()
    gdp_df = pd.read_sql('SELECT * FROM gdp', conn)
    df = pd.read_sql('SELECT * FROM tms', conn)
    amt_df=pd.DataFrame(df["name"])
    gdprank_df=pd.DataFrame(gdp_df["name"])
    # country="United States"
    colnames=df.columns[2:]
    for col in colnames:
        amt_df["rank"+col]=df[col].rank(ascending=False).round(decimals=0)
        gdprank_df["rank"+col]=gdp_df[col].rank(ascending=False)
    amt_df=amt_df.loc[amt_df["name"]==country].transpose().reset_index().dropna().drop(0).applymap(lambda x: str(x).lstrip('rank'))
    amt_df.columns=["Year","Rank(Amount)"]
    gdprank_df=gdprank_df.loc[gdprank_df["name"]==country].transpose().reset_index().dropna().drop(0).applymap(lambda x: str(x).lstrip('rank'))
    gdprank_df.columns=["Year","Rank(Share of GDP)"]
    df=df.loc[df["name"]==country].transpose().reset_index().dropna().drop(0).drop(1)
    df.columns=["Year","Amount (in 1000 USD)"]
    df["Amount (in 1000 USD)"]=df["Amount (in 1000 USD)"]/1000
    gdp_df=gdp_df.loc[gdp_df["name"]==country].transpose().reset_index().dropna().drop(0).drop(1)
    gdp_df.columns=["Year","Amount (in % of GDP)"]
    merged_df=df.merge(gdp_df, on="Year", how="inner")
    merged_df=merged_df.merge(amt_df, on="Year", how="inner")
    merged_df=merged_df.merge(gdprank_df, on="Year", how="inner")
    data=merged_df.to_json(orient="records")
    # data=merged_df.to_html(classes="table-striped", index=False).replace("\n","")
    return data
if __name__ == "__main__":
    app.run(debug=True)