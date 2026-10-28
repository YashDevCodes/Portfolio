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
