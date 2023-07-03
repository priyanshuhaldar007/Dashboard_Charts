from fastapi  import FastAPI
import requests
import pandas as pd
import matplotlib.pyplot as plt
# import sklearn
from sklearn import linear_model

import random

app = FastAPI()

@app.get('/')
async def root():
    request = (requests.get('http://localhost:5000/getData?key="MSFT"')).json()
    values = request["values"]

    make_model(values)
    
    return {'example':'This is an example','data':0}

def make_model(values):
    Open,High,Low,Close,Vol,Time = [],[],[],[],[],[]

    # putting the API data in arrays
    for i in values:
        Open.append(float(i["Open"]))
        High.append(float(i["High"]))
        Low.append(float(i["Low"]))
        Close.append(float(i["Close"]))
        Vol.append(float(i["Volume"]))
        # time preprocessing
        Time.append(float((i["Time"]).replace(':','.')))

    # creating dataframe
    dfOpen = pd.DataFrame(list(zip(Time, Open)),columns=['Time','Open'])
    dfHigh = pd.DataFrame(list(zip(Time, High)),columns=['Time','High'])
    dfLow = pd.DataFrame(list(zip(Time, Low)),columns=['Time','Low'])
    dfClose = pd.DataFrame(list(zip(Time, Close)),columns=['Time','Close'])
    dfVol = pd.DataFrame(list(zip(Time, Vol)),columns=['Time','Vol'])

    # print(dfOpen.head())
    # print(dfHigh.head())
    # print(dfLow.head())
    # print(dfClose.head())
    # print(dfVol.head())

    # %matplotlib inline
    # print("graph:- ")
    # plt.xlabel('Time')
    # plt.ylabel('Open')
    plt.scatter(dfOpen.Time,dfOpen.Open,color='red',marker='+')
    # plt.plot(dfOpen.Time,dfOpen.Open)
    plt.show()
    # plt.scatter(dfHigh.Time,dfHigh.High,color='blue',marker='+')
    # plt.plot(dfHigh.Time,dfHigh.High)
    # plt.show()

    # -----------------------
    reg = linear_model.LinearRegression()
    reg.fit(dfOpen[['Time']],dfOpen.Open)
    # print(reg.coef_)

    # return request
    print("another fuction being executed")