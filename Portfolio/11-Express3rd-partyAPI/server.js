require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();


const apiKey = process.env.API_KEY;

app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000,()=>{
    console.log("Listen on port 3000");
});

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post("/",(req,res)=>{
    const cityName = req.body.cityName;
    const units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;

    https.get(url,(response)=>{
        let data="";

        if(response.statusCode !== 200){
            return res.send("<h1>Unable to get the weather data. Try it later</h1><br/><a href='/'>Return</a>")
        }

        response.on("data",(chunks)=>{
            data+=chunks;
        });

        response.on("end",()=>{
            const weatherData= JSON.parse(data);
            const temp=weatherData.main.temp;
            const description= weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            res.write("<h1>The temperature  in "+cityName+" is "+temp+" C</h1>");
            res.write("<p>Description: "+description+"</p>");
            res.write(`<img src="${iconUrl}" alt="Weather icon">`);
            res.write('<br><a href="/">Return</a>');
            res.send();
        });
    }).on("error",(err)=>{
        res.send("<h1>Error: Unable to handle the request</h1><br/><a href='/'>Return</a> ");
    });
});


