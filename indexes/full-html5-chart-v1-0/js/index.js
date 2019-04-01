new ChartworksBuilder({
  "token": "demo-token",
  "target": "#chartTarget",
  "symbol": "AAPL",
  "exchange": "NSQ",
  "timeframe": "1y",
  "realTime": false,
  "typeAheadAPI": "https://api.markitondemand.com/apiman-gateway/MOD/chartworks-xref/1.0/xref/predictive?search=%s",
  "compareMenuOptions": [{
    "symbol": "INFO",
    "exchange": "NSQ",
    "displayName": "IHS Markit Ltd"
  }],
  "cultureCode": "en-US",
  "style.indicator.price.lineColor": "orange",
  "style.indicator.price.lineWidth": "3",
  "panel.lower.indicator": "Volume",
  "feature.symbolSearch": true,
  "feature.comparison": true,
  "feature.timeframe": true,
  "feature.indicators": true,
  "feature.intraday": true,
  "feature.events": true,
  "feature.markerType": true,
  "feature.saveLoad": true,
  "feature.tools": true,
  "theme": "dark",
  "onChartLoad": function() {
    // get the date 30 days ago
    var d30 = new Date();
    d30.setDate(d30.getDate() - 30);

    // get the date 150 days ago
    var d150 = new Date();
    d150.setDate(d150.getDate() - 150);

    // add a custom event
    this.loadCustomEvents([{
      "date": d30.toISOString(),
      "iconCharacter": "P",
      "iconCharacterColor": "black",
      "iconBackgroundColor": "white",      
      "rolloverTitle": "Prediction",
      "rolloverBodyHTML": "30 days from now you'll view this <a href=\"https://chartworks.io/Documentation/html5#html5-methods-loadCustomEvents\" target=\"_blank\" style=\"color:#2BA92B!important\">custom event</a>!"
    }, {
      "date": d150.toISOString(),
      "iconCharacter": "V",
      "iconCharacterColor": "white",
      "iconBackgroundColor": "#2BA92B",
      "rolloverTitle": "Chartworks Video",
      "rolloverBodyHTML": "<a href=\"https://vimeo.com/165624026\" target=\"_blank\" style=\"color:#2BA92B!important\">Watch the full version</a><br><br><iframe src=\"https://player.vimeo.com/video/165624026\" width=\"150\" height=\"84\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"
    }]);

  },
  "onPrimarySymbolChange": function(args) {
    console.log(args.symbol, args.exchangeId);

    // Display a nice message when trying to get unentitled data
    if (args.symbol != "AAPL" && args.symbol != "INFO") {
      this.showDialog("Alert", "This demo is only entitled to symbols AAPL and INFO on the NASDAQ. All other symbols will fail.");
    }
  },
  "onAPIError": function(apiError) {
    // handle 401 (unauthorized)
    if (apiError.status === 401) {
      // show dialog that we are getting a new token
      this.showDialog("Token expired", "Loading new token...");

      // use getInvalidTokenCount to ensure we don't get stuck in an
      // endless loop if we keep creating bad tokens
      if (this.getInvalidTokenCount() < 5) {
        var objChart = this;
        getNewToken(function(newToken) {
          // set token
          objChart.setConfigParam("token", newToken);

          // load data
          objChart.loadData();
        });
      } else { // fail after 5 unsuccessful tries
        this.showDialog("Warning", "Max number of auth attempts reached. Your token generation is no good!");
      }
    } else { // print other errors in the console
      console.log(apiError.status, apiError.statusMsg);
    }
  }
});

// Your code should generate a new token.
// This is just an example
function getNewToken(onComplete) {
  // timeout to simulate a slow request
  setTimeout(function() {
    var token = "demo-token";
    onComplete(token);
  }, 1000);
}