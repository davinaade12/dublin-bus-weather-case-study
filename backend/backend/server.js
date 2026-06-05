const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Dublin Bus Weather API is running with Node.js"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
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
    const response = await axios.get(
      process.env.NTA_GTFS_URL,
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        }),
        responseType: "arraybuffer",
        headers: {
          "x-api-key": process.env.NTA_API_KEY,
          "Ocp-Apim-Subscription-Key": process.env.NTA_API_KEY
        }
      }
    );

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
    const response = await axios.get(
      process.env.NTA_GTFS_URL,
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        }),
        responseType: "arraybuffer",
        headers: {
          "x-api-key": process.env.NTA_API_KEY,
          "Ocp-Apim-Subscription-Key": process.env.NTA_API_KEY
        }
      }
    );

    const feed =
      GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
        new Uint8Array(response.data)
      );

    res.json({
      success: true,
      entities: feed.entity.length,
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});