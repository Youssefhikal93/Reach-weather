import { useEffect, useState } from "react";
import "./App.css";

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

// function convertToFlag(countryCode) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt());
//   return String.fromCodePoint(...codePoints);
// }
function convertToFlag(countryCode) {
  return (
    <img
      src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
      alt={`Flag of ${countryCode}`}
      style={{ width: "24px", height: "18px", marginLeft: "0.5rem" }}
    />
  );
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

function App() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [location, setLocation] = useState("");
  const [location, setLocation] = useState({ name: "", countryCode: "" });

  const [weather, setWeather] = useState({}); // weather state is an object

  useEffect(
    function () {
      const controller = new AbortController(); // For cleanup

      async function fetchWeatherData() {
        try {
          if (input.length < 3) {
            setWeather({});
            setLocation("");
            return;
          }

          setIsLoading(true);

          // 1) Getting location (geocoding)
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${input}`,
            { signal: controller.signal }
          );
          const geoData = await geoRes.json();
          console.log(geoData);

          if (!geoData.results) throw new Error("Location not found");

          const { latitude, longitude, timezone, name, country_code } =
            geoData.results.at(0);
          console.log(`${name} ${convertToFlag(country_code)}`);
          // setLocation(`${name} ${convertToFlag(country_code)}`);
          setLocation({ name, countryCode: country_code });
          // 2) Getting actual weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`,
            { signal: controller.signal }
          );
          const weatherData = await weatherRes.json();
          console.log(weatherData.daily);
          setWeather(weatherData.daily);
        } catch (err) {
          // Ignore abort errors
          if (err.name !== "AbortError") {
            console.error(err);
            // Optionally clear weather/location on error
            setWeather({});
            setLocation("Could not fetch weather");
          }
        } finally {
          setIsLoading(false);
        }
      }
      fetchWeatherData();

      // Cleanup function to abort fetch on re-render or unmount
      return function () {
        controller.abort();
      };
    },
    [input]
  );

  return (
    <>
      <Main
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        location={location}
        weather={weather}
      ></Main>
    </>
  );
}

function Main({ input, setInput, isLoading, weather, location }) {
  return (
    <div className="app">
      <h1>🌤️ Weatherak⚡</h1>
      <input
        placeholder="Enter your location.... 🔍"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></input>

      {isLoading && <p className="loader">Loading...</p>}
      {!isLoading && weather.time && (
        <Weather weather={weather} location={location} />
      )}
    </div>
  );
}

function Weather({ weather, location }) {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    weathercode,
    time,
  } = weather;

  return (
    <div>
      {/* <h2>Weather: {location}</h2> */}
      <h2>
        Weather: {location.name} {convertToFlag(location.countryCode)}
      </h2>
      <ul className="weather">
        {time.map((date, index) => (
          <Day
            key={date}
            date={date}
            maxTemp={max[index]}
            minTemp={min[index]}
            code={weathercode[index]}
            isToday={index === 0}
          />
        ))}
      </ul>
    </div>
  );
}

function Day({ date, maxTemp, minTemp, code, isToday }) {
  return (
    <li className="day">
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? "Today" : formatDay(date)}</p>
      <p>
        {Math.floor(minTemp)}&deg; &mdash;{" "}
        <strong>{Math.ceil(maxTemp)}&deg;</strong>
      </p>
    </li>
  );
}

export default App;
