const axios = require("axios");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { log } = require("console");
const app = express();
require("dotenv").config()

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
let API_KEY=process.env.API_key

function MakeDataFile(data) {
  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log("File written successfully.");
  });
}

app.get("/getData", (req, res) => {
  let s = req.query.key;
  s = s.slice(1, 5);
  console.log(s);
  axios
    .request({
      method: "GET",
      url: "https://alpha-vantage.p.rapidapi.com/query",
      params: {
        interval: "5min",
        function: "TIME_SERIES_INTRADAY",
        // symbol: "MSFT",
        symbol: s,
        datatype: "json",
        output_size: "compact",
      },
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
      },
    })
    .then(function (response) {
      // console.log(response);
      responseData = response.data["Time Series (5min)"]; // adding specific data to our list

      // processing the data
      let dataDate = Object.keys(responseData)[0].slice(0, 10);
      let resData = { Date: dataDate, values: [] };
      let keyArr = Object.keys(responseData);
      let valArr = Object.values(responseData);
      let len = Object.keys(responseData).length;

      for (let i = 0; i < len; i++) {
        let timeData = keyArr[i].slice(11, 16);
        delete Object.assign(valArr[i], { ["Open"]: valArr[i]["1. open"] })["1. open"];
        delete Object.assign(valArr[i], { ["High"]: valArr[i]["2. high"] })["2. high"];
        delete Object.assign(valArr[i], { ["Low"]: valArr[i]["3. low"] })["3. low"];
        delete Object.assign(valArr[i], { ["Close"]: valArr[i]["4. close"] })["4. close"];
        delete Object.assign(valArr[i], { ["Volume"]: valArr[i]["5. volume"] })["5. volume"];
        valArr[i].Time = timeData;
        resData.values.push(valArr[i]);
      }

      MakeDataFile(resData); // writing the data to the file

      res.send(resData); // sending response
      console.log("data Sent");
    })
    .catch(function (error) {
      console.log("error encountered");
      console.log(error.message);
    });
});

app.get("/testAPI", (req, res) => {
  console.log(req.query.q);
  let a = [1, 2, 3, 4];
  res.send(a);
});

app.listen(5000, () => {
  console.log("server running on 5000");
});
