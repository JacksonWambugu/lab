const unirest = require("unirest");
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs'); // Import the EJS package

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS and specify the views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Create a "views" directory in your project folder

// Include all static files so you can use CSS
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", function (request, response) {
  let city = request.body.city;

  if (!city || city.trim() === "") {
    // Handle the empty input case, for example, by rendering an error page
    response.render('error', { message: "City name is required." });
  } else {
  const req = unirest("GET", "https://openweather43.p.rapidapi.com/weather");
  // city = city + ", USA"  // Add country if needed
  req.query({
    "q": city,
    "lang": "en",
    "units": "imperial"
  });

  req.headers({
    "x-rapidapi-key": "259097e048msh5e737e0a32f5220p19baaejsna1312c4dadb4",
    "x-rapidapi-host": "openweather43.p.rapidapi.com",
    "useQueryString": true
  });

  req.end(function (res) {
    if (res.error) throw new Error(res.error);
    // Render the response template with the weather data
    response.render('response', { Temperature: res.body.main.temp,Humidity: res.body.main.humidity,Wind_speed: res.body.wind.speed});
 
  });
}});

let port = process.env.PORT || 8002;
app.listen(port, function () {
  console.log("Server running on port 8002");
});
