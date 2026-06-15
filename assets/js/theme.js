(function () {
  function getTheme() {
    var stored = localStorage.getItem("parkpass_theme");
    if (stored === "light" || stored === "dark") return stored;
    return "dark";
  }

  var theme = getTheme();
  document.documentElement.setAttribute("data-theme", theme);

  window.__theme = theme;
  window.__setTheme = function (t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("parkpass_theme", t);
    window.__theme = t;

    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.textContent = t === "dark" ? "[DARK]" : "[LIGHT]";
    }
  };

  window.__toggleTheme = function () {
    window.__setTheme(window.__theme === "dark" ? "light" : "dark");
  };
})();
