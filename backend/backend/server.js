const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");
const { XMLParser } = require("fast-xml-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function getRainBin(rainfall) {
  if (rainfall === 0) return "none";
  if (rainfall > 0 && rainfall <= 1) return "light";
  if (rainfall > 1 && rainfall <= 4) return "moderate";
  return "heavy";
}

app.get("/", (req, res) => {
  res.json({ message: "Dublin Bus Weather API is running with Node.js" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/debug-env", (req, res) => {
  res.json({
    hasKey: !!process.env.NTA_API_KEY,
    keyLength: process.env.NTA_API_KEY?.length || 0,
    url: process.env.NTA_GTFS_URL
  });
});

app.get("/test-nta", async (req, res) => {
  try {
    const response = await axios.get(process.env.NTA_GTFS_URL, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      responseType: "arraybuffer",
      headers: {
        "x-api-key": process.env.NTA_API_KEY,
        "Ocp-Apim-Subscription-Key": process.env.NTA_API_KEY
      }
    });

    res.json({
      success: true,
      status: response.status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      status: error.response?.status
    });
  }
});

app.get("/gtfs/trip-updates", async (req, res) => {
  try {
    const response = await axios.get(process.env.NTA_GTFS_URL, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      responseType: "arraybuffer",
      headers: {
        "x-api-key": process.env.NTA_API_KEY,
        "Ocp-Apim-Subscription-Key": process.env.NTA_API_KEY
      }
    });

    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(response.data)
    );

    const delays = [];

    feed.entity.forEach((entity) => {
      const updates = entity.tripUpdate?.stopTimeUpdate || [];

      updates.forEach((stop) => {
        if (stop.arrival?.delay !== undefined) {
          delays.push(stop.arrival.delay);
        }
      });
    });

    const totalDelaySeconds = delays.reduce((sum, delay) => sum + delay, 0);

    const averageDelaySeconds =
      delays.length > 0 ? totalDelaySeconds / delays.length : 0;

    const averageDelayMinutes = averageDelaySeconds / 60;

    const delayedTrips = delays.filter((delay) => delay > 120).length;

    res.json({
      success: true,
      entities: feed.entity.length,
      delay_samples: delays.length,
      average_delay_seconds: Number(averageDelaySeconds.toFixed(2)),
      average_delay_minutes: Number(averageDelayMinutes.toFixed(2)),
      delayed_trips: delayedTrips,
      sample: feed.entity.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      status: error.response?.status
    });
  }
});

app.get("/weather/sample", (req, res) => {
  res.json({
    source: "Met Eireann sample",
    location: "Dublin",
    rainfall_mm: 2.4,
    rain_bin: "moderate",
    timestamp: new Date().toISOString()
  });
});

app.get("/weather/dublin", async (req, res) => {
  try {
    const metUrl =
      "http://openaccess.pf.api.met.ie/metno-wdb2ts/locationforecast?lat=53.3498;long=-6.2603";

    const response = await axios.get(metUrl);

    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(response.data);
    const times = parsed.weatherdata.product.time;

    const rainfallRecord = times.find((item) => {
      return item.location && item.location.precipitation;
    });

    const rainfallValue =
      rainfallRecord?.location?.precipitation?.["@_value"] || 0;

    const rainfall = Number(rainfallValue);
    const rainBin = getRainBin(rainfall);

    res.json({
      source: "Met Eireann Forecast API",
      location: "Dublin",
      rainfall_mm: rainfall,
      rain_bin: rainBin,
      forecast_time: rainfallRecord?.["@_from"] || rainfallRecord?.["@_to"] || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch Met Eireann weather data",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});