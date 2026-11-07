console.log("JavaScript connected");
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const currentYear = document.getElementById("currentYear");

// Set the footer year automatically.
currentYear.textContent = new Date().getFullYear();

// Apply the saved theme, if available.
let savedTheme = null;

try {
  savedTheme = localStorage.getItem("yash-portfolio-theme");
} catch (error) {
  // The site still works if browser storage is unavailable.
}

if (savedTheme === "light" || savedTheme === "dark") {
  body.dataset.theme = savedTheme;
}

function updateThemeButton() {
  const isLight = body.dataset.theme === "light";

  themeToggle.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode"
  );
}

updateThemeButton();

// Toggle between dark and light themes.
themeToggle.addEventListener("click", () => {
  const nextTheme =
    body.dataset.theme === "light" ? "dark" : "light";

  body.dataset.theme = nextTheme;
  updateThemeButton();

  try {
    localStorage.setItem("yash-portfolio-theme", nextTheme);
  } catch (error) {
    // Theme switching still works until the page is refreshed.
  }
});

// Open and close the mobile navigation.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile navigation after selecting a section.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

const cityInput = document.getElementById("cityInput");
const weatherButton = document.getElementById("weatherButton");
const weatherResult = document.getElementById("weatherResult");

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        weatherResult.textContent = "Please enter a city name.";
        return;
    }

    weatherResult.textContent = "Loading weather...";
    weatherButton.disabled = true;

    try {
        const weatherApiKey = "81a0f468d46c130f7257be6c3d14dabc";

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weatherApiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to fetch weather."
            );
        }

        weatherResult.textContent =
            `${data.name}: ${data.main.temp}°C, ` +
            `${data.weather[0].description}. ` +
            `Humidity: ${data.main.humidity}%.`;

    } catch (error) {
        weatherResult.textContent = error.message;
        console.error("Weather error:", error);

    } finally {
        weatherButton.disabled = false;
    }
}

weatherButton.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});
