"use client";

import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [gtfs, setGtfs] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const weatherResponse = await fetch("http://localhost:5000/weather/sample");
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      const gtfsResponse = await fetch("http://localhost:5000/gtfs/trip-updates");
      const gtfsData = await gtfsResponse.json();
      setGtfs(gtfsData);
    }

    fetchData();
  }, []);

  async function saveTestRecord() {
    await addDoc(collection(db, "weather_records"), {
      source: weather?.source || "Met Eireann",
      location: weather?.location || "Dublin",
      rainfall_mm: weather?.rainfall_mm || 0,
      rain_bin: weather?.rain_bin || "unknown",
      gtfs_entities: gtfs?.entities || 0,
      created_at: new Date().toISOString()
    });

    alert("Weather + GTFS record saved to Firebase");
  }

  return (
    <main className="page">
      <section className="hero">
        <h1>Dublin Bus Rainfall Impact Dashboard</h1>
        <p>
          This dashboard compares live NTA GTFS-Realtime transport data with
          Met Éireann rainfall data to study how rain may affect Dublin Bus
          reliability.
        </p>
      </section>

      <section className="cards">
        <div className="card">
          <h2>GTFS Feed Status</h2>
          <p className="status">{gtfs?.success ? "Connected" : "Loading..."}</p>
        </div>

        <div className="card">
          <h2>Trip Updates</h2>
          <p>{gtfs?.entities ?? "Loading..."}</p>
        </div>

        <div className="card">
          <h2>Rainfall</h2>
          <p>{weather ? `${weather.rainfall_mm} mm` : "Loading..."}</p>
          <p>{weather?.rain_bin}</p>
        </div>

        <div className="card">
          <h2>Weather Source</h2>
          <p>{weather?.source ?? "Loading..."}</p>
        </div>

        <div className="card">
          <h2>Location</h2>
          <p>{weather?.location ?? "Loading..."}</p>
        </div>

        <div className="card">
          <h2>Last Updated</h2>
          <p>
            {weather?.timestamp
              ? new Date(weather.timestamp).toLocaleTimeString()
              : "Loading..."}
          </p>
        </div>
      </section>

      <button className="saveButton" onClick={saveTestRecord}>
        Save Weather + GTFS Record to Firebase
      </button>
    </main>
  );
}