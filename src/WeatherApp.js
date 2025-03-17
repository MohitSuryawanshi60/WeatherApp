import React, { useState, useEffect } from "react";
import "./WeatherApp.css";

const API_KEY = "374d896914216c4701b03c075e82b6f0"; 

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setError("Unable to fetch location");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      setWeather(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    try {
      if (!city) {
        setError("Please enter a city name");
        return;
      }
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      setWeather(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
      setLoading(false);
    }
  };

  const getBackgroundImage = () => {
    if (!weather || !weather.weather) return "/images/default.jpg"; 

    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("clear")) return "/images/clear.jpg";
    if (condition.includes("cloud")) return "/images/cloudy.jpg";
    if (condition.includes("rain")) return "/images/rainy.jpg";
    if (condition.includes("snow")) return "/images/snowy.jpg";

    return "/images/default.jpg"; 
  };

  return (
    <div
      className="weather-container"
      style={{
        background: `url(${getBackgroundImage()}) no-repeat center center/cover`,
      }}
    >
      <h1>My Weather</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={fetchWeatherByCity}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && weather.weather && weather.main ? (
        <div className="weather-info">
          <h2>{weather.name}, {weather.sys?.country}</h2>
          <p>{weather.weather[0]?.description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherApp;

