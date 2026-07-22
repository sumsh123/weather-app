# Weather Window

Weather Window is a weather web app that shows live weather data for any city.

It does more than display the current temperature. It also shows upcoming forecast information, rain probability, humidity, wind speed, pressure, visibility, sunrise, sunset, and the selected city’s local time.

The design changes according to the weather and local time. Cities appear brighter during the day and darker at night. Rain and snow also have their own animations and ambient sounds.

## Features

- Search weather by city name
- Use the device’s current location
- View current temperature and weather condition
- Check the forecast for the next few hours
- View the chance of rain
- See humidity, wind speed, pressure, and visibility
- View sunrise and sunset times
- Display the selected city’s local date and time
- Switch between Celsius and Fahrenheit
- Automatic day and night themes
- Rain and snow animations
- Weather-based ambient sounds
- Curtain-opening landing animation
- Responsive design

## Weather Sounds

The app selects an ambient sound based on the current weather:

- Rain, drizzle, or thunderstorm: `rain.mp3`
- Clear or normal cloudy weather: `sunny.mp3`
- Snow: `snow.mp3`
- Cold, foggy, misty, or hazy weather: `cold.mp3`

Sound starts muted because browsers usually block automatic audio. Click the sound button in the top bar to enable it.

## Technologies Used

- HTML
- CSS
- JavaScript
- OpenWeather API
- Browser Geolocation API
- HTML Audio API

## Project Structure

```text
weather-window/
│
├── assets/
│   └── sounds/
│       ├── rain.mp3
│       ├── sunny.mp3
│       ├── cold.mp3
│       └── snow.mp3
│
├── index.html
├── style.css
├── script.js
├── config.js
└── README.md
```

## Setup Instructions

### 1. Download the Project

Download or clone the project folder.

### 2. Get an OpenWeather API Key

Create an account on OpenWeather and generate an API key.

### 3. Add the API Key

Open `config.js` and add your API key:

```javascript
window.APP_CONFIG = {
  apiKey: "YOUR_OPENWEATHER_API_KEY"
};
```

Replace `YOUR_OPENWEATHER_API_KEY` with your actual API key.

### 4. Add the Sound Files

Place the sound files inside:

```text
assets/sounds/
```

The file names must be exactly:

```text
rain.mp3
sunny.mp3
cold.mp3
snow.mp3
```

File names may be case-sensitive when the project is hosted online.

### 5. Run the Project

The recommended method is to use the Live Server extension in VS Code.

1. Open the project folder in VS Code.
2. Open `index.html`.
3. Right-click inside the file.
4. Select **Open with Live Server**.

You can also run a local Python server:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

A local server is recommended because browser location services may not work when `index.html` is opened directly.

## How It Works

When the user searches for a city, JavaScript sends requests to the OpenWeather API.

The app retrieves:

- Current weather information
- Current temperature
- Weather condition
- Wind speed
- Humidity
- Pressure
- Visibility
- Sunrise and sunset times
- Upcoming forecast data
- Rain probability
- City timezone information

JavaScript then updates the page and selects the correct theme, animation, and sound.

For example, a city in daytime appears brighter, while a city where it is currently night appears darker.

## Important Notes

- An internet connection is required.
- The OpenWeather API key may take some time to activate.
- The browser may ask for location permission.
- Audio does not start automatically. Click the sound button first.
- Avoid uploading your real API key to a public GitHub repository.

## Future Improvements

- Longer daily forecast
- Weather alerts
- Favorite cities
- Search history
- Air quality information
- Lightning animations
- More weather sounds
