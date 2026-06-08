(function() {
  const savedTheme = localStorage.getItem("theme") || "auto";
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      if (systemPrefersDark.matches) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    }
  }
  
  applyTheme(savedTheme);
  window.__applyTheme = applyTheme;

  // Listen to OS theme changes if theme is auto
  systemPrefersDark.addEventListener("change", () => {
    if ((localStorage.getItem("theme") || "auto") === "auto") {
      applyTheme("auto");
      const toggleBtn = document.getElementById("theme-toggle");
      if (toggleBtn) {
        updateToggleButton(toggleBtn, "auto");
      }
    }
  });

  const iconPaths = {
    light: `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`,
    dark: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`,
    auto: `<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>`
  };

  function updateToggleButton(btn, theme) {
    const iconSvg = btn.querySelector(".theme-icon");
    if (iconSvg) {
      iconSvg.innerHTML = iconPaths[theme];
    }
    btn.setAttribute("data-theme-state", theme);
    let label = "Modo: ";
    if (theme === "light") label += "Claro";
    else if (theme === "dark") label += "Oscuro";
    else label += "Automático";
    btn.setAttribute("title", `Cambiar tema (Actual: ${label})`);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // 1. Detect language and setup links
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;

    let currentLang = "es";
    if (currentPath.includes("/en/")) currentLang = "en";
    else if (currentPath.includes("/fr/")) currentLang = "fr";
    else if (currentPath.includes("/pt/")) currentLang = "pt";

    function getLangLink(targetLang) {
      const segments = currentPath.split("/");
      let filename = segments[segments.length - 1];
      if (!filename || filename === "") {
        filename = "index.html";
      }

      let prefix = "";
      if (currentLang !== "es") {
        prefix = "../";
      }

      let newPath = "";
      if (targetLang === "es") {
        newPath = prefix + filename;
      } else {
        newPath = prefix + targetLang + "/" + filename;
      }

      return newPath + currentSearch + currentHash;
    }

    // 2. Inject controls bar into footer container
    const bar = document.createElement("div");
    bar.id = "bottom-controls-bar";
    bar.className = "bottom-controls-bar";
    
    bar.innerHTML = `
      <div class="lang-selector">
        <a href="${getLangLink('es')}" class="lang-link ${currentLang === 'es' ? 'active' : ''}" data-lang="es" title="Español">🇪🇸 <span class="lang-text">ES</span></a>
        <a href="${getLangLink('en')}" class="lang-link ${currentLang === 'en' ? 'active' : ''}" data-lang="en" title="English">🇬🇧 <span class="lang-text">EN</span></a>
        <a href="${getLangLink('fr')}" class="lang-link ${currentLang === 'fr' ? 'active' : ''}" data-lang="fr" title="Français">🇫🇷 <span class="lang-text">FR</span></a>
        <a href="${getLangLink('pt')}" class="lang-link ${currentLang === 'pt' ? 'active' : ''}" data-lang="pt" title="Português">🇵🇹 <span class="lang-text">PT</span></a>
      </div>
      <div class="controls-divider"></div>
      <button id="theme-toggle" class="theme-toggle-btn" aria-label="Cambiar tema">
        <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; display: block;"></svg>
      </button>
    `;

    const headerContainer = document.querySelector(".main-header .header-container") || document.querySelector(".header-container") || document.querySelector(".main-nav") || document.querySelector("header");
    if (headerContainer) {
      headerContainer.appendChild(bar);
    } else {
      // Fallback if no header-container exists on the page
      bar.style.position = "fixed";
      bar.style.bottom = "20px";
      bar.style.right = "20px";
      document.body.appendChild(bar);
    }

    // 3. Setup Theme Button logic
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      const activeTheme = localStorage.getItem("theme") || "auto";
      updateToggleButton(toggleBtn, activeTheme);
      
      toggleBtn.addEventListener("click", () => {
        const currentState = toggleBtn.getAttribute("data-theme-state") || "auto";
        let nextState = "light";
        if (currentState === "light") nextState = "dark";
        else if (currentState === "dark") nextState = "auto";
        
        localStorage.setItem("theme", nextState);
        applyTheme(nextState);
        updateToggleButton(toggleBtn, nextState);
      });
    }
  });
})();
