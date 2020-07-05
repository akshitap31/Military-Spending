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
@app.route("/amountdata/<country>")
def amount_data(country):
    conn = engine.connect()
    df = pd.read_sql('SELECT * FROM tms WHERE name = "'+ str(country)+'"', conn)
    df=df.fillna(0)
    df=df.loc[:, (df != 0).any(axis=0)]
    df=df.drop(['name', 'code'], axis=1)
    df=df.transpose().reset_index()
    df.columns=["year", "amount"]
    df["amount"]=df["amount"]/1000
    output=df.to_json(orient="records")
    return  output 
@app.route("/gdpdata/<country>")
def gdp_data(country):
    conn = engine.connect()
    gdpdf = pd.read_sql('SELECT * FROM gdp WHERE name = "'+ str(country)+'"', conn)
    gdpdf=gdpdf.fillna(0)
    gdpdf=gdpdf.loc[:, (gdpdf != 0).any(axis=0)]
    gdpdf=gdpdf.drop(['name', 'code'], axis=1)
    gdpdf=gdpdf.transpose().reset_index()
    gdpdf.columns=["year", "gdp"]
    gdp_output=gdpdf.to_json(orient="records")
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
    df=df.loc[df["Amount (in 1000 USD)"] !=0]
    gdp_df=gdp_df.loc[gdp_df["Amount (in % of GDP)"] !=0]
    merged_df=df.merge(gdp_df, on="Year", how="inner")
    merged_df=merged_df.merge(amt_df, on="Year", how="left")
    merged_df=merged_df.merge(gdprank_df, on="Year", how="left")
    data=merged_df.to_json(orient="records")
    # data=merged_df.to_html(classes="table-striped", index=False).replace("\n","")
    return data

@app.route("/posession/<country>")
def posession(country):
    url="https://en.wikipedia.org/wiki/List_of_countries_by_level_of_military_equipment"
    tables=pd.read_html(url)
    posession_df=tables[3]
    posession_df=posession_df.drop(["Military budget(US$ bn)[b]","Military budget(US$ bn)[b].1", "Sources"], axis=1)
    posession_df=posession_df.rename(columns={"Countries[a]":"Country", "Military aircraft[c]":"Military aircraft", "Attack helicopters[d]":"Attack helicopters", "Nuclear weapons[2]":"Nuclear weapons", "AWS": "Amphibious Warfare Ship"})
    posession_df=posession_df.drop(170)
    posession_df=posession_df.loc[posession_df["Country"]==country]
    posession_df=posession_df.drop(['Country'], axis=1)
    posession_df=posession_df.loc[:, (posession_df != 0).any(axis=0)]
    colnames=["Frigates", "Corvettes","Military aircraft", "Nuclear weapons","Military satellites" ]
    for col in colnames:
        posession_df[col]=posession_df[col].str.split('[').str[0].apply(pd.to_numeric, errors='coerce')
    posession=posession_df.to_json(orient="records")
    return posession
@app.route("/posession_average")
def posession_avg():
    url="https://en.wikipedia.org/wiki/List_of_countries_by_level_of_military_equipment"
    tables=pd.read_html(url)
    posession_df=tables[3]
    posession_df=posession_df.drop(["Military budget(US$ bn)[b]","Military budget(US$ bn)[b].1", "Sources"], axis=1)
    posession_df=posession_df.rename(columns={"Countries[a]":"Country", "Military aircraft[c]":"Military aircraft", "Attack helicopters[d]":"Attack helicopters", "Nuclear weapons[2]":"Nuclear weapons", "AWS": "Amphibious Warfare Ship"})
    posession_df=posession_df.drop(170)
    colnames=["Frigates", "Corvettes","Military aircraft", "Nuclear weapons","Military satellites" ]
    for col in colnames:
        posession_df[col]=posession_df[col].str.split('[').str[0].apply(pd.to_numeric, errors='coerce')
    posession_mean=pd.DataFrame(posession_df.mean().round(0)).to_json()
    return posession_mean 
@app.route("/personnel_average")
def personnel_avg():
    url1="https://en.wikipedia.org/wiki/List_of_countries_by_number_of_military_and_paramilitary_personnel"
    table=pd.read_html(url1)
    df=table[0]
    df["Country"]=df["Country"].str.split('[').str[0]
    personnel_df=df[["Active military", "Reserve military","Paramilitary" ]]
    personnel_mean=pd.DataFrame(personnel_df.mean()).transpose().round()
    personnel_mean=personnel_mean.to_json(orient="records")
    return personnel_mean
@app.route("/personnel/<country>")
def personnel_info(country):
    url1="https://en.wikipedia.org/wiki/List_of_countries_by_number_of_military_and_paramilitary_personnel"
    table=pd.read_html(url1)
    df=table[0]
    df["Country"]=df["Country"].str.split('[').str[0]
    df=df.loc[df["Country"]== country]
    personnel_df=df[["Active military", "Reserve military","Paramilitary" ]]
    personnel=personnel_df.to_json(orient="records")
    return personnel


if __name__ == "__main__":
    app.run(debug=True)
