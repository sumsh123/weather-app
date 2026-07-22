const $ = (selector) => document.querySelector(selector);

const ui = {
  landing: $("#landing"),
  weather: $("#weather"),
  details: $("#details"),
  scene: $("#scene"),

  sceneParticles: $("#sceneParticles"),
  landingParticles: $("#landingParticles"),

  loader: $("#loader"),
  loaderText: $("#loaderText"),

  toast: $("#toast"),
  toastText: $("#toastText"),

  forecast: $("#forecast"),

  audio: $("#weatherAudio"),
  soundButton: $("#soundButton")
};

let weatherData = null;
let unit = "metric";

let soundOn = false;
let currentSound = "";

function conditionName(value) {
  return String(value || "clouds").toLowerCase();
}

function addParticles(container, type, amount) {
  container.innerHTML = "";

  for (let i = 0; i < amount; i += 1) {
    const item = document.createElement("span");

    item.className =
      type === "snow"
        ? "snow-dot"
        : "rain-drop";

    item.style.left =
      `${(i * 37) % 100}%`;

    item.style.animationDelay =
      `${-(i % 10) * 0.2}s`;

    item.style.animationDuration =
      type === "snow"
        ? `${4 + (i % 5)}s`
        : `${1.3 + (i % 6) * 0.15}s`;

    container.appendChild(item);
  }
}

function showLoader(message) {
  ui.loaderText.textContent = message;
  ui.loader.classList.add("visible");
}

function hideLoader() {
  ui.loader.classList.remove("visible");
}

function showError(message) {
  ui.toastText.textContent = message;
  ui.toast.classList.add("visible");
}

function localDate(unix, offset) {
  return new Date(
    (unix + offset) * 1000
  );
}

function formatTime(unix, offset) {
  return localDate(
    unix,
    offset
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC"
  });
}

function convertTemp(value) {
  if (unit === "metric") {
    return Math.round(value);
  }

  return Math.round(
    (value * 9) / 5 + 32
  );
}

function convertWind(value) {
  if (unit === "metric") {
    return `${(value * 3.6).toFixed(1)} km/h`;
  }

  return `${(value * 2.237).toFixed(1)} mph`;
}

/* Select the correct sound */

function chooseSound(condition, temperature) {
  if (
    condition === "rain" ||
    condition === "drizzle" ||
    condition === "thunderstorm"
  ) {
    return "assets/sounds/rain.mp3";
  }

  if (condition === "snow") {
    return "assets/sounds/snow.mp3";
  }

  if (
    condition === "mist" ||
    condition === "fog" ||
    condition === "haze" ||
    temperature <= 10
  ) {
    return "assets/sounds/cold.mp3";
  }

  // Clear and cloudy weather both use sunny ambience.
  return "assets/sounds/sunny.mp3";
}

function updateSound(condition, temperature) {
  const newSound = chooseSound(condition, temperature);

  if (newSound !== currentSound) {
    currentSound = newSound;

    ui.audio.pause();
    ui.audio.src = newSound;
    ui.audio.load();
    ui.audio.volume = 0.3;
  }

  if (!soundOn) {
    return;
  }

  ui.audio.play().catch((error) => {
    console.error("Audio error:", error);

    soundOn = false;
    ui.soundButton.textContent = "🔇";

    showError(
      "The browser blocked the sound. Click the sound button again."
    );
  });
}

/* Display weather */

function render() {
  const current = weatherData.current;

  const condition =
    conditionName(
      current.weather[0].main
    );

  const tempUnit =
    unit === "metric"
      ? "°C"
      : "°F";

  const isDay =
    current.dt >= current.sys.sunrise &&
    current.dt < current.sys.sunset;

  const visibility =
    `${(current.visibility / 1000).toFixed(1)} km`;

  const pressure =
    `${current.main.pressure} hPa`;

  const currentTime =
    formatTime(
      current.dt,
      current.timezone
    );

  $("#cityName").textContent =
    current.name;

  $("#countryCode").textContent =
    current.sys.country || "";

  $("#detailsCity").textContent =
    current.name;

  $("#temperature").textContent =
    convertTemp(current.main.temp);

  $("#temperatureUnit").textContent =
    tempUnit;

  $("#description").textContent =
    current.weather[0].description;

  $("#dateText").textContent =
    localDate(
      current.dt,
      current.timezone
    ).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    });

  $("#feelsLike").textContent =
    `${convertTemp(current.main.feels_like)}${tempUnit}`;

  $("#humidity").textContent =
    `${current.main.humidity}%`;

  $("#wind").textContent =
    convertWind(current.wind.speed);

  $("#pressureMain").textContent =
    pressure;

  $("#visibilityMain").textContent =
    visibility;

  $("#pressure").textContent =
    pressure;

  $("#visibility").textContent =
    visibility;

  $("#sunrise").textContent =
    formatTime(
      current.sys.sunrise,
      current.timezone
    );

  $("#sunset").textContent =
    formatTime(
      current.sys.sunset,
      current.timezone
    );

  $("#localTime").textContent =
    currentTime;

  $("#updatedTime").textContent =
    currentTime;

  $("#unitText").textContent =
    unit === "metric"
      ? "°F"
      : "°C";

  ui.scene.dataset.weather =
    condition;

  ui.scene.dataset.time =
    isDay
      ? "day"
      : "night";

  renderParticles(condition);

  updateSound(
    condition,
    current.main.temp
  );

  renderForecast();
}

function renderParticles(condition) {
  if (
    condition === "rain" ||
    condition === "drizzle" ||
    condition === "thunderstorm"
  ) {
    addParticles(
      ui.sceneParticles,
      "rain",
      30
    );

    return;
  }

  if (condition === "snow") {
    addParticles(
      ui.sceneParticles,
      "snow",
      24
    );

    return;
  }

  ui.sceneParticles.innerHTML = "";
}

function renderForecast() {
  const current = weatherData.current;

  const tempUnit =
    unit === "metric"
      ? "°C"
      : "°F";

  ui.forecast.innerHTML = "";

  weatherData.forecast.list
    .slice(0, 4)
    .forEach((item, index) => {
      const card =
        document.createElement("article");

      const forecastTime =
        index === 0
          ? "Next"
          : formatTime(
              item.dt,
              current.timezone
            );

      const rainChance =
        Math.round(
          (item.pop || 0) * 100
        );

      card.innerHTML = `
        <span>${forecastTime}</span>

        <strong>
          ${convertTemp(item.main.temp)}${tempUnit}
        </strong>

        <small>
          ${item.weather[0].description}
        </small>

        <small>
          ${rainChance}% rain
        </small>
      `;

      ui.forecast.appendChild(card);
    });
}

/* API request */

async function fetchWeather(query) {
  const key =
    window.APP_CONFIG.apiKey;

  if (
    !key ||
    key.includes("PASTE_YOUR")
  ) {
    throw new Error(
      "Paste your OpenWeather API key in config.js."
    );
  }

  const base =
    "https://api.openweathermap.org/data/2.5";

  const currentUrl =
    `${base}/weather?${query}&appid=${key}&units=metric`;

  const forecastUrl =
    `${base}/forecast?${query}&appid=${key}&units=metric`;

  const responses =
    await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

  const currentResponse =
    responses[0];

  const forecastResponse =
    responses[1];

  if (
    !currentResponse.ok ||
    !forecastResponse.ok
  ) {
    if (currentResponse.status === 404) {
      throw new Error(
        "City not found. Check the spelling."
      );
    }

    if (currentResponse.status === 401) {
      throw new Error(
        "Your API key is incorrect or not active yet."
      );
    }

    throw new Error(
      "Weather could not be loaded."
    );
  }

  return {
    current:
      await currentResponse.json(),

    forecast:
      await forecastResponse.json()
  };
}

async function loadWeather(query, label) {
  showLoader(
    `Checking ${label}...`
  );

  try {
    weatherData =
      await fetchWeather(query);

    render();

    ui.weather.classList.add(
      "visible"
    );

    ui.weather.setAttribute(
      "aria-hidden",
      "false"
    );

    ui.landing.classList.add(
      "open"
    );

    setTimeout(() => {
      ui.landing.classList.add(
        "hidden"
      );
    }, 900);

  } catch (error) {
    showError(error.message);

  } finally {
    hideLoader();
  }
}

/* City search */

$("#cityForm").addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const city =
      $("#cityInput").value.trim();

    loadWeather(
      `q=${encodeURIComponent(city)}`,
      city
    );
  }
);

/* Current location */

$("#locationButton").addEventListener(
  "click",
  () => {
    if (!navigator.geolocation) {
      showError(
        "Location is not supported by this browser."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        loadWeather(
          `lat=${coords.latitude}&lon=${coords.longitude}`,
          "your location"
        );
      },

      () => {
        showError(
          "Location permission was denied."
        );
      }
    );
  }
);

/* Change city */

$("#changeCityButton").addEventListener(
  "click",
  () => {
    ui.audio.pause();

    ui.details.classList.remove(
      "visible"
    );

    ui.landing.classList.remove(
      "hidden"
    );

    setTimeout(() => {
      ui.landing.classList.remove(
        "open"
      );

      ui.weather.classList.remove(
        "visible"
      );

      $("#cityInput").focus();
    }, 20);
  }
);

/* Details popup */

$("#detailsButton").addEventListener(
  "click",
  () => {
    ui.details.classList.add(
      "visible"
    );

    ui.details.setAttribute(
      "aria-hidden",
      "false"
    );
  }
);

$("#closeDetailsButton").addEventListener(
  "click",
  () => {
    ui.details.classList.remove(
      "visible"
    );

    ui.details.setAttribute(
      "aria-hidden",
      "true"
    );
  }
);

/* Temperature unit */

$("#unitButton").addEventListener(
  "click",
  () => {
    unit =
      unit === "metric"
        ? "imperial"
        : "metric";

    render();
  }
);

/* Sound button */

ui.soundButton.addEventListener(
  "click",
  () => {
    soundOn = !soundOn;

    ui.soundButton.textContent =
      soundOn
        ? "🔊"
        : "🔇";

    ui.soundButton.title =
      soundOn
        ? "Turn weather sound off"
        : "Turn weather sound on";

    if (!weatherData) {
      return;
    }

    const current =
      weatherData.current;

    const condition =
      conditionName(
        current.weather[0].main
      );

    updateSound(
      condition,
      current.main.temp
    );
  }
);

/* Error close button */

$("#closeToastButton").addEventListener(
  "click",
  () => {
    ui.toast.classList.remove(
      "visible"
    );
  }
);

/* Close details by clicking outside */

ui.details.addEventListener(
  "click",
  (event) => {
    if (event.target === ui.details) {
      ui.details.classList.remove(
        "visible"
      );
    }
  }
);

/* Landing rain */

addParticles(
  ui.landingParticles,
  "rain",
  28
);