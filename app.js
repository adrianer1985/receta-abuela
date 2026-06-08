// Recipe dataset for www.recetadeabuela.com
const recipes = window.recipes || [];

// App State
const currentLang = window.location.pathname.includes("/en/") ? "en" :
                    window.location.pathname.includes("/fr/") ? "fr" :
                    window.location.pathname.includes("/pt/") ? "pt" : "es";

const UI_STRINGS = {
  es: {
    allSubcategories: "Todas las Subcategorías",
    agua: "Agua",
    calefaccion: "Calefacción",
    limpieza: "Limpieza",
    higiene: "Higiene",
    remedios: "Remedios",
    alimentos: "Alimentos",
    todas: "Todas",
    emptyTitle: "No se encontraron recetas",
    emptyText: "Prueba a buscar con otros términos o cambia el filtro de categoría.",
    saving: "Ahorro",
    health: "Salud",
    ecosystem: "Ecosistema",
    bodyBenefit: "Beneficio Corporal",
    keyIngredients: "Ingredientes Clave",
    viewGuide: "Ver guía completa",
    views: "visualizaciones"
  },
  en: {
    allSubcategories: "All Subcategories",
    agua: "Water",
    calefaccion: "Heating",
    limpieza: "Cleaning",
    higiene: "Hygiene",
    remedios: "Remedies",
    alimentos: "Food",
    todas: "All",
    emptyTitle: "No recipes found",
    emptyText: "Try searching for other terms or change the category filter.",
    saving: "Savings",
    health: "Health",
    ecosystem: "Ecosystem",
    bodyBenefit: "Body Benefit",
    keyIngredients: "Key Ingredients",
    viewGuide: "View full guide",
    views: "views"
  },
  fr: {
    allSubcategories: "Toutes les sous-catégories",
    agua: "Eau",
    calefaccion: "Chauffage",
    limpieza: "Nettoyage",
    higiene: "Hygiène",
    remedios: "Remèdes",
    alimentos: "Aliments",
    todas: "Toutes",
    emptyTitle: "Aucune recette trouvée",
    emptyText: "Essayez de rechercher d'autres termes ou modifiez le filtre de catégorie.",
    saving: "Économie",
    health: "Santé",
    ecosystem: "Écosystème",
    bodyBenefit: "Bénéfice Corporel",
    keyIngredients: "Ingrédients Clés",
    viewGuide: "Voir le guide complet",
    views: "vues"
  },
  pt: {
    allSubcategories: "Todas as subcategorias",
    agua: "Água",
    calefaccion: "Aquecimento",
    limpieza: "Limpeza",
    higiene: "Higiene",
    remedios: "Remédios",
    alimentos: "Alimentos",
    todas: "Todas",
    emptyTitle: "Nenhuma receita encontrada",
    emptyText: "Tente pesquisar outros termos ou altere o filtro de categoria.",
    saving: "Economia",
    health: "Saúde",
    ecosystem: "Ecossistema",
    bodyBenefit: "Benefício Corporal",
    keyIngredients: "Ingredientes Chave",
    viewGuide: "Ver guia completo",
    views: "visualizações"
  }
};

let activeCategory = "all";
let activeSubcategory = "all";
let activeSort = "default";
let searchQuery = "";

// DOM Elements
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".btn-filter");

// Helper to format views
function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1).replace(".", ",") + "M";
  } else if (views >= 1000) {
    const val = views / 1000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(".", ",")) + "K";
  }
  return views.toString();
}

// Subcategory definitions mapping
const subcategoryDefinitions = {
  all: [
    { id: "all", label: UI_STRINGS[currentLang].allSubcategories },
    { id: "agua", label: UI_STRINGS[currentLang].agua },
    { id: "calefaccion", label: UI_STRINGS[currentLang].calefaccion },
    { id: "limpieza", label: UI_STRINGS[currentLang].limpieza },
    { id: "higiene", label: UI_STRINGS[currentLang].higiene },
    { id: "remedios", label: UI_STRINGS[currentLang].remedios },
    { id: "alimentos", label: UI_STRINGS[currentLang].alimentos }
  ],
  hogar: [
    { id: "all", label: UI_STRINGS[currentLang].todas },
    { id: "limpieza", label: UI_STRINGS[currentLang].limpieza },
    { id: "alimentos", label: UI_STRINGS[currentLang].alimentos }
  ],
  cuerpo: [
    { id: "all", label: UI_STRINGS[currentLang].todas },
    { id: "higiene", label: UI_STRINGS[currentLang].higiene },
    { id: "remedios", label: UI_STRINGS[currentLang].remedios }
  ],
  tecnologia: [
    { id: "all", label: UI_STRINGS[currentLang].todas },
    { id: "agua", label: UI_STRINGS[currentLang].agua },
    { id: "calefaccion", label: UI_STRINGS[currentLang].calefaccion },
    { id: "alimentos", label: UI_STRINGS[currentLang].alimentos }
  ]
};

// Update URL search parameters based on state
function updateURLParams() {
  try {
    const url = new URL(window.location);
    if (activeCategory === "all") {
      url.searchParams.delete("cat");
    } else {
      url.searchParams.set("cat", activeCategory);
    }
    
    if (activeSubcategory === "all") {
      url.searchParams.delete("subcat");
    } else {
      url.searchParams.set("subcat", activeSubcategory);
    }
    
    window.history.pushState(null, "", url.pathname + url.search);
  } catch (e) {
    console.warn("Could not update URL parameters:", e);
  }
}

// Render subcategory chips
function renderSubcategories() {
  const subFilters = document.getElementById("subcategory-filters");
  if (!subFilters) return;

  const chips = subcategoryDefinitions[activeCategory] || subcategoryDefinitions.all;
  
  subFilters.innerHTML = "";
  chips.forEach(chip => {
    const btn = document.createElement("button");
    btn.className = `btn-subchip ${activeSubcategory === chip.id ? "active" : ""}`;
    btn.setAttribute("data-sub", chip.id);
    btn.textContent = chip.label;
    
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-subchip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      activeSubcategory = chip.id;
      updateURLParams();
      renderGrid(recipes);
    });
    
    subFilters.appendChild(btn);
  });
}

// Init App
document.addEventListener("DOMContentLoaded", () => {
  const recipesGrid = document.getElementById("recipes-grid");
  const articleDetailContainer = document.getElementById("article-detail-container");

  // Read category parameter from URL if on index.html
  if (recipesGrid) {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat) {
      activeCategory = cat;
      const navLinks = document.querySelectorAll(".nav-links a");
      navLinks.forEach(l => l.classList.remove("active"));
      const activeLink = document.getElementById(`nav-${cat}`);
      if (activeLink) activeLink.classList.add("active");
    }
    
    const subcat = params.get("subcat");
    if (subcat) {
      activeSubcategory = subcat;
    }

    const searchParam = params.get("search");
    if (searchParam) {
      searchQuery = searchParam;
      const searchInput = document.getElementById("search-input");
      if (searchInput) searchInput.value = searchParam;
    }

    renderGrid(recipes);
    renderSubcategories();
    setupListeners();
  } else if (articleDetailContainer) {
    renderArticleDetail();
  }

  // Configuración del servidor de suscripciones (Google Sheets)
  // Reemplaza esta cadena con la URL Web App que te dará Google Apps Script
  const NEWSLETTER_API_URL = "https://script.google.com/macros/s/AKfycbydcUv6kqW9z3Bbspne7BVScGjBhhdHdevQbb_4mG_zh94n_4oQoSN76y7PR_n9-VxW/exec";

  // Newsletter Forms handler (both Hero and Footer)
  function setupNewsletterForm(formId, emailId, successId) {
    const form = document.getElementById(formId);
    const successMsg = document.getElementById(successId);
    if (form && successMsg) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById(emailId).value.trim();
        if (email) {
          // 1. Guardar en LocalStorage (mantenido como respaldo local)
          let list = [];
          try {
            const stored = localStorage.getItem("newsletter_subscribers");
            list = stored ? JSON.parse(stored) : [];
            if (!Array.isArray(list)) {
              list = [];
            }
          } catch (localStorageErr) {
            console.warn("Invalid localStorage data, resetting:", localStorageErr);
            list = [];
          }

          if (!list.some(sub => (typeof sub === "string" ? sub : sub.email) === email)) {
            list.push({
              email: email,
              date: new Date().toLocaleDateString("es-ES")
            });
            localStorage.setItem("newsletter_subscribers", JSON.stringify(list));
          }
          
          // 2. Enviar a Google Sheets si la URL está configurada
          if (NEWSLETTER_API_URL && NEWSLETTER_API_URL !== "SU_URL_DE_GOOGLE_APPS_SCRIPT") {
            try {
              fetch(NEWSLETTER_API_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                  "Content-Type": "text/plain"
                },
                body: JSON.stringify({
                  email: email,
                  date: new Date().toLocaleDateString("es-ES")
                })
              }).catch(err => console.error("Error submitting newsletter to Google Sheets:", err));
            } catch (fetchErr) {
              console.error("Fetch failed synchronously:", fetchErr);
            }
          }
          
          form.style.display = "none";
          successMsg.style.display = "block";
        }
      });
    }
  }

  setupNewsletterForm("newsletter-form", "newsletter-email", "newsletter-success");
  setupNewsletterForm("hero-newsletter-form", "hero-newsletter-email", "hero-newsletter-success");
});

// Render cards grid on index.html
function renderGrid(recipesData) {
  const recipesGrid = document.getElementById("recipes-grid");
  if (!recipesGrid) return;
  
  recipesGrid.innerHTML = "";
  
  // Apply search & category & subcategory filters
  let filteredRecipes = recipesData.filter(recipe => {
    const matchesCategory = activeCategory === "all" || recipe.category === activeCategory;
    const matchesSubcategory = activeSubcategory === "all" || recipe.subcategory === activeSubcategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          recipe.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.intro.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Apply sorting
  if (activeSort === "default") {
    filteredRecipes.sort((a, b) => b.views - a.views);
  } else if (activeSort === "economia") {
    filteredRecipes.sort((a, b) => b.metrics.economy - a.metrics.economy);
  } else if (activeSort === "salud") {
    filteredRecipes.sort((a, b) => b.metrics.health - a.metrics.health);
  } else if (activeSort === "ecosistema") {
    filteredRecipes.sort((a, b) => b.metrics.ecosystem - a.metrics.ecosystem);
  }

  // Handle empty state
  if (filteredRecipes.length === 0) {
    recipesGrid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h3>${UI_STRINGS[currentLang].emptyTitle}</h3>
        <p>${UI_STRINGS[currentLang].emptyText}</p>
      </div>
    `;
    return;
  }

  // Insert cards
  filteredRecipes.forEach(recipe => {
    const card = document.createElement("a");
    card.href = `${recipe.id}.html`;
    card.target = "_blank";
    card.className = "recipe-card";
    card.setAttribute("aria-label", recipe.title);
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${recipe.image}" alt="${recipe.title} - ${recipe.summary}" class="card-img" loading="lazy">
        <span class="card-tag">${recipe.tag}</span>
        <span class="card-views-badge">
          <svg class="card-views-icon" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          ${formatViews(recipe.views / 10)}
        </span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${recipe.title}</h3>
        <p class="card-summary">${recipe.summary}</p>
        <div class="card-metrics">
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot eco"></span>${UI_STRINGS[currentLang].saving}</span>
            <div class="metric-track"><div class="metric-fill eco" style="width: ${recipe.metrics.economy}%"></div></div>
            <span class="metric-val">${recipe.metrics.economy}%</span>
          </div>
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot health"></span>${UI_STRINGS[currentLang].health}</span>
            <div class="metric-track"><div class="metric-fill health" style="width: ${recipe.metrics.health}%"></div></div>
            <span class="metric-val">${recipe.metrics.health}%</span>
          </div>
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot ecosys"></span>${UI_STRINGS[currentLang].ecosystem}</span>
            <div class="metric-track"><div class="metric-fill ecosys" style="width: ${recipe.metrics.ecosystem}%"></div></div>
            <span class="metric-val">${recipe.metrics.ecosystem}%</span>
          </div>
        </div>
      </div>
      
      <!-- Hover Preview Panel (Whole Card Overlay) -->
      <div class="card-hover-preview">
        <p class="hover-preview-recipe-title" aria-hidden="true">${recipe.title}</p>
        <span class="hover-preview-title">${UI_STRINGS[currentLang].bodyBenefit}</span>
        <p class="hover-preview-text">${recipe.healthBenefit.split('.')[0] + '.'}</p>
        <span class="hover-preview-title">${UI_STRINGS[currentLang].keyIngredients}</span>
        <ul class="hover-ingredients-list">
          ${recipe.shoppingList.slice(0, 3).map(item => `
            <li class="hover-ingredient-item">
              <span class="hover-ingredient-bullet">✦</span>
              <span>${item.name.split(' (')[0]}</span>
            </li>
          `).join("")}
        </ul>
        <span class="hover-cta-text">
          ${UI_STRINGS[currentLang].viewGuide}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </span>
      </div>
    `;
    recipesGrid.appendChild(card);
  });
}

// Render dynamic article page layout on articulo.html
function renderArticleDetail() {
  const container = document.getElementById("article-detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const articleId = window.currentRecipeId || params.get("id");
  const recipe = recipes.find(r => r.id === articleId);

  if (!recipe) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>${currentLang === 'es' ? 'Artículo no encontrado' : currentLang === 'en' ? 'Article not found' : currentLang === 'fr' ? 'Article non trouvé' : 'Artigo não encontrado'}</h3>
        <p>${currentLang === 'es' ? 'Lo sentimos, el artículo o la receta que estás buscando no existe o ha sido trasladada.' : currentLang === 'en' ? 'Sorry, the article or recipe you are looking for does not exist or has been moved.' : currentLang === 'fr' ? 'Désolé, l\'article ou la recette que vous recherchez n\'existe pas ou a été déplacé.' : 'Desculpe, o artigo ou receita que procura não existe ou foi movido.'}</p>
        <div style="margin-top: 1.5rem;">
          <a href="index.html" class="btn-primary-action">${currentLang === 'es' ? 'Volver al inicio' : currentLang === 'en' ? 'Back to home' : currentLang === 'fr' ? 'Retour à l\'accueil' : 'Voltar ao início'}</a>
        </div>
      </div>
    `;
    document.title = (currentLang === 'es' ? 'Artículo no encontrado' : currentLang === 'en' ? 'Article not found' : currentLang === 'fr' ? 'Article non trouvé' : 'Artigo não encontrado') + " | Receta de Abuela";
    return;
  }

  // Update Page Title
  document.title = `${recipe.title} | Receta de Abuela`;

  // Render detail template if not pre-rendered (hydration fallback)
  if (container.querySelector(".loading-state")) {
    container.innerHTML = `
    <!-- Top banner image -->
    <div style="position: relative; width: 100%;">
      <img src="${recipe.image}" alt="${recipe.title} - ${recipe.summary}" class="modal-hero-img" style="border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;">
      <span class="card-views-badge" style="top: 1.5rem; right: 1.5rem;">
        <svg class="card-views-icon" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
        ${formatViews(recipe.views / 10)} ${UI_STRINGS[currentLang].views}
      </span>
    </div>
    
    <!-- Header title and summary -->
    <div class="modal-header-info">
      <span class="modal-category">${recipe.tag}</span>
      <h1 class="modal-title" style="margin-top: 0.2rem; font-size: 2.2rem;">${recipe.title}</h1>
      <p class="modal-intro">${recipe.intro}</p>
      
      <!-- Share Buttons -->
      <div class="share-container">
        <span class="share-label">Compartir:</span>
        <div class="share-buttons">
          <a href="#" class="btn-share wa" id="share-wa" aria-label="Compartir en WhatsApp">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.787-1.451L0 24zm6.59-4.846c1.657.982 3.111 1.485 4.905 1.486 5.479 0 9.936-4.448 9.938-9.917.001-2.651-1.02-5.14-2.875-7.001C16.8 1.862 14.305 1.83 12.01 1.83c-5.485 0-9.94 4.45-9.943 9.919-.001 1.945.514 3.447 1.516 4.975l-.974 3.551 3.65-.957l.398.228z"/></svg>
            <span>WhatsApp</span>
          </a>
          <a href="#" class="btn-share pin" id="share-pin" aria-label="Compartir en Pinterest">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.16-.1-.95-.2-2.4.04-3.4l1.43-6.07s-.37-.73-.37-1.8c0-1.7 1-2.97 2.2-2.97 1.05 0 1.56.8 1.56 1.74 0 1.06-.67 2.63-1.02 4.1-.3 1.25.62 2.28 1.85 2.28 2.22 0 3.93-2.34 3.93-5.7 0-3-2.13-5.1-5.23-5.1-3.56 0-5.66 2.67-5.66 5.43 0 1.08.42 2.24.94 2.87.1.13.12.24.08.38l-.35 1.44c-.06.24-.2.32-.45.2-1.63-.76-2.65-3.14-2.65-5.05 0-4.1 3-7.87 8.6-7.87 4.5 0 8 3.2 8 7.5 0 4.48-2.82 8.1-6.75 8.1-1.32 0-2.56-.68-2.98-1.5l-.8 3.12c-.3 1.12-1 2.53-1.5 3.32C9.88 23.83 10.93 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>
            <span>Pinterest</span>
          </a>
          <a href="#" class="btn-share fb" id="share-fb" aria-label="Compartir en Facebook">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Facebook</span>
          </a>
          <a href="https://www.instagram.com/recetadabuela" target="_blank" rel="noopener" class="btn-share ig" id="share-ig" aria-label="Seguir en Instagram">
            <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </div>
    
    <!-- Health Highlight -->
    <div class="body-health-highlight">
      <div class="health-highlight-header">
        <svg class="health-highlight-icon" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <h2 class="health-highlight-title">Beneficios para tu Cuerpo y Salud</h2>
      </div>
      <p class="health-highlight-text">${recipe.healthBenefit}</p>
    </div>
    
    <!-- Meta stats boxes -->
    <div class="modal-meta-grid">
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <div class="meta-details">
          <span class="meta-label">Elaboración</span>
          <span class="meta-value">${recipe.time}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <div class="meta-details">
          <span class="meta-label">Coste total</span>
          <span class="meta-value">${recipe.cost}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        <div class="meta-details">
          <span class="meta-label">Duración Materia</span>
          <span class="meta-value">${recipe.rawDuration}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <div class="meta-details">
          <span class="meta-label">Duración Producto</span>
          <span class="meta-value">${recipe.finalDuration}</span>
        </div>
      </div>
    </div>
    
    <!-- Split Layout: Ingredients on left, steps on right -->
    <div class="modal-body-layout">
      <!-- Ingredients column -->
      <section class="body-col-left">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Lista de la Compra y Costes
        </h3>
        <ul class="shopping-list">
          ${recipe.shoppingList.map(item => `
            <li class="shopping-item">
              <span class="item-name">${item.name}</span>
              <span class="item-price">${item.price}</span>
            </li>
          `).join("")}
        </ul>
      </section>
      
      <!-- Steps column -->
      <section class="body-col-right">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Proceso Paso a Paso
        </h3>
        <ol class="process-steps">
          ${recipe.steps.map((step, index) => `
            <li class="step-item">
              <span class="step-num">${index + 1}</span>
              <p class="step-text">${step}</p>
            </li>
          `).join("")}
        </ol>
      </section>
    </div>
    
    <!-- Full-width Bottom Sections -->
    <div class="modal-bottom-layout">
      <!-- Alternate Uses Section -->
      <section class="alt-uses-box">
        <h3 class="modal-section-title" style="border: none; margin: 0; padding: 0;">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Usos Alternativos del Producto
        </h3>
        <ul class="alt-uses-list">
          ${recipe.altUses.map(use => `
            <li class="alt-use-item">${use}</li>
          `).join("")}
        </ul>
      </section>
      
      <!-- Scientific / Extra Information -->
      <section class="extra-info-box">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Información de Interés Científico
        </h3>
        <p class="extra-text">${recipe.extraInfo}</p>
      </section>
      
      <!-- Detailed Impact Circles -->
      <section>
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          Evaluación Detallada de Impacto
        </h3>
        <div class="modal-impact-metrics">
          <div class="impact-metric-box">
            <div class="impact-metric-circle eco">${recipe.metrics.economy}%</div>
            <span class="impact-metric-name">Económico</span>
            <span class="impact-metric-desc">Porcentaje de reducción de gastos frente a marcas comerciales líderes.</span>
          </div>
          <div class="impact-metric-box">
            <div class="impact-metric-circle health">${recipe.metrics.health}%</div>
            <span class="impact-metric-name">Salud</span>
            <span class="impact-metric-desc">Puntuación hipoalergénica y ausencia de químicos disruptores hormonales.</span>
          </div>
          <div class="impact-metric-box">
            <div class="impact-metric-circle ecosys">${recipe.metrics.ecosystem}%</div>
            <span class="impact-metric-name">Ecosistema</span>
            <span class="impact-metric-desc">Tasa de biodegradabilidad y reducción de emisiones y microplásticos.</span>
          </div>
        </div>
      </section>
      
      <!-- Commercial Comparison Table -->
      <section>
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Tabla Comparativa Comercial (España)
        </h3>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Característica</th>
                <th>Opción Casera (Abuela)</th>
                <th>Equivalente Comercial (Supermercado)</th>
                <th>Evaluación / Ahorro</th>
              </tr>
            </thead>
            <tbody>
              ${recipe.comparisonTable.map((row, idx) => `
                <tr class="${idx === 0 ? 'highlight-row' : ''}">
                  <td>${row.concepto}</td>
                  <td>${row.casero}</td>
                  <td>${row.comercial}</td>
                  <td>
                    <span class="badge-comparison ${row.diferencia.includes('Ahorro') || row.diferencia.includes('Sin') || row.diferencia.includes('Ecológico') || row.diferencia.includes('duración') || row.diferencia.includes('limpia') || row.diferencia.includes('Saludable') || row.diferencia.includes('respiración') || row.diferencia.includes('Cero') ? 'positive' : 'negative'}">
                      ${row.diferencia}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
  }

  // Render similar recommended articles
  renderRecommendations(recipe);

  // Setup comments system
  setupComments(recipe.id);

  // Setup sharing buttons
  setupShareButtons(recipe.title);
}

// Render recommendations grid
function renderRecommendations(currentRecipe) {
  const recommendedGrid = document.getElementById("recommended-grid");
  if (!recommendedGrid) return;

  // Filter out current recipe
  let candidates = recipes.filter(r => r.id !== currentRecipe.id);

  // Sort candidates: prioritize same subcategory, then same category, then by views descending
  candidates.sort((a, b) => {
    const aSameSub = a.subcategory === currentRecipe.subcategory ? 1 : 0;
    const bSameSub = b.subcategory === currentRecipe.subcategory ? 1 : 0;
    if (aSameSub !== bSameSub) {
      return bSameSub - aSameSub; // prioritize same subcategory
    }
    const aSameCat = a.category === currentRecipe.category ? 1 : 0;
    const bSameCat = b.category === currentRecipe.category ? 1 : 0;
    if (aSameCat !== bSameCat) {
      return bSameCat - aSameCat; // prioritize same category
    }
    return b.views - a.views; // fallback to views descending
  });

  // Select top 3
  const recommendations = candidates.slice(0, 3);

  // Render them in the grid
  recommendedGrid.innerHTML = "";
  recommendations.forEach(recipe => {
    const card = document.createElement("a");
    card.href = `${recipe.id}.html`;
    card.target = "_blank";
    card.className = "recipe-card";
    card.setAttribute("aria-label", recipe.title);
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${recipe.image}" alt="${recipe.title} - ${recipe.summary}" class="card-img" loading="lazy">
        <span class="card-tag">${recipe.tag}</span>
        <span class="card-views-badge">
          <svg class="card-views-icon" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          ${formatViews(recipe.views / 10)}
        </span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${recipe.title}</h3>
        <p class="card-summary">${recipe.summary}</p>
        <div class="card-metrics">
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot eco"></span>${UI_STRINGS[currentLang].saving}</span>
            <div class="metric-track"><div class="metric-fill eco" style="width: ${recipe.metrics.economy}%"></div></div>
            <span class="metric-val">${recipe.metrics.economy}%</span>
          </div>
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot health"></span>${UI_STRINGS[currentLang].health}</span>
            <div class="metric-track"><div class="metric-fill health" style="width: ${recipe.metrics.health}%"></div></div>
            <span class="metric-val">${recipe.metrics.health}%</span>
          </div>
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot ecosys"></span>${UI_STRINGS[currentLang].ecosystem}</span>
            <div class="metric-track"><div class="metric-fill ecosys" style="width: ${recipe.metrics.ecosystem}%"></div></div>
            <span class="metric-val">${recipe.metrics.ecosystem}%</span>
          </div>
        </div>
      </div>
      
      <!-- Hover Preview Panel (Whole Card Overlay) -->
      <div class="card-hover-preview">
        <p class="hover-preview-recipe-title" aria-hidden="true">${recipe.title}</p>
        <span class="hover-preview-title">${UI_STRINGS[currentLang].bodyBenefit}</span>
        <p class="hover-preview-text">${recipe.healthBenefit.split('.')[0] + '.'}</p>
        <span class="hover-preview-title">${UI_STRINGS[currentLang].keyIngredients}</span>
        <ul class="hover-ingredients-list">
          ${recipe.shoppingList.slice(0, 3).map(item => `
            <li class="hover-ingredient-item">
              <span class="hover-ingredient-bullet">✦</span>
              <span>${item.name.split(' (')[0]}</span>
            </li>
          `).join("")}
        </ul>
        <span class="hover-cta-text">
          ${UI_STRINGS[currentLang].viewGuide}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </span>
      </div>
    `;
    recommendedGrid.appendChild(card);
  });
}

// Setup Event Listeners
function setupListeners() {
  const navLinks = document.querySelectorAll(".nav-links a");
  
  // Search input change event
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderGrid(recipes);
    });
  }

  // Sorting filter buttons
  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeSort = btn.getAttribute("data-sort");
      renderGrid(recipes);
    });
  });

  // Navigation tab filter links
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("id");
      if (id === "nav-about") return; // Let it navigate naturally to quienes-somos.html

      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      if (id === "nav-all") {
        activeCategory = "all";
      } else {
        activeCategory = id.replace("nav-", "");
      }
      
      // Reset subcategory selection on main category click
      activeSubcategory = "all";
      updateURLParams();
      renderSubcategories();
      renderGrid(recipes);
    });
  });
}

// Pre-populated default comments for premium experience
const defaultComments = {
  "estufa-velas": [
    {
      author: "María González",
      date: "01/06/2026",
      rating: 5,
      text: "¡Funciona increíblemente bien! La puse en mi pequeño estudio y en un par de horas la temperatura subió casi 3 grados. El calor que irradia es muy agradable y no reseca nada.",
      image: ""
    },
    {
      author: "Carlos Ruiz",
      date: "28/05/2026",
      rating: 4,
      text: "Una idea genial. Recomiendo usar varilla de buen grosor para que retenga más calor. Muy fácil de montar con las instrucciones paso a paso.",
      image: ""
    }
  ],
  "detergente-hiedra": [
    {
      author: "Laura Morales",
      date: "30/05/2026",
      rating: 5,
      text: "He probado la receta este fin de semana y la ropa de deporte ha quedado impecable. El toque de lavanda le da una frescura genial y natural.",
      image: ""
    }
  ],
  "pasta-dientes": [
    {
      author: "Alberto Soler",
      date: "02/06/2026",
      rating: 5,
      text: "Al principio la textura de arcilla es extraña si estás acostumbrado a las pastas comerciales espumosas, pero la sensación de limpieza después del cepillado es inigualable. Noto los dientes mucho menos sensibles.",
      image: ""
    }
  ]
};

// Setup comments feature on article page
function setupComments(articleId) {
  const commentsList = document.getElementById("comments-list");
  const commentForm = document.getElementById("comment-form");
  if (!commentsList || !commentForm) return;

  // Star rating logic
  const stars = document.querySelectorAll("#star-rating .star");
  const ratingInput = document.getElementById("comment-rating-value");
  
  stars.forEach(star => {
    // Hover effect
    star.addEventListener("mouseover", () => {
      const val = parseInt(star.getAttribute("data-value"));
      stars.forEach(s => {
        if (parseInt(s.getAttribute("data-value")) <= val) {
          s.classList.add("hover");
        } else {
          s.classList.remove("hover");
        }
      });
    });
    
    star.addEventListener("mouseout", () => {
      stars.forEach(s => s.classList.remove("hover"));
    });
    
    // Click selection
    star.addEventListener("click", () => {
      const val = parseInt(star.getAttribute("data-value"));
      ratingInput.value = val;
      stars.forEach(s => {
        if (parseInt(s.getAttribute("data-value")) <= val) {
          s.classList.add("selected");
        } else {
          s.classList.remove("selected");
        }
      });
    });
  });

  // Image upload logic (Base64 preview and removal)
  const fileInput = document.getElementById("comment-image");
  const previewContainer = document.getElementById("image-preview-container");
  const previewImg = document.getElementById("image-preview");
  const btnRemoveImg = document.getElementById("btn-remove-image");
  let base64ImageStr = "";

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Por favor, selecciona una foto de menos de 1.5MB.");
        fileInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        base64ImageStr = event.target.result;
        previewImg.src = base64ImageStr;
        previewContainer.style.display = "inline-block";
      };
      reader.readAsDataURL(file);
    }
  });

  btnRemoveImg.addEventListener("click", () => {
    fileInput.value = "";
    base64ImageStr = "";
    previewContainer.style.display = "none";
    previewImg.src = "";
  });

  // Load and Render Comments function
  function loadAndRender() {
    let list = [];
    const storageKey = `comments_${articleId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      list = JSON.parse(stored);
      // Data migration to ensure ID and vote counters exist
      let modified = false;
      list.forEach((c, idx) => {
        if (!c.id) {
          c.id = `c-${articleId}-${idx}-${c.date.replace(/\//g, "-")}`;
          modified = true;
        }
        if (c.upvotes === undefined) {
          c.upvotes = 0;
          modified = true;
        }
        if (c.downvotes === undefined) {
          c.downvotes = 0;
          modified = true;
        }
      });
      if (modified) {
        localStorage.setItem(storageKey, JSON.stringify(list));
      }
    } else {
      // Use defaults if available
      list = defaultComments[articleId] || [];
      // Initialize defaults with ID and vote counters
      list.forEach((c, idx) => {
        c.id = `c-${articleId}-${idx}`;
        c.upvotes = Math.floor(Math.random() * 4); // small seed upvotes
        c.downvotes = 0;
      });
      localStorage.setItem(storageKey, JSON.stringify(list));
    }

    commentsList.innerHTML = "";
    
    if (list.length === 0) {
      commentsList.innerHTML = `
        <div class="empty-state" style="padding: 1.5rem 0; text-align: center; color: var(--color-text-muted);">
          <p>Aún no hay comentarios para esta receta. ¡Sé el primero en compartir tu experiencia!</p>
        </div>
      `;
      return;
    }

    const votedMap = JSON.parse(localStorage.getItem("comments_voted") || "{}");

    list.forEach(c => {
      const card = document.createElement("div");
      card.className = "comment-card";
      
      const starsHtml = "&#9733;".repeat(c.rating) + "&#9734;".repeat(5 - c.rating);
      const avatarChar = c.author.charAt(0).toUpperCase();
      const userVote = votedMap[c.id]; // "up", "down", or undefined

      card.innerHTML = `
        <div class="comment-header">
          <div class="comment-author-info">
            <div class="comment-avatar">${avatarChar}</div>
            <div>
              <span class="comment-author-name">${c.author}</span>
              <div class="comment-date">${c.date}</div>
            </div>
          </div>
          <div class="comment-rating-display" aria-label="Valoración de ${c.rating} estrellas">${starsHtml}</div>
        </div>
        <p class="comment-text-content">${c.text}</p>
        ${c.image ? `<img src="${c.image}" alt="Foto adjuntada por ${c.author}" class="comment-attached-image">` : ""}
        
        <div class="comment-footer">
          <div class="comment-vote-panel">
            <button class="btn-comment-vote up ${userVote === 'up' ? 'voted-up' : ''}" data-type="up" ${userVote ? 'disabled' : ''}>
              <svg viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>${c.upvotes || 0}</span>
            </button>
            <button class="btn-comment-vote down ${userVote === 'down' ? 'voted-down' : ''}" data-type="down" ${userVote ? 'disabled' : ''}>
              <svg viewBox="0 0 24 24" style="transform: rotate(180deg);">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>${c.downvotes || 0}</span>
            </button>
          </div>
        </div>
      `;
      
      // Attach voting listeners
      const upBtn = card.querySelector(".btn-comment-vote.up");
      const downBtn = card.querySelector(".btn-comment-vote.down");
      if (upBtn && downBtn) {
        upBtn.addEventListener("click", () => handleCommentVote(c.id, "up"));
        downBtn.addEventListener("click", () => handleCommentVote(c.id, "down"));
      }

      commentsList.appendChild(card);
    });
  }

  // Handle comment vote
  function handleCommentVote(commentId, voteType) {
    const votedMap = JSON.parse(localStorage.getItem("comments_voted") || "{}");
    if (votedMap[commentId]) return;

    const storageKey = `comments_${articleId}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;

    let list = JSON.parse(stored);
    const index = list.findIndex(c => c.id === commentId);
    if (index !== -1) {
      if (voteType === "up") {
        list[index].upvotes = (list[index].upvotes || 0) + 1;
      } else {
        list[index].downvotes = (list[index].downvotes || 0) + 1;
      }
      localStorage.setItem(storageKey, JSON.stringify(list));
      votedMap[commentId] = voteType;
      localStorage.setItem("comments_voted", JSON.stringify(votedMap));
      loadAndRender();
    }
  }

  // Handle submit form
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const author = document.getElementById("comment-author").value.trim();
    const text = document.getElementById("comment-text").value.trim();
    const rating = parseInt(ratingInput.value) || 5;
    
    if (!author || !text) return;

    const newComment = {
      id: `c-${articleId}-${Date.now()}`,
      author: author,
      date: new Date().toLocaleDateString("es-ES"),
      rating: rating,
      text: text,
      image: base64ImageStr,
      upvotes: 0,
      downvotes: 0
    };

    const storageKey = `comments_${articleId}`;
    const stored = localStorage.getItem(storageKey);
    
    let list = [];
    if (stored) {
      list = JSON.parse(stored);
    } else {
      list = defaultComments[articleId] || [];
      // Make sure existing defaults have IDs
      list.forEach((c, idx) => {
        if (!c.id) {
          c.id = `c-${articleId}-${idx}`;
          c.upvotes = c.upvotes || 0;
          c.downvotes = c.downvotes || 0;
        }
      });
    }
    
    list.push(newComment);
    localStorage.setItem(storageKey, JSON.stringify(list));

    // Clear form inputs
    commentForm.reset();
    fileInput.value = "";
    base64ImageStr = "";
    previewContainer.style.display = "none";
    previewImg.src = "";
    
    // Reset rating stars to 5 selected
    ratingInput.value = 5;
    stars.forEach(s => s.classList.add("selected"));

    // Reload
    loadAndRender();
  });

  // Initial load
  loadAndRender();
}

// Setup social media sharing links
function setupShareButtons(recipeTitle) {
  const shareWa = document.getElementById("share-wa");
  const sharePin = document.getElementById("share-pin");
  const shareFb = document.getElementById("share-fb");
  
  if (!shareWa && !sharePin && !shareFb) return;
  
  const currentUrl = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Mira esta receta tradicional de abuela: ${recipeTitle}`);
  
  if (shareWa) {
    shareWa.href = `https://api.whatsapp.com/send?text=${text}%20${currentUrl}`;
    shareWa.target = "_blank";
  }
  if (sharePin) {
    sharePin.href = `https://pinterest.com/pin/create/button/?url=${currentUrl}&description=${text}`;
    sharePin.target = "_blank";
  }
  if (shareFb) {
    shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    shareFb.target = "_blank";
  }
}
