# 🌤️ Weather App - React

### [Live-website](https://Youssefhikal93.github.io/React-weather-by-location)

A responsive weather application built with React that displays current and forecasted weather data for any location worldwide.

## 🚀 Features

- **Real-time Weather Data**: Fetches up-to-date weather information from Open-Meteo API
- **7-Day Forecast**: Displays daily weather including min/max temperatures
- **Location Search**: Find weather by city name
- **Visual Weather Icons**: Intuitive emoji-based weather representation
- **Country Flags**: Shows country flag next to location name
- **Responsive Design**: Works well on all device sizes
- **Loading States**: Shows loading indicator during API requests

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Youssefhikal93/Reach-weather
   ```

   Navigate to the project directory:

```bash
cd weather-react-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

🌐 API Used

### This app uses the following free APIs:

### Open-Meteo - For weather forecast data

### Geocoding API - For location coordinates

### FlagCDN - For country flags

## 🛠️ Technologies

React (with Hooks: useState, useEffect)

CSS for styling

Fetch API for data retrieval

AbortController for clean API request cancellation

## 📝 Code Structure

App.js: Main component with state management and API calls

Weather display components:

Main: Handles user input and loading state

Weather: Displays location and forecast

Day: Renders individual day's weather data

Helper functions:

getWeatherIcon: Maps WMO codes to emoji icons

convertToFlag: Displays country flag

formatDay: Formats date to weekday
