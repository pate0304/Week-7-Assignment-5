
//MyWidget Script
/**************************
Add a link for a CSS file that styles .mywidget
Add a script tag that points to CDN version of jQuery 1.*
Add a script tag that loads your script file from http://m.edumedia.ca/
**************************/
var scriptsLoaded = 0;
document.addEventListener("DOMContentLoaded", function() {
   var css = document.createElement("link");
   css.setAttribute("rel", "stylesheet");
   css.setAttribute("href", "css/weather-icons.css");
   css.addEventListener("load", loadCount);
   document.querySelector("head").appendChild(css);
   var jq = document.createElement("script");
   jq.addEventListener("load", loadCount);
   jq.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js");
   document.querySelector("head").appendChild(jq);
});

function buildWidget(cls) {
   var forecastKey = "0d9c129bbad86897906ba4fdb281d0a5";
   var lat = "45.348391";
   var long = "-75.757045";
   $.ajax({
       url: "https://api.forecast.io/forecast/" + forecastKey + "/" + lat + "," + long + "?units=ca",
       type: "GET",
       dataType: "jsonp",
       success: function(resp) {
           forCurrent(resp.currently);
           forHourly(resp.hourly);
           console.log(resp);
       },
       error: function() {
           alert("An error occurred");
       }
   });
}

function forCurrent(current) {
   var today = new Date();
   var holdwidget = $(".weather-forecast");
   $("<p>").text("Current Conditions for today, " + today.getDate() + "/" + (parseInt(today.getMonth()) + 1)).appendTo(holdwidget);
   $("<i>").addClass("wi").addClass("wi-forecast-io-" + current.icon).addClass("current").appendTo(holdwidget);
   $("<p>").text("Temperature " + current.temperature + " C").appendTo(holdwidget);
   $("<p>").text(current.summary).appendTo(holdwidget);
}

function forHourly(hourly) {
   var table = $("<table>");
   var today = new Date();
   for (var i = 0; i < hourly.data.length; i++) {
       var forhour = hourly.data[i];
       var time = new Date(forhour.time * 1000);
       if (time.getDate() === today.getDate()) {
           time = time.getHours() + ":00";
           var tableValue = $("<tr>");
           $("<td>").text(time).appendTo(tableValue);
           $("<td>").text(forhour.humidity.toString().split(".")[1] + "%").appendTo(tableValue);
           $("<td>").text(forhour.cloudCover === 1 ? "100%" : forhour.cloudCover.toString().split(".")[1] + "%").appendTo(tableValue);
           $("<td>").text(forhour.temperature + " C").appendTo(tableValue);
           $("<td>").text(forhour.windSpeed + " km/h").appendTo(tableValue);
           $("<i>").addClass("wi").addClass("wi-forecast-io-" + forhour.icon).appendTo($("<td>")).appendTo(tableValue);
           $("<td>").text(forhour.summary).appendTo(tableValue);
           tableValue.appendTo(table);
       }
   }
   table.appendTo($(".weather-forecast"));
}

function loadCount() {
   scriptsLoaded++;
   if (scriptsLoaded === 2) {
       buildWidget(".weather-forecast");
       console.log("both scripts loaded");
   }
}