const express = require("express");
const app = express();
const ejs = require("ejs");
const https = require("https");
const fetch = require("node-fetch");

//api key
require("dotenv").config();
const myKey = process.env.OPENWEATER_TOKEN;

//k to cel
function ktoC(k) {
  return (k - 273.15).toFixed(2);
}

//middleware
app.use(express.static("public"));
app.set("view engine", "ejs");

// router
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/:city", (req, res) => {
  let { city } = req.params;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`;

  //get request made by node js
  https.get(url, (response) => {
    console.log("statusCode:", response.statusCode); //可看執行後的結果
    console.log("headers:", response.headers); //有實用的資訊
  });

  //node-fetch
  fetch(url)
    .then((d) => d.json())
    .then((djs) => {
      let { temp } = djs.main;
      let newTemp = ktoC(temp);
      res.render("weather.ejs", { djs, newTemp });
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
